<style>
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                         <Input v-model="locationSearch.product_model_no" placeholder="输入商品型号编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.brand_no"  placeholder="请选择产品品牌" filterable @on-change="search">
                            <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.product_order_no" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.store_no"  filterable @on-change="search">
                            <Option v-for="item in allStores" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" @click="getData(1)" v-auth="buttonAuth">导出</Button>
                    <span style="margin-left: 20px;">可售总数: <em style="color:#cf0012;font-style:normal;">{{totalInfo.all_stock_num}}</em></span>
                    <span style="margin-left: 20px;">锁库总数: <em style="color:#cf0012;font-style:normal;">{{totalInfo.all_stock_lock_num}}</em></span>
                    <span style="margin-left: 20px;">库存总数: <em style="color:#cf0012;font-style:normal;">{{totalInfo.all_total}}</em></span>
                </Col>
                <el-table :data="goodsList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="product_model_no" label="商品型号编号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号"  min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号"  min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="store_name" label="所属仓库"  min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_lock_num" label="在途锁库数量" sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="instock_num" label="在途可售数量" sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="total_num" label="在途库存数量" sortable="custom" width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import util from '@/libs/util';
    import {apiAllBrands, apiGetAllStorageList, apiGetAllAreaList, apiGetAllSeatList, getAllGoodsSeats, apiExportSeatTmp, apiImportSeats, apiOutStockGoodsList, apiExportOutStockTable} from '@/config/getData';
    import {setToken} from '@/config/mUtils';
    export default {
        data () {
            return {
                showSpin: false,
                buttonAuth: 'on_way_export_button',
                locationSearch: {
                    product_model_no: '',
                    brand_no: 'all',
                    product_name: '',
                    product_model: '',
                    product_order_no: '',
                    store_no:'all'
                },
                totalInfo: {
                    all_stock_num: '',
                    all_stock_lock_num: '',
                    all_total: ''
                },
                currentStoreNo: '',
                allBrands: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                allStores: [{
                    value: 'all',
                    label: '选择所属仓库'
                }],
                allAreas: [],
                allSeats: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                orderDirection: 'desc',
                orderField: '',
                goodsList: []
            }
        },
        components: {
            pagination
        },
        methods: {
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data);
                    }
                })
            },
            getAllStores () {
                apiGetAllStorageList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allStores.push({
                                value: item.store_no,
                                label: item.store_name
                            });
                        });
                    }
                });
            },
            getAllAreas (value) {
                apiGetAllAreaList(this, {
                    store_no: value
                }).then(res => {
                    if (res && res.status == 1) {
                        this.currentStoreNo = value;
                        this.allAreas = [{
                            value: 'all',
                            label: '全部'
                        }];
                        res.data.forEach(item => {
                            this.allAreas.push({
                                value: item.area_no,
                                label: item.area_name
                            });
                        });
                        this.locationSearch.area_no = 'all';
                        this.locationSearch.seat_no = 'all';
                    }
                });
            },
            getAllSeats (value) {
                apiGetAllSeatList(this, {
                    store_no: this.currentStoreNo,
                    area_no: value
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allSeats = [{
                            value: 'all',
                            label: '全部'
                        }];
                        res.data.forEach(item => {
                            this.allSeats.push({
                                value: item.seat_no,
                                label: item.seat_name
                            });
                        });
                        this.locationSearch.seat_no = 'all';
                    }
                });
            },
            getData(isExport) {
                let tmpObj = {
                    pageNum: this.currentPage,
                    numPerPage: this.limit,
                    orderField: this.orderField,
                    orderDirection: this.orderDirection,
                    product_model_no: this.locationSearch.product_model_no,
                    brand_no: this.locationSearch.brand_no == 'all' ? '' : this.locationSearch.brand_no,
                    product_name: this.locationSearch.product_name,
                    product_model: this.locationSearch.product_model,
                    product_order_no: this.locationSearch.product_order_no,
                    store_no: this.locationSearch.store_no == 'all' ? '' : this.locationSearch.store_no
                };
                if (isExport) {
                    apiExportOutStockTable(this, {
                        params: JSON.stringify(tmpObj)
                    });
                    
                } else {
                    apiOutStockGoodsList(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goodsList = res.data.list;
                            this.totalInfo.all_stock_lock_num = res.data.all_stock_lock_num;
                            this.totalInfo.all_stock_num = res.data.all_stock_num;
                            this.totalInfo.all_total = res.data.all_total;
                            this.totalnum = res.data.totalCount;
                        }
                    });
                    
                }
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.locationSearch = {
                    product_model_no: '',
                    brand_no: 'all',
                    product_name: '',
                    product_model: '',
                    product_order_no: '',
                    store_no:'all',
                    area_no:'all',
                    seat_no:'all',
                };
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
            this.getAllBrands();
            this.getAllStores();
            this.getData();
        }
    };
</script>
