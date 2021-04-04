define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function($, undefined, Backend, Table, Form, Vue) {
	var Controller = {
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
		        url: 'wanlshop/freight/recyclebin' + location.search,
		        pk: 'id',
		        sortName: 'id',
		        columns: [
		            [
		                {checkbox: true},
		                {field: 'id', title: __('Id')},
		                {field: 'name', title: __('Name'), align: 'left'},
		                {field: 'deletetime',title: __('Deletetime'),operate: 'RANGE',addclass: 'datetimerange',formatter: Table.api.formatter.datetime},
		                {field: 'operate',width: '130px',title: __('Operate'),table: table,events: Table.api.events.operate,buttons: [{name: 'Restore',text: __('Restore'),classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',icon: 'fa fa-rotate-left',url: 'wanlshop/freight/restore',refresh: true},{name: 'Destroy',text: __('Destroy'),classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',icon: 'fa fa-times',url: 'wanlshop/freight/destroy',refresh: true}],formatter: Table.api.formatter.operate}
		            ]
		        ]
		    });
		
		    // 为表格绑定事件
		    Table.api.bindevent(table);
		},
		add: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						freightData: [],
						valuation: 0, // 计费方式
						isdelivery: 0, // 包邮方式
						regions: Config.area, // 所有地区
						cityCount: 407, //城市数量
						checkAll: false, // 全选状态
						// 当前选择的地区id集
						checked: {
							province: [],
							citys: []
						},
						// 禁止选择的地区id集
						disable: {
							province: [],
							citys: [],
							treeData: {}
						},
						forms: [] // 已选择的区域和运费form项
					}
				},
				methods: {
					// 添加配送区域
					onAddRegionEvent() {
						var total = 0;
						this.forms.forEach(item => {
							total += item.citys.length;
						});
						console.log(total);
						// 判断是否选择了全国
						if (total >= this.cityCount) {
							layer.msg('已经选择了所有区域~');
							return false;
						}
						var _this = this;
						// 显示选择可配送区域弹窗
						this.onShowCheckBox({
							complete(checked) {
								// 选择完成后新增form项
								_this.forms.push({
									province: checked.province,
									citys: checked.citys,
									treeData: _this.getTreeData(checked)
								});
							}
						});
					},
					// 全选
					onCheckAll(checked) {
						this.checkAll = checked;
						// 遍历能选择的地区
						for (var key in this.regions) {
							if (this.regions.hasOwnProperty(key)) {
								var item = this.regions[key];
								if (!this.isPropertyExist(item.id, this.disable.treeData) ||
									!this.disable.treeData[item.id].isAllCitys) {
									var provinceId = parseInt(item.id);
									this.checkedProvince(provinceId, this.checkAll);
								}
							}
						}
					},
					// 标记不可选的地区
					onDisableRegion(ignoreFormIndex) {
						// 清空禁选地区
						var disable = {
							province: [],
							citys: []
						};
						for (var key in this.forms) {
							if (this.forms.hasOwnProperty(key)) {
								if (ignoreFormIndex > -1 && ignoreFormIndex === parseInt(key)) continue;
								var item = this.forms[key];
								disable.province = this.arrayMerge(disable.province, item.province);
								disable.citys = this.arrayMerge(disable.citys, item.citys);
							}
						}
						this.disable = {
							province: disable.province,
							citys: disable.citys,
							treeData: this.getTreeData(disable)
						};
					},
					// 将选中的区域id集格式化为树状格式
					getTreeData(checkedData) {
						console.log(checkedData);
						var treeData = {};
						checkedData.province.forEach((provinceId) => {
							var province = this.regions[provinceId],
								citys = [],
								cityCount = 0;
							for (var cityIndex in province.city) {
								if (province.city.hasOwnProperty(cityIndex)) {
									var cityItem = province.city[cityIndex];
									if (this.inArray(cityItem.id, checkedData.citys)) {
										citys.push({
											id: cityItem.id,
											name: cityItem.name
										});
									}
									cityCount++;
								}
							}
							treeData[province.id] = {
								id: province.id,
								name: province.name,
								citys: citys,
								isAllCitys: citys.length === cityCount
							};
						});
						return treeData;
					},
					// 编辑配送区域
					onEditerForm(formIndex, formItem) {
						var wanl = this;
						// 显示选择可配送区域弹窗
						this.onShowCheckBox({
							editerFormIndex: formIndex,
							checkedData: {
								province: formItem.province,
								citys: formItem.citys
							},
							complete(data) {
								formItem.province = data.province;
								formItem.citys = data.citys;
								formItem.treeData = wanl.getTreeData(data);
							}
						});
					},
					// 删除配送区域
					onDeleteForm(formIndex) {
						layer.confirm('确定要删除吗？', {
							title: '友情提示'
						}, (index) => {
							this.forms.splice(formIndex, 1);
							layer.close(index);
						});
					},
					// 显示选择可配送区域弹窗
					onShowCheckBox(option) {
						var options = $.extend(true, {
							editerFormIndex: -1,
							checkedData: null,
							complete: $.noop()
						}, option);
						// 已选中的数据
						this.checked = options.checkedData ? options.checkedData : {
							province: [],
							citys: []
						};
						// 标记不可选的地区
						this.onDisableRegion(options.editerFormIndex);
						// 取消全选按钮
						this.checkAll = false;
						// 开启弹窗
						var wanl = this;
						layer.open({
							type: 1,
							shade: false,
							moveOut: true,
							title: '选择可配送区域',
							btn: ['确定', '取消'],
							area: ['820px', '520px'], //宽高
							content: $(this.$refs['choice']),
							yes(index) {
								if (wanl.checked.citys.length <= 0) {
									layer.msg('请选择区域~');
									return false;
								}
								options.complete(wanl.checked);
								layer.close(index);
							}
						});
					},
					// 选择省份
					onCheckedProvince(e) {
						var provinceId = parseInt(e.target.value);
						this.checkedProvince(provinceId, e.target.checked);
					},
					checkedProvince(provinceId, checked) {
						// 更新省份选择
						var index = this.checked.province.indexOf(provinceId);
						if (!checked) {
							index > -1 && this.checked.province.splice(index, 1);
						} else {
							index === -1 && this.checked.province.push(provinceId);
						}
						// 更新城市选择
						var cityIds = this.regions[provinceId].city;
						for (var cityIndex in cityIds) {
							if (cityIds.hasOwnProperty(cityIndex)) {
								var cityId = parseInt(cityIndex);
								var checkedIndex = this.checked.citys.indexOf(cityId);
								if (!checked) {
									checkedIndex > -1 && this.checked.citys.splice(checkedIndex, 1)
								} else {
									checkedIndex === -1 && this.checked.citys.push(cityId);
								}
							}
						}
					},
					// 选择城市
					onCheckedCity(e, provinceId) {
						var cityId = parseInt(e.target.value);
						if (!e.target.checked) {
							var index = this.checked.citys.indexOf(cityId);
							index > -1 && this.checked.citys.splice(index, 1)
						} else {
							this.checked.citys.push(cityId);
						}
						// 更新省份选中状态
						this.onUpdateProvinceChecked(parseInt(provinceId));
					},
					// 更新省份选中状态
					onUpdateProvinceChecked(provinceId) {
						var provinceIndex = this.checked.province.indexOf(provinceId);
						var isExist = provinceIndex > -1;
						if (!this.onHasCityChecked(provinceId)) {
							isExist && this.checked.province.splice(provinceIndex, 1);
						} else {
							!isExist && this.checked.province.push(provinceId);
						}
					},
					// 是否存在城市被选中
					onHasCityChecked(provinceId) {
						var cityIds = this.regions[provinceId].city;
						for (var cityId in cityIds) {
							if (cityIds.hasOwnProperty(cityId) &&
								this.inArray(parseInt(cityId), this.checked.citys))
								return true;
						}
						return false;
					},
					// 数组中是否存在指定的值
					inArray(val, array) {
						return array.indexOf(val) > -1;
					},
			
					// 对象的属性是否存在
					isPropertyExist(key, obj) {
						return obj.hasOwnProperty(key);
					},
			
					// 数组合并
					arrayMerge(arr1, arr2) {
						return arr1.concat(arr2);
					}
				}
			});
			Controller.api.bindevent();
		},
		edit: function() {
			var vm = new Vue({
				el: '#app',
				data() {
					return {
						freightData: Config.data,
						valuation: Config.valuation, // 计费方式
						isdelivery: Config.isdelivery, // 包邮方式
						regions: Config.area, // 所有地区
						cityCount: 407, //城市数量
						checkAll: false, // 全选状态
						// 当前选择的地区id集
						checked: {
							province: [],
							citys: []
						},
						// 禁止选择的地区id集
						disable: {
							province: [],
							citys: [],
							treeData: {}
						},
						forms: [] // 已选择的区域和运费form项
					}
				},
				mounted(){
					this.initializeForms();
				},
				methods: {
					// 初始化forms
                    initializeForms() {
                        if (!this.freightData.length) return false;
                        this.freightData.forEach((form) => {
							// 1.0.5升级 格式化数组
							form.province = form.province.map(Number);
							form.citys = form.citys.split(',');
                            // 转换为整数型
                            for (var key in  form.citys) {
                                if (form.citys.hasOwnProperty(key)) {
                                    form.citys[key] = parseInt(form.citys[key]);
                                }
                            }
                            form['treeData'] = this.getTreeData({
                                province: form.province,
                                citys: form.citys
                            });
                            this.forms.push(form);
                        });
                    },
					// 添加配送区域
					onAddRegionEvent() {
						var total = 0;
						this.forms.forEach(item => {
							total += item.citys.length;
						});
						console.log(total);
						// 判断是否选择了全国
						if (total >= this.cityCount) {
							layer.msg('已经选择了所有区域~');
							return false;
						}
						var _this = this;
						// 显示选择可配送区域弹窗
						this.onShowCheckBox({
							complete(checked) {
								// 选择完成后新增form项
								_this.forms.push({
									province: checked.province,
									citys: checked.citys,
									treeData: _this.getTreeData(checked)
								});
							}
						});
					},
					// 全选
					onCheckAll(checked) {
						this.checkAll = checked;
						// 遍历能选择的地区
						for (var key in this.regions) {
							if (this.regions.hasOwnProperty(key)) {
								var item = this.regions[key];
								if (!this.isPropertyExist(item.id, this.disable.treeData) ||
									!this.disable.treeData[item.id].isAllCitys) {
									var provinceId = parseInt(item.id);
									this.checkedProvince(provinceId, this.checkAll);
								}
							}
						}
					},
					// 标记不可选的地区
					onDisableRegion(ignoreFormIndex) {
						// 清空禁选地区
						var disable = {
							province: [],
							citys: []
						};
						for (var key in this.forms) {
							if (this.forms.hasOwnProperty(key)) {
								if (ignoreFormIndex > -1 && ignoreFormIndex === parseInt(key)) continue;
								var item = this.forms[key];
								disable.province = this.arrayMerge(disable.province, item.province);
								disable.citys = this.arrayMerge(disable.citys, item.citys);
							}
						}
						this.disable = {
							province: disable.province,
							citys: disable.citys,
							treeData: this.getTreeData(disable)
						};
					},
					// 将选中的区域id集格式化为树状格式
					getTreeData(checkedData) {
						console.log(checkedData);
						var treeData = {};
						checkedData.province.forEach((provinceId) => {
							var province = this.regions[provinceId],
								citys = [],
								cityCount = 0;
							for (var cityIndex in province.city) {
								if (province.city.hasOwnProperty(cityIndex)) {
									var cityItem = province.city[cityIndex];
									if (this.inArray(cityItem.id, checkedData.citys)) {
										citys.push({
											id: cityItem.id,
											name: cityItem.name
										});
									}
									cityCount++;
								}
							}
							treeData[province.id] = {
								id: province.id,
								name: province.name,
								citys: citys,
								isAllCitys: citys.length === cityCount
							};
						});
						return treeData;
					},
					// 编辑配送区域
					onEditerForm(formIndex, formItem) {
						var wanl = this;
						// 显示选择可配送区域弹窗
						this.onShowCheckBox({
							editerFormIndex: formIndex,
							checkedData: {
								province: formItem.province,
								citys: formItem.citys
							},
							complete(data) {
								formItem.province = data.province;
								formItem.citys = data.citys;
								formItem.treeData = wanl.getTreeData(data);
							}
						});
					},
					// 删除配送区域
					onDeleteForm(formIndex) {
						layer.confirm('确定要删除吗？', {
							title: '友情提示'
						}, (index) => {
							this.forms.splice(formIndex, 1);
							layer.close(index);
						});
					},
					// 显示选择可配送区域弹窗
					onShowCheckBox(option) {
						var options = $.extend(true, {
							editerFormIndex: -1,
							checkedData: null,
							complete: $.noop()
						}, option);
						// 已选中的数据
						this.checked = options.checkedData ? options.checkedData : {
							province: [],
							citys: []
						};
						// 标记不可选的地区
						this.onDisableRegion(options.editerFormIndex);
						// 取消全选按钮
						this.checkAll = false;
						// 开启弹窗
						var wanl = this;
						layer.open({
							type: 1,
							shade: false,
							moveOut: true,
							title: '选择可配送区域',
							btn: ['确定', '取消'],
							area: ['820px', '520px'], //宽高
							content: $(this.$refs['choice']),
							yes(index) {
								if (wanl.checked.citys.length <= 0) {
									layer.msg('请选择区域~');
									return false;
								}
								options.complete(wanl.checked);
								layer.close(index);
							}
						});
					},
					// 选择省份
					onCheckedProvince(e) {
						var provinceId = parseInt(e.target.value);
						this.checkedProvince(provinceId, e.target.checked);
					},
					checkedProvince(provinceId, checked) {
						// 更新省份选择
						var index = this.checked.province.indexOf(provinceId);
						if (!checked) {
							index > -1 && this.checked.province.splice(index, 1);
						} else {
							index === -1 && this.checked.province.push(provinceId);
						}
						// 更新城市选择
						var cityIds = this.regions[provinceId].city;
						for (var cityIndex in cityIds) {
							if (cityIds.hasOwnProperty(cityIndex)) {
								var cityId = parseInt(cityIndex);
								var checkedIndex = this.checked.citys.indexOf(cityId);
								if (!checked) {
									checkedIndex > -1 && this.checked.citys.splice(checkedIndex, 1)
								} else {
									checkedIndex === -1 && this.checked.citys.push(cityId);
								}
							}
						}
					},
					// 选择城市
					onCheckedCity(e, provinceId) {
						var cityId = parseInt(e.target.value);
						if (!e.target.checked) {
							var index = this.checked.citys.indexOf(cityId);
							index > -1 && this.checked.citys.splice(index, 1)
						} else {
							this.checked.citys.push(cityId);
						}
						// 更新省份选中状态
						this.onUpdateProvinceChecked(parseInt(provinceId));
					},
					// 更新省份选中状态
					onUpdateProvinceChecked(provinceId) {
						var provinceIndex = this.checked.province.indexOf(provinceId);
						var isExist = provinceIndex > -1;
						if (!this.onHasCityChecked(provinceId)) {
							isExist && this.checked.province.splice(provinceIndex, 1);
						} else {
							!isExist && this.checked.province.push(provinceId);
						}
					},
					// 是否存在城市被选中
					onHasCityChecked(provinceId) {
						var cityIds = this.regions[provinceId].city;
						for (var cityId in cityIds) {
							if (cityIds.hasOwnProperty(cityId) &&
								this.inArray(parseInt(cityId), this.checked.citys))
								return true;
						}
						return false;
					},
					// 数组中是否存在指定的值
					inArray(val, array) {
						return array.indexOf(val) > -1;
					},
			
					// 对象的属性是否存在
					isPropertyExist(key, obj) {
						return obj.hasOwnProperty(key);
					},
			
					// 数组合并
					arrayMerge(arr1, arr2) {
						return arr1.concat(arr2);
					}
				}
			});
			Controller.api.bindevent();
		},
		api: {
			bindevent: function() {
				Form.api.bindevent($("form[role=form]"));
			}
		}
	};
	return Controller;
});
