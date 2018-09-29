<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="定向价格单据" name="0">
                    <basic-info v-if="currentTab == '0'" ref="basicInfo"></basic-info>
                </TabPane>
                <TabPane label="定向价格明细" name="1">
                    <detail-info v-if="currentTab == '1'" ref="detailInfo"></detail-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './indexList.vue';
    import detailInfo from './detailList.vue';
    export default {
        name: 'orienteering-price',
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            basicInfo,
            detailInfo
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
        }
    };
</script>