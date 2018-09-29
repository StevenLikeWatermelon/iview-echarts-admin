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
                            <Select v-model="orderInfo.cpppbh" filterable @on-change="search">
                                <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.out_status"  placeholder="选择出库单状态" @on-change="search">
                                <Option v-for="(val, index) in abolishStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择出库时间" :value='orderInfo.datetimeCk' @on-change="getCkTime" style="width: 100%;"></DatePicker>
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
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库总金额:<span style="margin-left:15px;color: #FF0000;">{{totalCkPriceChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选采购总金额:<span style="margin-left:15px;color: #FF0000;">{{totalPurchasekPriceChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利率:<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRateChecked}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitChecked2}}</span></span>
                    <span v-show="!showAll" style="margin-left:20px;">已勾选出库毛利率(扣除返点):<span style="margin-left:15px;color: #FF0000;">{{outGrossProfitRateChecked2}}</span></span>
                </Col>
                <el-table :data="dataList"  ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"   max-height="570">
                    <el-table-column type="selection" width="55" fixed></el-table-column>
                    <el-table-column prop="cpppbh" label="品牌编号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ckje" label="出库金额" sortable="custom" show-overflow-tooltip min-width="110"></el-table-column>
                    <el-table-column prop="cgje" label="采购金额" sortable="custom" show-overflow-tooltip min-width="110"></el-table-column>
                    <el-table-column prop="ckml" label="出库毛利" sortable="custom" show-overflow-tooltip min-width="110"></el-table-column>
                    <el-table-column prop="ckmll" label="出库毛利率" sortable="custom" show-overflow-tooltip min-width="110"></el-table-column>
                    <el-table-column prop="ckml_rebate" label="出库毛利(扣除返点)" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="ckmll_rebate" label="出库毛利率(扣除返点)"  sortable="custom" show-overflow-tooltip width="170"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import {apiAllStatus, getOutProfitBrandApi, getOutProfitBrandExporttApi, apiAllBrands } from '@/config/getData';
    import { notempty, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                orderInfo: {
                    cpppbh: 'all',
                    out_status: 'all',
                    datetimeCk: [],
                    datetime: [],
                },
                totalCkPrice: '',
                totalPurchasekPrice: '',
                outGrossProfit: '',
                outGrossProfitRate: '',
                outGrossProfit2: '',
                outGrossProfitRate2: '',
                totalCkPriceChecked: '',
                totalPurchasekPriceChecked: '',
                outGrossProfitChecked: '',
                outGrossProfitRateChecked: '',
                outGrossProfitChecked2: '',
                outGrossProfitRateChecked2: '',
                abolishStatusObj: {},
                abolishStatusArr: [{
                    value: 'all',
                    label: '选择出库单状态'
                }],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
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
                if (row.checked && !(this.multipleSelection.includes(row.cpppbh))) {
                    this.multipleSelection.push(row.cpppbh);
                    this.totalCkPriceChecked = (+this.totalCkPriceChecked + +row.ckje).toFixed(4);
                    this.totalPurchasekPriceChecked = (+this.totalPurchasekPriceChecked + +row.cgje).toFixed(4);
                    this.outGrossProfitChecked = (+this.outGrossProfitChecked + +row.ckml).toFixed(4);
                    this.outGrossProfitChecked2 = (+this.outGrossProfitChecked2 + +row.ckml_rebate).toFixed(4);
                }
                if (!row.checked && this.multipleSelection.includes(row.cpppbh)) {
                    let index = this.multipleSelection.indexOf(row.cpppbh);
                    this.multipleSelection.splice(index, 1);
                    this.totalCkPriceChecked = (+this.totalCkPriceChecked - +row.ckje).toFixed(4);
                    this.totalPurchasekPriceChecked = (+this.totalPurchasekPriceChecked - +row.cgje).toFixed(4);
                    this.outGrossProfitChecked = (+this.outGrossProfitChecked - +row.ckml).toFixed(4);
                    this.outGrossProfitChecked2 = (+this.outGrossProfitChecked2 - +row.ckml_rebate).toFixed(4);
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
                getOutProfitBrandExporttApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        out_starttime: this.orderInfo.datetimeCk[0],
                        out_endtime: this.orderInfo.datetimeCk[1],
                        
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                        out_status: this.orderInfo.out_status === 'all' ? '' : this.orderInfo.out_status,
                    }))
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
            },
            getData () {
                getOutProfitBrandApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        out_starttime: this.orderInfo.datetimeCk[0],
                        out_endtime: this.orderInfo.datetimeCk[1],
                        
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                        out_status: this.orderInfo.out_status === 'all' ? '' : this.orderInfo.out_status,
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
                        this.$nextTick(() => {
                            this.dataList.forEach(row => {
                                if (this.multipleSelection.includes(row.cpppbh)) {
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
            this.getData();
        }
    };
</script>
