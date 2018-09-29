<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120" :rules="basicRules"  ref="info" :model="info">
                    <Row>
                        <Col span="8">
                        <FormItem label="发票类型：">
                            <template slot-scope="scope">
                            <span> {{ fplxStatus[info.invoice_type] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="税率：">
                            {{info.buy_tax_rate}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发票类别：">
                            <template slot-scope="scope">
                            <span> {{ invoiceTypeStatus[info.order_invoice_type] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="实际开票日期:" prop="invoice_time">
                                <Date-picker type="date" format="yyyy-MM-dd" :value="info.invoice_time" placeholder="选择日期" style="width: 200px" @on-change="changeDate"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发票号码：" prop="invoice_no">
                            <Input v-model="info.invoice_no"  placeholder="请填写发票号码"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：">
                            <Input type="textarea" v-model="info.note"  placeholder=""></Input>
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
                    收票商品明细
                    <span style="font-weight:normal;float:right;">
                        <Button type="primary" @click="addGoods">添加商品</Button>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span prop="goodsAll">收票商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">收票商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney | toFiexedFour}}</em></span>
                        <span class="margin-left-20">收票商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllWS | toFiexedFour}}</em></span>
                        <span class="margin-left-20">收票商品总税额： <em style="color:#cf0012;font-style: normal;">{{ goodsAlltax | toFiexedFour}}</em></span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center"  @sort-change="manualSort" max-height="570">
                        <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" sortable="custom" fixed min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" fixed min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" fixed min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_price}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_cost_price" label="未税单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_cost_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="wait_invoice_num" label="待收票数量" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="num" label="本次收票数量" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.num" @on-change="sum();" @on-blur="vaild(scope.row.num, scope.row.buy_num, scope.row.invoice_num)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="stock_num" label="收票金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_price, scope.row.num, 4)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="stock_cost_num" label="未税金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_cost_price, scope.row.num, 4)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="let_stock_num" label="税额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ subtract(multiply(scope.row.buy_price, scope.row.num), multiply(scope.row.buy_cost_price, scope.row.num), 4)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="rel_order_no" label="来源单据编号" min-width="120">
                             <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.rel_order_no, 'purchase_manage_RK_detail')" type="text" size="small">  
                                <span>{{scope.row.rel_order_no}}</span>
                            </span>
                        </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_order_no" label="来源单据编号" min-width="120">
                             <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.buy_order_no, 'purchase_manage_HT_detail')" type="text" size="small">  
                                <span>{{scope.row.buy_order_no}}</span>
                            </span>
                        </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleted(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
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
                                    <Select v-model="formSearch.brand_no"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.buy_order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.ship_no" placeholder="请输入采购发货编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.instock_no" placeholder="请输入采购入库单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="formSearch.store_no"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in storeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.date' @on-change="date" style="width: 100%;"></DatePicker>
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
                                <span class="margin-left-20">待收票总金额： <em style="color:#cf0012;font-style: normal;">{{totalAmount}}</em></span>
                                <span class="margin-left-20">勾选待收票金额： <em style="color:#cf0012;font-style: normal;">{{priceToGet}}</em></span>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="goodsData" ref="multipleTable" border style="text-align: center" @sort-change="manualSortAdd" @selection-change="handleSelectionChange" max-height="570">
                            <el-table-column show-overflow-tooltip type="selection" width="55" :selectable="canSelect" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_no" label="采购入库单号" min-width="120">
                            <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.instock_no, 'purchase_manage_RK_detail')" type="text" size="small">  
                                <span>{{scope.row.instock_no}}</span>
                            </span>
                            </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_user" label="采购员" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="supplier_name" label="供应商" width="200"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" width="200" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" width="120" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="150" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="store_name" label="入库仓库 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="area_name" label="入库库区 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位 " width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购单价" prop="buy_price" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="ship_num" label="发货数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="wait_invoiced_num" label="待收票数量" min-width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_amount" label="入库金额" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_user" label="创建人"  width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单号" prop="buy_order_no" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.buy_order_no, 'purchase_manage_HT_detail')" type="text" size="small">  
                                <span>{{scope.row.buy_order_no}}</span>
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购发货单号" prop="rel_order_no" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.rel_order_no, 'purchase_manage_FH_detail')" type="text" size="small">  
                                <span>{{scope.row.rel_order_no}}</span>
                                </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
        </Modal>


    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiGetgenerateInvoice,apiaddSP,apiGetPurchaseSPGoods,operateAllBrandsList,allStoreInfos} from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_HT_toSPD',
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请输入实际发票金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到4位！'));
                } else {
                    callback();
                }
            };
            return {
                goodsData:[],
                info:{
                    buy_tax_rate: '',
                    invoice_type: '',
                    order_invoice_type: '',
                    invoice_no: '',
                    note: ''
                },
                htd_id: this.$route.query.param,
                from_order_no: this.$route.query.from_order_no,
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                storeArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                totalAmount:0.0000,
                datetime:'',
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                goodsAllWS: 0.0000,
                goodsAlltax: 0.0000,
                invoiceTypeStatusArr: [],
                invoiceTypeStatus: '',
                fplxStatus: '',
                goodsModal: false,
                orderData: {
                    title: [],
                    data: []
                },
                basicRules: {
                    invoice_no: [
                        { required: true, message: '发票号码不能空', trigger: 'blur' },
                    ],
                    invoice_time:[
                        { required: true, message: '实际开票日期不能为空', trigger: 'blur' }
                    ]
                },
                loadding: false,
                supplier_no:'',
                formSearch:{
                    brand_no:'all',
                    product_name:'',
                    buy_order_no:'',
                    ship_no:'',
                    product_order_no:'',
                    product_model:'',
                    instock_no:'',
                    store_no:'all',
                    date: '',
                },
                multipleSelection: [],
                goodsAddArr:[],
                priceToGet: 0.0000
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_invoice_type','fplx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.invoiceTypeStatus = res.data.buy_invoice_type;
                        this.fplxStatus = res.data.fplx;
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
            //获取到货仓库列表
            getAllStore () {
                allStoreInfos(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.storeArr.push(item);
                        });
                    }
                });
            },
            handleSelectionChange (val) {
                this.goodsData.forEach(item => {
                    item.checked = false;
                });
                this.multipleSelection = val;
                this.priceToGet = 0;
                val.forEach(item => {
                    item.checked = true;
                    this.priceToGet = this.add(this.priceToGet, item.priceToGet);
                });
                this.priceToGet = this.priceToGet.toFixed(4);
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.orderData.data) {
                    if (row.id === this.orderData.data[i].instock_id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    console.log(this.multipleSelection);
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].id);
                    }
                
                    let list = JSON.stringify({
                        order_invoice_type: 0,
                        from_order_no: 0,
                        instock_detail_id: this.goodsAddArr
                        });
                    apiGetgenerateInvoice(this,{
                        params: list
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goods = res.data.product_detail;
                            for (let i in this.goods) {
                                this.goods[i].num = this.goods[i].wait_invoice_num;
                                this.orderData.data.push(this.goods[i]);
                                this.sum();
                            }
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });

                }

            },
            date (time) {
                this.formSearch.date = time;
                this.search();
            },
            goodsCancel(){
                this.goodsModal = false;
            },
            search(){
                this.currentPage = 1;
                this.getGoods();
            },
            addGoods () {
                this.goodsModal = true;
                this.getGoods();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getGoods();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            getGoods(){
                apiGetPurchaseSPGoods(this, {
                    supplier_no:this.supplier_no,
                    order_invoice_type:0,
                    params: JSON.stringify(this.notempty({
                        brand_no:this.formSearch.brand_no == 'all' ? '' : this.formSearch.brand_no,
                        product_name:this.formSearch.product_name,
                        buy_order_no:this.formSearch.buy_order_no,
                        ship_no:this.formSearch.ship_no,
                        product_order_no:this.formSearch.product_order_no,
                        product_model:this.formSearch.product_model,
                        instock_no:this.formSearch.instock_no,
                        store_no:this.formSearch.store_no == 'all' ? '' : this.formSearch.store_no,
                        starttime: this.formSearch.date[0],
                        endtime: this.formSearch.date[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.checked = false;
                            item.priceToGet = this.multiply(item.wait_invoiced_num, item.buy_price, 4);
                        });
                        this.goodsData = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.totalAmount = res.data.total_amount;
                    }
                });
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            deleted (index) {
                this.orderData.data.splice(index,1);
                this.sum();
            },
            vaild(num,buy_num,invoice_num){
                let uninvoice = buy_num - invoice_num;
                if(uninvoice < num){
                    this.$Message.error("本次收票数量不能大于未收票数量");
                }
            },
            changeDate(time){
                this.info.invoice_time = time;
            },
            getData () {
                //基本信息
               apiGetgenerateInvoice(this, {
                   params: this.htd_id
               }).then(res => {
                   if (res && res.status == 1){
                    this.info.buy_tax_rate = res.data.buy_tax_rate;
                    this.info.invoice_type = res.data.invoice_type;
                    this.info.order_invoice_type = res.data.order_invoice_type;
                    this.supplier_no = res.data.supplier_no;
                    res.data.product_detail.forEach(item => {
                         item.num = item.wait_invoice_num;
                    });
                    this.orderData.data = res.data.product_detail;
                    this.sum();
                   } else {
                       this.$Message.error(res.message);
                   }
               });
            },
            save(){
                this.$refs.info.validate((valid) => {
                // let invoice_detail = [];
                    let tmp =[];
                        for(let i in this.orderData.data){
                            tmp.push({
                                    order_detail_id: this.orderData.data[i].id, 
                                    num: this.orderData.data[i].num,
                                    instock_num: this.orderData.data[i].instock_num,
                                    buy_order_no: this.orderData.data[i].buy_order_no,
                                    instock_id: this.orderData.data[i].instock_id
                                });
                        }
                        this.loadding = true;
                       apiaddSP(this, {
                            params: JSON.stringify(this.notempty({
                                order_invoice_type: this.info.order_invoice_type,
                                buy_tax_rate: this.info.buy_tax_rate,
                                invoice_type: this.info.invoice_type,
                                invoice_no: this.info.invoice_no,
                                note: this.info.note,
                                from_order_no: this.from_order_no,
                                invoice_time: this.info.invoice_time,
                                invoice_detail: tmp
                                
                            }))
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                this.$Message.success(res.message);
                                this.loadding = false;
                                closeCurrentPage(this);
                                util.openNewPage(this, 'purchase_manage_SP_detail', {
                                    param: res.data.order_invoice_no,
                                    type: res.data.order_invoice_type,
                                    fromAdd: '1'
                                });
                                this.$router.push({  
                                    name: 'purchase_manage_SP_detail',
                                    query: {
                                        param: res.data.order_invoice_no,
                                        type: res.data.order_invoice_type,
                                        fromAdd: '1'
                                    }
                                });
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        });
                });
            },
            sum(){
                this.goodsAll = 0;
                this.goodsAllMoney = 0.0000;
                this.goodsAllWS = 0.0000;
                this.goodsAlltax = 0.0000;
                this.orderData.data.forEach(item => {
                        this.goodsAll = parseInt(this.goodsAll) + parseInt(item.num);
                        this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(item.buy_price, item.num), 4);
                        this.goodsAllWS = this.add(this.goodsAllWS, this.multiply(item.buy_cost_price, item.num), 4);
                        this.goodsAlltax = this.subtract(this.goodsAllMoney, this.goodsAllWS, 4);
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.orderData.data.sort(sortBy(column.prop, isDec));
            },
        
            manualSortAdd (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.search();
            },
            backTo () {
                history.go(-1);
            },
            reset(){
                this.formSearch.brand_no = 'all';
                this.formSearch.product_name = '';
                this.formSearch.buy_order_no = '';
                this.formSearch.ship_no = '';
                this.formSearch. product_order_no = '';
                this.formSearch.product_model = '';
                this.formSearch.instock_no = '';
                this.formSearch.store_no = 'all';
                this.formSearch.date = '';
                this.orderField = '';             //排序字段
                this.orderDirection = 'desc'; 
                this.search();
            }
        },
        
        created () {
            this.getStatus();
            this.getData();
            this.getAllStore();
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
