<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="客户出库分析" name="0">
                    <basic-info v-if="currentTab == '0'"></basic-info>
                </TabPane>
                <TabPane label="客户订单分析" name="1">
                    <detail-info v-if="currentTab == '1'"></detail-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './outIndex.vue';
    import detailInfo from './orderIndex.vue';
    export default {
        name: 'custom_analyze_index',
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

        }
    };
</script>