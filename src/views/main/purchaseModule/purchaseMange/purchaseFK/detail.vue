<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    采购付款单基本信息
                    <span v-show="show_edit">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('basic')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('basicCancel')">取消</Button>
                            <Button type="primary" @click="close('basicSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <Form :label-width="130" :rules="ruleValidate"  ref="pay_info" :model="pay_info">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购付款单编号：" style="margin:0;">
                            {{ order_payment_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ buypayStatus[pay_info.pay_status] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应付款金额：" style="margin:0;">
                            {{ pay_info.payable_amount }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="付款方式：" style="margin:0;"  v-show="is_edit">
                            <template slot-scope="scope">
                            <span > {{ buypaywayStatus[pay_info.pay_way_no] }}</span>
                            </template>
                        </FormItem>
                        <FormItem label="付款方式：" style="margin:0;" prop="pay_way_no" v-show="!is_edit">
                            <Select v-model="pay_info.pay_way_no"  placeholder="请选择" @on-change="selectWay" filterable >
                                <Option v-for="status in fkfsArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="付款银行：" style="margin:0;" prop="bank_name">
                            <span>{{ pay_info.bank_name }} </span>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="付款账号：" style="margin:0;" prop="bank_account">
                            <span>{{ pay_info.bank_account }} </span>
                        </FormItem>
                        </Col>
                         <Col span="6">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ pay_info.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ pay_info.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6" >
                        <FormItem label="本次付款金额：" style="margin:0;"  v-show="is_edit">
                            <span >{{ pay_info.real_amount }} </span>
                        </FormItem>
                        <FormItem label="本次付款金额：" style="margin:0;" prop="real_amount"  v-show="!is_edit" >
                            <Input type="text" v-model="pay_info.real_amount" placeholder="请填写金额"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="is_indent">
                        <FormItem label="支付凭证：" style="margin:0;">
                            {{ pay_info.pay_identity }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="备注：" style="margin:0;" prop="note">
                            <span v-if="is_edit">{{ pay_info.note }} </span>
                            <Input type="text" v-model="pay_info.note" placeholder="请填写备注" v-else></Input>
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
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购合同单编号：" style="margin:0;">
                            {{ order_info.buy_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ buyorderStatus[order_info.buy_order_status] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="付款状态：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ buyorderPayStatus[order_info.order_pay_status] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发货状态：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ buyorderShipStatus[order_info.ship_status] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商：" style="margin:0;">
                            {{ order_info.supplier_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{ order_info.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发票类型：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ fplxStatus[order_info.invoice_type] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="税率：" style="margin:0;">
                            {{ order_info.buy_tax_rate }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="采购合同单附件：" style="margin:0;">
                            <a  style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + order_info.order_attach" target="_blank">
                            <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>{{order_info.attach_file_name}}.{{order_info.attach_file_ext}}
                            </a>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="备注：" style="margin:0;">
                            {{ order_info.status }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_FK_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="is_del" type="default" class="margin-top-10" style="margin:auto;margin-left:20px;"  @click="modal('del')">删除</Button>
                <Button v-if="is_submit" type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('submit')">提交</Button>
                <Button v-if="is_invalid" type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('invalid')">作废</Button>
                <Button v-if="is_approve" type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('approve')">审批</Button>
                <Button v-if="is_backspace" type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('backspace')">回退</Button>
            </Card>
            </Col>
        </Row>

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
    <Modal v-model="showApprove" title="请选择审批意见" >
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100" :rules="ruleValidate"  ref="approveDetail" :model="approveDetail">
                        <Row>
                            <Col span="24">
                            <FormItem label="审批结果：">
                                <RadioGroup v-model="approveDetail.isPass">
                                <!-- <RadioGroup v-model="approveDetail.isPass" @on-change="change_ispass"> -->
                                    <Radio label="1">同意</Radio>
                                    <Radio label="0">驳回</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col span="24">
                            <FormItem label="审批意见：" prop="note">
                                <Input v-model="approveDetail.note" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
                            </FormItem>
                            </Col>
                            <!-- <Col span="24" v-if="showpayIdentity">
                            <FormItem label="支付凭证：" prop="pay_identity">
                                <Input v-model="approveDetail.pay_identity" type="text" placeholder="请输入支付凭证"></Input>
                            </FormItem>
                            </Col> -->
                        </Row>
                    </Form>
                </Card>
                </col>
            </Row>
             <div slot="footer">
                <Button type="text" @click="cancelApprove">取消</Button>
                <Button type="primary" @click="confirmApprove">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showupdate" title="请输入支付凭证" @on-ok="updateidentity">
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100">
                        <Row>
                            <Col span="18">
                            <FormItem label="支付凭证：">
                                <Input v-model="detail.pay_identity" type="text" placeholder="请输入支付凭证"></Input>
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
    import { apiAllStatus ,apiGetPurchaseFKDetail,apiDeleteFKOrder,apiUpdateStatusFK,apiUpdateInfoFK,purchaseManageGetWorkFlow,purchaseManageApproveAction,apiGetPayModelName,apiUpdatepPayIdentityFK} from '@/config/getData';
    import { notempty, sortBy, setToken,isInCreaters, isCurrentApprover, isFinalApprover,isTaskCreater,isLastApprover,manualCheck
} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请输入本次付款金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('付款金额必须是数字,且最多精确到4位！'));
                } else {
                    callback();
                }
            };
            const validatePay = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入支付凭证！'));
                } else if (value.length>20) {
                    return callback(new Error('支付凭证最长20位！'));
                } else {
                    callback();
                }
            };
            return {
                fromAdd: this.$route.query.fromAdd,
                detail:{},
                manualCheck: manualCheck('finance_home_only'),
                showupdate: false,
                showApprove: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                    // pay_identity: ''
                },
                pay_info:{},
                info:{
                    'khyh': '',
                    'yhzh': '',
                    'alipay_account': '',
                    'wxpay_account': ''
                },
                order_info:{},
                fkdInfo: {
                    status: 'cbdb'
                },
                form: {
                    status: 'sdf'
                },
                order_payment_no: this.$route.query.param,                   //传过来的客户编号
                fplxStatus: '',
                directStatus:'',
                buyorderStatus: '',
                buyorderPayStatus: '',
                buyorderShipStatus: '',
                buypayStatus:'',
                buypaywayStatus: '',
                show_edit: false,
                is_edit: true,
                is_submit: false,
                is_invalid: false,
                is_backspace: false,
                is_approve: false,
                show_edit: false,
                is_del:false,
                showpayIdentity:false,
                is_indent:false,
                publicModal: false,
                loadding: false,
                approval_task: false,
                tasks: [],
                row_length: 0,
                task_now: 0,
                workFlowWidth: 100,
                current: 'no',
                final: 'no',
                publicState: '',
                publicCancel: '',
                publicSure: '',
                fkfsArr: [],
                ruleValidate: {
                    real_amount: [
                        { validator: validateMoney, trigger: 'blur' },
                    ],
                    pay_way_no: [
                        { required: true, message: '付款方式不能空', trigger: 'blur' },
                    ],
                    note: [
                        { required: false, trigger: 'blur' },
                    ]
                    // pay_identity: [
                    //     { required: true,validator: validatePay, trigger: 'blur' },
                    // ]
                }
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            cancelApprove(){
                this.showApprove = false;
            },
            confirmApprove() {  
                isLastApprover(this, this.order_payment_no,0).then(res => {
                    if(res && this.manualCheck){
                        // let argu = { pay_identity: this.approveDetail.pay_identity };      
                        this.$refs.approveDetail.validate((valid) => {
                            if (valid) {
                                purchaseManageApproveAction(this, {
                                    order_no: this.order_payment_no,
                                    is_pass: this.approveDetail.isPass,
                                    note: this.approveDetail.note,
                                    // params: JSON.stringify(argu),
                                }).then(res => {
                                    this.approveDetail = {};
                                    if (res && res.status == 1) {
                                        this.getTask();
                                        this.getData();
                                        this.$Message.success('操作成功');
                                        this.showApprove = false;
                                    } else {
                                        this.$Message.error(res.message);
                                        this.showApprove = false;
                                    }
                                });
                            }
                        });
                    }else{
                        purchaseManageApproveAction(this, {
                            order_no: this.order_payment_no,
                            is_pass: this.approveDetail.isPass,
                            note: this.approveDetail.note
                        }).then(res => {
                            this.approveDetail = {};
                            if (res && res.status == 1) {
                                this.getTask();
                                this.getData();
                                this.$Message.success('操作成功');
                                this.showApprove = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                               
                });       
            },
            change_ispass(){
                if(this.approveDetail.isPass == 0){
                    this.showpayIdentity = false;
                }else{
                    if(this.manualCheck){
                        this.showpayIdentity = true;
                    } 
                }
            },
            updateidentity(){
                this.loadding = true;
                apiUpdatepPayIdentityFK(this, {
                    order_payment_no: this.order_payment_no,
                    pay_identity: this.detail.pay_identity
                }).then(res => {
                    if(res && res.status == 1){
                        this.showApprove = true;
                    }else {
                        this.showupdate = true;
                        this.$Message.error(res.message);
                    }
                });
            },
            selectWay (val) {

                if(val === '002' || val === '003'){
                    this.pay_info.bank_name = this.info.khyh;
                    this.pay_info.bank_account = this.info.yhzh;
                }
                else if(val === '005'){
                    this.pay_info.bank_name = '';
                    this.pay_info.bank_account = this.info.alipay_account;
                }
                else if(val === '006'){
                    this.pay_info.bank_name = '';
                    this.pay_info.bank_account = this.info.wxpay_account;
                }
                else{
                    this.pay_info.bank_name = '';
                    this.pay_info.bank_account = '';
                }

            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx','is_direct','buy_order_status','buy_order_pay_status','buy_order_ship_status','buy_pay_status','fkfs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fplxStatus = res.data.fplx;
                        this.directStatus = res.data.is_direct;
                        this.buyorderStatus = res.data.buy_order_status;
                        this.buyorderPayStatus = res.data.buy_order_pay_status;
                        this.buyorderShipStatus = res.data.buy_order_ship_status;
                        this.buypayStatus = res.data.buy_pay_status;
                        this.buypaywayStatus =  res.data.fkfs;
                        let tmpObj = {};
                        for (let key in res.data.fkfs) {
                            if (res.data.fkfs.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fkfs[key]
                                };
                                this.fkfsArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
             getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.order_payment_no
                }).then(res => {
                    if(res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            getData () {
                this.show_edit=false;
                this.is_edit=true;
                this.is_submit=false;
                this.is_invalid=false;
                this.is_backspace=false;
                this.is_approve=false;
                this.show_edit=false;
                this.is_del=false;
                this.is_indent=false;
                this.showpayIdentity=false;
                let argu = { order_payment_no: this.order_payment_no };
                apiGetPurchaseFKDetail(this, {
                    params: JSON.stringify(argu)
                }).then( res => {
                    
                    if (res.status === 1) {
                        this.pay_info = res.data.pay;                                  
                        this.order_info = res.data.order;

                        this.info.khyh = res.data.pay.khyh;
                        this.info.yhzh = res.data.pay.yhzh;
                        this.info.alipay_account = res.data.pay.alipay_account;
                        this.info.wxpay_account = res.data.pay.wxpay_account;

                        let user_no = Cookies.get('user_no');

                        purchaseManageGetWorkFlow(this, {
                            order_no: this.order_payment_no
                        }).then(res => {
                            if(res && res.status == 1){
                                if(res.data.workflow_status == 1){
                                    this.is_indent = true;
                                }
                            }
                        });

                        if(res.data.pay.pay_status == 0 && user_no == res.data.pay.create_user_no){//待提交且登录人为创建人
                            //获取模型名称
                              this.is_del = true;
                              this.is_edit = true;
                              this.show_edit = true;
                            apiGetPayModelName(this, {
                            }).then(res => {
                                if (res && res.status == 1) {
                                    
                                    //判断是否是任务流创建人
                                    isInCreaters(this, res.data,0).then(res => {
                                        if(res){
                                        this.is_submit = true;
                                        }else{
                                            this.is_submit = false;
                                        }
                                    });
                                }else{
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                        
                        if(res.data.pay.pay_status == 3){//已驳回
                            isTaskCreater (this,this.order_payment_no).then(res =>{
                                if(res){
                                      //获取模型名称
                                    isCurrentApprover(this,this.order_payment_no,0).then(res => {
                                                if(res){//审批任务当前 执行人
                                                    this.is_edit = true;
                                                    this.is_invalid = true;
                                                    this.is_submit = true;
                                                    this.show_edit = true;
                                                }
                                    });   
                                }
                            });
                          
                        }
                        if(res.data.pay.pay_status == 2){//已审批
                        
                            //判断是否是任务流最终审批人
                            isFinalApprover(this, this.order_payment_no,0).then(res => {
                                if(res){
                                    
                                    this.is_backspace = true;
                                    }
                               
                            });
                         }
                            
                        isLastApprover(this, this.order_payment_no,0).then(res => {
                                if(res){
                                    if(this.manualCheck){
                                        this.showpayIdentity = true;
                                    } 
                                }
                               
                            });

                        if(res.data.pay.pay_status == 1 || res.data.pay.pay_status == 3){
                            isTaskCreater (this,this.order_payment_no).then(res =>{
                                if(!res){
                                    //判断是否是任务流当前审批人
                                    isCurrentApprover(this, this.order_payment_no,0).then(res => {
                                        if(res){
                                            this.is_approve = true;
                                        }
                                    });   
                                }
                            }); 
                        }
                    }else {
                        res && this.$Message.error(res.message);
                    }
                });
            },

            edit (name) {
                if (name === 'basic') {
                    this.is_edit = false;
                }
            },
            close (name) {

                if (name === 'basicCancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'basicSave') {
                    if(this.pay_info.pay_way_no == '002'){
                        if(this.pay_info.bank_account == '' || this.pay_info.bank_name == ''){
                            this.is_edit = false;
                            this.$Message.error("付款方式为银行电汇，银行账号和名称不能为空");
                        }
                    }

                    this.$refs.pay_info.validate((valid) => {
                        if (valid) {
                            apiUpdateInfoFK(this, {
                                params: JSON.stringify({
                                    order_payment_no: this.pay_info.order_payment_no,
                                    pay_way_no: this.pay_info.pay_way_no,
                                    bank_name: this.pay_info.bank_name,
                                    bank_account: this.pay_info.bank_account,
                                    real_amount: this.pay_info.real_amount,
                                    note:this.pay_info.note
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.is_edit = true;
                                    this.getData();
                                }else{
                                    this.is_edit = false;
                                    this.$Message.error(res.message);
                                }
                            });
                        }
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
            },
            modal (name) {
                if (name === 'del') {
                    this.publicModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'delcancel';
                    this.publicSure = 'delsure';
                    this.loadding = false;
                }else if(name === 'submit'){
                    this.publicModal = true;
                    this.publicState = '提交';
                    this.publicCancel = 'submitcancel';
                    this.publicSure = 'submitsure';
                    this.loadding = false;
                }else if(name === 'invalid'){
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'invalidcancel';
                    this.publicSure = 'invalidsure';
                    this.loadding = false;
                }else if(name === 'backspace'){
                    this.publicModal = true;
                    this.publicState = '回退';
                    this.publicCancel = 'backspacecancel';
                    this.publicSure = 'backspacesure';
                    this.loadding = false;
                }else if(name === 'approve'){
                    this.showApprove = true;
                }
            },
            sureAction (name){
                if (name === 'delcancel') {
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    this.loadding = true;
                    let argu = { order_payment_no: this.order_payment_no };
                    apiDeleteFKOrder(this, {
                         params: JSON.stringify(argu)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getTask();
                            this.publicModal = false;
                            this.loadding = false;
                            util.openNewPage(this, 'purchase_manage_FK_index');
                            this.$router.push({
                                name: 'purchase_manage_FK_index'
                            });
                            this.$Message.success(res.message);
                        } else {
                            this.$Message.error(res.message);
                        }
                    });

                }else if(name === "submitcancel"){
                    this.publicModal = false;
                }else if(name === "submitsure"){
                    this.loadding = true;
                    apiUpdateStatusFK(this, {
                    params: JSON.stringify(this.notempty({
                        order_payment_no: this.order_payment_no,
                        pay_status:'submit'
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.getTask();
                        this.publicModal = false;
                        this.loadding = false;
                        this.getData();
                        this.$Message.success('提交成功');
                    }else{
                        this.$Message.error(res.message);
                    }
                });
                }else if(name === "invalidcancel"){
                    this.publicModal = false;
                }else if(name === "invalidsure"){
                    this.loadding = true;
                    apiUpdateStatusFK(this, {
                    params: JSON.stringify(this.notempty({
                        order_payment_no: this.order_payment_no,
                        pay_status:'invalid'
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.publicModal = false;
                        this.loadding = false;
                        this.getData();
                        this.getTask();
                        this.$Message.success('作废成功');
                    }else{
                        this.$Message.error(res.message);
                    }
                });
                }else if(name === "backspacecancel"){
                    this.publicModal = false;
                }else if(name === "backspacesure"){
                    this.loadding = true;
                    apiUpdateStatusFK(this, {
                    params: JSON.stringify(this.notempty({
                        order_payment_no: this.order_payment_no,
                        pay_status:'backspace'
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.getTask();
                        this.publicModal = false;
                        this.loadding = false;
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
                }
            },
        },
        created () {
            this.getStatus();
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
                return f.toFixed(2);
            }
        }
    };
</script>
