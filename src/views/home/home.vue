<style lang="less">
    @import "home.less";
</style>
<template>
    <div class="home-main">
        <sales-home v-if="salesHome"></sales-home>
        <purchase-home v-if="purchaseHome"></purchase-home>
        <system-home v-if="systemHome"></system-home>
    </div>
</template>

<script>
    import salesHome from './sales_home.vue';
    import purchaseHome from './purchase_home.vue';
    import systemHome from './system_home.vue';
    import {manualCheck} from '@/config/mUtils';
    export default {
        data () {
            return {
                salesHome: false,
                purchaseHome: false,
                systemHome: false,
            };
        },
        components: {
            salesHome,
            purchaseHome,
            systemHome
        },
        created: function () {
            //判断权限
            this.authCheck();
        },
        methods: {
            // 初始化权限
            initAuth() {
                this.salesHome = false;
                this.purchaseHome = false;
                this.systemHome = false;
            },
            //权限判断
            authCheck() {
                this.salesHome = manualCheck('sales_home_only');
                this.purchaseHome = manualCheck('purchase_home_only');
                this.systemHome = manualCheck('system_home_only');
            }
        },
        watch: {
            '$route.query.refresh' (value) {
                this.initAuth();
                setTimeout(()=> {
                    this.authCheck();
                })
            }
        }
    };
</script>

