<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="search_info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <DatePicker type="daterange" placeholder="选择统计时间" :value='search_info.timeRange' @on-change="getCurrentTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.store_no"  placeholder="所属仓库" filterable @on-change="search">
                                <Option v-for="(item, index) in allStoreList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.brand_no"  placeholder="请选择品牌" filterable @on-change="search">
                                <Option v-for="(brand, index) in allBrandList" :value="brand.cpppbh" :key="index">{{ brand.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>

                        <Col span="4">
                            <Input v-model="search_info.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_order_no" placeholder="请输入产品订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_model_no" placeholder="请输入商品型号编号" @on-enter="search"></Input>
                        </Col>
                        
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="6">
                <Row>
                    <Col span="24">
                    <Card style="text-align: center;">
                        <p style="font-size:14px;color:#aaa;">期初金额</p>
                        <p style="font-size:20px;">{{totalInfo.before_total_amount}}</p>
                    </Card>
                    </Col>
                </Row>
            </Col>
            <Col span="6" class="padding-left-10">
                <Row>
                    <Col span="24">
                    <Card style="text-align: center;">
                        <p style="font-size:14px;color:#aaa;">期间入库金额</p>
                        <p style="font-size:20px;">{{totalInfo.in_total_amount}}</p>
                    </Card>
                    </Col>
                </Row>
            </Col>
            <Col span="6" class="padding-left-10">
                <Row>
                    <Col span="24">
                    <Card style="text-align: center;">
                        <p style="font-size:14px;color:#aaa;">期间出库金额</p>
                        <p style="font-size:20px;">{{totalInfo.out_total_amount}}</p>
                    </Card>
                    </Col>
                </Row>
            </Col>
            <Col span="6" class="padding-left-10">
                <Row>
                    <Col span="24">
                    <Card style="text-align: center;">
                        <p style="font-size:14px;color:#aaa;">期末金额</p>
                        <p style="font-size:20px;">{{totalInfo.after_total_amount}}</p>
                    </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="margin-top-10  margin-pag-botm">
            <Col span="24">
            <Card>
                <Button type="primary" style="margin-bottom:10px;" v-auth="out_bound_cost_export" @click="exportList">导出</Button>
                <el-table :data="dataList" border stripe style="text-align: center;width:100%" @sort-change="manualSort"  max-height="570">
                    <el-table-column show-overflow-tooltip prop="product_model_no" label="产品型号编号" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" min-width="120" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.brand_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.product_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="150" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.product_model}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="150" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.product_order_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="store_no" label="所属仓库" min-width="100"  sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.store_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="before_stock_num" label="期初数量" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="before_amount" label="期初金额" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="in_stock_num" label="期间入库数量" min-width="120" sortable="custom">
                        <template slot-scope="scope">
                            <span @click="goToDetailList(scope.row.product_model_no, scope.row.store_no, '1')" style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.in_stock_num}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="in_amount" label="期间入库金额" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="out_stock_num" label="期间出库数量" min-width="120" sortable="custom">
                        <template slot-scope="scope">
                            <span @click="goToDetailList(scope.row.product_model_no, scope.row.store_no, '2')" style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.out_stock_num}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="out_amount" label="期间出库金额" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="after_stock_num" label="期末数量" min-width="100 sortable="custom""></el-table-column>
                    <el-table-column show-overflow-tooltip prop="after_amount" label="期末金额" min-width="100" sortable="custom"></el-table-column>

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
    import pagination from '@/views/common/pagination.vue';
    import {operateAllBrandsList, apiGetCommonStockList,  finaceOutBoundBillListApi, finaceOutBoundBillListExportApi } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'out_bound_bill_index',
        data () {
            return {
                spinShow: false,
                out_bound_cost_export:'out_bound_bill_index_export_button',
                search_info: {
                    timeRange: [],
                    store_no: 'all',
                    brand_no: 'all',
                    product_name: '',
                    product_model: '',
                    product_order_no : '',
                    product_model_no : '',
                },
                totalInfo: {
                    before_total_amount: '',
                    in_total_amount: '',
                    out_total_amount: '',
                    after_total_amount: '',
                },
                dataList: [],

                allBrandList:[{
                    cpppbh: 'all',
                    cpppmc: '选择品牌',
                }],
                allStoreList:[{
                    value: 'all',
                    label: '选择仓库',
                }],

                orderField: '',
                orderDirection: 'desc',

                limit: 10,
                currentPage: 1,
                totalnum: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            goToDetailList (orderId, storeId, type) {
                let argu = {
                    orderId,
                    type,
                    startTime: this.search_info.timeRange[0] || '',
                    endTime: this.search_info.timeRange[1] || '',
                    storeId
                };
                util.openNewPage(this, 'out_bound_detail_index', argu);
                this.$router.push({
                    name: 'out_bound_detail_index',
                    query: argu
                });
            },
            getAllBrand () {
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        if (this.allBrandList.length == 1) {
                            this.allBrandList = this.allBrandList.concat(res.data.list);
                        }
                    }
                });
            },
            getAllStore () {
                apiGetCommonStockList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            this.allStoreList.push({
                                value: item.ckbh,
                                label: item.ckmc
                            })
                        });
                    }
                });
            },
            getData () {
                this.spinShow = true;
                finaceOutBoundBillListApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        start_time: this.search_info.timeRange[0],
                        end_time: this.search_info.timeRange[1],

                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        store_no: this.search_info.store_no === 'all' ? '' : this.search_info.store_no,

                        product_name: this.search_info.product_name,
                        product_model: this.search_info.product_model,
                        product_order_no: this.search_info.product_order_no,
                        product_model_no: this.search_info.product_model_no,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;

                        this.totalInfo.before_total_amount = res.data.before_total_amount;
                        this.totalInfo.in_total_amount = res.data.in_total_amount;
                        this.totalInfo.out_total_amount = res.data.out_total_amount;
                        this.totalInfo.after_total_amount = res.data.after_total_amount;

                        //获取默认时间区间
                        let startTime = res.data.params.start_time;
                        let endTime = res.data.params.end_time;
                        this.search_info.timeRange = [startTime, endTime];

                    }else{
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },


            /*导出*/
            exportList () {
                finaceOutBoundBillListExportApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        start_time: this.search_info.timeRange[0],
                        end_time: this.search_info.timeRange[1],

                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        store_no: this.search_info.store_no === 'all' ? '' : this.search_info.store_no,

                        product_name: this.search_info.product_name,
                        product_model: this.search_info.product_model,
                        product_order_no: this.search_info.product_order_no,
                        product_model_no: this.search_info.product_model_no,
                    }))
                })
            },

            search () {
                this.currentPage = 1;
                this.getData();
            },
            getCurrentTime (time) {
                this.search_info.timeRange = time || [];
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
            this.getAllStore();
            this.getAllBrand();
        },
        activated() {
            this.getData();
        }
    };
</script>
