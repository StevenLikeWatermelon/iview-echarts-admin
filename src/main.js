import Vue from 'vue';
import iView from 'iview';
import {Table, TableColumn, Popover, Select, Option, Input} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import {routers, otherRouter, appRouter} from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import axios from 'axios';
import App from './app.vue';
import Cookies from 'js-cookie';
import 'iview/dist/styles/iview.css';

//自定义
import { post, fetch, patch, put } from './config/fetch';
import { isset, notempty, getStore, setStore, sortBy, tableRowClassName} from '@/config/mUtils';

//高精度四则运算
import {add, subtract, multiply, divide} from 'high-precision-four-fundamental-rules';

//全局变更table默认最大高度
Table.props.maxHeight = {
    type: [String, Number],
    default: 570
}

//全局变更TableColumn showOverflowTooltip 为true
TableColumn.props.showOverflowTooltip = {
    type: Boolean,
    default: true
}

//全局变更errorMassage显示方式，所有错误信息都需要手动关闭，持续时间10s
iView.Message.error = function error(options, duration = 10) {
    if (typeof options === 'string') {
        options = {
            content: options,
            closable: true,
            duration: duration
        };
    }
    return iView.Message.message('error', options);
}

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(iView);

//自定义
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$http = axios;
Vue.prototype.isset = isset;
Vue.prototype.notempty = notempty;
Vue.prototype.tableRowClassName = tableRowClassName;

// 加减乘除四则运算
Vue.prototype.add = add;
Vue.prototype.subtract = subtract;
Vue.prototype.multiply = multiply;
Vue.prototype.divide = divide;
// 当前图片上传和接口前缀
Vue.prototype.imgURL = 'http://localhost:3001/';
Vue.prototype.baseUrl = 'http://localhost:3001/'

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};
//权限标记
const hasAccess = 1;

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (Cookies.get('locking') === '1' && to.name !== 'locking') {  // 判断当前是否是锁定状态
        next(false);
        router.replace({
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('session_id') && to.name !== 'login') {  // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('session_id') && to.name === 'login') {  // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            var localAllMenuList = getStore('localAllMenuList') ? JSON.parse(getStore('localAllMenuList')) : [];
            if ((Util.getRouterObjByName(localAllMenuList, to.name).access === hasAccess ) || to.name == 'error_401' || to.name == 'login' || to.name == 'ownspace_index' || to.name == 'ownspace_personal_info' || to.name == 'ownspace_edit_password') {
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);  // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
            } else {
                next(false);
                router.replace({
                    name: 'error_401',
                    query: {
                        debugName: to.name,
                        debugAccess: to.access
                    }
                });
            }
        }
    }
    iView.LoadingBar.finish();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
// 状态管理
const store = new Vuex.Store({
    state: {
        routers: [
            otherRouter,
            ...appRouter
        ],
        menuList: [],
        tagsList: [...otherRouter.children],
        pageOpenedList: [],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],  // 面包屑数组
        openedSubmenuArr: [],  // 要展开的菜单数组
        menuTheme: '', // 主题
        theme: '',
        cachePage: [],
        //共用时间范围
        sharedDateRange: [],
        watchWeekArr: [],
        watchMonthArr: [],
        watchThirtyArr: [],
        currentTab: 0,
        logOutModal: false,
        isGoback: false,
        hasShared: false,
        //消息更新标记
        messageChangeMark: undefined,
    },
    getters: {

    },
    mutations: {
        updateMessageAction(state, mark) {
            state.messageChangeMark = mark;
        },
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        increateTag (state, tagObj) {
            state.cachePage.push(tagObj.name);
            state.pageOpenedList.push(tagObj);
        },
        initCachepage (state) {
            if (localStorage.pageOpenedList) {
                state.cachePage = JSON.parse(localStorage.pageOpenedList).map(item => {
                    if (item.name !== 'home_index') {
                        return item.name;
                    }
                });
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            router.push({
                name: 'home_index'
            });
            state.cachePage = [];
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.theme = mainTheme;
        },
        lock (state) {
            Cookies.set('locking', '1');
        },
        unlock (state) {
            Cookies.set('locking', '0');
        },
        setMenuList (state, menulist) {
            state.menuList = menulist;
        },
        updateMenulist (state) {
             // 权限菜单过滤相关
            let authArr = getStore('authArr') ? JSON.parse(getStore('authArr')) : [];
            if (authArr && authArr.length) {
                let accessCode = hasAccess;
                let menuList = [];
                let tmpObj = {};
                authArr.forEach(item => {
                    tmpObj[item] = true;
                });
                state.routers.forEach(item => {
                    if (tmpObj[item.name]) {
                        item.access = 1;
                    } else {
                        item.access = 0;
                    }
                    delete tmpObj[item.name];
                    if (item.children && item.children.length) {
                        item.children.forEach(item => {
                            if (tmpObj[item.name]) {
                                item.access = 1;
                            } else {
                                item.access = 0;
                            }
                            delete tmpObj[item.name];
                        });
                    }
                });
                setStore('localAllMenuList', JSON.stringify(state.routers));
                setStore('notRouteAuth', JSON.stringify(tmpObj));
                let tmpAppRouter = JSON.parse(JSON.stringify(appRouter));
                tmpAppRouter.forEach((item, index) => {
                    if (item.access !== undefined) {
                        if (Util.showThisRoute(item.access, accessCode)) {
                            if (item.children.length === 1) {
                                menuList.push(item);
                            } else {
                                let len = menuList.push(item);
                                let childrenArr = [];
                                childrenArr = item.children.filter(child => {
                                    if (child.access !== undefined) {
                                        if (child.access === accessCode) {
                                            return child;
                                        }
                                    } else {
                                        return child;
                                    }
                                });
                                menuList[len - 1].children = childrenArr;
                            }
                        }
                    }
                });
                menuList.sort(sortBy('order', false));
                state.menuList = menuList;
            } else {
                this.$Message && this.$Message.error('获取菜单权限失败');
            }
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        broadcastSharedDateRange (state, dateRange) {
            state.sharedDateRange = dateRange;

        },
        commitWeek (state, dateRange) {
            state.watchWeekArr = JSON.parse(JSON.stringify(dateRange));
        },
        commitMonth (state, dateRange) {
            state.watchMonthArr = JSON.parse(JSON.stringify(dateRange));
        },
        commitThirty (state, dateRange) {
            state.watchThirtyArr = JSON.parse(JSON.stringify(dateRange));
        },
        changeCurrentTab (state, tabIndex) {
            state.currentTab = tabIndex;
        },
        broadcastShareState (state, shareState) {
            state.hasShared = shareState;
        },
        showLogOutModal (state, type) {
            state.logOutModal = type;
        },
        gobackState (state, type) {
            state.isGoback = type;
        }
    },
    actions: {

    }
});

Vue.config.silent = true

//注册权限控制指令
Vue.directive('auth', {
    inserted: function (el, binding) {
        if (getStore('notRouteAuth')) {
            let notRouteAuthObj = JSON.parse(getStore('notRouteAuth'));
            let authName = binding.value;
            let hasAuth = false;
            for (let key in notRouteAuthObj) {
                if (key === authName) {
                    hasAuth = true;
                }
            }
            if (!hasAuth) {
                el.parentNode.removeChild(el);
            }
        }
    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
