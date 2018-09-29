<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
    .redRequire .ivu-form-item-label:before {content: "*"; display: inline-block;margin-right: 4px;line-height: 1;font-family:SimSun;font-size: 12px; color: #ed3f14;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                    <span v-auth="editLimit">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('djxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('djxxcancel')">取消</Button>
                            <Button type="primary" @click="close('djxxsave')">保存</Button>
                        </span>
                    </span>
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="销售出库单编号：" style="margin:0;">
                            {{ ckdDetail.ckd_djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="下单时间：" style="margin:0;">
                            {{ ckdDetail.djrq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ ckdStatus[ckdDetail.status] }}  
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="订单状态：" style="margin:0;">
                            {{ orderStatus[ckdDetail.xshtdzt] }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="支付状态：" style="margin:0;">
                            {{ payStatus[ckdDetail.khzfzt] }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="应付金额：" style="margin:0;">
                            {{ ckdDetail.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="出库数量：" style="margin:0;">
                            {{ ckdDetail.cksl  }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="出库总额：" style="margin:0;">
                            {{ ckdDetail.ck_money }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="出库仓库：" style="margin:0;">
                            {{ ckdDetail.ckmc }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="仓库联系人：" style="margin:0;">
                            {{ ckdDetail.ckfzr }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="发货方式：" style="margin:0;">
                            <span v-if="is_edit">{{ ckdDetail.fhfsmc }}</span>
                            <Select v-model="ckdDetail.fhfsbh"  placeholder="请选择" filterable v-else style="height:30px;line-height:30px;" @on-change="sendWayChoose">
                                <Option v-for="(val, index) in sendWaysArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="发货物流：" style="margin:0;">
                            <span v-if="is_edit">{{ ckdDetail.fhwlmc }}</span>
                            <Select v-model="ckdDetail.fhwlbh"  placeholder="请选择" filterable v-else style="height:30px;line-height:30px;">
                                <Option v-for="(val, index) in fhwlArr" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="快递单号：" style="margin:0;">
                            <span v-if="is_edit">{{ ckdDetail.hydh }}</span>
                            <Input type="text" v-model="ckdDetail.hydh" v-else style="height:30px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ ckdDetail.sales }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ ckdDetail.sales_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ ckdDetail.customer }}
                        </FormItem>
                        </Col>
                        <Col span="6" :class="is_edit ? '' : 'margin-top-20'">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ ckdDetail.customer_bm }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-10" style="border-top:1px dashed #d4d4d4;padding-top:16px;">
                        <Col span="6">
                        <FormItem label="收货人：" style="margin:0;">
                            {{ ckdDetail.receive_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="收货人联系方式：" style="margin:0;">
                            {{ ckdDetail.receive_phone }}
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="收货地址：" style="margin:0;">
                            {{ ckdDetail.province_name + ckdDetail.city_name + ckdDetail.district_name + ckdDetail.address}}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            {{ ckdDetail.note }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="装箱单备注：" style="margin:0;">
                            {{ ckdDetail.ship_note }}
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
                            {{ khDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ khDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.sales }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.sales_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.customer }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.customer_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
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
                    出库商品明细
                </p>
                <div>
                    <el-table :data="ckdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号" sortable="custom"></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxl" label="系列" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseInt(scope.row.htsl) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cksl" label="出库数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseInt(scope.row.cksl) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="arrive_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ckdj" label="出库单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.ckdj).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ckje" label="出库金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.ckje).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="area_name" label="出库库区" sortable="custom"></el-table-column>
                        <el-table-column prop="seat_name" label="出库库位" sortable="custom"></el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" v-show="abolish" v-auth="buttonShow" @click="isAbolish(1)">作废</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="sureOut" v-show="isShow" v-auth="storeShow">确认出库</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="cancelOut" v-show="isShow" v-auth="storeShow">取消出库</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" v-auth="storeShow" v-show="ckdDetail.status != 1" @click="printOut">打印快递面单</Button>
            </Card>
            </Col>
        </Row>
        <!--确认出库弹框-->
        <Modal v-model="confirmOutModal" title="确认出库" width="350">
            <Form :label-width="100" ref="outInfoForm" :model="outInfoForm" :rules="outInfoRules">
                <Row>
                    <Col span="24">
                    <FormItem label="发货方式：" prop="fhfsbh">
                        <Select v-model="outInfoForm.fhfsbh"  placeholder="请选择" @on-change="wayChange">
                            <Option v-for="(val, index) in sendWaysArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="发货物流：" prop="fhwl" :class="outInfoForm.fhfsbh == 300 ? '' : 'redRequire'">
                        <Select v-model="outInfoForm.fhwlbh"  placeholder="请选择">
                            <Option v-for="(val, index) in fhwlArr" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="快递单号：">
                        <Input v-model="outInfoForm.hydh" placeholder="请输入快递单号"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelOutBound">取消</Button>
                <Button type="primary" @click="confirmOutBound">确定</Button>
            </div>
        </Modal>
        <!-- 取消出库弹框 -->
        <Modal v-model="cancelOutModal" title="取消出库" @on-ok="confirmCancelOut" class="orderForm-approvePass" width="300">
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">取消出库</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
        </Modal>
        <!--作废弹框-->
        <Modal v-model='abolishModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                        <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">作废</em>！</P>
                    </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="isAbolish(0)">取消</Button>
                <Button type="primary" :loading="loadding" @click="goAbolish">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus,apiCkdDetail,apiCkdAbolish, apiSalesOutBound, apiServiceOutBoundPrint, apiSendLogistic, apiServiceXsckdInfoEdit } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';

    export default {
        data () {
            const apiSalesOutBound = (rule, value, callback) => {
                if (this.isset(this.outInfoForm.fhfsbh)) {
                    return callback(new Error('发货方式不能为空'));
                } else {
                    callback();
                }
            };
            const validateFhwl = (rule, value, callback) => {
                if (this.isset(this.outInfoForm.fhwlbh) && (this.outInfoForm.fhfsbh != 300) && (this.outInfoForm.fhfsbh !== '')) {
                    return callback(new Error('请选择发货物流！'));
                } else {
                    callback();
                }

            };
            return {
                abolishModal: false,
                loading: false,
                buttonShow: 'service-xsckd-detail-abolish-button',
                abolish: false,
                ckdbh: this.$route.query.param,
                orderStatus: [],
                payStatus: [],
                abolishStatus: [],
                ckdList: {
                    title: [],
                    data: []
                },
                khDetail: {},
                ckdDetail: {},
                ckdStatus: [],
                confirmOutModal: false,
                cancelOutModal: false,
                sendWaysArr: [],
                sendWays: [],
                fhwlArr: [],
                outInfoRules: {
                    fhfsbh: [
                        { required: true, message: '发货方式不能为空', trigger: 'on-change' }/*validator: validateShipType, */
                    ],
                    fhwlbh: [
                        { validator: validateFhwl, trigger: 'on-change' }
                    ],
                    // hydh: [
                    //     { validator: validateHydh, trigger: 'blur' }
                    // ],
                },
                outInfoForm: {
                    fhfsbh: '',
                    fhwlbh: '',
                    hydh: ''
                },
                isShow: '',
                storeShow: 'current_store_role',
                is_edit: true,
                editLimit: 'xsckd-detail-basic-edit'
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt', 'is_abolish', 'xsckd', 'fhfs2'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                        this.abolishStatus = res.data.is_abolish;
                        this.ckdStatus = res.data.xsckd;
                        this.sendWays = res.data.fhfs2;
                        let tmpObj = {};
                        for (let key in res.data.fhfs2) {
                            if (res.data.fhfs2.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fhfs2[key]
                                };
                                this.sendWaysArr.push(tmpObj);
                            }
                        }
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fhwlArr = res.data;
                    }
                });
            },
            getData () {
                apiCkdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'ckd_djbh': this.ckdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.kh_info;
                        this.ckdDetail = res.data.dj_info;
                        for (let i in this.sendWays) {
                            if (this.ckdDetail.fhfsmc === this.sendWays[i]) {
                                this.ckdDetail.fhfsbh = i;
                            }
                        }
                        for (let i in this.fhwlArr) {
                            if (this.ckdDetail.fhwlmc === this.fhwlArr[i].fhwlmc) {
                                this.ckdDetail.fhwlbh = this.fhwlArr[i].fhwlbh;
                            }
                        }
                        this.outInfoForm.fhfsbh = this.ckdDetail.fhfsbh;
                        this.outInfoForm.fhwlbh = this.ckdDetail.fhwlbh;
                        this.outInfoForm.hydh = this.ckdDetail.hydh;
                        this.ckdList.data = res.data.list;
                        if(this.ckdDetail.status == 3){
                            this.abolish = true;
                        }
                        this.isShow = this.ckdDetail.status == 2;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            edit (name) {
                if (name === 'djxx') {
                    this.is_edit = false;
                }
            },
            close (name) {
                if (name === 'djxxcancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'djxxsave') {
                    if (!this.ckdDetail.fhfsbh) {
                        this.$Message.error('请选择发货方式');
                        return;
                    } else if (this.ckdDetail.fhfsbh == 200 && !this.ckdDetail.fhwlbh) {
                        this.$Message.error('请选择发货物流');
                        return;
                    } else {
                        apiServiceXsckdInfoEdit(this, {
                            ckd_djbh: this.ckdbh,
                            params: JSON.stringify({
                                fhfsbh: this.ckdDetail.fhfsbh,
                                fhwlbh: this.ckdDetail.fhwlbh,
                                hydh: this.ckdDetail.hydh
                            })
                        }).then(res => {
                            if(res && res.status == 1){
                                this.is_edit = true;
                                this.getData();                     
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                }
            },
            wayChange (val) {
                if ( val == 300) {
                    this.outInfoForm.fhwlbh = '';
                    this.outInfoForm.hydh = '';
                }
            },
            sendWayChoose (val) {
                this.ckdDetail.fhwlbh = ' ';
                this.ckdDetail.hydh = ' ';
            },
            sureOut () {
                this.outInfoForm.fhfsbh = this.ckdDetail.fhfsbh;
                this.outInfoForm.fhwlbh = this.ckdDetail.fhwlbh;
                this.outInfoForm.hydh = this.ckdDetail.hydh;
                this.confirmOutModal = true;
            },
            cancelOutBound () {
                this.confirmOutModal = false;
            },
            confirmOutBound () {
                this.$refs.outInfoForm.validate((valid) => {
                    if (valid) {
                        apiSalesOutBound(this, {
                            params: JSON.stringify({
                                xsckd_djbh: this.ckdbh,
                                type: '1',
                                fhfsbh: this.outInfoForm.fhfsbh,
                                fhwlbh: this.outInfoForm.fhwlbh,
                                hydh: this.outInfoForm.hydh
                            })
                        }).then(res => {
                            if(res && res.status == 1){
                                this.confirmOutModal = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });   
                    }
                });
            },
            cancelOut () {
                this.cancelOutModal = true;
            },
            confirmCancelOut () {
                apiSalesOutBound(this, {
                    params: JSON.stringify({
                        xsckd_djbh: this.ckdbh,
                        type: '0',
                        fhfsbh: this.ckdDetail.fhfsbh,
                        fhwlbh: this.ckdDetail.fhwlbh,
                        hydh: this.ckdDetail.hydh
                    })
                }).then(res => {
                    if(res && res.status == 1){
                        this.cancelOutModal = false;
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            /*打印快递面单*/
            printOut () {
                apiServiceOutBoundPrint(this, {
                    djbh: this.ckdbh
                }).then(res => {
                    if(res && res.status == 1){
                        window.open(res.data);                      
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ckdList.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            isAbolish (num) {
                if(num){
                    this.abolishModal = true;
                }else{
                    this.abolishModal = false;
                }
            },
            goAbolish () {
                this.loading = true;
                apiCkdAbolish(this, {
                    params: JSON.stringify(this.notempty({
                        'ckd_djbh': this.ckdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.ckdDetail.status = 1;
                        this.abolish = false;
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.abolishModal = false;
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
