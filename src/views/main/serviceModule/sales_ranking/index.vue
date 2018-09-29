<template>
    <Row>
        <col span="24">
        <Tabs :animated="false" v-model="currentTab">
            <TabPane label="出库排行" name="0">
                <ck-info v-if="currentTab == '0'" ref="CkInfo"></ck-info>
            </TabPane>
            <TabPane label="销售排行" name="1">
                <sell-info v-if="currentTab == '1'" ref="SellInfo"></sell-info>
            </TabPane>
        </Tabs>
        </col>
    </Row>
</template>

<script>
    import sellInfo from './sell_rank.vue';
    import ckInfo from './ck_rank.vue';
    export default {
        name: 'service-sales-list',
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            sellInfo,
            ckInfo,
        },
        methods: {

        },
        activated() {
            if (this.currentTab == '0') {
                this.$refs['CkInfo'].getServiceSalesRank();
            } else {
                this.$refs['SellInfo'].getStatus();

            }
        }
    };
</script>