<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="销售开票单" name="0">
                    <basic-info v-if="currentTab == '0'" ref="basicInfo"></basic-info>
                </TabPane>
                <TabPane label="销售开票单明细" name="1">
                    <detail-info v-if="currentTab == '1'" ref="detailInfo"></detail-info>
                </TabPane>
                <TabPane label="销售开票单运费" name="2">
                    <carriage-info v-if="currentTab == '2'" ref="carriageInfo"></carriage-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './indexList.vue';
    import detailInfo from './detailList.vue';
    import carriageInfo from './carriageList.vue';
    export default {
        name: 'service-xskpd-index',
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            basicInfo,
            detailInfo,
            carriageInfo
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
                this.$refs['carriageInfo'].getData();
            }
        }
    };
</script>