<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120" class="model-style">
                        <Row>
                            <Col span="4">
	                            <Input v-model="salesRequisition.requisition_no" placeholder="输入单据编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.brand_no" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.product_order_no" placeholder="输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.requisition_status" @on-change="search">
                                    <Option v-for="item in requisitionStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.create_user_name" placeholder="输入创建人" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="salesRequisition.datetime" placeholder="选择创建时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.sell_order_no" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.buy_order_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.instock_no" placeholder="输入采购入库单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                        <Col span="24">
                            <Button type="primary" v-auth="xsqgdexport" @click="exportData">导出</Button>
                        </Col>
                    </Row>         
                    <el-table :data="requisitionList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                        <el-table-column label="销售请购单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.requisition_no)">{{scope.row.requisition_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" sortable="custom" min-width="150"></el-table-column>
                        <el-table-column prop="khmc" label="客户" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" ></el-table-column>
                        <el-table-column prop="requisition_num" label="请购商品数量" min-width="120"></el-table-column>
                        <el-table-column label="采购数量" width="100">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getBuyInfo(scope.row.id,scope.row.buy_num)">{{scope.row.buy_num}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购发货数量" width="100">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getShipInfo(scope.row.id,scope.row.ship_num)">{{scope.row.ship_num}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购入库数量" width="100">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getInstockInfo(scope.row.id,scope.row.instock_num)">{{scope.row.instock_num}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="销售出库数量" width="100">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getCkInfo(scope.row.id,scope.row.cksl)">{{scope.row.cksl}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_num" label="创建人" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
                        <el-table-column label="销售合同单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetailSell(scope.row.sell_order_no)">{{scope.row.sell_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购合同单编号" min-width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.buy_order_no.length == 0"></div>
                                <el-popover trigger="hover" placement="top" v-else>
                                    <p v-for="val in scope.row.buy_order_no"><span>{{ val }}</span></p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购发货单编号" min-width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.ship_no.length == 0"></div>
                                <el-popover trigger="hover" placement="top" v-else>
                                    <p v-for="val in scope.row.ship_no"><span>{{ val }}</span></p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购入库单编号" min-width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.instock_no.length == 0"></div>
                                <el-popover trigger="hover" placement="top" v-else>
                                    <p v-for="val in scope.row.instock_no"><span>{{ val }}</span></p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column  label="单据状态" min-width="120">
                            <template slot-scope="scope">
                                <span>{{requisitionStatusObj[scope.row.requisition_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="instock_no" label="采购员" min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
        <Modal v-model="showShip" title="采购发货单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderShipList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="采购发货单编号" min-width="120" prop="rel_order_no" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="num" label="发货数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="receive_stock_name" label="到货仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_leadtime" label="货期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="expect_leadtime" label="预计到货日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ship_name" label="发货物流" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ship_no" label="物流单号" show-overflow-tooltip></el-table-column>
                        <el-table-column label="采购员" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ shipStatusObj[scope.row.order_status] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
        <Modal v-model="showInstock" title="采购入库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderInstockList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="采购入库单编号" min-width="120" prop="instock_no" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="num" label="发货数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="instock_num" label="入库数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="store_name" label="到货仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="入库库区" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="入库库位" show-overflow-tooltip></el-table-column>
                        <el-table-column label="采购员" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{instockStatusObj[scope.row.instock_status]}}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>


        <Modal v-model="showCk" title="销售出库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderCkList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="销售出库单单编号" min-width="120" prop="xsckd_djbh" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cksl" label="出库数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckdj" label="出库单价" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckje" label="出库金额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckmc" label="出库仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="出库库区" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="出库库位" show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{xsckdObj[scope.row.status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>


        <Modal v-model="showBuy" title="采购合同单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="OrderBuyList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="采购合同单号" min-width="120" prop="buy_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="gysmc" label="供应商" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ckmc" label="到货仓库" show-overflow-tooltip></el-table-column>
                    <el-table-column label="单据状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{buyObj[scope.row.order_status]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>


    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus,purchaseManageRequisitionDetailList,purchaseManageRequisitionDetailListExport,apiAllBrands,apiOrderShipInfo,apiOrderInstockInfo,apiOrderCkInfo,apiOrderBuyInfo } from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                requisitionStatusObj:{},
                salesRequisition: {
                    requisition_no: '',
                    requisition_status: 'all',
                    datetime: [],
                    brand_no:'all',
                    khmc:'',
                },
                requisitionList: [{
                    requisition_no: '',
                    create_time: ':06:37',
                    total_num: 0,
                    note: '',
                    status: '',
                    buy_order_no:[],
                    instock_no:[],
                    ship_no:[],

                }],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                xsqgdexport:'service_sales_xsqgd_export',
                showShip:false,
                showInstock: false,
                showCk:false,
                showBuy:false,
                OrderList: [],
                OrderCkList:[],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                orderDirection: 'desc',
                requisitionStatus: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ],
                shipStatusObj:{},
                instockStatusObj:{},
                xsckdObj:{},
                buyObj:{}
            };
        },
        methods: {
            goToDetail (id) {
                util.openNewPage(this, 'service-sales-xsqgd-detail', {
                	param: id
                });
                this.$router.push({
                    name: 'service-sales-xsqgd-detail',
                    query: {
                    	param: id
                    }
                });
            },
            goToDetailSell(id){
                util.openNewPage(this, 'service-sales-htd-detail', {
                    param: id
                });
                this.$router.push({
                    name: 'service-sales-htd-detail',
                    query: {
                        param: id
                    }
                });
            },
            getBuyInfo(id,num){
                if(num != '0'){
                    apiOrderBuyInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                        this.OrderBuyList = res.data;
                        this.showBuy = true;


                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购合同单');
                }
            },

            getShipInfo(id,num){
                if(num != '0'){
                    apiOrderShipInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderShipList = res.data;
                            this.showShip = true;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购发货单');
                }

            },


            getInstockInfo(id,num){
                if(num != '0'){
                    apiOrderInstockInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                            this.OrderInstockList = res.data;
                            this.showInstock = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购入库单');
                }
            },

            getCkInfo(id,num){
                if(num != '0'){
                    apiOrderCkInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderCkList = res.data;
                            this.showCk = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else {
                    this.$Message.error('无对应的销售出库单');
                }
            },


            confirmTranslate(){
                this.showShip = false;
                this.showInstock = false;
                this.showCk = false;
                this.showBuy = false;
            },

            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_status','ship_status','instock_status','xsckd','buy_order_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.requisitionStatusObj = res.data.requisition_status;
                        let tmpObj = {};
                        for (let key in res.data.requisition_status) {
                            if (res.data.requisition_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.requisition_status[key]
                                };
                                this.requisitionStatus.push(tmpObj);
                            }
                        }
                        this.shipStatusObj = res.data.ship_status;
                        this.instockStatusObj = res.data.instock_status;
                        this.xsckdObj = res.data.xsckd;
                        this.buyObj = res.data.buy_order_status;

                    }
                });

                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.brand_noAllSelect.push({
                                value: item.cpppbh,
                                label: item.cpppmc
                            });
                        });
                    }
                });

            },
            getData () {
                // 请替换接口名称
                purchaseManageRequisitionDetailList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        requisition_no: this.salesRequisition.requisition_no,
                        brand_no: this.salesRequisition.brand_no === 'all' ? '' : this.salesRequisition.brand_no,
                        product_name: this.salesRequisition.product_name,
                        product_model: this.salesRequisition.product_model,
                        product_order_no: this.salesRequisition.product_order_no,
                        create_user_name: this.salesRequisition.create_user_name,
                        sell_order_no: this.salesRequisition.sell_order_no,
                        buy_order_no: this.salesRequisition.buy_order_no,
                        instock_no: this.salesRequisition.instock_no,
                        requisition_status: this.salesRequisition.requisition_status === 'all' ? '' : this.salesRequisition.requisition_status,
                        start_time: this.salesRequisition.datetime[0],
                        end_time: this.salesRequisition.datetime[1],
                        khmc:this.salesRequisition.khmc
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.requisitionList = res.data.list;
                    }
                });
            },
            exportData(){
                purchaseManageRequisitionDetailListExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        requisition_no: this.salesRequisition.requisition_no,
                        brand_no: this.salesRequisition.brand_no === 'all' ? '' : this.salesRequisition.brand_no,
                        product_name: this.salesRequisition.product_name,
                        product_model: this.salesRequisition.product_model,
                        product_order_no: this.salesRequisition.product_order_no,
                        create_user_name: this.salesRequisition.create_user_name,
                        sell_order_no: this.salesRequisition.sell_order_no,
                        buy_order_no: this.salesRequisition.buy_order_no,
                        instock_no: this.salesRequisition.instock_no,
                        requisition_status: this.salesRequisition.requisition_status === 'all' ? '' : this.salesRequisition.requisition_status,
                        start_time: this.salesRequisition.datetime[0],
                        end_time: this.salesRequisition.datetime[1],
                        khmc:this.salesRequisition.khmc
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
                this.salesRequisition.requisition_no = '';
                this.salesRequisition.requisition_status = 'all';
                this.salesRequisition.brand_no = 'all';
                this.salesRequisition.product_name = '';
                this.salesRequisition.product_model = '';
                this.salesRequisition.product_order_no = '';
                this.salesRequisition.create_user_name = '';
                this.salesRequisition.sell_order_no = '';
                this.salesRequisition.buy_order_no = '';
                this.salesRequisition.instock_no = '';
                this.salesRequisition.datetime = [];
                this.salesRequisition.khmc = '';
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
            changeDate (time) {
                this.salesRequisition.datetime = time;
                this.search();
            }           
        },
        created () {
             this.getStatus();
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