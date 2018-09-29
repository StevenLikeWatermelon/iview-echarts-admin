<style lang="less">
    @import "home.less";
</style>
<template>
    <div class="home-main">
        <sales-home v-if="salesHome"></sales-home>
        <service-home v-if="serviceHome"></service-home>
        <operate-home v-if="operateHome"></operate-home>
        <purchase-home v-if="purchaseHome"></purchase-home>
        <finance-home v-if="financeHome"></finance-home>
        <storage-home v-if="storageHome"></storage-home>
        <chain-home v-if="chainHome"></chain-home>
        <system-home v-if="systemHome"></system-home>
    </div>
</template>

<script>
    import salesHome from './sales_home.vue';
    import serviceHome from './service_home.vue';
    import operateHome from './operate_home.vue';
    import purchaseHome from './purchase_home.vue';
    import chainHome from './chain_home.vue';
    import systemHome from './system_home.vue';
    import storageHome from './storage_home.vue';
    import financeHome from './finance_home.vue';
    import {manualCheck} from '@/config/mUtils';
    export default {
        data () {
            return {
                salesHome: false,
                serviceHome: false,
                operateHome: false,
                storageHome: false,
                financeHome: false,
                purchaseHome: false,
                chainHome: false,
                systemHome: false,
            };
        },
        components: {
            salesHome,
            serviceHome,
            operateHome,
            storageHome,
            financeHome,
            purchaseHome,
            chainHome,
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
                this.serviceHome = false;
                this.operateHome = false;
                this.storageHome = false;
                this.financeHome = false;
                this.purchaseHome = false;
                this.chainHome = false;
                this.systemHome = false;
            },
            //权限判断
            authCheck() {
                this.salesHome = manualCheck('sales_home_only');
                this.serviceHome = manualCheck('service_home_only');
                this.operateHome = manualCheck('operate_home_only');
                this.purchaseHome = manualCheck('purchase_home_only');
                this.financeHome = manualCheck('finance_home_only');
                this.storageHome = manualCheck('storage_home_only');
                this.chainHome = manualCheck('chain_home_only');
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

