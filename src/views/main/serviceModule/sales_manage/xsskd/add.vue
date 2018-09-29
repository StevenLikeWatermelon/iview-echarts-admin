<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <span>收款</span>
                </p>
                <Form :label-width="120" ref="receiveForm" :model="skxx" :rules="receiveRules"> <!---->
                    <Row>
                        <Col span="24">
                        <FormItem label="收款方式：" style="margin:0;">
                            <Select v-model="skxx.skfs" style="width: 200px;" disabled="true">
                                <Option v-for="(value, key) in zffs" :value="key" :key="key">{{ value }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="应付金额：" style="margin:0;">
                            <span style="font-size:16px;color: #cf0012;">{{must_total | toDecimal}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="未付款金额：" style="margin:0;">
                            <span style="font-size:16px;color: #cf0012;">{{to_pay_total | toDecimal}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="本次收款金额：" style="margin:0;" prop="skje">
                            <Input v-model="skxx.skje" style="width: 200px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="当前资金池余额：" style="margin:0;">
                            {{ funds_can_total | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:120px;" :loading="loading" @click="save">保存</Button>
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
    import { apiAllStatus, apiSkdCollect } from '@/config/getData';
    import util from '@/libs/util';
    export default {
        data () {
            const validateSkje = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (value === '') {
                    return callback(new Error('请输入金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('输入的数字最多精确到2位！'));
                } else if (parseFloat(value).toFixed(2) * 100 > parseFloat(this.to_pay_total).toFixed(2) * 100) {
                    return callback(new Error('本次收款不能大于未收款金额'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                zffs: [],
                skxx: {
                    skfs: '1',
                    skje: ''
                },
                receiveRules: {
                    skje: [
                        { required: true, message: '请输入本次收款金额', trigger: 'blur' },
                        {validator: validateSkje, trigger: 'blur'}
                    ]
                },
                djbh: this.$route.query.param,
                must_total: this.$route.query.must_total,
                to_pay_total: this.$route.query.to_pay_total,
                funds_can_total: this.$route.query.funds_can_total,
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['zffs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.zffs = res.data.zffs;
                    }
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
            },
            save () {
                this.$refs.receiveForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        apiSkdCollect(this, {
                            params: JSON.stringify({
                                htd_djbh: this.djbh,
                                skfs: this.skxx.skfs,
                                skje: this.skxx.skje
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.handleClick('', 'service-sales-htd-detail');
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
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
                return f.toFixed(2);
            }
        }
    };
</script>