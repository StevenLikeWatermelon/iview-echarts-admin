<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
</style>
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
                            {{ xjdDetail.time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="是否转订单：" style="margin:0;">
                            {{ xjdDetail.is_order }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="报价状态：" style="margin:0;">
                            {{ bjStatus[xjdDetail.bj_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="有效期：" style="margin:0;">
                            {{ xjdDetail.yxq }}
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
                            {{ xjdDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ xjdDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ xjdDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ xjdDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ xjdDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ xjdDetail.bmmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ xjdDetail.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ xjdDetail.czygbm }}
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
                <div>
                    <el-table :data="xjdDetail.goods_detail" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom"></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" sortable="custom"></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150"></el-table-column>
                        <el-table-column prop="cpxl" label="系列" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column prop="cpmj" label="商品面价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <div>
                                    <span> {{ parseFloat(scope.row.cpmj).toFixed(2) }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="询价数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseInt(scope.row.xjsl) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报价数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseInt(scope.row.bjsl) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报价折扣" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.htzk).toFixed(3) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报价单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.htdj).toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报价货期" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span> {{ scope.row.hthq }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购单价(结算价)" sortable="custom">
                            <template slot-scope="scope">
                                <span> {{ parseFloat(scope.row.htje).toFixed(2) }}</span>
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
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus } from '@/config/getData';

    export default {
        data () {
            return {
                xjdbh: this.$route.query.param,
                xjdDetail: {
                    time: '12.121.1',
                    is_order: '否',
                    bj_status: '2',
                    yxq: '2017.5.6',
                    khbh: '12',
                    khmc: '12',
                    lxr: '12',
                    sjhm: '12',
                    xsyg: '12',
                    bmmc: '12',
                    kf: 'adad',
                    czygbm: '12313',
                    shrxm: 'sdgvsf00',
                    shrdhhm: 'sadfsf',
                    shdz: 'sdjgl',
                    fhfs: '字体',
                    goods_detail: [],
                    xxdz: '1sdajfabk'
                },
                bjStatus: ''
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xjd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.bjStatus = res.data.xjd_status;
                    }
                });
            },
            getData () {
                this.xjdDetail.goods_detail = [
                    {
                        cpdhh: '12313',
                        cpppmc: 'sinaide',
                        cpxh: 'ahdf',
                        cpxl: 'askdbad',
                        cpmj: '152.00',
                        htdj: '12.00',
                        htzk: '0.235',
                        xjsl: '321',
                        bjsl: '12',
                        kykc: '12',
                        hthq: '1',
                        htje: '12.00',
                        is_zk: '否'
                    },
                    {
                        cpdhh: '12313',
                        cpppmc: 'sinaide',
                        cpxh: 'ahdf',
                        cpxl: 'askdbad',
                        cpmj: '152.00',
                        htdj: '12.00',
                        htzk: '0.235',
                        xjsl: '321',
                        bjsl: '12',
                        kykc: '12',
                        hthq: '1',
                        htje: '12.00',
                        is_zk: '否'
                    }
                ];

            },
            //排序
            manualSort (column) {
//                let isDec = column.order == "descending" ? true : false;
//                this.orderDetail.goods.data.sort(sortBy(column.prop, isDec));
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
