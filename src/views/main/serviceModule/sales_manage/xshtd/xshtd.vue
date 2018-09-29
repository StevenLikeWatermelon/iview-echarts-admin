<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.order_no" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.serviceVal"  placeholder="选择客服人员" filterable @on-change="search">
                            <Option v-for="item in orderInfo.serviceArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.saller" placeholder="选择销售人员" filterable @on-change="search">
                                <Option v-for="sale in orderInfo.sallerArr" :value="sale.value" :key="sale.value">{{ sale.label }}</Option>
                            </Select>
                        </Col>
                        <!-- <Col span="4">
                            <Input v-model="orderInfo.xyht" placeholder="请输入新阳合同ID" @on-enter="search"></Input>
                        </Col> -->
                        <Col span="4">
                            <Select v-model="orderInfo.order_status" multiple   placeholder="选择订单状态" @on-change="search">
                                <Option v-for="status in orderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.paid_status" placeholder="选择" @on-change="search">
                                <Option v-for="status in payStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.unlock_status" placeholder="选择" @on-change="search">
                                <Option v-for="status in unlockStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.rel_order_type" placeholder="选择" @on-change="search">
                                <Option v-for="status in relOrderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                         <Col span="4">
                            <Input v-model="orderInfo.djbz" placeholder="输入备注" @on-enter="search"></Input>
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
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="XSHTList_export">导出</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center;" @sort-change="manualSort" max-height="570">
                    <el-table-column label="销售合同单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.djbh}, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="下单时间"   sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称"  min-width="200" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  min-width="100"></el-table-column>
                    <el-table-column prop="fhfsmc" label="发货方式" ></el-table-column>
                    <el-table-column prop="unlock_status" label="锁库状态" >
                        <template slot-scope="scope">
                        <span> {{unlockStatus[scope.row.unlock_status]}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="ddje" label="订单金额"   sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.ddje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="yfje" label="应付金额"  sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.yfje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sfje" label="实付金额" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.sfje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="khzfzt" label="支付状态" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                        <span> {{payStatus[scope.row.khzfzt]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xshtdzt" label="订单状态" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{orderStatus[scope.row.xshtdzt]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rel_order_type" label="来源单据类型" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <span> {{relOrderStatus[scope.row.rel_order_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="来源单据编号" width="120">
                        <template slot-scope="scope">
                            <div>
                                <div @click="handleClickRel({param: scope.row.rel_order_no}, scope.row.rel_order_type)" type="text" size="small" v-if="scope.row.rel_order_no">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span>
                                </div>
                                <span v-else>-</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djbz" label="单据备注"  min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" width="120"></el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" width="120"></el-table-column>
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
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiSalesHtdList, apiCustomerAllStaff,apiExportHtdList } from '@/config/getData';
    import { notempty, setStore, getStore} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'service-sales-htd',
        data () {
            return {
                XSHTList_export:'XSHTList_export',
                orderInfo: {
                    order_no: '',
                    customer: '',
                    xyht: '',
                    serviceVal: 'all',
                    saller: 'all',
                    order_status: (this.$route.query.payStatus && this.$route.query.payStatus == '0') ? ['0','1','2','3','4','5','7','-1'] : (this.$route.query.orderStatus ? [this.$route.query.orderStatus] : []),
                    paid_status: this.$route.query.payStatus || 'all',
                    unlock_status: 'all',
                    rel_order_type: 'all',
                    datetime: '',
                    sallerArr: [{
                        value: 'all',
                        label: '选择销售人员'
                    }],
                    serviceArr: [{
                        value: 'all',
                        label: '选择客服人员'
                    }]
                },
                unlockStatus: '',
                unlockStatusArr: [
                    {
                        label: '选择锁库状态',
                        value: 'all'
                    }
                ],
                relOrderStatus: '',
                relOrderStatusArr: [
                    {
                        label: '选择来源单据类型',
                        value: 'all'
                    }
                ],
                orderData: {
                    title: [],
                    data: []
                },
                dateRange: '',
                orderStatus: '',
                orderStatusArr: [],
                payStatus: '',
                payStatusArr: [
                    {
                        label: '选择支付状态',
                        value: 'all'
                    }
                ],
                spinShow: true,
                date_from: '',
                date_to: '',
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            handleClickRel (param, type) {
                if(type == 1)
                {
                    var path = 'service-manage-detail';
                    util.openNewPage(this, path, param);
                    this.$router.push({
                        name: path,
                        query: param
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt', 'unlock_status', 'sell_rel_order_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.orderStatus = res.data.xshtdzt;
                        for (let key in res.data.xshtdzt) {
                            if (res.data.xshtdzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xshtdzt[key]
                                };
                                this.orderStatusArr.push(tmpObj);
                            }
                        }
                        this.payStatus = res.data.khzfzt;
                        for (let key in res.data.khzfzt) {
                            if (res.data.khzfzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khzfzt[key]
                                };
                                this.payStatusArr.push(tmpObj);
                            }
                        }
                        this.unlockStatus = res.data.unlock_status;
                        for (let key in res.data.unlock_status) {
                            if (res.data.unlock_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.unlock_status[key]
                                };
                                this.unlockStatusArr.push(tmpObj);
                            }
                        }
                        this.relOrderStatus = res.data.sell_rel_order_type;
                        for (let key in res.data.sell_rel_order_type) {
                            if (res.data.sell_rel_order_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_rel_order_type[key]
                                };
                                this.relOrderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                /*所有客服*/
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_customer_service'
                    })
                }).then(res => {
                    res.data.list.forEach(item => {
                        item.value = item.czyg_ygbh;
                        item.label = item.czyg;
                        this.orderInfo.serviceArr.push(item);
                    });
                });
                /*所有销售*/
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.ygbh;
                            item.label = item.ygxm;
                            this.orderInfo.sallerArr.push(item);
                        });
                    }
                });
            },
            toExport(){
                apiExportHtdList(this, {
                    params: JSON.stringify(this.notempty({
                        djbh: this.orderInfo.order_no,
                        khmc: this.orderInfo.customer,
                        xy_ht_id: this.orderInfo.xyht,
                        xsyg_ygbh: this.orderInfo.saller === 'all' ? '' : this.orderInfo.saller,
                        czyg_ygbh: this.orderInfo.serviceVal === 'all' ? '' : this.orderInfo.serviceVal,
                        khzfzt: this.orderInfo.paid_status === 'all' ? '' : this.orderInfo.paid_status,
                        xshtdzt: this.orderInfo.order_status.length == 0 ? '' : this.orderInfo.order_status,
                        unlock_status: this.orderInfo.unlock_status === 'all' ? '' : this.orderInfo.unlock_status ,
                        rel_order_type: this.orderInfo.rel_order_type === 'all' ? '' : this.orderInfo.rel_order_type ,
                        date_from: this.orderInfo.datetime[0],
                        date_to: this.orderInfo.datetime[1],
                        djbz: this.orderInfo.djbz,
                        // numPerPage: this.limit,
                        // pageNum: this.currentPage,
                        // orderField: this.orderField,
                        // orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getData () {
                // if (getStore('tmpSearchObj' + this.$route.name)) {
                //     this.orderInfo = JSON.parse(getStore('tmpSearchObj' + this.$route.name));
                // }
                apiSalesHtdList(this, {
                    params: JSON.stringify(this.notempty({
                        djbh: this.orderInfo.order_no,
                        khmc: this.orderInfo.customer,
                        xy_ht_id: this.orderInfo.xyht,
                        xsyg_ygbh: this.orderInfo.saller === 'all' ? '' : this.orderInfo.saller,
                        czyg_ygbh: this.orderInfo.serviceVal === 'all' ? '' : this.orderInfo.serviceVal,
                        khzfzt: this.orderInfo.paid_status === 'all' ? '' : this.orderInfo.paid_status,
                        xshtdzt: this.orderInfo.order_status.length == 0 ? '' : this.orderInfo.order_status,
                        unlock_status: this.orderInfo.unlock_status === 'all' ? '' : this.orderInfo.unlock_status,
                        rel_order_type: this.orderInfo.rel_order_type === 'all' ? '' : this.orderInfo.rel_order_type,
                        date_from: this.orderInfo.datetime[0],
                        date_to: this.orderInfo.datetime[1],
                        djbz: this.orderInfo.djbz,
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                setStore('tmpSearchObj' + this.$route.name, JSON.stringify(this.orderInfo));
                this.getData();
            },
            reset () {
                this.orderInfo.order_no = '';
                this.orderInfo.customer = '';
                this.orderInfo.xyht = '';
                this.orderInfo.order_status = [];
                this.orderInfo.serviceVal = 'all';
                this.orderInfo.saller = 'all';
                this.orderInfo.paid_status = 'all';
                this.orderInfo.unlock_status = 'all';
                this.orderInfo.rel_order_type = 'all';
                this.orderInfo.datetime = '';
                this.orderInfo.djbz = '';
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
        },
        activated() {
            this.orderInfo.order_status = (this.$route.query.payStatus && this.$route.query.payStatus == '0') ? ['0','1','2','3','4','5','7','-1'] : (this.$route.query.orderStatus ? [this.$route.query.orderStatus] : this.orderInfo.order_status);
            this.orderInfo.paid_status = this.$route.query.payStatus || this.orderInfo.paid_status;
            this.getData();
        }
    };
</script>
