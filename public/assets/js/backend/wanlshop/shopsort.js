"use strict";define(["jquery","bootstrap","backend","table","form"],function(t,e,a,i,d){var s={index:function(){i.api.init({extend:{index_url:"wanlshop/shopsort/index"+location.search,add_url:"wanlshop/shopsort/add",edit_url:"wanlshop/shopsort/edit",del_url:"wanlshop/shopsort/del",multi_url:"wanlshop/shopsort/multi",table:"wanlshop_shop_sort"}});var e=t("#table");e.bootstrapTable({url:t.fn.bootstrapTable.defaults.extend.index_url,pk:"id",sortName:"weigh",pagination:!1,columns:[[{checkbox:!0},{field:"id",title:__("Id")},{field:"name",title:__("Name"),align:"left",formatter:s.api.formatter.escape2Html},{field:"image",title:__("Image"),events:i.api.events.image,formatter:i.api.formatter.image},{field:"createtime",title:__("Createtime"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"updatetime",title:__("Updatetime"),operate:"RANGE",addclass:"datetimerange",formatter:i.api.formatter.datetime},{field:"status",title:__("Status"),searchList:{normal:__("Normal"),hidden:__("Hidden")},formatter:i.api.formatter.status},{field:"id",title:__("展开"),operate:!1,formatter:s.api.formatter.subnode},{field:"operate",title:__("Operate"),table:e,events:i.api.events.operate,formatter:i.api.formatter.operate}]],search:!1,commonSearch:!1}),e.on("post-body.bs.table",function(e,a,i,d){t(".btn-node-sub.disabled[data-pid!=0]").closest("tr").hide(),t(".btn-node-sub").off("click").on("click",function(e){var a=!!(t(this).data("shown")||t("a.btn[data-pid='"+t(this).data("id")+"']:visible").size()>0);return t("a.btn[data-pid='"+t(this).data("id")+"']").each(function(){t(this).closest("tr").toggle(!a),t(this).hasClass("disabled")||t(this).trigger("click")}),t(this).data("shown",!a),!1})}),t(document.body).on("click",".btn-toggle",function(e){t("a.btn[data-id][data-pid][data-pid!=0].disabled").closest("tr").hide();var a=this,i=t("i",a).hasClass("fa-chevron-down");t("i",a).toggleClass("fa-chevron-down",!i),t("i",a).toggleClass("fa-chevron-up",i),t("a.btn[data-id][data-pid][data-pid!=0]").not(".disabled").closest("tr").toggle(i),t(".btn-node-sub[data-pid=0]").data("shown",i)}),t(document.body).on("click",".btn-toggle-all",function(e){var a=this,i=t("i",a).hasClass("fa-plus");t("i",a).toggleClass("fa-plus",!i),t("i",a).toggleClass("fa-minus",i),t(".btn-node-sub.disabled[data-pid!=0]").closest("tr").toggle(i),t(".btn-node-sub[data-pid!=0]").data("shown",i)}),i.api.bindevent(e)},add:function(){s.api.bindevent()},edit:function(){s.api.bindevent()},api:{formatter:{subnode:function(t,e,a){return'<a href="javascript:;" data-toggle="tooltip" title="'+__("Toggle sub menu")+'" data-id="'+e.id+'" data-pid="'+e.pid+'" class="btn btn-xs '+(1==e.haschild||1==e.ismenu?"btn-success":"btn-default disabled")+' btn-node-sub"><i class="fa fa-sitemap"></i></a>'},escape2Html:function(t,e,a){return t.toString().replace(/(&|&amp;)nbsp;/g,"")}},bindevent:function(){d.api.bindevent(t("form[role=form]"))}}};return s});