<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="采购收票单列表" name="0">
                    <basic-info v-if="currentTab == '0'"></basic-info>
                </TabPane>
                <TabPane label="采购收票单明细" name="1">
                    <detail-info v-if="currentTab == '1'"></detail-info>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './index.vue';
    import detailInfo from './detailIndex.vue';
    export default {
        name: 'purchase_manage_SP_index',
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