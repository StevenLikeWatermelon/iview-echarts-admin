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
                            <Option value="all" >选择发货物流</Option>
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
                        <Select v-model="orderInfo.out_store"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="val in storeListArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24" v-auth="buttonAuth">
                    <Button type="primary" @click="toFreightRegister">生成运费登记单</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort" ref="multipleTable" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column prop="djbh" label="销售出库单编号" width="130"></el-table-column>
                    <el-table-column prop="ckmc" label="出库仓库" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="fhwlmc" label="发货物流" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.fhwlmc}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="hydh" label="物流单号" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="amount" label="物流费用"  sortable="custom" width="150">
                        <template slot-scope="scope">
                            <Input type="text" v-model="scope.row.amount" @on-blur="errorMess(scope.row.amount, scope.$index)"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注"  sortable="custom" width="150">
                        <template slot-scope="scope">
                            <Input type="text" v-model="scope.row.note"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售员" width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                           <span>{{scope.row.xsyg_ygbh}}/{{scope.row.xsyg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="创建时间" sortable="custom" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.czyg_ygbh}}/{{scope.row.czyg}}</span>
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
    import { apiAllKh,apiSendLogistic, allStoreInfos, allpersonInfos, apiGetStockNeedFreight, apiGetStockAddFreight } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                buttonAuth: 'packge_addmake_order_button',
                orderInfo: {
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
                sendLogiticsArr: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
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
                multipleSelection: []
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.sendLogiticsArr = res.data;
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
            selectOne(selection, row) {
                if (!!selection && typeof selection != 'string') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.djbh))) {
                    this.multipleSelection.push(row.djbh);
                }
                if (!row.checked && this.multipleSelection.includes(row.djbh)) {
                    let index = this.multipleSelection.indexOf(row.djbh);
                    this.multipleSelection.splice(index, 1);
                }
                console.log(this.multipleSelection);
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            /*物流费用验证*/
            errorMess (val, index) {
                let reg = /^\d+\.?(\d{1,2})?$/;
                let n = parseInt(index) + parseInt(1);
                if (!val) {
                    this.$Message.error('请填写第' + n + '行的物流费用');
                }
                if (!reg.test(val)) {
                    this.$Message.error('第' + n + '行的物流费用最多是两位小数');
                }
            },
            getData () {
                apiGetStockNeedFreight(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        hydh : this.orderInfo.logistic_no,
                        xsyg_ygbh : this.orderInfo.seller == 'all' ? '' : this.orderInfo.seller,
                        djbh : this.orderInfo.out_order_no,
                        fhwlbh : this.orderInfo.deliver_logistic == 'all' ? '' : this.orderInfo.deliver_logistic,
                        create_user : this.orderInfo.creater,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                        ckbh : this.orderInfo.out_store == 'all' ? '' : this.orderInfo.out_store,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        res.data.list.forEach(item => {
                           item.fee = '';
                        });
                        this.orderData.data = res.data.list;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.djbh)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            toFreightRegister () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let listTmp = [];
                    for (let i in this.multipleSelection) {
                        for (let j in this.orderData.data) {
                            let n = parseInt(j) + parseInt(1);
                            let reg = /^\d+\.?(\d{1,2})?$/;
                            if (this.multipleSelection[i] === this.orderData.data[j].djbh) {
                                if (!this.orderData.data[j].amount) {
                                    this.$Message.error('请填写第' + n + '行的物流费用');
                                    return false;
                                }
                                if (!reg.test(this.orderData.data[j].amount)) {
                                    this.$Message.error('第' + n + '行的物流费用最多是两位小数');
                                    return false;
                                }
                                if(this.orderData.data[j].amount == '0' && !this.orderData.data[j].note){
                                    this.$Message.error('第' + n + '行请输入运费为0备注');
                                    return false;
                                }

                                listTmp.push({djbh: this.multipleSelection[i], amount: this.orderData.data[j].amount,note: this.orderData.data[j].note});
                            }
                        }
                    }
                    apiGetStockAddFreight(this, {
                        params: JSON.stringify({
                            list: listTmp
                        })
                    }).then(res => {
                        if(res && res.status == 1){
                            closeCurrentPage(this);
                            this.handleClick('', 'freight-register');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.datetime = [];
                this.orderInfo.deliver_logistic = 'all';
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
            this.getData();
        },
        // activated() {
        //     this.getData();
        // }
    };
</script>
