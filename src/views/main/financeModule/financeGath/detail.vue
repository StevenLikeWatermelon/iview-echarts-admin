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
                <Form :label-width="120">
                    <Row>
                        <Col span="8">
                        <FormItem label="财务收款单编号：" style="margin:0;">
                            {{ gath_no }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ form.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="客户编号：" style="margin:0;">
                            <span>{{ form.customer_no }}</span>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款方式：" style="margin:0;">
                            {{ gathWays[form.receipt_type] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款银行：" style="margin:0;">
                            {{ form.receipt_bank }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款账号：" style="margin:0;">
                            {{ form.receipt_account }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款金额：" style="margin:0;">
                            {{ form.receipt_amount }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="交易凭证号：" style="margin:0;">
                            {{ form.trans_no }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="实际收款日期：" style="margin:0;">
                            {{ form.receipt_time }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="状态：" style="margin:0;">
                            {{ receiptStatus[form.receipt_status] }}
                        </FormItem>
                        </Col>
                        <Col span="16">
                        <FormItem label="备注：" style="margin:0;">
                            <span>{{ form.note }}</span>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ form.creater_name }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ form.create_time }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                        <FormItem label="作废人：" style="margin:0;">
                            {{ form.invalid_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="作废时间：" style="margin:0;">
                            {{ form.invalid_time }}
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
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="model('zf')" v-auth="financeRolesShow" v-show="invalidShow">作废</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiGetFinanceReceiptDetail, apiGetFinanceReceiptInvalid } from '@/config/getData';
    import { notempty, sortBy } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                form: {
                },
                gath_no: this.$route.query.param,
                formAdd: this.$route.query.formAdd,
                gathWays: [],
                receiptStatus: [],
                publicModal: false,
                publicState: '',
                loadding: false,
                publicCancel: '',
                publicSure: '',
                financeRolesShow: 'financeRolesDetail',
                invalidShow: false
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['receipt_type', 'finance_receipt_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.gathWays = res.data.receipt_type;
                        this.receiptStatus = res.data.finance_receipt_status;
                    }
                });
            },
            getData () {
                //基本信息
                apiGetFinanceReceiptDetail(this, {
                    receipt_no: this.gath_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data;
//                        this.current_user = Cookies.get('user_no');
                        this.invalidShow = this.form.receipt_type != 6 && this.form.receipt_status == 1;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            model (name) {
                if (name === 'zf') {
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'zfcancel';
                    this.publicSure = 'zfsure';
                    this.loadding = false;
                }
            },
            sureAction (name) {
                if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiGetFinanceReceiptInvalid(this, {
                        params: JSON.stringify({
                            receipt_no: this.gath_no
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            backTo () {
                if ( this.formAdd === 'add') {
                    this.backToList('gath_order');
                } else {
                    history.go(-1);
                }
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
