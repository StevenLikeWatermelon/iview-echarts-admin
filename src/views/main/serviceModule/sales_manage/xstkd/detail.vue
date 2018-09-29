<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
    .service-return .ivu-input {
        height: 30px;
    }
</style>
<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ tkdDetail.refund_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ tkdDetail.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退款单状态：" style="margin:0;">
                            {{ returnStatus[tkdDetail.refund_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ parseFloat(tkdDetail.must_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="实退金额：" style="margin:0;">
                            {{ parseFloat(tkdDetail.return_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="来源单据类型：" style="margin:0;">
                            {{ refundFromType[tkdDetail.from_order_type] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="来源单据编号：" style="margin:0;">
                            {{ tkdDetail.from_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="说明：" style="margin:0;">
                            {{ tkdDetail.note }}
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
                    客户信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="客户编号：" style="margin:0;">
                            {{ khDetail.customer_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ khDetail.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.yhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.xsbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.kfbm }}
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
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="confirm('zf')"  v-show="isShowButton" v-auth="xstkdButtonLimit">作废</Button>
                <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="confirm('tk')" v-show="isShowButton" v-auth="xstkdButtonLimit">退款</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content" style="text-align:center">
                <p style="color:#cf0012;line-height: 40px;">{{publicState}}</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import { apiAllStatus, apiSalesRefundDetail, apiSalesRefundAbolish, apiSalesRefundFinish, confirmHasRrelatedApi } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                storageList: [],
                tkdbh: this.$route.query.param,
                tkdDetail: {},
                khDetail: {},
                returnStatus: {},
                showDelete: false,
                publicModal: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                loadding: false,
                refundFromType: '',
                current_user: '',
                isShowButton: '',
                xstkdButtonLimit: 'service-xstkd-detail-limit'
            };
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_refund', 'sell_refund_from_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_refund;
                        this.refundFromType = res.data.sell_refund_from_type;
                    }
                });
            },
            getData () {
                apiSalesRefundDetail(this, {
                    refund_no: this.tkdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.tkdDetail = res.data.info;
                        this.khDetail = res.data.custom;
                        this.current_user = Cookies.get('user_no');
                        this.isShowButton = this.tkdDetail.refund_status == 0 && this.khDetail.server_no === this.current_user;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            confirm (name) {
                if (name === 'zf') {
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'zfcancel';
                    this.publicSure = 'zfsure';
                    this.loadding = false;
                } else if (name === 'tk') {
                    if (this.tkdDetail.from_order_type == '1') {
                        confirmHasRrelatedApi(this, {
                            params: JSON.stringify({
                                refund_no: this.$route.query.param
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.publicState = '确认退款？';
                                this.publicModal = true;
                                this.publicCancel = 'tkcancel';
                                this.publicSure = 'tksure';
                                this.loadding = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                    } else {
                        this.publicModal = true;
                        this.publicCancel = 'tkcancel';
                        this.publicSure = 'tksure';
                        this.loadding = false;
                        this.publicState = '确认退款？';
                    }
                }
            },
            sureAction (name) {
                if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiSalesRefundAbolish(this, {
                        params: JSON.stringify({
                            refund_no: this.tkdbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getData();
                            this.loadding = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tkcancel') {
                    this.publicModal = false;
                } else if (name === 'tksure') {
                    this.loadding = true;
                    apiSalesRefundFinish(this, {
                        params: JSON.stringify({
                            refund_no: this.tkdbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getData();
                            this.loadding = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            backTo () {
                if (this.$route.query.type === 'add') {
                    this.handleClick('', 'service-sales-tkd');
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
                return f.toFixed(2);
            }
        }
    };
</script>
