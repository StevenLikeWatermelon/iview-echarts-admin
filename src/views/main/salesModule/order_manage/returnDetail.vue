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
                        <FormItem label="退货单编号：" style="margin:0;">
                            {{ thdbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请退货人：" style="margin:0;">
                            {{ orderDetail.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请退货时间：" style="margin:0;">
                            {{ orderDetail.djrq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货金额：" style="margin:0;">
                            {{ orderDetail.thje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="其他金额：" style="margin:0;">
                            {{ orderDetail.qtje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ orderDetail.ytje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="实退金额：" style="margin:0;">
                            {{ orderDetail.stje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货单状态：" style="margin:0;">
                            {{ returnStatus[orderDetail.djzt]  }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ orderDetail.thyy }}
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
                            {{ orderDetail.khbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ orderDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ orderDetail.khlxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ orderDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ orderDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ orderDetail.bmmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ orderDetail.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ orderDetail.czygbm }}
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
                    退货商品明细
                </p>
                 <el-table :data="orderDetail.data" border stripe style="text-align: center"  @sort-change="manualSort">
                    <el-table-column prop="cpdhh" label="订货号" sortable="custom"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" sortable="custom"></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" sortable="custom"></el-table-column>
                    <el-table-column prop="cpxl" label="系列" sortable="custom"></el-table-column>
                    <el-table-column prop="htdj" label="合同单价" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.htdj).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="thsl" label="退货数量" sortable="custom"></el-table-column>
                    <el-table-column prop="thje" label="退货金额" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.thje).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
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
    import { apiOrderReturnDetail, apiAllStatus } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'order-manage-detail',
        data () {
            return {
                thdbh: this.$route.query.param.thdbh,
                htdbh: this.$route.query.param.htdbh,
                orderDetail: {},
                returnStatus: ''
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['thzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.thzt;
                    }
                });
            },
            getData () {
                apiOrderReturnDetail(this, {
                    params: JSON.stringify({
                        htdjbh: this.htdbh,
                        thdjbh: this.thdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderDetail = res.data[0];
                    }
                });
            },
             //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.orderDetail.data.sort(sortBy(column.prop, isDec));
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
