<style>
    
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="orderInfo" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="applyInfo.gysbh" placeholder="请输入供应商编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="applyInfo.gysmc" placeholder="输入供应商名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="pickTime" placeholder="请选择时间" @on-change="getDateRange" style="width: 100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Card>
                <col span="24" v-auth="supplyExportBtn">
                    <Button type="primary" @click="exportOut">导出</Button>
                </col>
                <el-table :data="applyList" border stripe style="text-align: center"  class="margin-top-10" max-height="570">
                    <el-table-column prop="gysbh" label="供应商编号" width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.gysbh)">{{scope.row.gysbh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商名称" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="order_num" label="采购合同单数量" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="order_amount" label="采购合同单金额"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_num" label="采购入库单数量"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_amount" label="采购入库单金额"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="return_num" label="采购退货单数量"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="return_amount" label="采购退货单金额"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="refund_num" label="采购退款单数量"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="refund_amount" label="采购退款单金额"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="invoice_num" label="采购收票单数量(正常)"  width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="invoice_amount" label="采购收票单金额(正常)"  width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="negative_num" label="采购收票单数量(红冲)"  width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="negative_amount" label="采购收票单金额(红冲)"  width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="pay_num" label="采购付款单数量"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="pay_amount" label="采购付款单金额"  width="120" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    import pagination from '../../../../common/pagination.vue';
    import { apiGetPurchaseSupplyAnalyseList, apiGetPurchaseSupplyAnalyseListExport } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';
    export default {
        name: 'supply_analyse',
        components: {
            pagination
        },
        data () {
            return {
                applyInfo: {
                    gysbh: '',
                    gysmc: '',
                },
                supplyExportBtn: 'supply_analyse_index_button',
                pickTime: [],
                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'asc',
            };
        },
        methods: {            
            getData () {
                apiGetPurchaseSupplyAnalyseList(this, {
                    params: JSON.stringify(this.notempty({
                        gysbh:this.applyInfo.gysbh,
                        gysmc:this.applyInfo.gysmc,
                        start_time: this.pickTime[0],
                        end_time: this.pickTime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.applyList = res.data.list;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            exportOut() {
                apiGetPurchaseSupplyAnalyseListExport(this, {
                    params: JSON.stringify(this.notempty({
                        gysbh:this.applyInfo.gysbh,
                        gysmc:this.applyInfo.gysmc,
                        start_time: this.pickTime[0],
                        end_time: this.pickTime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                })
            },
            goToDetail (id) {
                util.openNewPage(this, 'purchase_apply_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_apply_detail',
                    query: {
                        param: id
                    }
                });
            },
            getDateRange (time) {
                this.pickTime = time;
                this.search();
            },
            search () {
                this.currentPage = 1;
                this.getData();
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
        },
        activated() {
            this.getData();
        }
    };
</script>