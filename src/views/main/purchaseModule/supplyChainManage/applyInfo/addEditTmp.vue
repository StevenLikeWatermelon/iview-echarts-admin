<style>
    
</style>

<template>
    <Form :label-width="120"  ref="applyInfo" :model="applyInfo" :rules="ruleValidate">
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <!-- <Icon type="bookmark"></Icon> -->
                        基本信息
                    </p>
                    <Row>
                        <Col span="6">
                            <FormItem label="供应商编号：" v-if="isFromDetail">
                                <span>{{isFromDetail}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="供应商名称：" prop="gysmc">
                                <Input v-model="applyInfo.gysmc" @blur="trimNull(applyInfo.gysmc)" placeholder="请输入供应商名称"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="状态：" v-if="isFromDetail">
                                <span>{{applyInfo.displayStatus}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="重要等级：" prop="khdj">
                                <Select v-model="applyInfo.khdj">
                                    <Option v-for="status in allApplyDegree" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="供应商类型：" prop="gyslx">
                                <Select v-model="applyInfo.gyslx">
                                    <Option v-for="status in allApplyTypes" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="供应商属性：" prop="gyssx">
                                <Select v-model="applyInfo.gyssx">
                                    <Option v-for="status in allApplyAttr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="创建人："  v-if="isFromDetail">
                                <span>{{applyInfo.create_user_name}}</span>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="创建时间："  v-if="isFromDetail">
                                <span>{{applyInfo.barq}}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <!-- <Icon type="bookmark"></Icon> -->
                        企业信息
                    </p>
                    <Row>
                        <Col span="6">
                        <FormItem label="法人代表：" prop="frdb">
                            <Input v-model="applyInfo.frdb" placeholder="请输入法人代表"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="注册时间：" prop="zcsj">
                            <DatePicker type="datetime" :value="applyInfo.zcsj" placeholder="请选择时间" style="width: 200px" @on-change="changeDate"></DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="联系地址区域：" prop="lxdz_sfbh">
                            <Cascader :data="allAddressArr" :value="selectdCities" filterable @on-change="getCurrentAddress"></Cascader>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="详细地址明细：" prop="lxdz">
                            <Input v-model="applyInfo.lxdz" placeholder="请输入详细联系地址"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="联系人：" prop="lxr">
                            <Input v-model="applyInfo.lxr" placeholder="请输入联系人"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="联系人手机号：" prop="sjhm">
                            <Input v-model="applyInfo.sjhm" placeholder="请输入联系人手机号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="联系电话：">
                            <Input v-model="applyInfo.dhhm" placeholder="请输入联系电话"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="传真号码：">
                            <Input v-model="applyInfo.czhm" placeholder="请输入传真号码"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="qq：">
                            <Input v-model="applyInfo.qq" placeholder="请输入qq"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="邮箱：" prop="email">
                            <Input v-model="applyInfo.email" placeholder="请输入邮箱"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <!-- <Icon type="bookmark"></Icon> -->
                        财务信息
                    </p>
                    <Row>
                        <Col span="6">
                        <FormItem label="开户银行：" prop="khyh">
                            <Input v-model="applyInfo.khyh" placeholder="请输入开户银行"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="银行账号：" prop="yhzh">
                            <Input v-model="applyInfo.yhzh" placeholder="请输入银行账号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商税号：" prop="gyssh">
                            <Input v-model="applyInfo.gyssh" placeholder="请输入供应商税号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="支付宝支付账号：">
                            <Input v-model="applyInfo.alipay_account" placeholder="请输入支付宝支付账号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="微信支付账号：">
                            <Input v-model="applyInfo.wxpay_account" placeholder="请输入微信支付账号"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Card>
            </col>
        </Row>
    </Form>
</template>

<script>
    import util from '@/libs/util';
    import { apiMapDetail, apiAllStatus, apiAllBrands, purchaseAddApply, apiGetPurchaseSupplierDetail, apiGetPurchaseSupplierDetailEdit } from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';
    export default {
        props: ['initDetail', 'isFromDetail', 'selectdCities'],
        data () {
            return {
                hasAddress: false,
                applyInfo: {
                    gysbh: '',
                    gysmc: '',
                    gyslx: '',
                    gyssx: '',
                    khdj: '',
                    frdb: '',
                    zcsj: '',
                    dhhm: '',
                    qq: '',
                    email: '',
                    lxdz: '',
                    lxr: '',
                    sjhm: '',
                    czhm: '',
                    khyh: '',
                    yhzh: '',
                    gyssh: '',
                    alipay_account: '',
                    wxpay_account: '',
                    lxdz_sfmc: '',
                    lxdz_sfbh: '',
                    lxdz_csmc: '',
                    lxdz_csbh: '',
                    lxdz_xqmc: '',
                    lxdz_xqbh: '',
                    create_user_name: '',
                    barq: '',
                    displayStatus: '',
                    displayDegree: '',
                    displayGyslx: '',
                    displayGyssx: '',
                },
                allBrands: [],
                allApplyTypes: [],
                allApplyAttr: [],
                allApplyDegree: [],
                allAddressArr: [],
                ruleValidate: {
                    gysmc: [
                        { required: true, message: '供应商名称不能为空', trigger: 'blur' }
                    ],
                    yspp: [
                        { required: true, message: '代理品牌不能为空', trigger: 'blur' , type: 'array'}
                    ],
                    gyslx: [
                        { required: true, message: '供应商类型不能为空', trigger: 'blur' }
                    ],
                    gyssx: [
                        { required: true, message: '供应商属性不能为空', trigger: 'blur' }
                    ],
                    khdj: [
                        { required: true, message: '供应商重要等级不能为空', trigger: 'blur', }
                    ],
                    frdb: [
                        { required: true, message: '法人代表不能为空', trigger: 'blur', }
                    ],
                    zcsj: [
                        { required: true, message: '注册时间不能为空', trigger: 'blur', }
                    ],
                    lxdz_sfbh: [
                        { required: true, message: '省市区域不能为空', trigger: 'blur', }
                    ],
                    lxdz: [
                        { required: true, message: '联系地址不能为空', trigger: 'blur', }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur', }
                    ],
                    khyh: [
                        { required: true, message: '开户银行不能为空', trigger: 'blur', }
                    ],
                    yhzh: [
                        { required: true, message: '银行账号不能为空', trigger: 'blur', }
                    ],
                    khdj: [
                        { required: true, message: '供应商重要等级不能为空', trigger: 'blur', }
                    ],
                    lxr: [
                        { required: true, message: '联系人不能为空', trigger: 'blur', }
                    ],
                    gyssh: [
                        { required: true, message: '供应商税号不能为空', trigger: 'blur', }
                    ],
                    sjhm: [
                        { required: true, message: '手机号码格式错误', pattern: /^1\d{10}$/,  trigger: 'blur'}
                    ]
                },
                registerAdressSelect: []
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['gys_gyslx', 'gys_gyssx', 'gys_khdj'])
                }).then(res => {
                    if (res && res.status == 1) {
                        for(let prop in res.data.gys_gyslx) {
                            this.allApplyTypes.push({
                                value: prop,
                                label: res.data.gys_gyslx[prop]
                            });
                        }
                        for(let prop in res.data.gys_gyssx) {
                            this.allApplyAttr.push({
                                value: prop,
                                label: res.data.gys_gyssx[prop]
                            });
                        }
                        for(let prop in res.data.gys_khdj) {
                            this.allApplyDegree.push({
                                value: prop,
                                label: res.data.gys_khdj[prop]
                            });
                        }
                    }
                });
            },
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = res.data;
                    }
                })
            },
            trimNull (val) {
                this.applyInfo.gysmc = val.trim();
            },               
            getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },
            getAddressCheck (val, addressArr) {
                for (let i in addressArr) {
                    if (val[0] == addressArr[i].value) {
                        this.hasAddress = true;
                        this.applyInfo.lxdz_sfmc = addressArr[i].label;
                        this.applyInfo.lxdz_sfbh = addressArr[i].value;
                    }
                    if (val[1] == addressArr[i].value) {
                        this.applyInfo.lxdz_csmc = addressArr[i].label;
                        this.applyInfo.lxdz_csbh = addressArr[i].value;
                    }
                    if (val[2] == addressArr[i].value) {
                        this.applyInfo.lxdz_xqmc = addressArr[i].label;
                        this.applyInfo.lxdz_xqbh = addressArr[i].value;
                    }
                    this.getAddressCheck(val, addressArr[i].children);
                }
            },
            getCurrentAddress(value, selected) {
                this.hasAddress = false;
                this.getAddressCheck(value, this.allAddressArr);
                if (!this.hasAddress) {
                    this.applyInfo.lxdz_sfmc = '';
                    this.applyInfo.lxdz_sfbh = '';
                    this.applyInfo.lxdz_csmc = '';
                    this.applyInfo.lxdz_csbh = '';
                    this.applyInfo.lxdz_xqmc = '';
                    this.applyInfo.lxdz_xqbh = '';
                }
                // this.registerAdressSelect = selected;
                // if (this.registerAdressSelect.length > 0) {
                //     this.applyInfo.lxdz_sfmc = this.registerAdressSelect[0].label;
                //     this.applyInfo.lxdz_sfbh = this.registerAdressSelect[0].value;
                //     this.applyInfo.lxdz_csmc = this.registerAdressSelect[1].label;
                //     this.applyInfo.lxdz_csbh = this.registerAdressSelect[1].value;
                //     this.applyInfo.lxdz_xqmc = this.registerAdressSelect[2].label;
                //     this.applyInfo.lxdz_xqbh = this.registerAdressSelect[2].value;
                // }
            },
            save() {
                this.$refs['applyInfo'].validate((valid) => {
                    if (valid) {
                        if (!this.isFromDetail) {
                            purchaseAddApply(this, {
                                params: JSON.stringify(this.applyInfo)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('保存成功!');
                                    closeCurrentPage(this);
                                    util.openNewPage(this, 'purchase_apply_detail', {
                                        param: res.data.gysbh,
                                        fromAdd: '1'
                                    });
                                    this.$router.push({
                                        name: 'purchase_apply_detail',
                                        query: {
                                            param: res.data.gysbh,
                                            fromAdd: '1'
                                        }
                                    });
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        } else {
                            this.applyInfo.gysbh = this.isFromDetail;
                            this.applyInfo.gysmc = this.applyInfo.gysmc.trim();
                            apiGetPurchaseSupplierDetailEdit(this, {
                                params: JSON.stringify(this.applyInfo)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.$emit('getData');
                                } else {
                                    this.$Message.error(res.message);
                                }
                            })
                        }
                    }
                })
            },
            changeDate(value) {
                this.applyInfo.zcsj = value;
            }          
        },
        created () {
            this.getMapDetail();
            this.getStatus();
            this.getAllBrands();
            this.applyInfo = this.initDetail; //传入对象，保持数据一致
        }
    };
</script>