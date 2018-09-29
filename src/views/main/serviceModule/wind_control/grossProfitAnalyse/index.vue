<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="销售出库单毛利分析" name="0">
                    <basic-info v-if="currentTab == '0'" ref="basicInfo"></basic-info>
                </TabPane>
                <TabPane label="销售出库单毛利分析明细" name="1">
                    <detail-info v-if="currentTab == '1'" ref="detailInfo"></detail-info>
                </TabPane>
                <TabPane label="品牌毛利分析" name="2">
                    <brand-info v-if="currentTab == '2'" ref="brandInfo"></brand-info>
                </TabPane>
                <TabPane label="产品毛利分析" name="3">
                    <product-info v-if="currentTab == '3'" ref="productInfo"></product-info>
                </TabPane>
                <TabPane label="商品毛利分析" name="4">
                    <goods-info v-if="currentTab == '4'" ref="goodsInfo"></goods-info>
                </TabPane>
                <TabPane label="客户毛利分析" name="5">
                    <customer-info v-if="currentTab == '5'" ref="customerInfo"></customer-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './indexList.vue';
    import detailInfo from './detailList.vue';
    import brandInfo from './brandList.vue';
    import productInfo from './productList.vue';
    import goodsInfo from './goodsList.vue';
    import customerInfo from './customerList.vue';
    export default {
        name: 'gross-profit-analyse',
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            basicInfo,
            detailInfo,
            brandInfo,
            productInfo,
            goodsInfo,
            customerInfo,
        },
        methods: {

        },
        activated() {
            if (this.currentTab == '0') {
                this.$refs['basicInfo'].getData();
            }
            if (this.currentTab == '1') {
                this.$refs['detailInfo'].getData();
            }
            if (this.currentTab == '2') {
                this.$refs['brandInfo'].getData();
            }
            if (this.currentTab == '3') {
                this.$refs['productInfo'].getData();
            }
            if (this.currentTab == '4') {
                this.$refs['goodsInfo'].getData();
            }
            if (this.currentTab == '5') {
                this.$refs['customerInfo'].getData();
            }
        }
    };
</script>