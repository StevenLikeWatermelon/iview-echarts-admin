<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    收款信息
                </p>
                <Form :label-width="120" :model="form" ref="form" :rules="formRules">
                    <Row>
                        <Col span="8">
                        <FormItem label="客户名称：" prop="khmc">
                            <Select v-model="form.khmc"  placeholder="请选择" filterable @on-change="custChoose">
                                <Option v-for="val in customerList" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="客户编号：">
                            <span>{{ form.khbh }}</span>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                        <FormItem label="收款方式：" prop="ways">
                            <Select v-model="form.ways"  placeholder="请选择" filterable @on-change="waysChoosed">
                                <Option v-for="val in gathWaysArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款银行：" prop="bank">
                            <Select v-model="form.bank"  placeholder="请选择" filterable :disabled="canChoose" @on-change="bankChoosed">
                                <Option v-for="val in bankArr" :value="val.receipt_bank" :key="val.receipt_bank">{{ val.receipt_bank }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款账号：">
                            {{ form.account }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                        <FormItem label="收款金额：" prop="gath_money">
                            <Input type="text" v-model="form.gath_money" placeholer="请输入收款金额"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="交易凭证号：">
                            <Input type="text" v-model="form.certi_no" placeholer="请输入交易凭证号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="实际收款日期:" prop="receipt_time">
                                <Date-picker type="date" format="yyyy-MM-dd" v-model="form.receipt_time" placeholder="选择日期" style="width: 200px" @on-change="changeDate"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：">
                            <Input type="textarea" v-model="form.note" placeholer="请输入备注"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24" style="text-align: center;">
                        <Button type="primary" :loading="loading" @click="save">保存</Button>
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
    import { apiGetFinanceAllkh, apiGetFinanceReceiptAdd, apiGetFinanceReceiptBank, apiGetFinanceReceiptType } from '@/config/getData';
    import { notempty, sortBydd } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到2位！'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                form: {
                    khmc: '',
                    khbh: '',
                    ways: '',
                    bank: '',
                    account: '',
                    gath_money: '',
                    certi_no: '',
                    receipt_time:''
                },
                gath_no: this.$route.query.param,
                customerList: [],
                gathWays: [],
                gathWaysArr: [],
                formRules: {
                    khmc: [
                        { required: true, message: '请选择客户名称', trigger: 'on-change' }
                    ],
                    ways: [
                        { required: true, message: '请选择收款方式', trigger: 'on-change' }
                    ],
                    gath_money: [
                        { required: true, message: '请输入收款金额', trigger: 'blur' },
                        {validator: validateMoney, trigger: 'blur'}
                    ],
                    // receipt_time: [
                    //     { required: true, message: '请选择输入实际收款日期', trigger: 'blur' }
                    // ],
                    bank: []
                },
                canChoose: true,
                bankArr: []
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            changeDate(time){
                this.form.receipt_time = time;
            },
            getStatus () {
                apiGetFinanceReceiptType(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.gathWaysArr = [];
                        for (let key in res.data) {
                            if (res.data.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data[key]
                                };
                                this.gathWaysArr.push(tmpObj);
                            }
                        }
                    }
                });
                //获取所有客户
                apiGetFinanceAllkh(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            this.customerList.push({
                                value: item.khbh,
                                label: item.khxx
                            });
                        });
                    }
                });

            },
            waysChoosed (val) {
                if (val == 1 || val == 4 || val == 5) {
                    this.canChoose = false;
                    this.form.bank = '';
                    this.form.account = '';
                    apiGetFinanceReceiptBank(this, {
                        receipt_type: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.bankArr = res.data;
                        }
                    });
                    this.formRules.bank.push({required: true, message: '请选择收款银行', trigger: 'on-change'});
                } else {
                    this.canChoose = true;
                    apiGetFinanceReceiptBank(this, {
                        receipt_type: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            if (res.data.length == 0) {
                                this.form.bank = '';
                                this.form.account = '';
                            } else {
                                this.form.bank = '';
                                this.form.account = res.data[0].receipt_account;
                            }
                        }
                    });
                    this.formRules.bank = [];
                }
            },
            bankChoosed (val) {
                for (let i in this.bankArr) {
                    if (val === this.bankArr[i].receipt_bank) {
                        this.form.account = this.bankArr[i].receipt_account;
                    }
                }
            },
            save () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        apiGetFinanceReceiptAdd(this, {
                            params: JSON.stringify({
                                customer_no: this.form.khmc,
                                receipt_type: this.form.ways,
                                receipt_bank: this.form.bank,
                                receipt_account: this.form.account,
                                receipt_amount: this.form.gath_money,
                                receipt_time: this.form.receipt_time,
                                trans_no: this.form.certi_no,
                                note: this.form.note
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
//                                this.bankArr = res.data;
                                this.handleClick({param: res.data.receipt_no, formAdd: 'add'}, 'gath_order_detail');
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                });
            },
            custChoose (val) {
                this.form.khbh = val;
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
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
