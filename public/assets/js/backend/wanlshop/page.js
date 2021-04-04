define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'upload', 'vue', 'vuedraggable'], function ($, undefined, Backend, Table, Form, Upload, Vue, wanldraggable) {
	var Controller = {
		index: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'wanlshop/page/index' + location.search,
		            add_url: '',
		            edit_url: 'wanlshop/page/edit',
		            del_url: 'wanlshop/page/del',
		            multi_url: '',
		            table: 'wanlshop_page',
		        }
		    });
			Fast.config.openArea = ['90%', '90%'];
		    var table = $("#table");
		
		    // 初始化表格
		    table.bootstrapTable({
		        url: $.fn.bootstrapTable.defaults.extend.index_url,
		        pk: 'id',
		        sortName: 'id',
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
						{field: 'page_token', title: __('Token')},
		                {field: 'name', title: __('Name')},
						{field: 'shop_id', title: __('Shop_id')},
						{field: 'type', title: __('Type'), searchList: {"page":__('Page'),"shop":__('Shop'),"index":__('Index')}, formatter: Table.api.formatter.normal},
		                {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
		                {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
		            ]
		        ]
		    });
		
		    // 为表格绑定事件
		    Table.api.bindevent(table);
			// 新建页面
			$(document).on("click", ".btn-addnew", function () {
			    Backend.api.open('wanlshop/page/add/', __('新建页面'), {area:['800px', '400px']});
			});
		},
		recyclebin: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            'dragsort_url': ''
		        }
		    });
		
		    var table = $("#table");
		
		    // 初始化表格
		    table.bootstrapTable({
		        url: 'wanlshop/page/recyclebin' + location.search,
		        pk: 'id',
		        sortName: 'id',
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
						{field: 'type', title: __('Type'), align: 'left', searchList: {"page":__('Page'),"shop":__('Shop'),"index":__('Index')}, formatter: Table.api.formatter.normal},
						{field: 'shop_id', title: __('Shop_id'), align: 'left'},
						{field: 'name', title: __('Name'), align: 'left'},
						{field: 'page_token', title: __('Token'), align: 'left'},
		                {
		                    field: 'deletetime',
		                    title: __('Deletetime'),
		                    operate: 'RANGE',
		                    addclass: 'datetimerange',
		                    formatter: Table.api.formatter.datetime
		                },
		                {
		                    field: 'operate',
		                    width: '130px',
		                    title: __('Operate'),
		                    table: table,
		                    events: Table.api.events.operate,
		                    buttons: [
								{
									name: 'Restore',
									text: __('Restore'),
									classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
									icon: 'fa fa-rotate-left',
									url: 'wanlshop/page/restore',
									refresh: true
								},
								{
									name: 'Destroy',
									text: __('Destroy'),
									classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
									icon: 'fa fa-times',
									url: 'wanlshop/page/destroy',
									refresh: true
								}
		                    ],
		                    formatter: Table.api.formatter.operate
		                }
		            ]
		        ]
		    });
		    // 为表格绑定事件
		    Table.api.bindevent(table);
			
		},
		add: function () {
		    Controller.api.bindevent();
		},
		edit: function() {
			var vm = new Vue({
				el: '#app',
				components: {
					wanldraggable
				},
				data() {
					return {
						// 组件样式
						moduleStyle: {
							"height": {"name": "高度（px）","default": "100px"},
							"width": {"name": "宽度（%）","default": "100%"},
							"background-image": {"name": "背景图片（绝对路径）",
							"default": "url(..图片地址..)"},
							"background-color": {"name": "背景颜色（HEX）","default": "#ffffff"},
							"background-repeat": {"name": "背景重复方式","default": ""},
							"color": {"name": "字体颜色","default": "#333333"},
							"font-size": {"name": "字体大小（px）","default": "12px"},
							"text-align": {"name": "对齐方式","default": "inherit"},
							"line-height": {"name": "段落高度（px）","default": ""},
							"border": {"name": "边框","default": "1px solid #000000"},
							"border-bottom": {"name": "下边框","default": "1px solid #000000"},
							"border-left": {"name": "左边框","default": "1px solid #000000"},
							"border-right": {"name": "右边框","default": "1px solid #000000"},
							"border-top": {"name": "上边框","default": "1px solid #000000"},
							"border-radius": {"name": "圆角（px）","default": "10px"},
							"margin": {"name": "外边距","default": "25px"},
							"margin-bottom": {"name": "下外边（px）","default": "25px"},
							"margin-right": {"name": "右外边（px）","default": "25px"},
							"margin-left": {"name": "左外边（px）","default": "25px"},
							"margin-top": {"name": "上外边（px）","default": "25px"},
							"padding": {"name": "内边距","default": "25px"},
							"padding-bottom": {"name": "下内边（px）","default": "25px"},
							"padding-left": {"name": "左内边（px）","default": "25px"},
							"padding-right": {"name": "右内边（px）","default": "25px"},
							"padding-top": {"name": "上内边（px）","default": "25px"}
						},
						//插件数据
						module: {
							"Basics": [{
									"name": "轮播组件",
									"type": "banner",
									"style": {
										"color": "#000000"
									},
									"params": {
										"interval": "2800",
										"banstyle": "圆形"
									},
									"data": [{
										"image": "/assets/addons/wanlshop/img/page/banner-default.png",
										"tips": "尽量使用高像素素材，否则可能出现虚化",
										"link": ""
									}]
								},
								{
									"name": "图片组件",
									"type": "image",
									"style": {
										"height":"100px",
										"width":"100%"
									},
									"data": [{
										"image": "/assets/addons/wanlshop/img/page/image-default.png",
										"tips": "尽量使用高像素素材，否则可能出现虚化",
										"link": ""
									}]
								},
								{
									"name": "视频组件",
									"type": "video",
									"style": {},
									"data": [{
										"image": "/assets/addons/wanlshop/img/page/video-default.png",
										"video": ""
									}]
								},
								{
									"name": "菜单组件",
									"type": "menu",
									"params": {
										"colfive": "5",
										"menuMarginTop": "12.5px",
										"menuMarginBottom": "5px",
										"menuHeightWidth": "45px",
										"menuIconSize": "28px",
										"menuTextSize": "12px"
									},
									"style": {
										"color": "#333333",
										"padding-bottom": "12.5px"
									},
									"data": [{
										"text": "菜单一",
										"icon": "wlIcon-leimu",
										"iconClass": "wanl-text-white",
										"bgClass": "wanl-bg-redorange",
										"link": ""
									}]
								},
								{
									"name": "公告栏",
									"type": "notice",
									"params": {
										"show": true
									},
									"style": {
										"background-color": "#fffbe8",
										"color": "#de8f1c",
										"padding": "2px 12.5px"
									},
									"data": [{
										"content": "公告内容",
										"link": ""
									}]
								},
								{
									"name": "文章组件",
									"type": "article",
									"params": {
										"showTime": true,
										"showView": true
									},
									"style": {
										"padding": "12.5px 12.5px",
										"background-color": "#ffffff"
									},
									"data": [{
										"image": "/assets/addons/wanlshop/img/page/article-default.png",
										"tips": "建议尺寸750x360",
										"articleLink": ""
									}]
								},
								{
									"name": "头条组件",
									"type": "headlines",
									"style": {
										"background-color": "#ffffff",
										"border-radius": "8px",
										"margin": "12.5px"
									},
									"data": [{
										"image": "/assets/addons/wanlshop/img/page/article-default.png",
										"tips": "右侧图片，建议尺寸200x200",
										"link": "",
										"title": "温馨提示：三面三项为右侧广告位配置，新闻根据后台自动获取"
									}]
								},
								{
									"name": "搜索栏",
									"type": "search",
									"params": {
										"searchRadius": "2000px",
										"searchBackground": "#eee",
										"searchPadding": "6px 15px"
									},
									"style": {
										"padding": "12.5px"
									},
									"data": [{
										"content": "关键字请用空格 隔开"
									}]
								}
							],
							"Advert":[{
									"name": "轮播组件",
									"type": "advertBanner",
									"style": {
										"color": "#000000"
									},
									"params": {
										"interval": "2800",
										"banstyle": "圆形"
									},
									"data": [{
										"title": "系统自动获取-广告管理-【自定义页面广告】-轮播图"
									}]
								},
								{
									"name": "图片组件",
									"type": "advertImage",
									"style": {
										"height": "100px",
										"width": "100%"
									},
									"data": [{
										"advertLink": ""
									}]
								}],
							"Shop": [{
									"name": "活动橱窗",
									"type": "activity",
									"style": {
										"background-color": "#ffffff",
										"border-radius": "10px",
										"margin": "12.5px"
									},
									"data": [{
										"activity": "rush",
										"textColor" : "wanl-pip",
										"describe": "30天包退 365天包换",
										"tags": "新品尝鲜",
										"title": "自动获取商品"
									}]
								},
								{
									"name": "类目标题",
									"type": "categoryTitle",
									"style": {
										"margin": "12.5px",
										"color": "#ffffff"
									},
									"data": [{
										"categoryName": "默认名",
										"icon": "wlIcon-huomiao2",
										"categoryLink": ""
									}]
								},
								{
									"name": "分类橱窗",
									"type": "classify",
									"style": {
										"background-color": "#ffffff",
										"border-radius": "10px",
										"margin": "12.5px"
									},
									"params": {
										"colStyle": "col-2-2-4"
									},
									"data": [{
										"categoryId": 1,
										"textColor" : "wanl-pip",
										"describe": "30天包退 365天包换",
										"tags": "新品尝鲜"
									}]
								},
								{
									"name": "猜你喜欢",
									"type": "likes",
									"style": {
										"background-color": "#f5f5f5"
									},
									"params": {
										"colthree": "2",
										"colmargin": "25"
									},
									"data": [{
										"title": "自动获取系统猜你喜欢数据"
									}]
								},
								{
									"name": "商品组件",
									"type": "goods",
									"style": {
										"background-color": "#f5f5f5"
									},
									"params": {
										"colthree": "2",
										"colmargin": "25"
									},
									"data": [{
										"goodsLink": 1
									}]
								},
								{
									"name": "砍价组件",
									"type": "bargain",
									"style": {
										"text-align": "center",
										"font-size": "14px",
										"color": "#e0e0e0"
									},
									"data": [{
										"title": "砍价组件下个版本发布，敬请期待"
									}]
								},
								{
									"name": "秒杀组件",
									"type": "seckill",
									"style": {
										"text-align": "center",
										"font-size": "14px",
										"color": "#e0e0e0"
									},
									"data": [{
										"title": "秒杀组件下个版本发布，敬请期待"
									}]
								}
							],
							"Tool": [{
									"name": "空白行",
									"type": "empty",
									"style": {
										"height": "25px"
									},
									"data": []
								},
								{
									"name": "分隔符",
									"type": "division",
									"style": {
										"width": "100%",
										"padding": "12.5px"
									},
									"params": {
										"lineWidth": "60%",
										"lineHeight": "1px",
										"lineBackground": "#bababa",
										"lineText": "文字内容",
										"lineTextColor": "#333333",
										"lineTextSize": "14px",
										"lineTextBackground": "#ffffff",
										"lineTextPadding": "0 9px"
									}
								}
							]
						},
						//整体数据
						pageData: Config.page,
						pageRecover: Config.pageRecover,
						pageCategory: Config.pageCategory,
						type: 'page', //选中
						device: 'iPhoneX', //设备
						nowTime: '11:11', //时间
						signal: 'WIFI', //信号
						moveDom: '',
						changeDom: '',
						startY: 0,
						endY: 0

					}
				},
				created() {
					this.nowTimes();
				},
				mounted() {
					this.nowTimes();
				},
				filters: {
					formatDate(timestamp) {
						var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
						var Y = date.getFullYear() + '-';
						var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
						var D = date.getDate() + ' ';
						var h = date.getHours() + ':';
						var m = date.getMinutes() + ':';
						var s = date.getSeconds();
						return Y + M + D + h + m + s;
					}
				},
				methods: {
					// 保存数据后,拉取最新回收站记录
					publish() {
						let _this = this;
						Fast.api.ajax({
							url: "wanlshop/page/edit",
							data: this.pageData,
						}, function(data, ret){
							_this.pageRecover = data;
							//刷新父级页面
							parent.$("a.btn-refresh").trigger("click");
						});
					},
					// 恢复历史记录
					recover(id) {
						let _this = this;
						Fast.api.ajax({
						    url: "wanlshop/page/recover", 
						    data: {"id":id}
						}, function(data, ret){
							_this.pageData = data;
						});
					},
					onType(e) {
						this.type = e;
					},
					addData(key, arr) {
						Vue.set(vm.pageData.item[key].data, vm.pageData.item[key].data.length, JSON.parse(JSON.stringify(arr)));
					},
					delData(key, num) {
						if (vm.pageData.item[key].data.length == 1) {
							Toastr.warning("不能再删了，至少剩一个");
						} else {
							Vue.delete(vm.pageData.item[key].data, num); //vue方法
						}
					},
					addStyle(key, type, text) {
						Vue.set(vm.pageData.item[key].style, type, text);
					},
					delStyle(key, type) {
						Vue.delete(vm.pageData.item[key].style, type); //vue方法
					},
					delModule(key) {
						Vue.delete(vm.pageData.item, key); //vue方法
						this.type = this.type - 1;
					},
					onDevice(e) {
						this.device = e;
					},
					onSignal(e) {
						this.signal = e;
					},
					addTemplate(arr) {
						this.type = this.pageData.item.length;
						Vue.set(this.pageData.item, this.pageData.item.length, JSON.parse(JSON.stringify(arr))); //数据 追加
					},
					// 页面上传图片
					changeImage(event, key){
						let files = event.target.files[0];
						let formData = new FormData();
						formData.append('file', files, files.name);
						Fast.api.ajax({
						    url: "ajax/upload", 
							data:formData,
							processData:false,
							contentType:false,
						}, function(data, ret){
							Vue.set(vm.pageData.page.style, key, data.fullurl);
						});
					},
					// 数据上传图片
					dataUpload(event, key, num, type) {
						let files = event.target.files[0]; //获取input的图片file值
						let formData = new FormData();
						formData.append('file', files, files.name);
						Fast.api.ajax({
						    url: "ajax/upload", 
							data:formData,
							processData:false,
							contentType:false,
						}, function(data, ret){
							Vue.set(vm.pageData.item[key].data[num], type, data.fullurl);
						});
					},
					// 选择链接
					obtainLink(key, num, type, multiple){
						parent.Fast.api.open("wanlshop/link/select?multiple=" + multiple, __('选择链接'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								console.log(data);
								Vue.set(vm.pageData.item[key].data[num], type, data.url);	
						    }
						});
					},
					// 选择媒体
					attachmentLink(key, num, type, multiple){
						parent.Fast.api.open("general/attachment/select?mimetype=video/*&multiple=" + multiple, __('选择链接'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								console.log(data);
								Vue.set(vm.pageData.item[key].data[num], type, data.url);	
						    }
						});
					},
					// 类目链接
					categoryLink(key, num, multiple){
						parent.Fast.api.open("wanlshop/category/select?multiple=" + multiple, __('选择类目链接'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								Vue.set(vm.pageData.item[key].data[num], 'categoryLink', data.url);
								Vue.set(vm.pageData.item[key].data[num], 'categoryName', data.name);	
						    }
						});
					},
					// 商品链接
					goodsLink(key, num, type, multiple){
						parent.Fast.api.open("wanlshop/goods/select?multiple=" + multiple, __('选择商品链接'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								Vue.set(vm.pageData.item[key].data[num], type, data.url);	
						    }
						});
					},
					// 广告链接
					advertLink(key, num, type, multiple){
						parent.Fast.api.open("wanlshop/advert/select?multiple=" + multiple, __('选择展示广告'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								Vue.set(vm.pageData.item[key].data[num], type, data.id);	
						    }
						});
					},
					// 文章链接
					articleLink(key, num, type, multiple){
						parent.Fast.api.open("wanlshop/article/select?multiple=" + multiple, __('选择文章'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								Vue.set(vm.pageData.item[key].data[num], type, data.id);	
								Vue.set(vm.pageData.item[key].data[num], 'articleTitle', data.title);
						    }
						});
					},
					// 选择图标
					iconLink(key, num, type, multiple){
						parent.Fast.api.open("wanlshop/icon/select?multiple=" + multiple, __('选择图标'), {
							area: ['800px', '600px'],
						    callback: function (data) {
								Vue.set(vm.pageData.item[key].data[num], type, data.name);	
						    }
						});
					},
					// 获取当前时间函数
					timeFormate(timeStamp) {
						let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
						let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(
							timeStamp).getMinutes();
						this.nowTime = hh + ":" + mm;
					},
					// 定时器函数
					nowTimes() {
						this.timeFormate(new Date());
						setInterval(this.nowTimes, 50 * 1000);
					},
					cdnurl(url){
						if(url) return Fast.api.cdnurl(url);
					},
					mergeSpace(str){
						str=str.replace(/(\s|&nbsp;)+/g,'');
						return str;
					},
					categoryName(id){
						let category = this.pageCategory,categoryData = category[category.map((item) => item.id).indexOf(parseInt(id))];
						if(categoryData){
							return categoryData.name;
						}
					},
					getListNum(style, key){
						var list = {
							'col-1-2-2': [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-1-1_2': [3,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-2-1_2': [2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-2-2_1': [2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-2-2-1_2': [2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-2-4': [2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
							'col-2-2-4': [2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2]
						};
						return list[style][key];
					},
					getParameter(name) {
						var language = {
							'Basics': '基础组件',
							'Shop': '商城组件',
							'Tool': '辅助组件',
							'Advert': '广告组件',
							'interval': '轮播速度（毫秒）',
							'menuMarginTop': '图标-上边距',
							'menuMarginBottom': '图标-下边距',
							'menuHeightWidth': '圆形大小',
							'menuIconSize': '图标大小',
							'menuTextSize': '文字大小',
							'searchPadding': '搜索文字边距',
							'lineWidth': '线段长度',
							'lineHeight': '线段高度',
							'lineText': '文字内容',
							'lineTextSize': '文字大小',
							'lineTextPadding': '文字外边距',
							'text': '名称',
							'describe': '描述',
							'tags': '标签',
							'distribution': '分销',
							'group': '团购拼团',
							'bargain': '砍价',
							'rush': '限时抢购',
							'coupon': '领券中心'
						};
						return language.hasOwnProperty(name)?language[name]:name;
					}
				}
			});
			
			
		},
		style: function () {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						couponList:[
							{
								id: '1',
								name: '一级类目 - 大图'
							},
							{
								id: '2',
								name: '一级类目 - 九宫格'
							},
							{
								id: '3',
								name: '二级类目'
							},
							{
								id: '4',
								name: '多级类目样式'
							}
						],
						couponSelected: Config.category_style
					}
				},
                methods:{
					getCouponSelected(){
                        //获取选中的风格
                        console.log(this.couponSelected)
                    }
                }
			});
		    Controller.api.bindevent();
		},
		api: {
		    bindevent: function () {
		        Form.api.bindevent($("form[role=form]"));
		    }
		}
	};
	return Controller;
});
