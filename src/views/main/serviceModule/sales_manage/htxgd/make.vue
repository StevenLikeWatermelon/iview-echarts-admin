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
                        <FormItem label="退货申请单编号：" style="margin:0;">
                            {{ thdDetail.return_apply_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ thdDetail.sell_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="申请退货时间：" style="margin:0;">
                            {{ thdDetail.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ thdDetail.seller }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ thdDetail.seller_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ thdDetail.server }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ thdDetail.server_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ thdDetail.note }}
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
                            {{ khDetail.sell_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.sell_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.server_no }} / {{khDetail.server_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.server_depart }}
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
                        取消商品明细
                    </p>                   
                    <Row class="special-return-detail">
                        <Form>
                            <Col span="6">
                                <FormItem label="取消商品总数：">
                                    <span>{{returnCount.total_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="取消商品总额：">
                                    <span>{{ parseFloat(returnCount.total_amount).toFixed(4) }}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column prop="return_price" label="退货单价" sortable min-width="100"></el-table-column>
                            <el-table-column prop="htsl" label="合同数量">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.htsl) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="num" label="可取消数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="change_num" label="取消数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <Input v-model="scope.row.change_num" @on-blur="valithsl(scope.row.change_num, scope.row.num, scope.$index)" @on-change="changeAmount()"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="change_amount" label="取消金额">
                                <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.return_price * scope.row.change_num).toFixed(4) }}</span>
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
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loadding" @click="saveAdd()">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import {apiHtxgdDetailReadyMake, apiHtxgdDetailAdd } from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                thsqdbh: this.$route.query.param,
                ruleValidate: {
                    other_amount: [
                        { required: true, message: '其他金额不能为空', trigger: 'blur' }
                    ],
                    return_shipping: [
                        { required: true, message: '退货物流不能为空', trigger: 'blur' }
                    ],
                    return_ship_no: [
                        { required: true, message: '快递单号不能为空', trigger: 'blur' }
                    ],
                    return_store_no: [
                        { required: true, message: '退货仓库不能为空', trigger: 'blur' }
                    ]
                },  
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                storageList: [],
                thdDetail: {
                    other_amount: '',
                    return_store_no: '',
                    return_shipping: '',
                    return_ship_no: ''
                },
                khDetail: {},
                thdList: {
                    title: [],
                    data: []
                },
                loadding: false
            };
        },
        methods: {  
            changeAmount() {
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.data.forEach(item => {
                    this.returnCount.total_num +=  +item.change_num;
                    this.returnCount.total_amount +=  +(item.change_num * item.return_price);
                });
                this.returnCount.total_num =this.returnCount.total_num.toFixed(0);
                this.returnCount.total_amount = this.returnCount.total_amount.toFixed(4);
            },                                
            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行取消数量大于可取消数量');
                }
            },
            saveAdd() {
                let tmpArr = [];
                let hasError = false;
                this.thdList.data.forEach((item, index) => {
                    if (+item.change_num > +item.num) {
                         this.$Message.error('第【'+(index + 1)+'】行取消数量大于可取消数量');
                         hasError = true;
                    }
                    tmpArr.push({
                        id: item.id,
                        number: item.change_num
                    });
                });
                if (hasError) {
                    return
                }
                this.loadding = true;
                apiHtxgdDetailAdd(this, {
                    rel_order_no: this.$route.query.param,
                    params: JSON.stringify({
                        list: tmpArr
                    })
                }).then(res => {
                    if (res && res.status) {
                        this.$Message.success('保存成功!');
                        this.loadding = false;
                        closeCurrentPage(this);
                        util.openNewPage(this, 'service-htxgd-detail', {
                            param: res.data.order_change_no,
                            fromAdd: '1'
                        });
                        this.$router.push({
                            name: 'service-htxgd-detail',
                            query: {
                                param: res.data.order_change_no,
                                fromAdd: '1'
                            }
                        });
                    } else {
                        this.loadding = false;
                        this.$Message.error(res.message);
                    }
                })
            },
            getData () {
                apiHtxgdDetailReadyMake(this, {
                    params: JSON.stringify({
                        return_apply_no: this.$route.query.param
                    })
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.kh_info;
                        this.thdDetail = res.data.basic_info;
                        this.thdList.data = res.data.product_info;
                        this.changeAmount();
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
