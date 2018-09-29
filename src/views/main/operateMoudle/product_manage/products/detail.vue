<template>
    <div>
        <Tabs :animated="false" v-model="changeTab">
            <TabPane label="产品详情" name="tab0">
                <prd-detail></prd-detail>
            </TabPane>
            <TabPane label="对应商品" name="tab1">
                <rel-prd></rel-prd>
            </TabPane>
        </Tabs>
    </div>
</template>
<script type="text/ecmascript-6">
    import prdDetail from './productdetail.vue';
    import relPrd from './relationProduct.vue';
    export default {
        name: 'service-sales-manage-xjddetail',
        data () {
            return {
                changeTab: 'tab0'
            };
        },
        components: {
            prdDetail,
            relPrd
        },
        methods: {
        }
    };
</script>
