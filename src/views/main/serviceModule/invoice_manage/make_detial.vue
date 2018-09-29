<style>
    .make-invoince-detail .ivu-input-wrapper.ivu-input-type {
        float: left;
    }
    .make-invoince-detail .ivu-form-item-error-tip {
        position: relative;
        float: left;
        margin: 3px 0 0 11px
    }
</style>
<template>
    <div class="make-invoince-detail">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <span>开票单信息</span>
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="开票单号：" style="margin:0;">
                            {{ kpDetail.djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户编号：" style="margin:0;">
                            {{ kpDetail.khbh}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ kpDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="开票总额：" style="margin:0;">
                            {{ kpDetail.kpze }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="开票状态：" style="margin:0;">
                            {{ kpztStatus[kpDetail.kpzt] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请时间：" style="margin:0;">
                            {{ kpDetail.djrq }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" >
            <Col span="24">
            <Card>
                <p slot="title" class="card-title" >
                    <span>收票地址</span>
                    <span v-if="is_view">
                    <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="spmxIs_edit" @click="edit('spmx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                            <span style="font-weight:normal;float:right;" v-else>
                                <Button type="default" @click="close('spmxcancel')">取消</Button>
                                <Button type="primary" @click="close('spmxsave')">保存</Button>
                            </span>
                    </span>
                </p>
                <Form>
                    <Row v-if="spmxIs_edit">
                        <Col span="24">
                        <FormItem label="发货方式：" style="margin:0;">
                           {{fhfs}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收票人:" style="margin:0;">
                            {{ kpDetail.sjr }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收票地址:" style="margin:0;">
                          {{ kpDetail.spdz }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收票人手机号码:" style="margin:0;">
                           {{ kpDetail.sjhm }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Row v-if="!spmxIs_edit">
                    <Form ref="spmxForm" :model="kpDetail" :rules="Rules">
                        <Col span="24">
                        <FormItem label="发货方式：" style="margin-left:10px;">
                           {{fhfs}}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <FormItem label="收票人:" style="margin-left:10px;" prop="sjr">
                            <span v-if="spmxIs_edit">{{ kpDetail.sjr }}</span>
                            <Input v-model="kpDetail.sjr" style="width: 200px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <FormItem label="收票地址:" style="margin-left:10px;" prop="AddressSelect">
                        <Cascader v-model="kpDetail.AddressSelect" :data="addEditInvoinceAddressArr" filterable @on-change="getAreaSeletced" style="width:300px;float:left;"></Cascader>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <FormItem label=" 收票详细地址 ：" style="margin-left:10px;" prop="xxdz">
                            <Input v-model="kpDetail.xxdz" style="width: 300px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <FormItem label="收票人手机号码:" style="margin-left:10px;" prop="sjhm">
                            <span v-if="spmxIs_edit">{{ kpDetail.sjhm }}</span>
                            <Input v-model="kpDetail.sjhm" style="width: 200px;"></Input>
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
                     <span>发票信息</span>
                </p>
                <Form ref="fpxxForm">
                    <Row>
                        <Col span="24">
                        <FormItem label="发票类型：" style="margin:0;">
                            {{ fplxStatus[kpDetail.fplx] }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="发票抬头：" style="margin:0;">
                            {{ kpDetail.fptt }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="纳税人识别码：" style="margin:0;">
                            {{ kpDetail.nsrsbh }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="注册地址：" style="margin:0;">
                            {{ kpDetail.zcdz }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="注册电话：" style="margin:0;">
                            {{ kpDetail.zcdh }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="开户银行：" style="margin:0;">
                            {{ kpDetail.khyh }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="银行账号：" style="margin:0;">
                            {{ kpDetail.yhzh }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="kd">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <span>寄出信息</span>
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="发货物流：" style="margin:0;">
                            {{ kpDetail.fhwlmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="快递单号：" style="margin:0;">
                            {{ kpDetail.kddh }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
         <Modal title="寄出信息" v-model="modal1">
             <Form ref="jcxxForm" :model="kpDetail" :rules="Rerules" :label-width="85">
               <FormItem label="发货物流：" style="margin-left:10px;" prop="fhwlbh">
                    <Select v-model="kpDetail.fhwlbh" style="width:150px;" placeholder="请选择物流(必选项)">
                        <Option v-for="val in fpwlStatus" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="快递单号:" style="margin-left:10px;" prop="kddh" placeholder="请输入快递单号(必填项)">
                    <Input v-model="kpDetail.kddh" style="width: 150px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="close('jcxxcancel')">取消</Button>
                <Button type="primary" @click="close('jcxxsave')">确定</Button>
            </div>
       </Modal>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                     <span>开票明细</span>
                </p>
                <el-table :data="detailList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                    <el-table-column prop="xshtd_djbh" label="销售合同单单号" ></el-table-column>
                    <el-table-column prop="xsckd_djbh" label="销售出库单单号" ></el-table-column>
                    <el-table-column prop="cksj" label="出库时间" sortable="custom"></el-table-column>
                    <el-table-column prop="kpje" label="开票金额" sortable="custom"></el-table-column>
                </el-table>
                 <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="opening" type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toOpening()">开票</Button>
                <Button v-if="opening" type="primary" class="margin-top-10" :loading="loading" style="margin:auto;margin-left:20px;" @click="toInvalid()">作废</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiBillingDetail,apiAllStatus,apiMapDetail,apiBillingUpdate,apiBillingInvalid,apiBillingOpening, apiSendLogistic } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    import pagination from '../../../common/pagination.vue';
    export default {
        components: {
            pagination
        },
        data () {
            const validatesjhm = (rule, value, callback) => {
                let reg = /^1\d{10}$/;
                if (!reg.test(value)) {
                    return callback(new Error('手机号码格式错误'));
                } else {
                    callback();
                }
            };
            const validatejfxw = (rule, value, callback) => {
                if (value && value.length === 0) {
                    return callback(new Error('收票地址不能为空'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                kpdjbh: this.$route.query.param,
                kpDetail: { },
                kpztStatus: '',
                fplxStatus: '',
                fpwlStatus: '',
                copywlmc: '',
                copykddh: '',
                copysjr: '',
                copyselectArray: [],
                copyxxdz: '',
                copysjhm: '',
                detailList: {
                    title: [],
                    data: []
                },
                spxx: {
                    title: [],
                    data: []
                },
                fhfs: '快递',
                page: 1,
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                ajaxHistoryData: [],
                spmxIs_edit: true,
                opening: false,
                is_view: true,
                modal1: false,
                kd: false,
                address: [],
                Rules: {
                    sjr: [
                        { required: true, message: '收票人不能为空', trigger: 'blur' },
                    ],
                    xxdz: [
                        { required: true, message: '收票详细地址不能为空', trigger: 'blur' },
                    ],
                    AddressSelect: [
                        {validator: validatejfxw, trigger: 'blur'},
                    ],
                    sjhm: [
                        { required: true, message: '联系方式不能为空', trigger: 'blur' },
                        {validator: validatesjhm, trigger: 'blur'}
                    ]
                },
                Rerules: {
                    fhwlbh: [
                        { required: true, message: '发货物流不能为空', trigger: 'blur' },
                    ],
                    kddh2: [
                        { required: true, message: '快递单号不能为空', trigger: 'blur' },
                    ]
                }
            };
        },
        methods: {
            getMapDetail() {
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
                    this.addEditInvoinceAddressArr = res.data;
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx', 'kpzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fplxStatus = res.data.fplx;
                        this.kpztStatus = res.data.kpzt;
                        // this.fpwlStatus = res.data.fhwl;
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fpwlStatus = res.data;
                    }
                });
            },
            getData () {
                apiBillingDetail(this, {
                    params: JSON.stringify({
                        djbh: this.kpdjbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if(res.data.detail_basic.kpzt == 0){
                            this.opening = true;
                            this.is_view = true;
                            this.kd = false;
                        }else{
                            this.is_view = false;
                            this.opening = false;
                            if(res.data.detail_basic.kpzt == 1){
                                this.kd = true;
                            }else{
                                this.kd = false;
                            }
                        }
                        this.kpDetail = res.data.detail_basic;
                        this.kpDetail.AddressSelect = [res.data.detail_basic.sfbh.toString(),res.data.detail_basic.csbh.toString(),res.data.detail_basic.xqbh.toString()];
                        this.spxx.data = [res.data.detail_basic];
                        this.totalnum = res.data.detail_list_num;
                        this.ajaxHistoryData = res.data.detail_list;

                        if (res.data.total_num < this.limit) {
                            this.detailList.data = this.ajaxHistoryData;
                        } else {
                            this.detailList.data = this.ajaxHistoryData.slice(0, this.limit);
                        }
                    }
                });
            },
            close(name) {
                if(name === 'spmxsave'){
                    this.$refs['spmxForm'].validate((valid) => {
                        if (valid) {
                            if(this.kpDetail.AddressSelect && this.kpDetail.AddressSelect.length == 0){
                                return callback(new Error('地址信息为空'));
                            }
                            apiBillingUpdate(this,{
                                    params: JSON.stringify({
                                    djbh: this.kpdjbh,
                                    sjr: this.kpDetail.sjr,
                                    sfmc: this.kpDetail.AddressSelect[0].toString(),
                                    csmc: this.kpDetail.AddressSelect[1].toString(),
                                    xqmc: this.kpDetail.AddressSelect[2].toString(),
                                    xxdz: this.kpDetail.xxdz,
                                    sjhm: this.kpDetail.sjhm,
                                })
                                }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success(res.message);
                                    this.spmxIs_edit = true;
                                    this.getData();
                                }else{
                                    this.$Message.error(res.message);
                                    this.spmxIs_edit = false;
                                }
                            });
                            this.spmxIs_edit = true;
                        }
                    });
                }else if(name === 'spmxcancel'){
                    this.spmxIs_edit = true;
                    this.kpDetail.sjr =  this.copysjr;
                    this.kpDetail.xxdz = this.copyxxdz;
                    this.kpDetail.sjhm = this.copysjhm;
                    this.kpDetail.AddressSelect = JSON.parse(JSON.stringify(this.copyselectArray));
                }else if(name === 'jcxxcancel'){
                    this.kpDetail.fhwlbh = this.copywlmc;
                    this.kpDetail.kddh = this.copykddh;
                    this.modal1 = false;
                }else if(name === 'jcxxsave'){
                    this.$refs['jcxxForm'].validate((valid) => {
                        if (valid) {
                            apiBillingOpening(this,{
                                    params: JSON.stringify({
                                    djbh: this.kpdjbh,
                                    fhwlbh: this.kpDetail.fhwlbh,
                                    kddh: this.kpDetail.kddh
                                })
                                }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success(res.message);
                                    this.modal1 = false;
                                    this.getData();
                                }else{
                                    this.$Message.error(res.message);
                                    this.modal1 = false;
                                }
                            });
                            this.spmxIs_edit = true;
                        }
                    });
                }
            },
            edit (name) {
                if (name === 'spmx') {
                    if(this.kpDetail.kpzt != 0){
                        this.$Message.error('票据已取消，无法修改');
                    }else{
                        this.copysjr = this.kpDetail.sjr;
                        this.copyxxdz = this.kpDetail.xxdz;
                        this.copysjhm = this.kpDetail.sjhm;
                        this.copyselectArray = JSON.parse(JSON.stringify(this.kpDetail.AddressSelect));
                        this.spmxIs_edit = false;
                    }
                }
            },
            toOpening(){
                if(this.kpDetail.kpzt != 0){
                        this.$Message.error('非未开票状态,无法开票');
                }else{
                    // 暂存物流信息
                    this.copywlmc = this.kpDetail.fhwlbh;
                    this.copykddh = this.kpDetail.kddh;
                    this.modal1 =  true;
                }
            },
            toInvalid(){
                if(this.kpDetail.kpzt != 0){
                        this.$Message.error('非未开票状态,无法作废');
                }else{
                    this.loading = true;
                    apiBillingInvalid(this,{
                            params: JSON.stringify({
                            djbh: this.kpdjbh,
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.opening = true;
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                }
            },
            //排序
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.detailList.data = this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.detailList.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            getAreaSeletced(value, selected) {
                setTimeout(() => {
                    this.$refs.spmxForm.validateField('AddressSelect');
                }, 500);
            }
        },
        watch: {
            page: function () {
                this.getData();
            },
            limit: function () {
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.getMapDetail();
        }
    };
</script>
