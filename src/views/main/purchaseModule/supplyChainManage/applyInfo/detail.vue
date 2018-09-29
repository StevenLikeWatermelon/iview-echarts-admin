<style>
    
</style>

<template>
    <Row>
        <col span="24">
            <Tabs :animated="false" v-model="currentTab">
                <TabPane label="基础信息" name="0">
                    <basic-info v-if="currentTab == '0'"></basic-info>
                </TabPane>
                <TabPane label="合作地址信息" name="1">
                    <address-info v-if="currentTab == '1'"></address-info>
                </TabPane>
                <TabPane label="合作品牌明细" name="2">
                    <brand-info v-if="currentTab == '2'"></brand-info>
                </TabPane>
                <TabPane label="合作约定内容" name="3">
                    <brand-content v-if="currentTab == '3'"></brand-content>
                </TabPane>
            </Tabs>
        </col>
    </Row>
</template>

<script>
    import basicInfo from './detail-basic.vue';
    import addressInfo from './cooperate-address.vue';
    import brandInfo from './cooperate-brand.vue';
    import brandContent from './cooperate-content.vue';
    export default {
        data () {
            return {
                currentTab: '0'
            };
        },
        components: {
            basicInfo,
            addressInfo,
            brandContent,
            brandInfo
        },
        methods: {

        }
    };
</script>