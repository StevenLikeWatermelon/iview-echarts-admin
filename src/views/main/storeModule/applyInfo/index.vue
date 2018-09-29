<style>
    .flex-bettewn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: nowrap;
    }
    .modal-checkbox .ivu-checkbox-group-item {
        width: 160px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :label-width="120" class="model-style">
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
                        <Select v-model="locationSearch.stock_type"  placeholder="请选择库存类型" filterable @on-change="search">
                            <Option v-for="item in allStockTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.product_order_no" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.from_type"  placeholder="请选择来源类型" filterable @on-change="search" >
                            <Option v-for="item in allstockFroms" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.from_no" placeholder="输入来源单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.buy_order_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.store_no"  filterable @on-change="getAllAreas">
                            <Option v-for="item in allStores" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="areaSelectDisplay">
                        <Select v-model="locationSearch.area_no"  filterable @on-change="getAllSeats">
                            <Option v-for="item in allAreas" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="seatSelectDisplay">
                        <Select v-model="locationSearch.seat_no"  filterable @on-change="search">
                            <Option v-for="item in allSeats" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.operator" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择创建时间" :value='locationSearch.timeRange' style="width: 100%;" @on-change="changeDate"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.change_num"  placeholder="请选择库存数量" filterable @on-change="search">
                            <Option value="all">全部</Option>
                            <Option value="gt0">大于0</Option>
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
                <Col span="24" style="margin-bottom: 10px;" v-auth="allButton">
                    <Button type="primary" @click="getStock()" v-auth="seatTranslateButton" style="margin-right: 10px;">库位转移</Button>
                    <Button type="primary" @click="getData(1)" style="margin-right: 10px;">导出</Button>
                    <Button type="primary" @click="showmore()" style="margin-right: 10px;">展示更多列表</Button>
                    <span v-show="showAll" style="margin-right: 20px;">现货总数: <em style="color:#cf0012;font-style:normal;">{{listData.now_stock}}</em></span>
                    <span v-show="showAll" style="margin-right: 20px;">在途总数: <em style="color:#cf0012;font-style:normal;">{{listData.onway_stock}}</em></span>
                    <span v-show="showAll" style="margin-right: 20px;">现货锁总数: <em style="color:#cf0012;font-style:normal;">{{listData.now_stock_lock}}</em></span>
                    <span v-show="showAll" style="margin-right: 20px;">在途锁总数: <em style="color:#cf0012;font-style:normal;">{{listData.onway_stock_lock}}</em></span>
                    <span v-show="!showAll" style="margin-right: 20px;">已勾选现货总数: <em style="color:#cf0012;font-style:normal;">{{now_stock_checked}}</em></span>
                    <span v-show="!showAll" style="margin-right: 20px;">已勾选在途总数: <em style="color:#cf0012;font-style:normal;">{{onway_stock_checked}}</em></span>
                    <span v-show="!showAll" style="margin-right: 20px;">已勾选现货锁总数: <em style="color:#cf0012;font-style:normal;">{{now_stock_lock_checked}}</em></span>
                    <span v-show="!showAll" style="margin-right: 20px;">已勾选在途锁总数: <em style="color:#cf0012;font-style:normal;">{{onway_stock_lock_checked}}</em></span>
                </Col>
                <el-table ref="multipleTable" :data="goodsList" :row-class-name="tableRowClassName" border style="text-align: center;width:100%;" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column prop="product_model_no" label="商品型号编号"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌"  width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称"  width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号"  width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号"  min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="supplier_no" label="供应商编号"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="change_type" label="库存类型" sortable="custom" width="100" >
                        <template slot-scope="scope">
                            <span>{{stockTypeObj[scope.row.change_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="store_name" label="所属仓库"  width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area_name" label="所属库区"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seat_name" label="所属库位"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="change_num" label="库存数量" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="100" v-if="ApplyMoneyButton"></el-table-column>
                    <el-table-column prop="change_amount" label="库存金额" width="120" v-if="ApplyMoneyButton"></el-table-column>
                    <el-table-column show-overflow-tooltip v-for="item in displayArr" :prop="item.prop" :label="item.name" :sortable="item.custom"  :width="item.width"></el-table-column>

                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showMoreHeader" title="展示更多列表" @on-ok="confirmShow">
            <div style="margin-bottom: 10px;">
                <Checkbox v-model="checkAll" @on-change="changeAll">全选</Checkbox>
            </div>
            <div class="modal-checkbox">
                <CheckboxGroup v-model="checkedArr" @on-change="changeChecked">
                    <Checkbox v-for="item in AllDisplayArr" :label="item.name"></Checkbox>
                </CheckboxGroup>
            </div>
        </Modal>
        <Modal v-model="showStock" title="库区库位转移" @on-ok="moveStore">
            <Row>
                <col span="24">
                    <Form :label-width="100" ref="approveDetail" :model="stockDetail">
                        <Row>
                            <Col span="24">
                            <FormItem label="入库库区：" prop="logisticsInfo">
                                <Select v-model="stockDetail.area_no" placeholder="请选择转移库区" @on-change="areaChange()" transfer filterable>
                                    <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="24">
                            <FormItem label="入库库位：" prop="logisticsInfo">
                                <Select v-model="stockDetail.seat_no" placeholder="请选择转移库位" transfer filterable>
                                    <Option v-for="status in seatArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </col>
            </Row>
        </Modal>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import util from '@/libs/util';
    import {apiMoveSupplyList, apiAllStatus, apiAllBrands, apiGetAllStorageList, apiGetCommonStockList, apiGetAllAreaList, apiGetAllSeatList, apiAllSupplyList, apiExportSeatTmp, apiImportSeats, apiExportSupplyTable} from '@/config/getData';
    import {setToken, manualCheck} from '@/config/mUtils';
    export default {
        data () {
            return {
                seatTranslateButton: 'apply_info_seat_translate',
                areaSelectDisplay: false,
                seatSelectDisplay: false,
                AreaArr: [],
                seatArr: [],
                stockDetail: [],
                showStock: false,
                multipleSelection: [],
                //所选中数据
                multipleStore: [],
                showAll: true,
                ApplyMoneyButton: manualCheck('apply_money_info'),
                showSpin: false,
                checkAll: false,
                showMoreHeader: false,
                allButton: 'apply_info_all_button',
                locationSearch: {
                    product_model_no: '',
                    brand_no: 'all',
                    product_name: '',
                    stock_type: 'all',
                    product_model: '',
                    product_order_no: '',
                    from_type: 'all',
                    from_no: '',
                    buy_order_no: '',
                    operator: '',
                    store_no:'all',
                    area_no:'all',
                    seat_no:'all',
                    timeRange: [],
                    change_num: '',
                },
                currentStoreNo: '',
                moveStoreNo: '',
                allBrands: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                allStores: [{
                    value: 'all',
                    label: '选择所属仓库'
                }],
                stockTypeObj: {},
                allStockTypes: [{
                    value: 'all',
                    label: '选择库存类型'
                }],
                stockFromObj: {},
                allstockFroms: [{
                    value: 'all',
                    label: '选择来源类型'
                }],
                allAreas: [],
                allSeats: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                orderDirection: 'desc',
                orderField: '',
                goodsList: [],
                listData:[],
                now_stock_checked: 0,
                onway_stock_checked: 0,
                now_stock_lock_checked: 0,
                onway_stock_lock_checked: 0,
                checkedArr: [],
                displayArr: [],
                AllDisplayArr: [{
                    prop: 'operator_type',
                    width: '130',
                    name: '来源类型',
                    custom: 'custom'
                },{
                    prop: 'note',
                    width: '130',
                    name: '备注'
                },{
                    prop: 'buy_order_no',
                    width: '130',
                    name: '采购合同单编号'
                },{
                    prop: 'requisition_no',
                    width: '130',
                    name: '请购/备货单编号'
                },{
                    prop: 'sell_order_no',
                    width: '130',
                    name: '销售合同单编号'
                },{
                    prop: 'xsygDetail',
                    width: '130',
                    name: '销售员'
                },{
                    prop: 'czygDetail',
                    width: '130',
                    name: '客服'
                },{
                    prop: 'buy_shipstock_no',
                    width: '130',
                    name: '采购发货单编号'
                },{
                    prop: 'product_instock_no',
                    width: '180',
                    name: '采购/销退入库单编号'
                },{
                    prop: 'sell_outstock_no',
                    width: '140',
                    name: '销售出库单编号'
                },{
                    prop: 'buy_return_no',
                    width: '130',
                    name: '采购退货单编号'
                },{
                    prop: 'buy_outstock_no',
                    width: '130',
                    name: '采购出库单编号'
                },{
                    prop: 'check_instock_no',
                    width: '130',
                    name: '盘盈入库单编号'
                },{
                    prop: 'check_outstock_no',
                    width: '130',
                    name: '盘亏出库单编号'
                },{
                    prop: 'product_leadtime',
                    width: '130',
                    name: '货期',
                    custom: 'custom'
                },{
                    prop: 'create_time',
                    width: '130',
                    name: '创建时间',
                    custom: 'custom'
                },{
                    prop: 'operator_name',
                    width: '130',
                    name: '创建人'
                },{
                    prop: 'sell_return_no',
                    width: '130',
                    name: '销售退货单编号'
                }]
            }
        },
        components: {
            pagination
        },
        methods: {
            moveStore () {
                apiMoveSupplyList(this,{params: JSON.stringify({
                    area_no: this.stockDetail.area_no,
                    seat_no: this.stockDetail.seat_no,
                    ids: JSON.stringify(this.multipleSelection),
                })}).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getData();
                    }
                })
            },
            areaChange () {
                apiGetAllSeatList(this, {
                    store_no: this.moveStoreNo,
                    area_no: this.stockDetail.area_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.seatArr = [{
                            value: 'all',
                            label: '选择转移库位'
                        }];
                        res.data.forEach(item => {
                            this.seatArr.push({
                                value: item.seat_no,
                                label: item.seat_name
                            });
                        });
                    }
                });
            },
            getStock () {
                if(this.multipleStore.length == 0){
                    this.$Message.error('请勾选转移数据');
                    return false;
                }
                //验证仓库
                let hash=[];
                let change_num = 0;
                let change_type = 0;
                for (let i = 0; i < this.multipleStore.length; i++) {
                    if(hash.indexOf(this.multipleStore[i]['store_no'])==-1){
                        hash.push(this.multipleStore[i]['store_no']);
                    }
                    if(this.multipleStore[i]['change_type'] !=0 && this.multipleStore[i]['change_type'] !=2){
                        //类型非【现货锁库，现货库存】
                        change_type = 1;
                    }
                    if(!this.multipleStore[i]['change_num']){
                        //数量为0数据
                        change_num = 1;
                    }
                }
                if(hash.length > 1){
                    this.$Message.error('请选择相同仓库');
                    return false;
                }
                //判断转移数据的类型是否满足
                if(change_type){
                    this.$Message.error('在途、在途锁、盘亏出库、已删除或者已出库的库存信息不可转移库区');
                    return false;
                }
                apiGetAllAreaList(this, {
                    store_no: hash[0]
                }).then(res => {
                    if (res && res.status == 1) {
                        this.moveStoreNo = hash[0];
                        this.AreaArr = [{
                            value: 'all',
                            label: '选择转移库区'
                        }];
                        res.data.forEach(item => {
                            this.AreaArr.push({
                                value: item.area_no,
                                label: item.area_name
                            });
                        });
                        this.showStock = true;
                    }
                });
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.multipleStore.push(row);

                    //现货总数
                    if(row.change_type == 0){
                        this.now_stock_checked = (+this.now_stock_checked + +row.change_num);
                    }
                    //在途总数
                    if(row.change_type == 1){
                        this.onway_stock_checked = (+this.onway_stock_checked + +row.change_num);
                    }
                    //现货锁库
                    if(row.change_type == 2){
                        this.now_stock_lock_checked = (+this.now_stock_lock_checked + +row.change_num);
                    }
                    //在途锁库
                    if(row.change_type == 3){
                        this.onway_stock_lock_checked = (+this.onway_stock_lock_checked + +row.change_num);
                    }
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.multipleStore.splice(index, 1);

                    //现货总数
                    if(row.change_type == 0){
                        this.now_stock_checked = (+this.now_stock_checked - +row.change_num);
                    }
                    //在途总数
                    if(row.change_type == 1){
                        this.onway_stock_checked = (+this.onway_stock_checked - +row.change_num);
                    }
                    //现货锁库
                    if(row.change_type == 2){
                        this.now_stock_lock_checked = (+this.now_stock_lock_checked - +row.change_num);
                    }
                    //在途锁库
                    if(row.change_type == 3){
                        this.onway_stock_lock_checked = (+this.onway_stock_lock_checked - +row.change_num);
                    }
                }
            },
            selectAll (selection) {
                this.goodsList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            showmore() {
                this.showMoreHeader = true;
            },
            confirmShow() {
                this.showMoreHeader = false;
            },
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data);
                    }
                })
            }, 
            getApplyTypes () {
                apiAllStatus(this, {
                    type: JSON.stringify(['stock_type', 'stock_from_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.stockTypeObj = res.data.stock_type;
                        let tmpObj = {};
                        for (let key in res.data.stock_type) {
                            if (res.data.stock_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.stock_type[key]
                                };
                                this.allStockTypes.push(tmpObj);
                            }
                        }
                        this.stockFromObj = res.data.stock_from_type;
                        for (let key in res.data.stock_from_type) {
                            if (res.data.stock_from_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.stock_from_type[key]
                                };
                                this.allstockFroms.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getAllStores () {
                apiGetCommonStockList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allStores.push({
                                value: item.ckbh,
                                label: item.ckmc
                            });
                        });
                    }
                });
            },
            getAllAreas (value) {
                this.locationSearch.area_no = 'all';
                this.locationSearch.seat_no = 'all';
                this.seatSelectDisplay = false;
                this.areaSelectDisplay = false;

                if (value == 'all') {
                    this.search();
                } else {
                    apiGetAllAreaList(this, {
                        store_no: value
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.currentStoreNo = value;
                            this.allAreas = [{
                                value: 'all',
                                label: '选择所属库区'
                            }];
                            res.data.forEach(item => {
                                this.allAreas.push({
                                    value: item.area_no,
                                    label: item.area_name
                                });
                            });
                            this.areaSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            getAllSeats (value) {
                this.locationSearch.seat_no = 'all';
                this.seatSelectDisplay = false;

                if (value == 'all') {
                    this.search();
                } else {
                    apiGetAllSeatList(this, {
                        store_no: this.currentStoreNo,
                        area_no: value
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.allSeats = [{
                                value: 'all',
                                label: '选择所属库位'
                            }];
                            res.data.forEach(item => {
                                this.allSeats.push({
                                    value: item.seat_no,
                                    label: item.seat_name
                                });
                            });
                            this.seatSelectDisplay = true;
                            this.search();
                        }
                    });
                    
                }
                
            },
            changeChecked(value) {
                this.displayArr = [];
                this.AllDisplayArr.forEach(item => {
                    if (value.includes(item.name)) {
                        this.displayArr.push(item);
                    }
                });
            },
            changeAll(value) {
                if (value) {
                    this.checkedArr = [];
                    this.displayArr = [];
                    this.AllDisplayArr.forEach(item => {
                        this.checkedArr.push(item.name);
                        this.displayArr.push(item);
                    });
                } else {
                    this.checkedArr = [];
                    this.displayArr = [];
                }
            },
            getData(isExport) {
                let tmpObj = {
                    pageNum: this.currentPage,
                    numPerPage: this.limit,
                    orderField: this.orderField,
                    orderDirection: this.orderDirection,
                    create_time: this.locationSearch.timeRange.join('~'),
                    product_model_no: this.locationSearch.product_model_no,
                    brand_no: this.locationSearch.brand_no == 'all' ? '' : this.locationSearch.brand_no,
                    product_name: this.locationSearch.product_name,
                    stock_type: this.locationSearch.stock_type == 'all' ? '' : this.locationSearch.stock_type,
                    product_model: this.locationSearch.product_model,
                    product_order_no: this.locationSearch.product_order_no,
                    from_type: this.locationSearch.from_type == 'all' ? '' : this.locationSearch.from_type,
                    from_no: this.locationSearch.from_no,
                    buy_order_no: this.locationSearch.buy_order_no,
                    operator: this.locationSearch.operator,
                    store_no: this.locationSearch.store_no == 'all' ? '' : this.locationSearch.store_no,
                    area_no: this.locationSearch.area_no == 'all' ? '' : this.locationSearch.area_no,
                    seat_no: this.locationSearch.seat_no == 'all' ? '' : this.locationSearch.seat_no,
                    change_num: this.locationSearch.change_num == 'all' ? '' : this.locationSearch.change_num,
                    has_price: this.ApplyMoneyButton
                };
                if (isExport) {
                    apiExportSupplyTable(this, {params: JSON.stringify(tmpObj)});
                } else {
                    apiAllSupplyList(this, {
                        params: JSON.stringify(this.notempty(tmpObj))
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.change_amount = (item.change_num * item.buy_price).toFixed(4);
                                item.operator_type = this.stockFromObj[item.operator_type];
                                item.operator_name = item.operator_no + '/' + item.operator_name;
                                item.xsygDetail = item.xsyg_ygbh + '/' + item.xsyg;
                                item.czygDetail = item.czyg_ygbh + '/' + item.czyg;
                            });
                            this.goodsList = res.data.list;
                            this.listData = res.data;
                            this.totalnum = res.data.totalCount;

                            this.$nextTick(() => {
                                this.goodsList.forEach(row => {
                                    if (this.multipleSelection.includes(row.id)) {
                                        row.checked = true;
                                        this.$refs.multipleTable.toggleRowSelection(row);
                                    }
                                });
                            });

                            if(this.multipleSelection.length == 0){
                                this.now_stock_checked = 0;
                                this.onway_stock_checked = 0;
                                this.now_stock_lock_checked = 0;
                                this.onway_stock_lock_checked = 0;
                            }
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
                    stock_type: 'all',
                    product_model: '',
                    product_order_no: '',
                    from_no: '',
                    from_type: 'all',
                    buy_order_no: '',
                    operator: '',
                    store_no:'all',
                    area_no:'all',
                    seat_no:'all',
                    timeRange: [],
                    change_num: 'all',
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
            changeDate(value) {
                this.locationSearch.timeRange = value;
                this.search();
            },
        },
        watch: {
            'multipleSelection.length' (value) {
                if (+value == 0) {
                    this.showAll = true;
                } else {
                    this.showAll = false;
                }
            }
        },
        created () {
            this.getAllBrands();
            this.getAllStores();
            this.getApplyTypes();
            this.getData();
        }
    };
</script>
