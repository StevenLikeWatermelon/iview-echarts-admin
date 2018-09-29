<style scoped>
    .no-margin-bottom{
        margin-bottom: 0;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        基本信息
                    </p>
                    <Form :label-width="120"  :model="returnPayDetail">
                        <Row>
                            <Col span="6">
                                <FormItem label="采购退款单编号：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.order_payment_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单据状态：" class="no-margin-bottom">
                                    <span>{{order_status[returnPayDetail.pay_status]}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="来源类型：" class="no-margin-bottom">
                                <span>{{order_from[returnPayDetail.from_order]}}</span>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="来源单据编号：" class="no-margin-bottom">
                                <span>{{returnPayDetail.from_order_no}}</span>
                            </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="采购合同单编号：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.order_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="供应商：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.gysmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="供应商联系人：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.lxr}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="应退款金额：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.payable_amount}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="实际退款金额：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.real_amount}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="returnPayDetail.pay_status == 6">
                                <FormItem label="退款凭证号：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.pay_identity}}</span>
                                </FormItem>
                            </Col>
                            <Col span="24">
                                <FormItem label="说明：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.note}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建人：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.create_user_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建时间：" class="no-margin-bottom">
                                    <span>{{returnPayDetail.create_time}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList('purchase_manage_TK_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:30px;"
                        @click="finishBtn(returnPayDetail.order_payment_no)"
                        v-show="is_return" v-auth="buttonReturn">退款</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="invalidBtn(returnPayDetail.order_payment_no)" v-show="is_return" v-auth="buttonReturn">作废</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="finishInvalidBtn(returnPayDetail.order_payment_no)" v-show="is_throw" v-auth="buttonZf">作废</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="TKIsShow"
            title="退款"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form :label-width="120" ref="basicForm" :rules="basicRules">
                <Row>
                    <Col span="24">
                    <FormItem label="退款凭证号：" style="margin:0;" prop="pay_identity">
                        <Input v-model="pay_identity"  placeholder="请输入退款凭证号"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { apiGetPurchaseReturnPayDetail, apiAllStatus, apiGetPurchaseReturnPayUpdateStatus } from '@/config/getData';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                loading: false,
                fromAdd: this.$route.query.fromAdd,
                id: this.$route.query.param,
                returnPayDetail: {},
                order_status: [],
                order_from: [],
                TKIsShow: false,
                pay_identity: '',
                orderPaymentNo: '',
                basicRules: {
                    pay_identity: [
                        {required: true, message: '请输入退款凭证号', trigger: 'blur'}
                    ]
                },
                is_return: true,
                is_throw: true,
                buttonReturn: 'purchase-return-button-limit',
                buttonZf: 'purchase-return-button-zf'
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            backTo () {
                history.go(-1);
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_pay_status', 'buy_payment_from'])
                }).then(res => {
                    if (res && res.status === 1) {
                        // 退款状态成功
                        this.order_status = res.data.buy_pay_status;
                        // 退款状态成功
                        this.order_from = res.data.buy_payment_from;
                    }
                });
            },
            getData () {
                apiGetPurchaseReturnPayDetail(this, {
                    order_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status === 1) {
                        // 获取采购退货单详情成功
                        this.returnPayDetail = res.data;
                        this.is_return = this.returnPayDetail.pay_status == 5;
                        this.is_throw = this.returnPayDetail.pay_status == 6;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            invalidBtn (orderPaymentNo) {
                this.loading = true;
                apiGetPurchaseReturnPayUpdateStatus(this, {
                    order_payment_no: orderPaymentNo,
                    operate_type: 'invalid'
                }).then(res => {
                    if (res && res.status === 1) {
                        // 获取采购退货单详情成功
                        this.returnPayDetail = res.data;
                        this.getData();
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            finishInvalidBtn(orderPaymentNo){
                this.loading = true;
                apiGetPurchaseReturnPayUpdateStatus(this, {
                    order_payment_no: orderPaymentNo,
                    operate_type: 'finish_invalid'
                }).then(res => {
                    if (res && res.status === 1) {
                        // 获取采购退货单详情成功
                        this.returnPayDetail = res.data;
                        this.getData();
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            finishBtn (orderPaymentNo) {
                this.TKIsShow = true;
                this.pay_identity = '';
                this.orderPaymentNo = orderPaymentNo;
            },
            ok () {
                apiGetPurchaseReturnPayUpdateStatus(this, {
                    order_payment_no: this.orderPaymentNo,
                    pay_identity: this.pay_identity,
                    operate_type: 'finish'
                }).then(res => {
                    if (res && res.status === 1) {
                        // 获取采购退货单详情成功
                        this.returnPayDetail = res.data;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });

            },
            cancel () {
                this.pay_identity = '';
                this.orderPaymentNo = '';
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>