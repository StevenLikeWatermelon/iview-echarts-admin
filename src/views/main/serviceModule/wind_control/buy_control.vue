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
                        <Select v-model="form.buyer"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择采购员</Option>
                            <Option v-for="status in buy_user_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.type"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in riskBuy" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <!-- <Col span="8">
                        <FormItem label="供应商名称：">
                            <Select v-model="form.supplier_no"  placeholder="请选择" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in supplyArr" :value="status.gysbh" :key="status.gysbh">{{ status.gysmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col> -->
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择查询时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
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
                    <Button type="primary" @click="exportData" v-auth="buyControlExport">导出</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center"  max-height="570">
                    <el-table-column label="采购合同单号" prop="buy_order_no" width="150"></el-table-column>
                    <el-table-column prop="gysmc" label="供应商名称" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column label="采购员" min-width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}}<em v-if="scope.row.create_user_no">/</em>{{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buy_limit" label="采购额度" min-width="100"></el-table-column>
                    <el-table-column prop="total_amount" label="采购合同金额" min-width="100"></el-table-column>
                    <el-table-column prop="pay_amount" label="付款金额" min-width="100"></el-table-column>
                    <el-table-column prop="instock_amount" label="已入库金额 " min-width="100"></el-table-column>
                    <el-table-column label="已收票金额" prop="receive_invoice_amount" min-width="100"></el-table-column>
                    <el-table-column label="已退货金额" prop="return_amount" min-width="100"></el-table-column>
                    <el-table-column label="已退票金额" prop="return_invoice_amount" min-width="100"></el-table-column>
                    <el-table-column label="已退款金额" prop="refund_amount" min-width="100"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, allpersonInfos, apiGetWindControlBuy, apiGetPurchaseSupplierList, apiGetWindControlBuyOut } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'wind_control_buy',
        data () {
            return {
                buy_user_list: [],
                form: {
                    htd_no: '',
                    buyer: 'all',
                    type: '1',
                    // supplier_no: 'all',
                    datetime: ''
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                riskBuy: [],
                supplyArr: [],
                buyControlExport: 'wind-control-buy-bth'
            };
        },
        components: {
            pagination
        },
        methods: {
            getBuys () {
                allpersonInfos(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        this.buy_user_list = res.data.list;
                    }
                });
                apiGetPurchaseSupplierList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.supplyArr = res.data.list;
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
                    type: JSON.stringify(['risk_buy'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        // this.backStatus = res.data.requisition_status;
                        let tmpObj = {};
                        this.riskBuy = [];
                        for (let key in res.data.risk_buy) {
                            if (res.data.risk_buy.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.risk_buy[key]
                                };
                                this.riskBuy.push(tmpObj);
                            }
                        }
                        for (let i in this.riskBuy) {
                            if (this.riskBuy[i].label === '全部') {
                                this.riskBuy[i].label = '选择异常类型';
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetWindControlBuy(this, {
                    params: JSON.stringify(this.notempty({
                        buy_no: this.form.htd_no,
                        buyer_no: this.form.buyer === 'all' ? '' : this.form.buyer,
                        type: this.form.type,
                        // supplier_no: this.form.supplier_no === 'all' ? '' : this.form.supplier_no,
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
                apiGetWindControlBuyOut(this, {
                    params: JSON.stringify(this.notempty({
                        buy_no: this.form.htd_no,
                        buyer_no: this.form.buyer === 'all' ? '' : this.form.buyer,
                        type: this.form.type,
                        supplier_no: this.form.supplier_no === 'all' ? '' : this.form.supplier_no,
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
                    buyer: 'all',
                    // supplier_no: 'all',
                    type: '1',
                    datetime: ''
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
