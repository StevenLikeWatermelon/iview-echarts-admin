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
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ applyForm.return_apply_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ applyForm.sell_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请退货时间：" style="margin:0;">
                            {{ applyForm.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货总额：" style="margin:0;">
                            {{ parseFloat(applyForm.return_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="其他金额：" style="margin:0;">
                            {{ parseFloat(applyForm.other_amount).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ parseFloat(applyForm.must_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ orderStatus[applyForm.return_apply_status] }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ applyForm.seller_no}}/{{applyForm.seller_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ applyForm.seller_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ applyForm.server_no }}/{{applyForm.server_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ applyForm.server_depart }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ applyForm.note }}
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
                            {{ applyForm.customer_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ applyForm.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ applyForm.contact_user}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ applyForm.contact_method }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ applyForm.seller_no }}/{{applyForm.seller_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ applyForm.seller_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ applyForm.server_no }}/{{applyForm.server_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ applyForm.server_depart }}
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
                    申请退货商品明细
                    <span style="font-weight:normal;float:right;" v-show="isShowEdit" v-auth="buttonLimit">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="edit('thmx')" v-if="goods_edit"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('thmxCancel')">取消</Button>
                            <Button type="primary" @click="close('thmxSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                    <el-table :data="applyForm.detail" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_series" label="系列" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_origin_price" label="商品面价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="order_discount" label="合同折扣" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="order_price" label="合同单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_price" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_num" label="退货申请数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="goods_edit"> {{ scope.row.return_num }}</span>
                                <Input type="text" v-model="scope.row.return_num" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_amount" label="退货金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.return_num * scope.row.return_price).toFixed(4) }}</span>
                            </template>
                        </el-table-column>
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
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('complete')" v-show="isSureComp" v-auth="buttonLimit">确认完成</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('bh')" v-show="isShowEdit"  v-auth="buttonLimit">不同意</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sh')" v-show="isShowEdit"  v-auth="buttonLimit">同意</Button>
                <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('ht')" v-show="isSureComp" v-auth="buttonLimit">退回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toReturn" v-show="isReturnShow" v-auth="buttonLimit">申请退货</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toEdit" v-show="isEditShow" v-auth="buttonLimit">申请修改</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiSalesReturnApplyDetail, apiSalesReturnApplyEdit, apiSalesReturnApplyStatus, apiSalesReturnApplyComplete, ServiceTHModelName, apiHtxgdDetailModalName } from '@/config/getData';
    import { notempty, sortBy, isInCreaters} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                //没有用到的就不要加字段了，为什么会有这行字，请看上一个版本这里是什么
                abolish: false,
                djbh: this.$route.query.param,
                orderStatus: [],
                payStatus: [],
                abolishStatus: [],
                applyForm: {},
                goods_edit: true,
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                current_user: '',
                isShowEdit: '',
                isReturnShow: '',
                isEditShow: '',
                isSureComp: '',
                buttonLimit: 'service-thsqd-button-limit'
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
                    type: JSON.stringify(['khzfzt', 'return_apply_status', 'is_abolish'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.return_apply_status;
                        this.payStatus = res.data.khzfzt;
                        this.abolishStatus = res.data.is_abolish;
                        this.isSureComp = this.current_user === this.applyForm.server_no && this.applyForm.return_apply_status == 1;
                        /*销售退货单可创建人*/
                        ServiceTHModelName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                isInCreaters(this, modelName).then(canCreater => {
                                    this.isReturnShow = canCreater && this.applyForm.return_apply_status == 1;
                                });
                            }
                        });
                        /*合同修改单可创建人*/
                        apiHtxgdDetailModalName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                isInCreaters(this, modelName, 1).then(canCreater => {
                                    this.isEditShow = canCreater && this.applyForm.return_apply_status == 1;
                                });
                            }
                        });
                    }
                });
            },
            getData () {
                apiSalesReturnApplyDetail(this, {
                    return_apply_no: this.djbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.applyForm = res.data;
                        this.current_user = Cookies.get('user_no');
                        this.getStatus();
                        this.isShowEdit = (this.applyForm.return_apply_status == -1 || this.applyForm.return_apply_status == 0) && this.applyForm.server_no === this.current_user;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            edit (name) {
                if (name === 'thmx') {
                    this.goods_edit = false;
                }
            },
            close (name) {
                if (name === 'thmxCancel') {
                    this.goods_edit = true;
                    this.getData();
                } else if (name === 'thmxSave') {
                    let tmp = {};
                    for (let i in this.applyForm.detail) {
                        let n = parseInt(i) + parseInt(1);
                        if (!this.applyForm.detail[i].return_num || this.applyForm.detail[i].return_num === '') {
                            this.$Message.error('第' + n + '行的退货申请数量不能为空');
                            return false;
                        } else if (!/^\d+$/.test(this.applyForm.detail[i].return_num)) {
                            this.$Message.error('第' + n + '行的退货申请数量必须是大于等于0的整数');
                            return false;
                        }
                        let str = this.applyForm.detail[i];
                        tmp[str.id] = str.return_num;
                    }
                    apiSalesReturnApplyEdit(this, {
                        return_apply_no: this.djbh,
                        params: JSON.stringify(tmp)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goods_edit = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            modal (name) {
                if (name === 'complete') {
                    this.publicModal = true;
                    this.publicState = '完成';
                    this.publicCancel = 'comcancel';
                    this.publicSure = 'comsure';
                    this.loadding = false;
                } else if (name === 'bh') {
                    this.publicModal = true;
                    this.publicState = '驳回';
                    this.publicCancel = 'bhcancel';
                    this.publicSure = 'bhsure';
                    this.loadding = false;
                } else if (name === 'sh') {
                    this.publicModal = true;
                    this.publicState = '审核';
                    this.publicCancel = 'shcancel';
                    this.publicSure = 'shsure';
                    this.loadding = false;
                } else if (name === 'ht') {
                    this.publicModal = true;
                    this.publicState = '回退';
                    this.publicCancel = 'htcancel';
                    this.publicSure = 'htsure';
                    this.loadding = false;
                }
            },
            sureAction (name) {
                if (name === 'comcancel') {
                    this.publicModal = false;
                } else if (name === 'comsure') {
                    this.loadding = true;
                    apiSalesReturnApplyComplete(this, {
                        return_apply_no: this.djbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'bhcancel') {
                    this.publicModal = false;
                } else if (name === 'bhsure') {
                    this.loadding = true;
                    apiSalesReturnApplyStatus(this, {
                        return_apply_no: this.djbh,
                        return_apply_status: '-2'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'shcancel') {
                    this.publicModal = false;
                } else if (name === 'shsure') {
                    this.loadding = true;
                    apiSalesReturnApplyStatus(this, {
                        return_apply_no: this.djbh,
                        return_apply_status: '1'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'htcancel') {
                    this.publicModal = false;
                } else if (name === 'htsure') {
                    this.loadding = true;
                    apiSalesReturnApplyStatus(this, {
                        return_apply_no: this.djbh,
                        return_apply_status: '-1'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.applyForm.detail.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            toReturn () {
                this.handleClick({param: this.applyForm.return_apply_no}, 'service-xsthd-return');
            },
            toEdit () {
                this.handleClick({param: this.applyForm.return_apply_no}, 'service-htxgd-make');
            }
        },
        created () {
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
