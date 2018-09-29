<style>
    .service-return .ivu-select-single .ivu-select-selection {
        height: 30px;
    }
</style>
<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    扣款信息
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
                        <FormItem label="违约扣款单编号：">
                            {{ thdDetail.deduct_no }}
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
                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="可用余额：">
                                <span>{{can_refund_account}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="扣款金额：">
                                {{ thdDetail.deduct_amount }}
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic" prop="deduct_amount">
                            <FormItem label="扣款金额：">
                                <Input v-model="thdDetail.deduct_amount" placeholder="请输入扣款金额"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="状态：">
                                {{ returnStatus[thdDetail.deduct_status]}}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" v-show="!isEditBasic">
                            <FormItem label="备注：">
                                {{ thdDetail.note }}
                            </FormItem>
                        </Col>
                        <Col span="24" v-show="isEditBasic">
                            <FormItem label="备注：">
                                <Input v-model="thdDetail.note" type="textarea" :rows="3"  placeholder="请输入备注"></Input>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('break_refund')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="info" class="margin-top-10" style="margin:auto;"  @click="deleteOrder()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-if="canBack" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('2')">回退</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete">
            <p>确认删除该违约扣款单?</p>
        </Modal>  
         <Modal v-model="showAbandon" title="确认废弃">
            <p>确认废弃该违约扣款单?</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbandon">确定</Button>
            </div>
        </Modal> 
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="confirmApprove">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
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
                                         <Input v-model="approveDetail.trans_no" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
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
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import {apiAllStatus,apiBreakRefundDetail, apiCustomerInfoList, purchaseManageWorkFlow, apiBreakRefundDetailUpdate,
            apiBreakRefundModalName, apiBreakRefundDetailDelete, apiBreakRefundDetailEdit, purchaseManageApproveAction, apiGetCustomerRemain} from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, isLastApprover} from '@/config/mUtils';

    export default {
        data () {
            return {
                loading: false,
                showBank: false,
                fromAdd: this.$route.query.fromAdd,
                ruleValidate: {
                    customer_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    deduct_amount: [
                        { required: true, message: '扣款金额不能为空', trigger: 'blur' }
                    ]
                }, 
                allCustomerArr: [], 
                refundTypesObj: {},
                refundTypesArr: [], 
                returnStatus: {}, 
                thdbh: this.$route.query.param,
                can_refund_account: '',
                thdDetail: {
                    deduct_no: '',
                    customer_no: '',
                    customer_name: '',
                    deduct_amount: '',
                    note: '',
                    deduct_status: '',
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
                    type: JSON.stringify(['finance_deduct_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.finance_deduct_status;
                        this.getData();
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
            confirmApprove() {
                purchaseManageApproveAction(this, {
                    order_no: this.$route.query.param,
                    is_pass: this.approveDetail.isPass === '同意' ? 1 : 0,
                    note: this.approveDetail.note
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('审批完成!');
                        this.getWorkFlow();
                        this.getData();
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
                        if (isNaN(this.thdDetail.deduct_amount)) {
                            this.$Message.error('扣款金额必须为数字!');
                            return;
                        }
                        if (+this.thdDetail.deduct_amount > +this.can_refund_account) {
                            this.$Message.error('扣款金额不能大于可扣金额!');
                            return;
                        }
                        apiBreakRefundDetailEdit(this, {
                            deduct_no: this.thdbh,
                            params: JSON.stringify({
                                customer_no: this.thdDetail.customer_no,
                                deduct_amount: this.thdDetail.deduct_amount,
                                note: this.thdDetail.note
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
                        
                    }
                })
            },
            deleteOrder() {
                this.showDelete = true;
            },
            confirmDelete() {
                apiBreakRefundDetailDelete(this, {
                    deduct_no: this.thdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.backToList('break_refund');
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
                    deduct_no: this.$route.query.param,
                    deduct_status: ''
                };
                let typeName = '';
                switch(type) {
                    case '0':
                        this.typeObj.deduct_status = '1';
                        typeName = '提交';
                        break;
                    case '1':
                        this.typeObj.deduct_status = '-2';
                        typeName = '废弃';
                        break;   
                    case '2':
                        this.typeObj.deduct_status = '-1';
                        typeName = '回退';
                        break;         
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    apiBreakRefundDetailUpdate(this, {
                        deduct_no: this.typeObj.deduct_no,
                        deduct_status: this.typeObj.deduct_status
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
                apiBreakRefundDetailUpdate(this, {
                    deduct_no: this.typeObj.deduct_no,
                    deduct_status: this.typeObj.deduct_status
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
                apiBreakRefundDetail(this, {
                    'deduct_no': this.thdbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.thdDetail = res.data;
                        this.getRemain(res.data.customer_no);
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.deduct_status == '0') && (Cookies.get('user_no') === res.data.creater_no);

                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示编辑
                                this.is_edit = ((res.data.deduct_status == '0') && (Cookies.get('user_no') === res.data.creater_no)) || ((res.data.deduct_status == '-1') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName).then(isIn => {
                                        this.canPush = ((res.data.deduct_status == '0') && (Cookies.get('user_no') === res.data.creater_no) && isIn) || ((res.data.deduct_status == '-1') && isTaskCreater && isCurrent);
                                        
                                    });
                                });

                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.deduct_status == '1') || (res.data.deduct_status == '-1')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.deduct_status == '-1') && isTaskCreater && isCurrent;

                                isLastApprover(this, this.$route.query.param).then(isLast => {
                                    //是否是最终审批人
                                    this.canBack = isLast && (res.data.deduct_status == '2');
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
                    apiBreakRefundModalName(this, {}).then(res => {
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
        }
    };
</script>
