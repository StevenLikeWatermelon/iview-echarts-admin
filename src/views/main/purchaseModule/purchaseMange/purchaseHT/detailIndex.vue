<style>
    .pointer-hover:hover{
        color: rgb(45, 140, 240);
        cursor: pointer;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="form.applyer"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.dj_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in djStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.fk_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in zfStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order_attach_no" placeholder="请输入纸质采购合同编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.stock"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.state"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in fhStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.from_djbh" placeholder="输入来源单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.brand"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.fhd_no" placeholder="输入采购发货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.create_user" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                         <DatePicker type="datetimerange" placeholder="选择预计到货日期时间" :value='form.datetime1' @on-change="datetime1" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.sell_order_no" placeholder="输入销售合同单号" @on-enter="search"></Input>
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
                    <Button type="primary" @click="handleClick({param: 'add'}, 'purchase_manage_HT_add')" v-if="is_current">新增采购合同单</Button>
                    <Button type="primary" @click="toFHD" :class="{'margin-left-10': is_current}" v-auth="buySpecial">生成采购发货单</Button>
                    <Button type="primary" @click="toExport" v-auth="HTlist_export" class="margin-left-10">导出</Button>
                    <span style="padding-left: 20px;">采购总金额：</span><span style="color: #cf0012;">{{amount}}</span>
                    <span style="padding-left: 20px;">勾选采购金额：</span><span style="color: #cf0012;">{{checkamount}}</span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" :selectable="canSelect" fixed>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="采购合同单编号" prop="khbh" fixed width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="gysmc" label="供应商" width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" width="150" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" width="150" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_attach_no" label="纸质合同单号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="ckmc" label="到货仓库 " width="150"></el-table-column>
                    <el-table-column prop="requisition_price" label="申请单价" sortable="custom" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip label="产品面价" prop="product_origin_price" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.product_origin_price).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="采购折扣" prop="product_discount" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ scope.row.product_discount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="采购单价" prop="buy_price" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ scope.row.buy_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip label="采购金额" width="120">
                        <template slot-scope="scope">
                            <span> {{ multiply(scope.row.buy_price, scope.row.buy_num, 4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_ship_num" label="已发货数量" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_instock_num" label="已入库数量" width="100"></el-table-column>
                    <!-- <el-table-column show-overflow-tooltip prop="has_invoice_num" label="已收票数量"></el-table-column> -->
                    <el-table-column show-overflow-tooltip prop="buy_leadtime" label="采购货期(天)" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="expect_leadtime" label="预计到货日期" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_note" label="单据备注" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="detail_note" label="商品备注" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="单据状态" prop="order_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ djStatus[scope.row.order_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="付款状态" prop="pay_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ zfStatus[scope.row.pay_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="发货状态" prop="ship_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ fhStatus[scope.row.ship_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="创建人" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="销售合同单号" prop="from_order_no" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.sell_order_no }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="来源单据编号" prop="from_order_no" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.from_order_no }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="来源单据创建人" width="160">
                        <template slot-scope="scope">
                            <span>{{ scope.row.make_user_no }}<span v-show="scope.row.make_user_no !=''">/</span>{{ scope.row.make_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="ship_nos" label="采购发货单编号" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.ship_nos.length == 0"></div>
                            <el-popover trigger="hover" placement="top" v-else>
                                <p v-for="val in scope.row.ship_nos"><span class="pointer-hover" @click="handleClick({param: val}, 'purchase_manage_FH_detail')">{{ val }}</span></p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="invoice_nos" label="采购收票单编号" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.invoice_nos.length == 0"></div>
                            <el-popover trigger="hover" placement="top" v-else>
                                <p v-for="val in scope.row.invoice_nos"><span class="pointer-hover" @click="handleClick({param: val}, 'purchase_manage_SP_detail')">{{ val }}</span></p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseHtList, apiGetCommonStockList, operateAllBrandsList, apiWaitShipList, apiGetgenerateInvoice, apiInMainName, purchaseManageSPModel,apiExportPurchaseHtList } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        // name: 'purchase_manage_HT_index',
        data () {
            return {
                form: {
                    amount:'',
                    applyer: 'all',
                    dj_status: 'all',
                    fk_status: 'all',
                    htd_bh: '',
                    stock: 'all',
                    state: 'all',
                    from_djbh: '',
                    brand: 'all',
                    name: '',
                    fhd_no: '',
                    order_attach_no: '',
                    sell_order_no:'',
                    order: '',
                    model: '',
                    create_user:'',
                    datetime: [],
                    datetime1: [],
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],      //生成发货单需要参数
                ship_list: '',              //发货单传递参数
                multipleCustomer: [],

                orderField: '',
                orderDirection: 'desc',
                supperList: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                djStatus: [],
                djStatusArr: [
                    {
                        value: 'all',
                        label: '选择单据状态'
                    }
                ],
                zfStatus: [],
                zfStatusArr: [
                    {
                        value: 'all',
                        label: '选择付款状态'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择到货仓库'
                    }
                ],
                fhStatus: [],
                fhStatusArr: [
                    {
                        value: 'all',
                        label: '选择发货状态'
                    }
                ],
                brandArr: [
                    {
                        label: '选择品牌',
                        value: 'all'
                    }
                ],
                is_current: '',
                // is_sp: false,
                is_tp: false,
                start_time: '',
                start_time1: '',
                end_time: '',
                end_time1: '',
                buySpecial: 'buySpecialRole',
                HTlist_export:'HTlist_export',
                checkamount:'0.0000',
            };
        },
        components: {
            pagination
        },
        methods: {
            toExport(){
                apiExportPurchaseHtList(this, {
                    params: JSON.stringify(this.notempty({
                        order_status: this.form.dj_status == 'all' ? '' : this.form.dj_status,
                        pay_status: this.form.fk_status == 'all' ? '' : this.form.fk_status,
                        ship_status: this.form.state == 'all' ? '' : this.form.state,
                        buy_order_no: this.form.htd_no,
                        order_attach_no: this.form.order_attach_no,
                        supplier_no: this.form.applyer == 'all' ? '' : this.form.applyer,
                        product_name: this.form.name,
                        product_order_no: this.form.order,
                        sell_order_no: this.form.sell_order_no,
                        product_model: this.form.model,
                        order_ship_no: this.form.fhd_no,
                        brand_no: this.form.brand == 'all' ? '' : this.form.brand,
                        store_no: this.form.stock == 'all' ? '' : this.form.stock,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        expect_leadtime: !this.start_time1 ? '' : this.start_time1 + '~' +  this.end_time1,
                        from_order_no: this.form.from_djbh,
                        create_user: this.form.create_user
                        // pageNum: this.currentPage,
                        // numPerPage: this.limit,
                        // orderField: this.orderField,
                        // orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
                this.multipleSelectionamount = [];
            },
            canSelect (row) {
                return (row.order_status == 2);
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.checkamount = this.add(this.checkamount, this.multiply(row.buy_price, row.buy_num), 4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);

                    this.checkamount = this.subtract(this.checkamount, this.multiply(row.buy_price, row.buy_num), 4);

                }
            },
            selectAll (selection) {

                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
                for (let i in this.multipleSelection) {
                    for (let j in this.orderData.data) {
                        if (this.multipleSelection[i] == this.orderData.data[j].id && this.orderData.data[j].order_status != 2) {
                            this.multipleSelection.splice(i, 1);
                            this.checkamount = this.subtract(this.checkamount, this.multiply(this.orderData.data[j].buy_price, this.orderData.data[j].buy_num), 4);
                        }
                    }
                }
            },
            toFHD () {
                let tmp = [];
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let ship_list = '';
                    ship_list = this.multipleSelection.join(',');
                    apiWaitShipList(this,{
                        ids: JSON.stringify(ship_list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.handleClick({param: ship_list}, 'purchase_manage_HT_toFHD');
//                            this.multipleSelection = [];
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            // toSPD () {
            //     let tmp = [];
            //     if (this.multipleSelection.length == 0) {
            //         this.$Message.error('请选择单据');
            //     } else {
            //         let list = {};
            //         list = JSON.stringify({
            //             order_invoice_type: 0,
            //             from_order_no: 0,
            //             from_order: '',
            //             order_detail_id: this.multipleSelection
            //         });
            //         apiGetgenerateInvoice(this, {
            //             params: list
            //         }).then(res => {
            //             if (res && res.status == 1){
            //                 this.handleClick({param: list,from_order_no:0}, 'purchase_manage_HT_toSPD');
            //                 this.multipleSelection = [];
            //             } else {
            //                 let mess = '';
            //                 if (res.message.constructor === Array) {
            //                     for (let i in res.message) {
            //                         if (mess) {
            //                             mess = mess + '</br>' + res.message[i];
            //                         } else {
            //                             mess = res.message[i];
            //                         }   
            //                     }
            //                 } else {
            //                     mess = res.message;
            //                 }
            //                 this.$Message.error({
            //                     content: mess,
            //                     duration: 5,
            //                     closable: true
            //                 });
            //             }
            //         });
            //     }
            // },
            toTPD () {
                let tmp = [];
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let list = {};
                    list = JSON.stringify({
                        order_invoice_type: 1,
                        from_order_no: 0,
                        from_order: '',
                        order_detail_id: this.multipleSelection
                    });
                    apiGetgenerateInvoice(this, {
                        params: list
                    }).then(res => {
                        if (res && res.status == 1){
                            this.handleClick({param: list}, 'purchase_manage_HT_toTPD');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*单据状态*/
                        this.djStatus = res.data.buy_order_status;
                        for (let key in res.data.buy_order_status) {
                            if (res.data.buy_order_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_status[key]
                                };
                                this.djStatusArr.push(tmpObj);
                            }
                        }
                        /*支付状态*/
                        this.zfStatus = res.data.buy_order_pay_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }
                        /*发货状态*/
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_ship_status) {
                            if (res.data.buy_order_ship_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_ship_status[key]
                                };
                                this.fhStatusArr.push(tmpObj);
                            }
                        }

                        /*是否合同单审批流可创建人*/
                        apiInMainName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName).then(result => {
                                    this.is_current = result;
                                });
                            }
                        });
                        /*收票是否可创建执行人*/
                        // purchaseManageSPModel(this, {
                        // }).then(res => {
                        //     if (res && res.status == 1) {
                        //         //成功
                        //         let modelName = res.data;
                        //         isInCreaters(this, modelName, 0).then(result => {
                        //             this.is_sp = result;
                        //         });
                        //     }
                        // });
                        /*退票是否可创建执行人*/
                        // purchaseManageSPModel(this, {
                        // }).then(res => {
                        //     if (res && res.status == 1) {
                        //         //成功
                        //         let modelName = res.data;
                        //         isInCreaters(this, modelName, 1).then(result => {
                        //             this.is_tp = result;
                        //         });
                        //     }
                        // });
                    }
                });
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
                    }
                });
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
                        });
                    }
                });
            },
            getData () {
                apiGetPurchaseHtList(this, {
                    params: JSON.stringify(this.notempty({
                        order_status: this.form.dj_status == 'all' ? '' : this.form.dj_status,
                        pay_status: this.form.fk_status == 'all' ? '' : this.form.fk_status,
                        ship_status: this.form.state == 'all' ? '' : this.form.state,
                        buy_order_no: this.form.htd_no,
                        order_attach_no: this.form.order_attach_no,
                        supplier_no: this.form.applyer == 'all' ? '' : this.form.applyer,
                        product_name: this.form.name,
                        product_order_no: this.form.order,
                        sell_order_no: this.form.sell_order_no,
                        product_model: this.form.model,
                        order_ship_no: this.form.fhd_no,
                        brand_no: this.form.brand == 'all' ? '' : this.form.brand,
                        store_no: this.form.stock == 'all' ? '' : this.form.stock,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        expect_leadtime: !this.start_time1 ? '' : this.start_time1 + '~' +  this.end_time1,
                        from_order_no: this.form.from_djbh,
                        create_user: this.form.create_user,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.amount = res.data.amount;
                        this.totalnum = res.data.totalCount;
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

                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }
                    }
                });
            },
            search () {
                this.multipleSelection = [];
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.dj_status = 'all';
                this.form.fk_status = 'all';
                this.form.state = 'all';
                this.form.htd_no = '';
                this.form.applyer = 'all';
                this.form.name = '';
                this.form.order = '';
                this.form.model = '';
                this.form.fhd_no = '';
                this.form.sell_order_no = '';
                this.form.order_attach_no = '',
                this.form.brand = 'all';
                this.form.stock = 'all';
                this.form.datetime = [];
                this.form.datetime1 = [];
                this.start_time = '';
                this.end_time = '';
                this.start_time1 = '';
                this.end_time1 = '';
                this.form.from_djbh = '';
                this.form.create_user = '';
                this.multipleSelection = [];
                this.search();
            },
            datetime (time) {
                this.form.datetime = time;
                this.start_time = this.form.datetime[0];
                this.end_time = this.form.datetime[1];
                this.search();
            },
            datetime1 (time) {
                this.form.datetime1 = time;
                this.start_time1 = this.form.datetime1[0];
                this.end_time1 = this.form.datetime1[1];
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
           this.getData();
        },
        activated () {
            // this.getData();
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
