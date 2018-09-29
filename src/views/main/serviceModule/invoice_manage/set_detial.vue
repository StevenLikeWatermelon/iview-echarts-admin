<template>
    <div class="query-detail">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                     <span>发票信息</span>
                     <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-show="!isEdit && isToCheck" v-auth="manageButton"  @click="edit()"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                            <span style="font-weight:normal;float:right;">
                                <Button type="default"  v-show="isEdit" v-auth="manageButton" @click="cancel()">取消</Button>
                                <Button type="primary"  v-show="isEdit" @click="save('invoiceDetail')" :loading="loading" v-auth="manageButton">保存</Button>
                            </span>
                </p>
                <Form ref="invoiceDetail" :model="invoiceDetail" :rules="InvoinceFormRule" :label-width="110" :show-message="false">
                    <FormItem label="发票类型："  v-show="!isEdit">
                        <span>{{invoiceDetail.displayType}}</span>
                    </FormItem>
                    <FormItem label="发票类型"  v-show="isEdit">
                        <Select v-model="invoiceDetail.type" style="width:200px;" placeholder="请选择类型" @on-change="changeRequire">
                            <Option v-for="item in invoinceTypeArrForm" :value="item.value" :label="item.label" :key="item.value" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="发票抬头："  v-show="!isEdit">
                        <span>{{invoiceDetail.start}}</span>
                    </FormItem>
                    <FormItem prop="start" label="发票抬头："  v-show="isEdit">
                        <Input type="text" v-model="invoiceDetail.start" placeholder="发票抬头"></Input>
                    </FormItem>
                    <FormItem label="纳税人识别码：" v-show="!isEdit">
                        <span>{{invoiceDetail.taxpayerNum}}</span>
                    </FormItem>
                    <FormItem  prop="taxpayerNum" label="纳税人识别码：" v-show="isEdit">
                        <Input type="text" v-model="invoiceDetail.taxpayerNum" placeholder="发票抬头"></Input>
                    </FormItem>
                    <FormItem label="注册地址：" v-show="!isEdit">
                        <span>{{invoiceDetail.registerAdressDetail}}</span>
                    </FormItem>
                    <FormItem prop="registerAdressDetail" label="注册地址：" v-show="isEdit" :rules="{required: isRequired, message: '请输入注册地址', trigger: 'blur' }" class="delete-class">
                         <Input type="text" v-model="invoiceDetail.registerAdressDetail" placeholder="注册地址："></Input>
                    </FormItem>
                    <FormItem label="注册电话：" v-show="!isEdit">
                        <span>{{invoiceDetail.registerPhone}}</span>
                    </FormItem>
                    <FormItem prop="registerPhone" label="注册电话：" v-show="isEdit" :rules="{required: isRequired, message: '请输入注册电话', trigger: 'blur' }" class="delete-class">
                         <Input type="text" v-model="invoiceDetail.registerPhone" placeholder="注册电话："></Input>
                    </FormItem>
                    <FormItem label="开户银行：" v-show="!isEdit">
                        <span>{{invoiceDetail.openAccountBank}}</span>
                    </FormItem>
                    <FormItem prop="openAccountBank" label="开户银行：" v-show="isEdit" :rules="{required: isRequired, message: '请输入开户银行', trigger: 'blur' }" class="delete-class">
                         <Input type="text" v-model="invoiceDetail.openAccountBank" placeholder="开户银行："></Input>
                    </FormItem>
                    <FormItem label="银行账号：" v-show="!isEdit">
                        <span>{{invoiceDetail.bankAccount}}</span>
                    </FormItem>
                    <FormItem prop="bankAccount" label="银行账号：" v-show="isEdit" :rules="{required: isRequired, message: '请输入银行账号', trigger: 'blur' }" class="delete-class">
                         <Input type="text" v-model="invoiceDetail.bankAccount" placeholder="银行账号："></Input>
                    </FormItem>

                </Form>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="checkInvoice('yes')" v-show="isToCheck" v-auth="buttonLimit">审核通过</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="checkInvoice('no')" v-show="isToCheck" v-auth="buttonLimit">审核驳回</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { invoiceDetailApi, apiAllStatus, addEditInvoince, invoiceCheckApi } from '@/config/getData';
    export default {
        name: 'order-manage-detail',
        data () {
            return {
                isEdit: false,
                isRequired: false,
                loading: false,
                manageButton: 'service-invoince-edit-button',
                buttonLimit: 'service-invoice-set-limit',
                invoiceDetail: {
                    id: 0,
                    khbh: '',
                    type: '',
                    start: '',
                    displayType: '',
                    taxpayerNum: '',
                    registerAdressDetail: '',
                    registerPhone: '',
                    openAccountBank: '',
                    bankAccount: '',
                    isDefault: 0,
                    isDefaultDisplay: '否',
                },
                copyDetail: {},
                InvoinceFormRule: {
                    start: [{ required: true, trigger: 'blur' }],
                    taxpayerNum: [{ required: true, trigger: 'blur' }],
                },
                invoiceDetailType: {},
                invoinceTypeArrForm:[]
            };
        },
        computed: {
            isToCheck() {
                return this.$route.query.status == '0' ? true : false
            }
        },
        methods: {
            getStatus() {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx'])
                }).then(res => {
                    let tmpObj={};
                    this.invoiceDetailType = res.data.fplx;
                    for (let key in res.data.fplx) {
                        if (res.data.fplx.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.fplx[key]
                            };
                            this.invoinceTypeArrForm.push(tmpObj);
                        }
                    }
                });
            },
            getData () {
                invoiceDetailApi(this, {
                    params: JSON.stringify({
                        swdjzh: this.$route.query.queryNumber,
                        id: this.$route.query.id
                    })
                }).then(res => {
                    this.invoiceDetail.id = res.data.detail.id;
                    this.invoiceDetail.khbh = res.data.detail.khbh;
                    this.invoiceDetail.type = res.data.detail.fplxbh;
                    if (this.invoiceDetail.type == 1) {
                        this.changeRequire(this.invoiceDetail.type);
                    }
                    this.invoiceDetail.displayType = this.invoiceDetailType[res.data.detail.fplxbh] ? this.invoiceDetailType[res.data.detail.fplxbh] : '--';
                    this.invoiceDetail.start = res.data.detail.fptt;
                    this.invoiceDetail.taxpayerNum = res.data.detail.swdjzh;
                    this.invoiceDetail.registerAdressDetail = res.data.detail.kpdz;
                    this.invoiceDetail.registerPhone = res.data.detail.kpdhhm;
                    this.invoiceDetail.openAccountBank = res.data.detail.jbkhyhmc;
                    this.invoiceDetail.bankAccount = res.data.detail.jbkhzh;
                    this.invoiceDetail.isDefault = res.data.detail.sfmr;
                    this.invoiceDetail.isDefaultDisplay = res.data.detail.sfmr == 0 ? '否' : '是';
                })
            },
            checkInvoice(type) {
                invoiceCheckApi(this, {
                    params: JSON.stringify({
                        swdjzh: this.$route.query.queryNumber,
                        id: this.$route.query.id,
                        audit_status: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message && this.$Message.success(res.message);
                        this.backTo();
                    } else {
                        this.$Message && this.$Message.error(res.message);
                    }
                })
            },
            changeRequire  (value) {
                let allrequired = document.getElementsByClassName('delete-class');
                let i = 0;
                if (value == 1 && allrequired && allrequired.length) { //目前发票类型写死1，与后端已沟通不改样式id
                    for (i = 0; i < allrequired.length; i++) {
                        allrequired[i].setAttribute('class', 'delete-class ivu-form-item ivu-form-item-required');
                    }
                    this.isRequired = true;
                } else {
                    if (allrequired && allrequired.length) {
                        for (i = 0; i < allrequired.length; i++) {
                            allrequired[i].setAttribute('class', 'delete-class ivu-form-item');
                        }
                        this.isRequired = false;
                    }
                }
            },
            edit() {
                this.isEdit = true;
                this.copyDetail = JSON.parse(JSON.stringify(this.invoiceDetail));
            },
            save(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('表单校验错误,请检查');
                        return;
                    } else {
                        this.loading = true;
                        addEditInvoince(this, {
                            params: JSON.stringify({
                                id: this.invoiceDetail.id,
                                khbh: this.invoiceDetail.khbh,
                                fplxbh: this.invoiceDetail.type,
                                fptt: this.invoiceDetail.start,
                                swdjzh: this.invoiceDetail.taxpayerNum,
                                kpdz: this.invoiceDetail.registerAdressDetail,
                                kpdhhm: this.invoiceDetail.registerPhone,
                                jbkhyhmc: this.invoiceDetail.openAccountBank,
                                jbkhzh: this.invoiceDetail.bankAccount,
                                sfmr: 1,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message && this.$Message.success(res.message);
                                this.loading = false;
                                this.getData();
                                this.isEdit = false;
                            } else {
                                this.$Message && this.$Message.error(res.message);
                                this.loading = false;
                            }
                        }, error => {
                            this.$Message && this.$Message.error(res.message);
                            this.loading = false;
                        });
                    }
                });
            },
            cancel() {
                this.invoiceDetail = JSON.parse(JSON.stringify(this.copyDetail));
                this.isEdit = false;
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
