<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.djbh" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.khmc" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.xshtd_djbh" placeholder="销售合同单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.status"  placeholder="请选择单据状态"  @on-change="search">
                                <Option value="all">选择单据状态</Option>
                                <Option v-for="val in returnStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.czyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.xsyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10  margin-pag-botm">
            <Col span="24">
            <Card>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="return_apply_no" label="退货申请单编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.return_apply_no}, 'service-thsqd-detail')">{{scope.row.return_apply_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="申请退货时间" sortable="custom"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sell_order_no" label="销售合同单编号"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick2(scope.row.htdid, scope.row.sell_order_no, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_name" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contact_user" label="联系人" ></el-table-column>
                    <el-table-column prop="contact_method" label="联系方式" ></el-table-column>
                    <el-table-column prop="return_total" label="退货商品总额" sortable="custom" ></el-table-column>
                    <el-table-column prop="return_apply_status" label="单据状态">
                        <template slot-scope="scope">
                            <span>{{returnStatus[scope.row.return_apply_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
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
    import { apiSalesReturnApplyList,apiAllStatus,apiCustomerAllStaff } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'service-sales-thsqd',
        data () {
            return {
                orderInfo: {
                    xshtd_djbh: '',
                    djbh: '',
                    khmc: '',
                    datetime: '',
                    status: 'all',
                    appointKf:[{
                        value: 'all',
                        label: '选择客服'
                    }],
                    allSales:[{
                        value: 'all',
                        label: '选择销售'
                    }],
                    czyg_ygbh:'all',
                    xsyg_ygbh:'all',
                },
                orderData: {
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                spinShow: true,
                abolishStatus: [],
                returnStatus: [],
                returnStatusArr: []
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['return_apply_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.return_apply_status;
                        let tmpObj = {};
                        for (let key in res.data.return_apply_status) {
                            if (res.data.return_apply_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.return_apply_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                    }
                });

                 //所有销售
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.all_Sales = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ygbh;
                            item.label = item.ygxm;
                            this.orderInfo.allSales.push(item);
                        });
                    }
                });

                //指定客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.czyg_ygbh;
                            item.label = item.czyg;
                            this.orderInfo.appointKf.push(item);
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
            handleClick2 (order_id, htdbh, path) {
                let argu = { order_id,htdbh };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getData () {
                apiSalesReturnApplyList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        date_from : this.orderInfo.datetime[0],
                        date_to : this.orderInfo.datetime[1],
                        return_apply_no : this.orderInfo.djbh,
                        customer_name  : this.orderInfo.khmc,
                        sell_order_no : this.orderInfo.xshtd_djbh,
                        return_apply_status : this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.datetime = '';
                this.orderInfo.xshtd_djbh = '';
                this.orderInfo.djbh = '';
                this.orderInfo.khmc = '';
                this.orderInfo.status = 'all';
                this.orderInfo.xsyg_ygbh = 'all';
                this.orderInfo.czyg_ygbh = 'all';
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
            this.getData();
        }
    };
</script>
