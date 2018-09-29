<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    付款信息
                </p>
                <Form :label-width="120" ref="basicForm" :model="form" :rules="basicRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="供应商：" style="margin:0;">
                            {{form.applyer}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{form.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="付款方式：" style="margin:0;" prop="fkfs">
                            <Select v-model="form.fkfs"  placeholder="请选择" style="width:300px;" @on-change="selectWay">
                                <Option v-for="status in zffsArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">

                        <FormItem label="付款银行：" style="margin:0;">
                            {{form.khyh}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="付款账号：" style="margin:0;">
                            {{form.yhzh}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="应付款金额：" style="margin:0;">
                            {{ form.yfje | toDecimal}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="待付款金额：" style="margin:0;">
                            {{form.wfje}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="本次付款金额：" style="margin:0;" prop="pay_money">
                            <Input v-model="form.pay_money"  placeholder="请填写本次付款金额" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;" prop="note">
                            <Input v-model="form.note"  placeholder="备注信息" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:120px;" :loading="loadding" @click="save">保存</Button>
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
    import { apiAllStatus, apiGetPurchaseHtDetail, apiGetPurchaseHTPayAdd, purchaseManageReadyPayMoney } from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请输入本次付款金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到4位！'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    applyer: '',
                    lxr: '',
                    fkfs: '',
                    khyh: '',
                    yhzh: '',
                    yfje: '',
                    wfje: '',
                    pay_money: ''
                },
                info:{
                    'khyh': '',
                    'yhzh': '',
                    'alipay_account': '',
                    'wxpay_account': ''
                },
                htd_id: this.$route.query.param,
                qyrzStatus: '',
                qyrzStatusArr: [],
                zffs: [],
                zffsArr: [],
                basicRules: {
                    fkfs: [
                        { required: true, message: '请选择付款方式', trigger: 'on-change'}
                    ],
                    pay_money: [
                        { required: true, message: '请输入本次付款金额', trigger: 'blur' },
                        {validator: validateMoney, trigger: 'blur'}
                    ]
                },
                loadding: false
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fkfs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*支付方式*/
                        this.zffs = res.data.fkfs;
                        for (let key in res.data.fkfs) {
                            if (res.data.fkfs.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fkfs[key]
                                };
                                this.zffsArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            selectWay (val) {
                if(val === '002' || val === '003'){
                    this.form.khyh = this.info.khyh;
                    this.form.yhzh = this.info.yhzh;
                }
                else if(val === '005'){
                    this.form.khyh = '';
                    this.form.yhzh = this.info.alipay_account;
                }
                else if(val === '006'){
                    this.form.khyh = '';
                    this.form.yhzh = this.info.wxpay_account;
                }
                else{
                    this.form.khyh = '';
                    this.form.yhzh = '';
                }

            },
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
//            zffs
            getData () {
                //基本信息
                apiGetPurchaseHtDetail(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form.applyer = res.data.supplier.gysmc;
                        this.form.apply_no = res.data.supplier.gysbh;
                        this.form.lxr = res.data.supplier.lxr;
                        this.form.yfje = (+res.data.order_info.total_amount).toFixed(4) ;
                        this.info.khyh = res.data.supplier.khyh;
                        this.info.yhzh = res.data.supplier.yhzh;
                        this.info.alipay_account = res.data.supplier.alipay_account;
                        this.info.wxpay_account = res.data.supplier.wxpay_account;

                    }
                });
                purchaseManageReadyPayMoney(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form.wfje = res.data.abled_amount;
                        this.form.pay_money = this.form.wfje;
                    }
                });
            },
            save () {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.loadding = true;
                        apiGetPurchaseHTPayAdd(this, {
                            params: JSON.stringify({
                                buy_order_no: this.htd_id,
                                supplier_no: this.form.apply_no,
                                pay_way_no: this.form.fkfs,
                                bank_name: this.form.khyh,
                                bank_account: this.form.yhzh,
                                real_amount: this.form.pay_money,
                                note: this.form.note
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.loadding = false;
                                this.$Message.success(res.message);
                                closeCurrentPage(this);
                                this.handleClick({param: res.data.order_payment_no, fromAdd: '1'}, 'purchase_manage_FK_detail');
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
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
