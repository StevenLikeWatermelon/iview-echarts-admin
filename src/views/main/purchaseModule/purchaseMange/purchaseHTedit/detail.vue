<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    采购合同修改单基本信息
                    <span v-if="is_canedit" style="font-weight:normal;float:right;">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_jbxx" @click="edit('jbxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('jbxxCancel')">取消</Button>
                            <Button type="primary" @click="close('jbxxSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <Form :label-width="140">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购合同修改单编号：" style="margin:0;">
                            {{ xgd_id }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ djStatus[xgdInfo.change_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ xgdInfo.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ xgdInfo.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;" v-if="is_jbxx">
                            {{ xgdInfo.note }}
                        </FormItem>
                        <FormItem label="备注：" style="margin:0;" v-else>
                            <Input type="textarea" v-model="xgdInfo.note"  style="width:50%;"></Input>
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
                    采购合同单基本信息
                </p>
                <Form :label-width="150">
                    <Row>
                        <Col span="8">
                        <FormItem label="采购合同单编号：" style="margin:0;">
                            {{ form.buy_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ buyStatus[form.order_status] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="付款状态：" style="margin:0;">
                            {{ zfStatus[form.pay_status] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发货状态：" style="margin:0;">
                            {{ fhStatus[form.ship_status] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商：" style="margin:0;">
                            {{ form.gysmc }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{ form.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系方式：" style="margin:0;">
                            {{ form.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发票类型：" style="margin:0;">
                            {{ fplx[form.invoice_type] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="税率：" style="margin:0;">
                            {{ form.buy_tax_rate * 100 + '%' }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            {{ form.note }}
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
                    <span v-if="is_canedit" style="font-weight:normal;float:right;">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_htxx" @click="edit('htxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('htxxCancel')">取消</Button>
                            <Button type="primary" @click="close('htxxSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                    <div v-if="is_htxx" style="font-size:12px;">
                        <Row>
                            <Col span="8">
                            <div style="margin:0;">
                                <label style="width:150px;display: block;text-align:right;float:left;padding-right:10px;">纸质合同编号：</label>
                                <span>{{ htInfo.htId }}</span>
                            </div>
                            </Col>
                            <Col span="16">
                            <div style="margin:0;">
                                <label style="width:150px;display: block;text-align:right;float:left;padding-right:10px;">纸质合同：</label>
                                <span v-if="is_htxx">
                                    <a v-if="htInfo.file" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.file" target="_blank">
                                        <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件：{{htInfo.htName}}.{{htInfo.ext}}
                                    </a>
                                <span v-else></span>
                            </span>
                            </div>
                            </Col>
                        </Row>
                    </div>
                    <Form :label-width="120" :model="htInfo" ref="htInfoForm" :rules="htInfoRules" v-else>
                        <Row>
                            <Col span="6">
                            <FormItem label="纸质合同编号：" style="margin:0;" prop="htId">
                                <Input v-model="htInfo.htId"  placeholder="请选择纸质合同编号"></Input>
                            </FormItem>
                            </Col>
                            <Col span="18">
                            <FormItem label="纸质合同：" style="margin:0;" prop="uploadUrl">
                                <div>
                                    <Upload :action="htInfo.uploadUrl"
                                            :format="['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'rar', 'xls', 'xlsx']"
                                            :on-format-error="handleFormatError"
                                            :on-success="handleSuccess"
                                            :max-size="10240" :on-exceeded-size="handleMaxSize"
                                            :show-upload-list="false" style="display: block;width:100%;">
                                        <Button type="default" icon="ios-cloud-upload-outline">上传文件</Button>
                                    </Upload>
                                    <a v-if="htInfo.file" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.file" target="_blank">
                                        <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件:
                                        <span v-if="htInfo.name"> {{htInfo.name}}</span>
                                        <span v-else> {{htInfo.htName}}.{{htInfo.ext}}</span>
                                    </a>
                                </div>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    修改商品明细
                    <span v-if="is_canedit" style="font-weight:normal;float:right;">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('goodsCancel')">取消</Button>
                            <Button type="primary" @click="close('goodsSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">取消商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney | toFiexedFour }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column prop="hh" label="行号" fixed></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" fixed width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" fixed min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" fixed min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" fixed min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_price | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ship_num" label="已发货数量" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column prop="change_num" label="取消数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{scope.row.change_num}}</span>
                                <Input type="text" v-model="scope.row.change_num" @on-change="scope.row.cancel_amount = multiply(scope.row.change_num, scope.row.buy_price, 4);getCount();" @on-blur="numChange(scope.row.change_num, scope.row.buy_num, scope.row.ship_num, scope.$index)" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cancel_amount" label="取消金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.cancel_amount | toFiexedFour }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_leadtime" label="采购货期(天)" width="120"></el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="from_order_no" label="来源单据编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.from_order_no}, 'purchase_manage_BH_detail')">{{ scope.row.from_order_no }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="approval_task">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    流程跟踪
                </p>
                <Steps :current="task_now" status="">
                    <Step :title="task.action" content="" v-for="task in tasks"></Step>
                </Steps>
                <Row class="margin-top-10">
                    <Col span="24">
                    <div v-for="task in tasks" :style="{width: workFlowWidth + '%'}" class="purchase-flow-div">
                        <p style="color:#999;">{{ task.user_name }}</p>
                        <p style="color:#999;">{{ task.time }}</p>
                        <p style="color:#999;">{{ task.note }}</p>
                    </div>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_HTedit_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')" v-if="is_delete">删除</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('tj')" v-if="is_submit || is_tj">提交</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('zf')" v-if="is_submit">作废</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sp')" v-if="is_approve">审批</Button><!---->
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="handleClick({type:'change',param:xgd_id}, 'purchase_manage_HT_toTKD')" v-if="is_return">申请退款</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
        <!--审批弹框-->
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="sureAction('spsure')">
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100">
                        <Row>
                            <Col span="24">
                            <FormItem label="审批结果：">
                                <RadioGroup v-model="approveDetail.isPass" >
                                    <Radio label="1">同意</Radio>
                                    <Radio label="0">驳回</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col span="24">
                            <FormItem label="审批意见：">
                                <Input v-model="approveDetail.note" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                </col>
            </Row>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import {apiAllStatus, apiGetPurchaseHTeditDetail, apiGetPurchaseHTeditChangeDetail, apiGetPurchaseHTeditProductModify, apiGetPurchaseHTeditDelChange, apiGetPurchaseHTeditStatusUpdate, apiGetgenerateInvoice, apiInChangeName, purchaseManageApproveAction, purchaseManageGetWorkFlow, apiGetPurchaseReturnPayReadyByChange,apiGetPurchaseHTeditBasicUpdate} from '@/config/getData';
    import { notempty, sortBy, setToken, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                xgdInfo: {},
                form: {},
                xgd_id: this.$route.query.param,
                fromAdd: this.$route.query.fromAdd,
                actTable: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                edit_goods: true,
                is_htxx: true,
                is_jbxx:true,
                goodsAll: 0,
                goodsAllMoney: 0,
                htInfo: {
                    htId: '',
                    file: '',
                    name: '',
                    ext:'',
                    htName:'',
                    uploadUrl: this.baseUrl + '/v1/order/buy/main/upload-attach?token=' + setToken()
                },
                htInfoRules: {
                    htId: [
                        { required: true, message: '请输入纸质合同编号', trigger: 'blur' }
                    ],
                    uploadUrl: [
                        { required: true, message: '请上传纸质合同', trigger: 'on-change' }
                    ]
                },
                djStatus: [],
                djStatusArr: [],
                buyStatus: [],
                zfStatus: [],
                fhStatus: [],
                fplx: ['其他'],
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                current_user: '',
                is_current: '',
                is_canedit: '',
                is_submit: '',
                is_tj: '',
                is_approve: '',
                is_return: '',
                showApprove: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                },
                approval_task: false,
                tasks: [],
                row_length: 0,
                task_now: 0,
                workFlowWidth: 100
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['change_status', 'buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status', 'fplx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*单据状态*/
                        this.djStatus = res.data.change_status;
                        for (let key in res.data.change_status) {
                            if (res.data.change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.change_status[key]
                                };
                                this.djStatusArr.push(tmpObj);
                            }
                        }
                        /*采购合同单状态*/
                        this.buyStatus = res.data.buy_order_status;
                        /*支付状态*/
                        this.zfStatus = res.data.buy_order_pay_status;
                        /*发货状态*/
                        this.fhStatus = res.data.buy_order_ship_status;
                        /*发票类型*/
                        for (let i in res.data.fplx) {
                            this.fplx.push(res.data.fplx[i]);
                        }
                        /*审批流当前执行人*/
                        this.is_return = this.xgdInfo.create_user_no === this.current_user && this.xgdInfo.change_status == 2;
                        /*当前审批人执行人*/
                        this.is_delete = this.xgdInfo.create_user_no === this.current_user && this.xgdInfo.change_status == 0;
                        isCurrentApprover(this, this.xgd_id).then(result => {
                            isTaskCreater(this, this.xgd_id).then(isTaskCreater => {
                                this.is_approve = (this.xgdInfo.change_status == 1 || this.xgdInfo.change_status == 3) && result && !isTaskCreater;
                                this.is_canedit = ( this.xgdInfo.create_user_no === this.current_user && this.xgdInfo.change_status == 0) || (result && this.xgdInfo.change_status == 3 && isTaskCreater);
                                this.is_submit = isTaskCreater && this.xgdInfo.change_status == 3 && result;
                            });
                        });
                        /*是否可创建执行人*/
                        apiInChangeName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 0).then(canCreater => {
                                    this.is_tj = this.xgdInfo.create_user_no === this.current_user && this.xgdInfo.change_status == 0 && canCreater;
                                });
                            }
                        });
                    }
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.xgd_id
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
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
            redirectOtherPage (pageName, query) {
                apiGetPurchaseReturnPayReadyByChange(this, {
                    order_change_no: this.xgd_id
                }).then(res => {
                    if (res && res.status === 1) {
                        util.redirectPage(this, pageName, query);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getData () {
                //基本信息
                apiGetPurchaseHTeditDetail(this, {
                    params: JSON.stringify({
                        order_change_no: this.xgd_id
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.xgdInfo = res.data.change_info;
                        this.form = res.data.orders_info;
                        this.htInfo.htId = res.data.contract_info.order_attach_no;
                        this.htInfo.file = res.data.contract_info.order_attach;
                        this.htInfo.htName = res.data.contract_info.attach_file_name;
                        this.htInfo.ext = res.data.contract_info.attach_file_ext;
                        this.actTable.data = res.data.product_info;
                        this.goodsAll = res.data.cancel_info.num;
                        this.goodsAllMoney = res.data.cancel_info.amount;
                        this.current_user = Cookies.get('user_no');
                        this.getStatus();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            modal (name) {
                if (name === 'del') {
                    this.publicModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'delcancel';
                    this.publicSure = 'delsure';
                    this.loadding = false;
                } else if (name === 'tj') {
                    this.publicModal = true;
                    this.publicState = '提交';
                    this.publicCancel = 'tjcancel';
                    this.publicSure = 'tjsure';
                    this.loadding = false;
                } else if (name === 'zf') {
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'zfcancel';
                    this.publicSure = 'zfsure';
                    this.loadding = false;
                } else if (name === 'sp') {
                    this.showApprove = true;
                }
            },
            sureAction (name) {
                if (name === 'delcancel') {
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    this.loadding = true;
                    apiGetPurchaseHTeditDelChange(this, {
                        params: JSON.stringify({
                            order_change_no: this.xgd_id
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            util.openNewPage(this, 'purchase_manage_HTedit_index');
                            this.$router.push({
                                name: 'purchase_manage_HTedit_index'
                            });
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.loadding = true;
                    apiGetPurchaseHTeditStatusUpdate(this, {
                        params: JSON.stringify({
                            order_change_no: this.xgd_id,
                            type: 'submit'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                            this.getTask();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiGetPurchaseHTeditStatusUpdate(this, {
                        params: JSON.stringify({
                            order_change_no: this.xgd_id,
                            type: 'invalid'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                            this.getTask();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'spcancel') {
                    this.publicModal = false;
                } else if (name === 'spsure') {
                    purchaseManageApproveAction(this, {
                        order_no: this.xgd_id,
                        is_pass: this.approveDetail.isPass,
                        note: this.approveDetail.note
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.getTask();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            getCount () {
                this.goodsAll = 0;
                this.goodsAllMoney = parseFloat(0).toFixed(4);
                for (let i in this.actTable.data) {
                    this.goodsAll = parseInt(this.goodsAll) + parseInt(this.actTable.data[i].change_num);
//                    this.goodsAllMoney = ((this.goodsAllMoney ) + (this.actTable.data[i].cancel_amount )) ;
                    this.goodsAllMoney = this.add(this.goodsAllMoney, this.actTable.data[i].cancel_amount, 4);
                }
            },
            edit (name) {
                if (name === 'htxx') {
                    this.is_htxx = false;
                } else if (name === 'goods') {
                    this.edit_goods = false;
                }
                else if(name === 'jbxx'){
                    this.is_jbxx = false;
                }
            },
            close (name) {
                if (name === 'htxxCancel') {
                    this.is_htxx = true;
                    this.getData();
                } else if (name === 'htxxSave') {
                    this.$refs.htInfoForm.validate((valid) => {
                        if (valid) {
                            if (this.htInfo.file === '') {
                                this.$Message.error('请上传纸质合同！');
                            } else {
                                apiGetPurchaseHTeditChangeDetail(this, {
                                    params: JSON.stringify({
                                        order_change_no: this.xgd_id,
                                        order_attach_no: this.htInfo.htId,
                                        order_attach: this.htInfo.file
                                    })
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        this.is_htxx = true;
                                        this.getData();
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                });
                            }
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.edit_goods = true;
                    this.getData();
                } else if (name === 'goodsSave') {
//                    var reg = /^\\d+$/;
                    let tmp = [];
                    for (let i in this.actTable.data) {
                        if (!/^\d+$/.test(this.actTable.data[i].change_num)) {
                            this.$Message.error('第' + parseInt(i + 1) + '行的取消数量必须为大于等于0的整数 ');
                            return false;
                        } else if (parseInt(this.actTable.data[i].change_num) > (parseInt(this.actTable.data[i].buy_num) - parseInt(this.actTable.data[i].ship_num))) {
                            this.$Message.error('第' + parseInt(i + 1) + '行的取消数量不能小于采购数量和发货数量之差');
                            return false;
                        } else {
                            tmp.push({id: this.actTable.data[i].id, number: this.actTable.data[i].change_num});
                        }
                    }
                    if (tmp.length != 0) {
                        apiGetPurchaseHTeditProductModify(this, {
                            params: JSON.stringify({
                                list: tmp
                            }),
                            order_change_no: this.xgd_id
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.edit_goods = true;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                }else if (name === 'jbxxCancel'){
                    this.is_jbxx = true;
                    this.getData();
                }else if(name === 'jbxxSave'){

                    apiGetPurchaseHTeditBasicUpdate(this, {
                        params: JSON.stringify({
                            order_change_no: this.xgd_id,
                            note:this.xgdInfo.note
                        }),
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.is_jbxx = true;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });


                }
            },
            numChange (val, buyNum, shipNum, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的取消数量必须是大于等于0的整数');
                } else if (parseInt(val) > (parseInt(buyNum) - parseInt(shipNum))) {
                    this.$Message.error('第' + n + '行的取消数量不能小于采购数量和发货数量之差');
                    return false;
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
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
                        this.htInfo.file = response.data;
                        this.htInfo.name = file.name;
                        this.$Notice.success({
                            title: '文件上传成功',
                            desc: '文件 ' + file.name + ' 上传成功。'
                        });
                    } else {
                        this.$Notice.error({
                            title: '文件上传失败',
                            desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                        });
                    }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getData();
            this.getTask();
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
