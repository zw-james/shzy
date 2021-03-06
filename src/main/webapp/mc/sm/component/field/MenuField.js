﻿/**
 * 系统管理模块 - 菜单弹窗选择组件
 */
(function($)
{
	/**
	 * 菜单表格弹窗选择组件
	 */
	$.widget("sm.MenuGridField", $.mc.GridField,
	{
		options :
		{
			place_text : "请选择菜单...",	/* 初始占位文本 */
			title : "选择菜单",				/* 对话框标题 */
			col_model : [					/* 列模式 */
			{
				name : "id",
				hidden : true,
				key : true,
			},
			{
				name : "code",
				label : "菜单编号",
				width : 150
			},
			{
				name : "name",
				label : "菜单名称",
				width : 150
			},
			{
				name : "status",
				hidden : true
			},
			{
				name : "status_text",
				label : "状态",
				width : 60,
				align : "center",
				mc_source_col : "status",
				formatter : mc.render.Status
			} ],
			url : "sm/mcmenu/list",			/* 数据url */
			type : "post",					/* http方法 */
			param_serialize : "filter",		/* 参数序列化 */
			search_option :					/* 搜索选项 */
			[
				{ id : "code", text : "菜单编码" },
				{ id : "name", text : "菜单名称" }
			],
			param_page : "page",			/* 开始页数 */
			param_startrow : "start",		/* 开始行数 */
			param_rows : "limit",			/* 每页行数 */
			data_root : "data",				/* 返回数据节点root */
			data_rows : "total",			/* 返回分页数据总行数 */
			data_pages : "total_page",		/* 返回分页数据总页数 */
			field_id : "id",				/* id字段 */
			field_text : "name"				/* text字段 */
		}
	});

	/**
	 * 菜单树弹窗选择组件
	 */
	$.widget("sm.MenuTreeField", $.mc.TreeField,
	{
		options :
		{
			place_text : "请选择菜单...",	/* 初始占位文本 */
			title : "选择菜单",				/* 对话框标题 */
			root_name : "菜单",				/* 根节点名称 */
			url : "sm/mcmenu/list",			/* 数据url */
			type : "post",					/* http方法 */
			param_serialize : "filter",		/* 参数序列化 */
			data_root : "data",				/* 返回数据节点root */
			field_id : "id",				/* id字段 */
			field_text : "name",			/* text字段 */
			field_parentid : "parentid",	/* 上级id字段 */
			field_leaf : "isleaf",			/* 是否末级字段 */
			field_level : "level"			/* 级别字段 */
		}
	});
})(jQuery);