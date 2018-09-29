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
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ xshtdbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="下单时间：" style="margin:0;">
                            {{ xshtdDetail.djrq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="订单状态：" style="margin:0;">
                            {{ orderStatus[xshtdDetail.xshtdzt] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="支付状态：" style="margin:0;">
                            {{ payStatus[xshtdDetail.khzfzt] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="订单金额：" style="margin:0;">
                            {{ xshtdDetail.ddje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="物流金额：" style="margin:0;">
                            {{ xshtdDetail.wlje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="优惠金额：" style="margin:0;">
                            {{ xshtdDetail.yhje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应付金额：" style="margin:0;">
                            {{ xshtdDetail.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="实付金额：" style="margin:0;">
                            {{ xshtdDetail.sfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="本次积分：" style="margin:0;">
                            {{ xshtdDetail.hdjfsl }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-10" style="border-top:1px dashed #d4d4d4;padding-top:16px;">
                        <Col span="6">
                        <FormItem label="收货人：" style="margin:0;">
                            {{ xshtdDetail.shrxm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="收货人联系方式：" style="margin:0;">
                            {{ xshtdDetail.shrdhhm}}
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="收货地址：" style="margin:0;">
                            {{ xshtdDetail.shdz}}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-10" style="border-top:1px dashed #d4d4d4;padding-top:16px;">
                        <Col span="6">
                        <FormItem label="询价单编号：" style="margin:0;">
                            {{ xshtdDetail.xjdbh}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="新阳合同单号：" style="margin:0;">
                            {{ xshtdDetail.xy_ht_id}}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            {{ xshtdDetail.djbz}}
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
                            {{ xshtdDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ xshtdDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ xshtdDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ xshtdDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ xshtdDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ xshtdDetail.bmmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ xshtdDetail.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ xshtdDetail.czygbm }}
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
                <Tabs :animated="false">
                    <TabPane label="商品明细">
                        <el-table :data="orderDetail.goods.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column prop="cpdhh" label="订货号" sortable="custom"></el-table-column>
                            <el-table-column prop="cpppmc" label="品牌" sortable="custom"></el-table-column>
                            <el-table-column prop="cpxh" label="产品型号" sortable="custom"></el-table-column>
                            <el-table-column prop="cpxl" label="系列" sortable="custom"></el-table-column>
                            <el-table-column prop="cpmj" label="商品面价" sortable="custom">
                                 <template slot-scope="scope">
                                 <div>
                                     <span v-if="parseInt(scope.row.cpmj) >= 0"> {{ parseFloat(scope.row.cpmj).toFixed(2) }}</span>
                                 </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="htdj" label="合同单价" sortable="custom">
                                 <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.htdj).toFixed(2) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="htsl" label="合同数量" sortable="custom"></el-table-column>
                            <el-table-column prop="hthq" label="货期" sortable="custom"></el-table-column>
                            <el-table-column prop="htje" label="小计" sortable="custom">
                                 <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.htje).toFixed(2) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </TabPane>
                    <TabPane label="收款信息">
                        <el-table :data="orderDetail.receMoney.data" border stripe style="text-align: center">
                            <el-table-column prop="jsfsmc" label="收款方式"></el-table-column>
                            <el-table-column prop="pzhm" label="收款凭证号"></el-table-column>
                            <el-table-column prop="skje" label="收款金额"></el-table-column>
                            <el-table-column prop="czyg" label="收款人"></el-table-column>
                            <el-table-column prop="dkrq" label="收款时间"></el-table-column>
                        </el-table>
                    </TabPane>
                    <TabPane label="出库信息">
                        <Card class="margin-top-10" v-for="outstock in orderDetail.outStock">
                            <Row>
                                <Form>
                                    <Col span="6">
                                    <FormItem label="销售出库单编号：" style="margin:0;">
                                        {{ outstock.djbh }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="发货方式：" style="margin:0;">
                                        {{ outstock.fhfsmc }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="发货物流：" style="margin:0;">
                                        {{ outstock.fhwlmc }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="发货物流单号：" style="margin:0;">
                                        {{ outstock.hydh }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="发货人：" style="margin:0;">
                                        {{ outstock.czyg }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="发货时间：" style="margin:0;">
                                        {{ outstock.djrq }}
                                    </FormItem>
                                    </Col>
                                </Form>
                            </Row>
                            <p style="font-size:16px;line-height:40px;font-weight: bold;color:#666;border-top:1px dashed #d4d4d4;">发货商品明细</p>
                            <el-table :data="outstock.data" border stripe style="text-align: center">
                                <el-table-column prop="cpdhh" label="订货号" sortable></el-table-column>
                                <el-table-column prop="cpppmc" label="品牌" sortable></el-table-column>
                                <el-table-column prop="cpxh" label="产品型号" sortable></el-table-column>
                                <el-table-column prop="cpxl" label="系列" sortable></el-table-column>
                                <el-table-column prop="cksl" label="出库数量" sortable> </el-table-column>
                            </el-table>
                        </Card>
                    </TabPane>
                    <TabPane label="退货信息">
                        <Card class="margin-top-10" v-for="returngood in orderDetail.returnGoods">
                            <Row>
                                <Form>
                                    <Col span="6">
                                    <FormItem label="销售退货单编号：" style="margin:0;">
                                        {{ returngood.djbh }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="申请退货人：" style="margin:0;">
                                        {{ returngood.khmc }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="申请退货时间：" style="margin:0;">
                                        {{ returngood.djrq }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="退货金额：" style="margin:0;">
                                        {{ returngood.thje | toDecimal }}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="其他金额：" style="margin:0;">
                                        {{ returngood.qtje | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="应退金额：" style="margin:0;">
                                        {{ returngood.ytje | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="实退金额：" style="margin:0;">
                                        {{ returngood.stje | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="退货单状态：" style="margin:0;">
                                        {{ returnStatus[returngood.djzt] }}
                                    </FormItem>
                                    </Col>
                                    <Col span="24">
                                    <FormItem label="退货原因：" style="margin:0;">
                                        {{ returngood.thyy }}
                                    </FormItem>
                                    </Col>
                                </Form>
                            </Row>
                            <p style="font-size:16px;line-height:40px;font-weight: bold;color:#666;border-top:1px dashed #d4d4d4;">退货商品明细</p>
                            <el-table :data="returngood.data" border stripe style="text-align: center">
                                <el-table-column prop="cpdhh" label="订货号"></el-table-column>
                                <el-table-column prop="cpppmc" label="品牌"></el-table-column>
                                <el-table-column prop="cpxh" label="产品型号"></el-table-column>
                                <el-table-column prop="cpxl" label="系列"></el-table-column>
                                <el-table-column label="合同单价">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.htdj | toDecimal}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="thsl" label="退货数量"></el-table-column>
                                <el-table-column label="退货金额">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.thje | toDecimal}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Card>
                    </TabPane>
                </Tabs>
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
    import { apiOrderManageDetail, apiAllStatus } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'order-manage-detail',
        data () {
            return {
                xshtdbh: this.$route.query.htdbh,
                xshtdDetail: { },
                orderStatus: '',
                payStatus: '',
                returnStatus: '',
                orderDetail: {
                    /*商品信息*/
                    goods: {
                        title: [],
                        data: []
                    },
                    /*收款信息*/
                    receMoney: {
                        title: [],
                        data: []
                    },
                    /*出库商品明细*/
                    outStock: [],
                    /*退货商品明细*/
                    returnGoods: []
                }
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt', 'thzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                        this.returnStatus = res.data.thzt;
                    }
                });
            },
            getData () {
                apiOrderManageDetail(this, {
                    params: JSON.stringify({
                        djbh: this.xshtdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.xshtdDetail = res.data.xs_basic_datas || {};

                        /*商品明细*/
                        this.orderDetail.goods.data = res.data.xs_detail_datas;
                        /*收款信息*/
                        this.orderDetail.receMoney.data = res.data.xs_gather_datas;
                         /*出库信息*/
                        this.orderDetail.outStock = res.data.xs_outstock_datas;
                        /*退货信息*/
                        this.orderDetail.returnGoods = res.data.xs_return_datas;
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.orderDetail.goods.data.sort(sortBy(column.prop, isDec));
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
