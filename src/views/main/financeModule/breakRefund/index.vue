<style>
    .padding-ten {
        margin-bottom: 10px;
        margin-top: 10px;
        display: inline-block;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="orderInfo.customer_no"  placeholder="请选择客户名称" filterable @on-change="search">
                                <Option v-for="status in allCustomerArr" :value="status.customer_no" :key="status.customer_no">{{ status.customer_name }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.deduct_no" placeholder="请输入违约扣款单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.deduct_status"  placeholder="请选择单据状态" @on-change="search">
                                <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.creater" placeholder="请输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <!-- <Col span="4" style="text-align: center;margin-bottom:0;">
                            <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                            <Button type="default" @click="reset">重置</Button>
                        </Col> -->
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>  
        <Row class="margin-top-10  margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <Button v-if="canAdd" type="primary" @click="addNew()">新增违约扣款单</Button>
                        <Button type="primary" :class="{'margin-left-10': canAdd}" v-auth="breakrefundexport" @click="exportList">导出</Button>
                        <span style="padding-left: 20px;">扣款金额总计：</span><span style="color: rgb(255, 0, 0);">{{allAmount}}</span>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip label="违约扣款单编号" min-width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.deduct_no, 'break_refund_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.deduct_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_no" label="客户编号" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" min-width="200"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="deduct_amount" label="扣款金额" sortable="custom" min-width="100"></el-table-column>   
                    <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="120"></el-table-column>   
                    <el-table-column show-overflow-tooltip prop="deduct_status" label="状态" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.deduct_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  label="创建人" width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.creater_no}}/{{scope.row.creater_name}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus,apiBreakRefundList, apiAllKh, apiBreakRefundModalName,apiDeductExport } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'break_refund',
        data () {
            return {
                breakrefundexport:'break_refund_export',
                allAmount: 0,
                allCustomer: {},
                allCustomerArr: [],
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                canAdd: false,
                orderInfo: {
                    customer_no: 'all',
                    deduct_status: 'all',
                    refund_method: 'all',
                    deduct_no: '',
                    refund_account: '',
                    creater: '',
                    datetime: []
                },
                orderData: {
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            addNew() {
                util.openNewPage(this, 'break_refund_add');
                this.$router.push({
                    name: 'break_refund_add'
                }); 
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['receipt_type', 'finance_deduct_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.finance_deduct_status;
                        let tmpObj = {};
                        for (let key in res.data.finance_deduct_status) {
                            if (res.data.finance_deduct_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.finance_deduct_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiBreakRefundList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        create_time: this.orderInfo.datetime.join('~'),
                        customer_no: this.orderInfo.customer_no === 'all' ? '' : this.orderInfo.customer_no,
                        deduct_no: this.orderInfo.deduct_no,
                        creater: this.orderInfo.creater,
                        deduct_status: this.orderInfo.deduct_status === 'all' ? '' : this.orderInfo.deduct_status,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.allAmount = res.data.total_amount;
                        this.allCustomerArr = [{customer_name: '选择客户名称',customer_no: 'all'}].concat(res.data.customers);
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },

            /*导出*/
            exportList () {
                apiDeductExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        create_time: this.orderInfo.datetime.join('~'),
                        customer_no: this.orderInfo.customer_no === 'all' ? '' : this.orderInfo.customer_no,
                        deduct_no: this.orderInfo.deduct_no,
                        creater: this.orderInfo.creater,
                        deduct_status: this.orderInfo.deduct_status === 'all' ? '' : this.orderInfo.deduct_status,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },

            judgeCanAdd() {
                apiBreakRefundModalName(this, {}).then(res => {
                    if (res && res.status == 1) {
                        isInCreaters(this, res.data).then(isIn => {
                            this.canAdd = isIn;                   
                        });
                    } else {    
                        this.$Message.error('获取modalname失败!');
                        this.canAdd = false;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    customer_no: 'all',
                    deduct_status: 'all',
                    refund_method: 'all',
                    deduct_no: '',
                    refund_account: '',
                    creater: '',
                    datetime: [],
                };
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.judgeCanAdd();
        },
        activated() {
            this.getData();
        }
    };
</script>
