<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.return_no" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.from_order" @on-change="search">
                                <Option v-for="status in all_order_from" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.return_apply_no" placeholder="来源单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.return_status"  placeholder="选择单据状态" @on-change="search">
                                <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.service_man"  placeholder="选择客服" @on-change="search" filterable>
                            <Option v-for="status in service_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.sales_man"  placeholder="选择销售" @on-change="search" filterable>
                            <Option v-for="status in sales_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <!-- <Col span="24" style="text-align: center;margin-bottom:0;">
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
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                    <el-table-column label="销售退款单编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.refund_no }, 'service-xstkd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.refund_no }}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="from_order_type" label="来源单据类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{ refundFromType[scope.row.from_order_type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="from_order_no" label="来源单据编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.from_order_no}, 'service-xsthd-detail')" style="color: rgb(45, 140, 240);cursor: pointer;" v-if="scope.row.from_order_type == 1">{{scope.row.from_order_no}}</span>
                            <span  @click="handleClick({param: scope.row.from_order_no}, 'service-htxgd-detail')" style="color: rgb(45, 140, 240);cursor: pointer;" v-if="scope.row.from_order_type == 2">{{scope.row.from_order_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_name" label="客户名称" width="200"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="must_total" label="应退金额" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.must_total).toFixed(4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="return_total" label="实退金额" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.return_total).toFixed(4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="refund_status" label="单据状态">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.refund_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="server_no" label="客服">
                        <template slot-scope="scope">
                            <span> {{ scope.row.server_no }} / {{ scope.row.server_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seller_no" label="销售">
                        <template slot-scope="scope">
                            <span> {{ scope.row.seller_no }} / {{ scope.row.seller_name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiSalesRefundList,apiGetAllServiceMan,apiGetAllSalesman } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'service-sales-tkd',
        data () {
            return {
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ],
                orderInfo: {
                    return_no: '',
                    customer_name: '',
                    return_apply_no: '',
                    return_status: 'all',
                    datetime: [],
                    from_order: 'all',
                    service_man: 'all',
                    sales_man: 'all',
                },
                orderData: {
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                refundFromType: [],
                all_order_from: [
                    {
                        value: 'all',
                        label: '选择来源类型'
                    }
                ],
                sales_list: [
                    {
                        label: '选择销售',
                        value: 'all'
                    }
                ],
                service_list: [
                    {
                        label: '选择客服',
                        value: 'all'
                    }
                ],
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_refund', 'sell_refund_from_type', 'buy_invoice_from'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_refund;
                        let tmpObj = {};
                        for (let key in res.data.sell_refund) {
                            if (res.data.sell_refund.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_refund[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                        this.refundFromType = res.data.sell_refund_from_type;
                        for (let key in res.data.sell_refund_from_type) {
                            if (res.data.sell_refund_from_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_refund_from_type[key]
                                };
                                this.all_order_from.push(tmpObj);
                            }
                        }
                    }
                });

                apiGetAllServiceMan(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.service_list.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetAllSalesman(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.sales_list.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiSalesRefundList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        refund_no: this.orderInfo.return_no,
                        customer_name: this.orderInfo.customer_name,
                        from_order_no: this.orderInfo.return_apply_no,
                        refund_status: this.orderInfo.return_status === 'all' ? '' : this.orderInfo.return_status,
                        from_order_type: this.orderInfo.from_order ==='all' ? '' : this.orderInfo.from_order,
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if (res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    return_no: '',
                    customer_name: '',
                    return_apply_no: '',
                    return_status: 'all',
                    datetime: [],
                    service_man: 'all',
                    sales_man: 'all',
                };
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
