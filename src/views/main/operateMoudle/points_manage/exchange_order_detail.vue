<template>
    <div class="product-info-manage">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        基本信息
                    </p>
                    <Row>
                        <Form :label-width="120">
                            <Col span="6">
                                <FormItem label="积分兑换单编号：">
                                    <span>{{info.redeem_order_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建时间：">
                                    <span>{{info.create_time}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单据状态：">
                                    <span>{{pointsStatusObj[info.redeem_order_status]}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="使用积分数：">
                                    <span>{{info.redeem_integral}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="兑换商品编号：">
                                    <span>{{info.integral_product_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="兑换商品名称：">
                                    <span>{{info.integral_product_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="兑换数量：">
                                    <span>{{info.redeem_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户备注：">
                                    <span>{{info.customer_note}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        客户信息
                    </p>
                    <Row>
                        <Form :label-width="120">
                            <Col span="6">
                                <FormItem label="客户编号：">
                                    <span>{{kh.customer_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户名称：">
                                    <span>{{kh.khmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户联系人：">
                                    <span>{{kh.lxr}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户联系方式：">
                                    <span>{{kh.sjhm}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="所属销售：">
                                    <span>{{kh.seller}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="销售所属部门：">
                                    <span>{{kh.seller_depart}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="所属客服：">
                                    <span>{{kh.server}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="所属客服部门：">
                                    <span>{{kh.server_depart}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        收货信息
                    </p>
                    <Row>
                        <Form :label-width="120">
                            <Col span="6">
                                <FormItem label="收货人：">
                                    <span>{{receive.receiver_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="收货人联系方式：">
                                    <span>{{receive.receiver_phone}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="收货地址：">
                                    <span>{{receive.receiver_address}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row v-show="info.redeem_order_status == '1'" class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        发货信息
                    </p>
                    <Row>
                        <Form :label-width="120">
                            <Col span="6">
                                <FormItem label="发货物流：">
                                    <span>{{ship.ship_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="物流单号：">
                                    <span>{{ship.ship_number}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 10001;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;" @click="backTo">返回</Button>
                <Button type="primary" :loading="loading" style="margin-left:20px;" v-show="info.redeem_order_status == '0'" @click="deliveryAction">发货</Button>
                <Button type="primary" :loading="loading" style="margin-left:20px;" v-show="info.redeem_order_status == '0'" @click="cancelAction">取消</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showUndo"
            title="确认删除"
            @on-ok="confirmUndo"
            @on-cancel="cancelUndo">
            <p>确认取消当前积分兑换单?</p>
        </Modal>  
    </div>
</template>
<script>
    import { apiAllStatus, exchangeDetailApi, exchangeDetailUpdateApi } from '@/config/getData';
    export default {
        data () {
            return {
                showUndo: false,
                info: {
                    redeem_order_status: '',
                },
                kh: {},
                receive: {},
                ship: {},
                pointsStatusObj: {},
            };
        },
        methods: {
            deliveryAction() {
                this.doUpdateAction('1');
            },
            cancelAction() {
                this.showUndo = true;
            },
            cancelUndo() {
                this.showUndo = false;
            },
            confirmUndo() {
                this.doUpdateAction('-1');
            },
            doUpdateAction(type) {
                this.loading = true;
                exchangeDetailUpdateApi(this, {
                    params: JSON.stringify({
                        redeem_order_no: this.$route.query.param,
                        redeem_order_status: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['redeem_order_status',])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        // 积分单据状态
                        this.pointsStatusObj = res.data.redeem_order_status;
                        this.getDetail();
                    }
                });
            },  
            getDetail() {
                exchangeDetailApi(this, {
                    redeem_order_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.info = res.data.info;
                        this.kh = res.data.kh;
                        this.receive = res.data.receive;
                        this.ship = res.data.ship;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },

            backTo () {
                history.go(-1);
            },
        },
        created() {
            this.getStatus();
        }
    };
</script>
