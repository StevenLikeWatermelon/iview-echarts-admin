<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="销售请购单单据" name="0">
                    <basic-info v-if="currentTab == '0'" ref="basicInfo"></basic-info>
                </TabPane>
                <TabPane label="销售请购单明细" name="1">
                    <detail-info v-if="currentTab == '1'" ref="detailInfo"></detail-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './index-order.vue';
    import detailInfo from './index-detail.vue';
    export default {
        data () {
            return {
                currentTab: '0'
            };
        },
        name: 'service-sales-xsqgd',
        components: {
            basicInfo,
            detailInfo,
        },
        methods: {

        },
        activated() {
            if (this.currentTab == '0') {
                this.$refs['basicInfo'].getData();
            } else {
                this.$refs['detailInfo'].getData();
            }
        }
    };
</script>