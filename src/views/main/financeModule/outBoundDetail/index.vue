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
                        <Col span="4">
                            <Select v-model="search_info.order_type"  placeholder="业务类型" filterable @on-change="search">
                                <Option v-for="(item, index) in allBussinessTypeArr" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.stock_type"  placeholder="数据类型" filterable @on-change="search">
                                <Option v-for="(item, index) in allDataTypeArr" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.supplier_no"  placeholder="供应商名称" filterable @on-change="search">
                                <Option v-for="(item, index) in allSupplierArr" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.customer_no"  placeholder="客户名称" filterable @on-change="search">
                                <Option v-for="(item, index) in allCustomerArr" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
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
                    <el-table-column show-overflow-tooltip prop="store_no" label="所属仓库" min-width="100" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.store_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="supplier_no" label="供应商编号" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="gysmc" label="供应商名称" min-width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.supplier_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_no" label="客户编号" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="khmc" label="客户名称" min-width="150" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.customer_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_type" label="业务类型" min-width="110" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{allBussinessTypeObj[scope.row.order_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="stock_type" label="数据类型" min-width="100" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{allDataTypeObj[scope.row.stock_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="price" label="出入库单价" min-width="110" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stock_num" label="出入库数量" min-width="110" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="amount" label="出入库金额" min-width="110" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stock_time" label="出入库时间" min-width="180" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="after_price" label="结存单价" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="after_stock_num" label="结存数量" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="after_amount" label="结存金额" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_no" label="单据编号" min-width="130" sortable="custom"></el-table-column>

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
    import {operateAllBrandsList, apiGetCommonStockList, apiAllStatus,  finaceOutBoundDetailListApi, finaceOutBoundDetailListExportApi, apiGetFinanceAllkh, apiGetPurchaseSupplierList } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                spinShow: false,
                out_bound_cost_export:'out_bound_detail_index_export_button',
                search_info: {
                    timeRange: [],
                    store_no: 'all',
                    brand_no: 'all',
                    product_name: '',
                    product_model: '',
                    product_order_no : '',
                    product_model_no : '',
                    order_type : 'all',
                    stock_type : 'all',
                    supplier_no : 'all',
                    customer_no : 'all',
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
                allBussinessTypeObj: {},
                allBussinessTypeArr: [{
                    value: 'all',
                    label: '业务类型',
                }],
                allDataTypeObj: {},
                allDataTypeArr: [{
                    value: 'all',
                    label: '数据类型',
                }],
                allSupplierArr: [{
                    value: 'all',
                    label: '供应商名称',
                }],
                allCustomerArr: [{
                    value: 'all',
                    label: '客户名称',
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
            getStatus (res) {
                if (res && res.status == 1) {
                    //成功
                    this.allBussinessTypeObj = res.data.bills_order_type;
                    this.allDataTypeObj = res.data.bills_stock_type;
                    let tmpObj = {};
                    for (let key in res.data.bills_order_type) {
                        if (res.data.bills_order_type.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.bills_order_type[key]
                            };
                            this.allBussinessTypeArr.push(tmpObj);
                        }
                    }
                    for (let key in res.data.bills_stock_type) {
                        if (res.data.bills_stock_type.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.bills_stock_type[key]
                            };
                            this.allDataTypeArr.push(tmpObj);
                        }
                    }
                }
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
            getAllStore (res) {
                if (res && res.status == 1) {
                    //成功
                    res.data.list.forEach(item => {
                        this.allStoreList.push({
                            value: item.ckbh,
                            label: item.ckmc
                        })
                    });
                }
            },
            async setAllSelectData () {
                let statusRes = await apiAllStatus(this, {type: JSON.stringify(['bills_order_type', 'bills_stock_type'])});
                let storeRes =  await apiGetCommonStockList(this, {});

                this.getStatus(statusRes);
                this.getAllStore(storeRes);

                if (this.$route.query && this.$route.query.orderId) {
                    this.search_info.product_model_no = this.$route.query.orderId;
                    this.search_info.stock_type = this.$route.query.type;
                    this.search_info.store_no = this.$route.query.storeId;
                    if (this.$route.query.startTime && this.$route.query.endTime) {
                        this.search_info.timeRange = [this.$route.query.startTime, this.$route.query.endTime]
                    }
                } else {
                    this.search_info.product_model_no = '';
                    this.search_info.stock_type = 'all';
                    this.search_info.store_no = 'all';
                    this.search_info.timeRange = [];
                }
                this.getData();
            },
            getAllCustomer () {
                //获取所有客户
                apiGetFinanceAllkh(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            this.allCustomerArr.push({
                                value: item.khbh,
                                label: item.khxx
                            });
                        });
                    }
                });
            },
            getAllSupplier () {
                apiGetPurchaseSupplierList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allSupplierArr.push({
                                value: item.gysbh,
                                label: item.gysmc
                            });
                        });
                    }
                });
            },
            getData () {
                this.spinShow = true;
                finaceOutBoundDetailListApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        start_time: this.search_info.timeRange[0],
                        end_time: this.search_info.timeRange[1],

                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        store_no: this.search_info.store_no === 'all' ? '' : this.search_info.store_no,
                        order_type: this.search_info.order_type === 'all' ? '' : this.search_info.order_type,
                        stock_type: this.search_info.stock_type === 'all' ? '' : this.search_info.stock_type,
                        supplier_no: this.search_info.supplier_no === 'all' ? '' : this.search_info.supplier_no,
                        customer_no: this.search_info.customer_no === 'all' ? '' : this.search_info.customer_no,

                        product_name: this.search_info.product_name,
                        product_model: this.search_info.product_model,
                        product_order_no: this.search_info.product_order_no,
                        product_model_no: this.search_info.product_model_no,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;    

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
                finaceOutBoundDetailListExportApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        start_time: this.search_info.timeRange[0],
                        end_time: this.search_info.timeRange[1],

                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        store_no: this.search_info.store_no === 'all' ? '' : this.search_info.store_no,
                        order_type: this.search_info.order_type === 'all' ? '' : this.search_info.order_type,
                        stock_type: this.search_info.stock_type === 'all' ? '' : this.search_info.stock_type,
                        supplier_no: this.search_info.supplier_no === 'all' ? '' : this.search_info.supplier_no,
                        customer_no: this.search_info.customer_no === 'all' ? '' : this.search_info.customer_no,

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
            this.setAllSelectData();
            this.getAllBrand();
            this.getAllCustomer();
            this.getAllSupplier();
        },
        watch: {
            '$route' () {
                this.setAllSelectData();
            }
        }
    };
</script>
