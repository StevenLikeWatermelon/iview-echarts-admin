<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :label-width="120" >
                    <Row>
                        <Col span="8">
                        <Input v-model="custName" placeholder="请输入客户名称" @on-enter="search">
                            <Button slot="append" icon="ios-search" @click="search"></Button>
                        </Input>
                        </Col>
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
                    <p style="font-size:14px;color:#aaa;">账户可用余额总计</p>
                    <p style="font-size:20px;">{{can_all}}</p>
                </Card>
                </Col>
            </Row>
            </Col>
            <Col span="12" class="padding-left-10">
            <Row>
                <Col span="24">
                <Card style="text-align: center;">
                    <p style="font-size:14px;color:#aaa;">账户冻结金额总计</p>
                    <p style="font-size:20px;">{{block_all}}</p>
                </Card>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="cashpoolexport">导出</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                    <el-table-column prop="customer_no" label="客户编号">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.id}, 'cash_pool_detail')">{{scope.row.customer_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_name" label="客户名称" min-width="200"></el-table-column>
                    <el-table-column prop="can_amount" label="账户可用余额" sortable="custom"></el-table-column>
                    <el-table-column prop="freeze_amount" label="账户冻结余额" sortable="custom"></el-table-column>
                    <el-table-column prop="total_amount" label="账户总金额" sortable="custom"></el-table-column>
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
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, apiGetFinanceFundsList,apiExportFinanceFunds } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'cash_pool',
        data () {
            return {
                custName: '',
                orderData: {
                    data: [
                        {
                            return_apply_no: '121212'
                        }
                    ]
                },
                orderField: 'can_amount',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                spinShow: true,
                can_all: '12121.00',
                block_all: '1211.00',
                cashpoolexport:'cash_pool_export',
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
            getData () {
                apiGetFinanceFundsList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        customer_name: this.custName
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.can_all = res.data.total_can;
                        this.block_all = res.data.total_freeze;
                        if (!this.can_all || this.can_all === 'null') {
                            this.can_all = 0;
                        }
                        if (!this.block_all || this.block_all === 'null') {
                            this.block_all = 0;
                        }
                        this.spinShow = false;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            toExport(){
                apiExportFinanceFunds(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        customer_name: this.custName
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
               this.custName = '';
               this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
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
//            this.getStatus();
        },
        activated() {
            this.getData();
        }
    };
</script>
