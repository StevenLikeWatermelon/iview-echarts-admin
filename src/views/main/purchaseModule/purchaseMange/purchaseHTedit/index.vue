<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="140" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="form.applyer"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.status"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in djStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.xgd_no" placeholder="输入采购合同修改单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.keywords" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="采购合同修改单编号" prop="khbh" width="130">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.order_change_no}, 'purchase_manage_HTedit_detail')">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_change_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="total_num" label="采购总数量" min-width="100"></el-table-column>
                    <el-table-column prop="reduce_total" label="取消总数量" sortable="custom" min-width="110"></el-table-column>
                    <el-table-column prop="order_amount" label="采购总金额" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.order_amount).toFixed(4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reduce_amount" label="取消总金额" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.reduce_amount).toFixed(4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注"  min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="状态 " prop="change_status" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ djStatus[scope.row.change_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column label="创建人" width="120">
                        <template slot-scope="scope">
                            <span> {{ scope.row.create_user_no+'/'+scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rel_order_no" label="采购合同单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.rel_order_no}, 'purchase_manage_HT_detail')">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiGetPurchaseHTeditList, apiAllStatus } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'purchase_manage_HTedit_index',
        data () {
            return {
                form: {
                    applyer: 'all',
                    status: 'all',
                    xgd_no: '',
                    htd_no: '',
                    keywords:'',
                    datetime: ''
                },
                orderData: {
                    data: [

                    ]
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                supperList: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                djStatus: [],
                djStatusArr: [
                    {
                        value: 'all',
                        label: '选择状态'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*单据状态*/
                        this.djStatus = res.data.change_status;
                        for (let key in res.data.change_status) {
                            if (res.data.change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.change_status[key]
                                };
                                this.djStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetPurchaseHTeditList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier_no: this.form.applyer == 'all' ? '' : this.form.applyer,
                        change_status: this.form.status,
                        order_change_no: this.form.xgd_no,
                        rel_order_no: this.form.htd_no,
                        keywords: this.form.keywords,
                        start_time: this.form.datetime[0],
                        end_time: this.form.datetime[1]
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
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
                this.form.applyer = 'all';
                this.form.status = 'all';
                this.form.xgd_no = '';
                this.form.htd_no = '';
                this.form.keywords = '';
                this.form.datetime = [];
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
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
//            this.getData();
        },
        activated () {
            this.getData();
        }
    };
</script>
