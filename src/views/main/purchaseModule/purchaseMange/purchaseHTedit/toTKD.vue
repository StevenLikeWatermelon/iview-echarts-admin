<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    退款信息
                </p>
                <Form :label-width="120" ref="basicForm" :model="form" :rules="basicRules">
                    <Row>
                        <Col span="24" style="padding-left:120px;">
                        <span style="font-weight:normal;color:#cf0012;"><Icon type="information-circled" style="margin-right:10px;"></Icon>{{warningText}}</span>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="24">
                            <FormItem label="退款方式：" style="margin:0;" prop="pay_way_no">
                                <Select v-model="form.pay_way_no"  placeholder="请选择" style="width:300px;">
                                    <Option v-for="status in all_pay_ways" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="应退款金额：" style="margin:0;">
                            {{form.payable_amount}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="退款金额：" style="margin:0;" prop="real_amount">
                            <Input v-model="form.real_amount"  placeholder="请填写退款金额" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="说明：" style="margin:0;">
                            <Input type="textarea" v-model="form.note"  placeholder="退款金额与应退款金额不等时，请输入说明" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row v-show="form.payable_amount > 0">
                        <Col span="24" class="margin-top-20" >
                        <Button type="primary" style="margin:auto;margin-left:120px;" :loading="loadding" @click="addReturnpay()">提交</Button>
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
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiGetPurchaseReturnPayReadyByReturn, apiGetPurchaseReturnPayReadyByChange, apiGetPurchaseAddReturnPay } from '@/config/getData';
    import { closeCurrentPage } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
//        name: 'purchase_manage_HT_toTKD',
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请填写退款金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到4位！'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    payable_amount: 0.0000
                },
                order_no: this.$route.query.param,
                type: this.$route.query.type,
                pay_ways: [],
                all_pay_ways: [],
                basicRules: {
                    pay_way_no: [
                        {required: true, message: '请选择退款方式', trigger: 'on-change'}
                    ],
                    real_amount: [
                        {required: true, message: '请输入退款金额', trigger: 'blur'},
                        {validator: validateMoney, trigger: 'blur'}
                    ]
                },
                warningText: '',
                loadding: false
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fkfs'])
                }).then(res => {
                    if (res && res.status === 1) {
                        // 获取成功
                        this.pay_ways = res.data.fkfs;
                        let tmpObj = {};
                        for (let key in res.data.fkfs) {
                            if (res.data.fkfs.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fkfs[key]
                                };
                                this.all_pay_ways.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                 // 获取待采购退款单数据
                if (this.type === 'change') {
                    this.warningText = '相同的采购合同修改单不支持分批多次退款';
                    apiGetPurchaseReturnPayReadyByChange(this, {
                        order_change_no: this.order_no
                    }).then(res => {
                        if (res && res.status === 1) {
                            this.form = res.data;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else {
                    this.warningText = '相同的采购退货单不支持分批多次退款';
                    apiGetPurchaseReturnPayReadyByReturn(this, {
                        order_return_no: this.order_no
                    }).then(res => {
                        if (res && res.status === 1) {
                            this.form = res.data;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                    this.form.pay_way_no = '';
                    this.form.real_amount = '';
                    this.form.note = '';
                }

            },
            backTo () {
                history.go(-1);
            },
            addReturnpay () {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.loadding = true;
                        apiGetPurchaseAddReturnPay(this, {
                            params: JSON.stringify(this.form)
                        }).then(res => {
                            if (res && res.status === 1) {
                                // this.form = res.data;
                                closeCurrentPage(this);
                                this.loadding = false;
                                util.redirectPage(this, 'purchase_manage_TK_detail', {param:res.data.order_payment_no, fromAdd: '1'});
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            }
        },
        redirectOtherPage (pageName, query) {
            util.redirectPage(this, pageName, query);
        },
        created () {
            this.getStatus();
            this.getData();
        },
        filters: {
            // 保留两位小数过滤器
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
