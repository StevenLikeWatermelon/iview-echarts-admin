<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row>
                    <Col span="12">
                    <span>团队名称： {{$route.query.teamName}}</span>
                    <span style="margin-left:50px;">团队主管： {{$route.query.managerName}}</span>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>

        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form inline :label-width="80"  class="model-style">
                    <Row>
                        <Col span="4">
                        <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getPersonsInTeamList"  style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>

        <Row class="margin-top-10 margin-pag-botm">
            <Col>
            <Card>
                <Row>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>出库单总数:</span><span style="margin-left:15px;color: #FF0000;">{{Total.out_count}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>已出库金额:</span><span style="margin-left:15px;color: #FF0000;">{{Total.out_amount}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>销售合同单:</span><span style="margin-left:15px;color: #FF0000;">{{Total.order_count}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>合同总金额:</span><span style="margin-left:15px;color: #FF0000;">{{Total.order_amount}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>已支付订单:</span><span style="margin-left:15px;color: #FF0000;">{{Total.paid_count}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>已支付金额:</span><span style="margin-left:15px;color: #FF0000;">{{Total.paid_amount}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>退货单总数:</span><span style="margin-left:15px;color: #FF0000;">{{Total.return_count}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>退货总金额:</span><span style="margin-left:15px;color: #FF0000;">{{Total.return_amount}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>已退款单数:</span><span style="margin-left:15px;color: #FF0000;">{{Total.refund_count}}</span>
                    </Col>
                    <Col span="4" style="margin-bottom: 10px;">
                    <span>已退款金额:</span><span style="margin-left:15px;color: #FF0000;">{{Total.refund_amount}}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span="24" class="margin-top-10" style="text-align: center" >
                    <el-table :data="salesData.data" border stripe row-class-name="table-height">
                        <el-table-column :label=" isService + '编号'" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <Button  @click="handleClick(scope.row)" type="text" size="small"><span style="color: rgb(45, 140, 240)">{{scope.row.user_no}}</span></Button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="user_name" :label=" isService + '名称'" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sell_out_num" label="出库单总数" min-width="120" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sell_out_amount" label="已出库总金额" min-width="120" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.sell_out_amount).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_count" label="销售合同单总数" min-width="150" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="order_amount" label="销售合同单总金额" min-width="150" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="paid_count" label="已支付订单总数" min-width="130" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="paid_amount" label="已支付总金额" min-width="120" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="return_count" label="退货单总数" min-width="120" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="return_amount" label="退货总金额" min-width="120" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.return_amount).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="refund_count" label="已退款单总数" min-width="120" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="refund_amount" label="已退款总金额" min-width="120" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.refund_amount).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
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
    import Cookies from 'js-cookie';
    import { personsInTeamSales } from '@/config/getData';
    import { getStore,getSpecialDateRange } from '@/config/mUtils';
    export default {
        name: 'team_analysis-analyticalData',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                isService: '销售人员',
                dateRange: getSpecialDateRange(),
                personalOrderSalesCircle: [],
                personalPaidSalesCircle: [],
                Total:[],
            };
        },
        methods: {
            backTo () {
                this.$store.commit('gobackState', 'team');
                history.go(-1);
            },
            getPersonsInTeamList (dateRange) {
                if (dateRange) {
                    this.dateRange = dateRange;
                }
                let searchMembers = getStore('teamNumbers') ? JSON.parse(getStore('teamNumbers')) : '';
                let jsonPersonal = ''
                searchMembers.forEach(item => {
                    if (this.$route.query.depart_id == item.depart_id) {
                        jsonPersonal = item.members;
                    }
                });
                personsInTeamSales(this, {
                    date_from: this.dateRange[0] + ' 00:00:00',
                    date_to: this.dateRange[1] + ' 23:59:59',
                    user_list: JSON.stringify(jsonPersonal.split(','))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.personalOrderSalesCircle = [];
                        this.personalPaidSalesCircle = [];
                        res.data.user.forEach(item => {
                            this.personalOrderSalesCircle.push({value: item.order_amount, name: item.user_name});
                            this.personalPaidSalesCircle.push({value: item.paid_amount, name: item.user_name});
                        });
                        this.salesData.data = res.data.user;
                        this.Total = res.data.total;
                    }
                });
            },
            handleClick(row) {
                let argu = { user_no: row.user_no, user_name: row.user_name };
                this.$router.push({
                    name: 'team_person_analytical_data',
                    query: argu
                });
            }
        },
        created () {
            //判断是不是客服
            this.isService = getStore('isService') ? '客服人员' : '销售人员';
            this.getPersonsInTeamList();
        }
    };
</script>
