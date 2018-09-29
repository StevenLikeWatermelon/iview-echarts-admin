<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="退货申请单编号：" style="margin:0;">
                            {{ applyForm.ckd_djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ applyForm.ckd_djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货总额：" style="margin:0;">
                            {{ applyForm.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="其他金额：" style="margin:0;">
                            <Input type="text" v-model="applyForm.qtje"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ applyForm.ytje | toDecimal }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ applyForm.sales }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ applyForm.sales_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ applyForm.customer }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ applyForm.customer_bm }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ applyForm.note }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6">
                        <FormItem label="退货仓库：" style="margin:0;">
                            <Select v-model="applyForm.stock"  placeholder="请选择">
                                <!--<Option v-for="val in abolishStatus" :value="val" :key="val">{{ val }}</Option>-->
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货物流：" style="margin:0;">
                            <Input type="text" v-model="applyForm.qtje"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="快递单号：" style="margin:0;">
                            <Input type="text" v-model="applyForm.qtje"></Input>
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
                    申请退货商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>退货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">退货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                    </div>
                    <el-table :data="ckdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌"></el-table-column>
                        <el-table-column prop="cpdhh" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" min-width="150"></el-table-column>
                        <el-table-column prop="cpxl" label="订货号" min-width="100"></el-table-column>
                        <el-table-column prop="cpxl" label="计量单位"></el-table-column>
                        <el-table-column prop="ckdj" label="合同单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ckdj" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ckdj" label="可退数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="ckdj" label="本次退货数量" sortable="custom">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.ckdj" ></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ckje" label="退货金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ scope.row.ckje }}</span>
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
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="save">保存</Button>
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
    import { apiAllStatus } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                //没有用到的就不要加字段了，为什么会有这行字，请看上一个版本这里是什么
                abolish: false,
                djbh: this.$route.query.param,
                orderStatus: [],
                payStatus: [],
                abolishStatus: [],
                ckdList: {
                    data: [
                        {ckdj: '12'}
                    ]
                },
                khDetail: {},
                applyForm: {},
                goods_edit: true,
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
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
                    type: JSON.stringify(['khzfzt', 'xshtdzt', 'is_abolish'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                        this.abolishStatus = res.data.is_abolish;
                    }
                });
            },
            getData () {
//                apiapplyForm(this, {
//                    params: JSON.stringify(this.notempty({
//                    }))
//                }).then(res => {
//                    if(res && res.status == 1){
//                    }else{
//                        this.$Message.error(res.message);
//                    }
//                });
            },
            save () {
                this.handleClick('', '');
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ckdList.data.sort(sortBy(column.prop, isDec));
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
