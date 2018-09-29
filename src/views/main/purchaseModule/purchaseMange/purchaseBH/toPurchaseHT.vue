<style>
    .bulktext textarea{height:120px !important;}
    #buy_toHT .ivu-modal-footer {
        display:none;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="150" ref="basicForm" :model="form" :rules="basicRules">
                    <Row>
                        <Col span="8">
                        <FormItem label="供应商：" style="margin:0;" prop="applyer">
                            {{form.applyer}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{form.gyslxr}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系方式：" style="margin:0;">
                             {{form.sjhm}}
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="发票类型：" style="margin:0;" prop="invoice_type">
                            <Select v-model="form.invoice_type"  placeholder="请选择发票类型">
                                <Option v-for="status in fpType" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="税率：" style="margin:0;" prop="tax">
                            <Select v-model="form.tax"  placeholder="请选择税率" @on-change="taxChange">
                                <Option v-for="status in tax" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="到货仓库：" style="margin:0;" prop="stock" >
                            <Select v-model="form.stock"  placeholder="请选择到货仓库" @on-change="chooseStock" :disabled="isDis" filterable>
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="form.state" style="width:620px;" placeholder="请输入"></Input>
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
                    合同信息
                </p>
                <Form :label-width="120" ref="htForm" :model="htInfo">
                    <Row>
                        <Col span="6">
                        <FormItem label="纸质合同编号：" style="margin:0;">
                            <Input v-model="htInfo.htId"  placeholder="请选择纸质合同编号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="纸质合同：" style="margin:0;" >
                            <Upload :action="htInfo.uploadUrl"
                                    :format="['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'rar', 'xls', 'xlsx']"
                                    :on-format-error="handleFormatError"
                                    :on-success="handleSuccess"
                                    :show-upload-list="false" :max-size="10240" :on-exceeded-size="handleMaxSize" style="display: block;width:100%;">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                            </Upload>
                            <!--<div v-if="htInfo.url" style="width:100%;" @click="download">附件</div>-->
                            <a v-if="htInfo.url" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.url" target="_blank">
                                <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件: {{htInfo.name}}
                            </a>
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
                        <span>采购商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">采购商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                        <span class="margin-left-20">采购商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllWS }}</em></span>
                        <span class="margin-left-20">采购商品总税额： <em style="color:#cf0012;font-style: normal;">{{ goodsAlltax }}</em></span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort" max-height="570">
                        <el-table-column type="index" label="行号" fixed></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" fixed show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" fixed min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" fixed min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" width="120" sortable="custom" fixed show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="product_origin_price" label="产品面价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.product_origin_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_price" label="申请单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.requisition_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_num" label="申请数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="flag_discount" label="参考折扣" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span>
                                    <span v-show='scope.row.discount_min != 0'>{{ scope.row.discount_min }}</span>
                                    <span v-show='scope.row.discount_min != 0 && scope.row.discount_max != 0'>-</span>
                                    <span v-show='scope.row.discount_max != 0'>{{ scope.row.discount_max }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="now_discount" label="采购折扣" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.now_discount" @on-change="scope.row.buy_price = multiply(scope.row.now_discount, scope.row.product_origin_price, 4); scope.row.cgje = multiply(scope.row.buy_price, scope.row.buy_num, 4);scope.row.wsje= multiply(divide(scope.row.buy_price, taxRate, 4), scope.row.buy_num, 4);scope.row.tax_amount = subtract(scope.row.cgje, scope.row.wsje, 4);getCount(); " @on-blur="zkChange(scope.row.now_discount, scope.$index)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.buy_price" @on-change="scope.row.now_discount = divide(scope.row.buy_price, scope.row.product_origin_price, 3);scope.row.cgje = multiply(scope.row.buy_price, scope.row.buy_num, 4);scope.row.wsje=multiply(divide(scope.row.buy_price, taxRate, 4), scope.row.buy_num, 4);scope.row.tax_amount=subtract(scope.row.cgje, scope.row.wsje, 4);getCount();" @on-blur="djChange(scope.row.buy_price, scope.$index)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_cost_price" label="未税单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ divide(scope.row.buy_price, taxRate, 4) }}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="buyed_num" label="已采购数量" sortable="custom" min-width="100"></el-table-column> -->
                        <el-table-column prop="buy_num" label="采购数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.buy_num" @on-change="changeNumNew(scope,scope.$index)" @on-blur="cgNum(scope.row.requisition_num, scope.row.buyed_num, scope.row.buy_num, scope.$index)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cgje" label="采购金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.cgje | toDecimal  }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="wsje" label="未税金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.wsje | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tax_amount" label="税额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.tax_amount | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product_leadtime" label="采购货期(天)" width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.product_leadtime" @on-change="expectLeadtime(scope.row)"></Input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="expect_leadtime" label="预计到货日期" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.expect_leadtime}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.note"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_no" label="来源单据编号" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.requisition_no }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;"  @click="deleteRow(scope.$index, actTable.data)">删除</span>
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
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
        <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT" class-name="modal-no-absoute">
            <h3 slot="header">添加商品</h3>
            <div>
                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="addForm" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                <Select v-model="addForm.brand"  placeholder="请选择" @on-change="search">
                                    <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.name" placeholder="输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.type"  placeholder="请选择" @on-change="search">
                                    <Option v-for="status in FromTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.order" placeholder="输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.model" placeholder="输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.from_djbh" placeholder="输入来源单据编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <DatePicker type="datetimerange" placeholder="选择创建时间" :value='addForm.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.buyer"  placeholder="请选择" filterable @on-change="search">
                                    <Option v-for="status in buyerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.creater" placeholder="输入创建人" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.sell_order_no" placeholder="输入销售合同单号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.rel_order_type" placeholder="选择" @on-change="search">
                                    <Option v-for="status in relOrderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
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
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="ToHTD">确定</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort2"  max-height="570"  @selection-change="handleSelectionChange">
                            <el-table-column
                                    type="selection"
                                    width="55" :selectable="canSelect" fixed>
                            </el-table-column>
                            <el-table-column prop="brand_name" label="品牌" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位" ></el-table-column>
                            <el-table-column label="产品面价" sortable="custom" width="120">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.product_origin_price | toDecimal }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="requisition_num" label="申请数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column prop="requisition_price" label="申请单价" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column prop="buyed_num" label="已采购数量" sortable="custom" min-width="120"></el-table-column>
                            <el-table-column prop="ready_buy_num" label="待采购数量" sortable="custom" min-width="120"></el-table-column>
                            <el-table-column prop="supplier_stock" label="供应商库存" min-width="120"></el-table-column>
                            <el-table-column prop="supplier_price" label="供应商价格" min-width="120"></el-table-column>
                            <el-table-column prop="order_type" label="来源类型" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ fromType[scope.row.order_type] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源单据编号"  min-width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.requisition_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="货期 " width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.product_leadtime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="now_note" label="采购备注" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="note" label="客服备注" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="create_time" label="创建时间" sortable="custom" min-width="150"></el-table-column>
                            <el-table-column label="创建人" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购员" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.buy_user_no }}<span v-show="scope.row.buy_user_no !=''">/</span>{{ scope.row.buy_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号"  min-width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.sell_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rel_order_type" label="销售合同单单据类型" min-width="150">
                                <template slot-scope="scope">
                                    <span> {{relOrderStatus[scope.row.rel_order_type]}}</span>
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


        <!--采购单价过高弹窗-->
        <Modal v-model="showOver" title="采购单价过高商品" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="overgoods" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange"  max-height="570">
                    <el-table-column label="订货号" min-width="120" prop="product_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column label="产品型号" min-width="120" prop="product_model" show-overflow-tooltip></el-table-column>
                    <el-table-column label="申请单价" min-width="120" prop="requisition_price" show-overflow-tooltip></el-table-column>
                    <el-table-column label="采购单价" min-width="120" prop="buy_price" show-overflow-tooltip></el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="default"  @click="cancel">取消</Button>
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseReadybuydetail, apiGetPurchaseSupplierList, apiMapDetail, apiGetCommonStockList, apiGetPurchaseReadybuyList, operateAllBrandsList, apiGetPurchaseHtAdd, allpersonInfos } from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                form: {
                    applyer: '',
                    lxr: '',
                    sjhm: '',
                    invoice_type: '',
                    tax: '16%',
                    isZf: '0',
                    stock: '',
                    goods_lxr: '',
                    goods_sjhm: '',
                    addressVal: [],
                    addressData: [],
                    goods_address: '',
                    state: ''
                },
                addressValue: [],
                addressLable: [],
                htInfo: {
                    htId: '',
                    url: '',
                    name: '',
                    uploadUrl: this.baseUrl + '/v1/order/buy/main/upload-attach?token=' + setToken()
                },
                ids: this.$route.query.ids,
                discountChoosed: this.$route.query.discountChoosed,
                actTable: {
                    data: [
                        {
                            cpdhh: '1239'
                        }
                    ]
                },
                orderField: 'djrq',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: '0',
                goodsAllMoney: '0',
                goodsAllWS: '0',
                goodsAlltax: '0',
                bulktext: '',
                supperAll: [],
                supperList: [],
                fpType: [],
                tax: [
                    {
                        label: '16%',
                        value: '16%'
                    }
                ],
                is_zf: [],
                defaultStore: {},
                verticalStore: {},
                taxChoosed: '',
                taxRate: parseFloat(1.16).toFixed(2),
                basicRules: {
                    applyer: [
                        { required: true, message: '请选择供应商', trigger: 'on-change' }
                    ],
                    invoice_type: [
                        { required: true, message: '请选择发票类型', trigger: 'on-change' }
                    ],
                    tax: [
                        { required: true, message: '请选择税率', trigger: 'on-change' }
                    ],
                    stock: [
                        { required: true, message: '请选择到货仓库', trigger: 'on-change' }
                    ]
                },
                stockList: [],
                stockArr: [],
                isDis: false,
                goodsModal: false,
                addForm: {
                    applyer: '',
                    type: 'all',
                    dj_status: '',
                    fk_status: '',
                    htd_bh: '',
                    stock: '',
                    state: '',
                    from_djbh: '',
                    brand: 'all',
                    name: '',
                    fhd_no: '',
                    order: '',
                    model: '',
                    datetime: '',
                    buyer: 'all',
                    creater: '',
                    sell_order_no:'',
                    rel_order_type: 'all',
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                brandArr: [
                    {
                        value: 'all',
                        label: '选择品牌'
                    }
                ],
                fromType: ['其他'],
                FromTypeArr: [
                    {
                        label: '选择来源类型',
                        value: 'all'
                    }
                ],
                goodsAddArr: [],
                buyerArr: [
                    {
                        label: '选择采购员',
                        value: 'all'
                    }
                ],
                goodsNewArr:[],
                buyerList: [],
                loadding: false,
                overgoods:[],
                showOver:false,
                relOrderStatus: '',
                relOrderStatusArr: [
                    {
                        label: '选择销售合同单单据类型',
                        value: 'all'
                    }
                ],

            };
        },
        components: {
            pagination
        },
        methods: {
            confirmTranslate(){
                this.saveHT(this.goodsNewArr);
            },
            cancel(){
              this.showOver = false;
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx', 'is_my', 'buy_order_from','sell_rel_order_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        for (let key in res.data.fplx) {
                            if (res.data.fplx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fplx[key]
                                };
                                this.fpType.push(tmpObj);
                            }
                        }
                        this.form.invoice_type = this.fpType[0].value;
                        for (let key in res.data.is_my) {
                            if (res.data.is_my.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_my[key]
                                };
                                this.is_zf.push(tmpObj);
                            }
                        }
                        /*来源类型*/
                        for (let i in res.data.buy_order_from) {
                            this.fromType.push(res.data.buy_order_from[i]);
                        }
                        for (let key in res.data.buy_order_from) {
                            if (res.data.buy_order_from.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_from[key]
                                };
                                this.FromTypeArr.push(tmpObj);
                            }
                        }
                        this.relOrderStatus = res.data.sell_rel_order_type;
                        for (let key in res.data.sell_rel_order_type) {
                            if (res.data.sell_rel_order_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_rel_order_type[key]
                                };
                                this.relOrderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetPurchaseSupplierList(this, {
                    params: JSON.stringify({
                        all: 'all',
                        shzt: '1'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.supperAll = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });
                        for (let i in this.supperAll) {
                            if (this.$route.query.supplier_no === this.supperAll[i].gysbh) {
                                this.form.applyer = this.supperAll[i].gysmc;
                                this.form.gyslxr = this.supperAll[i].lxr;
                                this.form.sjhm = this.supperAll[i].sjhm;
                            }
                        }
                    }
                });
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.stockList = res.data.list;
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
                apiMapDetail(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.form.addressData = res.data;
                    }
                });
                allpersonInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.buyerList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.user_no;
                            item.label = item.user_name;
                            this.buyerArr.push(item);
                        });
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
            changeNumNew(scope,index) {
                scope.row.cgje = this.multiply(scope.row.buy_price, scope.row.buy_num);
                scope.row.wsje = this.multiply(this.divide(scope.row.buy_price, this.taxRate, 4), scope.row.buy_num, 4);
                scope.row.tax_amount = this.subtract(scope.row.cgje, scope.row.wsje, 4);
                this.actTable.data.splice(index, 1, scope.row);
                this.getCount();
            },
            getData () {
                //基本信息
                apiGetPurchaseReadybuydetail(this, {
                    ids: JSON.stringify(this.ids),
                    supplier_no: this.$route.query.supplier_no
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i in res.data.list) {
                            //备货单
                            if (res.data.list[i].order_type == '1') {
                                res.data.list[i].buy_price = res.data.list[i].requisition_price;
                                res.data.list[i].now_discount = this.divide(res.data.list[i].requisition_price, res.data.list[i].product_origin_price, 3);
                            }

                            //请购单
                            if (res.data.list[i].order_type == '2') {
                                if (res.data.list[i].supplier_price == '0') {
                                    res.data.list[i].buy_price = res.data.list[i].product_origin_price;
                                    res.data.list[i].now_discount = 1;
                                }else{
                                    res.data.list[i].buy_price = res.data.list[i].supplier_price;
                                    res.data.list[i].now_discount = this.divide(res.data.list[i].buy_price, res.data.list[i].product_origin_price, 3);
                                }
                            }

                            res.data.list[i].buy_num = this.subtract(res.data.list[i].requisition_num, res.data.list[i].buyed_num);
                            res.data.list[i].cgje = this.multiply(res.data.list[i].buy_price,  res.data.list[i].buy_num, 4);
                            res.data.list[i].wsje = this.multiply(this.divide(res.data.list[i].buy_price, this.taxRate, 4), res.data.list[i].buy_num, 4);
                            res.data.list[i].tax_amount = this.subtract(res.data.list[i].cgje, res.data.list[i].wsje, 4);

                            let startDate = new Date();
                            startDate = +startDate + 1000*60*60*24;
                            startDate = new Date(startDate);
                            let month = (startDate.getMonth()+1) > 9 ? (startDate.getMonth()+1) : '0' + (startDate.getMonth()+1);
                            let date = startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate();

                            res.data.list[i].expect_leadtime= startDate.getFullYear()+"-"+month+"-"+date;


                        }
                        this.actTable.data = res.data.list;
                        this.getCount();
                        this.defaultStore = res.data.default_arrive_store;
                        this.verticalStore = res.data.virtual_store;
                        for (let i in this.stockList) {
                            if (this.defaultStore.ckbh == this.stockList[i].ckbh) {
                                this.form.stock = this.defaultStore.ckbh;
                                this.form.goods_lxr = this.defaultStore.ckfzr;
                                this.form.goods_sjhm = this.defaultStore.sjhm;
                            } else {
                                this.form.stock = '';
                                this.form.goods_lxr = '';
                                this.form.goods_sjhm = '';
                            }
                        }
                    }
                });
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable.data) {
                    if (row.id === this.actTable.data[i].from_order_detail_id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                let allWS = 0;
                let allTax = 0;
                for (let i in this.actTable.data) {
                    allNum = this.add(allNum, this.actTable.data[i].buy_num);
                    allAmount = this.add(allAmount, this.actTable.data[i].cgje, 4);
                    allWS = this.add(allWS, this.actTable.data[i].wsje, 4);
                    allTax = this.add(allTax, this.actTable.data[i].tax_amount, 4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
                this.goodsAllWS = allWS;
                this.goodsAlltax =allTax;
            },
            /*供应商选择*/
            gysChoose (val) {
                for (let i in this.supperAll) {
                    if (this.supperAll[i].gysbh === val) {
                        this.form.gyslxr = this.supperAll[i].lxr;
                        this.form.sjhm = this.supperAll[i].sjhm;
                    }
                }
            },
            expectLeadtime(row){

                if(row.product_leadtime === ''){
                    row.expect_leadtime = '';
                }
                else{
                    let startDate = new Date();
                    startDate = +startDate + 1000*60*60*24*row.product_leadtime;
                    startDate = new Date(startDate);
                    let month = (startDate.getMonth()+1) > 9 ? (startDate.getMonth()+1) : '0' + (startDate.getMonth()+1);
                    let date = startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate();

                    row.expect_leadtime = startDate.getFullYear()+"-"+month+"-"+date;
                }

            },
            /*保存*/
            save () {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.overgoods = [];
                        this.goodsNewArr = [];
                        var reg3 = /^\d+\.?(\d{1,3})?$/;
                        var reg4 = /^\d+\.?(\d{1,4})?$/;
                        for (let i in this.actTable.data) {
                            let n = parseInt(i) + parseInt(1);
                            if (!this.actTable.data[i].now_discount || this.actTable.data[i].now_discount === '') {
                                this.$Message.error('第' + n + '行的采购折扣不能为空');
                                return false;
                            } else if (this.multiply(this.actTable.data[i].now_discount, 1000) <= parseInt(0)) {
                                this.$Message.error('第' + n + '行的采购折扣不能为0');
                                return false;
                            } else if (!reg3.test(this.actTable.data[i].now_discount)) {
                                this.$Message.error('第' + n + '行的采购折扣最多保留到小数后三位');
                                return false;
                            } else if (this.multiply(this.actTable.data[i].now_discount, 1000) > 10000) {
                                this.$Message.error('第' + n + '行的采购折扣不能大于10');
                                return false;
                            } else if (!this.actTable.data[i].buy_price || this.actTable.data[i].buy_price === '') {
                                this.$Message.error('第' + n + '行的采购单价不能为空');
                                return false;
                            } else if (!reg4.test(this.actTable.data[i].buy_price)) {
                                this.$Message.error('第' + n + '行的采购单价最多保留到小数后四位');
                                return false;
                            } else if (!this.actTable.data[i].buy_num || this.actTable.data[i].buy_num === '') {
                                this.$Message.error('第' + n + '行的采购数量不能为空');
                                return false;
                            } else if (parseInt(this.actTable.data[i].buy_num) <= parseInt(0) || parseInt(this.actTable.data[i].buy_num) > (this.subtract(this.actTable.data[i].requisition_num, this.actTable.data[i].buyed_num))) {
                                this.$Message.error('第' + n + '行的采购数量不能小于等于0，且不能大于申请数量和已采购适量之差');
                                return false;
                            } else if (!this.actTable.data[i].product_leadtime || this.actTable.data[i].product_leadtime === '') {
                                this.$Message.error('第' + n + '行的采购货期不能为空');
                                return false;
                            }else {
                                this.goodsNewArr.push({
                                    from_order_detail_id: this.actTable.data[i].from_order_detail_id,
                                    buy_num: this.actTable.data[i].buy_num,
                                    product_discount: this.actTable.data[i].now_discount,
                                    buy_price: this.actTable.data[i].buy_price,
                                    buy_leadtime: this.actTable.data[i].product_leadtime,
                                    note: this.actTable.data[i].note
                                });
                            }
                            if(+(this.multiply(this.actTable.data[i].requisition_price, 0.97, 4)) < this.actTable.data[i].buy_price){
                                this.overgoods.push({
                                    product_order_no:this.actTable.data[i].product_order_no,
                                    product_model:this.actTable.data[i].product_model,
                                    requisition_price:this.actTable.data[i].requisition_price,
                                    buy_price:this.actTable.data[i].buy_price,
                                })
                            }
                        }


                        if(this.overgoods.length != 0){
                            this.showOver = true;
                        }else if (this.goodsNewArr.length != 0) {
                            this.saveHT(this.goodsNewArr);
                        } else {
                            this.$Message.error('请添加商品');
                        }
                    }
                });
            },
            saveHT(goodsNew){
                this.loadding = true;
                apiGetPurchaseHtAdd(this, {
                    params: JSON.stringify(this.notempty({
                        supplier_no: this.$route.query.supplier_no,
                        buy_tax_rate: this.divide(parseInt(this.form.tax), 100),
                        is_direct: this.form.isZf,
                        store_no: this.form.stock,
                        receive_name: this.form.goods_lxr,
                        receive_phone: this.form.goods_sjhm,
                        province_no: this.addressValue[0],
                        province_name: this.addressLable[0],
                        city_no: this.addressValue[1],
                        city_name: this.addressLable[1],
                        district_no: this.addressValue[2],
                        district_name: this.addressLable[2],
                        receive_address: this.form.goods_address,
                        note: this.form.state,
                        order_attach_no: this.htInfo.htId,
                        order_attach: this.htInfo.url
                    })),
                    detail: JSON.stringify(goodsNew)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.loadding = false;
                        this.$Message.success('操作成功');
                        closeCurrentPage(this);
                        this.handleClick({param: res.data.data.order_info.buy_order_no, fromAdd: '1'}, 'purchase_manage_HT_detail');
                    } else {
                        this.loadding = false;
                        this.$Message.error(res.message);
                    }
                });
            },
            /*是否直发*/
            isZf (val) {
                if (val == 0) {
                    this.isDis = false;
                    this.stockArr = [];
                    this.stockList.forEach(item => {
                        item.value = item.ckbh;
                        item.label = item.ckmc;
                        this.stockArr.push(item);
                    });
                    this.form.stock = this.defaultStore.ckbh;
                    this.form.goods_lxr = this.defaultStore.ckfzr;
                    this.form.goods_sjhm = this.defaultStore.sjhm;
                } else {
                    this.stockArr = [{
                        value: '888',
                        label: '虚拟仓库'
                    }];
                    this.form.stock = '888';
                    this.form.goods_lxr = '';
                    this.form.goods_sjhm = '';
                    this.isDis = true;
                }
            },
            /*选择到货仓库*/
            chooseStock (val) {
                for (let i in this.stockList) {
                    if (this.stockList[i].ckbh === val) {
                        this.form.goods_lxr = this.stockList[i].ckfzr;
                        this.form.goods_sjhm = this.stockList[i].sjhm;
                        break;
                    } else {
                        return false;
                    }
                }
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                    }
                });
            },
            addrChoose (val, cot) {
                if (cot.length == 2) {
                    this.addressValue = [cot[0].value, cot[1].value, ''];
                    this.addressLable = [cot[0].label, cot[1].label, ''];
                } else {
                    this.addressValue = [cot[0].value, cot[1].value, cot[2].value];
                    this.addressLable = [cot[0].label, cot[1].label, cot[2].label];
                }
            },
            /*添加商品*/
            getGoods () {
                apiGetPurchaseReadybuyList(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.addForm.brand == 'all' ? '' : this.addForm.brand,
                        product_order_no: this.addForm.order,
                        product_model: this.addForm.model,
                        requisition_no: this.addForm.from_djbh,
                        product_name: this.addForm.name,
                        date_from: this.addForm.datetime[0],
                        date_to: this.addForm.datetime[1],
                        create_user: this.addForm.creater,
                        sell_order_no:this.addForm.sell_order_no,
                        buy_user_no: this.addForm.buyer == 'all' ? '' : this.addForm.buyer,
                        order_type: this.addForm.type == 'all' ? '' : this.addForm.type,
                        supplier_no: this.$route.query.supplier_no,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        rel_order_type: this.addForm.rel_order_type == 'all' ? '' : this.addForm.rel_order_type,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            // item.buy_leadtime = 1;
                            item.expect_leadtime = '';
                        });
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            addGoods () {
                this.goodsModal = true;
                this.getGoods();
            },
            goodsCancel () {
                this.goodsModal = false;
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            ToHTD () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    this.goodsAddArr = [];

                    for (let i in this.multipleSelection) {

                        //备货单
                        if (this.multipleSelection[i].order_type == '1') {
                            this.multipleSelection[i].buy_price = this.multipleSelection[i].requisition_price;
                            this.multipleSelection[i].now_discount = this.divide(this.multipleSelection[i].requisition_price, this.multipleSelection[i].product_origin_price, 3);
                        }

                        //请购单
                        if (this.multipleSelection[i].order_type == '2') {
                            if (this.multipleSelection[i].supplier_price == '0') {
                                this.multipleSelection[i].buy_price = this.multipleSelection[i].product_origin_price;
                            }else{
                                this.multipleSelection[i].buy_price = this.multipleSelection[i].supplier_price;
                                this.multipleSelection[i].now_discount = this.divide(this.multipleSelection[i].supplier_price, this.multipleSelection[i].product_origin_price, 3);
                            }
                        }

                        this.multipleSelection[i].id = 0;
                        this.multipleSelection[i].buy_num = this.subtract(this.multipleSelection[i].requisition_num, this.multipleSelection[i].buyed_num);
                        this.multipleSelection[i].cgje = this.multiply(this.multipleSelection[i].buy_price, this.multipleSelection[i].buy_num, 4);
                        this.multipleSelection[i].wsje = this.multiply(this.divide(this.multipleSelection[i].buy_price, this.taxRate, 4), this.multipleSelection[i].buy_num, 4)
                        this.multipleSelection[i].tax_amount = this.subtract(this.multipleSelection[i].cgje, this.multipleSelection[i].wsje, 4);

                        let startDate = new Date();
                        startDate = +startDate + 1000*60*60*24;
                        startDate = new Date(startDate);
                        let month = (startDate.getMonth()+1) > 9 ? (startDate.getMonth()+1) : '0' + (startDate.getMonth()+1);
                        let date = startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate();

                        this.multipleSelection[i].expect_leadtime= startDate.getFullYear()+"-"+month+"-"+date;

                        this.goodsAddArr.push(this.multipleSelection[i]);
                    }
                    for (let i in this.goodsAddArr) {
                        this.actTable.data.push(this.goodsAddArr[i]);
                    }
                    this.getCount();
                    this.goodsModal = false;
                }
            },
            /*税率选择*/
            taxChange (val) {
                this.taxChoosed = val;
                this.taxRate = this.divide(this.add(100, val), 100, 2);
            },
            handleFormatError (file) {
                console.log(file);
                this.$Notice.warning({
                    title: '文件：' + file.name + ' 格式不正确',
                    desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.error({
                    title: '文件：' + file.name + ' 上传失败',
                    desc: '文件' + file.name + '不能超过10M'
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                        this.htInfo.url = response.data;
                        this.htInfo.name = file.name;
                        this.$Notice.success({
                            title: '文件上传成功',
                            desc: '文件 ' + file.name + ' 上传成功。'
                        });
                    } else {
                        this.$Notice.error({
                            title: '文件：' + file.name + ' 上传失败',
                            desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                        });
                }
            },
            zkChange (zk, index) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                let n = parseInt(index) + parseInt(1);
                if (!zk || zk === '') {
                    this.$Message.error('第' + n + '行的备货折扣不能为空');
                } else if (this.multiply(zk, 1000) > 10000) {
                    this.$Message.error('第' + n + '行的备货折扣不能大于10');
                } else if (!reg.test(zk)) {
//                    zk = (+zk).toFixed(4);
                    this.$Message.error('第' + n + '行 的采购折扣小数点最多为3位');
                }
            },
            djChange (dj, index) {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (!reg.test(dj)) {
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购单价小数点最多为4位');
//                    dj = (+dj).toFixed(4);
//                    return dj;
                }
            },
            cgNum (n, m, f, index) {
                var sub = parseInt(n) - parseInt(m);
                if (parseInt(f) <= 0) {
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购数量必须大于0');
                } else if (parseInt(f) > parseInt(sub)) {
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购数量必须小于申请数量和待采购数量之差');
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            manualSort2 (column) {
                let isDec = column.order == "descending" ? true : false;
                this.orderData.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            search () {
                this.currentPage = 1;
                this.getGoods();
            },
            reset () {
                this.addForm.brand = 'all';
                this.addForm.name = '';
                this.addForm.order = '';
                this.addForm.model = '';
                this.addForm.from_djbh = '';
                this.addForm.type = 'all';
                this.addForm.creater = '';
                this.addForm.buyer = 'all';
                this.addForm.sell_order_no = '',
                this.addForm.datetime = [];
                this.search();
            },
            datetime (time) {
                this.addForm.datetime = time;
                this.search();
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
            backTo () {
                history.go(-1);
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
