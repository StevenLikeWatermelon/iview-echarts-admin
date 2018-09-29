<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                 <Row>
                    <Col span="12">
                        <span>{{isService}}编号： {{$route.query.user_no}}</span>
                        <span style="margin-left:50px;">{{isService}}名称： {{$route.query.user_name}}</span>
                    </Col>
                 </Row>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form style="margin-left:-20px;">
                    <search-data  @getDateRangeData="getSalesData"></search-data>
                    <div class="clear"></div>
                </Form>
                <Row>
                    <!--销售额情况分析-->
                    <Col span="12">
                    <multi-bar-chart :diyDomIndex="0" title="销售额情况分析" :data="teamLineBarMoney" :date="dateRange"></multi-bar-chart>
                    </Col>
                    <!--销售情况分析-->
                    <Col span="12">
                    <multi-bar-chart :diyDomIndex="1" title="销量情况分析" :data="teamLineBarAmount" :date="dateRange"></multi-bar-chart>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import searchData from '../../../common/search.vue';
    import multiBarChart from '../../components/multiBarChart.vue';
    import { getSalesCondition, apiCustAnalyzeSalesAmount } from '@/config/getData';
    import { getStore } from '@/config/mUtils';
    export default {
        name: 'salesRanking-analyticalData',
        data () {
            return {
                teamLineBarMoney: [],
                teamLineBarAmount: [],
                isService: '销售人员',
                dateRange: []
            };
        },
        components: {
            searchData,
            multiBarChart
        },
        methods: {
            backTo () {
                this.$store.commit('gobackState', 'sales');
                history.go(-1);
            },
            getSalesData (dataRange) {
                let searchMembers = this.$route.query.user_no;
                apiCustAnalyzeSalesAmount(this, {
                    params: JSON.stringify({"starttime": dataRange[0] + ' 00:00:00',"endtime": dataRange[1] + ' 23:59:59'}),
                    ygbh: JSON.stringify(searchMembers.split(','))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dateRange = res.data.date_list;
                        this.teamLineBarMoney = [
                            {
                                name: '下单总金额',
                                type: 'line',
                                stack: '下单总金额',
                                data: res.data.order_amount
                            },
                            {
                                name: '已支付总金额',
                                type: 'line',
                                stack: '已支付总金额',
                                data: res.data.order_pay_amount
                            },
                            {
                                name: '退货总金额',
                                type: 'line',
                                stack: '退货总金额',
                                data: res.data.return_amount
                            },
                            {
                                name: '已退款总金额',
                                type: 'line',
                                stack: '已退款总金额',
                                data: res.data.return_has_amount
                            }
                        ];
                    }
                });
                getSalesCondition(this, {
                    params: JSON.stringify({"starttime": dataRange[0] + ' 00:00:00',"endtime": dataRange[1] + ' 23:59:59'}),
                    ygbh: JSON.stringify(searchMembers.split(','))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dateRange = res.data.date_list;
                        this.teamLineBarAmount = [
                            {
                                name: '下单总数',
                                type: 'line',
                                stack: '下单总数',
                                data: res.data.order_num
                            },
                            {
                                name: '已支付订单总数',
                                type: 'line',
                                stack: '已支付订单总数',
                                data: res.data.order_pay_num
                            },
                            {
                                name: '退货订单总数',
                                type: 'line',
                                stack: '退货订单总数',
                                data: res.data.return_num
                            },
                            {
                                name: '已退款订单总数',
                                type: 'line',
                                stack: '已退款订单总数',
                                data: res.data.return_has_num
                            }
                        ];
                    }
                });
            }
        },
        created () {
            //判断是不是客服
            this.isService = getStore('isService') ? '客服人员' : '销售人员';
        }
    };
</script>
