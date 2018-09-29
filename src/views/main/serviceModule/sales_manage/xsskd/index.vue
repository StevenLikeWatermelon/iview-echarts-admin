<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.skd_djbh" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.xshtd_djbh" placeholder="输入销售合同单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.status"  placeholder="选择收款单状态" @on-change="search">
                            <Option value="all">选择收款单状态</Option>
                            <Option v-for="(value, index) in abolishStatus" :value="index" :key="index">{{ value }}</Option>
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
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="servicexsskdexport">导出</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="销售收款单编号" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.skd_djbh, 'service-xsskd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.skd_djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="下单时间"   sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="djbh" label="销售合同单编号"  sortable="custom" width="130" show-overflow-tooltip>
                         <template slot-scope="scope">
                            <span  @click="handleClick2(scope.row.htdid, scope.row.djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="khmc" label="客户名称"  min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="yfje" label="应付金额"  sortable="custom" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.yfje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitpay_money" label="未付款金额" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.waitpay_money).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="skje" label="本次收款金额" sortable="custom" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.skje).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="khzffsmc" label="支付方式" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">
                                <span style="color:#FF0000">{{abolishStatus[scope.row.status]}}</span>
                            </span>
                            <span v-else>{{abolishStatus[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" min-width="120" show-overflow-tooltip></el-table-column>
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
    import { apiSkdList,apiAllStatus,apiCustomerAllStaff,apiExportSkdList } from '@/config/getData';
    import { notempty } from '@/config/mUtils';

    export default {
        name: 'service-sales-skd',
        data () {
            return {
                orderInfo: {
                    xshtd_djbh: '',
                    skd_djbh: '',
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
                    title: [],
                    data: []
                },
                orderField: 'djrq',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                spinShow: true,
                abolishStatus: [],
                servicexsskdexport:'service-xsskd-export',
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['zuofei'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.abolishStatus = res.data.zuofei;
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
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            handleClick2 (order_id, htdbh, path) {
                let argu = { order_id,htdbh };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            toExport(){
                apiExportSkdList(this, {
                    params: JSON.stringify(this.notempty({
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        xshtd_djbh: this.orderInfo.xshtd_djbh,
                        skd_djbh: this.orderInfo.skd_djbh,
                        khmc: this.orderInfo.khmc,
                        status: this.orderInfo.status == 'all' ? '-1' : this.orderInfo.status,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getData () {
                apiSkdList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        xshtd_djbh: this.orderInfo.xshtd_djbh,
                        skd_djbh: this.orderInfo.skd_djbh,
                        khmc: this.orderInfo.khmc,
                        status: this.orderInfo.status == 'all' ? '-1' : this.orderInfo.status,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
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
                this.orderInfo.skd_djbh = '';
                this.orderInfo.khmc = '';
                this.orderInfo.czyg_ygbh = 'all';
                this.orderInfo.xsyg_ygbh = 'all';
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
