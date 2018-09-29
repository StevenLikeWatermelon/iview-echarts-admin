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
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
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
                        
                        <Col span="6">
                            <FormItem label="可用余额：">
                                <span>{{thdDetail.can_refund_account}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="扣款金额：" prop="deduct_amount">
                                <Input v-model="thdDetail.deduct_amount" placeholder="请输入扣款金额"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="备注：">
                                <Input v-model="thdDetail.note" type="textarea" :rows="3"  placeholder="请输入扣款原因"></Input>
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
    import {apiAllStatus,addBreakRefund, apiCustomerInfoList, apiGetCustomerRemain} from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';

    export default {
        data () {
            return {
                showBank: false,
                loading: false,
                ruleValidate: {
                    customer_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    fund_account: [
                        { required: true, message: '扣款账号不能为空', trigger: 'blur' }
                    ],
                    deduct_amount: [
                        { required: true, message: '扣款金额不能为空', trigger: 'blur' }
                    ]
                }, 
                allCustomerArr: [],    
                refundTypesArr: [], 
                refundBanksArr: [], 
                thdDetail: {
                    customer_no: '',
                    deduct_amount: '',
                    note: '',
                    can_refund_account: '',
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
                apiAllStatus(this, {
                    type: JSON.stringify(['receipt_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        for (let key in res.data.receipt_type) {
                            if (res.data.receipt_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.receipt_type[key]
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
                        addBreakRefund(this, {
                            params: JSON.stringify(this.thdDetail)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'break_refund_detail',{
                                    param: res.data.refund_no,
                                    fromAdd: 1
                                });
                                this.$router.push({
                                    name: 'break_refund_detail',
                                    query: {
                                        param: res.data.deduct_no,
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
