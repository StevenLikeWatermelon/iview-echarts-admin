<template>
    <Modal v-model='showAddModal' :mask-closable=false :width="90" :title="'当前查询的供应商: ' + currentApplyName + '/' + currentApplyId">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.buy_order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.pay_status"  placeholder="请选择付款状态" @on-change="search">
                                <Option v-for="status in zfStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.ship_status"  placeholder="请选择发货状态" @on-change="search">
                                <Option v-for="status in fhStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.store_no"  placeholder="请选择到货仓库" filterable @on-change="search">
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.order_attach_no" placeholder="输入纸质合同编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetimeRange' @on-change="getDatetime"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" style="margin-right: 20px;" :loading="loading" @click="confirmAddHT">确定</Button>
                    <Button type="primary" style="margin-right: 20px;" @click="cancelShowHT">取消</Button>
                    <span style="padding-right: 20px;">待付款总金额：<span style="color: #cf0012;">{{totalAmountToPay}}</span></span>
                    <span style="padding-right: 20px;">勾选待付款总金额：<span style="color: #cf0012;">{{checkedAmountToPay}}</span></span>
                </Col>
                <el-table :data="HTDataList" ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column  type="selection"  width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip label="采购合同单编号" prop="buy_order_no" fixed width="150">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="total_amount" label="应付款金额" show-overflow-tooltip sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="to_pay_amount" label="待付款金额" show-overflow-tooltip  min-width="150"></el-table-column>
                    <el-table-column prop="store_name" label="到货仓库" show-overflow-tooltip sortable="custom"  min-width="120"></el-table-column>
                    <el-table-column prop="pay_status" label="付款状态" show-overflow-tooltip sortable="custom"  min-width="120">
                        <template slot-scope="scope">
                            <span>{{zfStatus[scope.row.pay_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ship_status" label="发货状态" show-overflow-tooltip sortable="custom"  min-width="120">
                        <template slot-scope="scope">
                            <span>{{fhStatus[scope.row.ship_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_attach_no" label="纸质合同编号" show-overflow-tooltip sortable="custom"  min-width="160"></el-table-column>
                    <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip sortable="custom"  min-width="160"></el-table-column>
                    <el-table-column prop="create_user_no" label="创建人" show-overflow-tooltip  min-width="160">
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}}/{{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
        <div slot="footer" style="display:none"></div>
    </Modal>
</template>
<script>
    import { apiAllStatus, purchaseFKAddGetHTApi, apiGetCommonStockList } from '@/config/getData';
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util';
    export default {
        data() {
            return {
                totalAmountToPay: 0.0000,
                checkedAmountToPay: 0.0000,
                loading: false,
                orderInfo: {
                    buy_order_no: '',
                    pay_status: 'all',
                    ship_status: 'all',
                    store_no: 'all',
                    order_attach_no: '',
                    datetimeRange: [],
                },
                zfStatus: {},
                zfStatusArr: [
                    {
                        value: 'all',
                        label: '选择付款状态'
                    }
                ],
                fhStatus: {},
                fhStatusArr: [
                    {
                        value: 'all',
                        label: '选择发货状态'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择到货仓库'
                    }
                ],

                HTDataList: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
            }
        },
        components: {
            pagination
        },
        props: ['showAddModal', 'currentApplyId', 'currentApplyName'],
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
                this.showAddModal= false;
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_order_pay_status', 'buy_order_ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*支付状态*/
                        this.zfStatus = res.data.buy_order_pay_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }
                        /*发货状态*/
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_ship_status) {
                            if (res.data.buy_order_ship_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_ship_status[key]
                                };
                                this.fhStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetCommonStockList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            cancelShowHT() {
                this.showAddModal = false;
            },
            confirmAddHT() {
                this.$emit('addNewData', this.multipleSelectionAll);
                this.multipleSelection = [];
                this.multipleSelectionAll = [];
                this.checkedAmountToPay = 0.0000;
            },
            getHTData() {
                purchaseFKAddGetHTApi(this, {
                    supplier_no: this.currentApplyId,
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        buy_order_no: this.orderInfo.buy_order_no,
                        order_attach_no: this.orderInfo.order_attach_no,

                        date_from: this.orderInfo.datetimeRange[0],
                        date_to: this.orderInfo.datetimeRange[1],

                        pay_status: this.orderInfo.pay_status == 'all' ? '' : this.orderInfo.pay_status,
                        ship_status: this.orderInfo.ship_status == 'all' ? '' : this.orderInfo.ship_status,
                        store_no: this.orderInfo.store_no == 'all' ? '' : this.orderInfo.store_no,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.real_amount = item.to_pay_amount;
                            item.note = '';
                        });
                        this.HTDataList = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.totalAmountToPay = res.data.to_pay_total;

                        this.$nextTick(() => {
                            this.HTDataList.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.multipleSelectionAll.push(row);
                    this.checkedAmountToPay = this.add(this.checkedAmountToPay, row.to_pay_amount, 4);

                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.multipleSelectionAll.splice(index, 1);
                    this.checkedAmountToPay = this.subtract(this.checkedAmountToPay, row.to_pay_amount, 4);
                }
            },
            selectAll (selection) {
                this.HTDataList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getHTData();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getHTData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getHTData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getHTData();
            },
            getDatetime(value) {
                this.orderInfo.datetimeRange = value;
                this.search();
            },
        },
        created() {
            this.getStatus();
        },
        watch: {
            showAddModal(value) {
                this.$emit('update:showAddModal', value);
                if (value) {
                    this.getHTData();
                }
            }
        }
    };
</script>