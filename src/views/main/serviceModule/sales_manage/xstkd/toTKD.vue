<style scoped>
  .ivu-input-type textarea{height:50px !important;}
</style>
<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    退款信息
                </p>
                <Form :label-width="120" ref="returnForm" :model="returnForm" :rules="returnRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="退款方式：" style="margin:0;" prop="ways">
                            <Select v-model="returnForm.ways"  placeholder="请选择退款方式" style="width:300px;">
                                <Option v-for="val in returnStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ returnForm.should_amount }}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="退款金额：" style="margin:0;" prop="return_amount">
                            <Input type="text" v-model="returnForm.return_amount" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="说明：" style="margin:0;">
                            <Input type="textarea" v-model="returnForm.note" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="" style="margin:0;">
                            <Button type="primary" class="margin-top-10" style="margin:auto;" @click="submit" :loading="loadding">提交</Button>
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
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import { apiAllStatus, apiSalesRefundCreate, apiSalesRefundReady } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            const validateReturn = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请输入金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('输入的数字最多精确到4位！'));
                } else if (parseFloat(value).toFixed(4) * 10000 > parseFloat(this.returnForm.should_amount).toFixed(4) * 10000) {
                    return callback(new Error('退款金额不能大于应退款金额'));
                } else {
                    callback();
                }
            };
            return {
                storageList: [],
                tkdbh: this.$route.query.param,
                tkdType: this.$route.query.form_order_type,
                returnForm: {
                    ways: '',
                    should_amount: '',
                    return_amount: '',
                    note: ''
                },
                khDetail: {},
                returnStatus: {},
                showDelete: false,
                returnRules: {
                    ways: [
                        { required: true, message: '请选择本次退款方式', trigger: 'on-change' }
                    ],
                    return_amount: [
                        { required: true, message: '请输入退款金额', trigger: 'blur' },
                        {validator: validateReturn, trigger: 'blur'}
                    ],
                },
                returnStatusArr: [],
                loadding: false
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
                    type: JSON.stringify(['zffs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.zffs;
                        let tmpObj = {};
                        for (let key in res.data.zffs) {
                            if (res.data.zffs.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.zffs[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiSalesRefundReady(this, {
                    params: JSON.stringify({
                        order_no: this.tkdbh,
                        form_order_type: this.tkdType,
                        except: '0'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnForm.should_amount = res.data.must_total;
                    }
                });
            },
            submit () {
                this.$refs['returnForm'].validate((valid) => {
                    if (valid) {
                        this.loadding = true;
                        apiSalesRefundCreate(this, {
                            params: JSON.stringify({
                                from_order_no: this.tkdbh,
                                from_order_type: this.tkdType,
                                refund_type: this.returnForm.ways,
                                return_total: this.returnForm.return_amount,
                                note: this.returnForm.note
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                this.loadding = false;
                                this.handleClick({param: res.data.refund_no, type: 'add'}, 'service-xstkd-detail');
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message)
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
                return f.toFixed(2);
            }
        }
    };
</script>
