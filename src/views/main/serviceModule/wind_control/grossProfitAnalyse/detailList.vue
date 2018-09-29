<!--
    author: 沈文杰
    email: 15805199474@163.com
    phone: 158051994714
 -->
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.sell_out_no" placeholder="输入销售出库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.sell_order_no" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpxh" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.cpppbh" filterable @on-change="search">
                                <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.store_no" @on-change="search" placeholder="选择仓库" filterable>
                                <Option v-for="status in allStoreList" :value="status.ckbh" :key="status.ckbh">{{ status.ckmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.out_status"  placeholder="选择出库单状态" @on-change="search">
                                <Option v-for="(val, index) in abolishStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.sales_no"  placeholder="选择销售" @on-change="search" filterable>
                                <Option v-for="status in sales_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.sales_depart"  placeholder="选择销售部门" filterable @on-change="search">
                                <Option v-for="item in allSalesDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.server_no"  placeholder="选择客服" @on-change="search" filterable>
                                <Option v-for="status in service_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.server_depart"  placeholder="选择客服部门" filterable @on-change="search">
                                <Option v-for="item in appointKfDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择出库时间" :value='orderInfo.datetimeCk' @on-change="getCkTime" style="width: 100%;"></DatePicker>
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
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" @click="Export">导出</Button>
                    <span v-show="showAll" style="margin-left:20px;">出库总金额:<span style="margin-left:15px;color: #FF0000;">{{totalCkPrice}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">采购总金额:<span style="margin-left:15px;color: #FF0000;">{{totalPurchasekPrice}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">出库毛利:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfit}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">出库毛利率:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRate}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">出库毛利(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfit2}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">出库毛利率(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRate2}}</span></span>
                    <span v-show="showAll" style="margin-left:20px;">运费:<span style="margin-left:15px;color: #FF0000;">{{shipAmount}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库总金额:<span style="margin-left:15px;color: #FF0000;">{{totalCkPriceChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选采购总金额:<span style="margin-left:15px;color: #FF0000;">{{totalPurchasekPriceChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利率:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRateChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitChecked2}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利率(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRateChecked2}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选运费:<span style="margin-left:15px;color: #FF0000;">{{shipAmountChecked}}</span></span>
                </Col>
                <el-table :data="dataList"  ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"   max-height="570">
                    <el-table-column
                        type="selection"
                        width="55" fixed>
                    </el-table-column>
                    <el-table-column label="销售出库单编号"  show-overflow-tooltip width="160" fixed>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.djbh, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售合同单编号"  show-overflow-tooltip width="160" fixed>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.xshtd_djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.xshtd_djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="创建时间" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="out_time" label="出库时间" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" show-overflow-tooltip sortable="custom" width="200"></el-table-column>
                    <el-table-column prop="ckje" label="出库金额" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="cgje" label="采购金额" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="ckml" label="出库毛利" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="ckmll" label="出库毛利率" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="ckml_rebate" label="出库毛利(扣除返点)" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="ckmll_rebate" label="出库毛利率(扣除返点)" sortable="custom" show-overflow-tooltip width="170"></el-table-column>
                    <el-table-column prop="ship_amount" label="运费" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="ckmc" label="出库仓库" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="status" label="出库状态" show-overflow-tooltip sortable="custom" width="110">
                        <template slot-scope="scope">
                            <span> {{ abolishStatusObj[scope.row.status]}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="xsyg_ygbh" label="销售人员" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.xsyg_ygbh }} / {{ scope.row.xsyg }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsygbm" label="销售部门" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="server_no" label="客服人员" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.czyg_ygbh }} / {{ scope.row.czyg }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="czygbm" label="客服部门" show-overflow-tooltip width="200"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { allStoreInfos, apiAllStatus, apiGetDepart, apiGetAllSalesman, apiGetAllServiceMan, getOutProfitDetailApi, getOutProfitDetailExporttApi, apiAllBrands } from '@/config/getData';
    import { notempty, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                orderInfo: {
                    sell_out_no: '',
                    sell_order_no: '',
                    cpdhh: '',
                    cpxh: '',
                    cpmc: '',
                    customer: '',
                    cpppbh: 'all',
                    store_no: 'all',
                    out_status: 'all',
                    sales_no: 'all',
                    sales_depart: 'all',
                    server_no: 'all',
                    server_depart: 'all',
                    datetimeCk: [],
                    datetime: [],
                },
                totalCkPrice: '',
                totalPurchasekPrice: '',
                outGrossProfit: '',
                outGrossProfitRate: '',
                outGrossProfit2: '',
                outGrossProfitRate2: '',
                shipAmount: '',
                totalCkPriceChecked: '',
                totalPurchasekPriceChecked: '',
                outGrossProfitChecked: '',
                outGrossProfitRateChecked: '',
                outGrossProfitChecked2: '',
                outGrossProfitRateChecked2: '',
                shipAmountChecked: '',
                allStoreList: [{
                    ckbh: 'all',
                    ckmc: '请选择仓库'
                }],
                abolishStatusObj: {},
                abolishStatusArr: [{
                    value: 'all',
                    label: '选择出库单状态'
                }],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                sales_list: [
                    {
                        label: '选择销售',
                        value: 'all'
                    }
                ],
                allSalesDepart: [
                    {
                        label: '选择销售部门',
                        value: 'all'
                    }
                ],
                service_list: [
                    {
                        label: '选择客服',
                        value: 'all'
                    }
                ],
                appointKfDepart: [
                    {
                        label: '选择客服部门',
                        value: 'all'
                    }
                ],
                dataList: [],
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                totalPrice: 0,
                multipleSelection: [],
                showAll: true
            };
        },
        components: {
            pagination
        },
        methods: {
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.totalCkPriceChecked = (+this.totalCkPriceChecked + +row.ckje).toFixed(4);
                    this.totalPurchasekPriceChecked = (+this.totalPurchasekPriceChecked + +row.cgje).toFixed(4);
                    this.outGrossProfitChecked = (+this.outGrossProfitChecked + +row.ckml).toFixed(4);
                    this.outGrossProfitChecked2 = (+this.outGrossProfitChecked2 + +row.ckml_rebate).toFixed(4);
                    this.shipAmountChecked = (+this.shipAmountChecked + +row.ship_amount).toFixed(4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.totalCkPriceChecked = (+this.totalCkPriceChecked - +row.ckje).toFixed(4);
                    this.totalPurchasekPriceChecked = (+this.totalPurchasekPriceChecked - +row.cgje).toFixed(4);
                    this.outGrossProfitChecked = (+this.outGrossProfitChecked - +row.ckml).toFixed(4);
                    this.outGrossProfitChecked2 = (+this.outGrossProfitChecked2 - +row.ckml_rebate).toFixed(4);
                    this.shipAmountChecked = (+this.shipAmountChecked - +row.ship_amount).toFixed(4);
                }
                this.outGrossProfitRateChecked = (+this.outGrossProfitChecked / +this.totalCkPriceChecked).toFixed(4);
                this.outGrossProfitRateChecked2 = (+this.outGrossProfitChecked2 / +this.totalCkPriceChecked).toFixed(4);
            },
            selectAll (selection) {
                this.dataList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            Export() {
                getOutProfitDetailExporttApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        sell_order_no: this.orderInfo.sell_order_no,
                        sell_out_no: this.orderInfo.sell_out_no,
                        cpdhh: this.orderInfo.cpdhh,
                        cpxh: this.orderInfo.cpxh,
                        cpmc: this.orderInfo.cpmc,
                        customer: this.orderInfo.customer,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        out_starttime: this.orderInfo.datetimeCk[0],
                        out_endtime: this.orderInfo.datetimeCk[1],
                        
                        store_no: this.orderInfo.store_no === 'all' ? '' : this.orderInfo.store_no,
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                        out_status: this.orderInfo.out_status === 'all' ? '' : this.orderInfo.out_status,

                        sales_no: this.orderInfo.sales_no === 'all' ? '' : this.orderInfo.sales_no,
                        sales_depart: this.orderInfo.sales_depart === 'all' ? '' : this.orderInfo.sales_depart,
                        server_no: this.orderInfo.server_no === 'all' ? '' : this.orderInfo.server_no,
                        server_depart: this.orderInfo.server_depart === 'all' ? '' : this.orderInfo.server_depart,
                    }))
                });
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            //获取所有品牌
            getAllBrands () {
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
            getAllStoreList () {
                allStoreInfos(this, {}).then(res => {
                    if(res && res.status == 1){
                        this.allStoreList = this.allStoreList.concat(res.data.list);
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xsckd'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.abolishStatusObj = res.data.xsckd;
                        let tmpObj = {}; 
                        for (let key in res.data.xsckd) {
                            if (res.data.xsckd.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xsckd[key]
                                };
                                this.abolishStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                //指定销售部门
                apiGetDepart(this, {
                    type: 'sell'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.value = item.id;
                            item.label = item.depart_name;
                            this.allSalesDepart.push(item);
                        });
                    }
                });
                //指定客服部门
                apiGetDepart(this, {
                    type: 'server'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.value = item.id;
                            item.label = item.depart_name;
                            this.appointKfDepart.push(item);
                        });
                    }
                });
                apiGetAllSalesman(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.sales_list.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetAllServiceMan(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.service_list.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                getOutProfitDetailApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        sell_order_no: this.orderInfo.sell_order_no,
                        sell_out_no: this.orderInfo.sell_out_no,
                        cpdhh: this.orderInfo.cpdhh,
                        cpxh: this.orderInfo.cpxh,
                        cpmc: this.orderInfo.cpmc,
                        customer: this.orderInfo.customer,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        out_starttime: this.orderInfo.datetimeCk[0],
                        out_endtime: this.orderInfo.datetimeCk[1],
                        store_no: this.orderInfo.store_no === 'all' ? '' : this.orderInfo.store_no,
                        out_status: this.orderInfo.out_status === 'all' ? '' : this.orderInfo.out_status,
                        sales_no: this.orderInfo.sales_no === 'all' ? '' : this.orderInfo.sales_no,
                        sales_depart: this.orderInfo.sales_depart === 'all' ? '' : this.orderInfo.sales_depart,
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                        server_no: this.orderInfo.server_no === 'all' ? '' : this.orderInfo.server_no,
                        server_depart: this.orderInfo.server_depart === 'all' ? '' : this.orderInfo.server_depart,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList= res.data.list;
                        this.totalnum = res.data.totalCount;

                        this.totalCkPrice = res.data.total_ckje;
                        this.totalPurchasekPrice = res.data.total_cgje;
                        this.outGrossProfit = res.data.total_ckml;
                        this.outGrossProfitRate = res.data.total_ckmll;
                        this.outGrossProfit2 = res.data.total_ckml2;
                        this.outGrossProfitRate2 = res.data.total_ckmll2;
                        this.shipAmount = res.data.total_ship;
                        this.$nextTick(() => {
                            this.dataList.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                        if(this.multipleSelection.length == 0){
                            this.totalCkPriceChecked = '0.0000';
                            this.totalPurchasekPriceChecked = '0.0000';
                            this.outGrossProfitChecked = '0.0000';
                            this.outGrossProfitRateChecked = '0.0000';
                            this.outGrossProfitChecked2 = '0.0000';
                            this.outGrossProfitRateChecked2 = '0.0000';
                            this.shipAmountChecked = '0.0000';
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
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
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            getCkTime (time) {
                this.orderInfo.datetimeCk = time;
                this.search();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
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
            this.getStatus();
            this.getAllBrands();
            this.getAllStoreList();
            this.getData();
        }
    };
</script>
