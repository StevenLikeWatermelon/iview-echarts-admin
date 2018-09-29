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
                        <FormItem label="退货申请单编号：">
                            {{ thdDetail.return_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：">
                            {{ thdDetail.sell_order_no }}
                        </FormItem>
                        </Col>
                        
                        <Col span="6">
                        <FormItem label="退货仓库：" prop="return_store_no">
                            <Select v-model="thdDetail.return_store_no" filterable>
                                <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货物流：" prop="return_shipping">
                            <Input v-model="thdDetail.return_shipping" placeholder="请输入退货物流"></Input>
                        </FormItem>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col span="6">
                            <FormItem label="快递单号：" prop="return_ship_no">
                                <Input v-model="thdDetail.return_ship_no" placeholder="请输入快递单号"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="备注：">
                                <Input type="textarea" :rows="4" v-model="thdDetail.note" placeholder="请输入备注" ></Input>
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
                        <el-table :data="thdList" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150"></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150"></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="100"></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column prop="return_price" label="入库单价" sortable min-width="100"></el-table-column>
                            <el-table-column prop="return_num" label="退货数量" sortable min-width="100"></el-table-column>
                            <el-table-column prop="RkNum" label="入库数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span>{{scope.row.RkNum}}</span>
                                    <!--<Input v-model="" @on-blur="valithsl(scope.row.RkNum, scope.row.return_num, scope.$index)" @on-change="changeAmount(scope, scope.$index)"></Input>-->
                                </template>
                            </el-table-column>
                            <el-table-column prop="return_amount" label="入库金额"></el-table-column>
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
    import { allStoreInfos, apiToMakeThrkd, apiMakeThrkd } from '@/config/getData';
    import { closeCurrentPage,sortBy } from '@/config/mUtils';
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
                        { required: true, message: '退货仓库不能为空', trigger: 'on-change' }
                    ]
                },  
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                storageList: [],
                thdDetail: {
                    return_store_no: '',
                    return_shipping: '',
                    return_ship_no: '',
                    note: ''
                },
                khDetail: {},
                thdList: [],
                loadding: false
            };
        },
        methods: {  
            changeAmount(scope,index) {
                if (scope) {
                    scope.row.return_amount = (+scope.row.RkNum * +scope.row.return_price).toFixed(4);
                    this.thdList.splice(index, 1, scope.row);
                }
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.forEach(item => {
                    this.returnCount.total_num +=  +item.RkNum;
                    this.returnCount.total_amount +=  +(item.RkNum * item.return_price);
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
                    this.$Message.error('第【'+cpdhh+'】行入库数量大于可入库数量');
                }
            },
            saveAdd() {
                let tmpObj = {};
                let hasError = false;
                let hasBasicError = false;
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        for (let i in this.thdList) {
                            let n = parseInt(i) + parseInt(1);
                            if (!/^[1-9]\d*$/.test(this.thdList[i].RkNum)) {
                                this.$Message.error('第' + n + '行提交的入库数量必须为大于等于0的整数!');
                                return false;
                            } else if (parseInt(this.thdList[i].RkNum) > parseInt(this.thdList[i].return_num)) {
                                this.$Message.error('第' + n + '行提交的入库数量不能大于退货数量!');
                                return false;
                            }
                        }
                        this.thdList.forEach(item => {
                            tmpObj[item.id] = item.RkNum;
                        });
                        this.loadding = true;
                        apiMakeThrkd(this, {
                            params: JSON.stringify({
                                return_no: this.thdDetail.return_no,
                                stock_no: this.thdDetail.return_store_no,
                                ship_name: this.thdDetail.return_shipping,
                                ship_no: this.thdDetail.return_ship_no,
                                note: this.thdDetail.note,
                            }),
                            list: JSON.stringify(tmpObj)
                        }).then(res => {
                            if (res && res.status) {
                                this.$Message.success('保存成功!');
                                this.loadding = false;
                                closeCurrentPage(this);
                                util.openNewPage(this, 'service-thrkd-detail', {
                                    param: res.data.instock_no,
                                    fromAdd: '1'
                                });
                                this.$router.push({
                                    name: 'service-thrkd-detail',
                                    query: {
                                        param: res.data,
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
            },
            getData () {
                apiToMakeThrkd(this, {
                    'return_no': this.thsqdbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.thdDetail = res.data;
                        res.data.detail.forEach(item => {
                            item.RkNum = item.return_num;
                            item.return_amount = (+item.RkNum * +item.return_price).toFixed(4);
                            this.thdList.push(item);
                        });
                        this.changeAmount();
                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },          
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
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
