<style lang="less">
    @import "./main.less";
    .el-table .selected-row {
        background: #c8eae4;
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'160px', overflow: hideMenuText ? 'visible' : 'auto', background: $store.state.menuTheme === 'dark'?'#495060':'white'}">
            <div class="logo-con margin-top-20" @click="goToIndex" style="cursor: pointer;">
                <transition-group name="logo-img">
                    <img v-show="!hideMenuText"  src="../images/logo-min.jpg" key="max-logo" >
                    <img v-show="hideMenuText" src="../images/logo-min.jpg" key="min-logo" style="width: 100%;">
                </transition-group>
            </div>
            <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14"/>
            <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList"/>
        </div>
        <div class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'160px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con" style="width:220px;">
                        <Row type="flex" justify="space-between" align="middle" class="user-dropdown-innercon">
                            <Col span="8">
                                <a href="javascript:void(0)" @click="showUserRole">
                                    <span class="main-user-name">{{ currentRoleName }}</span>
                                </a>
                            </Col>
                            <Col span="8">
                                <a href="javascript:void(0)" @click="showUserinfo">
                                    <span class="main-user-name">{{ userName }}</span>
                                </a>
                            </Col>
                            <Col span="8"  :class="{'bounce': (+totalNotReadNum > 0 && showBounce)}">
                                <a href="javascript:void(0)" @click="showMyMessage">
                                    <span class="main-user-name"  @mouseover="showBounce = false" @mouseout="showBounce = true">消息<span style="color:#CC0000;">{{totalNotReadNum}}</span></span>
                                </a>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: hideMenuText?'60px':'160px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <Modal v-model="showLogOut" width="360" :closable="false" :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p>您的登录信息已失效，</p>
                <p>系统将在 <span style="color: #cf0012">{{countDown}}</span> 秒后自动退出</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="logOutNow">立即登录</Button>
            </div>
        </Modal>
        <div class="main-right-slide" :class="{'show-right': showRight}">
            <div class="main-right-head">
                <div v-show="currentRightDiv == 0">
                    <span class="title">我的账户</span>
                </div>
                <div v-show="currentRightDiv == 1">
                    <span class="title">我的角色</span>
                </div>
                <div v-show="currentRightDiv == 2">
                    <span class="title">我的消息</span>
                </div>
                <div style="width:60px;height:60px;display:flex;justify-content: center;align-items: center;cursor: pointer;" @click="showRightToggle">
                    <img src="../images/close-main.png" style="display:block;width:24px;cursor: pointer;">
                </div>
            </div>
            <div style="height:calc(100% - 60px); overflow:auto;padding: 0 20px 0 35px;"  v-show="currentRightDiv == 0">
                <div class="main-right-content">
                    <a @click="handleClickUserChecked('person_info')"><span>个人信息</span></a>
                </div>
                <div class="main-right-content">
                    <a @click="handleClickUserChecked('edit_password')"><span>修改密码</span></a>
                </div>
                <div class="main-right-content">
                    <a @click="handleClickUserChecked('loginout')"><span>退出登录</span></a>
                </div>
            </div>
            <div style="height:calc(100% - 60px); overflow:auto;padding: 0 20px 0 35px;"  v-show="currentRightDiv == 1">
                <div class="main-right-content" v-for="item in userRolesArr">
                    <a @click="roleSwitch(item.role_id)"><span>{{item.role_name}}</span></a>
                </div>
            </div>
            <div style="height:calc(100% - 120px);padding: 0 10px;overflow-y:scroll"  v-show="currentRightDiv == 2">
                <div class="main-right-content-for-message" v-for="item in allMessageList">
                    <div>
                        <div v-if="item.is_read == '0'" style="width:6px;height:6px;border-radius:6px;background-color:#ff0000;float:left;margin-top: 7px;margin-right: 20px;"></div>
                        <div style="float:left" :class="{'margin-fill-dot': item.is_read == '1'}">
                            <p class="span-for-click" @click="goToMessageDetail(item.url, item.id)" style="float:left;white-space: nowrap;text-overflow: ellipsis;width:100%;overflow:hidden;width:250px"><span :title="item.title">{{item.title}}</span></p>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between;width:100%;padding:0 25px;">
                        <div><p>{{allMessageTypeObj[item.type]}}</p></div>
                        <div><p>{{item.create_time}}</p></div>
                    </div>
                </div>
                <div style="width:320px; height:46px;bottom: 12px;position: absolute;right: 0px;">
                    <div style="width:50%;float:left;line-height:46px;text-align:center;border: 1px solid rgba(204, 204, 204, 1);border-right: 0;border-left: 0;background-color:#f5f5f5;cursor:pointer" class="read-message-button-color" @click="markAllMessage">
                        <span>全部标记为已读</span>
                    </div>
                    <div style="width:50%;float:left;line-height:46px;text-align:center;border: 1px solid rgba(204, 204, 204, 1);cursor:pointer;border-right: 0;background-color:#f5f5f5;" class="read-message-button-color" @click="goToMessageList">
                        <span>显示全部</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from './main_components/sidebarMenu.vue';
    import tagsPageOpened from './main_components/tagsPageOpened.vue';
    import breadcrumbNav from './main_components/breadcrumbNav.vue';
    import themeDropdownMenu from './main_components/themeDropdownMenu.vue';
    import sidebarMenuShrink from './main_components/sidebarMenuShrink.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import { apiLoginOut, switchRole, userSystemMessageListApi, apiAllStatus, userSystemMessageReadApi } from '@/config/getData';
    import {getStore, setStore,removeStore} from '@/config/mUtils';
    export default {
        components: {
            sidebarMenu,
            tagsPageOpened,
            breadcrumbNav,
            themeDropdownMenu,
            sidebarMenuShrink
        },
        data () {
            return {
                spanLeft: 4,
                spanRight: 20,
                currentPageName: '',
                hideMenuText: false,
                userName: '',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false,
                messageCount: 0,
                countDown: 10,
                int: 0,
                lockScreenSize: 0,
                currentRightDiv: 0,
                showRight: false,
                currentRoleId: 0,
                currentRoleName: '',
                userRolesArr: [],
                allMessageList: [],
                allMessageTypeObj: {},
                totalNotReadNum: 0,
                showBounce: true
            };
        },
        computed: {
            menuList () {
                return this.$store.state.menuList;
            },
            tagsList () {
                return this.$store.state.tagsList;  // 所有页面的页面对象
            },
            pageTagsList () {
                return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.currentPath;  // 当前面包屑数组
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            avatorPath () {
                return 'src/images/timg.jpg';
            },
            cachePage () {
                return this.$store.state.cachePage;
            },
            showLogOut () {
                return this.$store.state.logOutModal;
            },
            updateMessageList() {
                return this.$store.state.messageChangeMark;
            }
        },
        methods: {
            init () {
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name, this.$route.meta.belong, this.$route.meta.title, this.$route.meta.path, this.$route.meta.isSpecial);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
            },
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
            showUserinfo() {
                this.currentRightDiv = 0;
                this.showRight = true;
            },
            showUserRole() {
                this.currentRightDiv = 1;
                this.showRight = true;
            },
            showMyMessage() {
                this.getMessageType();
                this.currentRightDiv = 2;
                this.showRight = true;
            },
            showRightToggle() {
                this.showRight = !this.showRight;
            },
            getUserRoles () {
                let tmpObj = getStore('userRoles') ? JSON.parse(getStore('userRoles')) : {};
                if (tmpObj) {
                    for(let key in tmpObj) {
                       this.userRolesArr.push(tmpObj[key]);
                    }
                    this.currentRoleId = Cookies.get('currentRoleId') || Cookies.get('default_user_id');
                    this.userRolesArr.forEach(item => {
                        if (item.role_id == this.currentRoleId) {
                            this.currentRoleName = item.role_name;
                        }
                    });
                }
            },
            roleSwitch (index) {
                switchRole(this, {
                    roleid: index
                }).then(res => {
                    if (res.noAuth) {
                        this.$Message.error('该角色无系统权限!');
                        return;
                    }
                    if (index == '4' || index == '5' || index == '6') {
                        setStore('isService', '1');
                    } else {
                        removeStore('isService');
                    }
                    Cookies.set('currentRoleId', index);
                    this.currentRoleId = index;
                    this.userRolesArr.forEach(item => {
                        if (item.role_id == this.currentRoleId) {
                            this.currentRoleName = item.role_name;
                        }
                    });
                    this.showRightToggle();
                    this.$store.commit('updateMenulist');
                    this.$store.commit('clearAllTags');
                    this.$router.replace({
                        name: 'home_index',
                        query: { refresh: index }
                    });
                })
            },
            handleClickUserChecked (name) {
                this.showRightToggle();
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'person_info') {
                    util.openNewPage(this, 'ownspace_personal_info');
                    this.$router.push({
                        name: 'ownspace_personal_info'
                    });
                } else if (name === 'edit_password') {
                    util.openNewPage(this, 'ownspace_edit_password');
                    this.$router.push({
                        name: 'ownspace_edit_password'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    apiLoginOut(this, {}).then(res => {
                        
                    });
                }
            },
            handleFullScreen () {
                let main = document.getElementById('main');
                if (this.isFullScreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (main.requestFullscreen) {
                        main.requestFullscreen();
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen();
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen();
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen();
                    }
                }
            },
            showMessage () {
                util.openNewPage(this, 'message_index');
                this.$router.push({
                    name: 'message_index'
                });
            },
            lockScreen () {
                let lockScreenBack = document.getElementById('lock_screen_back');
                lockScreenBack.style.transition = 'all 3s';
                lockScreenBack.style.zIndex = 10000;
                lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset';
                this.showUnlock = true;
                this.$store.commit('lock');
                Cookies.set('last_page_name', this.$route.name); // 本地存储锁屏之前打开的页面以便解锁后打开
                setTimeout(() => {
                    lockScreenBack.style.transition = 'all 0s';
                    this.$router.push({
                        name: 'locking'
                    });
                }, 800);
            },
            goToIndex () {
                this.$router.push('/home');
            },
            logOutNow () {
                this.$store.commit('showLogOutModal', false);
                clearInterval(this.int);
                this.$router.push({
                    path: '/login'
                });
            },
            getMessageType () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sys_msg_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allMessageTypeObj = res.data.sys_msg_type;
                        this.getNotReadData();
                    }
                });
            },
            getNotReadData () {
                userSystemMessageListApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 20,
                        pageNum: 1
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.allMessageList = res.data.list;
                        this.totalNotReadNum = res.data.unread_message_num;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            goToMessageDetail(url, id) {
                if (url) {
                    this.showRight = false;
                    userSystemMessageReadApi(this, {
                        ids: JSON.stringify([id])
                    }).then(res => {
                        if(res && res.status == 1){
                            this.getNotReadData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                    let queryArr = url.split(','); 
                    util.openNewPage(this, 'article_detail', {id: queryArr[0],type: queryArr[1]});
                    this.$router.push({
                        name: 'article_detail',
                        query: {id: queryArr[0],type: queryArr[1]}
                    });
                }
            },
            markAllMessage() {
                userSystemMessageReadApi(this, {
                    all: '1'
                }).then(res => {
                    if(res && res.status == 1){
                        this.getNotReadData();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            goToMessageList() {
                this.showRight = false;
                util.openNewPage(this, 'my_message_index');
                this.$router.push({
                    name: 'my_message_index'
                });
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name, to.meta.belong, to.meta.title, to.meta.path);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
            },
            'showLogOut' (value) {
                if (value) {
                    this.int = setInterval(()=> {
                        this.countDown = this.countDown - 1;
                        if (this.countDown == 0) {
                            this.$store.commit('showLogOutModal', false);
                            clearInterval(this.int);
                            this.$router.push({
                                path: '/login'
                            });
                        }
                    }, 1000);
                }
            },
            'updateMessageList' () {
                this.getMessageType();
            }
        },
        mounted () {
            this.init();
            // 全屏相关
            document.addEventListener('fullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('mozfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('webkitfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('msfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            // 锁屏相关
            let lockScreenBack = document.getElementById('lock_screen_back');
            let x = document.body.clientWidth;
            let y = document.body.clientHeight;
            let r = Math.sqrt(x * x + y * y);
            let size = parseInt(r);
            this.lockScreenSize = size;
            window.addEventListener('resize', () => {
                let x = document.body.clientWidth;
                let y = document.body.clientHeight;
                let r = Math.sqrt(x * x + y * y);
                let size = parseInt(r);
                this.lockScreenSize = size;
                lockScreenBack.style.transition = 'all 0s';
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            });
            lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            // 问候信息相关
            if (!Cookies.get('hasGreet')) {
                let now = new Date();
                let hour = now.getHours();
                let greetingWord = {
                    title: '',
                    words: ''
                };
                let userName = Cookies.get('user');
                if (hour < 6) {
                    greetingWord = {title: '凌晨好~' + userName, words: '早起的鸟儿有虫吃~'};
                } else if (hour >= 6 && hour < 9) {
                    greetingWord = {title: '早上好~' + userName, words: '来一杯咖啡开启美好的一天~'};
                } else if (hour >= 9 && hour < 12) {
                    greetingWord = {title: '上午好~' + userName, words: '工作要加油哦~'};
                } else if (hour >= 12 && hour < 14) {
                    greetingWord = {title: '中午好~' + userName, words: '午饭要吃饱~'};
                } else if (hour >= 14 && hour < 17) {
                    greetingWord = {title: '下午好~' + userName, words: '下午也要活力满满哦~'};
                } else if (hour >= 17 && hour < 19) {
                    greetingWord = {title: '傍晚好~' + userName, words: '下班没事问候下爸妈吧~'};
                } else if (hour >= 19 && hour < 21) {
                    greetingWord = {title: '晚上好~' + userName, words: '工作之余品一品书香吧~'};
                } else {
                    greetingWord = {title: '深夜好~' + userName, words: '夜深了，注意休息哦~'};
                }
                this.$Notice.config({
                    top: 130
                });
                this.$Notice.info({
                    title: greetingWord.title,
                    desc: greetingWord.words,
                    duration: 4,
                    name: 'greeting'
                });
                Cookies.set('hasGreet', 1);
            }
        },
        created () {
            // 查找当前用户之前登录时设置的主题
            let name = Cookies.get('user');
            if (localStorage.theme) {
                let hasThisUser = JSON.parse(localStorage.theme).some(item => {
                    if (item.userName === name) {
                        this.$store.commit('changeMenuTheme', item.menuTheme);
                        this.$store.commit('changeMainTheme', item.mainTheme);
                        return true;
                    } else {
                        return false;
                    }
                });
                if (!hasThisUser) {
                    this.$store.commit('changeMenuTheme', 'dark');
                    this.$store.commit('changeMainTheme', 'b');
                }
            } else {
                this.$store.commit('changeMenuTheme', 'dark');
                this.$store.commit('changeMainTheme', 'b');
            }
            // 根据用户设置主题
            if (this.$store.state.theme !== 'b') {
                let stylesheetPath = './dist/' + this.$store.state.theme + '.css';
                let themeLink = document.querySelector('link[name="theme"]');
                themeLink.setAttribute('href', stylesheetPath);
            }
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            this.getUserRoles();

            //轮询消息类型和列表,30s一次
            this.getMessageType();
            setInterval(() => {
                //登陆状态再调用
                if (localStorage.authArr && localStorage.authArr.length > 0) {
                    this.getMessageType();
                }
            }, 30000)
        }
    };
</script>
