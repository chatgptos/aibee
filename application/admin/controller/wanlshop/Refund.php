<?php

namespace app\admin\controller\wanlshop;

use app\common\controller\Backend;
use think\Db;
use Exception;
/**
 * 订单退款管理
 *
 * @icon fa fa-circle-o
 */
class Refund extends Backend
{
    
    /**
     * Refund模型对象
     * @var \app\admin\model\wanlshop\Refund
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\wanlshop\Refund;
        $this->view->assign("expresstypeList", $this->model->getExpresstypeList());
        $this->view->assign("typeList", $this->model->getTypeList());
        $this->view->assign("reasonList", $this->model->getReasonList());
        $this->view->assign("stateList", $this->model->getStateList());
        $this->view->assign("statusList", $this->model->getStatusList());
    }

    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->with(['user','order','pay','shop','goods'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['user','order','pay','shop','goods'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
				$row->getRelation('goods')->visible(['title','image']);
                $row->getRelation('user')->visible(['id']);
                $row->getRelation('order')->visible(['id']);
				$row->getRelation('pay')->visible(['pay_no']);
				$row->getRelation('shop')->visible(['shopname']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }
	
	/**
	 * 退款详情
	 */
	public function detail($ids = null)
	{
	    $row = $this->model->get($ids);
	    if (!$row) {
	        $this->error(__('No Results were found'));
	    }
		$row['images'] = explode(',', $row['images']);
		$row['ordergoods'] = model('app\admin\model\wanlshop\OrderGoods')
			->where('id', 'in', $row['goods_ids'])
			// ->field('id,user_id,shopname,avatar,state,level,city,like,createtime')
			->select();
		$row['log'] = model('app\admin\model\wanlshop\RefundLog')
			->where(['refund_id' => $ids])
			->order('createtime desc')
			->select();
	    $this->view->assign("row", $row);
		return $this->view->fetch();
	}
	
	/**
	 * 同意退款
	 */
	public function agree($ids = null)
	{
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		if ($row['state'] != 3) {
			$this->error(__('当前状态，不可操作'));
		}
		// 判断金额
		if(number_format($row['price'], 2) > number_format($row->pay->price, 2)){
			$this->error(__('非法退款金额，金额超过订单金额！！'));
		}
		$result = false;
		Db::startTrans();
		try {
			// 判断退款类型
			if($row['type'] == 0){
				// 退款完成
				$state = 4;
				$orderGoodsState = 3;
				// 返还资金，并写入日志，未收货前资金等于冻结在平台无需处理卖家资金流向
				controller('addons\wanlshop\library\WanlPay\WanlPay')->money(+$row['price'], $row['user_id'], '客户同意退款', 'refund', $row['order_no']);
			}else if($row['type'] == 1){
				// 先同意退款，还需要买家继续退货
				$state = 1;
				$orderGoodsState = 2;
			}else{
				$this->error(__('非法退款类型'));
			}
			
			// 写入日志
			$this->refundLog($row['user_id'], $row['id'], '平台判定卖家需配合买家完成退货');
			// 更新商品状态
			$this->setOrderGoodsState($orderGoodsState, $row['goods_ids']);
			// 更新订单状态
			$this->setRefundState($row['order_id']);
			// 更新退款
			$result = $row->allowField(true)->save(['state' => $state]);
			
		    Db::commit();
		} catch (ValidateException $e) {
		    Db::rollback();
		    $this->error($e->getMessage());
		} catch (PDOException $e) {
		    Db::rollback();
		    $this->error($e->getMessage());
		} catch (Exception $e) {
		    Db::rollback();
		    $this->error($e->getMessage());
		}
		if ($result !== false) {
		    $this->success();
		} else {
		    $this->error(__('No rows were updated'));
		}
	}
	
	/**
	 * 平台判定拒绝退款
	 */
	public function refuse($ids = null)
	{
		$row = $this->model->get($ids);
		if (!$row) {
		    $this->error(__('No Results were found'));
		}
		if ($row['state'] != 3) {
			$this->error(__('当前状态，不可操作'));
		}
		if ($this->request->isPost()) {
		    $params = $this->request->post("row/a");
		    if ($params) {
		        $result = false;
		        Db::startTrans();
		        try {
					
					// 写入日志
					$this->refundLog($row['user_id'], $row['id'], '客服判定：'.$params['refund_content']);
					// 更新商品状态
					$this->setOrderGoodsState(4, $row['goods_ids']);
					// 更新订单状态
					$this->setRefundState($row['order_id']);
					// 更新退款
					$result = $row->allowField(true)->save(['state' => 5]);
					
		            Db::commit();
		        } catch (ValidateException $e) {
		            Db::rollback();
		            $this->error($e->getMessage());
		        } catch (PDOException $e) {
		            Db::rollback();
		            $this->error($e->getMessage());
		        } catch (Exception $e) {
		            Db::rollback();
		            $this->error($e->getMessage());
		        }
		        if ($result !== false) {
		            $this->success();
		        } else {
		            $this->error(__('No rows were updated'));
		        }
		    }
		    $this->error(__('Parameter %s can not be empty', ''));
		}
		$this->view->assign("row", $row);
		return $this->view->fetch();
	}
	
	/**
	 * 更新订单商品状态（方法内使用）1.0.5升级
	 *
	 * @ApiSummary  (WanlShop 更新订单商品状态)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $status 状态
	 * @param string $goods_id 商品ID
	 */
	private function setOrderGoodsState($status = 0, $goods_id = 0)
	{
		return model('app\admin\model\wanlshop\OrderGoods')
			->save(['refund_status' => $status],['id' => $goods_id]);
	}
	
	/**
	 * 修改订单状态（方法内使用） 1.0.5升级
	 *
	 * @ApiSummary  (WanlShop 修改订单状态)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $id 订单ID
	 */
	private function setRefundState($order_id = 0)
	{
		$list = model('app\admin\model\wanlshop\OrderGoods')
			->where(['order_id' => $order_id])
			->select();
		$refundStatusCount = 0;
		foreach($list as $row){
			// 退款状态:0=未退款,1=退款中,2=待退货,3=退款完成,4=退款关闭,5=退款被拒
			if($row['refund_status'] == 3) $refundStatusCount += 1;
		}
		// 订单状态:1=待支付,2=待发货,3=待收货,4=待评论,5=售后订单(已弃用),6=已完成,7=已取消 1.0.5升级
		// 如果订单下所有商品全部退款完毕则关闭订单
		if(count($list) == $refundStatusCount){
			model('app\admin\model\wanlshop\Order')->save(['state'  => 7],['id' => $order_id]);
			return true;
		}
		return false;
	}
	
	/**
	 * 退款日志（方法内使用）
	 *
	 * @ApiSummary  (WanlShop 退款日志)
	 * @ApiMethod   (POST)
	 * 
	 * @param string $user_id 用户ID
	 * @param string $refund_id 退款ID
	 * @param string $content 日志内容
	 */
	private function refundLog($user_id = 0, $refund_id = 0, $content = '')
	{
		return model('app\admin\model\wanlshop\RefundLog')->allowField(true)->save([
			'user_id' => $user_id,
			'refund_id' => $refund_id,
			'type' => 2,
			'content' => $content
		]);
	}
}
