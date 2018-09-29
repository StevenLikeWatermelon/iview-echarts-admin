<style>
    .finance-refund .ivu-input-type textarea {
        height: 80px;
    }
</style>
<template>
    <div class="service-return finance-refund">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    退款信息
                </p>
                <div slot="extra" v-show="is_edit">
                    <a @click="editAllBasic" v-show="!isEditBasic">
                        <Icon type="edit"></Icon>
                        编辑
                    </a>
                    <a @click="saveEdit" v-show="isEditBasic">
                        <Icon type="checkmark"></Icon>
                        保存
                    </a>
                    <a  @click="cancelEdit" v-show="isEditBasic" style="margin-left: 15px;">
                        <Icon type="close"></Icon>
                        取消
                    </a>
                </div>  
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="财务退款单编号：">
                            {{ thdDetail.refund_no }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="客户名称：">
                                {{ thdDetail.customer_name }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="客户名称：" prop="customer_no">
                                <Select v-model="thdDetail.customer_no"  placeholder="请选择客户名称" filterable @on-change="getRemain">
                                    <Option v-for="status in allCustomerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户编号：">
                            {{ thdDetail.customer_no }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="退款方式：">
                                {{ refundTypesObj[thdDetail.refund_type] }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="退款方式：" prop="refund_type">
                                <Select v-model="thdDetail.refund_type"  placeholder="请选择退款方式" @on-change="changeBank">
                                    <Option v-for="status in refundTypesArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="退款银行：">
                                {{ thdDetail.refund_bank }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic" v-if="showBank">
                            <FormItem label="退款银行：" prop="refund_bank">
                                <Input v-model="thdDetail.refund_bank" placeholder="请输入退款银行"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="退款账号：">
                                {{ thdDetail.refund_account }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="退款账号：" prop="refund_account">
                                <Input v-model="thdDetail.refund_account" placeholder="请输入退款账号"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="退款金额：">
                                {{ thdDetail.refund_amount }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic" >
                            <FormItem label="退款金额：" prop="refund_amount">
                                <Input v-model="thdDetail.refund_amount" placeholder="请输入退款金额"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="可用余额：">
                                <span>{{can_refund_account}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="状态：">
                                {{ returnStatus[thdDetail.refund_status]}}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" v-show="!isEditBasic">
                            <FormItem label="退款原因：">
                                {{ thdDetail.refund_reason }}
                            </FormItem>
                        </Col>
                        <Col span="24" v-show="isEditBasic">
                            <FormItem label="退款原因：" prop="refund_reason">
                                <Input v-model="thdDetail.refund_reason" type="textarea" :rows="5"  placeholder="请输入退款原因及退款来源单据的编号
例：退款原因：客户退货申请退款
       销售退货单：TH-180101-0001、TH-180101-0002"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                            <FormItem label="创建人：">
                                {{thdDetail.creater_no}}/{{thdDetail.creater_name}}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="创建时间：">
                                {{ thdDetail.create_time }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-show="workFlowArr.length > 0">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        流程跟踪
                    </p>
                    <Steps :current="currentFlow">
                        <Step v-for="item in workFlowArr" :title="item.action" ></Step>
                    </Steps>
                    <Row>
                        <col span="24">
                            <div v-for="item in workFlowArr" :style="{width: workFlowWidth + '%'}" class="purchase-flow-div">
                                <p>{{ item.user_name }}</p>
                                <p>{{ item.time }}</p>
                                <p>{{ item.note }}</p>            
                            </div>
                        </col>
                    </Row>
                </Card>
            </col>
        </Row>          
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('refund_order')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="info" class="margin-top-10" style="margin:auto;"  @click="deleteOrder()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-if="canBack" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('2')">回退</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete">
            <p>确认删除该财务退款单?</p>
        </Modal>  
         <Modal v-model="showAbandon" title="确认废弃">
            <p>确认废弃该财务退款单?</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbandon">确定</Button>
            </div>
        </Modal> 
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="confirmApprove">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="110">
                            <Row>
                                <Col span="24">
                                    <FormItem label="审批结果：">
                                        <RadioGroup v-model="approveDetail.isPass">
                                            <Radio label="同意"></Radio>
                                            <Radio label="驳回"></Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="审批意见：">
                                         <Input v-model="approveDetail.note" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24" v-if="trans_no">
                                    <FormItem label="交易凭证号：">
                                         <Input v-model="approveDetail.trans_no" placeholder="请输入交易凭证号"></Input>
                                    </FormItem>
                                </Col>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import {apiAllStatus,apiFinanceRefundDetail, apiCustomerInfoList, purchaseManageWorkFlow, apiFinanceRefundDetailUpdate,
            apiFinanceRefundModalName, apiFinanceRefundDetailDelete, apiFinanceRefundDetailEdit, purchaseManageApproveAction, apiGetCustomerRemain, apiGetFinanceReceiptType} from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, isLastApprover} from '@/config/mUtils';

    export default {
        data () {
            return {
                showBank: false,
                loading: false,
                fromAdd: this.$route.query.fromAdd,
                ruleValidate: {
                    customer_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    refund_type: [
                        { required: true, message: '退款方式不能为空', trigger: 'blur' }
                    ],
                    refund_bank: [
                        { required: true, message: '退款银行不能为空', trigger: 'blur' }
                    ],
                    refund_account: [
                        { required: true, message: '退款账号不能为空', trigger: 'blur' }
                    ],
                    refund_amount: [
                        { required: true, message: '退款金额不能为空', trigger: 'blur' }
                    ],
                    refund_reason: [
                        { required: true, message: '退款原因不能为空', trigger: 'blur' }
                    ]
                }, 
                trans_no: false,
                allCustomerArr: [], 
                refundTypesObj: {},
                refundTypesArr: [], 
                returnStatus: {}, 
                thdbh: this.$route.query.param,
                can_refund_account: '',
                thdDetail: {
                    customer_no: '',
                    refund_type: '',
                    refund_bank: '',
                    refund_account: '',
                    refund_amount: '',
                    refund_account: '',
                    refund_status: '',
                    refund_reason: '',
                    create_time: '',
                    creater_no: '',
                    creater_name: ''
                },
                is_edit: false,
                isEditBasic: false,
                showDelete: false,
                canDelete: false,
                canPush:false,
                canAbandon: false,
                canApprove: false,
                canBack: false,
                typeObj: {},
                showAbandon: false,
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            getRemain(val) {
                apiGetCustomerRemain(this,{
                    customer_no: val
                }).then(res => {
                    if (res && res.status == 1) {
                        this.can_refund_account = res.data.can_amount;
                    }
                });
            }, 
            changeBank(val) {
                if (val == 1 || val == 4 || val == 5) {
                    this.showBank = true;
                } else {
                    this.showBank = false;
                }
            },             
            getAllcustomer() {
                apiCustomerInfoList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allCustomerArr.push({
                                value: item.khbh,
                                label: item.khmc
                            });
                        });
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['receipt_type', 'finance_refund_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.finance_refund_status;
                        this.refundTypesObj = res.data.receipt_type;
                        apiGetFinanceReceiptType(this, {}).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let tmpObj = {};
                                for (let key in res.data) {
                                    if (res.data.hasOwnProperty(key)) {
                                        tmpObj = {
                                            value: key,
                                            label: res.data[key]
                                        };
                                        this.refundTypesArr.push(tmpObj);
                                    }
                                }
                                this.getData();
                            }
                        });
                    }
                });
            },             
            getWorkFlow() {
                purchaseManageWorkFlow(this, {
                    order_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.workFlowArr = res.data.tracks;
                        this.currentFlow = res.data.current_key;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                    }
                });
            },    
            doApprove() {
                this.showApprove = true;
            },  
            cancelApprove() {
                this.showApprove = false;
            },
            confirmApprove() {
                if (this.trans_no && !this.approveDetail.trans_no) {
                    this.$Message.error('交易凭证号不能为空!');
                    return;
                }
                purchaseManageApproveAction(this, {
                    order_no: this.$route.query.param,
                    is_pass: this.approveDetail.isPass === '同意' ? 1 : 0,
                    note: this.approveDetail.note,
                    params: JSON.stringify({
                        trans_no: this.approveDetail.trans_no
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('审批完成!');
                        this.getWorkFlow();
                        this.getData();
                        this.showApprove = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },                             
            editAllBasic() {
                this.isEditBasic = true;
            },
            cancelEdit() {
                this.isEditBasic = false;
                this.getData();
            },
            saveEdit() {
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        if (isNaN(this.thdDetail.refund_amount)) {
                            this.$Message.error('退款金额必须为数字!');
                            return;
                        }
                        if (+this.thdDetail.refund_amount > +this.can_refund_account) {
                            this.$Message.error('退款金额不能大于可退金额!');
                            return;
                        }
                        let tmpObj = {
                            khbh: this.thdDetail.customer_no,
                            refund_method: this.thdDetail.refund_type,
                            refund_account: this.thdDetail.refund_account,
                            refund_amount: this.thdDetail.refund_amount,
                            refund_reason: this.thdDetail.refund_reason
                        };
                        if (this.showBank) {
                            tmpObj['refund_bank'] = this.thdDetail.refund_bank;
                        }
                        apiFinanceRefundDetailEdit(this, {
                            refund_no: this.thdbh,
                            params: JSON.stringify(tmpObj)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                this.isEditBasic = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                        
                    }
                })
            },
            deleteOrder() {
                this.showDelete = true;
            },
            confirmDelete() {
                apiFinanceRefundDetailDelete(this, {
                    refund_no: this.thdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.backToList('refund_order');
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            updateTH(type) {
                if (type == '0' && this.isEditBasic) {
                    this.$Message.error('提交前请先保存!');
                    return;
                }
                this.typeObj = {
                    refund_no: this.$route.query.param,
                    refund_status: ''
                };
                let typeName = '';
                switch(type) {
                    case '0':
                        this.typeObj.refund_status = '1';
                        typeName = '提交';
                        break;
                    case '1':
                        this.typeObj.refund_status = '-2';
                        typeName = '废弃';
                        break;   
                    case '2':
                        this.typeObj.refund_status = '-1';
                        typeName = '回退';
                        break;         
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    apiFinanceRefundDetailUpdate(this, {
                        refund_no: this.typeObj.refund_no,
                        refund_status: this.typeObj.refund_status
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success( typeName + '成功!');
                            this.getData();
                             this.getWorkFlow(); 
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                }
            },
            cancelAbandon() {
                this.showAbandon = false;
            },
            confirmAbandon() {
                this.loading = true;
                apiFinanceRefundDetailUpdate(this, {
                    refund_no: this.typeObj.refund_no,
                    refund_status: this.typeObj.refund_status
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('废弃成功!');
                        this.showAbandon = false;
                        this.getData();
                         this.getWorkFlow(); 
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            getData () {
                apiFinanceRefundDetail(this, {
                    'refund_no': this.thdbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.thdDetail = res.data.info;
                        this.getRemain(res.data.info.customer_no);
                        if (res.data.info.refund_type == 1 || res.data.info.refund_type == 4 || res.data.info.refund_type == 5) {
                            this.showBank = true;
                        } else {
                            this.showBank = false;
                        }
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.info.refund_status == '0') && (Cookies.get('user_no') === res.data.info.creater_no);

                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示编辑
                                this.is_edit = ((res.data.info.refund_status == '0') && (Cookies.get('user_no') === res.data.info.creater_no)) || ((res.data.info.refund_status == '-1') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName).then(isIn => {
                                        this.canPush = ((res.data.info.refund_status == '0') && (Cookies.get('user_no') === res.data.info.creater_no) && isIn) || ((res.data.info.refund_status == '-1') && isTaskCreater && isCurrent);
                                        
                                    });
                                });

                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.info.refund_status == '1') || (res.data.info.refund_status == '-1')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.info.refund_status == '-1') && isTaskCreater && isCurrent;
                                isLastApprover(this, this.$route.query.param).then(isLast => {
                                    //是否是最终审批人
                                    this.trans_no = isLast;
                                    this.canBack = isLast && (res.data.info.refund_status == '2');
                                });
                            });
                            
                        });     


                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            getModalName() {
                return new Promise(success => {
                    apiFinanceRefundModalName(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {    
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getAllcustomer();
            this.getWorkFlow();
        },
        watch: {
            'approveDetail.isPass' (value) {
                if (value == '同意') {
                    this.trans_no = true;
                } else {
                    this.trans_no = false;
                }
            }
        }
    };
</script>
