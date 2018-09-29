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
                            <Input v-model="orderInfo.djbh" placeholder="输入单据编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="orderInfo.customer" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="orderInfo.xjd_status" placeholder="请选择" @on-change="search">
                                <Option v-for="status in xjdStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <DatePicker  type="datetimerange" :value="orderInfo.datetime" placeholder="选择下单时间" @on-change="datetime" style="width:100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
            <Card>
                <el-table :data="salesData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                    <el-table-column prop="cpxhbh" label="销售询价单号" width="120">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick(scope.row.xjdbh, 'service-manage-detail')">{{scope.row.xjdbh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xjd_create" label="下单时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称"  min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  min-width="100"></el-table-column>
                    <el-table-column prop="xjd_valid_date" label="有效期"  sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="quotation_total_account" label="报价总额" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="xjd_status" label="报价单状态">
                        <template slot-scope="scope">
                            <span>{{ xjd_status[scope.row.xjd_status] }}</span>
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
    import searchData from '../../../common/search.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiServiceInqueryList, apiAllStatus } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    export default {
        name: 'goods_analyze',
        components: {
            searchData,
            pagination
        },
        data () {
            return {
                orderInfo: {
                    djbh: '',
                    customer: '',
                    xjd_status: 'all',
                    datetime: ''

                },
                salesData: {
                    data: []
                },
                seriesArr: [],
                page: 1,
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                ajaxHistoryData: [],
                dateRange: '',
                orderField: '',
                orderDirection: 'desc',
                xjd_status: '',
                xjdStatusArr: [
                    {
                        label: '选择询价单状态',
                        value: 'all'
                    }
                ]
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xjd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xjd_status = res.data.xjd_status;
                        let tmpObj = {};
                        for (let key in res.data.xjd_status) {
                            if (res.data.xjd_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xjd_status[key]
                                };
                                this.xjdStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiServiceInqueryList(this, {
                    params: JSON.stringify(this.notempty(
                        {
                            pageNum: this.currentPage,
                            numPerPage: this.limit,
                            orderField: this.orderField,
                            orderDirection: this.orderDirection,
                            xjdbh: this.orderInfo.djbh,
                            khmc: this.orderInfo.customer,
                            xjd_status: this.orderInfo.xjd_status === 'all' ? '' : this.orderInfo.xjd_status,
                            starttime: this.orderInfo.datetime[0],
                            endtime: this.orderInfo.datetime[1]
                        }
                    ))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.salesData.data = res.data.list;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.djbh = '';
                this.orderInfo.customer = '';
                this.orderInfo.xjd_status = 'all';
                this.orderInfo.datetime = [];
                this.search();
            },
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
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
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>