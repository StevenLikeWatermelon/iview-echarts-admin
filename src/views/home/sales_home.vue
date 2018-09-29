<template>
    <div>
        <Row>
            <Col span="24">
            <Row>
                <Col span="6">
                <infor-card
                        id-name="orderAmount"
                        :end-val="count.orderTotal"
                        iconType="stats-bars"
                        color="#2d8cf0"
                        intro-text="本月下单总额"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="paidAmount"
                        :end-val="count.allPaid"
                        iconType="social-yen"
                        color="#64d572"
                        intro-text="本月已支付总额"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="addCustomer"
                        :end-val="count.collection"
                        iconType="person-add"
                        color="#ffd572"
                        intro-text="本月新增客户数"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="doneCustomer"
                        :end-val="count.transfer"
                        iconType="person-stalker"
                        color="#f25e43"
                        intro-text="本月成交客户数"
                ></infor-card>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="12">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-shuffle-strong"></Icon>
                        销售趋势
                    </p>
                    <div class="line-chart-con">
                        <Form style="margin-bottom: 20px;position: relative;">
                            <search-data dateRangeType="1" @getDateRangeData="getSalesTrendData"></search-data>
                            <div class="clear"></div>
                            <formItem style="position:absolute;left:3%;top:40px;z-index: 99;">
                                <btn-grp @changeChartsData="getSalesType"></btn-grp>
                            </formItem>
                        </Form>
                        <order-trend :diyDomIndex="0" :data="salesTrend" :date="DateSales"></order-trend>
                    </div>
                </Card>
                </Col>
                <Col span="12" class="padding-left-5">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-shuffle-strong"></Icon>
                        退货趋势
                    </p>
                    <div class="line-chart-con">
                        <Form style="margin-bottom: 20px;position: relative;">
                            <search-data dateRangeType="1" @getDateRangeData="getReturnTrendData"></search-data>
                            <div class="clear"></div>
                            <formItem style="position:absolute;left:3%;top:40px;z-index: 99;">
                                <btn-grp @changeChartsData="getReturnType"></btn-grp>
                            </formItem>
                        </Form>
                        <order-trend :diyDomIndex="1" :data="returnTrend" :date="DateReturn"></order-trend>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="12" >
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    新客户趋势
                </p>
                <div class="line-chart-con">
                    <Form style="margin-bottom: 20px;">
                        <search-data dateRangeType="1" @getDateRangeData="getNewCustomTrendData"></search-data>
                        <div class="clear"></div>
                    </Form>
                    <order-trend :diyDomIndex="2" :data="newCustTrend" :date="DateNewCust"></order-trend>
                </div>
            </Card>
            </Col>
            <Col span="12" class="padding-left-5">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    成交客户趋势
                </p>
                <div class="line-chart-con">
                    <Form style="margin-bottom: 20px;">
                        <search-data dateRangeType="1" @getDateRangeData="getDealCustomTrendData"></search-data>
                        <div class="clear"></div>
                    </Form>
                    <order-trend :diyDomIndex="3" :data="successCustTrend" :date="DateSuccessCust"></order-trend>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="teamSalesAuth">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    销售额分布情况
                </p>
                <div class="line-chart-con">
                     <Form style="margin-bottom: 20px;position: relative;" inline>
                        <formItem style="float:left;margin-left:3%;">
                            <btn-grp @changeChartsData="pickDepartmentsSalesType"></btn-grp>
                        </formItem>
                        <search-data dateRangeType="1"  @getDateRangeData="getDepartmentsSalesList"></search-data>
                        <div class="clear"></div>
                    </Form>
                    <sales-ranking :data="departmentsData" :date="departmentsDate"></sales-ranking>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import orderTrend from './components/orderTrend.vue';
    import btnGrp from './components/btnGrp.vue';
    import inforCard from './components/inforCard.vue';
    import salesRanking from './components/salesRanking.vue';
    import searchData from '../common/search.vue';
    import { getUserNumInMonth, getReturnTrend, getNewCustomTrend, getDealedCustomTrend, getSalesTrend, getAllCashInMonth, DepartmentsSalesApi } from '@/config/getData';
    import {manualCheck} from '@/config/mUtils';
    export default {
        components: {
            orderTrend,
            btnGrp,
            salesRanking,
            inforCard,
            searchData
        },
        data () {
            return {
                teamSalesAuth: false,
                count: {
                    orderTotal: 0,
                    allPaid: 0,
                    collection: 0,
                    transfer: 0
                },
                // 销售趋势
                salesTrend: [
                    {
                        name: '下单总金额',
                        type: 'line',
                        stack: '总量1',
                        data: []
                    },
                    {
                        name: '已支付总金额',
                        type: 'line',
                        stack: '总量2',
                        data: []
                    }
                ],
                DateSales: [],
                salesType: 'amount',
                salesDateRange: '',
                //退货趋势
                returnTrend: [
                    {
                        name: '退货总金额',
                        type: 'line',
                        stack: '总量1',
                        data: []
                    },
                    {
                        name: '已退款总金额',
                        type: 'line',
                        stack: '总量2',
                        data: []
                    }
                ],
                DateReturn: [],
                returnType: "order_amount", //默认退货额
                returnDateRange: '',
                //客户趋势
                newCustTrend: [
                    {
                        name: '新增客户数',
                        type: 'line',
                        stack: '总量1',
                        data: []
                    },
                    {
                        name: '新增成交客户数',
                        type: 'line',
                        stack: '总量2',
                        data: []
                    }
                ],
                DateNewCust: [],
                NewCustomDateRange: '',
                // 成交客户趋势
                successCustTrend: [
                    {
                        name: '成交客户数',
                        type: 'line',
                        stack: '总量2',
                        data: []
                    }
                ],
                DateSuccessCust: [],
                dealCustomRange: '',
                //部门销售统计
                departmentsData: [],
                departmentsDate: [],
                departmentsType: 'amount',
                departmentsRange: []
            };
        },
        created: function () {
            // 初始化日期范围/当前页,关闭日期共享
            this.$store.commit('broadcastShareState', false);
            this.$store.commit('changeCurrentTab', 2);
            //下单总额
            this.getUserNumInMonth('kh_new');
            this.getUserNumInMonth('kh_deal');
            // 成交客户数
            this.getAllCashInMonthData('all');
            this.getAllCashInMonthData('paid');
            //判断权限
            this.teamSalesAuth = manualCheck('index_sales_module');
        },
        methods: {
            //获取本月下单总额，成交总额
            getAllCashInMonthData (type) {
                getAllCashInMonth(this, {
                    data_type: type
                }).then(res => {
                    if (res && res.status == 1) {
                        if (type == 'all') {
                            this.count.orderTotal = res.data.total.order_amount;
                        }
                        if (type == 'paid') {
                            this.count.allPaid = res.data.total.paid_amount;
                        }
                    } else {
                         res && this.$Message.error(res.message);;
                    }
                });
            },
            //获取本月新增、成交客户数
            getUserNumInMonth (type) {
                getUserNumInMonth(this, {
                    params: JSON.stringify({
                        type: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if (type == 'kh_new') {
                            this.count.collection = +res.data.num;
                        }
                        if (type == 'kh_deal') {
                            this.count.transfer = +res.data.num;
                        }
                    } else {
                         res && this.$Message.error(res.message);;
                    }
                });
            },
            // 销售趋势
            getSalesType (type) {
                this.salesType = type ? 'count' : 'amount';
                this.salesTrend[0].name =  type ? '下单总数' : '下单总金额';
                this.salesTrend[1].name =  type ? '已支付总数' : '已支付总金额';
                this.getSalesTrendData(this.salesDateRange);
            },
            getSalesTrendData (dataRange) {
                this.salesDateRange = dataRange;
                getSalesTrend(this, {
                    data_type: this.salesType,
                    date_from: this.salesDateRange[0] + ' 00:00:00',
                    date_to: this.salesDateRange[1] + ' 23:59:59'
                }).then(res => {
                    if (res && res.status == 1) {
                        this.DateSales = res.data.day_list;
                        this.salesTrend[0].data = this.salesType == 'amount' ? res.data.order_amount : res.data.order_count;
                        this.salesTrend[1].data = this.salesType == 'amount' ? res.data.paid_amount : res.data.paid_count;
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            //退货趋势
            getReturnType (type) {
                this.returnType = type ? 'order_num' : 'order_amount';
                this.returnTrend[0].name =  type ? '退货总数' : '退货总金额';
                this.returnTrend[1].name =  type ? '已退款总数' : '已退款总金额';
                this.getReturnTrendData(this.returnDateRange);
            },
            getReturnTrendData (dataRange) {
                this.returnDateRange = dataRange;
                getReturnTrend(this, {
                    params: JSON.stringify({"starttime": this.returnDateRange[0] + ' 00:00:00',"endtime": this.returnDateRange[1] + ' 23:59:59',"type": this.returnType})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.DateReturn = res.data.date_list;
                        this.returnTrend[0].data = res.data.total_return;
                        this.returnTrend[1].data = res.data.has_return;
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            // 新客户趋势
            getNewCustomTrendData (dataRange) {
                this.NewCustomDateRange = dataRange;
                getNewCustomTrend(this, {
                    params: JSON.stringify({"starttime": this.NewCustomDateRange[0] + ' 00:00:00',"endtime": this.NewCustomDateRange[1] + ' 23:59:59'})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.DateNewCust = res.data.date_list;
                        this.newCustTrend[0].data = res.data.new_all;
                        this.newCustTrend[1].data = res.data.deal_all;
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            // 成交客户趋势
            getDealCustomTrendData (dataRange) {
                this.dealCustomRange = dataRange;
                getDealedCustomTrend(this, {
                    params: JSON.stringify({"starttime": this.dealCustomRange[0] + ' 00:00:00',"endtime": this.dealCustomRange[1] + ' 23:59:59'})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.DateSuccessCust = res.data.date_list;
                        this.successCustTrend[0].data = res.data.deal_all;
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            //各部门销售情况统计
            pickDepartmentsSalesType (type) {
                this.departmentsType = type ? 'count' : 'amount';
                this.getDepartmentsSalesList(this.departmentsRange);
            },
            getDepartmentsSalesList(dataRange) {
                this.departmentsRange = dataRange;
                DepartmentsSalesApi(this, {
                    data_type: this.departmentsType,
                    date_from: this.departmentsRange[0] +' 00:00:00',
                    date_to: this.departmentsRange[1] + ' 23:59:59'
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        this.departmentsData = [];
                        this.departmentsDate = res.data.day_list;
                        delete res.data.day_list;
                        for (let key in res.data) {
                            tmpObj = {
                                name: key,
                                type: 'bar',
                                stack: '部门',
                                data: res.data[key]
                            }
                            this.departmentsData.push(tmpObj);
                        }
                    }
                });
            }
        }
    };
</script>

