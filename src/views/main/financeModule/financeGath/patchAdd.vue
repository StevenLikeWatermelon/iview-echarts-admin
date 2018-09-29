<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    收款信息
                </p>
                <Form :label-width="120" :model="form" ref="form" :rules="formRules">
                    <Row>
                        <Col span="8">
                        <FormItem label="收款方式：" prop="ways">
                            <Select v-model="form.ways"  placeholder="请选择" filterable @on-change="waysChoosed">
                                <Option v-for="val in gathWaysArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款银行：" prop="bank">
                            <Select v-model="form.bank"  placeholder="请选择" filterable :disabled="canChoose" @on-change="bankChoosed">
                                <Option v-for="val in bankArr" :value="val.receipt_bank" :key="val.receipt_bank">{{ val.receipt_bank }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="收款账号：">
                            {{ form.account }}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="实际收款日期:" prop="receipt_time">
                                <Date-picker type="date" format="yyyy-MM-dd" v-model="form.receipt_time" placeholder="选择日期" style="width: 200px" @on-change="changeDate"></Date-picker>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-show="is_out">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    确定匹配
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>客户数量： <em style="color:#cf0012;font-style: normal;">{{ total_num }}</em></span>
                        <span class="margin-left-20">收款金额： <em style="color:#cf0012;font-style: normal;">{{ total_amount }}</em></span>
                    </div>
                    <div v-show="is_exist">
                        <el-table :data="actTable.data" border stripe style="text-align: center;width:75%"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" min-width="200" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="receipt_amount" label="收款金额" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="trans_no" label="交易凭证号" fixed ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="note" label="备注" fixed ></el-table-column>
                            <el-table-column show-overflow-tooltip  prop="receipt_no" label="财务收款单编号" min-width="120">
		                        <template slot-scope="scope">
		                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.receipt_no}, 'gath_order_detail')">{{scope.row.receipt_no}}</span>
		                        </template>
                    		</el-table-column>
                            <el-table-column show-overflow-tooltip prop="explain" label="说明"></el-table-column>
                        </el-table>
                    </div>
                    <div v-show="!is_exist">
                        <el-table :data="actTable.data" border stripe style="text-align: center;width:75%"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" min-width="200" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="receipt_amount" label="收款金额" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="trans_no" label="交易凭证号" fixed ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="note" label="备注" fixed ></el-table-column>
                        </el-table>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>

        <Row class="margin-top-10" v-show="is_inout">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    非确定匹配
                </p>
                <div>
                    <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort">
                     	<el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                        <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" min-width="200" fixed></el-table-column>
                        <el-table-column label="客户编号" fixed>
	                        <template slot-scope="scope">
	                            <Select v-model="scope.row.customer_no" placeholder="请选择" @on-change="khChange(scope.row.customer_name, scope.row.customer_no)" transfer>
	                                <Option v-for="item in scope.row.customerList" :key="item.customer_no" :value="item.customer_no">{{ item.customer_name }}</Option>
	                            </Select>    
	                        </template>
	                    </el-table-column>
                        <el-table-column show-overflow-tooltip prop="receipt_amount" label="收款金额" fixed></el-table-column>
                        <el-table-column show-overflow-tooltip prop="trans_no" label="交易凭证号" fixed ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="note" label="备注" fixed ></el-table-column>
	                    <el-table-column show-overflow-tooltip label="操作" fixed>
                            <template slot-scope="scope">
                            	<span @click="add(scope.$index)" style="color: rgb(45, 140, 240);cursor: pointer;">添加</span>
                                <span @click="del(scope.$index)" style="color: rgb(45, 140, 240);cursor: pointer;">删除</span>
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
	            	<div style="margin: 0 auto;width:280px;">
		            	<Button type="primary" @click="backTo()">返回</Button>
		                <Button v-if="is_button" type="primary" :loading="loading" @click="save">保存</Button>
		                <Button v-if="is_button" type="primary" @click="modelTmpExport()">下载模板</Button>
		                <Upload v-if="is_button" :action="importApi" name="file" :format="['csv']" :on-success="handleSuccess" :show-upload-list="false">
		                    <Button type="primary" icon="ios-cloud-upload-outline" >导入</Button>
		                </Upload>
	            	</div>
	            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiExportFinanceModel,apiImporFinanceModel,apiPatchFinanceReceiptAdd, apiGetFinanceReceiptBank, apiGetFinanceReceiptType } from '@/config/getData';
    import { notempty, sortBydd,setToken } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';


    export default {
        data () {
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到2位！'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                is_out: false,
                is_inout: false,
                is_exist: false,
                is_button: true,
                form: {
                    ways: '',
                    bank: '',
                    account: '',
                    receipt_time:''
                },
                gath_no: this.$route.query.param,
                customerList: [],
                gathWays: [],
                gathWaysArr: [],
                formRules: {
                    khmc: [
                        { required: true, message: '请选择客户名称', trigger: 'on-change' }
                    ],
                    ways: [
                        { required: true, message: '请选择收款方式', trigger: 'on-change' }
                    ],
                    bank: []
                },
                canChoose: true,
                bankArr: [],
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                total_num: '0',
                total_amount: '0.0000',
                actTable: {
                    data: []
                },
                orderData: {
                    data: []
                },
                multipleSelection: [],
                khChoosed: [],
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            modelTmpExport() {
                apiExportFinanceModel(this, {});
            },
            changeDate(time){
                this.form.receipt_time = time;
            },
            getStatus () {
                apiGetFinanceReceiptType(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.gathWaysArr = [];
                        for (let key in res.data) {
                            if (res.data.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data[key]
                                };
                                this.gathWaysArr.push(tmpObj);
                            }
                        }
                    }
                });

            },
            handleSuccess(arr){
                let postData = JSON.parse(JSON.stringify(arr));
                apiImporFinanceModel(this, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                    	this.is_out = true;
                    	this.is_inout = true;
                        this.actTable.data = res.data.comfirm_data.data;
                        this.orderData.data = res.data.inncomfirm_data;
                        this.total_num = res.data.comfirm_data.total_num;
                        this.total_amount = res.data.comfirm_data.total_amount;
                        this.getTotal();
                    } else{
                    	this.$Message.error(res.message);
                    }
                });
            },
            khChange (customer_name, customer_no) {
            	console.log(customer_no);
                for (let i in this.orderData.data) {
                	if(this.orderData.data[i].customer_name == customer_name){
                		this.orderData.data[i].customer_no = customer_no;
                	}
                }
            },
            add(index){
            	if(this.orderData.data[index].customer_no == undefined || this.orderData.data[index].customer_no == ''){
					this.$Message.error('请选择有效客户编号信息');
				}else{
					this.orderData.data[index].customer_name = this.orderData.data[index].customer_name+'('+this.orderData.data[index].customer_no+')';
	            	this.actTable.data.push(this.orderData.data[index]);
	            	this.orderData.data.splice(index,1);
				}
				this.getTotal();
            	
            },
            del(index) {
                this.orderData.data.splice(index,1);
            },
            getTotal(){
            	this.total_num = 0;
            	this.total_amount = 0.0000;
            	this.total_num = this.actTable.data.length;
            	this.actTable.data.forEach(item => {
            		this.total_amount += +item.receipt_amount;
            	});
            },
            waysChoosed (val) {
                if (val == 1 || val == 4 || val == 5) {
                    this.canChoose = false;
                    this.form.bank = '';
                    this.form.account = '';
                    apiGetFinanceReceiptBank(this, {
                        receipt_type: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.bankArr = res.data;
                        }
                    });
                    this.formRules.bank.push({required: true, message: '请选择收款银行', trigger: 'on-change'});
                } else {
                    this.canChoose = true;
                    apiGetFinanceReceiptBank(this, {
                        receipt_type: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            if (res.data.length == 0) {
                                this.form.bank = '';
                                this.form.account = '';
                            } else {
                                this.form.bank = '';
                                this.form.account = res.data[0].receipt_account;
                            }
                        }
                    });
                    this.formRules.bank = [];
                }
            },
            bankChoosed (val) {
                for (let i in this.bankArr) {
                    if (val === this.bankArr[i].receipt_bank) {
                        this.form.account = this.bankArr[i].receipt_account;
                    }
                }
            },
            save () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        apiPatchFinanceReceiptAdd(this, {
                            params: JSON.stringify({
                                receipt_type: this.form.ways,
                                receipt_bank: this.form.bank,
                                receipt_account: this.form.account,
                                receipt_time: this.form.receipt_time,
                                detail:JSON.parse(JSON.stringify(this.actTable.data)),
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                            	this.is_inout = false;
                            	this.is_exist = true;
                            	this.is_button = false;
                                this.actTable.data = res.data;
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                });
            },
            custChoose (val) {
                this.form.khbh = val;
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(4);
            }
        }
    };
</script>
