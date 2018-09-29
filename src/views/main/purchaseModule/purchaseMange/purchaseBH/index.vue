<template>
    <Row>
        <col span="24">
        <Tabs :animated="false" v-model="currentTab">
            <TabPane label="采购备货单列表" name="0">
                <basic-info v-if="currentTab == '0'" ref="basicInfo"></basic-info>
            </TabPane>
            <TabPane label="采购备货单明细" name="1">
                <detail-info v-if="currentTab == '1'" ref="detailInfo"></detail-info>
            </TabPane>
        </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './indexList.vue';
    import detailInfo from './bhdmx_list.vue';
    export default {
        name: 'purchase_manage_BH_index',
        data () {
            return {
                currentTab: '0'
            };
        },
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