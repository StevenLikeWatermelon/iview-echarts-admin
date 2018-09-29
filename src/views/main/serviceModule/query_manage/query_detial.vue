<style scoped>
    .query-detail .ivu-card-head p {
        height: 24px;
        margin-bottom: -4px;
    }
    .query-detail p button {
        float: right;
        margin-right: 10px;
        margin-top: 13px;
    }
    .query-detail .placeholder {
        padding: 2px 0 0 36px;
        font-size: 12px;
        color: #aaa;
    }
</style>
<template>
    <div class="query-detail">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <span>单据基本信息</span>
                    <span v-show=" xshtdDetail.xjd_status == 0" style="float:right;"  v-auth="serviceShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" v-if="djxxIsEdit" @click="edit('djxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;" v-else>
                            <Button type="primary" @click="close('djxxsave')">保存</Button>
                            <Button type="default" @click="close('djxxcancel')">取消</Button>
                        </span>
                    </span>
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="询价单编号：" style="margin:0;">
                            {{ xjdbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="下单时间：" style="margin:0;">
                            {{ xshtdDetail.xjd_create }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="是否转订单：" style="margin:0;">
                            {{ xshtdDetail.order_id }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="报价状态：" style="margin:0;">
                            {{ xjd_status[xshtdDetail.xjd_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                           {{ xshtdDetail.xsyg_ygbh}}/{{ xshtdDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ xshtdDetail.xsygbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ xshtdDetail.kfyg_ygbh}}/{{ xshtdDetail.kfyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ xshtdDetail.kfygbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="有效期：" style="margin:0;">
                            <span v-if="djxxIsEdit">{{ xshtdDetail.xjd_valid_date }}</span>
                            <DatePicker type="datetime" :value="xshtdDetail.xjd_valid_date" placeholder="请选择" @on-change="datetime" style="width: 170px;height:20px;" v-else></DatePicker>
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
                    <span>客户信息</span>
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="客户编号：" style="margin:0;">
                            {{ customer_info.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ customer_info.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ customer_info.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ customer_info.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{customer_info.ssxs_ygbh}}/{{ customer_info.ssxs }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ customer_info.ssxs_ygbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{customer_info.sskf_ygbh}}/{{ customer_info.sskf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ customer_info.sskf_ygbm }}
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
                    <span>商品明细</span>
                    <span v-show=" xshtdDetail.xjd_status == 0" style="float:right;"  v-auth="serviceShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" v-if="spmxIsEdit" @click="edit('spmx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;" v-else>
                            <Button type="primary" @click="close('spmxsave')">保存</Button>
                            <Button type="default" @click="close('spmxcancel')">取消</Button>
                        </span>
                    </span>
                </p>
                <Form>
                    <el-table :data="goodsDetail.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom" width="120" show-overflow-tooltip>

                        </el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxl" label="系列" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmj" label="商品面价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="cpxjsl" label="询价数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="cpbjsl" label="报价数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="spmxIsEdit">{{ scope.row.cpbjsl }}</span>
                                <Input v-model="scope.row.cpbjsl" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="spzk" label="报价折扣" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="spmxIsEdit">{{ scope.row.spzk }}</span>
                                <Input v-model="scope.row.spzk" v-else @on-change="scope.row.spzjg = (Math.ceil(parseFloat(scope.row.spzk * scope.row.cpmj).toFixed(3) * 100) / 100).toFixed(2)" @on-blur="zkChange(scope.row.spzk, scope.row.cpdhh)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="spzjg" label="报价单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="spmxIsEdit">{{ scope.row.spzjg }}</span>
                                <Input v-model="scope.row.spzjg" v-else @on-change="scope.row.spzk = (Math.ceil(parseFloat(scope.row.spzjg / scope.row.cpmj) .toFixed(4) * 1000) / 1000).toFixed(3)" @on-blur="djChange(scope.row.spzjg, scope.row.cpdhh)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sphq" label="报价货期" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="spmxIsEdit">{{ scope.row.sphq }}</span>
                                <Input v-model="scope.row.sphq" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="jhdj" label="采购单价(结算价)" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span v-if="spmxIsEdit">{{ scope.row.jhdj }}</span>
                                <Input v-model="scope.row.jhdj" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="!spmxIsEdit">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="sureAction('cancel', scope.$index)">删除</span> <!--@click="goodsDel()"-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <Row v-if="!spmxIsEdit" class="margin-top-20">
                        <Col span="6">
                        <FormItem style="margin:0;">
                            <Input type="textarea" v-model="goodsDetail.newdhh"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                            <!--<div>批量添加商品编号和数量，用空格隔开（支持从Excel复制）</div>-->
                            <!--<div>示例：</div>-->
                            <!--<div v-for="items in importExample">-->
                                <!--<div>{{ items.value }}&nbsp;&nbsp;{{items.num}}</div>-->
                            <!--</div>-->
                            <Button type="primary" @click="addGoods">批量添加</Button>
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
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="sureAction('bj')" v-show=" xshtdDetail.xjd_status == 0" v-auth="detailButtonLimit">确认报价</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="sureAction('zf')" v-show=" xshtdDetail.xjd_status == 0 || (xshtdDetail.xjd_status == 1 && xshtdDetail.order_id == '未转')" v-auth="detailButtonLimit">确认作废</Button>
                <!--<Button type="warning" class="margin-top-10" style="margin:auto;" @click="sureAction('bh')" v-show=" ">驳回</Button>-->
            </Card>
            </Col>
        </Row>
        <!--确认报价弹框-->
        <Modal v-model='sureBjModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认报价</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">报价</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction('bjModalCancel')">取消</Button>
                <Button type="primary" @click="sureAction('bjModalSave')">确定</Button>
            </div>
        </Modal>
        <!--确认作废弹框-->
        <Modal v-model='sureZfModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认作废</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">作废</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction('zfModalCancel')">取消</Button>
                <Button type="primary" :loading="loading" @click="sureAction('zfModalSave')">确定</Button>
            </div>
        </Modal>
        <!--确认删除-->
        <Modal v-model='sureCancelModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认删除</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction('cancelModalCancel')">取消</Button>
                <Button type="primary" @click="sureAction('cancelModalSave')">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiServiceInqueryDetail, apiAllStatus, apiServiceInqueryBasicModify, apiServiceInqueryModifyState, apiServiceInqueryGoodsModify, apiServiceInqueryGoodsDelete, apiServiceInqueryGoodsAdd } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'order-manage-detail',
        data () {
            return {
                loading: false,
                xjdbh: this.$route.query.param,
                serviceShow: 'service-query-detail-edit',
                detailButtonLimit: 'service-query-detail-button',
                djxxIsEdit: true,
                spmxIsEdit: true,
                xshtdDetail: {},
                customer_info: {},
                orderStatus: '',
                payStatus: '',
                returnStatus: '',
                goodsDetail: {
                    data: [],
                    newdhh: ''
                },
                xjd_status: '',
                sureBjModal: false,
                sureZfModal: false,
                sureBhModal: false,
                sureCancelModal: false,
                spmx_id: ''
            };
        },
        methods: {
            djChange (value, dhh) {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (value === '') {
                    this.$Message.error('【' + dhh + '】请输入单价');
                } else if (!reg.test(value)) {
                    this.$Message.error('【' + dhh + '】报价单价必须是数字,且最多精确到2位！');
                }
            },
            zkChange (value, dhh) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                if (value === '') {
                    this.$Message.error('【' + dhh + '】请输入折扣');
                } else if (!reg.test(value)) {
                    this.$Message.error('【' + dhh + '】报价折扣必须是数字,且最多精确到3位！');
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xjd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xjd_status = res.data.xjd_status;
                    }
                });
            },
            getData () {
                apiServiceInqueryDetail(this, {
                    params: JSON.stringify({
                        xjdbh: this.xjdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.xshtdDetail = res.data.basic_info;
                        /*客户信息*/
                        this.customer_info = res.data.customer_info;
                        /*商品详情*/
                        this.goodsDetail.data = res.data.list;
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.goodsDetail.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            datetime (time) {
                this.xshtdDetail.xjd_valid_date = time;
            },
            edit (name) {
                if (name === 'djxx') {
                    this.djxxIsEdit = false;
                } else if (name === 'spmx') {
                    this.spmxIsEdit = false;
                }
            },
            sureAction (name, id) {
                if (name === 'bj') {
                    this.sureBjModal = true;
                } else if (name === 'zf') {
                    this.sureZfModal = true;
                } else if (name === 'cancel') {
                    this.spmx_id = id;
                    this.goodsDetail.data.splice(this.spmx_id, 1);
                } else if (name === 'bjModalCancel') {
                    this.sureBjModal = false;
                } else if (name === 'bjModalSave') {
                    apiServiceInqueryModifyState(this, {
                        params: JSON.stringify({
                            xjdbh: this.xjdbh,
                            type: 'inquiry_offer'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.sureBjModal = false;
                            this.getData();
                            this.$Message.success(res.message);
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'zfModalCancel') {
                    this.sureZfModal = false;
                } else if (name === 'zfModalSave') {
                    this.loading = true;
                    apiServiceInqueryModifyState(this, {
                        params: JSON.stringify({
                            xjdbh: this.xjdbh,
                            type: 'to_void'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.sureZfModal = false;
                            this.getData();
                            this.$Message.success(res.message);
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                } else if (name === 'cancelModalCancel') {
                    this.sureCancelModal = false;
                } else if (name === 'cancelModalSave') {
                    this.goodsDetail.data.splice(this.spmx_id, 1);
                    this.sureCancelModal = false;
                }
            },
            close (name) {
                if (name === 'djxxcancel') {
                    this.djxxIsEdit = true;
                } else if (name === 'djxxsave') {
                    apiServiceInqueryBasicModify(this, {
                        params: JSON.stringify({
                            xjdbh: this.xjdbh,
                            xjd_valid_date: this.xshtdDetail.xjd_valid_date
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.djxxIsEdit = true;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'spmxcancel') {
                    this.spmxIsEdit = true;
                    this.getData();
                } else if (name === 'spmxsave') {
                    var reg2 = /^\d+\.?(\d{1,2})?$/;
                    var reg3 = /^\d+\.?(\d{1,3})?$/;
                    for (let i = 0; i < this.goodsDetail.data.length; i++ ) {
                        if (!this.goodsDetail.data[i].spzk || (parseFloat(this.goodsDetail.data[i].spzk).toFixed(3) * 1000 == 0)) {
                            this.$Message.error('【' + this.goodsDetail.data[i].cpdhh + '】报价折扣不能为0且不能为空');
                            this.spmxIsEdit = false;
                            return false;
                        } else if (!reg3.test(this.goodsDetail.data[i].spzk)) {
                            this.$Message.error('【' + this.goodsDetail.data[i].cpdhh + '】报价折扣最多为三位小数');
                            this.spmxIsEdit = false;
                            return false;
                        } else if (!this.goodsDetail.data[i].spzjg || (parseFloat(this.goodsDetail.data[i].spzjg).toFixed(2) * 100 == 0)) {
                            this.$Message.error('【' + this.goodsDetail.data[i].cpdhh + '】报价单价不能为0且不能为空');
                            this.spmxIsEdit = false;
                            return false;
                        } else if (!reg2.test(this.goodsDetail.data[i].spzjg)) {
                            this.$Message.error('【' + this.goodsDetail.data[i].cpdhh + '】报价单价最多为两位小数');
                            this.spmxIsEdit = false;
                            return false;
                        } else if (!reg2.test(this.goodsDetail.data[i].jhdj)) {
                            this.$Message.error('【' + this.goodsDetail.data[i].cpdhh + '】采购单价最多为两位小数');
                            this.spmxIsEdit = false;
                            return false;
                        } else {
                            apiServiceInqueryGoodsModify(this, {
                                xjdbh: this.xjdbh,
                                params: JSON.stringify({
                                    list: this.goodsDetail.data
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.spmxIsEdit = true;
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    }
                }
            },
//            goodsDel (id) {
//                apiServiceInqueryGoodsDelete(this, {
//                    params: JSON.stringify({
//                        xjdbh: this.xjdbh,
//                        xjdmx_id: id
//                    })
//                }).then(res => {
//                    if (res && res.status == 1) {
//                        this.sureCancelModal = false;
//                        this.getData();
//                    } else {
//                        this.$Message.error(res.message);
//                    }
//                });
//            },
            addGoods () {
                let arr = this.goodsDetail.newdhh.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                let goodsVaildArr = [];
                for (let i in arrStr) {
                    arrList.push(arrStr[i].trim().replace(/\s+/g, ' ').split(' '));
                    //如果商品编号数量没填，则默认为1
                    if (arrList[i].length === 1) {
                        arrList[i][1] = 1;
                    }
                    if (arrList[i][0] !== '') {
                        goodsVaildArr.push(arrList[i]);
                    }
                }
                goodsVaildArr = goodsVaildArr.map (item => {
                    return item.join(' ');
                });
                goodsVaildArr = goodsVaildArr.join(',');

                apiServiceInqueryGoodsAdd(this, {
                    params: JSON.stringify({
                        xjdbh: this.xjdbh,
                        info: goodsVaildArr
                    })
                }).then(res => {
                    if (res && res.status == 1) {

                        this.goodsDetail.newdhh = '';
                        for (let i = 0; i < this.goodsDetail.data.length; i++) {
                            for (let j = 0; j < res.data.list.length; j++) {
                                if (this.goodsDetail.data[i].cpdhh === res.data.list[j].cpdhh) {
                                    res.data.splice(j, 1);
                                }
                            }
                        }
                        this.goodsDetail.data = this.goodsDetail.data.concat(res.data.list);

                        if (res.data.not_exist !== '') {
                            this.$Message.error(res.data.not_exist);
                        }
                        
//                        this.goodsDetail.data = res.data.list;
                        //this.getData();

                    } else {
                        this.$Message.error(res.message);
                    }
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
