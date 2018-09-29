<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="销售收款单编号：" style="margin:0;">
                            {{ skdDetail.skd_djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="下单时间：" style="margin:0;">
                            {{ skdDetail.skd_rq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ skdDetail.xshtd_djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应付金额：" style="margin:0;">
                            {{ skdDetail.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="未付金额：" style="margin:0;">
                            {{ skdDetail.wait_money | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="本次收款金额：" style="margin:0;">
                            {{ skdDetail.skje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="支付方式：" style="margin:0;">
                            {{ skdDetail.khzffsmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="凭证号码：" style="margin:0;">
                            {{ skdDetail.pzhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="支付时间：" style="margin:0;">
                            {{ skdDetail.dkrq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ skdDetail.sales2 }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ skdDetail.sales_bm2 }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ skdDetail.customer2 }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ skdDetail.customer_bm2 }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="是否作废：" style="margin:0;">
                            {{ abolishStatus[skdDetail.status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="合同单状态：" style="margin:0;">
                            {{ htdStatus[skdDetail.xshtdzt] }}
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
                            {{ skdDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ skdDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ skdDetail.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ skdDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ skdDetail.sales }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ skdDetail.sales_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ skdDetail.customer }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ skdDetail.customer_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="error" :loading="loading" class="margin-top-10" style="margin:auto;margin-left:20px;" v-show="abolish" v-auth="buttonShow" @click="goAbolish()">作废</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus,apiSkdDetail,apiSkdAbolish } from '@/config/getData';
    import { notempty } from '@/config/mUtils';

    export default {
        data () {
            return {
                buttonShow: 'service-xsskd-detail-abolish-button',
                loading: false,
                abolish: false,
                skdbh: this.$route.query.param,
                skdDetail: {},
                abolishStatus: [],
                htdStatus: [],
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['is_abolish','xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.abolishStatus = res.data.is_abolish;
                        this.htdStatus = res.data.xshtdzt;
                    }
                });
            },
            getData () {
                apiSkdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'skd_djbh': this.skdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.skdDetail = res.data;
                        if(res.data.status != 1){
                            this.abolish = true;
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            //返回上一页
            backTo () {
                history.go(-1);
            },
            //作废
            goAbolish () {
                this.loading = true;
                apiSkdAbolish(this, {
                    params: JSON.stringify(this.notempty({
                        'skd_djbh': this.skdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.skdDetail.status = 1;
                        this.abolish = false;
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
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
