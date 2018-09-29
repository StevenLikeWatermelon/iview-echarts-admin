<style>
    .make-invoice .radio-span {
        margin-left: 10px;
    }
    .make-invoice .ivu-radio-group-vertical .ivu-radio-wrapper {
        padding-left: 10px;
        padding-right: 10px;
    }
    .make-invoice .ivu-select-single .ivu-select-selection {
        height: 30px;
    }
    .background-radio {
        background: rgba(102, 102, 102, 0.1);
    }
</style>
<template>
    <div class="make-invoice">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>                
                <Form ref="invoiceInfo" :model="invoiceInfo" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                            <FormItem label="发票类型：">
                                {{ invoiceType[currentType] }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="发票抬头：" prop="invoice_title_id">
                                <Select v-model="invoiceInfo.invoice_title_id" @on-change="getInvoiceDetail">
                                    <Option v-for="status in allInvoiceTitle" :value="status.id" :key="status.id">{{ status.fptt }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="纳税人识别码：">
                                {{ invoiceInfo.swdjzh }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="注册地址：">
                                {{ invoiceInfo.kpdz }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="注册电话：">
                                {{ invoiceInfo.kpdhhm }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="开户银行：">
                                {{ invoiceInfo.jbkhyhmc }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="银行账号：">
                                {{ invoiceInfo.jbkhzh }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="销售人员：">
                                {{ invoiceInfo.ygxm }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="销售部门：">
                                {{ invoiceInfo.bmmc }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="客服人员：">
                                {{ invoiceInfo.czyg }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="客服部门：">
                                {{ invoiceInfo.czygbm }}
                            </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="note"></Input>
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
                    <span>收票地址</span>
                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left:100px;" v-if="!expandAddress" @click.stop="expandAddressList"><Icon type="plus-round"></Icon>展开收票地址</span>
                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left:100px;" v-if="expandAddress" @click.stop="minAddressList"><Icon type="minus-round"></Icon>收起收票地址</span>
                </p>
                <div slot="extra" @click="showAddModal">
                    <span style="color: rgb(45, 140, 240);cursor: pointer">新增收票地址</span>
                </div>
                <div v-show="addressList.length > 0 && expandAddress">
                    <RadioGroup v-model="checkedRadio" vertical>
                        <Radio v-for="item in addressList" :label="item.id" :class="{'background-radio': item.id == checkedRadio}">
                            <span class="radio-span" style="display: inline-block;width:200px;overflow:visible">{{item.shrxm}}</span>
                            <div style="display: inline-block;width:600px;overflow:visible">
                                <span class="radio-span">{{item.shsfmc}}</span>
                                <span class="radio-span">{{item.shcsmc}}</span>
                                <span class="radio-span">{{item.shxqmc}}</span>
                                <span class="radio-span">{{item.shxxdz}}</span>
                            </div>
                            <div style="display: inline-block;width:300px;overflow:visible">
                                <span class="radio-span">{{item.shrdhhm}}</span>
                            </div>
                            <div style="display: inline-block;width:200px;overflow:visible" v-show="item.sfmr == '0'">
                                <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="setDefault(item.id)">设为默认地址</span>
                            </div>
                            <div style="display: inline-block;width:200px;overflow:visible" v-show="item.sfmr == '1'">
                                <span class="radio-span">默认地址</span>
                            </div>
                            <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="editAddress(item)">修改</span>
                            <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="deleteAddress(item.id)">删除</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <div v-show="addressList.length > 0 && !expandAddress">
                     <RadioGroup v-model="checkedRadio" vertical>
                        <Radio v-for="item in OneAddressList" :label="item.id" :class="{'background-radio': item.id == checkedRadio}">
                            <span class="radio-span" style="display: inline-block;width:200px;overflow:visible">{{item.shrxm}}</span>
                            <div style="display: inline-block;width:600px;overflow:visible">
                                <span class="radio-span">{{item.shsfmc}}</span>
                                <span class="radio-span">{{item.shcsmc}}</span>
                                <span class="radio-span">{{item.shxqmc}}</span>
                                <span class="radio-span">{{item.shxxdz}}</span>
                            </div>
                            <div style="display: inline-block;width:300px;overflow:visible">
                                <span class="radio-span">{{item.shrdhhm}}</span>
                            </div>
                            <div style="display: inline-block;width:200px;overflow:visible" v-show="item.sfmr == '0'">
                                <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="setDefault(item.id)">设为默认地址</span>
                            </div>
                            <div style="display: inline-block;width:200px;overflow:visible" v-show="item.sfmr == '1'">
                                <span class="radio-span">默认地址</span>
                            </div>
                            <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="editAddress(item)">修改</span>
                            <span class="radio-span" style="color: rgb(45, 140, 240);cursor: pointer" @click.stop="deleteAddress(item.id)">删除</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <div style="width:100%;text-align:center" v-show="addressList.length <= 0">
                    <span>暂无数据</span>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        待开票商品明细
                    </p>
                    <div slot="extra" @click="addNewGood">
                        <span style="color: rgb(45, 140, 240);cursor: pointer">添加商品</span>
                    </div>  
                    <div class="margin-bottom-10">
                        <span>开票商品总数： <em style="color:#cf0012;font-style: normal;">{{ totalInfo.num }}</em></span>
                        <span class="margin-left-20">开票商品总额： <em style="color:#cf0012;font-style: normal;">{{ totalInfo.amount }}</em></span>
                    </div>        
                    <div>
                        <el-table :row-class-name="tableRowClassName" :data="goodsList" border style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpxh" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpdhh" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="jldw" label="计量单位"></el-table-column>
                            <el-table-column prop="cksl" label="出库数量"></el-table-column>
                            <el-table-column prop="ckdj" label="开票单价" sortable min-width="100"></el-table-column>
                            <el-table-column prop="wait_invoice_num" label="待开票数量" sortable min-width="120"></el-table-column>
                            <el-table-column prop="invoice_num" label="本次开票数量" sortable min-width="120">
                                <template slot-scope="scope">
                                    <Input v-model="scope.row.invoice_num" @on-change="changeAmount(scope.row, scope.$index)"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoice_total" label="开票金额"></el-table-column>
                            <el-table-column prop="arrive_rate" label="到款比例"></el-table-column>
                            <el-table-column label="销售出库单编号" width="140">
                                <template slot-scope="scope">
                                    <span  @click="handleClick(scope.row.xsckd_djbh, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.xsckd_djbh}}</span></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号" width="120">
                                <template slot-scope="scope">
                                    <span  @click="handleClick(scope.row.xshtd_djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.xshtd_djbh}}</span></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.$index)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </Card>
            </Col>
        </Row>  
        <Row class="margin-top-10" v-if="allShipList.length > 0">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        运费明细
                    </p>
                    <div class="margin-bottom-10">
                        <span>运费总额： <em style="color:#cf0012;font-style: normal;">{{ totalShip }}</em></span>
                    </div>        
                    <div>
                        <el-table :row-class-name="tableRowClassName" :data="allShipList" border style="text-align: center"  @sort-change="manualSort">
                            <el-table-column prop="ship_amount" label="运费金额"></el-table-column>
                            <el-table-column prop="ship_amount" label="开票单价"></el-table-column>
                            <el-table-column prop="khzfzt" label="支付状态">
                                <template slot-scope="scope">
                                    <span>{{khzfzt[scope.row.khzfzt]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cpxh" label="订单状态">
                                <template slot-scope="scope">
                                    <span>{{xshtdzt[scope.row.xshtdzt]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号">
                                <template slot-scope="scope">
                                    <span  @click="handleClick(scope.row.djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
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
                <Button  type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button  type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loading" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showDelete" title="确认删除" @on-ok="confirmDelete">
            <p>确认删除？</p>
        </Modal> 
        <Modal v-model="showAdd" title="新增收票地址">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100" ref="addInvoiceInfo" :model="addInvoiceInfo" :rules="ruleValidate">
                            <Row>
                                <Col span="24">
                                    <FormItem label="收票人：" prop="shrxm">
                                         <Input v-model="addInvoiceInfo.shrxm" placeholder="请输入收票人"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="联系方式：" prop="shrdhhm">
                                         <Input v-model="addInvoiceInfo.shrdhhm" placeholder="请输入联系方式"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="收票地址：" prop="shdz">
                                        <Cascader :data="allAddressArr" v-model="addInvoiceInfo.shdz" filterable></Cascader>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="详细地址：" prop="shxxdz">
                                         <Input v-model="addInvoiceInfo.shxxdz" placeholder="请输入详细地址"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="是否默认：">
                                        <RadioGroup v-model="addInvoiceInfo.sfmr">
                                            <Radio label="否"></Radio>
                                            <Radio label="是"></Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelAdd">取消</Button>
                <Button type="primary" @click="addOrEditInvoice">确定</Button>
            </div>
        </Modal>   
        <Modal v-model="showAddNewGood" class-name="make-return modal-no-absoute" title="添加商品" width="90">
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <Form :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                <Select v-model="dataToMakeInvoice.cpppbh"  placeholder="请选择产品品牌" filterable @on-change="search">
                                    <Option v-for="item in brandList" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="dataToMakeInvoice.cpppmc" placeholder="输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="dataToMakeInvoice.djbh" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                     <Input v-model="dataToMakeInvoice.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                   <Input v-model="dataToMakeInvoice.cpxh" placeholder="输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="dataToMakeInvoice.ckd_djbh" placeholder="输入销售出库单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                     <Input v-model="dataToMakeInvoice.khbh" placeholder="输入客户编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="dataToMakeInvoice.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <Row class="margin-top-10">
                <col span="24">
                    <Card>        
                        <Row style="margin-bottom:10px;">
                            <col span="24">
                                <Button type="primary"  @click="confirmAdd()">添加</Button>
                            </col>
                        </Row>                                
                        <el-table :row-class-name="tableRowClassName" :data="productToAdd" border style="text-align: center;width: 100%" @sort-change="manualSort2"  @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column label="销售合同单编号" width="120">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick(scope.row.djbh, 'service-sales-htd-detail')">{{scope.row.djbh}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售出库单编号" width="130">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick(scope.row.ckd_djbh, 'service-xsckd-detail')">{{scope.row.ckd_djbh}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="djrq" label="创建时间" sortable="custom" width="150"></el-table-column>
                            <el-table-column prop="khbh" label="客户编号" width="120"></el-table-column>
                            <el-table-column prop="khmc" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpppmc" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpmc" label="产品名称" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpxh" label="产品型号" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpdhh" label="订货号" with="120"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="jldw" label="计量单位" ></el-table-column>
                            <el-table-column prop="cksl" label="出库数量" sortable="custom" width="100"></el-table-column>
                            <el-table-column prop="ckdj" label="开票单价" sortable="custom" width="100"></el-table-column>
                            <el-table-column prop="to_invoice_num" label="待开票数量" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="arrive_funds_rate" label="到款比例"></el-table-column>
                            <el-table-column label="支付状态" sortable="custom" prop="khzfzt" width="100">
                                <template slot-scope="scope">
                                    <span>{{khzfzt[scope.row.khzfzt] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单状态"  prop="xshtdzt" sortable="custom" width="100">
                                <template slot-scope="scope">
                                    <span>{{xshtdzt[scope.row.xshtdzt] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                </col>
            </Row>
        </Modal>      
    </div>
</template>
<script type="text/ecmascript-6">
    import {apiAllStatus, apiGetServiceInvoiceAddrModify, apiGetServiceInvoiceAdress, apiGetServiceInvoiceAddrSetDefault, apiGetServiceInvoiceAddrDel, apiMapDetail,
            apiGetDataToMakeInvoice, apiGetDataOfInvoice, apiGetDataOfInvoiceDetail, apiGetInvoiceToMakeData, apiAllBrands, apiGetDataToAddInvoice, apiGetDataToSaveInvoice } from '@/config/getData';
    import {sortBy, closeCurrentPage} from '@/config/mUtils';
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                note: '',
                showAdd: false,
                loading: false,
                showDelete: false,
                showAddNewGood: false,
                expandAddress: true,
                checkedRadio: '',
                deleteId: '',
                addressList: [],
                invoiceType: {},
                khzfzt: {},
                xshtdzt: {},
                copyKhbh: '',
                addInvoiceInfo: {
                    id: '',
                    shrxm: '',
                    shrdhhm: '',
                    shdz: [],
                    sfmr: '否',
                    shxxdz: '',
                    khbh: ''
                },
                allAddressArr: [],
                ruleValidate: {
                    shrxm: [
                        { required: true, message: '收货人不能为空', trigger: 'blur' }
                    ],
                    shrdhhm: [
                        { required: true, message: '联系方式不能为空', trigger: 'blur' }
                    ],
                    shdz: [
                        { required: true, message: '省市区不能为空', trigger: 'blur', type: 'array'}
                    ],
                    shxxdz: [
                        { required: true, message: '详细地址不能为空', trigger: 'blur' }
                    ],
                    invoice_title_id: [
                        { required: true, message: '发票抬头不能为空', trigger: 'blur' }
                    ]
                },
                goodsList: [],
                currentType: this.$route.query.type,
                invoiceInfo: {
                    invoice_title_id: '',
                    swdjzh: '/',
                    kpdz: '/',
                    kpdhhm: '/',
                    jbkhyhmc: '/',
                    jbkhzh: '/',
                    ygxm: '',
                    bmmc: '',
                    czyg: '',
                    czygbm: '',
                },
                allInvoiceTitle: [],
                totalInfo: {
                    num: 0,
                    amount: 0
                },
                allShipList: [],
                totalShip: 0,

                //弹窗相关
                brandList: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                dataToMakeInvoice: {
                    cpppbh: 'all',
                    cpppmc: '',
                    cpdhh: '',
                    cpxh: '',
                    djbh: '',
                    ckd_djbh: '',
                    khbh: '',
                    khmc: '',
                },
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                productToAdd: [],
                OneAddressList: [],
                selectedToAdd: []
            };
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            minAddressList() {
                this.OneAddressList = [];
                this.addressList.forEach(item => {
                    if (item.id == this.checkedRadio) {
                        this.OneAddressList.push(item);
                    }
                });
                this.checkedRadio = '';
                setTimeout(()=> {
                    this.checkedRadio = this.OneAddressList[0].id;
                });
                this.expandAddress = false;
            },
            expandAddressList() {
                this.expandAddress = true;
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx', 'xshtdzt', 'khzfzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.invoiceType = res.data.fplx;
                        this.xshtdzt = res.data.xshtdzt;
                        this.khzfzt = res.data.khzfzt;
                    }
                });
                //获取所有产品品牌
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {

                        this.brandList = this.brandList.concat(res.data);
                    }
                });
            },
            getInvoiceData() {
                apiGetDataToMakeInvoice(this, {
                    ids: JSON.parse(this.$route.query.ids).join(',')
                }).then(res => {
                    if (res && res.status == 1) {
                        // 客服编号
                        this.copyKhbh = res.data.kh_info.khbh;
                        this.addInvoiceInfo.khbh = this.copyKhbh;

                        // 销售人员信息
                        this.invoiceInfo.ygxm = res.data.kh_info.ygbh + '/' + res.data.kh_info.ygxm;
                        this.invoiceInfo.czyg = res.data.kh_info.czyg_ygbh + '/' + res.data.kh_info.czyg;
                        this.invoiceInfo.bmmc = res.data.kh_info.bmmc;
                        this.invoiceInfo.czygbm = res.data.kh_info.czygbm;
                        //代开票商品明细
                        this.totalInfo.num = 0;
                        this.totalInfo.amount = 0;
                        res.data.wait_list.forEach(item => {
                            item.invoice_num = item.wait_invoice_num;
                            item.invoice_total = (item.invoice_num * item.ckdj).toFixed(4);
                            this.totalInfo.num += +item.invoice_num;
                            this.totalInfo.amount += +item.invoice_total;
                        });
                        this.totalInfo.num = this.totalInfo.num.toFixed(0);
                        this.totalInfo.amount = this.totalInfo.amount.toFixed(4);
                        this.goodsList = res.data.wait_list;

                        //运费险关
                        this.totalShip = 0;
                        res.data.ship_fee_list.forEach(item => {
                            this.totalShip += +item.ship_amount;
                        });
                        this.totalShip = this.totalShip.toFixed(2);
                        this.allShipList = res.data.ship_fee_list;
                        this.getAllAdress();
                        this.getInvoinceTitle();
                    }
                });
            },
            deleteItem(index) {
                let deleteOrderId = this.goodsList[index].xshtd_djbh;
                let hasNoOtherSimily = true;
                this.goodsList.splice(index, 1);
                for (let i = this.goodsList.length - 1; i >= 0; i--) {
                    if (this.goodsList[i].xshtd_djbh == deleteOrderId) {
                        hasNoOtherSimily = false;
                        break;
                    }
                }
                if (hasNoOtherSimily) {
                    for (let i = this.allShipList.length - 1; i >= 0; i--) {
                        if (this.allShipList[i].djbh == deleteOrderId) {
                            this.allShipList.splice(i, 1);
                            break;
                        }
                    }
                }
                //代开票商品明细
                this.totalInfo.num = 0;
                this.totalInfo.amount = 0;
                this.goodsList.forEach(item => {
                    this.totalInfo.num += +item.invoice_num;
                    this.totalInfo.amount += +item.invoice_total;
                });
                this.totalInfo.num = this.totalInfo.num.toFixed(0);
                this.totalInfo.amount = this.totalInfo.amount.toFixed(4);

                //运费险关
                this.totalShip = 0;
                this.allShipList.forEach(item => {
                    this.totalShip += +item.ship_amount;
                });
                this.totalShip = this.totalShip.toFixed(2);
            },
            save() {
                this.$refs['invoiceInfo'].validate((valid) => {
                    if (valid) {
                        for (let i = this.goodsList.length - 1; i >= 0; i--) {
                            let invoiceNum = this.goodsList[i].invoice_num;
                            let invoiceNumWait = this.goodsList[i].wait_invoice_num;
                            if (isNaN(+invoiceNum)) {
                                this.$Message.error('开票商品第' + (i+1) + '行存在非法输入数量!');
                                return;
                            }
                            if (+invoiceNum < 1) {
                                this.$Message.error('开票商品第' + (i+1) + '行输入数量不能小于1!');
                                return;
                            }
                            if (+invoiceNum > +invoiceNumWait) {
                                this.$Message.error('开票商品第' + (i+1) + '行输入数量不能大于可开票数量!');
                                return;
                            }
                        }
                        if (this.addressList.length <= 0) {
                            this.$Message.error('收票地址不能为空');
                            return;
                        }
                        if (this.goodsList.length <= 0) {
                            this.$Message.error('商品明细不能为空');
                            return;
                        }
                        let tmpArr = [];
                        this.goodsList.forEach(item => {
                            tmpArr.push({
                                ckdmx_id: item.id,
                                invoice_num: item.invoice_num
                            });
                        });
                        this.loading = true;
                        apiGetDataToSaveInvoice(this, {
                            params: JSON.stringify({
                                invoice_title_id: this.invoiceInfo.invoice_title_id,
                                ship_address_id: this.checkedRadio,
                                type: this.currentType,
                                khbh: this.copyKhbh,
                                note: this.note
                            }),
                            list: JSON.stringify(tmpArr)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功!');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'service-xskpd-detail', {
                                    param: res.data.invoice_no
                                });
                                this.$router.push({
                                    name: 'service-xskpd-detail',
                                    query: {
                                        param: res.data.invoice_no
                                    }
                                });
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                    
                });
            },
            getInvoinceTitle() {
                apiGetDataOfInvoice(this, {
                    params: JSON.stringify({
                        type: this.currentType,
                        khbh: this.copyKhbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allInvoiceTitle = res.data.list;
                    }
                })
            },
            getInvoiceDetail(value) {
                apiGetDataOfInvoiceDetail(this, {
                    params: JSON.stringify({
                        fpid: value
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.invoiceInfo.swdjzh = res.data.info.swdjzh;
                        this.invoiceInfo.kpdz = res.data.info.kpdz;
                        this.invoiceInfo.kpdhhm = res.data.info.kpdhhm;
                        this.invoiceInfo.jbkhyhmc = res.data.info.jbkhyhmc;
                        this.invoiceInfo.jbkhzh = res.data.info.jbkhzh;
                    }
                });
            },
            showAddModal() {
                this.addInvoiceInfo = {
                    id: '',
                    shrxm: '',
                    shrdhhm: '',
                    shdz: [],
                    sfmr: '否',
                    shxxdz: '',
                    khbh: this.copyKhbh
                };
                this.showAdd = true;
            },
            cancelAdd() {
                this.showAdd = false;
            },
            deleteAddress(id) {
                this.deleteId = id;
                this.showDelete = true;
            },
            confirmDelete() {
                apiGetServiceInvoiceAddrDel(this, {
                    params: JSON.stringify({id: this.deleteId})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getAllAdress();
                        this.expandAddressList();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getAllAdress() {
                apiGetServiceInvoiceAdress(this, {
                    params: JSON.stringify({
                        khbh: this.copyKhbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.addressList = res.data.list;
                        this.checkedRadio = '';
                        setTimeout(()=> {
                            this.checkedRadio = this.addressList[0].id;
                        });
                    } else {
                        this.addressList = [];
                    }
                });
            },
            addOrEditInvoice() {
                this.$refs.addInvoiceInfo.validate((valid) => {
                    if (valid) {
                        apiGetServiceInvoiceAddrModify(this, {
                            params: JSON.stringify(this.notempty({
                                id: this.addInvoiceInfo.id,
                                shrxm: this.addInvoiceInfo.shrxm,
                                shrdhhm: this.addInvoiceInfo.shrdhhm,
                                sfmr: this.addInvoiceInfo.sfmr == '否' ? '0' : '1',
                                shdz: JSON.stringify(this.addInvoiceInfo.shdz),
                                shxxdz: this.addInvoiceInfo.shxxdz,
                                khbh: this.addInvoiceInfo.khbh
                            }))
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success(res.message);
                                this.showAdd = false;
                                this.expandAddressList();
                                this.getAllAdress();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            setDefault(id) {
                apiGetServiceInvoiceAddrSetDefault(this, {
                    params: JSON.stringify({id})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getAllAdress();
                        this.expandAddressList();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            editAddress(item) {
                this.addInvoiceInfo.id = item.id;
                this.addInvoiceInfo.shrxm = item.shrxm;
                this.addInvoiceInfo.shrdhhm = item.shrdhhm;
                this.addInvoiceInfo.shdz = item.shsfbh ? [item.shsfbh, item.shcsbh, item.shxqbh] : [];
                this.addInvoiceInfo.shxxdz = item.shxxdz;
                this.addInvoiceInfo.sfmr = item.sfmr == '0' ? '否' : '是';
                this.addInvoiceInfo.khbh = '';
                this.showAdd = true;
            },
            getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.goodsList.sort(sortBy(column.prop, isDec));
            },
            changeAmount(row, index) {
                row.invoice_total = (row.invoice_num * row.ckdj).toFixed(4);
                this.goodsList.splice(index, 1, row);

                this.totalInfo.num = 0;
                this.totalInfo.amount = 0;
                this.goodsList.forEach(item => {
                    this.totalInfo.num += +item.invoice_num;
                    this.totalInfo.amount += +item.invoice_total;
                });
                this.totalInfo.num = this.totalInfo.num.toFixed(0);
                this.totalInfo.amount = this.totalInfo.amount.toFixed(4);
            },

            //弹窗函数
            addNewGood() {
                this.showAddNewGood = true;
                this.getData();
            },
            getData () {
                //获取带采购商品明细
                apiGetInvoiceToMakeData(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        cpppbh:this.dataToMakeInvoice.cpppbh == 'all' ? '' : this.dataToMakeInvoice.cpppbh,
                        cpppmc:this.dataToMakeInvoice.cpppmc,
                        cpdhh:this.dataToMakeInvoice.cpdhh,
                        cpxh:this.dataToMakeInvoice.cpxh,
                        djbh:this.dataToMakeInvoice.djbh,
                        ckd_djbh:this.dataToMakeInvoice.ckd_djbh,
                        khmc:this.dataToMakeInvoice.khmc,
                        khbh:this.copyKhbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.productToAdd = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            // 弹窗功能函数开始
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.dataToMakeInvoice = {
                    cpppbh: 'all',
                    cpppmc: '',
                    cpdhh: '',
                    cpxh: '',
                    djbh: '',
                    khmc: '',
                    khbh: '',
                    ckd_djbh: ''
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
            manualSort2 (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
            handleSelectionChange(selectedVal) {
                this.selectedToAdd = [];
                selectedVal.forEach(item => {
                    this.selectedToAdd.push(item);
                });
            },
            confirmAdd() {
                if (this.selectedToAdd.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                let tmpArr = [];
                this.selectedToAdd.forEach(item => {
                    tmpArr.push(item.id);
                });
                apiGetDataToAddInvoice(this, {
                    order_detail_ids: JSON.stringify(tmpArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.message) {
                            this.$Message.success({
                                content: '部分操作不成功，' + res.message,
                                duration: 0,
                                closable: true
                            });
                        }
                        //换成数字
                        this.totalInfo.num = +this.totalInfo.num;
                        this.totalInfo.amount = +this.totalInfo.amount;
                        this.totalShip = +this.totalShip;

                         //代开票商品明细
                        res.data.detail.forEach(item => {
                            let noRepeat = true;
                            for (let i = this.goodsList.length - 1; i >= 0; i--) {
                                if (this.goodsList[i].id == item.id) {
                                    noRepeat = false;
                                    break;
                                }
                            }
                            if (noRepeat) {
                                this.goodsList.push(item);
                                item.invoice_num = item.wait_invoice_num;
                                item.invoice_total = (item.invoice_num * item.ckdj).toFixed(2);
                                this.totalInfo.num += +item.invoice_num;
                                this.totalInfo.amount += +item.invoice_total;
                            }
                        });
                        this.totalInfo.num = (this.totalInfo.num).toFixed(0);
                        this.totalInfo.amount = (this.totalInfo.amount).toFixed(4);
                        //运费险关
                        res.data.ship.forEach(item => {
                            let noRepeat = true;
                            for (let i = this.allShipList.length - 1; i >= 0; i--) {
                                if (this.allShipList[i].djbh == item.djbh) {
                                    noRepeat = false;
                                    break;
                                }
                            }
                            if (noRepeat) {
                                this.allShipList.push(item);
                                this.totalShip += +item.ship_amount;
                            }
                        });
                        this.totalShip = (this.totalShip).toFixed(2);
                        this.showAddNewGood = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },     
            // 弹窗功能函数结束       
            backTo() {
                history.go(-1);
            }     
        },
        components: {
            pagination
        },
        created () {
            this.getStatus();
            this.getMapDetail();
            this.getInvoiceData();
        }
    };
</script>
