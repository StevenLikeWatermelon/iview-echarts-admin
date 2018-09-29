<style>
    .service-return .ivu-select-single .ivu-select-selection {
        height: 30px;
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
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                            <FormItem label="客户名称：" prop="khbh">
                                <Select v-model="thdDetail.khbh"  placeholder="请选择客户名称" filterable @on-change="getRemain">
                                    <Option v-for="status in allCustomerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户编号：">
                            {{ thdDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="退款方式：" prop="refund_type">
                                <Select v-model="thdDetail.refund_type"  placeholder="请选择退款方式" @on-change="changeBank">
                                    <Option v-for="status in refundTypesArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6" v-if="showBank">
                            <FormItem label="退款银行：" prop="refund_bank">
                                <Input v-model="thdDetail.refund_bank" placeholder="请输入退款银行"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="退款账号：" prop="refund_account">
                                <Input v-model="thdDetail.refund_account" placeholder="请输入退款账号"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="可用余额：">
                                <span>{{thdDetail.can_refund_account}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="退款金额：" prop="refund_amount">
                                <Input v-model="thdDetail.refund_amount" placeholder="请输入退款金额"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="退款原因：" prop="refund_reason">
                                <Input v-model="thdDetail.refund_reason" type="textarea" :rows="5"  placeholder="请输入退款原因及退款来源单据的编号
例：退款原因：客户退货申请退款
       销售退货单：TH-180101-0001、TH-180101-0002"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>        
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;" :loading="loading" @click="saveAdd()">保存</Button>
            </Card>
            </Col>
        </Row> 
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import {apiAllStatus,addFinanceRefund, apiCustomerInfoList, apiGetCustomerRemain, apiGetFinanceReceiptType} from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';

    export default {
        data () {
            return {
                showBank: false,
                loading: false,
                ruleValidate: {
                    khbh: [
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
                allCustomerArr: [],    
                refundTypesArr: [], 
                refundBanksArr: [], 
                thdDetail: {
                    khbh: '',
                    refund_type: '',
                    refund_bank: '',
                    can_refund_account: '',
                    refund_account: '',
                    refund_amount: '',
                    refund_reason: ''
                }
            };
        },
        methods: {
           
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
            getRemain(val) {
                apiGetCustomerRemain(this,{
                    customer_no: val
                }).then(res => {
                    if (res && res.status == 1) {
                        this.thdDetail.can_refund_account = res.data.can_amount;
                    }
                });
            },                                
            saveAdd() {
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        addFinanceRefund(this, {
                            params: JSON.stringify(this.thdDetail)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'refund_order_detail',{
                                    param: res.data.refund_no,
                                    fromAdd: 1
                                });
                                this.$router.push({
                                    name: 'refund_order_detail',
                                    query: {
                                        param: res.data.refund_no,
                                        fromAdd: 1
                                    }
                                });
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                        
                    }
                })
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getAllcustomer();
        }
    };
</script>
