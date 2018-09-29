<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    客户信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="8">
                        <FormItem label="客户编号：" style="margin:0;">
                            {{ custInfo.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ custInfo.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="状态：" style="margin:0;">
                            {{ statusArr[custInfo.is_deleted] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ custInfo.sell_user }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ custInfo.server_user }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="账户总额：" style="margin:0;">
                            {{ custInfo.total_amount }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.statement" placeholder="请输入交易流水号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.document" placeholder="请输入交易凭证号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.money_type"  placeholder="请选择"  @on-change="search">
                                <Option v-for="val in fundsTypeArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.from_type"  placeholder="请选择" @on-change="search">
                                <Option v-for="val in fromTypeArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.from_no" placeholder="请输入来源单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.trans_type"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="val in transTypeArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择交易时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
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
        <Row class="margin-top-10">
            <Col span="12">
            <Row>
                <Col span="24">
                <Card style="text-align: center;">
                    <p style="font-size:14px;color:#aaa;">充值</p>
                    <p style="font-size:20px;">{{can_all}}</p>
                </Card>
                </Col>
            </Row>
            </Col>
            <Col span="12" class="padding-left-10">
            <Row>
                <Col span="24">
                <Card style="text-align: center;">
                    <p style="font-size:14px;color:#aaa;">扣款</p>
                    <p style="font-size:20px;">{{block_all}}</p>
                </Card>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <el-table :data="orderData.data" border stripe style="text-align: center;width:100%;" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="trade_no" label="交易流水号" min-width="180"></el-table-column>
                    <el-table-column prop="trans_no" label="交易凭证号"></el-table-column>
                    <el-table-column prop="trans_time" label="交易时间" sortable="custom"></el-table-column>
                    <el-table-column prop="funds_type" label="资金类型" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ fundsType[scope.row.funds_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="trans_type" label="交易类型" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ transType[scope.row.trans_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="trans_amount" label="交易金额" sortable="custom"></el-table-column>
                    <el-table-column prop="balance" label="账户余额" sortable="custom"></el-table-column>
                    <el-table-column prop="from_order_type" label="来源单据类型" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ fromType[scope.row.from_order_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="from_order_no" label="来源单据编号" ></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-left-20"  @click="backTo">返回</Button>
                <Button type="primary" class="margin-left-20"  @click="toExport" v-auth="cashpooldetailexport">导出</Button>
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
    import { apiAllStatus, apiGetFinanceFundsDetailList,apiExportFundsDetail } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                custInfo: {},
                orderInfo: {
                    trans_type: 'all',
                    datetime: '',
                    money_type: 'all',
                    from_type: 'all',
                    statement: '',
                    document: '',
                    from_no: '',
                    creater: ''
                },
                customer_id: this.$route.query.param,
                orderData: {
                    data: []
                },
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
//                spinShow: true,
                can_all: '12121.00',
                block_all: '1211.00',
                statusArr: [],
                fundsType: [],
                fundsTypeArr: [
                    {
                        value: 'all',
                        label: '选择资金类型'
                    }
                ],
                transType: [],
                transTypeArr: [
                    {
                        value: 'all',
                        label: '选择交易类型'
                    }
                ],
                fromType: [],
                fromTypeArr: [
                    {
                        value: 'all',
                        label: '选择来源单据类型'
                    }
                ],
                cashpooldetailexport:'cash_pool_detail_export',
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['kh_is_deleted', 'funds_type', 'trans_type','funds_from_order_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.statusArr = res.data.kh_is_deleted;
                        this.fundsType = res.data.funds_type;
                        for (let key in res.data.funds_type) {
                            if (res.data.funds_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.funds_type[key]
                                };
                                this.fundsTypeArr.push(tmpObj);
                            }
                        }
                        this.transType = res.data.trans_type;
                        for (let key in res.data.trans_type) {
                            if (res.data.trans_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.trans_type[key]
                                };
                                this.transTypeArr.push(tmpObj);
                            }
                        }
                        this.fromType = res.data.funds_from_order_type;
                        for (let key in res.data.funds_from_order_type) {
                            if (res.data.funds_from_order_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.funds_from_order_type[key]
                                };
                                this.fromTypeArr.push(tmpObj);
                            }
                        }
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
            toExport(){
                apiExportFundsDetail(this, {
                    customer_account_id: this.customer_id,
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                        trade_no: this.orderInfo.statement,
                        trans_no: this.orderInfo.document,
                        funds_type : this.orderInfo.money_type == 'all' ? '' : this.orderInfo.money_type,
                        trans_type  : this.orderInfo.trans_type == 'all' ? '' : this.orderInfo.trans_type,
                        from_order_type : this.orderInfo.from_type == 'all' ? '' : this.orderInfo.from_type,
                        from_order_no : this.orderInfo.from_no,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getData () {
                apiGetFinanceFundsDetailList(this, {
                    customer_account_id: this.customer_id,
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                        trade_no: this.orderInfo.statement,
                        trans_no: this.orderInfo.document,
                        funds_type : this.orderInfo.money_type == 'all' ? '' : this.orderInfo.money_type,
                        trans_type  : this.orderInfo.trans_type == 'all' ? '' : this.orderInfo.trans_type,
                        from_order_type : this.orderInfo.from_type == 'all' ? '' : this.orderInfo.from_type,
                        from_order_no : this.orderInfo.from_no,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.custInfo = res.data.customer;
                        this.can_all = res.data.buy_amount;
                        if (!this.can_all || this.can_all === 'null') {
                            this.can_all = 0;
                        }
                        this.block_all = res.data.deduction_amount;
                        if (!this.block_all || this.block_all === 'null') {
                            this.block_all = 0;
                        }
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
                this.orderInfo.datetime = [];
                this.orderInfo.from_type = 'all';
                this.orderInfo.statement = '';
                this.orderInfo.trans_type = 'all';
                this.orderInfo.document = '';
                this.orderInfo.from_no = '';
                this.orderInfo.creater = '';
                this.orderInfo.money_type = 'all';
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
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
