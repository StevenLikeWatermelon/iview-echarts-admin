<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="销售退货单编号：" style="margin:0;">
                            {{ thdDetail.djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货申请单编号：" style="margin:0;">
                            {{ thdDetail.djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ thdDetail.djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ thdDetail.djrq }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货总额：" style="margin:0;">
                            {{ thdDetail.thje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="其他金额：" style="margin:0;" prop="qtje">
                            <Input v-model="thdDetail.qtje" placeholder="请输入其他金额"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ thdDetail.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ thdDetail.sales }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ thdDetail.sales_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ thdDetail.customer }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ thdDetail.customer_bm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货仓库：" style="margin:0;" prop="thck">
                            <Select v-model="thdDetail.thck" filterable>
                                <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货物流：" style="margin:0;" prop="thwl">
                            <Input v-model="thdDetail.thwl" placeholder="请输入退货物流"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;">
                            {{ thdDetail.thyy }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;" prop="kddh">
                            <Input v-model="thdDetail.kddh" placeholder="请输入快递单号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ thdDetail.thyy }}
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
                        退货商品明细
                    </p>
                    <Row class="special-return-detail">
                        <Form>
                            <Col span="6">
                                <FormItem label="退货商品总数：">
                                    <!-- <span>{{returnCount.total_num}}</span> -->
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="退货商品总额：">
                                    <!-- <span>{{returnCount.total_amount}}</span> -->
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column prop="cpdhh" label="行号"></el-table-column>
                            <el-table-column prop="cpppmc" label="品牌"></el-table-column>
                            <el-table-column prop="cpppmc" label="产品名称" min-width="150"></el-table-column>
                            <el-table-column prop="cpxh" label="产品型号" min-width="150"></el-table-column>
                            <el-table-column prop="cpxl" label="订货号" min-width="100"></el-table-column>
                            <el-table-column prop="cpxl" label="计量单位"></el-table-column>
                            <el-table-column prop="cpxl" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column prop="htsl" label="合同数量">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.htsl) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="kthsl" label="可退数量" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.kthsl) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="thsl" label="本次退货数量" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <Input v-model="scope.row.thsl" @on-blur="valithsl(scope.row.thsl, scope.row.kthsl, scope.row.cpdhh)"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="thje" label="退货金额" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span v-else>{{ parseFloat(scope.row.htdj * scope.row.thsl).toFixed(2) }}</span>
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
                <Button type="error"  class="margin-top-10" style="margin:auto;" v-show="istuikuan" @click="handleClick( thdDetail.thje, thdDetail.djbh, thdDetail.qtje, 'service-xsthd-return')">退款</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;" v-show="approved"  @click="goApproved(1)">审批</Button>
                <Button type="warning" class="margin-top-10" style="margin:auto;" v-show="approved"  @click="goApproved(0)">驳回</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import {apiThdDetail,apiThdApproved,apiThdReturn, allStoreInfos } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';

    export default {
        data () {
            return {
                ruleValidate: {
                    thje: [
                        { required: true, message: '其他金额不能为空', trigger: 'blur' }
                    ],
                    thwl: [
                        { required: true, message: '退货物流不能为空', trigger: 'blur' }
                    ],
                    kddh: [
                        { required: true, message: '快递单号不能为空', trigger: 'blur' }
                    ],
                    thck: [
                        { required: true, message: '退货仓库不能为空', trigger: 'blur', type: 'array' }
                    ]
                },  
                storageList: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                thdbh: this.$route.query.param,
                thdDetail: {},
                khDetail: {},
                approved: false,
                istuikuan: false,
                thdList: {
                    title: [],
                    data: []
                },
                list: []
            };
        },
        methods: {
            getAllStoreInfos () {
                allStoreInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.storageList.push({
                                value: item.ckbh,
                                label: item.ckmc
                            });
                        });
                    }
                });
            },



            valithsl(thsl, kthsl, cpdhh){
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('【'+cpdhh+'】退货数量大于可退货数量');
                }
            },
            handleClick (thje, djbh, qtje, path) {
                let argu = { thje,djbh,qtje };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getData () {
                apiThdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'thd_djbh': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.kh_info;
                        this.thdDetail = res.data.basic_info;
                        this.thdList.data = res.data.list;
                        if(res.data.basic_info.djzt == 0){
                            this.approved = true;
                        }
                        if(res.data.basic_info.djzt != 4 && res.data.basic_info.djzt != 5 && res.data.basic_info.djzt != 1 && res.data.basic_info.djzt != 3){
                            this.is_abolish = true;
                        }
                        if(res.data.basic_info.djzt == 3){
                            this.istuikuan = true;
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            //审批和驳回
            goApproved (num) {
                apiThdApproved(this, {
                    params: JSON.stringify(this.notempty({
                        'thd_djbh': this.thdbh,
                        'pass': num
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.thdDetail.djzt = res.data.djzt;
                        this.approved = false;
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            }
        },
        created () {
            this.getAllStoreInfos();
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
