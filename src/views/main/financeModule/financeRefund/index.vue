<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="orderInfo.khbh"  placeholder="请选择客户名称" filterable @on-change="search">
                                <Option v-for="status in allCustomerArr" :value="status.customer_no" :key="status.customer_no">{{ status.customer_name }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.status"  placeholder="请选择单据状态" @on-change="search"> 
                                <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.refund_method" @on-change="search">
                                <Option v-for="status in refundTypesArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.refund_no" placeholder="请输入财务退款单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.refund_account" placeholder="请输入退款账号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.create_no" placeholder="请输入创建人" @on-enter="search"></Input>
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
                        <Button  v-if="canAdd" type="primary" @click="addNew()">新增财务退款单</Button>
                        <Button type="primary" :class="{'margin-left-10': canAdd}" v-auth="refundorderexport" @click="exportList">导出</Button>
                        <span style="padding-left: 20px;">退款金额总计：</span><span style="color: rgb(255, 0, 0);">{{allAmount}}</span>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip label="财务退款单编号" min-width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.refund_no, 'refund_order_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.refund_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_no" label="客户编号" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" min-width="200">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="refund_type" label="退款方式" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ refundTypes[scope.row.refund_type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="refund_bank" label="退款银行" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="refund_account" label="退款账号" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="refund_amount" label="退款金额" sortable="custom" min-width="120"></el-table-column>   
                    <el-table-column show-overflow-tooltip prop="refund_reason" label="退款原因" min-width="120"></el-table-column>   
                    <el-table-column show-overflow-tooltip prop="refund_status" label="状态" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.refund_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="创建时间"  sortable="custom" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  label="创建人" min-width="120">
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
    import { apiAllStatus,apiFinanceRefundList, apiAllKh, apiFinanceRefundModalName,apiRefundExport } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'refund_order',
        data () {
            return {
                refundorderexport:'refund_order_export',
                allAmount: '100000',
                canAdd: false,
                allCustomer: {},
                allCustomerArr: [
                    {
                        customer_name: '选择客户名称',
                        customer_no: 'all'
                    }
                ],
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                refundTypes: {},
                refundTypesArr: [
                    {
                        label: '选择退款方式',
                        value: 'all'
                    }
                ],
                orderInfo: {
                    khbh: 'all',
                    status: 'all',
                    refund_method: 'all',
                    refund_no: '',
                    refund_account: '',
                    create_no: '',
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
                util.openNewPage(this, 'refund_order_add');
                this.$router.push({
                    name: 'refund_order_add'
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
                    type: JSON.stringify(['receipt_type', 'finance_refund_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.finance_refund_status;
                        this.refundTypes = res.data.receipt_type;
                        let tmpObj = {};
                        for (let key in res.data.finance_refund_status) {
                            if (res.data.finance_refund_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.finance_refund_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                        for (let key in res.data.receipt_type) {
                            if (res.data.receipt_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.receipt_type[key]
                                };
                                this.refundTypesArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            judgeCanAdd() {
                apiFinanceRefundModalName(this, {}).then(res => {
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
            getData () {
                apiFinanceRefundList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        start_time: this.orderInfo.datetime[0],
                        end_time: this.orderInfo.datetime[1],
                        khbh: this.orderInfo.khbh === 'all' ? '' : this.orderInfo.khbh,
                        refund_method: this.orderInfo.refund_method === 'all' ? '' : this.orderInfo.refund_method,
                        refund_no: this.orderInfo.refund_no,
                        refund_account: this.orderInfo.refund_account,
                        create_no: this.orderInfo.create_no,
                        status: this.orderInfo.status === 'all' ? '' : this.orderInfo.status,
                        rel_order_no: this.orderInfo.rel_order_no,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.allAmount = res.data.total_refunds;
                        this.allCustomerArr = [{customer_name: '选择客户名称',customer_no: 'all'}].concat(res.data.customers);
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },


            /*导出*/
            exportList () {
                apiRefundExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        start_time: this.orderInfo.datetime[0],
                        end_time: this.orderInfo.datetime[1],
                        khbh: this.orderInfo.khbh === 'all' ? '' : this.orderInfo.khbh,
                        refund_method: this.orderInfo.refund_method === 'all' ? '' : this.orderInfo.refund_method,
                        refund_no: this.orderInfo.refund_no,
                        refund_account: this.orderInfo.refund_account,
                        create_no: this.orderInfo.create_no,
                        status: this.orderInfo.status === 'all' ? '' : this.orderInfo.status,
                        rel_order_no: this.orderInfo.rel_order_no,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },

            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    khbh: 'all',
                    status: 'all',
                    refund_method: 'all',
                    refund_no: '',
                    refund_account: '',
                    create_no: '',
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
