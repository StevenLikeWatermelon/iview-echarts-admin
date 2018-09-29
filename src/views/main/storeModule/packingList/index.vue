<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.document_no" placeholder="输入盘盈入库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.brand"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="val in brandsArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.status"  placeholder="请选择" @on-change="search">
                            <Option v-for="val in inventoryStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.order_no" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.depot"  placeholder="请选择" @on-change="storeChange" filterable>
                            <Option v-for="val in stockArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="areaSelectDisplay">
                        <Select v-model="orderInfo.reservoir_area"  placeholder="请选择"  @on-change="areaChange" filterable>
                            <Option v-for="val in AreaArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="seatSelectDisplay">
                        <Select v-model="orderInfo.pool_position"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="val in seatArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.creater" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="packingAdd" v-if="is_current">新增盘盈入库单</Button>
                    <Button type="primary" @click="exportData" v-auth="exportButton">导出</Button>
                    <span class="margin-left-20">盘盈金额总计：
                        <em style="color:#cf0012;font-style: normal;">{{ all_amount }}</em>
                    </span>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="inventory_no" label="盘盈入库单编号" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick({param: scope.row.inventory_no}, 'packing-list-detail')">{{scope.row.inventory_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand_name" label="品牌" width="100"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_order_no" label="订货号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位" width="100"></el-table-column>
                    <el-table-column prop="store_name" label="盘盈仓库" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area_name" label="盘盈库区" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seat_name" label="盘盈库位" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inventory_num" label="盘盈数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="inventory_price" label="盘盈单价" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="total_amount" label="盘盈金额" width="100"></el-table-column>
                    <el-table-column prop="inventory_status" label="状态" sortable="custom" width="100">
                         <template slot-scope="scope">
                            <span>{{inventoryStatus[scope.row.inventory_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="create_user_name" label="创建人" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
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
    import { apiAllKh,apiAllStatus, apiGetStockInventoryProfitList,  operateAllBrandsList, apiGetAllStorageList, apiGetAllAreaList, apiGetAllSeatList, apiGetStockInventoryProfitModel, apiGetStockInventoryProfitExport } from '@/config/getData';
    import { notempty, sortBy, isInCreaters} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'packing-list',
        data () {
            return {
                exportButton: 'package_list_export_button',
                orderInfo: {
                    document_no: '',
                    brand: 'all',
                    product_name: '',
                    status: 'all',
                    product_model: '',
                    order_no: '',
                    depot: 'all',
                    reservoir_area: 'all',
                    pool_position: 'all',
                    creater: '',
                    datetime: '',
                },
                allTotal: 0,
                orderData: {
                    data: [
                        {
                            receipt_no: '121212'
                        }
                    ]
                },
                all_amount: '12.11',
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                customerList: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                spinShow: false,
                abolishStatus: [],
                brandsArr: [
                    {
                        value: 'all',
                        label: '选择产品品牌'
                    }
                ],
                inventoryStatus: [],
                inventoryStatusArr: [
                    {
                        value: 'all',
                        label: '选择状态'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择盘盈仓库'
                    }
                ],
                AreaArr: [
                    {
                        value: 'all',
                        label: '选择盘盈库区'
                    }
                ],
                seatArr: [
                    {
                        value: 'all',
                        label: '选择盘盈库位'
                    }
                ],
                areaSelectDisplay: false,
                seatSelectDisplay: false,
                store_no: '',
                is_current: ''
            };
        },
        components: {
            pagination
        },
        methods: {
            //导出功能
            exportData () {
                apiGetStockInventoryProfitExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        inventory_no: this.orderInfo.document_no,
                        brand_no : this.orderInfo.brand == 'all' ? '' : this.orderInfo.brand,
                        product_name: this.orderInfo.product_name,
                        inventory_status : this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        product_model: this.orderInfo.product_model,
                        product_order_no: this.orderInfo.order_no,
                        store_no: this.orderInfo.depot == 'all' ? '' : this.orderInfo.depot,
                        area_no: this.orderInfo.reservoir_area == 'all' ? '' : this.orderInfo.reservoir_area,
                        seat_no: this.orderInfo.pool_position == 'all' ? '' : this.orderInfo.pool_position,
                        create_user_no : this.orderInfo.creater,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                    }))
                }).then(res => {
                    if (res && res.status == 1) {}
                })
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['inventory_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.inventoryStatus = res.data.inventory_status;
                        let tmpObj = {};
                        for (let key in res.data.inventory_status) {
                            if (res.data.inventory_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.inventory_status[key]
                                };
                                this.inventoryStatusArr.push(tmpObj);
                            }
                        }
                        /*是否为盘盈入库单可创建审批人 */
                        apiGetStockInventoryProfitModel(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 0).then(result => {
                                    this.is_current = result;
                                });
                            }
                        });
                    }
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getList () {
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.cpppmc;
                            item.value = item.cpppbh;
                            this.brandsArr.push(item);
                        });
                    }
                });
                this.stockArr = [
                    {
                        value: 'all',
                        label: '选择盘盈仓库'
                    }
                ];
                apiGetAllStorageList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.store_name;
                            item.value = item.store_no;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            storeChange (val) {
                this.orderInfo.reservoir_area = 'all';
                this.orderInfo.pool_position = 'all';
                this.areaSelectDisplay = false;
                this.seatSelectDisplay = false;

                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllAreaList(this, {
                        store_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.AreaArr = [
                                {
                                    value: 'all',
                                    label: '选择盘盈库区'
                                }
                            ];
                            this.store_no = val;
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
                this.orderInfo.pool_position = 'all';
                this.seatSelectDisplay = false;

                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllSeatList(this, {
                        store_no: this.store_no,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.seatArr = [
                                {
                                    value: 'all',
                                    label: '选择盘盈库位'
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
            getData () {
                apiGetStockInventoryProfitList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        inventory_no: this.orderInfo.document_no,
                        brand_no : this.orderInfo.brand == 'all' ? '' : this.orderInfo.brand,
                        product_name: this.orderInfo.product_name,
                        inventory_status : this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        product_model: this.orderInfo.product_model,
                        product_order_no: this.orderInfo.order_no,
                        store_no: this.orderInfo.depot == 'all' ? '' : this.orderInfo.depot,
                        area_no: this.orderInfo.reservoir_area == 'all' ? '' : this.orderInfo.reservoir_area,
                        seat_no: this.orderInfo.pool_position == 'all' ? '' : this.orderInfo.pool_position,
                        create_user_no : this.orderInfo.creater,
                        start_time : this.orderInfo.datetime[0],
                        end_time : this.orderInfo.datetime[1],
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.all_amount = res.data.total_money;
                        this.spinShow = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            packingAdd () {
                this.handleClick('', 'packing-list-add');
            },
            search () {
                this.currentPage = 1;
                this.getData();
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
            this.getList();
        },
        activated() {
            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            }
        }
    };
</script>
