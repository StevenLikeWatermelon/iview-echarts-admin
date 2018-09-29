<style>
    
</style>

<template>
    <Form :label-width="120" >
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        基础信息
                    </p>
                    <div slot="extra" v-auth="buttonAuth">
                        <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="!isEdit" @click="editDetail">修改</span>
                        <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="isEdit" @click="saveEdit">保存</span>
                        <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left:20px;" v-if="isEdit" @click="cancelEdit">取消</span>
                    </div>
                    <div v-show="!isEdit">
                        <Row class="margin-top-10">
                            <col span="24">
                                <Card>
                                    <p slot="title" class="card-title">
                                        基本信息
                                    </p>
                                    <Row>
                                        <Col span="6">
                                            <FormItem label="供应商编号：">
                                                <span>{{$route.query.param}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="供应商名称：">
                                                <span>{{applyDetail.gysmc}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="状态：">
                                                <span>{{applyDetail.displayStatus}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="重要等级：">
                                                <span>{{applyDetail.displayDegree}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="供应商类型：">
                                                <span>{{applyDetail.displayGyslx}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="供应商属性：">
                                                <span>{{applyDetail.displayGyssx}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="创建人：">
                                                <span>{{applyDetail.create_user_name}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="创建时间：">
                                                <span>{{applyDetail.barq}}</span>
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
                                        企业信息
                                    </p>
                                    <Row>
                                        <Col span="6">
                                            <FormItem label="法人代表：">
                                                <span>{{applyDetail.frdb}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="注册时间：">
                                                <span>{{applyDetail.zcsj}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="联系地址：">
                                                <span>{{applyDetail.lxdz_sfmc}}{{applyDetail.lxdz_csmc}}{{applyDetail.lxdz_xqmc}}{{applyDetail.lxdz}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="联系人：">
                                                <span>{{applyDetail.lxr}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="联系人手机号：">
                                               <span>{{applyDetail.sjhm}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="联系电话：">
                                                <span>{{applyDetail.dhhm}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="传真号码：">
                                                <span>{{applyDetail.czhm}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="QQ：">
                                                <span>{{applyDetail.qq}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="电子邮箱：">
                                                <span>{{applyDetail.email}}</span>
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
                                        财务信息
                                    </p>
                                    <Row>
                                        <Col span="6">
                                            <FormItem label="开户银行：">
                                                <span>{{applyDetail.khyh}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="银行账号：">
                                               <span>{{applyDetail.yhzh}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="供应商税号：">
                                               <span>{{applyDetail.gyssh}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="支付宝支付账号：">
                                                <span>{{applyDetail.alipay_account}}</span>
                                            </FormItem>
                                        </Col>
                                        <Col span="6">
                                            <FormItem label="微信支付账号：">
                                                <span>{{applyDetail.wxpay_account}}</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                            </col>
                        </Row>     
                    </div>
                    <div v-show="isEdit">
                        <form-item ref="formItem" :initDetail="applyDetail" :isFromDetail="$route.query.param" :selectdCities="selectdCities" @getData="getData"></form-item>
                    </div>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList()">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <div style="display: inline-block;" v-auth="operateAuth">
                    <Button v-if="canDelete" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="DeleteDetail()">删除</Button>
                    <Button v-if="canFrozen" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="frezonApply()">冻结</Button>
                    <Button v-if="canActive" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="activeApply()">激活</Button>
                </div>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showDelete" title="确认删除" @on-ok="confirmDelete">
            <p>确认删除该供应商信息?</p>
        </Modal>  
        <Modal v-model="showActivated" title="确认激活" @on-ok="confirmActivated">
            <p>确认激活?</p>
        </Modal>  
        <Modal v-model="showFrozen" title="确认冻结" @on-ok="confirmFrozen">
            <p>确认冻结?</p>
        </Modal> 
    </Form>
</template>

<script>
    import { apiGetPurchaseSupplierDetail, purchaseManageApplyActive, purchaseManageApplyFrezon, apiAllBrands, purchaseManageWorkFlow, apiAllStatus, purchaseManageApproveAction, purchaseManageApplyDelete} from '@/config/getData';
    import formItem from './addEditTmp.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    export default {
        components: {
            formItem
        },
        data () {
            return {
                buttonAuth: 'apply_detail_basic_edit_button',
                operateAuth: 'apply_detail_basic_other_all_button',
                applyDetail: {
                    gysmc: '',
                    gyslx: '',
                    gyssx: '',
                    khdj: '',
                    frdb: '',
                    zcsj: '',
                    lxdz: '',
                    lxdz_sfbh: '',
                    lxdz_sfmc: '',
                    lxdz_csbh: '',
                    lxdz_csmc: '',
                    lxdz_xqbh: '',
                    lxdz_xqmc: '',
                    dhhm: '',
                    lxr: '',
                    sjhm: '',
                    czhm: '',
                    khyh: '',
                    yhzh: '',
                    gyssh: '',
                    displayStatus: '',
                    displayDegree: '',
                    displayGyslx: '',
                    displayGyssx: '',
                    alipay_account: '',
                    wxpay_account: '',
                    qq: '',
                    email: '',
                    create_user_name: '',
                    barq: ''
                },
                fromAdd: this.$route.query.fromAdd,
                statusArr: [],
                selectdCities: [],
                workFlowArr: [],
                currentFlow: 0,
                applyType: {},
                applyAttr: {},
                applyDegree: {},
                isEdit: false,
                canApprove: false,
                canFrozen: false,
                canActive: false,
                showApprove: false,
                canDelete: false,
                showDelete: false,
                showActivated: false,
                showFrozen: false,
            };
        },
        methods: {
            doApprove() {
                this.showApprove = true;
            },
            getData () {
                apiGetPurchaseSupplierDetail(this, {
                    gysbh: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.applyDetail.gysmc = res.data.gysmc;
                        this.applyDetail.shzt = res.data.shzt;
                        this.applyDetail.displayStatus = this.statusArr[res.data.shzt];
                        this.applyDetail.khdj = res.data.khdj;
                        this.applyDetail.displayDegree = this.applyDegree[res.data.khdj];
                        this.applyDetail.gyslx = res.data.gyslx;
                        this.applyDetail.displayGyslx = this.applyType[res.data.gyslx];
                        this.applyDetail.gyssx = res.data.gyssx;
                        this.applyDetail.displayGyssx = this.applyAttr[res.data.gyssx];
                        this.applyDetail.create_user_name = res.data.create_user_name;
                        this.applyDetail.barq = res.data.barq;
                        this.applyDetail.frdb = res.data.frdb;
                        this.applyDetail.zcsj = res.data.zcsj;
                        this.applyDetail.lxdz = res.data.lxdz;
                        this.selectdCities = [this.applyDetail.lxdz_sfbh, this.applyDetail.lxdz_csbh, this.applyDetail.lxdz_xqbh] = [res.data.lxdz_sfbh, res.data.lxdz_csbh, res.data.lxdz_xqbh];
                        [this.applyDetail.lxdz_sfmc, this.applyDetail.lxdz_csmc, this.applyDetail.lxdz_xqmc] = [res.data.lxdz_sfmc, res.data.lxdz_csmc, res.data.lxdz_xqmc];
                        this.applyDetail.lxr = res.data.lxr;
                        this.applyDetail.sjhm = res.data.sjhm;
                        this.applyDetail.dhhm = res.data.dhhm;
                        this.applyDetail.czhm = res.data.czhm;
                        this.applyDetail.qq = res.data.qq;
                        this.applyDetail.email = res.data.email;
                        this.applyDetail.khyh = res.data.khyh;
                        this.applyDetail.yhzh = res.data.yhzh;
                        this.applyDetail.gyssh = res.data.gyssh;
                        this.applyDetail.alipay_account = res.data.alipay_account;
                        this.applyDetail.wxpay_account = res.data.wxpay_account;


                        this.canFrozen = res.data.shzt == '1'; 
                        this.canActive = res.data.shzt == '3'; 
                        this.canDelete = res.data.shzt == '3'; 
                        this.isEdit = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },    
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['gys_shzt', 'gys_gyslx', 'gys_gyssx', 'gys_khdj'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.statusArr = res.data.gys_shzt;
                        this.applyType = res.data.gys_gyslx;
                        this.applyAttr = res.data.gys_gyssx;
                        this.applyDegree = res.data.gys_khdj;
                        this.getData();
                    }
                });
            },                     
            editDetail() {
                this.isEdit = true;
            },
            cancelEdit() {
                this.getData();
                this.isEdit = false;
            },
            saveEdit() {
                this.$refs['formItem'].save();
            },
            activeApply() {
                this.showActivated = true;
            },
            confirmActivated() {
                purchaseManageApplyActive(this, {
                    gysbh: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('激活成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            frezonApply() {
                this.showFrozen = true;
            },
            confirmFrozen() {
                purchaseManageApplyFrezon(this, {
                    gysbh: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('冻结成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            backToList () {
                util.openNewPage(this, 'purchase_apply_index');
                this.$router.push({
                    name: 'purchase_apply_index'
                });
            },
            backTo () {
                history.go(-1);
            },
            DeleteDetail() {
                this.showDelete = true;
            },
            confirmDelete() {
                purchaseManageApplyDelete(this, {
                    gysbh: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        util.openNewPage(this, 'purchase_apply_index');
                        this.$router.push({
                            name: 'purchase_apply_index'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            }
        },
        created () {
            this.getStatus();
        }
    };
</script>