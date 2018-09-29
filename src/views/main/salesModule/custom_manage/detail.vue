<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Tabs :animated="false" style="overflow:visible;">
                    <TabPane label="基本信息">
                        <Row>
                            <Col span="24">
                            <Card>
                                <p slot="title" class="card-title">
                                    基本信息
                                </p>
                                <Form>
                                    <Row>
                                        <Col span="6">
                                        <FormItem label="手机号码：" style="margin:0;">
                                            {{ customDetail.sjhm }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="客户名称：" style="margin:0;">
                                            {{ customDetail.khmc }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="联系人：" style="margin:0;">
                                            {{ customDetail.lxr }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="积分：" style="margin:0;">
                                            {{ customDetail.jf }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="客户等级：" style="margin:0;">
                                            {{ customDetail.khdjmc }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="是否VIP用户：" style="margin:0;">
                                            {{ customDetail.is_vip }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="是否免运用户：" style="margin:0;">
                                            {{ customDetail.is_my }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="积分倍数：" style="margin:0;">
                                            {{ customDetail.jfbs }}
                                        </FormItem>
                                        </Col>
                                    </Row>
                                    <Row class="margin-top-10" style="border-top:1px dashed #d4d4d4;padding-top:16px;">
                                        <Col span="6">
                                        <FormItem label="所属销售：" style="margin:0;">
                                            {{ customDetail.ygxm }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="销售所属部门：" style="margin:0;">
                                            {{ customDetail.bmmc }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="所属客服：" style="margin:0;">
                                            {{ customDetail.czyg }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="客服所属部门：" style="margin:0;">
                                            {{ customDetail.czygbm }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="新阳客户ID：" style="margin:0;">
                                            {{ customDetail.xy_kh_id }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="企业认证：" style="margin:0;">
                                            {{ qyrz[customDetail.is_qyrz] }}
                                        </FormItem>
                                        </Col>
                                        <Col span="6">
                                        <FormItem label="状态：" style="margin:0;">
                                            {{ customDetail.is_deleted }}
                                        </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane label="认证信息">
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                认证信息
                            </p>
                            <Row>
                                <Form>
                                    <Col span="24">
                                    <FormItem label="认证地址：" style="margin:0;">
                                        <span v-if="customDetail.rz_address != ''">
                                            {{ customDetail.rz_address}}
                                        </span>
                                        <span v-else>
                                            无
                                        </span>
                                    </FormItem>
                                    </Col>
                                    <Col span="24">
                                    <FormItem label="营业执照图片：" style="margin-top:22px;">
                                        <span v-if="customDetail.rz_pic != ''">
                                            <img :src="this.imgURL + customDetail.rz_pic" height="500">
                                        </span>
                                        <span v-else>
                                            无
                                        </span>
                                    </FormItem>
                                    </Col>
                                </Form>
                            </Row>
                        </Card>
                    </TabPane>

                    <TabPane label="积分记录">
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                积分记录
                            </p>
                            <el-table :data="pointDetail.data" border stripe style="text-align: center">
                                <el-table-column prop="point" label="积分数量" width="200"></el-table-column>
                                <el-table-column prop="source" label="积分用途/来源" width="200">
                                    <template slot-scope="scope">
                                        <span> {{ point_source[scope.row.source] }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="action" label="行为" width="150">
                                    <template slot-scope="scope">
                                        <span> {{ point_action[scope.row.action] }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ordernum" label="单据编号" width="200"></el-table-column>
                                <el-table-column prop="note" label="备注"  show-overflow-tooltip></el-table-column>
                                <el-table-column prop="created" label="记录时间" width="200"></el-table-column>
                            </el-table>
                            <pagination :current= "pointDetail.currentPage" v-on:getPage="getPointPage" v-on:getLimit="getPointLimit" :totalnum="pointDetail.totalnum"></pagination>
                        </Card>
                    </TabPane>

                    <TabPane label="等级变动">
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                等级变动
                            </p>
                            <el-table :data="levelDetail.data" border stripe style="text-align: center">
                                <el-table-column prop="bdhdjmc" label="变动后"></el-table-column>
                                <el-table-column prop="bdqdjmc" label="变动前"></el-table-column>
                                <el-table-column prop="sxsj" label="变动时间"></el-table-column>
                            </el-table>
                        </Card>
                    </TabPane>

                    <TabPane label="收货地址">
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                收货地址
                            </p>
                            <el-table :data="addressDetail.data" border stripe style="text-align: center">
                                <el-table-column prop="shrxm" label="收货人" width="200"  show-overflow-tooltip></el-table-column>
                                <el-table-column prop="address" label="收货地址"  show-overflow-tooltip></el-table-column>
                                <el-table-column prop="shrdhhm" label="联系方式" width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="sfmrmc" label="是否默认" width="150"></el-table-column>
                            </el-table>
                        </Card>
                    </TabPane>

                    <TabPane label="发票设置">
                        <Card class="margin-top-10">
                            <p slot="title" class="card-title">
                                发票设置
                            </p>
                            <el-table :data="invoiceDetail.data" border stripe style="text-align: center">
                                <el-table-column prop="fplxmc" label="发票类型" width="200"></el-table-column>
                                <el-table-column prop="fptt" label="发票抬头" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="swdjzh" label="纳税人识别号" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="kpdhhm" label="开票电话号码" width="150" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="jbkhyhmc" label="开户银行" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="jbkhzh" label="银行账号" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="sfmrmc" label="是否默认" width="150"></el-table-column>
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
    import pagination from '../../../common/pagination.vue';
    import { apiCustomDetail, apiAllStatus, getPointFrom, getPointAction } from '@/config/getData';

    export default {
        name: 'custom-manage-detail',
        components: {
            pagination
        },
        data () {
            return {
                qyrz: [],                                       //认证状态
                point_source: [],                               //积分来源
                point_action: [],                               //积分行为
                khbh: this.$route.query.khbh,                   //传过来的客户编号

                customDetail: {},                               //基本信息和认证信息
                pointDetail: {
                    currentPage: 1,
                    totalnum: 0,
                    limit: 10,
                    data:[]                                     //积分详情
                },
                levelDetail: {
                    data:[]                                     //等级详情
                },
                addressDetail: {
                    data:[]                                     //地址编号
                },
                invoiceDetail: {
                    data:[]                                     //发票设置列表
                },
                originData: {                                   //总共初始数据
                    point: [],
                }
            }
        },
        methods: {
            getPointPage (page) {
                this.pointDetail.currentPage = page;
                let _start = (page - 1) * this.pointDetail.limit;
                let _end = page * this.pointDetail.limit;
                this.pointDetail.data = this.originData.point.slice(_start, _end);
            },
            getPointLimit (limit) {
                this.pointDetail.limit = limit;
                this.pointDetail.currentPage = 1;
                this.getPointPage(this.pointDetail.currentPage);
            },
            //获取状态信息
            getCondition () {
                apiAllStatus(this, {
                    type: JSON.stringify(['is_qyrz', 'point_from', 'point_action'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.qyrz = res.data.is_qyrz;
                        this.point_source = res.data.point_from;
                        this.point_action = res.data.point_action;
                    }
                });
            },
            //调用接口
            getData () {
                let argu = { khbh: this.khbh };
                apiCustomDetail(this, {
                    params: JSON.stringify(argu)
                }).then( res => {
                    if (res.status === 1) {
                        this.customDetail = res.data.kh_info;                                   //基本信息和认证信息
                        this.originData.point = JSON.parse(JSON.stringify(res.data.point.record));                              //积分全部数据
                        this.pointDetail.data = this.originData.point.slice(0, this.pointDetail.limit);                         //积分记录
                        this.pointDetail.totalnum = res.data.point.totalnum;                                                    //积分记录总数
                        this.levelDetail.data = res.data.level.record;                          //等级记录
                        this.addressDetail.data = res.data.address.list;                        //地址列表
                        this.invoiceDetail.data = res.data.invoice.list;                        //发票设置
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                })
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getCondition();            //获取状态信息
            this.getData();                 //接口调用
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
    }
</script>