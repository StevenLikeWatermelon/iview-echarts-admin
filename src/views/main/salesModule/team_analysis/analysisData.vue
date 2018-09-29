<template>
    <Row>
        <col span="24">
        <Tabs :animated="false" v-model="currentTab">
            <TabPane label="订单分析" name="0">
                <order-analysis v-if="currentTab == '0'" ref="orderAnalysis"></order-analysis>
            </TabPane>
            <TabPane label="品牌分析" name="1">
                <brand-analysis v-if="currentTab == '1'" ref="brandAnalysis"></brand-analysis>
            </TabPane>
        </Tabs>
        </col>
    </Row>
</template>

<script>
    import orderAnalysis from './orderAnalysis.vue';
    import brandAnalysis from './brandAnalysis.vue';
    export default {
        name: 'team_analytical_data',
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            orderAnalysis,
            brandAnalysis,
        },
        methods: {

        },
        activated() {
            if (this.currentTab == '0') {
                this.$refs['orderAnalysis'].getPersonsInTeamList();
            } else {
                this.$refs['brandAnalysis'].getTeamSalesBrand();
            }
        }
    };
</script>