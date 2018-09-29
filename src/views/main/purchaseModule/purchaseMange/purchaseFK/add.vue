<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    付款信息
                </p>
                <Form ref="formDetail" :model="formDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                            <FormItem label="供应商：" prop="supplier_no">
                                <Select v-model="formDetail.supplier_no"  placeholder="请选择供应商" filterable @on-change="getCurrentApplyLxr" v-if="showSelectApply">
                                    <Option v-for="status in allApplyArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="供应商联系人：">
                                <span>{{formDetail.apply_info_lxr}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="付款方式：" prop="pay_way_no">
                                <Select v-model="formDetail.pay_way_no"  placeholder="请选择付款方式" style="width: 200px;" @on-change="getcurrentPayType">
                                    <Option v-for="status in fkfsStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="24" v-show="showBankInfo">
                            <FormItem label="付款银行：">
                                <span>{{formDetail.bank_name}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24" v-show="showBankInfo">
                            <FormItem label="付款账户：">
                                <span>{{formDetail.bank_account}}</span>
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
                    采购合同单列表
                </p>
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <span style="padding-right: 20px;">待付款总额：<span style="color: #cf0012;">{{allAmountToPay}}</span></span>
                        <span style="padding-right: 20px;">本次付款总额：<span style="color: #cf0012;">{{chooseAmountToPay}}</span></span>
                        <span class="span-for-click" style="float:right" @click="orderSearch">添加采购合同单</span>
                    </Col>
                </Row>
                <el-table :data="addDataList" border stripe style="text-align: center"  @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip label="行号" type="index"></el-table-column>
                    <el-table-column show-overflow-tooltip label="采购合同单编号" prop="buy_order_no" sortable="custom" min-width="150">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="纸质合同编号" prop="order_attach_no"  sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="total_amount" label="应付款金额" show-overflow-tooltip sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="to_pay_amount" label="待付款金额" show-overflow-tooltip  min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="本次付款金额" prop="real_amount"  sortable="custom"  min-width="120">
                        <template slot-scope="scope">
                             <Input v-model="scope.row.real_amount" placeholder="请输入本次付款金额" @on-change="calculateTotal"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="备注" prop="note" min-width="150">
                        <template slot-scope="scope">
                             <Input v-model="scope.row.note" placeholder="请输入备注"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" prop="order_no" min-width="90">
                        <template slot-scope="scope">
                             <span class="span-for-click" @click="deleteItem(scope.$index)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>
        <add-purchaseorder :showAddModal.sync="showAddModal" :currentApplyName="formDetail.supplier_name" :currentApplyId="currentApplyId" @addNewData="addNewHTData"></add-purchaseorder>
        <Modal v-model='showChange' :mask-closable=false :width="500" title="确认更改">
            <p>修改供应商后，已经添加的采购合同列表将清空，是否确认修改？</p>
            <div slot="footer">
                <Button type="text" @click="cancelShowChange">取消</Button>
                <Button type="primary" @click="confirmChangeOrder">确定</Button>
            </div>
        </Modal>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" style="margin-left:20px;" @click="save()" :loading="loading">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { purchaseFKAddApi, apiGetPurchaseHtHomeList, apiAllStatus, apiGetPurchaseSupplierDetail  } from '@/config/getData';
    import { sortBy, closeCurrentPage } from '@/config/mUtils';
    import addPurchaseorder from './addPurchaseorder.vue';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_FK_add',
        data () {
            return {
                showChange: false,
                showSelectApply: true,
                allAmountToPay: 0.0000,
                chooseAmountToPay: 0.0000,
                showBankInfo: false,
                loading: false,
                showAddModal: false,
                currentApplyId: '',
                copySupplyId: '',
                formDetail: {
                    supplier_no: '',
                    supplier_name: '',
                    pay_way_no: '',
                    apply_info_lxr: '',
                    bank_name: '',
                    bank_account: '',
                },

                allApplyArr: [],
                fkfsStatusArr: [],

                addDataList: [],
                ruleValidate: {
                    supplier_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    pay_way_no: [
                        { required: true, message: '付款方式不能为空', trigger: 'blur' }
                    ],
                },
            };
        },
        components: {
            addPurchaseorder
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            orderSearch() {
                if (this.formDetail.supplier_no == '') {
                    this.$Message.error('请先选择供应商');
                    return;
                }
                this.currentApplyId = this.formDetail.supplier_no;
                this.showAddModal = true;
            },
            calculateTotal() {
                this.chooseAmountToPay = 0.0000;
                this.allAmountToPay = 0.0000;
                this.addDataList.forEach(item => {
                    this.chooseAmountToPay = this.add(this.chooseAmountToPay, item.real_amount, 4);
                    this.allAmountToPay = this.add(this.allAmountToPay, item.to_pay_amount, 4);
                });
            },
            addNewHTData(orderData) {
                orderData.forEach(item => {
                    let hasExisted = false;
                    for (let i = 0; i < this.addDataList.length; i++) {
                        if (item.id == this.addDataList[i].id) {
                            hasExisted = true;
                            break;
                        }
                    }
                    if (!hasExisted) {
                        this.addDataList.push(item);
                    }

                });
                this.calculateTotal();
                this.showAddModal = false;
            },
            cancelShowChange() {
                this.formDetail.supplier_no = this.copySupplyId;
                this.showSelectApply = true;
                this.showChange = false;
            },
            confirmChangeOrder() {
                this.addDataList = [];
                this.searchApplyInfo(this.formDetail.supplier_no);
                this.showSelectApply = true;
                this.calculateTotal();
                this.showChange = false;
            },
            getCurrentApplyLxr(value) {
                if (this.addDataList.length > 0) {
                    this.showChange = true;
                    this.showSelectApply = false;
                    return;
                }
                this.searchApplyInfo(value);
            },
            searchApplyInfo(value) {
                apiGetPurchaseSupplierDetail(this, {
                    gysbh: value
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.formDetail.apply_info_lxr = res.data.lxr;
                        this.formDetail.bank_name = res.data.khyh;
                        this.formDetail.supplier_name = res.data.gysmc;
                        this.formDetail.bank_account = res.data.yhzh;
                        this.copySupplyId = value;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getcurrentPayType(value) {
                this.$refs['formDetail'].validate();
                if (value == '002' || value == '003') {
                    this.showBankInfo = true;
                } else {
                    this.showBankInfo = false;
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fkfs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //付款方式
                        let tmpObjfkfs = {};
                        for (let key in res.data.fkfs) {
                            if (res.data.fkfs.hasOwnProperty(key)) {
                                tmpObjfkfs = {
                                    value: key,
                                    label: res.data.fkfs[key]
                                };
                                this.fkfsStatusArr.push(tmpObjfkfs);
                            }
                        }

                    }
                });
            },
            getAllApply() {
                apiGetPurchaseHtHomeList(this, {
                    params: JSON.stringify({})
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.suppliers.forEach(item => {
                            this.allApplyArr.push({
                                value: item.gysbh,
                                label: item.gysmc
                            });
                        });
                    }
                });
            },

            deleteItem(index) {
                this.addDataList.splice(index, 1);
                this.calculateTotal();
            },
            save() {
                if (this.addDataList.length == 0) {
                    this.$Message.error('采购合同单列表不能为空!');
                    return;
                }
                this.$refs['formDetail'].validate((valid) =>{
                    if (valid) {
                        for (let i = 0; i < this.addDataList.length; i++) {
                            if (this.addDataList[i].real_amount == '') {
                                this.$Message.error(`第${i + 1}行本次付款金额不能为空!`);
                                return;
                            }
                            if (isNaN(this.addDataList[i].real_amount)) {
                                this.$Message.error(`第${i + 1}行本次付款金额必须为数字!`);
                                return;
                            }
                            if (+this.addDataList[i].real_amount <= 0) {
                                this.$Message.error(`第${i + 1}行本次付款金额不能小于0!`);
                                return;
                            }
                            if (+this.addDataList[i].real_amount > +this.addDataList[i].to_pay_amount) {
                                this.$Message.error(`第${i + 1}行本次付款金额不能大于待付款金额!`);
                                return;
                            }
                        }
                        let tmpArr = [];
                        this.addDataList.forEach(item => {
                            tmpArr.push({
                                buy_order_no: item.buy_order_no,
                                real_amount: item.real_amount,
                                note: item.note,
                            });
                        });
                        this.loading = true;
                        purchaseFKAddApi(this, {
                            supplier_no: this.formDetail.supplier_no,
                            pay_way_no: this.formDetail.pay_way_no,
                            bank_name: this.formDetail.bank_name,
                            bank_account: this.formDetail.bank_account,
                            order_list: JSON.stringify(tmpArr)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success({
                                    content: res.message,
                                    duration: 0,
                                    closable: true
                                });
                                closeCurrentPage(this);
                                util.openNewPage(this, 'purchase_manage_FK_index');
                                this.$router.push({
                                    name: 'purchase_manage_FK_index'
                                });                          
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        })
                    }   
                })
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.addDataList.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getAllApply();
            this.getStatus();
        }
    };
</script>
