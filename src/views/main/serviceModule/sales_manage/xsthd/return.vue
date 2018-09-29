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
                        <FormItem label="退货总额：" style="margin:0;">
                            {{ parseFloat(thdDetail.return_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="其他金额：" style="margin:0;" prop="other_amount">
                            <Input v-model="thdDetail.other_amount" placeholder="请输入其他金额"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ parseFloat(thdDetail.must_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ thdDetail.seller_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ thdDetail.seller_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ thdDetail.server_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ thdDetail.server_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货仓库：" style="margin:0;" prop="return_store_no">
                            <Select v-model="thdDetail.return_store_no" filterable>
                                <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货物流：" style="margin:0;" prop="return_shipping">
                            <Select v-model="thdDetail.return_shipping" filterable>
                                <Option v-for="item in returnStatusArr" :value="item.fhwlbh" :key="item.fhwlbh">{{ item.fhwlmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="快递单号：" style="margin:0;" prop="return_ship_no">
                                <Input v-model="thdDetail.return_ship_no" placeholder="请输入快递单号"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        
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
                            {{ khDetail.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.contact_user}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.contact_method }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.seller_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.seller_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.server_name }}
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
                        退货商品明细
                    </p>                   
                    <Row class="special-return-detail">
                        <Form>
                            <Col span="6">
                                <FormItem label="退货商品总数：">
                                    <span>{{returnCount.total_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="退货商品总额：">
                                    <span>{{returnCount.total_amount}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150"></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150"></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="100"></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column prop="return_price" label="退货单价" sortable min-width="100"></el-table-column>
                            <el-table-column prop="order_num" label="合同数量">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.order_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="can_return_num" label="可退数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.can_return_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="return_num" label="本次退货数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <Input v-model="scope.row.return_num" @on-blur="valithsl(scope.row.return_num, scope.row.can_return_num, scope.$index)" @on-change="changeAmount()"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="return_amount" label="退货金额">
                                <template slot-scope="scope">
                                    <span> {{ (scope.row.return_price * scope.row.return_num).toFixed(4) }}</span>
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
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="saveAdd()">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { allStoreInfos, apiSalesReturnApplyDetail, apiThdDetailAddNew, apiSendLogistic } from '@/config/getData';
    import { closeCurrentPage,sortBy} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                thsqdbh: this.$route.query.param || 'TH-100101-0001',
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
                        { required: true, message: '退货仓库不能为空', trigger: 'on-change' }
                    ]
                },  
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                returnStatus: {},
                returnStatusArr: [],
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
            };
        },
        methods: {  
            getStatus () {
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatusArr = res.data;
                    }
                });
            },
            changeAmount() {
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.data.forEach(item => {
                    this.returnCount.total_num +=  +item.return_num;
                    this.returnCount.total_amount +=  +(item.return_num * item.return_price);
                });
                this.returnCount.total_num =this.returnCount.total_num.toFixed(0);
                this.returnCount.total_amount = this.returnCount.total_amount.toFixed(4);
            },                                
            getAllStoreInfos () {
                allStoreInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.storageList.push({
                                value: item.ckbh,
                                label: item.ckmc
                            });
                        });
                        this.getData();
                    }
                });
            },
            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行退货数量大于可退货数量');
                }
            },
            saveAdd() {
                let tmpArr = [];
                let hasError = false;
                let hasBasicError = false;
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
//                        this.thdList.data.forEach((item, index) => {
//                            if (parseInt(item.return_num) > parseInt(item.can_return_num)) {
//                                this.$Message.error('提交的退货数量格式有误!');
//                                return false;
//                            }
//                            tmpArr.push({
//                                order_detail_id: item.order_detail_id,
//                                return_num: item.return_num
//                            });
//                        });
                        for (let i in this.thdList.data) {
                            let n = parseInt(i) + parseInt(1);
                            if (!/^\d+$/.test(this.thdList.data[i].return_num) && this.thdList.data[i].return_num != 0) {
                                this.$Message.error('第' + n + '行提交的退货数量必须为大于等于0的整数!');
                                return false;
                            } else if (parseInt(this.thdList.data[i].return_num) > parseInt(this.thdList.data[i].can_return_num)) {
                                this.$Message.error('第' + n + '行提交的退货数量不能大于可退货数量!');
                                return false;
                            }
                            if (+this.thdList.data[i].return_num > 0) {
                                tmpArr.push({
                                    order_detail_id: this.thdList.data[i].order_detail_id,
                                    return_num: this.thdList.data[i].return_num
                                });
                            }
                        }
                        if (tmpArr.length == 0) {
                            this.$Message.error('保存的退货数量不能都为0');
                            return;
                        }
                        this.thdDetail.details = tmpArr;
                        this.loadding = true;
                        apiThdDetailAddNew(this, {
                            params: JSON.stringify(this.thdDetail)
                        }).then(res => {
                            if (res && res.status) {
                                this.$Message.success('保存成功!');
                                this.loadding = false;
                                closeCurrentPage(this);
                                util.openNewPage(this, 'service-xsthd-detail', {
                                    param: res.data.return_no,
                                    fromAdd: '1'
                                });
                                this.$router.push({
                                    name: 'service-xsthd-detail',
                                    query: {
                                        param: res.data.return_no,
                                        fromAdd: '1'
                                    }
                                });
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
//                if (hasError) {
//                    this.$Message.error('提交的退货数量格式有误!');
//                    return;
//                }
//                if (hasBasicError) {
//                    this.$Message.error('提交的基本信息格式有误!');
//                    return;
//                }
            },
            getData () {
                apiSalesReturnApplyDetail(this, {
                    'return_apply_no': this.thsqdbh,
                    'can_return_num': true
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data;
                        this.thdDetail = res.data;
                        res.data.detail.forEach(item => {
                            item.return_num = 0;
                            item.return_amount = 0;
                        });
                        this.thdList.data = res.data.detail;
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
            this.getStatus();
            this.getAllStoreInfos();
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
