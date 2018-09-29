<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="form" class="model-style">
                        <Row>
                        	<Col span="4">
                                <Select v-model="form.supplier_no"  placeholder="选择供应商" filterable @on-change="search">
                                    <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.pay_status" @on-change="search">
                                    <Option v-for="status in all_order_status" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.from_order" @on-change="search">
                                    <Option v-for="status in all_order_from" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                           <Input v-model="form.from_order_no" placeholder="请输入来源单据编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.create_user" placeholder="请输入" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                    <DatePicker type="datetimerange" :value="form.datetime" placeholder="请选择" @on-change="datetime" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.order_payment_no" placeholder="请输入采购退款单编号" @on-enter="search"></Input>
                            </Col>
                            <!-- <Col span="4" style="text-align: center;margin-bottom:0;">
	                            <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
	                            <Button type="default" @click="reset">重置</Button>
                            </Col> -->
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                        <el-table-column prop="order_payment_no" label="采购退款单编号" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_payment_no,'purchase_manage_TK_detail')">{{scope.row.order_payment_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gysmc" label="供应商" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="payable_amount" label="应退款金额" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="real_amount" label="退款金额"  sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="note" label="说明" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="pay_status" label="状态" sortable="custom" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ order_status[scope.row.pay_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column label="创建人" show-overflow-tooltip>
                            <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="from_order" label="来源类型" sortable="custom" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ order_from[scope.row.from_order] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from_order_no" label="来源单据编号" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.from_order_no,scope.row.from_order)">{{scope.row.from_order_no}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseReturnPayList } from '@/config/getData';
    import util from '@/libs/util';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                form: {
                    supplier_no: 'all',
                    pay_status: 'all',
                    order_payment_no: '',
                    from_order: 'all',
                    from_order_no: '',
                    create_user: '',
                    datetime: ''
                },
                orderData: {
                    data: []
                },
                page: 1,
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                ajaxHistoryData: [],
                dateRange: '',
                orderField: '',
                orderDirection: 'desc',
                order_status: [],
                all_order_status: [
                    {
                        value: 'all',
                        label: '选择状态'
                    }
                ],
                order_from: [],
                all_order_from: [
                    {
                        value: 'all',
                        label: '选择来源类型'
                    }
                ],
                supperList: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                startTime: ''
            };
        },
        methods: {
            goToDetail (id, pageName) {
                let query = {};
                if (!isNaN(pageName)) {
                    switch (pageName) {
                        case '0':
                            pageName = 'purchase_manage_HT_detail';
                            query.param = id;
                            break;
                        case '1':
                            pageName = 'purchase_manage_HTedit_detail';
                            query.param = id;
                            break;
                        default:
                            pageName = 'purchase_manage_TH_detail';
                            query.param = id;
                            break;
                    }
                } else {
                    query.param = id;
                }
                util.redirectPage(this, pageName, query);
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_pay_status', 'buy_payment_from'])
                }).then(res => {
                    if (res && res.status === 1) {
                        let tmpObj = {};
                        // 退款状态成功
                        this.order_status = res.data.buy_pay_status;
                        for (let key in res.data.buy_pay_status) {
                            if (res.data.buy_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_pay_status[key]
                                };
                                this.all_order_status.push(tmpObj);
                            }
                        }
                        // 退款状态成功
                        this.order_from = res.data.buy_payment_from;
                        for (let key in res.data.buy_payment_from) {
                            if (res.data.buy_payment_from.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_payment_from[key]
                                };
                                this.all_order_from.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetPurchaseReturnPayList(this, {
                    params: JSON.stringify(this.notempty({
                        supplier_no: this.form.supplier_no === 'all' ? '' : this.form.supplier_no,
                        pay_status: this.form.pay_status === 'all' ? '' : this.form.pay_status,
                        order_payment_no: this.form.order_payment_no,
                        from_order: this.form.from_order === 'all' ? '' : this.form.from_order,
                        from_order_no: this.form.from_order_no,
                        create_user: this.form.create_user,
                        create_time: this.startTime === '' ? '' : this.form.datetime[0] + '~' + this.form.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status === 1) {
                        // 成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.supperList = [
                            {
                                value: 'all',
                                label: '选择供应商'
                            }
                        ];
                        res.data.suppliers.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.pay_status = 'all';
                this.form.supplier_no = 'all';
                this.form.order_payment_no = '';
                this.form.from_order = 'all';
                this.form.from_order_no = '';
                this.form.create_user = '';
                this.form.datetime = [];
                this.startTime = '';
                this.search();
            },
            datetime (time) {
                this.form.datetime = time;
                this.startTime = this.form.datetime[0];
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
                this.orderDirection = column.order === 'descending' ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>