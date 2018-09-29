<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120" :rules="basicRules"  ref="info" :model="info">
                    <Row>
                        <Col span="8">
                        <FormItem label="发票类型：" style="margin:0;">
                           <template slot-scope="scope">
                            <span> {{ fplxStatus[info.invoice_type] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="税率：" style="margin:0;">
                            {{info.buy_tax_rate}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发票类别：" style="margin:0;">
                            <template slot-scope="scope">
                            <span> {{ invoiceTypeStatus[info.order_invoice_type] }}</span>
                            </template>
                        </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="实际开票日期:" prop="invoice_time">
                                <Date-picker type="date" format="yyyy-MM-dd" :value="info.invoice_time" placeholder="选择日期" style="width: 200px" @on-change="changeDate"></Date-picker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="发票号码：" style="margin:0;" prop="invoice_no">
                            <Input v-model="info.invoice_no"  placeholder="请填写发票号码"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="info.note"  placeholder=""></Input>
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
                    退票商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>退票商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">退票商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney  | toFiexedFour}}</em></span>
                        <span class="margin-left-20">退票商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllWS  | toFiexedFour}}</em></span>
                        <span class="margin-left-20">退票商品总税额： <em style="color:#cf0012;font-style: normal;">{{ goodsAlltax  | toFiexedFour}}</em></span>
                    </div>
                    <el-table :data="orderData.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号" fixed></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" fixed width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" fixed min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" fixed min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" fixed min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_cost_price" label="未税单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.buy_cost_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="instock_num" label="入库数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="change_num" label="取消数量" sortable="custom" v-if="is_show" min-width="100"></el-table-column>
                        <el-table-column prop="return_num" label="退货数量" sortable="custom" v-if="!is_show" min-width="100"></el-table-column>
                        <el-table-column prop="wait_invoice_num" label="可退票数量" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column prop="num" label="本次退票数量" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.num" @on-change="sum();" @on-blur="vaild(scope.row.num, scope.row.invoicable_num);"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_num" label="退票金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_price, scope.row.num, 4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_cost_num" label="未税金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_cost_price, scope.row.num, 4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="let_stock_num" label="税额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ subtract(multiply(scope.row.buy_price, scope.row.num), multiply(scope.row.buy_cost_price, scope.row.num), 4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleted(scope.$index)">删除</span>
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
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus,apiGetgenerateInvoice,apiaddTP } from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (value === '') {
                    return callback(new Error('请输入实际发票金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到4位！'));
                } else {
                    callback();
                }
            };
            return {
                info:{
                    buy_tax_rate: '',
                    invoice_type: '',
                    order_invoice_type: '',
                    invoice_no: '',
                    // invoice_amount: '',
                    note: ''
                },
                htd_id: this.$route.query.param,
                actTable: {
                    data: [
                        {
                            cpdhh: '1239'
                        }
                    ]
                },
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: '120',
                goodsAllMoney: '132.00',
                goodsAllWS: '122',
                goodsAlltax: '1323',
                invoiceTypeStatus: '',
                fplxStatus: '',
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                goodsAllWS: 0.0000,
                goodsAlltax: 0.0000,
                is_show: false,
                orderData: {
                    title: [],
                    data: []
                },
                basicRules: {
                    invoice_no: [
                        { required: true, message: '发票号码不能空', trigger: 'on-change' },
                    ],
                    // invoice_amount:  [
                    //     {validator: validateMoney, trigger: 'blur',required: true}
                    // ],
                    invoice_time:[
                        { required: true, message: '实际开票日期不能为空', trigger: 'blur' }
                    ]
                },
                loadding: false
            };
        },
        methods: {
           getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_invoice_type','fplx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.invoiceTypeStatus = res.data.buy_invoice_type;
                        this.fplxStatus = res.data.fplx;
                    }
                });
            },
            changeDate(time){
                this.info.invoice_time = time;
            },
            vaild(num,invoicable_num){
                if(invoicable_num < num){
                    this.$Message.error("本次退票数量不能大于可退票数量");
                }
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getData () {
                apiGetgenerateInvoice(this, {
                   params: this.htd_id
               }).then(res => {
                   if (res && res.status == 1){
                    if(res.data.from_order_no == 1){
                        this.is_show = true;
                    }else{
                        this.is_show = false;
                    }
                    this.info.buy_tax_rate = res.data.buy_tax_rate;
                    this.info.invoice_type = res.data.invoice_type;
                    this.info.order_invoice_type = res.data.order_invoice_type;
                    res.data.product_detail.forEach(item => {
                        item.num = parseInt(0);
                    });
                    this.orderData.data = res.data.product_detail;
                    
                    this.sum();
                   } else {
                       this.$Message.error(res.message);
                   }
               });
            },
            sum(){
                this.goodsAll = 0;
                this.goodsAllMoney = 0.0000;
                this.goodsAllWS = 0.0000;
                this.goodsAlltax = 0.0000;
                this.orderData.data.forEach(item => {
                        this.goodsAll = parseInt(this.goodsAll) + parseInt(item.num);
                        this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(item.buy_price, item.num), 4);
                        this.goodsAllWS = this.add(this.goodsAllWS, this.multiply(item.buy_cost_price, item.num), 4);
                        this.goodsAlltax = this.subtract(this.add(this.goodsAlltax, this.multiply(item.buy_price, item.num)), this.multiply(item.buy_cost_price, item.num), 4);
                });
            },
            save(){
                this.$refs.info.validate((valid) => {
                // let invoice_detail = [];
                    let tmp =[];
                        for(let i in this.orderData.data){
                            tmp.push({
                                order_detail_id:this.orderData.data[i].id, 
                                return_id:this.orderData.data[i].return_id,
                                return_num:this.orderData.data[i].return_num,
                                num: this.orderData.data[i].num
                            });
                        }
                        let params_info = JSON.parse(this.htd_id);
                        this.loadding = true;
                       apiaddTP(this, {
                            params: JSON.stringify(this.notempty({
                                from_order_no: params_info.from_order_no,
                                from_order: params_info.from_order,
                                order_invoice_type: this.info.order_invoice_type,
                                buy_tax_rate: this.info.buy_tax_rate,
                                invoice_type: this.info.invoice_type,
                                invoice_no: this.info.invoice_no,
                                invoice_time: this.info.invoice_time,
                                note: this.info.note,
                                invoice_detail: tmp
                                
                            }))
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
                                this.$Message.success(res.message);
                                this.loadding = false;
                                closeCurrentPage(this); 
                                util.openNewPage(this, 'purchase_manage_SP_detail',{
                                    param: res.data.order_invoice_no,
                                    type: res.data.order_invoice_type,
                                    fromAdd: '1'
                                });
                                this.$router.push({  
                                    name: 'purchase_manage_SP_detail',
                                    query: {
                                        param: res.data.order_invoice_no,
                                        type: res.data.order_invoice_type,
                                        fromAdd: '1'
                                    }
                                });
                                } else {
                                    this.loadding = false;
                                    this.$Message.error(res.message);
                                }
                            });
                });
            },
            deleted (index) {
                this.orderData.data.splice(index,1);
                this.sum();
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
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
