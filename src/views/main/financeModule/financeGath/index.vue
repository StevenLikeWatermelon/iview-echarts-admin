<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="orderInfo.khmc"  filterable @on-change="search">
                                <Option v-for="val in customerList" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.status"  @on-change="search">
                                <Option v-for="val in receiptStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.ways"  @on-change="search">
                                <Option v-for="val in gathWaysArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.receipt_no" placeholder="请输入财务收款单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.receipt_acoount" placeholder="请输入收款账号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.certi_no" placeholder="请输入交易凭证号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择实际收款日期" :value="orderInfo.datetime1" @on-change="changeDatetime" style="width:100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.creater" placeholder="请输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <!-- <Col span="4" style="text-align: center;margin-bottom:0;margin-top:20px;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col> -->
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="handleClick('', 'gath_order_add')" v-auth="financeRolesShow" style="margin-right:10px;">新增财务收款单</Button>
                    <Button type="primary" v-auth="gathorderexport" @click="exportList"  style="margin-right:10px;">导出</Button>
                    <Button type="primary" @click="handleClick('', 'gath_order_patch_add')" v-auth="financeRolesShow" style="margin-right:10px;">批量新增财务收款单</Button>
                    <span class="margin-left-20">收款金额总计： <em style="color:#cf0012;font-style: normal;">{{ all_amount }}</em></span>
                    <span class="margin-left-20">已勾选收款金额总计： <em style="color:#cf0012;font-style: normal;">{{ checkamount }}</em></span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column  type="selection"  width="55" fixed></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_no" label="财务收款单编号" min-width="120" fixed>
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.receipt_no}, 'gath_order_detail')">{{scope.row.receipt_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="customer_no" label="客户编号" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="customer_name" label="客户名称" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_type" label="收款方式" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span>{{gathWays[scope.row.receipt_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_bank" label="收款银行" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_account" label="收款账号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="trans_no" label="交易凭证号" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_time" label="实际收款日期" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_amount" label="收款金额" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="note" label="备注" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="receipt_status" label="状态" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{receiptStatus[scope.row.receipt_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="create_time" label="创建时间" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="create_user" label="创建人" min-width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllKh,apiAllStatus, apiGetFinanceReceiptList,apiReceiptExport } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'gath_order',
        data () {
            return {
                orderInfo: {
                    khmc: 'all',
                    datetime: '',
                    datetime1: '',
                    status: 'all',
                    ways: 'all',
                    receipt_no: '',
                    receipt_acoount: '',
                    certi_no: '',
                    creater: ''
                },
                orderData: {
                    data: [
                        {
                            return_apply_no: '121212'
                        }
                    ]
                },
                all_amount: '12.11',
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                customerList: [
                    {
                        value: 'all',
                        label: '选择客户名称'
                    }
                ],
                spinShow: true,
                abolishStatus: [],
                gathWays: [],
                gathWaysArr: [
                    {
                        value: 'all',
                        label: '选择收款方式'
                    }
                ],
                receiptStatus: [],
                receiptStatusArr: [
                    {
                        value: 'all',
                        label: '选择状态'
                    }
                ],
                financeRolesShow: 'cwRoles',
                gathorderexport: 'gath_order_export',
                datetime1: [],
                multipleSelection: [],
                checkamount: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.checkamount = (+this.checkamount +   +row.receipt_amount).toFixed(4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.checkamount = (+this.checkamount  - +row.receipt_amount).toFixed(4);

                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['receipt_type', 'finance_receipt_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.gathWays = res.data.receipt_type;
                        let tmpObj = {};
                        for (let key in res.data.receipt_type) {
                            if (res.data.receipt_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.receipt_type[key]
                                };
                                this.gathWaysArr.push(tmpObj);
                            }
                        }
                        this.receiptStatus = res.data.finance_receipt_status;
                        for (let key in res.data.finance_receipt_status) {
                            if (res.data.finance_receipt_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.finance_receipt_status[key]
                                };
                                this.receiptStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                //获取所有客户
//                apiAllKh(this, {}).then(res => {
//                    if (res && res.status == 1) {
//                        //成功
//                        res.data.kh_list.forEach(item => {
//                            this.customerList.push({
//                                value: item.khbh,
//                                label: item.khmc
//                            });
//                        });
//                    }
//                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                apiGetFinanceReceiptList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        customer_no  : this.orderInfo.khmc == 'all' ? '' : this.orderInfo.khmc,
                        receipt_status : this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        receipt_type : this.orderInfo.ways == 'all' ? '' : this.orderInfo.ways,
                        receipt_no : this.orderInfo.receipt_no,
                        receipt_account : this.orderInfo.receipt_acoount,
                        trans_no : this.orderInfo.certi_no,
                        create_user : this.orderInfo.creater,
                        starttime : this.orderInfo.datetime[0],
                        endtime : this.orderInfo.datetime[1],
                        real_starttime: this.orderInfo.datetime1[0],
                        real_endtime: this.orderInfo.datetime1[1],
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.all_amount = res.data.total_amount;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }
                        this.customerList = [
                            {
                                value: 'all',
                                label: '选择客户名称'
                            }
                        ];
                        res.data.customers.forEach(item => {
                            this.customerList.push({
                                value: item.customer_no,
                                label: item.customer_name
                            });
                        });
                        this.spinShow = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            /*导出*/
            exportList () {
                apiReceiptExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        customer_no  : this.orderInfo.khmc == 'all' ? '' : this.orderInfo.khmc,
                        receipt_status : this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        receipt_type : this.orderInfo.ways == 'all' ? '' : this.orderInfo.ways,
                        receipt_no : this.orderInfo.receipt_no,
                        receipt_account : this.orderInfo.receipt_acoount,
                        trans_no : this.orderInfo.certi_no,
                        create_user : this.orderInfo.creater,
                        starttime : this.orderInfo.datetime[0],
                        endtime : this.orderInfo.datetime[1],
                        real_starttime: this.orderInfo.datetime1[0],
                        real_endtime: this.orderInfo.datetime1[1],
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
                this.orderInfo.datetime = [];
                this.orderInfo.ways = 'all';
                this.orderInfo.receipt_no = '';
                this.orderInfo.khmc = 'all';
                this.orderInfo.receipt_acoount = '';
                this.orderInfo.certi_no = '';
                this.orderInfo.creater = '';
                this.orderInfo.status = 'all';
                this.orderInfo.datetime1 =[];
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            changeDatetime (time) {
                this.orderInfo.datetime1 = time;
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
        },
        activated() {
            this.getData();
        }
    };
</script>
