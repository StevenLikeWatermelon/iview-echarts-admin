<style>
    .analyze-customer .ivu-form .ivu-form-item-label {
        font-size: 16px;
        font-weight: bold;
    }
    .analyze-customer .ivu-form-item-content {
        font-size: 16px;
        font-weight: bold;
        padding-top: 2px;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="stats-bars"></Icon>
                        客户数据分析
                    </p>
                    <p style="line-height: 50px;">
                        <span>客户编号： {{khbh}}</span>
                        <span style="margin-left:50px;">客户名称： {{khmc}}</span>
                        <span style="margin-left:50px;">联系人： {{lxr}}</span>
                        <span style="margin-left:50px;">联系电话： {{sjhm}}</span>
                    </p>
                    <div>
                        <Row>
                            <Tabs value="name1" style="overflow: visible;" :animated="false">
                                <TabPane label="订单分析" name="name1">
                                    <!--销售额情况分析-->
                                    <Col span="12">
                                    <Form inline>
                                        <formItem></formItem>
                                        <search-data @getDateRangeData="salesAmount"></search-data>
                                        <div class="clear"></div>
                                    </Form>
                                    <multi-bar-chart :diyDomIndex="0" title="销售额情况分析" :data="teamLineBarMoney" :date="DateMoney"></multi-bar-chart>
                                    </Col>
                                    <!--销售情况分析-->
                                    <Col span="12">
                                    <div style="width:100%;height:33px"></div>
                                    <multi-bar-chart :diyDomIndex="1" title="销量情况分析" :data="teamLineBarAmount" :date="DateAmount"></multi-bar-chart>
                                    </Col>
                                </TabPane>
                                <TabPane label="商品分析" name="name2">
                                    <Col span="24">
                                        <Form style="margin-bottom: 20px;">
                                            <search-data @getDateRangeData="goodsAnalyze"></search-data>
                                            <div class="clear"></div>
                                        </Form>
                                        <el-table :data="salesData.data" border stripe style="text-align: center">
                                            <el-table-column prop="rank" type="index" label="序号"></el-table-column>
                                            <el-table-column prop="cpxh" label="产品型号" sortable></el-table-column>
                                            <el-table-column prop="cpppmc" label="品牌" sortable></el-table-column>
                                            <el-table-column prop="cpxl" label="系列" sortable></el-table-column>
                                            <el-table-column prop="cpdhh" label="订货号" sortable></el-table-column>
                                            <el-table-column prop="nums" label="购买数量" sortable></el-table-column>
                                        </el-table>
                                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalNum" :current="currentPage"></pagination>
                                    </Col>
                                </TabPane>
                                <TabPane label="订单明细" name="name3">
                                    <Col span="24">
                                        <order-list :khmc="khmc" :khbh="khbh"></order-list>
                                    </Col>
                                </TabPane>
                            </Tabs>
                        </Row>
                    </div>
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
    import orderList from '../order_manage/index.vue'
    import multiBarChart from '../../components/multiBarChart.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiCustAnalyzeSalesAmount, apiCustAnalyzeSalesNum, apiCustAnalyzeGoods } from '@/config/getData';
    export default {
        name: 'custome_analyticalData',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalNum: 0,
                teamLineBarMoney: [
                    {
                        name: '下单总金额',
                        type: 'line',
                        stack: '下单总金额',
                        data: []
                    },
                    {
                        name: '已支付总金额',
                        type: 'line',
                        stack: '已支付总金额',
                        data: []
                    },
                    {
                        name: '退货总金额',
                        type: 'line',
                        stack: '退货总金额',
                        data: []
                    },
                    {
                        name: '已退款总金额',
                        type: 'line',
                        stack: '已退款总金额',
                        data: []
                    }
                ],
                teamLineBarAmount: [
                    {
                        name: '下单总数',
                        type: 'line',
                        stack: '下单总数',
                        data: []
                    },
                    {
                        name: '已支付订单总数',
                        type: 'line',
                        stack: '已支付订单总数',
                        data: []
                    },
                    {
                        name: '退货订单总数',
                        type: 'line',
                        stack: '退货订单总数',
                        data: []
                    },
                    {
                        name: '已退款订单总数',
                        type: 'line',
                        stack: '已退款订单总数',
                        data: []
                    }
                ],
                DateMoney: ['2017/1/1', '2017/1/2', '2017/1/3', '2017/1/4', '2017/1/5', '2017/1/6', '2017/1/7'],
                DateAmount: ['2017/1/1', '2017/1/2', '2017/1/3', '2017/1/4', '2017/1/5', '2017/1/6', '2017/1/7'],
                khbh: this.$route.query.khbh,
                khmc: this.$route.query.khmc,
                lxr: this.$route.query.lxr,
                sjhm: this.$route.query.sjhm,
                dateRange: '',
                dateFromto: '',
                goodsDate: '',
                ajaxHistoryData: []
            };
        },
        components: {
            searchData,
            orderList,
            multiBarChart,
            pagination
        },
        methods: {
            salesAmount (dataRange) {
                this.dateRange = dataRange;
                apiCustAnalyzeSalesAmount(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59'
                    }),
                    khbh: this.khbh
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.teamLineBarMoney[0].data = res.data.order_amount;
                        this.teamLineBarMoney[1].data = res.data.order_pay_amount;
                        this.teamLineBarMoney[2].data = res.data.return_amount;
                        this.teamLineBarMoney[3].data = res.data.return_has_amount;
                        this.DateMoney = res.data.date_list;
                    }
                });
                this.salesNum(dataRange);
            },
            salesNum (dataRange) {
                this.dateFromto = dataRange;
                apiCustAnalyzeSalesNum(this, {
                    params: JSON.stringify({
                        starttime: this.dateFromto[0] + ' 00:00:00',
                        endtime: this.dateFromto[1] + ' 23:59:59'
                    }),
                    khbh: this.khbh
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.teamLineBarAmount[0].data = res.data.order_num;
                        this.teamLineBarAmount[1].data = res.data.order_pay_num;
                        this.teamLineBarAmount[2].data = res.data.return_num;
                        this.teamLineBarAmount[3].data = res.data.return_has_num;
                        this.DateAmount = res.data.date_list;
                    }
                });
            },
            goodsAnalyze (dataRange) {
                this.goodsDate = dataRange;
                apiCustAnalyzeGoods(this, {
                    params: JSON.stringify({
                        starttime: this.goodsDate[0] + ' 00:00:00',
                        endtime: this.goodsDate[1] + ' 23:59:59',
                        khbh: this.khbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
//                        this.salesData.data = res.data.list;
                        this.ajaxHistoryData = res.data.list;
                        this.totalNum = res.data.list.length;
                        if (res.data.total_num < this.limit) {
                            this.salesData.data = this.ajaxHistoryData;
                        } else {
                            this.salesData.data = this.ajaxHistoryData.slice(0, this.limit);
                        }
                    }
                });
            },
            backTo () {
                this.$store.commit('gobackState', 'custom');
                history.go(-1);
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.salesData.data = this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            // 可在此从服务端获取表格数据
        }
    };
</script>
