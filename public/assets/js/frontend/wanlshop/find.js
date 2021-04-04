define(['jquery', 'bootstrap', 'table', 'backend', 'form', 'vue'], function($, undefined, Table, Backend, Form, Vue) {
    var Controller = {
		index: function () {
		    // 初始化表格参数配置
		    Table.api.init({
		        extend: {
		            index_url: 'wanlshop/find/index' + location.search,
		            add_url: 'wanlshop/find/add',
		            edit_url: '',
		            del_url: 'wanlshop/find/del',
		            multi_url: '',
		            table: 'wanlshop_find',
		        }
		    });
		
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
						{field: 'type', title: __('Type'), searchList: {"new":__('Type new'),"live":__('Type live'),"want":__('Type want'),"activity":__('Type activity'),"show":__('Type show')}, formatter: Table.api.formatter.normal},
						{field: 'content', title: __('Content'), formatter: Controller.api.formatter.formatHtml},
						// {field: 'goods_ids', title: __('Goods_ids')},
						// {field: 'comments_id', title: __('Comments_id')},
						// {field: 'activity_id', title: __('Activity_id')},
						{field: 'images', title: __('Images'), events: Table.api.events.image, formatter: Table.api.formatter.images},
						{field: 'views', title: __('Views')},
						{field: 'like', title: __('Like')},
						{field: 'comments', title: __('Comments')},
		                {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
		                {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
		            ]
		        ]
		    });
		    // 为表格绑定事件
		    Table.api.bindevent(table);
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
                url: 'wanlshop/find/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
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
                                    url: 'wanlshop/find/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'wanlshop/find/destroy',
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
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						type: Config.type,
						isHead: Config.ishead,
						typeList:{
							new: '上新',
							live: '直播',
							want: '种草',
							activity: '活动',
							show: '买家秀'
						},
						imgList: [],
						goodsList: [],
						commentsData: null
					}
				},
				methods: {
					getTypeName(type){
						return this.typeList[type];
					},
					// 操作图片
					delImg(index){
						Vue.delete(vm.imgList, index); //vue方法
					},
					addImg(){
						parent.Fast.api.open("wanlshop/attachment/select?element_id=fachoose-image&multiple=true&mimetype=image/*", __('选择图片'), {
						    callback: (data) => {
								if(data.url){
									var image = data.url.split(",");
									if(image.length > 9){
										layer.msg('最多上传9张图片，超出自动删除');
									}
									this.imgList = image.slice(0,9);
								}
						    }
						});
					},
					// 操作商品
					delGoods(index){
						Vue.delete(vm.goodsList, index); //vue方法
					},
					addGoods(){
						parent.Fast.api.open("wanlshop/goods/select?multiple=true", __('选择商品'), {
						    callback: (data) => {
								this.goodsList = data.data;
						    }
						});
					},
					// 操作评论
					delComments(){
						this.commentsData = null;
					},
					addComments(){
						parent.Fast.api.open("wanlshop/comment/select?multiple=flase", __('选择评论'), {
						    callback: (data) => {
								this.commentsData = data.data;
						    }
						});
					},
					cdnurl(url){
						if(url) return Fast.api.cdnurl(url);
					}
				}
			});
        },
        api: {
			formatter: {
			    formatHtml: function (value, row, index) {
					var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
			        return value.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}).replace(/<\/?.+?>/g,"").replace(/ /g,"").substring(0,12) + '...';
			    }
			},
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});