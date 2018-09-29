<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    .diy-opcity .ivu-spin-fix {
        background-color: rgba(73, 80, 96, 0.2);
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.djbh" placeholder="请输入销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.serviceVal"  placeholder="请选择客服人员" filterable @on-change="search">
                                <Option v-for="item in orderInfo.serviceArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.order_status"  placeholder="请选择订单状态"  @on-change="search">
                                <Option v-for="(value, key) in orderStatus" :value="key" :key="key">{{ value }}</Option>
                            </Select>
                        </Col>
                        <Col span="4" v-if="!khbh">
                            <Input v-model="orderInfo.customer" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.paid_status" placeholder="请选择支付状态"  @on-change="search">
                                <Option v-for="(value, key) in payStatus" :value="key" :key="key">{{ value }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.saller" placeholder="请选择销售人员" filterable  @on-change="search">
                                <Option v-for="sale in orderInfo.sallerArr" :value="sale.ygbh" :key="sale.ygbh">{{ sale.ygxm }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
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
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip  label="销售合同单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="khmc" label="客户名称"  min-width="200"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="lxr" label="客户联系人" ></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="sjhm" label="客户联系方式"  min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="djrq" label="下单时间"   sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="ddje" label="订单金额"   sortable="custom">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.ddje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="yfje" label="应付金额"  sortable="custom">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.yfje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="sfje" label="实付金额" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.sfje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="xshtdzt" label="订单状态" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{orderStatus[scope.row.xshtdzt]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="khzfzt" label="支付状态" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{payStatus[scope.row.khzfzt]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  label="询价单编号" width="120">
                        <template slot-scope="scope">
                            <div>
                                <div @click="handleClick(scope.row.xjdbh, 'order_manage_inquery_detail')" type="text" size="small" v-if="scope.row.xjdbh">
                                       <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.xjdbh}}</span>
                                </div>
                                 <span v-else>-</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  label="退货情况" >
                        <template slot-scope="scope">
                        <div>
                            <el-popover trigger="hover" placement="top"  v-if='scope.row.thdjbhs.length > 0'>
                                <p v-for="(value, index) in scope.row.thdjbhs" style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(value, 'order_manage_return_detail')">{{ value }}</p>
                                <div slot="reference" class="name-wrapper">查看</div>
                            </el-popover>
                            <span v-else>-</span>
                        </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip  prop="czyg_ygbh" label="客服人员" width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip  prop="xsyg_ygbh" label="销售人员" width="120"></el-table-column>
                    <!--<el-table-column show-overflow-tooltip  label="操作" >-->
                        <!--<template slot-scope="scope">-->
                            <!--<Button  @click="handleClick(scope.row.ht_no, 'service-sales-htd-detail')" type="warning" size="small">详情查看</Button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
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
    import { apiOrderManageList, apiAllStatus, apiCustomerAllStaff, apiCustomOrderManageList} from '@/config/getData';
    import {getStore, setStore, notempty, sortBy} from '@/config/mUtils';
//    import util from '@/libs/util';
    export default {
        name: 'order-manage-index',
        data () {
            return {
                orderInfo: {
                    order_status: 'all',
                    customer: '',
                    paid_status: 'all',
                    saller: 'all',
                    sallerArr: [{
                        ygbh: 'all',
                        ygxm: '选择销售人员'
                    }],
                    djbh: '',
                    serviceVal: 'all',
                    serviceArr: [{
                        value: 'all',
                        label: '选择客服人员'
                    }],
                    datetime: ''
                },
                paid_statusList: [
                    {
                        key: '1',
                        label: '未支付'
                    },
                    {
                        key: '2',
                        label: '已支付'
                    }
                ],
                sellers: [
                    {
                        key: '1',
                        label: '张三'
                    },
                    {
                        key: '2',
                        label: '李四'
                    }
                ],
                orderData: {
                    title: [],
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                dateRange: '',
                orderStatus: '',
                orderDirection: 'desc',
                payStatus: '',
                spinShow: true
            };
        },
        props: ['khmc', 'khbh'],
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                let argu = { param: param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.orderStatus['all'] = '选择订单状态';
                        this.payStatus = res.data.khzfzt;
                        this.payStatus['all'] = '选择支付状态';
                    }
                });
            },
            getApiCustomerAllStaff (type) {
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
            },
            getData () {
                if (this.khbh) {
                    apiCustomOrderManageList(this, {
                        params: JSON.stringify(this.notempty({
                            numPerPage: this.limit,
                            pageNum: this.currentPage,
                            orderField: this.orderField,
                            orderDirection: this.orderDirection,
                            starttime: this.orderInfo.datetime[0],
                            endtime: this.orderInfo.datetime[1],
                            xsyg: this.orderInfo.saller == 'all' ? '' : this.orderInfo.saller,
                            kfyg: this.orderInfo.serviceVal == 'all' ? '' : this.orderInfo.serviceVal,
                            djbh: this.orderInfo.djbh,
                            khbh: this.khbh,
                            khzfzt: this.orderInfo.paid_status == 'all' ? '' : this.orderInfo.paid_status,
                            xshtdzt: this.orderInfo.order_status == 'all' ? '' : this.orderInfo.order_status
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.thdjbhs = item.thdjbhs ? item.thdjbhs.split(',') : [];
                            });
                            this.orderData.data = res.data.list;
                            this.totalnum = res.data.totalCount;
                            if (this.orderInfo.sallerArr.length <= 1) {
                                this.orderInfo.sallerArr = this.orderInfo.sallerArr.concat(res.data.xsyg);
                            }
                            this.spinShow = false;
                        }
                    });
                } else {
                    apiOrderManageList(this, {
                        params: JSON.stringify(this.notempty({
                            numPerPage: this.limit,
                            pageNum: this.currentPage,
                            orderField: this.orderField,
                            orderDirection: this.orderDirection,
                            starttime: this.orderInfo.datetime[0],
                            endtime: this.orderInfo.datetime[1],
                            xsyg: this.orderInfo.saller == 'all' ? '' : this.orderInfo.saller,
                            kfyg: this.orderInfo.serviceVal == 'all' ? '' : this.orderInfo.serviceVal,
                            djbh: this.orderInfo.djbh,
                            khmc: this.orderInfo.customer,
                            khzfzt: this.orderInfo.paid_status == 'all' ? '' : this.orderInfo.paid_status,
                            xshtdzt: this.orderInfo.order_status == 'all' ? '' : this.orderInfo.order_status
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.thdjbhs = item.thdjbhs ? item.thdjbhs.split(',') : [];
                            });
                            this.orderData.data = res.data.list;
                            this.totalnum = res.data.totalCount;
                            if (this.orderInfo.sallerArr.length <= 1) {
                                this.orderInfo.sallerArr = this.orderInfo.sallerArr.concat(res.data.xsyg);
                            }
                            this.spinShow = false;
                        }
                    });
                }
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.djbh = '';
                this.orderInfo.datetime = '';
                this.orderInfo.saller = 'all';
                this.orderInfo.serviceVal = 'all';
                this.orderInfo.customer = '';
                this.orderInfo.paid_status = 'all';
                this.orderInfo.order_status = 'all';
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
            this.orderInfo.customer = this.khmc || '';
            this.getApiCustomerAllStaff();
            this.getStatus();
            this.getData();
        }
    };
</script>
