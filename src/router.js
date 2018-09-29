import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

/**
作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
添加otherRouter时请在$route.meta里面添加此路由归属的上层路由的name(belong)、path(path)和titile(title),否则页面将无法正确展示非左侧菜单的路由高亮以及面包屑导航!
**/
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        //需要在面包屑里显示，却不在菜单内的页面需要加上meta: {isSpecial: true}
        { path: 'ownspace', title: '个人中心', meta: {isSpecial: true}, name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'personal-info', title: '个人信息', meta: {isSpecial: true}, name: 'ownspace_personal_info', component: resolve => { require(['./views/own-space/info.vue'], resolve); } },
        { path: 'edit-password', title: '修改密码', meta: {isSpecial: true}, name: 'ownspace_edit_password', component: resolve => { require(['./views/own-space/editPassword.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: resolve => { require(['./views/advanced-router/component/order-info.vue'], resolve); } },  // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['./views/advanced-router/component/shopping-info.vue'], resolve); } },  // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } },
        /*销售排行数据分析*/
        { path: '/sales_ranking/analytical_data', meta: {belong: 'salesRinking_index', path: '/sales_ranking/index?reserveDate=1', title: '销售排行'}, title: '个人数据', name: 'sales_analytical_data', component: resolve => { require(['./views/main/salesModule/sales_ranking/analyticalData.vue'], resolve); } },
        /*团队分析数据分析*/
        { path: '/team_analysis/analytical_data', meta: {belong: 'team_analysis_index', path: '/team_analysis/index?reserveDate=1', title: '团队分析'}, title: '团队数据', name: 'team_analytical_data', component: resolve => { require(['./views/main/salesModule/team_analysis/analysisData.vue'], resolve); } },
        { path: '/team_analysis/analytical_person_data', meta: {belong: 'team_analysis_index', path: '/team_analysis/index?reserveDate=1', title: '团队分析'}, title: '个人数据', name: 'team_person_analytical_data', component: resolve => { require(['./views/main/salesModule/sales_ranking/analyticalData.vue'], resolve); } },
        //客户分析
        { path: '/custom_analyze/analytical_data', meta: {belong: 'custom_analyze_index', path: '/customer_analysis/index?reserveDate=1',  title: '客户分析'}, title: '客户详情数据', name: 'custom_analyze_data', component: resolve => { require(['./views/main/salesModule/custom_analyze/analyticalData.vue'], resolve); } },
        // 品牌系列分析
        { path: '/goods_analyze/analytical_brand_data', meta: {belong: 'goods_brand_analyze', path: '/goods_analyze/goods_brand_analyze?reserveDate=1',  title: '商品品牌分析'}, title: '品牌系列分析', name: 'goods_brand_series_analyze', component: resolve => { require(['./views/main/salesModule/goods_analyze/analytical_series_data.vue'], resolve); } },
        { path: '/goods_analyze/single_good_analysis', meta: {belong: 'goods_brand_analyze', path: '/goods_analyze/goods_brand_analyze?reserveDate=1',  title: '商品品牌分析'}, title: '商品详情分析', name: 'single_good_analysis', component: resolve => { require(['./views/main/salesModule/goods_analyze/single_good_analysis.vue'], resolve); } },
        /*订单管理详情*/
        { path: '/order_manage/inquery_detail', meta: {belong: 'order_manage_index', path: '/order_manage/index',  title: '订单管理'}, title: '询价单详情', name: 'order_manage_inquery_detail', component: resolve => { require(['./views/main/serviceModule/query_manage/query_detial.vue'], resolve); } },
        { path: '/order_manage/return_detail', meta: {belong: 'order_manage_index', path: '/order_manage/index',  title: '订单管理'}, title: '退货单详情', name: 'order_manage_return_detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsthd/detail.vue'], resolve); } },
        { path: '/custom_manage/detail', meta: {belong: 'custom_manage_index', path: '/order_manage/index',  title: '订单管理'}, title: '客户详情', name: 'custom_manage_detail', component: resolve => { require(['./views/main/salesModule/custom_manage/detail.vue'], resolve); } },
        /*======客服模块=====*/
        /*销售管理*/
        { path: '/service/sales-manage/xshtd_detail', meta: {belong: 'service-sales-htd', tmpNew: true, path: '/service/sales-manage/xshtd',  title: '销售合同单'}, title: '销售合同单详情', name: 'service-sales-htd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xshtd/xshtd_detail.vue'], resolve); } },
        { path: '/service/sales-manage/xjd_detail', meta: {belong: 'service-sales-htd', path: '/service/sales-manage/xshtd',  title: '销售合同单'}, title: '询价单详情', name: 'service-xjd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xshtd/xjd_detail.vue'], resolve); } },
        { path: '/service/sales-manage/xsqgd_detail', meta: {belong: 'service-sales-xsqgd', tmpNew: true,path: '/service/sales-manage/xsqgd',  title: '销售请购单'}, title: '销售请购单详情', name: 'service-sales-xsqgd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsqgd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/xsqgd_toQGXGD', meta: {belong: 'service-sales-xsqgd', tmpNew: true,path: '/service/sales-manage/xsqgd',  title: '销售请购单详情'}, title: '生成请购修改单', name: 'service-sales-xsqgd-toQGXGD', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsqgd/toQGXGD.vue'], resolve); } },
	    { path: '/service/sales-manage/toRequire', meta: {belong: 'service-sales-xsqgd', tmpNew: true,path: '/service/sales-manage/xsqgd',  title: '销售请购单'}, title: '生成销售请购单', name: 'purchase_manage_HT_toRequireDetail', component: resolve => { require(['./views/main/serviceModule/sales_manage/dqgmx/detail.vue'], resolve); } },
	    { path: '/service/sales-manage/toInvoice', meta: {belong: 'purchase_manage_HT_toInvoice', tmpNew: true,path: '/service/sales-manage/HT_toInvoice',  title: '待开票明细'}, title: '生成销售开票单', name: 'purchase_manage_HT_toInvoiceDetail', component: resolve => { require(['./views/main/serviceModule/sales_manage/dkpmx/detail.vue'], resolve); } },
        { path: '/service/sales-manage/qgxgd_detail', meta: {belong: 'service-sales-qgxgd',tmpNew: true, path: '/service/sales-manage/xsqgxgd',  title: '请购修改单'}, title: '请购修改单详情', name: 'service-sales-qgxgd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsqgxgd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/skd_detail', meta: {belong: 'service-sales-skd', path: '/service/sales-manage/xsskd',  title: '销售收款单'}, title: '销售收款单详情', name: 'service-xsskd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsskd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/skd_add', meta: {belong: 'service-sales-skd', path: '/service/sales-manage/xsskd',  title: '销售收款单'}, title: '销售收款单新增', name: 'service-xsskd-add', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsskd/add.vue'], resolve); } },
        { path: '/service/sales-manage/ckd_detail', meta: {belong: 'service-sales-ckd', tmpNew: true, path: '/service/sales-manage/xsckd',  title: '销售出库单'}, title: '销售出库单详情', name: 'service-xsckd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsckd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/thsqd_detail', meta: {belong: 'service-sales-thsqd', tmpNew: true, path: '/service/sales-manage/thsqd',  title: '退货申请单'}, title: '退货申请单详情', name: 'service-thsqd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/thsqd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/thsqd_tothd', meta: {belong: 'service-sales-thsqd', path: '/service/sales-manage/thsqd',  title: '退货申请单'}, title: '生成销售退货单', name: 'service-thsqd-tothd', component: resolve => { require(['./views/main/serviceModule/sales_manage/thsqd/toTHD.vue'], resolve); } },
        { path: '/service/sales-manage/thsqd_toHTedit', meta: {belong: 'service-sales-thsqd', path: '/service/sales-manage/thsqd',  title: '退货申请单'}, title: '生成合同修改单', name: 'service-thsqd-toHTedit', component: resolve => { require(['./views/main/serviceModule/sales_manage/thsqd/toHTedit.vue'], resolve); } },
        { path: '/service/sales-manage/thd_detail', meta: {belong: 'service-sales-thd', tmpNew: true, path: '/service/sales-manage/xsthd',  title: '销售退货单'}, title: '销售退货单详情', name: 'service-xsthd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsthd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/makeInStore', meta: {belong: 'service-sales-thd', path: '/service/sales-manage/xsthd',  title: '销售退货单'}, title: '生成退货入库单', name: 'service-xsthd-makeInStore', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsthd/returnInStore.vue'], resolve); } },
        { path: '/service/sales-manage/thrkd_detail', meta: {belong: 'service-sales-thrkd', path: '/service/sales-manage/thrkd',  title: '退货入库单'}, title: '退货入库单详情', name: 'service-thrkd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/thrkd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/tkd_detail', meta: {belong: 'service-sales-tkd', path: '/service/sales-manage/xstkd',  title: '销售退款单'}, title: '销售退款单详情', name: 'service-xstkd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xstkd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/toTKD', meta: {belong: 'service-sales-tkd', path: '/service/sales-manage/xstkd',  title: '销售退款单'}, title: '生成销售退款单', name: 'service-xstkd-toTKD', component: resolve => { require(['./views/main/serviceModule/sales_manage/xstkd/toTKD.vue'], resolve); } },
        { path: '/service/sales-manage/thd_return', meta: {belong: 'service-sales-thd', path: '/service/sales-manage/xsthd',  title: '销售退货单'}, title: '待生成销售退货单', name: 'service-xsthd-return', component: resolve => { require(['./views/main/serviceModule/sales_manage/xsthd/return.vue'], resolve); } },
        { path: '/service/sales-manage/htxgd_detail', meta: {belong: 'purchase_manage_htxgd', path: '/service/sales-manage/htxgd',  title: '合同修改单'}, title: '合同修改单详情', name: 'service-htxgd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/htxgd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/htxgd_makeXgd', meta: {belong: 'purchase_manage_htxgd', path: '/service/sales-manage/htxgd',  title: '合同修改单'}, title: '待生成合同修改单', name: 'service-htxgd-make', component: resolve => { require(['./views/main/serviceModule/sales_manage/htxgd/make.vue'], resolve); } },
        { path: '/service/sales-manage/xskpd_detail', meta: {belong: 'service-xskpd-index', tmpNew: true, path: '/service/sales-manage/xskpd',  title: '销售开票单'}, title: '销售开票单详情', name: 'service-xskpd-detail', component: resolve => { require(['./views/main/serviceModule/sales_manage/xskpd/detail.vue'], resolve); } },
        { path: '/service/sales-manage/apply_return', meta: {belong: 'service-sales-htd',tmpNew: true, path: '/service/sales-manage/xshtd',  title: '销售合同单'}, title: '申请售后', name: 'service-apply-return', component: resolve => { require(['./views/main/serviceModule/sales_manage/xshtd/apply_return.vue'], resolve); } },
        //询价管理
        { path: '/service/query-manage/query-detail', meta: {belong: 'service-query-list', path: '/service/query-manage/query-list',  title: '询价单管理'}, title: '询价单详情', name: 'service-manage-detail', component: resolve => { require(['./views/main/serviceModule/query_manage/query_detial.vue'], resolve); } },
        //客户信息
        { path: '/service/custom_info/detail', meta: {belong: 'service-custom-index', path: '/service/query-manage/query-list',  title: '客户信息'}, title: '客户信息详情', name: 'service-custom-detail', component: resolve => { require(['./views/main/serviceModule/custom_info/detail.vue'], resolve); } },
        { path: '/service/custom_info/newadd', meta: {belong: 'service-custom-index', path: '/service/query-manage/query-list',  title: '客户信息'}, title: '客户信息新增', name: 'service-custom-newadd', component: resolve => { require(['./views/main/serviceModule/custom_info/newadd.vue'], resolve); } },
        //发票管理
        { path: '/service/invoice-manage/service-invoice-set-detail', meta: {belong: 'service-invoice-set', path: '/service/invoice-manage/invoice-list',  title: '发票设置'}, title: '发票设置详情', name: 'service-invoice-set-detail', component: resolve => { require(['./views/main/serviceModule/invoice_manage/set_detial.vue'], resolve); } },
        { path: '/service/invoice-manage/service-make-invoice-detail', meta: {belong: 'service-make-invoice', path: '/service/invoice-manage/make-invoice',  title: '开票管理'}, title: '开票管理详情', name: 'service-make-invoice-detail', component: resolve => { require(['./views/main/serviceModule/invoice_manage/make_detial.vue'], resolve); } },

        /*======运营模块=====*/
        /*产品管理模块——产品品牌*/
        // tmpNew 用于暂时新增页面，后续全部加完后可删除
        { path: '/operate/product-manage/product-brand-detail', meta: {belong: 'operate_product_brand_index',tmpNew: true, path: '/operate_product_manage/product_brand',  title: '产品品牌管理'}, title: '产品品牌详情', name: 'operate_product_brand_detail', component: resolve => { require(['./views/main/operateMoudle/product_manage/product_brand/detail.vue'], resolve); } },
        { path: '/operate/product-manage/product-brand-add', meta: {belong: 'operate_product_brand_index',tmpNew: true, path: '/operate_product_manage/product_brand',  title: '产品品牌管理'}, title: '产品品牌新增', name: 'operate_product_brand_add', component: resolve => { require(['./views/main/operateMoudle/product_manage/product_brand/add.vue'], resolve); } },
        { path: '/operate/product-manage/products-detail', meta: {belong: 'operate_products_index',tmpNew: true, path: '/operate_product_manage/products',  title: '产品管理'}, title: '产品查看', name: 'operate_products_detail', component: resolve => { require(['./views/main/operateMoudle/product_manage/products/detail.vue'], resolve); } },
        { path: '/operate/product-manage/products-add', meta: {belong: 'operate_products_index',tmpNew: true, path: '/operate_product_manage/products',  title: '产品管理'}, title: '产品新增', name: 'operate_products_add', component: resolve => { require(['./views/main/operateMoudle/product_manage/products/add.vue'], resolve); } },
        // 商品管理
        { path: '/operate/goods-manage/goods-manage-add-detail', meta: {belong: 'operate_goods_manage_index', tmpNew: true, path: '/operate_goods_manage/mange_list',  title: '商品管理'}, title: '新增上架产品', name: 'operate_goods_manage_add_detail', component: resolve => { require(['./views/main/operateMoudle/goods_manage/index_add_detail.vue'], resolve); } },
        { path: '/operate/goods-manage/goods-manage-index-detail', meta: {belong: 'operate_goods_manage_index', tmpNew: true, path: '/operate_goods_manage/mange_list',  title: '商品管理'}, title: '商品详情', name: 'operate_goods_manage_index_detail', component: resolve => { require(['./views/main/operateMoudle/goods_manage/index_detail.vue'], resolve); } },
        { path: '/operate/goods-manage/goods-manage-bulk-operation', meta: {belong: 'operate_goods_price_manage_index', tmpNew: true, path: '/operate_goods_manage/price_list',  title: '商品价格管理'}, title: '商品批量上下架', name: 'operate_goods_bulk_operation', component: resolve => { require(['./views/main/operateMoudle/goods_manage/bulk_operation.vue'], resolve); } },
        { path: '/operate/goods-manage/goods-manage-new-add', meta: {belong: 'operate_goods_add_manage_index', tmpNew: true, path: '/operate_goods_manage/add_list',  title: '商品管理'}, title: '商品新增单', name: 'operate_goods_manage_new_add', component: resolve => { require(['./views/main/operateMoudle/goods_manage/new_add.vue'], resolve); } },
        { path: '/operate/goods-manage/goods-manage-new-detail', meta: {belong: 'operate_goods_add_manage_index', tmpNew: true, path: '/operate_goods_manage/add_list',  title: '商品管理'}, title: '商品新增单详情', name: 'operate_goods_manage_new_detail', component: resolve => { require(['./views/main/operateMoudle/goods_manage/new_detail.vue'], resolve); } },
        { path: '/operate/goods-manage/product-manage-new-add', meta: {belong: 'operate_products_new_index', tmpNew: true, path: '/operate_product_manage/products',  title: '产品管理'}, title: '产品新增单新增', name: 'operate_products_new_add', component: resolve => { require(['./views/main/operateMoudle/product_manage/new/add.vue'], resolve); } },
        { path: '/operate/goods-manage/product-manage-new-detail', meta: {belong: 'operate_products_new_index', tmpNew: true, path: '/operate_product_manage/products',  title: '产品管理'}, title: '产品新增单详情', name: 'operate_products_new_detail', component: resolve => { require(['./views/main/operateMoudle/product_manage/new/detail.vue'], resolve); } },
        //限时秒杀
        { path: '/operate/sales-manage/limit-detail', meta: {belong: 'operate_sales_limit_time', tmpNew: true, path: '/operate_sales_manage/limit_sales', title: '限时秒杀'}, title: '限时秒杀详情', name: 'operate_sales_limit_time_detail', component: resolve => { require(['./views/main/operateMoudle/sales_manage/detail.vue'], resolve); } },
        { path: '/operate/sales-manage/limit-add', meta: {belong: 'operate_sales_limit_time', tmpNew: true, path: '/operate_sales_manage/limit_sales', title: '限时秒杀'}, title: '限时秒杀新增', name: 'operate_sales_limit_time_add', component: resolve => { require(['./views/main/operateMoudle/sales_manage/add.vue'], resolve); } },
        //品牌折扣管理
        { path: '/operate/discount_manage/brand-add', meta: {belong: 'operate_sales_manage_brand_discount', tmpNew: true, path: '/operate_sales_manage/brand_discount', title: '品牌折扣'}, title: '品牌折扣新增', name: 'operate_sales_manage_brand_discount_add', component: resolve => { require(['./views/main/operateMoudle/discount_manage/brand-add.vue'], resolve); } },
        { path: '/operate/discount_manage/brand-detail', meta: {belong: 'operate_sales_manage_brand_discount', tmpNew: true, path: '/operate_sales_manage/brand_discount', title: '品牌折扣'}, title: '品牌折扣详情', name: 'operate_sales_manage_brand_discount_detail', component: resolve => { require(['./views/main/operateMoudle/discount_manage/brand-detail.vue'], resolve); } },
        //订单折扣管理
        { path: '/operate/discount_manage/order-add', meta: {belong: 'operate_sales_manage_order_discount', tmpNew: true, path: '/operate_sales_manage/order_discount', title: '订单折扣'}, title: '订单折扣新增', name: 'operate_sales_manage_order_discount_add', component: resolve => { require(['./views/main/operateMoudle/discount_manage/order-add.vue'], resolve); } },
        { path: '/operate/discount_manage/order-detail', meta: {belong: 'operate_sales_manage_order_discount', tmpNew: true, path: '/operate_sales_manage/order_discount', title: '订单折扣'}, title: '订单折扣详情', name: 'operate_sales_manage_order_discount_detail', component: resolve => { require(['./views/main/operateMoudle/discount_manage/order-detail.vue'], resolve); } },
        //系列折扣管理
        { path: '/operate/discount_manage/series-add', meta: {belong: 'operate_sales_manage_series_discount', tmpNew: true, path: '/operate_sales_manage/series_discount', title: '系列折扣'}, title: '系列折扣新增', name: 'operate_sales_manage_series_discount_add', component: resolve => { require(['./views/main/operateMoudle/discount_manage/series-add.vue'], resolve); } },
        { path: '/operate/discount_manage/series-detail', meta: {belong: 'operate_sales_manage_series_discount', tmpNew: true, path: '/operate_sales_manage/series_discount', title: '系列折扣'}, title: '系列折扣详情', name: 'operate_sales_manage_series_discount_detail', component: resolve => { require(['./views/main/operateMoudle/discount_manage/series-detail.vue'], resolve); } },

        //文章管理
        { path: '/service/article-manage/art-add', meta: {belong: 'article_mamage', tmpNew: true, path: '/article_mamage/announce-list', title: '文章管理'}, title: '文章新增', name: 'article_add', component: resolve => { require(['./views/main/serviceModule/article_manage/art_add.vue'], resolve); } },
        { path: '/service/article-manage/art-detail', meta: {belong: 'article_mamage', tmpNew: true, path: '/article_mamage/announce-list', title: '文章管理'}, title: '文章详情', name: 'article_detail', component: resolve => { require(['./views/main/serviceModule/article_manage/art_detail.vue'], resolve); } },
        //积分商品新增
        { path: '/operate/points_manage/points_goods_manage_add', meta: {belong: 'points_goods_manage', tmpNew: true, path: '/points_manage/points_goods_manage', title: '积分商品'}, title: '积分商品新增', name: 'points_goods_manage_add', component: resolve => { require(['./views/main/operateMoudle/points_manage/points_goods_manage_add.vue'], resolve); } },
        { path: '/operate/points_manage/points_goods_manage_detail', meta: {belong: 'points_goods_manage', tmpNew: true, path: '/points_manage/points_goods_manage', title: '积分商品'}, title: '积分商品详情', name: 'points_goods_manage_detail', component: resolve => { require(['./views/main/operateMoudle/points_manage/points_goods_manage_detail.vue'], resolve); } },
        //积分兑换单详情
        { path: '/operate/exchange_order/exchange_order_detail', meta: {belong: 'exchange_order', tmpNew: true, path: '/points_manage/exchange_order', title: '积分兑换单'}, title: '积分兑换单详情', name: 'exchange_order_detail', component: resolve => { require(['./views/main/operateMoudle/points_manage/exchange_order_detail.vue'], resolve); } },
        /*======采购模块=====*/
        //采购 供应商信息
        { path: '/purchase/supplyChainManage/applyInfo/add', meta: {belong: 'purchase_apply_index', tmpNew: true, path: '/purchase_apply/list', title: '供应商管理'}, title: '供应商新增', name: 'purchase_apply_add', component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/applyInfo/add.vue'], resolve); } },
        { path: '/purchase/supplyChainManage/applyInfo/detail', meta: {belong: 'purchase_apply_index', tmpNew: true, path: '/purchase_apply/list', title: '供应商管理'}, title: '供应商详情', name: 'purchase_apply_detail', component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/applyInfo/detail.vue'], resolve); } },
        { path: '/purchase/applyInfo/product_owner', meta: {belong: 'purchase_product_owner', tmpNew: true, path: '/purchase_apply/product_owner', title: '产品负责人'}, title: '产品负责人', name: 'purchase_product_owner_change', component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/poductOwner/change.vue'], resolve); } },

        //采购 备货单
        { path: '/purchase/purchase-manage/purchaseBH/detail', meta: {belong: 'purchase_manage_BH_index', tmpNew: true, path: '/purchase_manage/BH_index', title: '采购备货单'}, title: '采购备货单详情', name: 'purchase_manage_BH_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseBH/add', meta: {belong: 'purchase_manage_BH_index', tmpNew: true, path: '/purchase_manage/BH_index', title: '采购备货单'}, title: '采购备货单新增', name: 'purchase_manage_BH_add', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/add.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toPurchaseHT', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购合同单', name: 'purchase_manage_BH_HTD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/toPurchaseHT.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseBH/addProducts', meta: {belong: 'purchase_manage_BH_index', tmpNew: true, path: '/purchase_manage/BH_index', title: '采购备货单'}, title: '待采购商品选择', name: 'purchase_manage_BH_goodsChoose', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/addProducts.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseBH/makeBackEdit', meta: {belong: 'purchase_manage_BH_index', tmpNew: true, path: '/purchase_manage/BH_index', title: '采购备货单'}, title: '生成采购备货修改单', name: 'purchase_manage_make_back_edit', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/makeBackEdit.vue'], resolve); } },
        //采购 合同单
        { path: '/purchase/purchase-manage/purchaseHT/detail', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '采购合同单详情', name: 'purchase_manage_HT_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/add', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '采购合同单新增', name: 'purchase_manage_HT_add', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/add.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toFHD', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购发货单', name: 'purchase_manage_HT_toFHD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/toFHD.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toHTDedit', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购合同修改单', name: 'purchase_manage_HT_toHTDedit', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/toHTDedit.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toFKD', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购付款单', name: 'purchase_manage_HT_toFKD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/toFKD.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toSPD', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购收票单', name: 'purchase_manage_HT_toSPD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/toSPD.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHT/toTHD', meta: {belong: 'purchase_manage_HT_index', tmpNew: true, path: '/purchase_manage/HT_index', title: '采购合同单'}, title: '生成采购退货单', name: 'purchase_manage_HT_toTHD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/toTHD.vue'], resolve); } },
        // 采购 合同修改单
        { path: '/purchase/purchase-manage/purchaseHTedit/detail', meta: {belong: 'purchase_manage_HTedit_index', tmpNew: true, path: '/purchase_manage/HTedit_index', title: '采购合同修改单'}, title: '采购合同修改单详情', name: 'purchase_manage_HTedit_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHTedit/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHTedit/toTKD', meta: {belong: 'purchase_manage_HTedit_index', tmpNew: true, path: '/purchase_manage/HTedit_index', title: '采购合同修改单'}, title: '生成采购退款单', name: 'purchase_manage_HT_toTKD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHTedit/toTKD.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseHTedit/toTPD', meta: {belong: 'purchase_manage_HTedit_index', tmpNew: true, path: '/purchase_manage/HTedit_index', title: '采购合同修改单'}, title: '生成采购退票单', name: 'purchase_manage_HT_toTPD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHTedit/toTPD.vue'], resolve); } },
        // 采购 付款单
        { path: '/purchase/purchase-manage/purchaseFK/detail', meta: {belong: 'purchase_manage_FK_index', tmpNew: true, path: '/purchase_manage/FK_index', title: '采购付款单'}, title: '采购付款单详情', name: 'purchase_manage_FK_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFK/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseFK/add', meta: {belong: 'purchase_manage_FK_index', tmpNew: true, path: '/purchase_manage/FK_index', title: '采购付款单'}, title: '采购付款单新增', name: 'purchase_manage_FK_add', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFK/add.vue'], resolve); } },
        // 采购 发货单
        { path: '/purchase/purchase-manage/purchaseFH/detail', meta: {belong: 'purchase_manage_FH_index', tmpNew: true, path: '/purchase_manage/FH_index', title: '采购发货单'}, title: '采购发货单详情', name: 'purchase_manage_FH_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFH/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseFH/toRKD', meta: {belong: 'purchase_manage_FH_index', tmpNew: true, path: '/purchase_manage/FH_index', title: '采购发货单'}, title: '生成采购入库单', name: 'purchase_manage_FH_toRKD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFH/toRKD.vue'], resolve); } },
        // { path: '/purchase/purchase-manage/purchaseFH/toSPD', meta: {belong: 'purchase_manage_FH_index', tmpNew: true, path: '/purchase_manage/FH_index', title: '采购发货单'}, title: '生成采购售票单', name: 'purchase_manage_FH_toSPD', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFH/toSPD.vue'], resolve); } },
        //发货修改单
        { path: '/purchase/purchase-manage/purchaseFHedit/detail', meta: {belong: 'purchase_FHedit_index', tmpNew: true, path: '/purchase_manage/FH_edit', title: '发货修改单'}, title: '发货修改单详情', name: 'purchase_FHedit_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFHedit/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseFHedit/make', meta: {belong: 'purchase_manage_FH_index', tmpNew: true, path: '/purchase_manage/FH_index', title: '采购发货单'}, title: '生成发货修改单', name: 'purchase_FHedit_make', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFHedit/toFHedit.vue'], resolve); } },        
        // 采购 入库单
        { path: '/purchase/purchase-manage/purchaseRK/detail', meta: {belong: 'purchase_manage_RK_index', tmpNew: true, path: '/purchase_manage/RK_index', title: '采购入库单'}, title: '采购入库单详情', name: 'purchase_manage_RK_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseRK/detail.vue'], resolve); } },
        // 采购 收票单
        { path: '/purchase/purchase-manage/purchaseSP/detail', meta: {belong: 'purchase_manage_SP_index', tmpNew: true, path: '/purchase_manage/SP_index', title: '采购收票单'}, title: '采购收票单详情', name: 'purchase_manage_SP_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseSP/detail.vue'], resolve); } },
        // 采购 退货单
        { path: '/purchase/purchase-manage/purchaseTH/detail', meta: {belong: 'purchase_manage_TH_index', tmpNew: true, path: '/purchase_manage/TH_index', title: '采购退货单'}, title: '采购退货单详情', name: 'purchase_manage_TH_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTH/detail.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseTH/new', meta: {belong: 'purchase_manage_TH_index', tmpNew: true, path: '/purchase_manage/TH_index', title: '采购退货单'}, title: '采购退货单新增', name: 'purchase_manage_TH_add', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTH/addNewReturn.vue'], resolve); } },
        { path: '/purchase/purchase-manage/purchaseTH/make', meta: {belong: 'purchase_manage_TH_index', tmpNew: true, path: '/purchase_manage/TH_index', title: '采购退货单'}, title: '生成采购退货单', name: 'purchase_manage_TH_make', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTH/makeReturn.vue'], resolve); } },
        // 采购 退款单
        { path: '/purchase/purchase-manage/purchaseTK/detail', meta: {belong: 'purchase_manage_TK_index', tmpNew: true, path: '/purchase_manage/TK_index', title: '采购退款单'}, title: '采购退款单详情', name: 'purchase_manage_TK_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTK/detail.vue'], resolve); } },
        // 采购 出库单
        { path: '/purchase/purchase-manage/purchaseCK/detail', meta: {belong: 'purchase_manage_CK_index', tmpNew: true, path: '/purchase_manage/CK_index', title: '采购出库单'}, title: '采购出库单详情', name: 'purchase_manage_CK_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseCK/detail.vue'], resolve); } },
        //财务角色
        { path: '/finance/finance-gath/index', meta: {belong: 'gath_order', tmpNew: true, path: '/finance_manage/gathOrder', title: '财务收款单'}, title: '财务收款单详情', name: 'gath_order_detail', component: resolve => { require(['./views/main/financeModule/financeGath/detail.vue'], resolve); } },
        { path: '/finance/finance-gath/add', meta: {belong: 'gath_order', tmpNew: true, path: '/finance_manage/gathOrder', title: '财务收款单'}, title: '新增财务收款单', name: 'gath_order_add', component: resolve => { require(['./views/main/financeModule/financeGath/add.vue'], resolve); } },
        { path: '/finance/finance-gath/patchAdd', meta: {belong: 'gath_order', tmpNew: true, path: '/finance_manage/gathOrder', title: '财务收款单'}, title: '批量新增财务收款单', name: 'gath_order_patch_add', component: resolve => { require(['./views/main/financeModule/financeGath/patchAdd.vue'], resolve); } },
        { path: '/finance/cashPool/detail', meta: {belong: 'cash_pool', tmpNew: true, path: '/finance_manage/cashPool', title: '客户资金池'}, title: '客户资金明细', name: 'cash_pool_detail', component: resolve => { require(['./views/main/financeModule/cashPool/detail.vue'], resolve); } },

        
        /**财务开始swj **/
        { path: '/finance_manage/financeRefund/detail', meta: {belong: 'refund_order', tmpNew: true, path: '/finance_manage/refundOrder', title: '财务退款单'}, title: '财务退款单详情', name: 'refund_order_detail', component: resolve => { require(['./views/main/financeModule/financeRefund/detail.vue'], resolve); } },
        { path: '/finance_manage/financeRefund/add', meta: {belong: 'refund_order', tmpNew: true, path: '/finance_manage/refundOrder', title: '财务退款单'}, title: '新增财务退款单', name: 'refund_order_add', component: resolve => { require(['./views/main/financeModule/financeRefund/make.vue'], resolve); } },
        { path: '/finance_manage/breakRefund/detail', meta: {belong: 'break_refund', tmpNew: true, path: '/finance_manage/breakRefund', title: '违约扣款单'}, title: '违约扣款单详情', name: 'break_refund_detail', component: resolve => { require(['./views/main/financeModule/breakRefund/detail.vue'], resolve); } },
        { path: '/finance_manage/breakRefund/add', meta: {belong: 'break_refund', tmpNew: true, path: '/finance_manage/breakRefund', title: '违约扣款单'}, title: '新增违约扣款单', name: 'break_refund_add', component: resolve => { require(['./views/main/financeModule/breakRefund/make.vue'], resolve); } },
        /**财务结束swj**/

        /*仓库角色开始*/
        { path: '/store_manage/freight-register/index', meta: {belong: 'freight-register', tmpNew: true, path: '/store_manage/freight-register', title: '运费登记单'}, title: '运费登记单新增', name: 'freight-register-add', component: resolve => { require(['./views/main/storeModule/freightRegister/add.vue'], resolve); } },
        { path: '/store_manage/packing-list/detail', meta: {belong: 'packing-list', tmpNew: true, path: '/store_manage/packing-list', title: '盘盈入库单'}, title: '盘盈入库单详情', name: 'packing-list-detail', component: resolve => { require(['./views/main/storeModule/packingList/detail.vue'], resolve); } },
        { path: '/store_manage/packing-list/add', meta: {belong: 'packing-list', tmpNew: true, path: '/store_manage/packing-list', title: '盘盈入库单'}, title: '盘盈入库单新增', name: 'packing-list-add', component: resolve => { require(['./views/main/storeModule/packingList/add.vue'], resolve); } },
        { path: '/store_manage/treasury-loss/detail', meta: {belong: 'treasury-loss', tmpNew: true, path: '/store_manage/treasury-loss', title: '盘亏出库单'}, title: '盘亏出库单详情', name: 'treasury-loss-detail', component: resolve => { require(['./views/main/storeModule/treasuryLoss/detail.vue'], resolve); } },
        { path: '/store_manage/treasury-loss/add', meta: {belong: 'treasury-loss', tmpNew: true, path: '/store_manage/treasury-loss', title: '盘亏出库单'}, title: '盘亏出库单新增', name: 'treasury-loss-add', component: resolve => { require(['./views/main/storeModule/treasuryLoss/add.vue'], resolve); } },
        //系统管理员权限
        { path: '/authority/organize_manage/add', meta: {belong: 'role_permission', tmpNew: true, path: '/authority/role_permission', title: '角色权限'}, title: '角色权限新增', name: 'role-permission-add', component: resolve => { require(['./views/main/managerModule/authorityManage/rolePermission/add.vue'], resolve); } },
        { path: '/authority/organize_manage/detail', meta: {belong: 'role_permission', tmpNew: true, path: '/authority/role_permission', title: '角色权限'}, title: '角色权限详情', name: 'role-permission-detail', component: resolve => { require(['./views/main/managerModule/authorityManage/rolePermission/detail.vue'], resolve); } },
        { path: '/authority/staff_manage/add', meta: {belong: 'staff_manage', tmpNew: true, path: '/authority/staff_manage', title: '员工管理'}, title: '新增员工', name: 'staff_manage_add', component: resolve => { require(['./views/main/managerModule/staffManage/add.vue'], resolve); } },
        { path: '/authority/staff_manage/detail', meta: {belong: 'staff_manage', tmpNew: true, path: '/authority/staff_manage', title: '员工管理'}, title: '员工详情', name: 'staff_manage_detail', component: resolve => { require(['./views/main/managerModule/staffManage/detail.vue'], resolve); } },
        //商城首页管理
        { path: '/mall/mall-manage/detail', meta: {belong: 'floor_manage', tmpNew: true, path: '/shop_manage/floor_manage', title: '楼层管理'}, title: '楼层详情管理', name: 'floor_manage_detail', component: resolve => { require(['./views/main/operateMoudle/shop_index_manage/floor_manage_detail.vue'], resolve); } },
        //客户管理--定向价格详情页
        { path: '/custon-manage/orienteering-price/detail', meta: {belong: 'orienteering-price', tmpNew: true, path: '/custom_manage/orienteering-price', title: '定向价格'}, title: '定向价格详情', name: 'orienteering-price-detail', component: resolve => { require(['./views/main/serviceModule/orienteeringPrice/detail.vue'], resolve); } },
        { path: '/custon-manage/orienteering-price/add', meta: {belong: 'orienteering-price', tmpNew: true, path: '/custom_manage/orienteering-price', title: '定向价格'}, title: '定向价格新增', name: 'orienteering-price-add', component: resolve => { require(['./views/main/serviceModule/orienteeringPrice/add.vue'], resolve); } },
        //备货修改单--详情页
        { path: '/purchase/purchase-manage/purchaseBHedit/detail', meta: {belong: 'purchase_manage_BH_edit_index', tmpNew: true, path: '/purchase_manage/BH_index_edit', title: '备货修改单'}, title: '备货修改单详情', name: 'purchase_manage_BH_edit_detail', component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBHedit/detail.vue'], resolve); } },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// 销售模块 共用团队分析、客户分析
export const appRouter = [
    {
        path: '/team_analysis',
        icon: 'android-contacts',
        title: '团队分析',
        name: 'team_analysis',
        order: 21,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'android-contacts',
                name: 'team_analysis_index',
                title: '团队分析',
                component: resolve => { require(['./views/main/salesModule/team_analysis/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/sales_ranking',
        icon: 'connection-bars',
        title: '销售排行',
        name: 'sales_rank',
        order: 22,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'connection-bars',
                name: 'salesRinking_index',
                title: '销售排行',
                component: resolve => { require(['./views/main/salesModule/sales_ranking/index.vue'], resolve); }
            }
        ]
    },
    // {
    //     path: '/customer_analysis',
    //     icon: 'ios-people',
    //     title: '客户分析',
    //     name: 'custom_analyze',
    //     order: 20,
    //     component: Main,
    //     children: [
            
    //     ]
    // },
    // {
    //     path: '/customer_search',
    //     icon: 'ios-people',
    //     title: '备案查询',
    //     name: 'custom_search',
    //     order: 20,
    //     component: Main,
    //     children: [
            
    //     ]
    // },
    {
        path: '/customer_distri',
        icon: 'ios-pie',
        title: '客户分布',
        name: 'customer_distri',
        order: 23,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'ios-pie',
                name: 'customer_distri_index',
                title: '客户分布',
                component: resolve => { require(['./views/main/salesModule/customer_distri/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/goods_analyze',
        icon: 'ios-paper',
        title: '商品分析',
        name: 'goods_analyze',
        order: 24,
        component: Main,
        children: [
            {
                path: 'goods_brand_analyze',
                icon: 'social-codepen',
                name: 'goods_brand_analyze',
                title: '品牌分析',
                component: resolve => { require(['./views/main/salesModule/goods_analyze/brand_analyze.vue'], resolve); }
            },
            {
                path: 'goods_goods_analyze',
                icon: 'ios-paper',
                name: 'goods_goods_analyze',
                title: '商品分析',
                component: resolve => { require(['./views/main/salesModule/goods_analyze/goods_analyze.vue'], resolve); }
            }
        ]
    },
    {
        path: '/order_manage',
        icon: 'navicon-round',
        title: '订单管理',
        name: 'order_manage',
        order: 25,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'compose',
                name: 'order_manage_index',
                title: '订单管理',
                component: resolve => { require(['./views/main/salesModule/order_manage/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/custom_manage',
        icon: 'navicon-round',
        title: '客户管理',
        name: 'custom_manage',
        order: 26,
        component: Main,
        children: [
            {
                path: 'custom_search_index',
                icon: 'ios-people',
                name: 'custom_search_index',
                title: '备案查询',
                component: resolve => { require(['./views/main/serviceModule/custom_search/index.vue'], resolve); }
            },
            {
                path: 'custom_manage_index',
                icon: 'compose',
                name: 'custom_manage_index',
                title: '客户管理',
                component: resolve => { require(['./views/main/salesModule/custom_manage/index.vue'], resolve); }
            },
            {
                path: 'custom_analyze_index',
                icon: 'ios-people',
                name: 'custom_analyze_index',
                title: '客户分析',
                component: resolve => { require(['./views/main/salesModule/custom_analyze/index.vue'], resolve); }
            },
            {
                path: 'service-custom-index',
                icon: 'compose',
                name: 'service-custom-index',
                title: '客户信息',
                component: resolve => { require(['./views/main/serviceModule/custom_info/index.vue'], resolve); }
            },
            {
                path: 'service-custom-distribution-index',
                icon: 'compose',
                name: 'service-custom-distribution-index',
                title: '客户分配',
                component: resolve => { require(['./views/main/serviceModule/custom_distribution/index.vue'], resolve); }
            },
            {
                path: 'orienteering-price',
                icon: 'compose',
                name: 'orienteering-price',
                title: '定向价格',
                component: resolve => { require(['./views/main/serviceModule/orienteeringPrice/index.vue'], resolve); }
            }
        ]
    },
    /*客服角色 共用团队分析、客户分析*/
    {
        path: '/service/sales-manage',
        icon: 'navicon-round',
        title: '销售管理',
        name: 'service-sales-manage',
        order: 1,
        component: Main,
        children: [
            {
                path: 'xshtd',
                icon: 'ios-list-outline',
                name: 'service-sales-htd',
                title: '销售合同单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xshtd/xshtd.vue'], resolve); }
            },
            {
                path: 'HT_detailList',
                icon: 'compose',
                name: 'purchase_manage_HT_detailList',
                title: '合同单明细',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/detailList.vue'], resolve); }
            }, 
            {
                path: 'HT_toRequire',
                icon: 'compose',
                name: 'purchase_manage_HT_toRequire',
                title: '待请购明细',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/dqgmx/index.vue'], resolve); }
            },
            {
                path: 'HT_toInvoice',
                icon: 'compose',
                name: 'purchase_manage_HT_toInvoice',
                title: '待开票明细',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/dkpmx/index.vue'], resolve); }
            },
            {
                path: 'htxgd',
                icon: 'compose',
                name: 'purchase_manage_htxgd',
                title: '合同修改单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/htxgd/index.vue'], resolve); }
            },            
            {
                path: 'xsqgd',
                icon: 'ios-list-outline',
                name: 'service-sales-xsqgd',
                title: '销售请购单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xsqgd/index.vue'], resolve); }
            },
            {
                path: 'xsqgxgd',
                icon: 'ios-list-outline',
                name: 'service-sales-qgxgd',
                title: '请购修改单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xsqgxgd/index.vue'], resolve); }
            },
            {
                path: 'xsskd',
                icon: 'ios-list-outline',
                name: 'service-sales-skd',
                title: '销售收款单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xsskd/index.vue'], resolve); }
            },
            {
                path: 'xsckd',
                icon: 'ios-list-outline',
                name: 'service-sales-ckd',
                title: '销售出库单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xsckd/index.vue'], resolve); }
            },
            {
                path: 'thsqd',
                icon: 'ios-list-outline',
                name: 'service-sales-thsqd',
                title: '退货申请单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/thsqd/index.vue'], resolve); }
            },
            {
                path: 'xsthd',
                icon: 'ios-list-outline',
                name: 'service-sales-thd',
                title: '销售退货单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xsthd/index.vue'], resolve); }
            },
            {
                path: 'thrkd',
                icon: 'ios-list-outline',
                name: 'service-sales-thrkd',
                title: '退货入库单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/thrkd/index.vue'], resolve); }
            },
            {
                path: 'xstkd',
                icon: 'ios-list-outline',
                name: 'service-sales-tkd',
                title: '销售退款单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xstkd/index.vue'], resolve); }
            },
            {
                path: 'xskpd',
                icon: 'ios-list-outline',
                name: 'service-xskpd-index',
                title: '销售开票单',
                component: resolve => { require(['./views/main/serviceModule/sales_manage/xskpd/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/service/query-manage',
        icon: 'clipboard',
        title: '询价管理',
        name: 'service-query-manage',
        order: 2,
        component: Main,
        children: [
            {
                path: 'query-list',
                icon: 'compose',
                name: 'service-query-list',
                title: '询价单列表',
                component: resolve => { require(['./views/main/serviceModule/query_manage/query_list.vue'], resolve); }
            }
        ]
    },
    {
        path: '/service/article_mamage',
        icon: 'clipboard',
        title: '文章管理',
        name: 'article_mamage',
        order: 2,
        component: Main,
        children: [
            {
                path: 'announce-list',
                icon: 'compose',
                name: 'article_announce_list',
                title: '宜电公告',
                component: resolve => { require(['./views/main/serviceModule/article_manage/announceIndex.vue'], resolve); }
            },
            {
                path: 'help-list',
                icon: 'compose',
                name: 'article_help_list',
                title: '帮助中心',
                component: resolve => { require(['./views/main/serviceModule/article_manage/helpIndex.vue'], resolve); }
            },
            {
                path: 'notice-list',
                icon: 'compose',
                name: 'article_notice_list',
                title: '内部通知',
                component: resolve => { require(['./views/main/serviceModule/article_manage/noticeIndex.vue'], resolve); }
            },
            {
                path: 'column-list',
                icon: 'compose',
                name: 'article_column_list',
                title: '栏目管理',
                component: resolve => { require(['./views/main/serviceModule/article_manage/columnIndex.vue'], resolve); }
            }
        ]
    },
    // {
    //     path: '/service/custom-infos',
    //     icon: 'android-contacts',
    //     title: '客户信息',
    //     name: 'service-custom-infos',
    //     order: 3,
    //     component: Main,
    //     children: [
    //         {
    //             path: 'custom-index',
    //             icon: 'compose',
    //             name: 'service-custom-index',
    //             title: '客户信息',
    //             component: resolve => { require(['./views/main/serviceModule/custom_info/index.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/service/custom-distribution',
    //     icon: 'pin',
    //     title: '客户分配',
    //     name: 'service-custom-distribution',
    //     order: 4,
    //     component: Main,
    //     children: [
            
    //     ]
    // },
    /*数据分析*/
    {
        path: '/service/wind_control',
        icon: 'pin',
        title: '数据分析',
        name: 'wind-control',
        order: 36,
        component: Main,
        children: [
            {
                path: 'gross-profit-analyse',
                icon: 'compose',
                name: 'gross-profit-analyse',
                title: '毛利分析',
                component: resolve => { require(['./views/main/serviceModule/wind_control/grossProfitAnalyse/index.vue'], resolve); }
            },
            {
                path: 'sale',
                icon: 'compose',
                name: 'wind-control-sale',
                title: '销售风控',
                component: resolve => { require(['./views/main/serviceModule/wind_control/sale_control.vue'], resolve); }
            },
            {
                path: 'buy',
                icon: 'compose',
                name: 'wind-control-buy',
                title: '采购风控',
                component: resolve => { require(['./views/main/serviceModule/wind_control/buy_control.vue'], resolve); }
            }
        ]
    },
    {
        path: '/service/invoice-manage',
        icon: 'ios-albums-outline',
        title: '发票管理',
        name: 'service-invoice-manage',
        order: 5,
        component: Main,
        children: [
            {
                path: 'invoice-list',
                icon: 'ios-paper-outline',
                name: 'service-invoice-set',
                title: '发票设置',
                component: resolve => { require(['./views/main/serviceModule/invoice_manage/invoice_set.vue'], resolve); }
            },
            {
                path: 'make-invoice',
                icon: 'ios-paper-outline',
                name: 'service-make-invoice',
                title: '开票管理',
                component: resolve => { require(['./views/main/serviceModule/invoice_manage/make_invoice.vue'], resolve); }
            }
        ]
    },
    {
        path: '/service/sales_ranking',
        icon: 'connection-bars',
        title: '客服排行',
        name: 'service-sales-ranking',
        order: 6,
        component: Main,
        children: [
            {
                path: 'rank_list',
                icon: 'compose',
                name: 'service-sales-list',
                title: '排行列表',
                component: resolve => { require(['./views/main/serviceModule/sales_ranking/index.vue'], resolve); }
            }
        ]
    },

    /** 运营菜单 **/
    {
        path: '/operate_goods_manage',
        icon: 'social-buffer',
        title: '商品管理',
        name: 'operate_goods_manage',
        order: 27,
        component: Main,
        children: [
            {
                path: 'mange_list',
                icon: 'compose',
                name: 'operate_goods_manage_index',
                title: '商品管理',
                component: resolve => { require(['./views/main/operateMoudle/goods_manage/index.vue'], resolve); }
            },
            {
                path: 'price_list',
                icon: 'compose',
                name: 'operate_goods_price_manage_index',
                title: '商品价格管理',
                component: resolve => { require(['./views/main/operateMoudle/goods_manage/price_index.vue'], resolve); }
            },
            {
                path: 'add_list',
                icon: 'compose',
                name: 'operate_goods_add_manage_index',
                title: '新增单列表',
                component: resolve => { require(['./views/main/operateMoudle/goods_manage/new_index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/operate_product_manage',
        icon: 'social-buffer',
        title: '产品管理',
        name: 'operate_product_manage',
        order: 28,
        component: Main,
        children: [
            {
                path: 'product_brand',
                icon: 'compose',
                name: 'operate_product_brand_index',
                title: '品牌管理',
                component: resolve => { require(['./views/main/operateMoudle/product_manage/product_brand/index.vue'], resolve); }
            },
            {
                path: 'product_type',
                icon: 'compose',
                name: 'operate_product_type_index',
                title: '类别管理',
                component: resolve => { require(['./views/main/operateMoudle/product_manage/product_type/index.vue'], resolve); }
            },
            {
                path: 'products',
                icon: 'compose',
                name: 'operate_products_index',
                title: '产品管理',
                component: resolve => { require(['./views/main/operateMoudle/product_manage/products/index.vue'], resolve); }
            },
            {
                path: 'products-new',
                icon: 'compose',
                name: 'operate_products_new_index',
                title: '产品新增单',
                component: resolve => { require(['./views/main/operateMoudle/product_manage/new/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/operate_sales_manage',
        icon: 'social-buffer',
        title: '营销管理',
        name: 'operate_sales_manage',
        order: 29,
        component: Main,
        children: [
            {
                path: 'limit_sales',
                icon: 'compose',
                name: 'operate_sales_limit_time',
                title: '限时秒杀',
                component: resolve => { require(['./views/main/operateMoudle/sales_manage/index.vue'], resolve); }
            },
            {
                path: 'series_discount',
                icon: 'compose',
                name: 'operate_sales_manage_series_discount',
                title: '系列折扣',
                component: resolve => { require(['./views/main/operateMoudle/discount_manage/series-index.vue'], resolve); }
            },
            {
                path: 'brand_discount',
                icon: 'compose',
                name: 'operate_sales_manage_brand_discount',
                title: '品牌折扣',
                component: resolve => { require(['./views/main/operateMoudle/discount_manage/brand-index.vue'], resolve); }
            },
            {
                path: 'order_discount',
                icon: 'compose',
                name: 'operate_sales_manage_order_discount',
                title: '订单折扣',
                component: resolve => { require(['./views/main/operateMoudle/discount_manage/order-index.vue'], resolve); }
            },
            
        ]
    },
    {
        path: '/identifying_code',
        icon: 'social-buffer',
        title: '验证码查询',
        name: 'identifying_code',
        order: 30,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'compose',
                name: 'identifying_code_index',
                title: '验证码查询',
                component: resolve => { require(['./views/main/operateMoudle/identifying_code/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/carriage_manage',
        icon: 'social-buffer',
        title: '运费管理',
        name: 'carriage_manage',
        order: 30,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'compose',
                name: 'carriage_manage_index',
                title: '运费管理',
                component: resolve => { require(['./views/main/operateMoudle/carriage_manage/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/stock_synchronous',
        icon: 'social-buffer',
        title: '库存同步',
        name: 'stock_synchronous',
        order: 30,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'compose',
                name: 'stock_synchronous_index',
                title: '同步管理',
                component: resolve => { require(['./views/main/operateMoudle/stock_synchronous/index.vue'], resolve); }
            }
        ]
    },

    {
        path: '/customer_manage',
        icon: 'social-buffer',
        title: '客户配置',
        name: 'customer_manage',
        order: 30,
        component: Main,
        children: [
            {
                path: 'customer_source',
                icon: 'compose',
                name: 'customer_source_index',
                title: '客户来源设置',
                component: resolve => { require(['./views/main/operateMoudle/customer_source/index.vue'], resolve); }
            },
            {
                path: 'customer_type',
                icon: 'compose',
                name: 'customer_type_index',
                title: '客户类型设置',
                component: resolve => { require(['./views/main/operateMoudle/customer_type/index.vue'], resolve); }
            },
            {
                path: 'customer_grade',
                    icon: 'compose',
                name: 'customer_grade_index',
                title: '客户等级设置',
                component: resolve => { require(['./views/main/operateMoudle/customer_grade/index.vue'], resolve); }
            },
        ]
    },

    {
        path: '/shop_manage',
        icon: 'social-buffer',
        title: '商城首页',
        name: 'shop_manage',
        order: 31,
        component: Main,
        children: [
            {
                path: 'shop_goods_category',
                icon: 'compose',
                name: 'shop_goods_category',
                title: '目录管理',
                component: resolve => { require(['./views/main/operateMoudle/shop_index_manage/shop_goods_category.vue'], resolve); }
            },
            {
                path: 'carousel_manage',
                icon: 'compose',
                name: 'carousel_manage',
                title: '轮播管理',
                component: resolve => { require(['./views/main/operateMoudle/shop_index_manage/carousel_manage.vue'], resolve); }
            },
            {
                path: 'activity_recommened',
                icon: 'compose',
                name: 'activity_recommened',
                title: '活动推荐',
                component: resolve => { require(['./views/main/operateMoudle/shop_index_manage/activity_recommened.vue'], resolve); }
            },
            {
                path: 'floor_manage',
                icon: 'compose',
                name: 'floor_manage',
                title: '楼层管理',
                component: resolve => { require(['./views/main/operateMoudle/shop_index_manage/floor_manage.vue'], resolve); }
            },
        ]
    },
    {
        path: '/points_manage',
        icon: 'social-buffer',
        title: '积分管理',
        name: 'points_manage',
        order: 31,
        component: Main,
        children: [
            {
                path: 'points_goods_manage',
                icon: 'compose',
                name: 'points_goods_manage',
                title: '积分商品',
                component: resolve => { require(['./views/main/operateMoudle/points_manage/points_goods_manage.vue'], resolve); }
            },
            {
                path: 'exchange_order',
                icon: 'compose',
                name: 'exchange_order',
                title: '积分兑换单',
                component: resolve => { require(['./views/main/operateMoudle/points_manage/exchange_order.vue'], resolve); }
            }
        ]
    },

    /* 采购管理模块 */
    {
        path: '/purchase_manage',
        icon: 'social-buffer',
        title: '采购管理',
        name: 'purchase_manage',
        order: 33,
        component: Main,
        children: [
            {
                path: 'BH_index',
                icon: 'compose',
                name: 'purchase_manage_BH_index',
                title: '采购备货单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBH/index.vue'], resolve); }
            },
            {
                path: 'BH_index_edit',
                icon: 'compose',
                name: 'purchase_manage_BH_edit_index',
                title: '备货修改单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseBHedit/index.vue'], resolve); }
            },
            {
                path: 'ready_buy_goods',
                icon: 'compose',
                name: 'purchase_manage_ready_buy',
                title: '待采购商品',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/add.vue'], resolve); }
            },
            {
                path: 'HT_index',
                icon: 'compose',
                name: 'purchase_manage_HT_index',
                title: '采购合同单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHT/home.vue'], resolve); }
            },
            {
                path: 'HTedit_index',
                icon: 'compose',
                name: 'purchase_manage_HTedit_index',
                title: '合同修改单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseHTedit/index.vue'], resolve); }
            },
            {
                path: 'FK_index',
                icon: 'compose',
                name: 'purchase_manage_FK_index',
                title: '采购付款单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFK/index.vue'], resolve); }
            },
            {
                path: 'FH_index',
                icon: 'compose',
                name: 'purchase_manage_FH_index',
                title: '采购发货单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFH/index.vue'], resolve); }
            },
            {
                path: 'FH_edit',
                icon: 'compose',
                name: 'purchase_FHedit_index',
                title: '发货修改单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseFHedit/index.vue'], resolve); }
            },
            {
                path: 'RK_index',
                icon: 'compose',
                name: 'purchase_manage_RK_index',
                title: '采购入库单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseRK/index.vue'], resolve); }
            },
            {
                path: 'SP_index',
                icon: 'compose',
                name: 'purchase_manage_SP_index',
                title: '采购收票单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseSP/home.vue'], resolve); }
            },
            {
                path: 'TH_index',
                icon: 'compose',
                name: 'purchase_manage_TH_index',
                title: '采购退货单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTH/index.vue'], resolve); }
            },
            {
                path: 'TK_index',
                icon: 'compose',
                name: 'purchase_manage_TK_index',
                title: '采购退款单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseTK/index.vue'], resolve); }
            },
            {
                path: 'CK_index',
                icon: 'compose',
                name: 'purchase_manage_CK_index',
                title: '采购出库单',
                component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseCK/index.vue'], resolve); }
            },
            // {
            //     path: 'CP_index',
            //     icon: 'compose',
            //     name: 'purchase_manage_CP_index',
            //     title: '采购产品负责人',
            //     component: resolve => { require(['./views/main/purchaseModule/purchaseMange/purchaseCP/index.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/my_work_table',
        icon: 'navicon-round',
        title: '我的工作台',
        name: 'my_work_table',
        order: 0,
        component: Main,
        children: [
            {
                path: 'my_launch',
                icon: 'paper-airplane',
                name: 'my_work_table_launch',
                title: '发起的任务',
                component: resolve => { require(['./views/main/purchaseModule/myWorkSpace/launch_index.vue'], resolve); }
            },
            {
                path: 'my_todo',
                icon: 'pin',
                name: 'my_work_table_todo',
                title: '待办的任务',
                component: resolve => { require(['./views/main/purchaseModule/myWorkSpace/todo_index.vue'], resolve); }
            },
            {
                path: 'my_done',
                icon: 'android-done',
                name: 'my_work_table_done',
                title: '已办的任务',
                component: resolve => { require(['./views/main/purchaseModule/myWorkSpace/done_index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/my_message',
        icon: 'navicon-round',
        title: '我的消息',
        name: 'my_message',
        order: 0,
        component: Main,
        children: [
            {
                path: 'my_message_index',
                icon: 'paper-airplane',
                name: 'my_message_index',
                title: '我的消息',
                component: resolve => { require(['./views/main/myMessage/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/purchase_apply',
        icon: 'social-buffer',
        title: '供应链管理',
        name: 'purchase_apply_list',
        order: 31,
        component: Main,     
        children: [
            {
                path: 'list',
                icon: 'ios-information-outline',
                name: 'purchase_apply_index',
                title: '供应商信息',
                component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/applyInfo/index.vue'], resolve); }
            },
            {
                path: 'strategy_table',
                icon: 'ios-crop',
                name: 'purchase_strategy_table',
                title: '采购策略表',
                component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/strategyTable/index.vue'], resolve); }
            },
            {
                path: 'supply_analyse',
                icon: 'ios-crop',
                name: 'supply_analyse',
                title: '供应商分析',
                component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/supplyAnalyse/index.vue'], resolve); }
            },
            {
                path: 'product_table',
                icon: 'ios-crop',
                name: 'purchase_product_table',
                title: '采购产品表',
                component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/productTable/index.vue'], resolve); }
            },
            {
                path: 'product_owner',
                icon: 'ios-crop',
                name: 'purchase_product_owner',
                title: '产品负责人',
                component: resolve => { require(['./views/main/purchaseModule/supplyChainManage/poductOwner/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/purchase_consultation',
        icon: 'social-buffer',
        title: '商品采购咨询',
        name: 'purchase_consultation',
        order: 32,
        component: Main,
        children: [
            {
                path: 'toBeConfirmed',
                icon: 'ios-information-outline',
                name: 'purchase_tobe_confirm',
                title: '待确认明细',
                component: resolve => { require(['./views/main/purchaseModule/purchaseConsultation/toBeConfirmed.vue'], resolve); }
            }
        ]
    },
    //财务模块
    {
        path: '/finance_manage',
        icon: 'cash',
        title: '财务管理',
        name: 'finance_manage',
        order: 35,
        component: Main,     
        children: [
            {
                path: 'gathOrder',
                icon: 'cash',
                name: 'gath_order',
                title: '财务收款单',
                component: resolve => { require(['./views/main/financeModule/financeGath/index.vue'], resolve); }
            },
            {
                path: 'refundOrder',
                icon: 'cash',
                name: 'refund_order',
                title: '财务退款单',
                component: resolve => { require(['./views/main/financeModule/financeRefund/index.vue'], resolve); }
            },
            {
                path: 'breakRefund',
                icon: 'cash',
                name: 'break_refund',
                title: '违约扣款单',
                component: resolve => { require(['./views/main/financeModule/breakRefund/index.vue'], resolve); }
            },
            {
                path: 'cashPool',
                icon: 'cash',
                name: 'cash_pool',
                title: '客户资金池',
                component: resolve => { require(['./views/main/financeModule/cashPool/index.vue'], resolve); }
            },
            {
                path: 'outBoundCost',
                icon: 'cash',
                name: 'out_bound_cost_index',
                title: '出库单成本',
                component: resolve => { require(['./views/main/financeModule/outBoundCost/index.vue'], resolve); }
            },
            {
                path: 'outBoundBill',
                icon: 'cash',
                name: 'out_bound_bill_index',
                title: '库存明细账',
                component: resolve => { require(['./views/main/financeModule/outBoundBill/index.vue'], resolve); }
            },
            {
                path: 'outBoundDetail',
                icon: 'cash',
                name: 'out_bound_detail_index',
                title: '出入库明细',
                component: resolve => { require(['./views/main/financeModule/outBoundDetail/index.vue'], resolve); }
            }
        ]
    },
    //仓库管理
    {
        path: '/store_manage',
        icon: 'social-dropbox-outline',
        title: '仓库管理',
        name: 'store_manage',
        order: 34,
        component: Main,
        children: [
            {
                path: 'storage_info',
                icon: 'ios-list-outline',
                name: 'storage_info',
                title: '仓库信息',
                component: resolve => { require(['./views/main/storeModule/storageInfo/index.vue'], resolve); }
            },
            {
                path: 'location_list',
                icon: 'ios-list-outline',
                name: 'location_list',
                title: '商品库位表',
                component: resolve => { require(['./views/main/storeModule/LocationList/index.vue'], resolve); }
            },
            {
                path: 'apply_info',
                icon: 'ios-list-outline',
                name: 'apply_info',
                title: '供货信息',
                component: resolve => { require(['./views/main/storeModule/applyInfo/index.vue'], resolve); }
            },
            {
                path: 'goods_in_storage',
                icon: 'ios-list-outline',
                name: 'goods_in_storage',
                title: '现货查询',
                component: resolve => { require(['./views/main/storeModule/goodsInStorage/index.vue'], resolve); }
            },
            {
                path: 'goods_on_way',
                icon: 'ios-list-outline',
                name: 'goods_on_way',
                title: '在途查询',
                component: resolve => { require(['./views/main/storeModule/goodsOnWay/index.vue'], resolve); }
            },
            {
                path: 'freight-register',
                icon: 'cash',
                name: 'freight-register',
                title: '运费登记单',
                component: resolve => { require(['./views/main/storeModule/freightRegister/index.vue'], resolve); }
            },
            {
                path: 'packing-list',
                icon: 'cash',
                name: 'packing-list',
                title: '盘盈入库单',
                component: resolve => { require(['./views/main/storeModule/packingList/index.vue'], resolve); }
            },
            {
                path: 'treasury-loss',
                icon: 'cash',
                name: 'treasury-loss',
                title: '盘亏出库单',
                component: resolve => { require(['./views/main/storeModule/treasuryLoss/index.vue'], resolve); }
            }
        ]
    },
    //管理员组织权限模块
    {
        path: '/authority',
        icon: 'social-dropbox-outline',
        title: '组织权限管理',
        name: 'authority',
        order: 36,
        component: Main,     
        children: [
            {
                path: 'organize_manage',
                icon: 'ios-list-outline',
                name: 'organize_manage',
                title: '组织管理',
                component: resolve => { require(['./views/main/managerModule/authorityManage/organizeManage/index.vue'], resolve); }
            },
            {
                path: 'role_permission',
                icon: 'ios-list-outline',
                name: 'role_permission',
                title: '角色权限',
                component: resolve => { require(['./views/main/managerModule/authorityManage/rolePermission/index.vue'], resolve); }
            },
            {
                path: 'staff_manage',
                icon: 'ios-list-outline',
                name: 'staff_manage',
                title: '员工管理',
                component: resolve => { require(['./views/main/managerModule/staffManage/index.vue'], resolve); }
            }
        ]
    },
    {
        path: '/purchase_apply_query',
        icon: 'navicon-round',
        title: '供应链表查询',
        name: 'purchase_apply_query',
        order: 40,
        component: Main,
        children: [
            {
                path: 'all_index',
                icon: 'paper-airplane',
                name: 'purchase_apply_query_index',
                title: '供应链表查询',
                component: resolve => { require(['./views/main/purchaseModule/purchaseApplyQuery/index.vue'], resolve); }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
