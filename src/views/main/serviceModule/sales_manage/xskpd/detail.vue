<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <div slot="extra" v-show="is_edit2" v-auth="xskpDetailBasicLimit">
                    <a @click="editAllBasic()" v-show="!isEditBasic">
                        <Icon type="edit"></Icon>
                        编辑
                    </a>
                    <a @click="saveEdit()" v-show="isEditBasic">
                        <Icon type="checkmark"></Icon>
                        保存
                    </a>
                    <a @click.prevent="cancelEdit" v-show="isEditBasic" style="margin-left: 15px;">
                        <Icon type="close"></Icon>
                        取消
                    </a>
                </div>                   
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ thdDetail.invoice_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请时间：" style="margin:0;">
                            {{ thdDetail.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ returnStatus[thdDetail.invoice_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="开票总额：" style="margin:0;">
                            {{ parseFloat(thdDetail.invoice_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="收票人：" style="margin:0;">
                            {{ thdDetail.receive_name }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="收票人：" style="margin:0;" prop="receive_name">
                            <Input v-model="thdDetail.receive_name" placeholder="请输入收票人"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="收票人联系方式：" style="margin:0;">
                            {{ thdDetail.receive_phone }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="收票人联系方式：" style="margin:0;" prop="receive_phone">
                            <Input v-model="thdDetail.receive_phone" placeholder="请输入联系方式"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="收票地址：" style="margin:0;">
                            {{thdDetail.province_name}}{{thdDetail.city_name}}{{thdDetail.district_name}}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="收票地址：" style="margin:0;" prop="cityArea">
                            <Cascader :data="allAddressArr" v-model="thdDetail.cityArea" filterable></Cascader>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="详细地址：" style="margin:0;">
                            {{thdDetail.address}}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="详细地址：" style="margin:0;" prop="address">
                            <Input v-model="thdDetail.address" placeholder="请输入详细地址"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="发货物流：" style="margin:0;">
                            {{ thdDetail.is_deleted }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="发货物流：">
                            <Select v-model="thdDetail.invoice_shipping">
                                <Option v-for="item in logisticsArr" :value="item.fhwlbh" :key="item.fhwlbh">{{ item.fhwlmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;">
                            {{ thdDetail.invoice_ship_no }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;">
                            <Input v-model="thdDetail.invoice_ship_no" placeholder="请输入快递单号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发票号码：" style="margin:0;">
                            {{ thdDetail.invoice_number }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <span v-if="!isEditBasic"> {{ thdDetail.note }} </span>
                            <Input type="textarea" v-model="thdDetail.note" v-else></Input>
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
                    客户信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="客户编号：" style="margin:0;">
                            {{ khDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ khDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.sell_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.sell_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.server_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.server_depart }}
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
                    发票信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="发票类型：" style="margin:0;">
                            {{ invoinceTypeObj[thdDetail.invoice_type] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发票抬头：" style="margin:0;">
                            {{ thdDetail.invoice_title }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="纳税人识别号：" style="margin:0;">
                            {{ thdDetail.tax_identy_num}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="注册地址：" style="margin:0;">
                            {{ thdDetail.register_address }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="注册电话：" style="margin:0;">
                            {{ thdDetail.register_phone }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="开户银行：" style="margin:0;">
                            {{ thdDetail.bank_open }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="银行账号：" style="margin:0;">
                            {{ thdDetail.bank_account }}
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
                        开票明细
                    </p>
                    <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="xskpdDetail_export" class="margin-left-10">导出</Button>
                    </Col>
                    </Row>
                    <div slot="extra" v-show="is_edit" v-auth="xskpDetailDataLimit">
                        <a @click="edit('thmx')" v-show="!isEditList">
                            <Icon type="edit"></Icon>
                            编辑
                        </a>
                        <a @click="close('thmxsave')" v-show="isEditList">
                            <Icon type="checkmark"></Icon>
                            保存
                        </a>
                        <a  @click="close('thmxcancel')" v-show="isEditList" style="margin-left: 15px;">
                            <Icon type="close"></Icon>
                            取消
                        </a>
                    </div>              
                    <div>
                        <span style="font-weight:normal;font-size:12px;line-height: 40px;">开票商品总数：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{allNum}}</em></span>
                        <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">开票商品总额(含税)：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{parseFloat(allAmount).toFixed(4)}}</em></span>
                        <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">开票商品总额(未税)：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{before_AllAmount}}</em></span>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpmc" label="产品名称" min-width="150" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpxh" label="产品型号" min-width="150" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cpdhh" label="订货号" min-width="100" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column prop="jldw" label="计量单位" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cksl" label="出库数量" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.cksl) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="wait_invoice_num" label="待开票数量" v-if="isEditList" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="invoice_num" label="开票数量" sortable min-width="100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="!isEditList"> {{ parseInt(scope.row.invoice_num) }}</span>
                                    <Input v-model="scope.row.invoice_num" v-else @on-blur="valithsl(scope.row.invoice_num, scope.row.wait_invoice_num, scope.$index)" @on-change="changeAmount(scope.row)"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoice_avg_price" label="开票单价(含税)" sortable min-width="130" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="invoice_total" label="开票金额(含税)" sortable min-width="130" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="before_invoice_avg_price" label="开票单价(未税)" sortable min-width="130" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="before_invoice_total" label="开票金额(未税)" sortable min-width="130" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="arrive_rate" label="到款比例" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="khzfzt" label="支付状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span> {{ htdPayObj[scope.row.khzfzt] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="xshtdzt" label="订单状态" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span> {{ htdStatusObj[scope.row.xshtdzt] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售出库单编号" width="140" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span  @click="handleClick(scope.row.xsckd_djbh, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.xsckd_djbh}}</span></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号" width="120" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span  @click="handleClick(scope.row.djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="feeTable.length > 0">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        运费明细
                    </p>             
                    <div>
                        <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">运费总额(含税)：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{feeAll | toDecimal}}</em></span>
                        <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">运费总额(未税)：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{before_feeAll}}</em></span>
                        <el-table :data="feeTable" border stripe style="text-align: center"  @sort-change="feeTableSort">
                            <el-table-column prop="invoice_total" label="运费金额" sortable="custome"></el-table-column>
                            <el-table-column prop="invoice_total" label="开票单价(含税)" sortable="custome"></el-table-column>
                            <el-table-column prop="before_invoice_total" label="开票单价(未税)" sortable="custome"></el-table-column>
                            <el-table-column prop="khzfzt" label="支付状态" sortable="custome">
                                <template slot-scope="scope">
                                    <span>{{htdPayObj[scope.row.khzfzt]}}</span>       
                                </template>
                            </el-table-column>
                            <el-table-column prop="xshtdzt" label="订单状态" sortable="custome">
                                <template slot-scope="scope">
                                    <span>{{htdStatusObj[scope.row.xshtdzt]}}</span>       
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
                <Button  v-show="canPass" type="primary" class="margin-top-10" style="margin:auto;" @click="confirmPass(1)" v-auth="xskpDetailBasicLimit">通过</Button>
                <Button  v-show="canPass" type="primary" class="margin-top-10" style="margin:auto;" @click="confirmPass(0)" v-auth="xskpDetailBasicLimit">不通过</Button>
                <Button v-show="canBilling" type="primary" class="margin-top-10" style="margin:auto;" @click="doApprove()" v-auth="invoiceLimit">开票</Button>
                <Button v-show="canBilling" type="primary" class="margin-top-10" style="margin:auto;" @click="confirmNotApprove()" v-auth="invoiceLimit">不开票</Button>
                <Button v-show="canAbolish" type="primary" class="margin-top-10" style="margin:auto;" @click="abolish()" v-auth="zfLimit">作废</Button>
                <Button v-show="exportPass" type="primary" @click="Export" style="margin-left: 10px;"  v-auth="zfLimit">导出</Button>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showPass" title="确认通过" @on-ok="confirmPass">
            <p>确认通过？</p>
        </Modal>
        <Modal v-model="showAbolish" title="确认作废">
            <p>确认作废？</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbolish">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbolish">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showApprove" title="请输入物流信息">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100" ref="approveDetail" :model="approveDetail" :rules="ruleValidate">
                            <Row>
                                <Col span="24">
                                    <FormItem label="发货物流：" prop="logisticsInfo">
                                        <Select v-model="approveDetail.logisticsInfo">
                                            <Option v-for="item in logisticsArr" :value="item.fhwlbh" :key="item.fhwlbh">{{ item.fhwlmc }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="快递单号：" prop="note">
                                         <Input v-model="approveDetail.note" type="text" :rows="3" placeholder="请输入快递单号"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="confirmApprove">确定</Button>
            </div>
        </Modal>
        <!--确认开票-->
        <Modal v-model="showApprove2" title="确认开票">
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100" ref="approveDetail2" :model="approveDetail2" :rules="ruleValidate2">
                        <Row>
                            <Col span="24">
                            <FormItem label="发票号码：" prop="invoice_number">
                                <Input v-model="approveDetail2.invoice_number" type="text" :rows="3" placeholder="请输入发票号码"></Input>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="confirmApprove2">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import {apixskpdDetail, apiInvoiceExport,  apiAllStatus, apiMapDetail, apixskpdDetailEdit, apixskpdDetailPass, apixskpdDetailBilling, apiSendLogistic,exportXskpdDetail} from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                loading: false,
                xskpDetailBasicLimit: 'service-xskpd-detail-basic-limit', //基本信息编辑
                xskpDetailDataLimit: 'service-xskpd-detail-data-limit', //开票明细编辑
                xskpdDetail_export:'xskpdDetail_export',
                ruleValidate: {
                    receive_name: [
                        { required: true, message: '收票人不能为空', trigger: 'blur' }
                    ],
                    receive_phone: [
                        { required: true, message: '联系方式不能为空', trigger: 'blur' }
                    ],
                    cityArea: [
                        { required: true, message: '省市区不能为空', trigger: 'blur', type: 'array'}
                    ],
                    address: [
                        { required: true, message: '详细地址不能为空', trigger: 'blur' }
                    ],
                    logisticsInfo: [
                        { required: true, message: '发货物流不能为空', trigger: 'blur' }
                    ],
                    note: [
                        { required: true, message: '快递单号不能为空', trigger: 'blur' }
                    ]
                },
                ruleValidate2: {
                    invoice_number: [
                        { required: true, message: '发票号码不能为空', trigger: 'blur' }
                    ],
                },
                storageList: [],     
                thdbh: this.$route.query.param,
                thdDetail: {
                    receive_name: '',
                    receive_phone: '',
                    cityArea: [],
                    address: ''
                },
                allAddressArr: [],
                khDetail: {},
                is_edit: false,
                is_edit2: false,
                isEditBasic: false,
                isEditList: false,
                returnStatus: {},
                invoinceTypeObj: {},
                htdStatusObj: {},
                htdPayObj: {},
                thdList: {
                    title: [],
                    data: []
                },
                showPass: false,
                canBilling: false,
                canPush:false,
                canAbandon: false,
                canPass: false,
                canApplyReturn: false,
                typeObj: {},
                showAbandon: false,
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                showApprove2: false,
                canAbolish: false,
                showAbolish: false,
                approveDetail: {
                    logisticsInfo: '',
                    note: ''
                },
                approveDetail2: {
                    invoice_number: '',
                },
                workFlowWidth: 100,

                logisticsArr: [],
                allNum: '',
                allAmount: '',
                before_AllAmount: '',
                feeAll: '',
                before_feeAll: '',
                feeTable: [],
                exportPass:false,
                zfLimit: 'service-xskpd-detail-zf',
                invoiceLimit: 'service-xskpd-invoice-not'
            };
        },
        methods: {
            cancelAbolish() {
                this.showAbolish = false;
            },
            confirmAbolish () {
                this.loading = true;
                apixskpdDetailPass(this, {
                    params: JSON.stringify({
                        invoice_no: this.$route.query.param,
                        pass: -1
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功!');
                        this.getData();
                        this.showAbolish = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            abolish () {
                this.showAbolish = true;
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },

            Export() {
                apiInvoiceExport(this,{
                    params: this.thdbh,
                }).then(res => {

                });
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_invoice', 'fplx', 'xshtdzt', 'khzfzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_invoice;
                        this.invoinceTypeObj = res.data.fplx;
                        this.htdStatusObj = res.data.xshtdzt;
                        this.htdPayObj = res.data.khzfzt;
                        this.getData();
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.logisticsArr = res.data;
                    }
                });
            },              
            confirmPass(type) {
                apixskpdDetailPass(this, {
                    params: JSON.stringify({
                        invoice_no: this.$route.query.param,
                        pass: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },     
            doApprove() {
                this.showApprove2 = true;
            },
            confirmApprove2 () {
                apixskpdDetailBilling(this, {
                    params: JSON.stringify({
                        invoice_no: this.$route.query.param,
                        invoice_number: this.approveDetail2.invoice_number,
                        pass: 1
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功');
                        this.showApprove2 = false;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            confirmApprove() {
                this.$refs['approveDetail'].validate((valid) => {
                    if (valid) {
                        apixskpdDetailBilling(this, {
                            params: JSON.stringify({
                                invoice_no: this.$route.query.param,
                                ship_name: this.approveDetail.logisticsInfo,
                                ship_no: this.approveDetail.note,
                                pass: 1
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('操作成功');
                                this.showApprove = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                })
            }, 
            confirmNotApprove() {
                apixskpdDetailBilling(this, {
                    params: JSON.stringify({
                        invoice_no: this.$route.query.param,
                        pass: 0
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },    
            changeAmount (scope) {
                scope.invoice_total = scope.invoice_avg_price * scope.invoice_num;
                scope.before_invoice_total = scope.before_invoice_avg_price * scope.invoice_num;
                this.getCount();
            },                      
            editAllBasic() {
                this.isEditBasic = true;
            },
            cancelEdit() {
                this.isEditBasic = false;
                this.getData();
            },
            getCount () {
                this.allNum = 0;
                this.allAmount = 0.00;
                this.before_AllAmount = 0.00;
                for (let i in this.thdList.data) {
                    this.allNum = parseInt(this.allNum) + parseInt(this.thdList.data[i].invoice_num);
                    this.allAmount += +this.thdList.data[i].invoice_total;
                    this.before_AllAmount += +this.thdList.data[i].before_invoice_total;
                }
            },
            saveEdit() {
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        apixskpdDetailEdit(this, {
                            invoice_no: this.$route.query.param,
                            info: JSON.stringify({
                                receive_name: this.thdDetail.receive_name,
                                receive_phone: this.thdDetail.receive_phone,
                                address_area: JSON.stringify(this.thdDetail.cityArea),
                                receive_address: this.thdDetail.address,
                                //新增字段
                                ship_type: this.thdDetail.invoice_shipping,
                                ship_no: this.thdDetail.invoice_ship_no,
                                note: this.thdDetail.note,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                this.isEditBasic = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                })
            },

            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行开票数量大于可开票数量');
                }
            },
            toExport(){
                exportXskpdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'invoice_no': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        //成功
                    }
                });
            },
            getData () {
                apixskpdDetail(this, {
                    invoice_no: this.thdbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.kh_info;
                        this.thdDetail = res.data.info;
                        this.thdList.data = res.data.list;
                        this.thdDetail.cityArea = [res.data.info.province_no, res.data.info.city_no, res.data.info.district_no];
                        //单据状态“待审批/已驳回”，且当前登录人员为客户的所属客服时展示编辑
                        this.is_edit = (res.data.info.invoice_status == 0 || res.data.info.invoice_status == -1);
                        //单据状态非“已作废”，且当前登录人员为客户的所属客服时展示编辑
                        this.is_edit2 = (res.data.info.invoice_status != 3);
                        //单据状态“待审批/已驳回”，且当前登录人员为客户的所属客服时展示通过
                        this.canPass = (Cookies.get('user_no') === res.data.kh_info.kfbh) && (res.data.info.invoice_status == 0 || res.data.info.invoice_status == -1);
                        //单据状态“已开票”，且当前登录人员为财务角色时展示
                        this.canAbolish = res.data.info.invoice_status == 2;
                        //单据状态“待开票”，且当前登录人员为财务角色时展示
                        this.canBilling = res.data.info.invoice_status == 1;
                        console.log(this.canBilling, '此处应该为true');
                        this.getCount();
                        this.feeTable = res.data.ship;
                        // this.feeAll = res.data.ship.total_freight_amount;
                        this.feeAll = parseFloat(0).toFixed(4);
                        this.before_feeAll = parseFloat(0).toFixed(9);
                        for (let i in this.feeTable) {
                            this.feeAll = parseFloat((this.feeAll * 100 + this.feeTable[i].invoice_total * 100) / 100 ).toFixed(4);
                            this.before_feeAll = parseFloat((this.before_feeAll * 1000000000 + this.feeTable[i].before_invoice_total * 1000000000) / 1000000000 ).toFixed(9);
                        }


                        this.exportPass = (res.data.info.invoice_status != 3);

                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },         
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.data.sort(sortBy(column.prop, isDec));
            },
            feeTableSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.feeTable.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            /*修改*/
            edit (name) {
                if (name === 'thmx') {
                    this.isEditList = true;
                }
            },
            close (name) {
                if (name === 'thmxcancel') {
                    this.isEditList = false;
                    this.getData();
                } else if (name === 'thmxsave') {
                    for(let i = 0; i < this.thdList.data.length; i++){
                        let tmp = {};
                        tmp['wait_invoice_num'] = this.thdList.data[i]['wait_invoice_num'];
                        tmp['invoice_num'] = this.thdList.data[i]['invoice_num'];

                        if(parseInt(tmp['wait_invoice_num']) < parseInt(tmp['invoice_num'])){
                            this.$Message.error('第【'+ (i+1) +'】行开票数量大于可开票数量');
                            return;
                        }
                    }

                    let tmpObj = {};
                    this.thdList.data.forEach(item => {
                        tmpObj[item.id] = item.invoice_num;
                    });

                    apixskpdDetailEdit(this, {
                        invoice_no: this.$route.query.param,
                        list: JSON.stringify(tmpObj)
                    }).then(res => {
                        if(res && res.status == 1){
                            this.$Message.success(res.message);
                            this.isEditList = false;
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            }
        },
        created () {
            this.getStatus();
            this.getMapDetail();
            console.log(manualCheck(this.invoiceLimit), '此处也应该为true');
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            }
        }
    };
</script>
