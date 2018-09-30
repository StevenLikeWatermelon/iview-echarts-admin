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
        { path: '/custom_manage/detail', meta: {belong: 'custom_manage_index', path: '/order_manage/index',  title: '订单管理'}, title: '客户详情', name: 'custom_manage_detail', component: resolve => { require(['./views/main/salesModule/custom_manage/detail.vue'], resolve); } },
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
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
