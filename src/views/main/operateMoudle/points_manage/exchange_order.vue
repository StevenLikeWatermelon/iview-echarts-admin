<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="orderInfo" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="searchInfo.redeem_order_no" placeholder="输入积分兑换单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.sjhm" placeholder="输入客户联系方式" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="searchInfo.redeem_order_status" @on-change="search">
                                    <Option v-for="(status, index) in pointsStatusArr" :value="status.value" :key="index">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" placeholder="选择单据创建时间" :value="searchInfo.timeRange" style="width: 100%;" @on-change="getTime"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.receiver_name" placeholder="输入收货人姓名" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.receiver_phone" placeholder="输入收货人联系方式" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.integral_product" placeholder="输入商品名称/商品编号" @on-enter="search"></Input>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                    <Row style="margin-bottom: 10px;">
                        <col span="24">
                            <Button type="primary" style="margin-right:20px;" @click="exportDataList">导出</Button>
                        </col>
                    </Row>
                    <el-table :row-class-name="tableRowClassName" :data="dataList" border style="text-align: center" @sort-change="manualSort"  max-height="570">
                        <el-table-column prop="redeem_order_no" label="积分商品编号" width="140" sortable="custom">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.redeem_order_no)">{{scope.row.redeem_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" min-width="180" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="khmc" label="客户名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="lxr" label="客户联系人" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sjhm" label="客户联系方式" min-width="180" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="integral_product_no" label="积分商品编号" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="integral_product_name" label="积分商品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="redeem_num" label="购买数量" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="redeem_integral" label="使用积分数" min-width="110" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="receiver_name" label="收货人" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="receiver_phone" label="收货人联系方式" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="receiver_address" label="收货地址" min-width="150" sortable="custom" show-overflow-tooltip>
                           <!--  <template slot-scope="scope">
                                <span>{{scope.row.province_name}}</span> <span>{{scope.row.city_name}}</span> <span>{{scope.row.district_name}}</span> <span>{{scope.row.address}}</span> 
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="ship_no" label="发货物流" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ship_number" label="物流单号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="redeem_order_status" label="单据状态" width="100" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{pointsStatusObj[scope.row.redeem_order_status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>     
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus, exchangeListApi, exchangeListExportApi} from '@/config/getData';
    import {  } from '@/config/mUtils';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                searchInfo: {
                    redeem_order_no: '',
                    khmc: '',
                    sjhm: '',
                    redeem_order_status: 'all',
                    timeRange: [],
                    receiver_name: '',
                    receiver_phone: '',
                    integral_product: '',
                },

                pointsStatusObj: {},
                pointsStatusArr: [],

                dataList: [],

                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
            };
        },
        methods: {

            goToDetail (id) {
                util.openNewPage(this, 'exchange_order_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'exchange_order_detail',
                    query: {
                        param: id
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['redeem_order_status',])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};

                        // 积分单据状态
                        this.pointsStatusObj = res.data.redeem_order_status;
                        this.pointsStatusArr = [{
                            value: 'all',
                            label: '选择单据状态'
                        }];
                        for (let key in res.data.redeem_order_status) {
                            if (res.data.redeem_order_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.redeem_order_status[key]
                                };
                                this.pointsStatusArr.push(tmpObj);
                            }
                        }
                        this.getData();
                    }
                });
            },   
            exportDataList() {
                exchangeListExportApi(this, {
                    params: JSON.stringify({
                        redeem_order_no: this.searchInfo.redeem_order_no,
                        khmc: this.searchInfo.khmc,
                        sjhm: this.searchInfo.sjhm == 'all' ? '' : this.searchInfo.sjhm,
                        redeem_order_status: this.searchInfo.redeem_order_status == 'all' ? '' : this.searchInfo.redeem_order_status,
                        receiver_name: this.searchInfo.receiver_name == 'all' ? '' : this.searchInfo.receiver_name,
                        receiver_phone: this.searchInfo.receiver_phone == 'all' ? '' : this.searchInfo.receiver_phone,
                        integral_product: this.searchInfo.integral_product == 'all' ? '' : this.searchInfo.integral_product,
                        starttime: this.searchInfo.timeRange[0],
                        endtime: this.searchInfo.timeRange[1],

                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                })
            },         
            getData () {
                exchangeListApi(this, {
                    params: JSON.stringify({
                        redeem_order_no: this.searchInfo.redeem_order_no,
                        khmc: this.searchInfo.khmc,
                        sjhm: this.searchInfo.sjhm == 'all' ? '' : this.searchInfo.sjhm,
                        redeem_order_status: this.searchInfo.redeem_order_status == 'all' ? '' : this.searchInfo.redeem_order_status,
                        receiver_name: this.searchInfo.receiver_name == 'all' ? '' : this.searchInfo.receiver_name,
                        receiver_phone: this.searchInfo.receiver_phone == 'all' ? '' : this.searchInfo.receiver_phone,
                        integral_product: this.searchInfo.integral_product == 'all' ? '' : this.searchInfo.integral_product,
                        starttime: this.searchInfo.timeRange[0],
                        endtime: this.searchInfo.timeRange[1],

                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.dataList = res.data.list;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            getTime (value) {
                this.searchInfo.timeRange = value || [];
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
        created() {
            this.getStatus();
        }
    };
</script>