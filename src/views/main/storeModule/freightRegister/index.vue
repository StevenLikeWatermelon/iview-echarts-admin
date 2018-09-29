<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.order_no" placeholder="输入运费登记单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.deliver_logistic"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择发货物流</Option>
                            <Option v-for="val in sendLogiticsArr" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.seller"  placeholder="请选择" @on-change="search">
                            <Option v-for="val in sellListArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.out_order_no" placeholder="输入销售出库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.logistic_no" placeholder="输入物流单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.creater" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.out_store"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="val in storeListArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10" v-auth="allButtonAuth">
                    <Col span="24">
                    <Button type="primary" @click="addFreightRegister">新增运费登记单</Button>
                    <Button type="primary" class="margin-left-10" @click="exportList">导出</Button>
                    <Button type="primary" class="margin-left-10" @click="deleteList">删除</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            :selectable="canSelect"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column prop="freight_no" label="运费登记单编号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="store_name" label="出库仓库"  min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="from_order_no" label="销售出库单编号" width="150"></el-table-column>
                    <el-table-column prop="logistics_no" label="发货物流" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span>{{sendLogitics[scope.row.logistics_no]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ship_no" label="物流单号" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ship_amount" label="物流费用"  sortable="custom" width="100">
                         <template slot-scope="scope">
                            <span>{{parseFloat(scope.row.ship_amount).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seller_name" label="销售员" width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.seller_no}}/{{scope.row.seller_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="160"></el-table-column>
                    <el-table-column prop="create_user_name" label="创建人" width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}}/{{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
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
    import { apiAllKh, apiGetStockFreightList, allStoreInfos, allpersonInfos, apiGetStockFreightExport, apiSendLogistic, apiStockFreightDelete } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'freight-register',
        data () {
            return {
                allButtonAuth: 'package_bill_all_button',
                orderInfo: {
                    order_no: '',
                    deliver_logistic: 'all',
                    seller: 'all',
                    out_order_no: '',
                    logistic_no: '',
                    creater: '',
                    datetime: '',
                    out_store: 'all'
                },
                orderData: {
                    data: [
                        {
                            return_apply_no: '121212'
                        }
                    ]
                },
                all_amount: '12.11',
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                customerList: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                spinShow: true,
                abolishStatus: [],
                sendLogitics: [],
                sendLogiticsArr: [],
                storeList: [],
                storeListArr: [
                    {
                        value: 'all',
                        label: '选择出库仓库'
                    }
                ],
                sellList: [],
                sellListArr: [
                    {
                        value: 'all',
                        label: '选择销售员'
                    }
                ],
                multipleSelection: [],
            };
        },
        components: {
            pagination
        },
        methods: {
            deleteList () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                    return;
                }

                let out_list = '';
                let tmpArr = [];
                this.multipleSelection.forEach(item => {
                    tmpArr.push(item);
                });
                out_list = tmpArr.join(',');

                apiStockFreightDelete(this, {
                    xsckd_djbh: JSON.stringify(tmpArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.multipleSelection = [];
                        this.getData();
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
                if (row.checked && !(this.multipleSelection.includes(row.from_order_no))) {
                    this.multipleSelection.push(row.from_order_no);
                }
                if (!row.checked && this.multipleSelection.includes(row.from_order_no)) {
                    let index = this.multipleSelection.indexOf(row.from_order_no);
                    this.multipleSelection.splice(index, 1);
                }


            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            getStatus () {
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.sendLogiticsArr = res.data;
                        this.sendLogitics = {};
                        for (let i in res.data) {
                            this.sendLogitics[res.data[i].fhwlbh] = res.data[i].fhwlmc;
                        }
                    }
                });
            },
            getList () {
                allStoreInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.storeList = res.data.list;
                        res.data.list.forEach(item => {
                            item.label = item.ckmc;
                            item.value = item.ckbh;
                            this.storeListArr.push(item);
                        });
                    }
                });
                allpersonInfos(this, {
                    type: '1'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.sellList = res.data.list;
                        res.data.list.forEach(item => {
                            item.label = item.user_name;
                            item.value = item.user_no;
                            this.sellListArr.push(item);
                        });
                    }
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                apiGetStockFreightList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        freight_no : this.orderInfo.order_no,
                        logistics_no : this.orderInfo.deliver_logistic == 'all' ? '' : this.orderInfo.deliver_logistic,
                        seller_no : this.orderInfo.seller == 'all' ? '' : this.orderInfo.seller,
                        from_order_no : this.orderInfo.out_order_no,
                        ship_no : this.orderInfo.logistic_no,
                        create_user : this.orderInfo.creater,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                        store_no : this.orderInfo.out_store == 'all' ? '' : this.orderInfo.out_store,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.all_amount = res.data.total_amount;
                        this.spinShow = false;

                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.from_order_no)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            addFreightRegister () {
                this.handleClick('', 'freight-register-add');
            },
            /*导出*/
            exportList () {
                apiGetStockFreightExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        freight_no : this.orderInfo.order_no,
                        logistics_no : this.orderInfo.deliver_logistic == 'all' ? '' : this.orderInfo.deliver_logistic,
                        seller_no : this.orderInfo.seller == 'all' ? '' : this.orderInfo.seller,
                        from_order_no : this.orderInfo.out_order_no,
                        ship_no : this.orderInfo.logistic_no,
                        create_user : this.orderInfo.creater,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                        store_no : this.orderInfo.out_store == 'all' ? '' : this.orderInfo.out_store,
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
                this.orderInfo.deliver_logistic = 'all';
                this.orderInfo.order_no = '';
                this.orderInfo.seller = 'all';
                this.orderInfo.out_order_no = '';
                this.orderInfo.logistic_no = '';
                this.orderInfo.creater = '';
                this.orderInfo.out_store = 'all';
                this.multipleSelection = [];
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
            this.getList();
        },
        activated() {
            this.getData();
        }
    };
</script>
