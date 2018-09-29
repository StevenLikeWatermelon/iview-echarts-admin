<style>
    .no-auth-hidden {
        display: none;
    }
    .ivu-upload {
        float: left;
        margin-right: 3px;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="priceInfo" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="priceInfo.cppp_cpppbh"  placeholder="选择产品品牌" filterable @on-change="search">
                                <Option v-for="item in brandList" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="priceInfo.cplb_cplbbh" placeholder="选择产品类别" filterable  @on-change="search">
                                <Option v-for="item in productType" :value="item.cplbbh" :key="item.cplbbh">{{ item.cplbmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                             <Select v-model="priceInfo.sjcp_anomaly"  @on-change="search">
                                <Option v-for="item in isNormal" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="priceInfo.sjcp_zszt"  @on-change="search">
                                <Option v-for="item in isInSale" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="priceInfo.sjcp_exist_cpxhmj"  @on-change="search">
                                <Option v-for="item in allMjArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                             <Input v-model="priceInfo.keywords" placeholder="输入商品信息" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                           <Select v-model="priceInfo.timeType" placeholder="选择时间类型"  @on-change="search">
                                <Option v-for="item in timeTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择时间" style="width: 100%;" @on-change="getDate"></DatePicker>
                        </Col>
                        <!-- <Col span="4" offset="12" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col> -->
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="24"  style="margin-bottom: 10px;" v-auth="operateAuth">
                    <Button type="success" @click="exportMJTmp()">面价模板下载</Button>
                    <Button type="success" @click="exportZKTmp()">折扣模板下载</Button>
                    <Button type="primary" @click="doLoad('1')">上架</Button>
                    <Button type="primary" @click="doLoad('0')">下架</Button>
                    <Button type="primary" @click="getData(1)">导出</Button>
                    <Button type="error" @click="deleteItem()">删除</Button>
                    <Button type="primary" @click="handleClick('', 'operate_goods_bulk_operation')">批量操作</Button>
                    <Upload :action="MJimportApi" name="file" :format="['csv']" :on-success="handleSuccessMJ" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">面价导入</Button>
                    </Upload>
                    <Upload :action="MJimportApi" name="file" :format="['csv']" :on-success="handleSuccessZK" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">折扣导入</Button>
                    </Upload>
                </Col>
                <el-table :row-class-name="tableRowClassName" :data="priceListData" border style="text-align: center;width: 100%" @sort-change="manualSort"  @selection-change="handleSelectionChange"  max-height="570">
                    <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxhbh" label="商品型号编号" fixed="left"  width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({id: scope.row.cpxhbh}, 'operate_goods_manage_index_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.cpxhbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="zszt" label="在售状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.zszt == '1' ? '在售' : '待售'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpppmc" label="商品品牌" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称"  min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmcty" label="通用系列" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cplbmc"  label="产品类别" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxh" label="商品型号" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpdhh" label="商品订货号"  min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxhmj" label="面价" sortable="custom"  min-width="100">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.cpxhmj}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.cpxhmj"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="zdjzk" label="认证折扣"   sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.zdjzk}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.zdjzk"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="vipzk" label="vip折扣"  sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.vipzk}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.vipzk"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="scjzk" label="商城折扣"   sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.scjzk}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.scjzk"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="mjrq" label="面价维护时间"   sortable="custom"  width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="sjrq" label="上架时间"   sortable="custom"  width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="xjrq" label="下架时间"   sortable="custom"  width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" width="120" v-if="toManyToShow && displayClass">
                        <template slot-scope="scope">
                            <span  @click="editAndCopy(scope.$index)" type="text" size="small" v-if="!scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">修改</span></span>
                            <span  @click="cancel(scope.$index)" type="text" size="small" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">取消</span></span>
                            <span  @click="save(scope.$index)" type="text" size="small" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;">保存</span></span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <div id="mj-upload-div" style="display:none">
            <input type="file" name="Mjcsvfile" id="mj-upload"/>
        </div>
        <Modal v-model="showSucessInfo" width="400" :closable="true" :mask-closable="true">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p>{{successInfoMsg}}</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="hasKnow()">知道了</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import util from '@/libs/util';
    import $ from '@/libs/jquery';
    import Papa from '@/libs/papaparse';
    import pagination from '../../../common/pagination.vue';
    import { operateGoodsPriceList, operateAllBrandsList, operateAllBrandstype, 
    operatePriceEdit, priceImport, priceExport, batchUp, batchDown, MJimportApi, discountExport, ZKimportApi, deleteItems} from '@/config/getData';
    import {manualCheck, setToken} from '@/config/mUtils';
    export default {
        name: 'operate_goods_price_manage_index',
        data () {
            return {
                showSucessInfo: false,
                successInfoMsg: '',
                priceInfo: {
                    cppp_cpppbh: this.$route.query.cppp_cpppbh ||'all',
                    cplb_cplbbh: 'all',
                    sjcp_anomaly: 'all',
                    keywords: this.$route.query.keywords ||'',
                    sjcp_zszt: 'all',
                    timeType: '1',
                    sjcp_exist_cpxhmj: 'all',
                    timeRange: ''
                },
                brandList: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                productType:[{
                    cplbbh: 'all',
                    cplbmc: '选择产品类别'
                }],
                isNormal:[{
                    value: 'all',
                    label: '选择价格异常'
                },{
                    value: '1',
                    label: '异常'
                },{
                    value: '0',
                    label: '正常'
                }],
                isInSale:[{
                    value: 'all',
                    label: '选择在售状态'
                },{
                    value: '1',
                    label: '在售'
                },{
                    value: '0',
                    label: '待售'
                }],
                allMjArr:[{
                    value: 'all',
                    label: '选择是否有面价'
                },{
                    value: '1',
                    label: '存在'
                },{
                    value: '0',
                    label: '不存在'
                }],
                timeTypes:[{
                    value: '1',
                    label: '上架时间'
                },{
                    value: '2',
                    label: '下架时间'
                },{
                    value: '3',
                    label: '面价更新时间'
                }],
                priceListData: [],
                currentPage: 1,
                limit: 10,
                orderField: '',
                totalnum: 0,
                orderDirection: 'desc',
                payStatus: '',
                showSpin: false,
                spinShow: true,
                copyList: {},
                arrToUpAndDown: [],
                operateAuth: 'operate_goods_price_manage_index_all_button',
                displayClass: true,
                toManyToShow: true,
                MJimportApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                justOnceFromUrl: true
            };
        },
        components: {
            pagination
        },
        methods: {
            hasKnow () {
                this.showSucessInfo = false;
            },
            editAndCopy(index) {
                this.copyList = JSON.parse(JSON.stringify(this.priceListData));
                this.priceListData[index].isEdit = true;
            },
            cancel(index) {
                this.priceListData = JSON.parse(JSON.stringify(this.copyList));
                this.priceListData[index].isEdit = false;
            },
            save(index) {
                let tmpObj = {
                    cpxhbh: this.priceListData[index].cpxhbh,
                    cpxhmj: this.priceListData[index].cpxhmj,
                    zdjzk: this.priceListData[index].zdjzk,
                    scjzk: this.priceListData[index].scjzk,
                    vipzk: this.priceListData[index].vipzk,
                    xy_cp_id: this.priceListData[index].xy_cp_id,
                };
                let maxTwo =  /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                let maxThree =  /^-?\d+(\.\d{1,3})?$/;

                if (isNaN(tmpObj.cpxhmj) || isNaN(tmpObj.zdjzk) || isNaN(tmpObj.scjzk) || isNaN(tmpObj.vipzk)) {
                    this.$Message.error('数据格式有误，检查!');
                    return;
                }

                if (!maxTwo.test(tmpObj.cpxhmj)) {
                    this.$Message.error('面价小数点不能大于2位');
                    return;
                }

                if (!maxThree.test(tmpObj.zdjzk) || !maxThree.test(tmpObj.scjzk) || !maxThree.test(tmpObj.vipzk)) {
                    this.$Message.error('折扣小数点不能大于3位');
                    return;
                }

                if (+tmpObj.cpxhmj <= 0) {
                    this.$Message.error('面价不能小于0!');
                    return;
                }
                if (+tmpObj.zdjzk <= 0 || +tmpObj.scjzk <= 0 || +tmpObj.vipzk <= 0) {
                    this.$Message.error('折扣必须不小于0!');
                    return;
                }
                if (+tmpObj.zdjzk > 1 || +tmpObj.scjzk > 1 || +tmpObj.vipzk > 1) {
                    this.$Message.error('折扣不能大于1!');
                    return;
                }
                
                operatePriceEdit(this, {
                    params: JSON.stringify(tmpObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.priceListData[index].isEdit = false;
                        this.getData();
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            exportMJTmp() {
                priceImport(this, {});
            },
            handleSuccessMJ(arr) {
                let self = this;
                self.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                MJimportApi(self, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.error_msg && res.data.error_msg.length > 0) {
                            let str = res.data.error_msg.join(',');
                            this.successInfoMsg = res.data.success_count + '个导入成功,' + res.data.error_count + '个导入失败,' + str;
                            this.showSucessInfo = true;
                        } else {
                            self.$Message.success('导入成功!');
                        }
                        self.getData();
                    } else {
                        self.$Message.error(res.message);
                    }
                    self.showSpin = false;
                });
            },
            handleSuccessZK(arr) {
                let self = this;
                self.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                ZKimportApi(self, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.error_msg && res.data.error_msg.length > 0) {
                            let str = res.data.error_msg.join(',');
                            this.successInfoMsg = res.data.success_count + '个导入成功,' + res.data.error_count + '个导入失败,' + str;
                            this.showSucessInfo = true;
                        } else {
                            self.$Message.success('导入成功!');
                        }
                        self.getData();

                    } else {
                        self.$Message.error(res.message);
                    }
                    self.showSpin = false;
                });
            },
            exportZKTmp() {
                discountExport(this, {});
            },
            doIportMJ() {

            },
            handleSelectionChange(selectedVal) {
                this.arrToUpAndDown = [];
                selectedVal.forEach(item => {
                    this.arrToUpAndDown.push(item.cpxhbh);
                });
            },
            doLoad(type) {
                if (this.arrToUpAndDown.length == 0) {
                    this.$Message.error('至少选择一项');
                    return
                }
                let tmpMsg = '';
                if (type == '1') {
                    batchUp(this, {
                        params: JSON.stringify(this.arrToUpAndDown)
                    }).then(res => {
                        if (res && res.status == 1) {
                            tmpMsg += '操作完成,' + res.data.success + '个上架成功，' + res.data.error + '个上架失败';
                            this.successInfoMsg = tmpMsg;
                            this.showSucessInfo = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                }
                if (type == '0') {
                    batchDown(this, {
                        params: JSON.stringify(this.arrToUpAndDown)
                    }).then(res => {
                        if (res && res.status == 1) {
                            tmpMsg += '操作完成,' + res.data.success + '个下架成功，' + res.data.error + '个下架失败';
                            this.successInfoMsg = tmpMsg;
                            this.showSucessInfo = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                }
            },
            deleteItem() {
                if (this.arrToUpAndDown.length == 0) {
                    this.$Message.error('至少选择一项');
                    return
                }
                deleteItems(this, {
                    params: JSON.stringify(this.arrToUpAndDown)
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpMsg = '操作完成,' + res.data.success + '个删除成功，' + res.data.error + '个删除失败';
                        this.successInfoMsg = tmpMsg;
                        this.showSucessInfo = true;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
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
            getStatus() {
                operateAllBrandsList(this,{}).then(res => {
                    res.data.list.forEach(item => {
                        this.brandList.push({
                            cpppbh: item.cpppbh,
                            cpppmc: item.cpppmc
                        })
                    });
                });
                operateAllBrandstype(this,{}).then(res => {
                    this.productType = this.productType.concat(res.data.list);
                });
            },
            getDate(value) {
                this.priceInfo.timeRange = value.join('~');
                this.search();
            },
            getData(isExport) {
                this.showSpin = true;
                let tmpObj;
                //转化时间
                this.priceInfo.timeRange = (this.priceInfo.timeRange == '~') ? '' : this.priceInfo.timeRange;
                switch(this.priceInfo.timeType) {
                    case '1':
                        tmpObj = {
                            sjcp_sjrq: this.priceInfo.timeRange
                        };
                        break;
                    case '2':
                        tmpObj = {
                            sjcp_xjrq: this.priceInfo.timeRange
                        };
                        break;
                    case '3':
                        tmpObj = {
                            sjcp_mjrq: this.priceInfo.timeRange
                        };
                        break;
                }
                Object.assign(tmpObj, {
                    cppp_cpppbh: this.priceInfo.cppp_cpppbh == 'all' ? '' : this.priceInfo.cppp_cpppbh,
                    cplb_cplbbh: this.priceInfo.cplb_cplbbh == 'all' ? '' : this.priceInfo.cplb_cplbbh,
                    sjcp_anomaly: this.priceInfo.sjcp_anomaly == 'all' ? '' : this.priceInfo.sjcp_anomaly,
                    sjcp_zszt: this.priceInfo.sjcp_zszt == 'all' ? '' : this.priceInfo.sjcp_zszt,
                    sjcp_exist_cpxhmj: this.priceInfo.sjcp_exist_cpxhmj == 'all' ? '' : this.priceInfo.sjcp_exist_cpxhmj,
                    keywords: this.priceInfo.keywords,
                    numPerPage: this.limit,
                    orderField: this.orderField,
                    orderDirection: this.orderDirection,
                    pageNum: this.currentPage
                });
                if (isExport) {
                    priceExport(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        this.showSpin = false;
                    });
                } else {
                    operateGoodsPriceList(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.isEdit = false;
                            });
                            this.priceListData = res.data.list;
                            this.totalnum = res.data.totalCount;
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.showSpin = false;
                    });

                }
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.priceInfo = {
                    cppp_cpppbh: 'all',
                    cplb_cplbbh: 'all',
                    sjcp_anomaly: 'all',
                    keywords: '',
                    sjcp_zszt: 'all',
                    sjcp_exist_cpxhmj: 'all',
                    timeType: '1',
                    timeRange: []
                };
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                if (this.limit < 100) {
                    this.toManyToShow = true;
                } else {
                    this.toManyToShow = false;
                }
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                switch(column.prop) {
                    case 'cpxhmj':
                        this.orderField = 'sjcp|cpxhmj';
                        break;
                    case 'sjrq':
                        this.orderField = 'sjcp|sjrq';
                        break;
                    case 'xjrq':
                        this.orderField = 'sjcp|xjrq';
                        break;
                    case 'zdjzk':
                        this.orderField = 'sjcp|zdjzk';
                        break;
                    case 'zdj':
                        this.orderField = 'sjcp|zdj';
                        break;
                    case 'vipzk':
                        this.orderField = 'sjcp|vipzk';
                        break;
                    case 'vip':
                        this.orderField = 'sjcp|vip';
                        break;
                    case 'scjzk':
                        this.orderField = 'sjcp|scjzk';
                        break;
                    case 'scj':
                        this.orderField = 'sjcp|scj';
                        break;
                    case 'mjrq':
                        this.orderField = 'sjcp|mjrq';
                        break;
                }
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.displayClass = manualCheck('operate_goods_price_manage_index_all_button');
        },
        activated() {
            if (this.$route.query.cppp_cpppbh && this.justOnceFromUrl) {
                this.priceInfo.cppp_cpppbh = this.$route.query.cppp_cpppbh;
                this.priceInfo.keywords = this.$route.query.keywords;
                this.justOnceFromUrl = false;
            }
            this.getData();
        }
    };
</script>
