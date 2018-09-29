<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Form inline v-if="showAll">
                        <Row>
                            <Col span="4">
                            <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getTeamSalesData"  style="width: 100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                    <Form inline v-if="!showAll">
                        <Row>
                            <Col span="4">
                            <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getPersonsInTeamList" style="width: 100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col>
                <Card>
                    <Row v-if="showAll">
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
                        <Col span="24" class="margin-top-10" style="text-align: center" >
                            <el-table :data="salesData.data" border stripe @sort-change="manualSort">
                                <el-table-column label="团队名称" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <Button  @click="handleClick(scope.row, 1)" type="text" size="small"><span style="color: rgb(45, 140, 240)">{{scope.row.depart_name}}</span></Button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="managerName" label="团队主管" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="customer_num" label="客户总数" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="sell_out_num" label="出库单总数" min-width="120"  sortable show-overflow-tooltip></el-table-column>
                                <el-table-column prop="sell_out_amount" label="已出库总金额" min-width="120"  sortable show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span> {{ parseFloat(scope.row.sell_out_amount).toFixed(4) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="order_count" label="销售合同单总数" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="order_amount" label="销售合同单总金额" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="paid_count" label="已支付订单总数" min-width="130" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="paid_amount" label="已支付总金额" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="return_count" label="退货单总数" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="return_amount" label="退货总金额" min-width="120" sortable="custom" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span> {{ parseFloat(scope.row.return_amount).toFixed(4) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="refund_count" label="已退款单总数" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="refund_amount" label="已退款总金额" min-width="120" sortable="custom" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span> {{ parseFloat(scope.row.refund_amount).toFixed(4) }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Col>
                    </Row>
                    <Row v-if="!showAll">
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
                        <Col span="24" class="margin-top-10" style="text-align: center" >
                            <el-table :data="salesData.data" border stripe row-class-name="table-height" @sort-change="manualSort">
                                <el-table-column :label="isService + '编号'" show-overflow-tooltip min-width="120">
                                    <template slot-scope="scope">
                                        <Button  @click="handleClick(scope.row, 0)" type="text" size="small"><span style="color: rgb(45, 140, 240)">{{scope.row.user_no}}</span></Button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="user_name" :label="isService + '名称'" min-width="120" show-overflow-tooltip></el-table-column>
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
            </col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiTeamAnalyzeList, personsInTeamSales } from '@/config/getData';
    import { sortBy, getStore,getSpecialDateRange } from '@/config/mUtils';

    export default {
        name: 'team-analysis-index',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                isService: '销售人员',
                showAll: true,
                jsonPersonal: '',
                teamPaidCircleData: [],
                personalOrderSalesCircle: [],
                personalPaidSalesCircle: [],
                orderCircleData: [],
                dateRange: getSpecialDateRange(),
                Total:[],
            };
        },
        methods: {
            handleClick(row, type) {
                let argu;
                if (type == 1) {
                    argu = { teamName: row.depart_name, managerName: row.managerName, depart_id: row.depart_id};
                    this.$router.push({
                        name: 'team_analytical_data',
                        query: argu
                    });
                } else {
                    argu = { user_no: row.user_no, user_name: row.user_name };
                    this.$router.push({
                        name: 'team_person_analytical_data',
                        query: argu
                    });
                }
            },
            getTeamSalesData (dateRange) {
                if (dateRange) {
                    this.dateRange = dateRange;
                }

                apiTeamAnalyzeList(this, {
                    date_from: this.dateRange[0] + ' 00:00:00',
                    date_to:this.dateRange[1] + ' 23:59:59'
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.team && res.data.team.length) {
                            res.data.team.forEach((item, index) => {
                                let tmpNameArr = [];
                                let tempPaidCircle = {};
                                let tempOrderCircle = {};
                                // 处理主管名称
                                for (let prop in item.manager) {
                                    tmpNameArr.push(item.manager[prop]);
                                }
                                item.managerName = tmpNameArr.join(',');
                                //处理已支付饼状图
                                tempPaidCircle = {
                                    value: item.paid_amount,
                                    name: item.depart_name
                                };
                                this.teamPaidCircleData.splice(index, 1, tempPaidCircle);
                                //处理订单总额饼状图
                                tempOrderCircle = {
                                    value: item.order_amount,
                                    name: item.depart_name
                                }
                                this.orderCircleData.splice(index, 1, tempOrderCircle);
                            });
                            this.salesData.data = res.data.team;
                            this.Total = res.data.total;
                        }
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.salesData.data.sort(sortBy(column.prop, isDec));
            },
            getPersonsInTeamList (dateRange) {
                if (dateRange) {
                    this.dateRange = dateRange;
                }
                personsInTeamSales(this, {
                    date_from: this.dateRange[0] + ' 00:00:00',
                    date_to: this.dateRange[1] + ' 23:59:59',
                    user_list: JSON.stringify(this.jsonPersonal.split(','))
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
            }
        },
        created () {
            //判断是不是只有一个部门
            let searchMembers = getStore('teamNumbers') ? JSON.parse(getStore('teamNumbers')) : '';
            if (searchMembers.length == 1) {
                this.showAll = false;
                this.jsonPersonal = searchMembers[0].members;
            }
            //判断是不是客服
            this.isService = getStore('isService') ? '客服人员' : '销售人员';
            //打开日期共享
//            this.$store.commit('broadcastShareState', true);
//            if (this.$store.state.isGoback != 'team') {
//                this.$store.commit('broadcastSharedDateRange', JSON.parse(JSON.stringify(this.$store.state.watchWeekArr)));
//                this.$store.commit('changeCurrentTab', 2);
//            }

            if(this.showAll == true){
                this.getTeamSalesData();
            }else{
                this.getPersonsInTeamList();
            }
        }
    };
</script>
