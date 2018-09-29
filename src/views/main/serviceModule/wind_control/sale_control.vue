<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="输入销售合同单单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.manager"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择客户经理</Option>
                            <Option v-for="status in salesArr" :value="status.user_no" :key="status.user_no">{{ status.user_name}}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.service"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择客服</Option>
                            <Option v-for="status in serviceArr" :value="status.user_no" :key="status.user_no">{{ status.user_name}}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.type"  placeholder="请选择" filterable @on-change="search">
                            <!-- <Option value="all">全部</Option> -->
                            <Option v-for="item in riskSell" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择查询时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.name"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择客户名称</Option>
                            <Option v-for="status in customerArr" :value="status.khbh" :key="status.khbh">{{ status.khmc }}</Option>
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
                    <!-- <Button type="primary" @click="handleClick('', 'purchase_manage_BH_add')">新增采购备货单</Button> -->
                    <Button type="primary" @click="exportData" v-auth="saleControlExport">导出</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" max-height="570">
                    <el-table-column label="销售合同单号" prop="djbh" min-width="120"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column label="客户经理" min-width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.xsyg_ygbh}}<em v-if="scope.row.xsyg_ygbh">/</em>{{scope.row.xsyg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="客服" min-width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.czyg_ygbh}}<em v-if="scope.row.czyg_ygbh">/</em>{{scope.row.czyg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="yfje" label="合同金额" min-width="100"></el-table-column>
                    <el-table-column prop="wlje" label="物流金额" min-width="100"></el-table-column>
                    <el-table-column prop="receipt_amount" label="收款金额" min-width="100"></el-table-column>
                    <el-table-column prop="modify_amount" label="修改金额 " min-width="100"></el-table-column>
                    <el-table-column prop="onstock_lock_amount" label="现货锁库金额 " min-width="100"></el-table-column>
                    <el-table-column prop="onwaystock_lock_amount" label="在途锁库金额 " min-width="100"></el-table-column>
                    <el-table-column label="请购金额" prop="buy_amount" min-width="100"></el-table-column>
                    <el-table-column prop="ship_amount" label="发货金额 " min-width="100"></el-table-column>
                    <el-table-column label="入库金额" prop="instock_amount" min-width="100"></el-table-column>
                    <el-table-column label="出库金额" prop="outstock_amount" min-width="100"></el-table-column>
                    <el-table-column label="开票金额" prop="invoice_amount" min-width="100"></el-table-column>
                    <el-table-column label="退货金额" prop="return_amount" min-width="100"></el-table-column>
                    <el-table-column prop="refund_amount" label="退款金额" min-width="100"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, allpersonInfos, apiGetWindControlSell, apiAllKh, apiGetWindControlSellOut } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'wind_control_sale',
        data () {
            return {
                buy_user_list: [],
                form: {
                    htd_no: '',
                    manager: 'all',
                    service: 'all',
                    type: '1',
                    datetime: '',
                    name: 'all'
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                salesArr: [],
                serviceArr: [],
                customerArr: [],
                riskSell: [],
                saleControlExport: 'wind-control-sale-btn'
            };
        },
        components: {
            pagination
        },
        methods: {
            getBuys () {
                allpersonInfos(this, {
                    type: '1'
                }).then(res => {
                    if (res && res.status == 1) {
                        this.salesArr = res.data.list;
                    }
                });
                allpersonInfos(this, {
                    type: '3'
                }).then(res => {
                    if (res && res.status == 1) {
                        this.serviceArr = res.data.list;
                    }
                });
                apiAllKh(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        this.customerArr = res.data.kh_list;
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['risk_sell'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        // this.riskSell = res.data.risk_sell;
                        let tmpObj = {};
                        this.riskSell = [];
                        for (let key in res.data.risk_sell) {
                            if (res.data.risk_sell.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.risk_sell[key]
                                };
                                this.riskSell.push(tmpObj);
                            }
                        }
                        for (let i in this.riskSell) {
                            if (this.riskSell[i].label === '全部') {
                                this.riskSell[i].label = '选择异常类型';
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetWindControlSell(this, {
                    params: JSON.stringify(this.notempty({
                        order_no: this.form.htd_no,
                        sell_no: this.form.manager === 'all' ? '' : this.form.manager,
                        customer_no: this.form.service === 'all' ? '' : this.form.service,
                        khbh: this.form.name === 'all' ? '' : this.form.name,
                        type: this.form.type,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            exportData () {
                apiGetWindControlSellOut(this, {
                    params: JSON.stringify(this.notempty({
                        order_no: this.form.htd_no,
                        sell_no: this.form.manager === 'all' ? '' : this.form.manager,
                        customer_no: this.form.service === 'all' ? '' : this.form.service,
                        khbh: this.form.name === 'all' ? '' : this.form.name,
                        type: this.form.type,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1]
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
                this.form =  {
                    htd_no: '',
                    manager: 'all',
                    service: 'all',
                    type: '1',
                    datetime: '',
                    name: 'all'
                };
                this.search();
            },
            datetime (time) {
                this.form.datetime = time;
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
        },
        created () {
            this.getBuys();
            this.getStatus();
            this.getData();
        },
        activated () {
            // this.getData();
        }
    };
</script>
