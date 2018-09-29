<style>
    
</style>

<template>
    <Row class="margin-top-10">
        <col span="24">
            <Card>
                <p slot="title">
                    合作约定内容
                </p>
                <div slot="extra" v-auth="buttonAuth">
                    <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="!isEdit" @click.stop="editInfo">修改</span>
                    <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEdit" @click.stop="saveInfo">保存</span>
                    <span style="color: rgb(45, 140, 240);cursor: pointer;padding-left:10px;" v-show="isEdit" @click.stop="cancelEditInfo">取消</span>
                </div>
                <Row v-show="!isEdit">
                    <Form :label-width="120">
                        <Col span="24">
                            <FormItem label="承诺年采购额：">
                               <span>{{contentInfo.agree_year_amount}}元</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="供货额外支持内容：">
                               <span>{{contentInfo.supply_extra_support}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24" style="border-top: 1px dashed #ccc;padding-top: 20px;">
                            <FormItem label="支持发货方式：">
                               <span>{{contentInfo.display_support_ship_type}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24" style="border-bottom: 1px dashed #ccc;margin-bottom: 20px;">
                            <FormItem label="发货收费标准：">
                               <span>{{contentInfo.ship_charge_norm}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="付款结算方式：">
                               <span>{{contentInfo.display_payment_settle_type}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="支持付款方式：">
                               <span>{{contentInfo.display_support_payment_type}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="预付款订货内容：">
                               <span>{{contentInfo.prepayment_order_content}}</span>
                            </FormItem>
                        </Col>
                    </Form>
                </Row>
                <Row v-show="isEdit">
                    <Form :label-width="120"   ref="contentInfo" :model="contentInfo" :rules="ruleValidateStorage">
                        <Col span="24">
                            <FormItem label="承诺年采购额：">
                               <Input v-model="contentInfo.agree_year_amount" placeholder="请输入承诺年采购额" style="width:40%;min-width:260px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="供货额外支持内容：">
                                <Input type="textarea" :rows="3" v-model="contentInfo.supply_extra_support" placeholder="请输入供货额外支持内容" style="width:40%;min-width:260px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="24" style="border-top: 1px dashed #ccc;padding-top: 20px;">
                            <FormItem label="支持发货方式：" prop="support_ship_type">
                                <Select v-model="contentInfo.support_ship_type" multiple style="width:40%;min-width:260px">
                                    <Option v-for="item in allShipType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24" style="border-bottom: 1px dashed #ccc;margin-bottom: 20px;">
                            <FormItem label="发货收费标准：" prop="ship_charge_norm">
                                <Input type="textarea" :rows="3" v-model="contentInfo.ship_charge_norm" placeholder="请输入发货收费标准" style="width:40%;min-width:260px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="付款结算方式：" prop="payment_settle_type">
                               <Select v-model="contentInfo.payment_settle_type" multiple style="width:40%;min-width:260px">
                                    <Option v-for="item in allSettleType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="支持付款方式：" prop="support_payment_type">
                               <Select v-model="contentInfo.support_payment_type" multiple style="width:40%;min-width:260px">
                                    <Option v-for="item in allPaymentType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="预付款订货内容：">
                                <Input type="textarea" :rows="3" v-model="contentInfo.prepayment_order_content" placeholder="请输入预付款订货内容" style="width:40%;min-width:260px"></Input>
                            </FormItem>
                        </Col>
                    </Form>
                </Row>
            </Card>
        </col>
    </Row>
</template>

<script>
    import { apiGetSupplyContent, apiAllStatus, apiEditSupplyContent } from '@/config/getData';
    export default {
        data () {
            return {
                buttonAuth: 'apply_detail_content_edit_button',
                isEdit: false,
                allShipType: [],
                allShipObj: {},
                allSettleType: [],
                allSettleObj: {},
                allPaymentType: [],
                allPaymentObj: {},
                contentInfo: {
                    supplier_no: this.$route.query.param,
                    agree_year_amount: '',
                    supply_extra_support: '',
                    support_ship_type: [],
                    display_support_ship_type: '',
                    ship_charge_norm: '',
                    payment_settle_type: [],
                    display_payment_settle_type: '',
                    support_payment_type: [],
                    display_support_payment_type: '',
                    prepayment_order_content: '',
                },

                ruleValidateStorage: {
                    support_ship_type: [
                        { required: true, message: '授权证书不能为空', trigger: 'blur',  type: 'array' }
                    ],
                    ship_charge_norm: [
                        { required: true, message: '发货收费标准不能为空', trigger: 'blur'}
                    ],
                    payment_settle_type: [
                        { required: true, message: '付款结算方式不能为空', trigger: 'blur',  type: 'array' }
                    ],
                    support_payment_type: [
                        { required: true, message: '支持付款方式不能为空', trigger: 'blur',  type: 'array' }
                    ]
                }
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['support_ship_type', 'payment_settle_type', 'support_payment_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allShipObj = res.data.support_ship_type;
                        this.allSettleObj = res.data.payment_settle_type;
                        this.allPaymentObj = res.data.support_payment_type;
                        let tmpObj = {};
                        for (let key in res.data.support_ship_type) {
                            if (res.data.support_ship_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.support_ship_type[key]
                                };
                                this.allShipType.push(tmpObj);
                            }
                        }
                        for (let key in res.data.payment_settle_type) {
                            if (res.data.payment_settle_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.payment_settle_type[key]
                                };
                                this.allSettleType.push(tmpObj);
                            }
                        }
                        for (let key in res.data.support_payment_type) {
                            if (res.data.support_payment_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.support_payment_type[key]
                                };
                                this.allPaymentType.push(tmpObj);
                            }
                        }
                        this.getDetail();
                    }
                });
            }, 
            getDetail() {
                let tmpArr = [];
                apiGetSupplyContent(this, {
                    supplier_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.contentInfo.agree_year_amount = res.data.agree_year_amount;
                        this.contentInfo.supply_extra_support = res.data.supply_extra_support;
                        this.contentInfo.support_ship_type = res.data.support_ship_type ? res.data.support_ship_type.split(',') : [];

                        tmpArr = [];
                        this.contentInfo.support_ship_type.forEach(item => {
                            if (this.allShipObj[item]) {
                                tmpArr.push(this.allShipObj[item]);
                            }
                        });

                        this.contentInfo.display_support_ship_type = tmpArr.join(',');
                        this.contentInfo.ship_charge_norm = res.data.ship_charge_norm;
                        this.contentInfo.payment_settle_type = res.data.payment_settle_type ? res.data.payment_settle_type.split(',') : [];

                        tmpArr = [];
                        this.contentInfo.payment_settle_type.forEach(item => {
                            if (this.allSettleObj[item]) {
                                tmpArr.push(this.allSettleObj[item]);
                            }
                        });
                        this.contentInfo.display_payment_settle_type = tmpArr.join(',');

                        this.contentInfo.support_payment_type = res.data.support_payment_type ? res.data.support_payment_type.split(',') : [];

                        tmpArr = [];
                        this.contentInfo.support_payment_type.forEach(item => {
                            if (this.allPaymentObj[item]) {
                                tmpArr.push(this.allPaymentObj[item]);
                            }
                        });
                        this.contentInfo.display_support_payment_type = tmpArr.join(',');

                        this.contentInfo.prepayment_order_content = res.data.prepayment_order_content;
                    }
                });
            },
            editInfo() {
                this.isEdit = true;
            },
            cancelEditInfo() {
                this.getDetail();
                this.isEdit = false;
            },
            saveInfo() {
                this.$refs['contentInfo'].validate(valid => {
                    if (valid) {
                        apiEditSupplyContent(this, {
                            params: JSON.stringify(this.contentInfo)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('修改成功!');
                                this.getDetail();
                                this.isEdit = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            }
        },
        created() {
            this.getStatus();
        }
    };
</script>