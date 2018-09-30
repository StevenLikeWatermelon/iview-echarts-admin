<style lang="less">
    @import './menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="currentPageName" :open-names="openedSubmenuArr" :theme="$store.state.menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <Submenu :name="item.name" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ item.title }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ child.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
import util from '@/libs/util';
import {getStore} from '@/config/mUtils';
export default {
    data () {
        return {
            currentPageName: this.$route.meta.belong ? this.$route.meta.belong : this.$route.name,
            openedSubmenuArr: this.$store.state.openedSubmenuArr
        };
    },
    name: 'sidebarMenu',
    props: {
        slotTopClass: String,
        menuList: Array,
        iconSize: Number
    },
    computed: {
        tagsList () {
            return this.$store.state.tagsList;
        }
    },
    methods: {
        changeMenu (active) {
            if (active !== 'accesstest_index') {
                util.openNewPage(this, active);
                this.$router.push({
                    name: active
                });
            }
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.meta.belong || to.name;
            localStorage.currentPageName = to.name;
        },
        currentPageName () {
            this.openedSubmenuArr = this.$store.state.openedSubmenuArr;
            this.$nextTick(() => {
                this.$refs.sideMenu.updateOpened();
            });
        }
    },
    updated () {
        this.$nextTick(() => {
            this.$refs.sideMenu.updateOpened();
        });
    },
    mounted () {
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    }

};
</script>
