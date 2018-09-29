<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120" ref="basicForm" :model="form" :rules="basicRules">
                    <Row>
                        <Col span="8">
                        <FormItem label="发货方式：" style="margin:0;" prop="ship_type">
                            <Select v-model="form.ship_type"  placeholder="请选择" @on-change="shipType">
                                <Option v-for="(value, index) in fhfs_list" :value="index" :key="index">{{ value }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发货物流：" style="margin:0;">
                            <Select v-model="form.ship_id"  placeholder="请选择">
                                <Option v-for="val in fhwl_list" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="物流单号：" style="margin:0;">
                            <Input v-model="form.ship_no"  placeholder="请填写物流单号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="是否直发客户：" style="margin:0;" prop="is_direct">
                            <Select v-model="form.is_direct"  placeholder="请选择" @on-change="direct">
                                <Option v-for="status in direct_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="货期：" style="margin:0;" prop="hq">
                            <Input v-model="form.hq"  placeholder="请填写货期" type="number"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="到货仓库：" style="margin:0;" prop="receive_stock">
                            <Select v-model="form.receive_stock"  placeholder="请选择" @on-change="store" :disabled="stores">
                                <Option value="888" v-show="not_real_store">虚拟仓库</Option>
                                <Option v-for="status in store_list" :value="status.ckbh" :key="status.ckbh">{{ status.ckmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="到货联系人：" style="margin:0;" prop="receive_name">
                            <Input v-model="form.receive_name" disabled="disabled"></Input>
                        </FormItem>
                        </Col>
                        <Col span="12" class="margin-top-20">
                        <FormItem label="到货地址：" style="margin:0;" prop="receive_address">
                            <div>
                                <Cascader :data="addressData" v-model="form.receive_address_id" style="width:250px;float:left;" disabled="disabled"></Cascader>
                                <Input type="text" v-model="form.receive_address" class="margin-left-20" style="width:250px;float:left;" disabled="disabled"></Input>
                                <div class="clear"></div>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="form.note"  placeholder="请填写备注"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    采购商品明细
                    <span style="font-weight:normal;float:right;">
                        <Button type="primary" @click="addGoods">添加商品</Button>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>发货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">发货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号" fixed></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" fixed show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" fixed min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" fixed min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" fixed min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column label="采购单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_price | toFiexedFour }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ship_num" label="已发货数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="can_num" label="待发货数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column label="本次发货数量" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.now_num" @on-change="verify(scope)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_num" label="发货金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_price, scope.row.now_num, 4) }}</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="货期(天)" sortable="custom">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.product_leadtime"></Input>
                            </template>
                        </el-table-column>-->
                        <el-table-column label="采购合同单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleted(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from_order_no" label="来源单据编号" min-width="100"></el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="500" class="orderForm-approvePass" :closable=false>
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#000;line-height: 40px;">发货商品对应的销售合同单剩余<em style="color:#cf0012;font-style: normal;">{{money}}</em>元待付款，</P>
                    <P style="font-size:16px;color:#000;line-height: 40px;">确认直发客户？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancel()">取消</Button>
                <Button type="primary" :loading="loadding" @click="ok()">确定</Button>
            </div>
        </Modal>




        <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT">
            <h3 slot="header">添加商品</h3>
            <div>


                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="formSearch" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="formSearch.fk_status"  placeholder="请选择" @on-change="search">
                                        <Option v-for="status in zfStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.htd_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>

                                <Col span="4">
                                    <Select v-model="formSearch.brand"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>

                                <Col span="4">
                                    <Input v-model="formSearch.order" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.create_user" placeholder="请输入" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                                </Col>

                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择预计到货日期时间" :value='formSearch.datetime1' @on-change="datetime1" style="width: 100%;"></DatePicker>
                                </Col>
                                <Col span="4">
                                <Input v-model="formSearch.sell_order_no" placeholder="请输入销售合同单编号" @on-enter="search"></Input>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>



                <Row class="margin-top-10">
                    <Col span="24">
                    <Card>
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="confirmAdd()">添加</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" :selectable="canSelect" fixed></el-table-column>
                            <el-table-column label="采购合同单编号" prop="buy_order_no" fixed width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="gysmc" label="供应商" width="120"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" ></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" width="150" ></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" width="120" ></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="100" ></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位 " ></el-table-column>
                            <el-table-column prop="ckmc" label="到货仓库 " width="150"></el-table-column>
                            <el-table-column label="产品面价" prop="product_origin_price" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.product_origin_price).toFixed(2) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购折扣" prop="product_discount" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.product_discount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购单价" prop="buy_price" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" min-width="100"></el-table-column>
                            <el-table-column label="采购金额">
                                <template slot-scope="scope">
                                    <span> {{ multiply(scope.row.buy_price, scope.row.buy_num, 4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="has_ship_num" label="已发货数量"></el-table-column>
                            <!-- <el-table-column prop="has_invoice_num" label="已收票数量"></el-table-column> -->
                            <el-table-column prop="buy_leadtime" label="采购货期(天)"></el-table-column>
                            <el-table-column prop="expect_leadtime" label="预计到货日期"></el-table-column>
                            <el-table-column prop="order_note" label="单据备注" width="150"></el-table-column>
                            <el-table-column prop="detail_note" label="商品备注" width="150"></el-table-column>
                            <el-table-column label="单据状态" prop="order_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ djStatus[scope.row.order_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="付款状态" prop="pay_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ zfStatus[scope.row.pay_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货状态" prop="ship_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ fhStatus[scope.row.ship_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
                            <el-table-column label="创建人" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源单据编号" prop="from_order_no" width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.from_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号" prop="sell_order_no" width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.sell_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ship_nos" label="采购发货单编号" width="120">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.ship_nos.length == 0"></div>
                                    <el-popover trigger="hover" placement="top" v-else>
                                        <p v-for="val in scope.row.ship_nos"><span class="pointer-hover">{{ val }}</span></p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoice_nos" label="采购收票单编号" width="120">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.invoice_nos.length == 0"></div>
                                    <el-popover trigger="hover" placement="top" v-else>
                                        <p v-for="val in scope.row.invoice_nos"><span class="pointer-hover">{{ val }}</span></p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="default" @click="goodsCancel">取消</Button>
                <!--<Button type="primary" @click="ToHTD">确定</Button>-->
            </div>
        </Modal>



    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiGetPurchaseCanShip,allStoreInfos,operateAllBrandsList,apiMapDetail,apiWaitShipList,apiGetPurchaseHtShipGenerate,apiShipIsDirect,apiGetCkDetailByCKBH, apiSendLogistic,apiGetPurchaseHtList } from '@/config/getData';
    import { notempty, sortBy, setToken, toFiexedPrice, closeCurrentPage } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_HT_toFHD',
        data () {
            return {
                tmp_list: [],
                money: 0,
                publicModal: false,
                basicRules: {
                    is_direct: [
                        { required: true, message: '请选择是否直发客户', trigger: 'on-change' }
                    ],
                    receive_stock: [
                        { required: true, message: '请选择到货仓库', trigger: 'on-change' }
                    ],
                    hq: [
                        { required: true, message: '请填写货期', trigger: 'blur' }
                    ]
                },
                form: {
                    stores: false,
                    not_real_store: false,
                    ship_type: '',              //发货方式
                    ship_id: '',                //发货物流
                    ship_no: '',                //物流单号
                    is_direct: '0',              //是否直发
                    hq: '',                     //货期
                    receive_stock: '',          //到货仓库
                    receive_name: '',           //到货联系人
                    receive_address_id: [],     //到货地址
                    receive_address: '',        //到货地址ID
                    note: ''                    //备注
                },
                fhfs_list: [],
                fhwl_list: [],
                direct_list: [],
                store_list: [],
                addressData: [],
                htd_id: '',
                actTable: {
                    data: []
                },
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                loadding: false,
                goodsModal:false,
                orderData:[],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                supplier_no:'',
                djStatus: [],
                zfStatus: [],
                fhStatus: [],
                multipleSelection: [],
                multipleCustomer: [],
                goodsAddArr:[],
                goods:[],
                formSearch: {
                    fk_status:'all',
                    brand:'all',
                    datetime: [],
                    datetime1: [],
                    sell_order_no:''
                },
                zfStatusArr: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                start_time: '',
                start_time1: '',
                end_time: '',
                end_time1: '',
                ajaxHistoryData:[],
            };
        },
        components: {
            pagination
        },
        methods: {
            search(){
                this.multipleSelection = [];
                this.currentPage = 1;
                this.getGoods();
            },
            reset(){
                this.formSearch.fk_status = 'all';
                this.formSearch.htd_no = '';
                this.formSearch.name = '';
                this.formSearch.order = '';
                this.formSearch.model = '';
                this.formSearch.brand = 'all';
                this.formSearch.datetime = [];
                this.formSearch.datetime1 = [];
                this.start_time = '';
                this.end_time = '';
                this.start_time1 = '';
                this.end_time1 = '';
                this.formSearch.create_user = '';
                this.formSearch.sell_order_no = '';
                this.multipleSelection = [];
                this.search();
            },
            datetime (time) {
                this.formSearch.datetime = time;
                this.start_time = this.formSearch.datetime[0];
                this.end_time = this.formSearch.datetime[1];
                this.search();
            },
            datetime1 (time) {
                this.formSearch.datetime1 = time;
                this.start_time1 = this.formSearch.datetime1[0];
                this.end_time1 = this.formSearch.datetime1[1];
                this.search();
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable.data) {
                    if (row.id === this.actTable.data[i].id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].id);
                    }
                    let ship_list = '';
                    ship_list = this.goodsAddArr.join(',');
                    apiWaitShipList(this,{
                        ids: JSON.stringify(ship_list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goods = res.data.list;
                            for (let i in this.goods) {
                                this.actTable.data.push(this.goods[i]);
                            }
                            this.calculates();
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });


                }

            },
            goodsCancel(){
                this.goodsModal = false;
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            addGoods () {
                this.goodsModal = true;
                this.getGoods();
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.orderData =  this.ajaxHistoryData.slice(_start, _end);

            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            getGoods(){
                apiGetPurchaseCanShip(this, {
                    ship_status:JSON.stringify([0,1]),
                    params: JSON.stringify(this.notempty({
                        supplier_no: this.supplier_no,
                        order_status: 2,
                        pay_status: this.formSearch.fk_status == 'all' ? '' : this.formSearch.fk_status,
                        buy_order_no: this.formSearch.htd_no,
                        product_name: this.formSearch.name,
                        product_order_no: this.formSearch.order,
                        product_model: this.formSearch.model,
                        brand_no: this.formSearch.brand == 'all' ? '' : this.formSearch.brand,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        expect_leadtime: !this.start_time1 ? '' : this.start_time1 + '~' +  this.end_time1,
                        create_user: this.formSearch.create_user,
                        sell_order_no: this.formSearch.sell_order_no,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功

                        this.ajaxHistoryData = res.data.list;
                        this.totalnum = res.data.totalCount;
                        if (res.data.totalCount < this.limit) {
                            this.orderData = this.ajaxHistoryData;
                        } else {
                            this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                        }
                    }
                });
            },
            ok () {
                this.form.receive_address_id = [parseInt(this.tmp_list.shsfbh), parseInt(this.tmp_list.shsqbh), parseInt(this.tmp_list.shxqbh)];
                this.form.receive_address = this.tmp_list.shxxdz;
                this.form.receive_name = this.tmp_list.shrxm;
                //隐藏弹窗
                this.publicModal = false;
            },
            cancel () {
                this.form.is_direct = '0';
                this.form.receive_address_id = [];
                this.form.receive_address = '';
                this.form.receive_name = '';
                this.form.receive_stock = '';
                this.form.hq = '';
                this.not_real_store = false;
                this.stores = false;
                //隐藏弹窗
                this.publicModal = false;
            },
            shipType () {
                if(this.form.ship_type == '300'){
                    this.form.ship_id = '';
                    this.form.ship_no = '';
                }
            },
            verify (scope) {
                let _index = scope.$index;
                let regu = /^[1-9]\d*$/;
                if (!regu.test(this.actTable.data[_index]['now_num'])) {
                    this.$Message.error('必须填入正整数');
                }
                if(this.actTable.data[_index]['now_num'] > this.actTable.data[_index]['can_num']){
                    this.$Message.error('不可大于发货数量');
                }
                this.calculates();
            },
            store () {
                this.form.receive_address_id = [];
                this.form.receive_address = '';
                this.form.receive_name = '';
                if(this.form.receive_stock != '' && this.form.receive_stock != undefined){
                    apiGetCkDetailByCKBH(this, {
                        ckbh: this.form.receive_stock
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.form.receive_address_id = [parseInt(res.data.dzsfbh), parseInt(res.data.dzcsbh), parseInt(res.data.dzxqbh)];
                            this.form.receive_address = res.data.ckdz;
                            this.form.receive_name = res.data.ckfzr;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            direct () {
                let tmp = {};
                for(let key in this.actTable.data){
                    tmp[this.actTable.data[key].id] = this.actTable.data[key].now_num;
                }
                if(this.form.is_direct == 1){
                    apiShipIsDirect(this, {
                        data: JSON.stringify(tmp)
                    }).then(res => {
                        if (res && res.status == 1) {
                            if(res.data.can == 0){
                                this.form.is_direct = '0';
                                this.$Message.error(res.message);
                            }else{
                                //直发模式
                                this.form.receive_address_id = [];
                                this.form.receive_address = '';
                                this.form.receive_name = '';
                                this.form.receive_stock = '888';
                                this.not_real_store = true;
                                this.stores = true;
                                this.tmp_list = res.data.info;
                                //显示弹窗
                                if(res.data.money > 0){
                                    this.publicModal = true;
                                    this.money = res.data.money;
                                }else{
                                    this.ok();
                                }
                            }
                        }else{
                            this.form.is_direct = '0';
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.form.receive_address_id = [];
                    this.form.receive_address = '';
                    this.form.receive_name = '';
                    this.form.receive_stock = '';
                    this.not_real_store = false;
                    this.stores = false;
                    //隐藏弹窗
                    this.publicModal = false;
                }
            },
            save () {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        /*if(this.form.ship_type == 200){
                            if(!this.form.ship_id || !this.form.ship_no){
                                this.$Message.error('发货物流、物流单号不能为空!');
                                return;
                            }
                        }*/
                        for(let i = 0; i < this.actTable.data.length; i++){
                            if(this.actTable.data[i].now_num == ''){
                                this.$Message.error('发货数量必填!');
                                return;
                            }
                        }
                        if(this.form.hq <= 0){
                            this.$Message.error('货期必须是大于等于0的数!');
                            return;
                        }
                        let tmp = {};
                        for(let key in this.actTable.data){
                            tmp[this.actTable.data[key].id] = this.actTable.data[key].now_num+'-'+this.form.hq;
                        }
                        this.loadding = true;
                        apiGetPurchaseHtShipGenerate(this, {
                            params: JSON.stringify(this.notempty({
                                ship_type: this.form.ship_type,
                                ship_id: this.form.ship_id,
                                ship_no: this.form.ship_no,
                                is_direct: this.form.is_direct,
                                receive_stock: this.form.receive_stock,
                                hq: this.form.hq,
                                receive_name: this.form.receive_name,
                                receive_address_id: this.form.receive_address_id,
                                receive_address: this.form.receive_address,
                                note: this.form.note
                            })),
                            data: JSON.stringify(tmp)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success(res.message);
                                this.loadding = false;
                                //跳转到发货单详情页
                                closeCurrentPage(this);
                                let param = {param:res.data.ship_no, fromAdd: '1'};
                                util.openNewPage(this, 'purchase_manage_FH_detail', param);
                                this.$router.push({
                                    name: 'purchase_manage_FH_detail',
                                    query: param
                                });
                            }else{
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            deleted (index) {
                this.actTable.data.splice(index,1);
                this.calculates();
            },
            getArea () {
                apiMapDetail(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.addressData = res.data;
                    }
                });
            },
            getStore () {
                allStoreInfos(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.store_list = res.data.list;
                    }
                });
            },
            //获取状态
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fhfs2','is_direct','buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        //成功
                        this.fhfs_list = res.data.fhfs2;
                        // this.fhwl_list = res.data.fhwl;
                        //拼接是否直发
                        for (let key in res.data.is_direct) {
                            if (res.data.is_direct.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_direct[key]
                                };
                                this.direct_list.push(tmpObj);
                            }
                        }

                        this.djStatus = res.data.buy_order_status;
                        this.zfStatus = res.data.buy_order_pay_status;
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }

                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fhwl_list = res.data;
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
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            //获取数据
            getData () {
                apiWaitShipList(this,{
                    ids: JSON.stringify(this.htd_id)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.actTable.data = res.data.list;
                        this.form.receive_stock = res.data.basic_info.store_no;
                        this.store();
                        this.supplier_no = res.data.basic_info.supplier_no;
                        //计算价格和数量
                        this.calculates();
                    }
                });
            },
            calculates () {
                this.goodsAll = parseInt(0);
                this.goodsAllMoney = 0;
                for(let key in this.actTable.data){
                    this.goodsAll += parseInt(this.actTable.data[key]['now_num']);
                    this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(this.actTable.data[key]['now_num'], this.actTable.data[key]['buy_price']), 4);
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            //获取省市区地区
            this.getArea();
            //获取仓库
            this.getStore();
            //获取状态
            this.getStatus();
        },
        activated() {
            //获取数据
            this.htd_id = this.$route.query.param;
            this.getData();
        }
    };
</script>
