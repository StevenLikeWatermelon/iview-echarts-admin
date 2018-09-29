<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="outputInfo" class="model-style">
                        <Row>
                        	<Col span="4">
                                <Select v-model="outputInfo.supplier" placeholder="请选择" filterable @on-change="search">
                                    <Option v-for="item in supperList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="outputInfo.status" @on-change="search">
                                    <Option v-for="item in outputStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="outputInfo.brand" filterable @on-change="search">
                                    <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                                <Input v-model="outputInfo.out_no" placeholder="请输入出库单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                                <Input v-model="outputInfo.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                                <Input v-model="outputInfo.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="outputInfo.out_store" placeholder="请选择" filterable @on-change="storeChange">
                                    <Option v-for="item in allStores" :value="item.ckbh" :key="item.ckbh">{{ item.ckmc }}</Option>
                                </Select>
                            </Col>
                            <Col span="4" v-if="areaSelectDisplay">
                                <Select v-model="outputInfo.reservoir_area" placeholder="请选择"  @on-change="areaChange" filterable>
                                    <Option v-for="val in AreaArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4" v-if="seatSelectDisplay">
                                <Select v-model="outputInfo.pool_position"  placeholder="请选择" filterable  @on-change="search">
                                    <Option v-for="val in seatArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                                <Input v-model="outputInfo.return_no" placeholder="请输入退货单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                                <Input v-model="outputInfo.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                           <DatePicker type="datetimerange" :value="outputInfo.datetime" placeholder="请选择" @on-change="changeDatetime" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="outputInfo.create_user_no" placeholder="请输入创建人" @on-enter="search"></Input>
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
                    <el-table :data="outputList" border stripe style="text-align: center;width:100%" @sort-change="manualSort"  max-height="570">
                        <el-table-column prop="order_out_no" label="采购出库单编号" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_out_no)">{{scope.row.order_out_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gysmc" label="供应商" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" sortable="custom" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" sortable="custom" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" sortable="custom" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位" ></el-table-column>
                        <el-table-column prop="out_store_name" label="出库仓库" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="出库库区" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="出库库位" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="num" label="出库数量" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出库金额" width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.num, scope.row.buy_price, 4)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_status" label="状态" sortable="custom">
                            <template slot-scope="scope" >
                                <span>{{ outputStatusObj[scope.row.order_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column label="创建人" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.create_user_no }} / {{ scope.row.create_user_name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购退货单编号" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_return_no}, 'purchase_manage_TH_detail')" type="text" size="small">
                                    {{ scope.row.buy_return_no }}
                                </span>
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
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { purchaseManageOutputList, apiAllStatus, apiAllBrands, apiGetCommonStockList, apiGetAllAreaList, apiGetAllSeatList } from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                areaSelectDisplay: false,
                seatSelectDisplay: false,
                outputInfo: {
                    supplier: 'all',
                    status: 'all',
                    brand: 'all',
                    out_no: '',
                    product_name: '',
                    product_order_no: '',
                    return_no: '',
                    product_model: '',
                    out_store: 'all',
                    reservoir_area: 'all',
                    pool_position: 'all',
                    starttime: '',
                    endtime: '',
                    datetime: [],
                    create_user_no: '',
                },
                outputList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                supperList: [
                    {
                        label: '选择供应商',
                        value: 'all'
                    }
                ],
                outputStatus: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                outputStatusObj: {},
                allBrands: [
                    {
                        cpppmc: '选择品牌',
                        cpppbh: 'all'
                    }
                ],
                allStores: [{
                    ckmc: '选择仓库',
                    ckbh: 'all',
                }],
                AreaArr: [
                    {
                        value: 'all',
                        label: '选择库区'
                    }
                ],
                seatArr: [
                    {
                        value: 'all',
                        label: '选择库位'
                    }
                ],
            };
        },
        methods: {
            storeChange (val) {
                this.outputInfo.reservoir_area = 'all';
                this.outputInfo.pool_position = 'all';
                this.areaSelectDisplay = false;
                this.seatSelectDisplay = false;

                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllAreaList(this, {
                        store_no: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.store_no = val;
                            this.AreaArr = [
                                {
                                    value: 'all',
                                    label: '选择库区'
                                }
                            ];
                            res.data.forEach(item => {
                                item.label = item.area_name;
                                item.value = item.area_no;
                                this.AreaArr.push(item);
                            });
                            this.areaSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            areaChange (val) {
                this.outputInfo.pool_position = 'all';
                this.seatSelectDisplay = false;

                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllSeatList(this, {
                        store_no: this.store_no,
                        area_no: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.seatArr = [
                                {
                                    value: 'all',
                                    label: '选择库位'
                                }
                            ];
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.seatArr.push(item);
                            });
                            this.seatSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            goToDetail (id) {
                util.openNewPage(this, 'purchase_manage_CK_detail', {
                	param: id
                });
                this.$router.push({
                    name: 'purchase_manage_CK_detail',
                    query: {
                    	param: id
                    }
                });
            },
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data);
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['ckd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.outputStatusObj = res.data.ckd_status;
                        let tmpObj = {};
                        for (let key in res.data.ckd_status) {
                            if (res.data.ckd_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.ckd_status[key]
                                };
                                this.outputStatus.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getAllStoreData () {
                apiGetCommonStockList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allStores = this.allStores.concat(res.data.list);
                    }
                });
            },            
            getData () {
                purchaseManageOutputList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier: this.outputInfo.supplier == 'all' ? '' : this.outputInfo.supplier,
                        status: this.outputInfo.status == 'all' ? '' : this.outputInfo.status,
                        brand: this.outputInfo.brand == 'all' ? '' : this.outputInfo.brand,
                        out_store: this.outputInfo.out_store == 'all' ? '' : this.outputInfo.out_store,
                        area_no : this.outputInfo.reservoir_area == 'all' ? '' : this.outputInfo.reservoir_area,
                        seat_no: this.outputInfo.pool_position == 'all' ? '' : this.outputInfo.pool_position,
                        out_no: this.outputInfo.out_no,
                        product_name: this.outputInfo.product_name,
                        product_order_no: this.outputInfo.product_order_no,
                        return_no: this.outputInfo.return_no,
                        product_model: this.outputInfo.product_model,
                        starttime: this.outputInfo.datetime[0],
                        endtime: this.outputInfo.datetime[1],
                        create_user_no: this.outputInfo.create_user_no,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.outputList = res.data.list;
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
                this.outputInfo = {
                    supplier: 'all',
                    status: 'all',
                    brand: 'all',
                    out_no: '',
                    product_name: '',
                    product_order_no: '',
                    return_no: '',
                    product_model: '',
                    out_store: 'all',
                    reservoir_area: 'all',
                    pool_position: 'all',
                    starttime: '',
                    endtime: '',
                    datetime: [],
                    create_user_no: '',
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
            },
            changeDatetime (time) {
                this.outputInfo.datetime = time;
                this.search();
            }
        },
        created () {
            this.getAllBrands();
            this.getStatus();
            this.getAllStoreData();
            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(4);
            }
        }
    };
</script>