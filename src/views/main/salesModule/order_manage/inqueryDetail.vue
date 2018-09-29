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
                        <FormItem label="询价单编号：" style="margin:0;">
                            {{ xjdbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="下单时间：" style="margin:0;">
                            {{ basic.xjd_create }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="是否转订单：" style="margin:0;">
                            {{ basic.is_ordered }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="报价状态：" style="margin:0;">
                           {{  bj_status[basic.xjd_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="有效期：" style="margin:0;">
                            {{ basic.xjd_valid_date }}
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
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ kh.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ kh.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ kh.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ kh.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ kh.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ kh.bmmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ kh.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ kh.czygbm }}
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
                    商品明细
                </p>
                <el-table :data="orderDetail.goods.data" border stripe style="text-align: center"  @sort-change="manualSort">
                    <el-table-column prop="cpdhh" label="订货号" sortable="custom"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" sortable="custom"></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" sortable="custom"></el-table-column>
                    <el-table-column prop="cpmj" label="商品面价" sortable="custom">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="parseInt(scope.row.cpmj) >= 0"> {{ parseFloat(scope.row.cpmj).toFixed(2) }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpxjsl" label="询价数量" sortable="custom"></el-table-column>
                    <el-table-column prop="cpbjsl" label="报价数量" sortable="custom"></el-table-column>
                    <el-table-column prop="spzk" label="报价折扣" sortable="custom"></el-table-column>
                    <el-table-column prop="spzjg" label="报价单价" sortable="custom"></el-table-column>
                    <el-table-column prop="sphq" label="货期" sortable="custom"></el-table-column>
                    <el-table-column prop="jhdj" label="采购单价(结算价)" sortable="custom"></el-table-column>
                </el-table>
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
    import { apiOrderInquiryDetail, apiAllStatus } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'order-manage-detail',
        data () {
            return {
                xjdbh: this.$route.query.param,
                basic: {},
                bj_status: '',
                kh: {},
                orderDetail: {
                    /*商品信息*/
                    goods: {
                        title: [],
                        data: []
                    }
                }
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xjd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.bj_status = res.data.xjd_status;
                    }
                });
            },
            getData () {
                apiOrderInquiryDetail(this, {
                    params: JSON.stringify({
                        khxjd: this.xjdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        /*基本信息*/
                        this.basic = res.data.xjd_basic;
                        /*客户信息*/
                        this.kh = res.data.xjd_kh;
                        /*商品明细*/
                        this.orderDetail.goods.data = res.data.xjd_detail;
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
