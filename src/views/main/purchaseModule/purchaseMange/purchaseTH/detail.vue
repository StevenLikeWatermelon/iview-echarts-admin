<style>
    .special-return-detail .ivu-form-item {
        margin-bottom: 0;
    }
    .th-detail .ivu-input {
        height: 30px;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10 th-detail">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        基本信息
                    </p>
                    <div slot="extra" v-if="canEdit">
                        <a @click="editBasic()" v-show="!isBasicEdit">
                            <Icon type="edit"></Icon>
                            编辑
                        </a>
                        <a @click="saveBasic()" v-show="isBasicEdit">
                            <Icon type="checkmark"></Icon>
                            保存
                        </a>
                        <a @click.prevent="cancelBasic" v-show="isBasicEdit" style="margin-left: 15px;">
                            <Icon type="close"></Icon>
                            取消
                        </a>
                    </div>                      
                    <Form :label-width="120" ref="returnDetail" :model="returnDetail" :rules="ruleValidate">
                        <Row>
                            <Col span="6">
	                            <FormItem label="采购退货单编号：">
	                            	<span>{{returnDetail.order_return_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="单据状态：">
	                                <span>{{returnStatusObj[returnDetail.return_status]}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="采购合同单编号：">
	                                <span>{{returnDetail.buy_order_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商：">
	                                <span>{{returnDetail.gysmc}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商联系人：">
	                                <span>{{returnDetail.lxr}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商联系方式：">
	                                <span>{{returnDetail.sjhm}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="退货仓库：">
	                                <span>{{returnDetail.ckmc}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6" v-show="!isBasicEdit">
                                <FormItem label="退货联系人：">
                                    <span >{{returnDetail.receive_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isBasicEdit" >
	                            <FormItem label="退货联系人：" prop="receive_name">
                                    <Input v-model="returnDetail.receive_name" placeholder="请输入退货联系人"></Input>
	                            </FormItem>
                            </Col>
                            <Col span="6" v-show="!isBasicEdit">
                                <FormItem label="退货联系方式：">
                                    <span >{{returnDetail.receive_phone}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isBasicEdit">
	                            <FormItem label="退货联系方式：" prop="receive_phone">
                                    <Input v-model="returnDetail.receive_phone" placeholder="请输入退货联系方式"></Input>
	                            </FormItem>
                            </Col>
                            <Col span="6"  v-show="!isBasicEdit">
                                <FormItem label="退货地址：">
                                    <span>{{returnDetail.province_name}}</span>
                                    <span>{{returnDetail.city_name}}</span>
                                    <span>{{returnDetail.district_name}}</span>
                                    <span>{{returnDetail.receive_address}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12" v-show="isBasicEdit">
                                <div style="width:50%;float:left">
                                    <FormItem label="退货地址：" prop="selectdCities">
                                        <Cascader :data="allAddressArr" v-model="returnDetail.selectdCities" filterable @on-change="getCurrentAddress"></Cascader>
                                    </FormItem>
                                </div>
                                <div style="width:50%;float:left;margin-left: -60px;">
    	                            <FormItem prop="receive_address">
                                        <Input v-model="returnDetail.receive_address" placeholder="请输入退货地址"></Input>
    	                            </FormItem>
                                </div>
                            </Col>
                            <Col span="6" v-show="!isBasicEdit">
                                <FormItem label="退货原因：">
                                    <span >{{returnDetail.note}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isBasicEdit" >
	                            <FormItem label="退货原因：" prop="note">
                                    <Input v-model="returnDetail.note" placeholder="请输入退货原因"></Input>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建人：">
	                                <span>{{returnDetail.create_user_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建时间：">
	                                <span>{{returnDetail.create_time}}</span>
	                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-list"></Icon>
                        退货商品明细
                    </p>
                    <div slot="extra" v-if="canEdit">
                    	<a @click="editAllList()" v-show="!isEdit">
				            <Icon type="edit"></Icon>
				            编辑
				        </a>
				        <a @click="saveEdit()" v-show="isEdit">
				            <Icon type="checkmark"></Icon>
				            保存
				        </a>
				        <a @click.prevent="cancelEdit" v-show="isEdit" style="margin-left: 15px;">
				            <Icon type="close"></Icon>
				            取消
				        </a>
                    </div>             
                    <Row class="special-return-detail">
                    	<col span="24">
                    		<Form :label-width="120">
		                        <Row>
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
                                    <Col span="6" offset="6" v-show="isEdit">
                                        <a @click="addNew()" style="float:right">
                                            <Icon type="plus"></Icon>
                                            添加商品
                                        </a>
                                    </Col>
		                        </Row>
		                    </Form>
                    	</col>
                    </Row>
                    <Row  v-show="!isEdit" >
                    	<col span="24">
		                    <el-table :data="buyProductList" border stripe style="text-align: center;" @sort-change="manualSort">
		                        <el-table-column show-overflow-tooltip prop="hh" label="行号"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" sortable="custom"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号"  sortable="custom" min-width="150"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="100" sortable="custom"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="ckmc" label="所属仓库" min-width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="area_name" label="所属库区"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.return_num}}</span>
                                    </template>
                                </el-table-column>
		                        <el-table-column show-overflow-tooltip prop="return_price" label="退货金额" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单编号" min-width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                                    </template>
                                </el-table-column>
		                    </el-table>
                    	</col>
                    </Row>
                    <Row  v-show="isEdit">
                        <col span="24">
                            <el-table :data="buyProductList" border stripe style="text-align: center;" @sort-change="manualSort">
                                <el-table-column show-overflow-tooltip prop="hh" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号"  sortable="custom"  min-width="150"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="100" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="ckmc" label="所属仓库" min-width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="area_name" label="所属库区"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="change_num" label="可退货数量"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.return_num" placeholder="请输入退货数量" @on-change="changeAmount(scope, scope.$index)"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_price" label="退货金额" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单编号" min-width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.$index)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </col>
                    </Row>                    
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10" v-show="workFlowArr.length > 0">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        流程跟踪
                    </p>
                    <Steps :current="currentFlow">
                        <Step v-for="item in workFlowArr" :title="item.action" ></Step>
                    </Steps>
                    <Row>
                        <col span="24">
                            <div v-for="item in workFlowArr" :style="{width: workFlowWidth + '%'}" class="purchase-flow-div">
                                <p>{{ item.user_name }}</p>
                                <p>{{ item.time }}</p>
                                <p>{{ item.note }}</p>            
                            </div>
                        </col>
                    </Row>
                </Card>
            </col>
        </Row>  
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList('purchase_manage_TH_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="warning" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="deleteReturn()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-if="canBack" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="updateTH('2')">回退</Button>
                <Button v-if="canReturnMoney" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="goToReturnMoney()">申请退款</Button>
                <Button v-if="canReturnInvoice" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="toTPD()">申请退票</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete"
            @on-cancel="cancelDelete">
            <p>确认删除该采购退货单?</p>
        </Modal>  
        <Modal v-model="showAbandon" title="确认废弃">
            <p>确认废弃该采购退货单?</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbandon">确定</Button>
            </div>
        </Modal>         
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="confirmApprove">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
                            <Row>
                                <Col span="24">
                                    <FormItem label="审批结果：">
                                        <RadioGroup v-model="approveDetail.isPass">
                                            <Radio label="同意"></Radio>
                                            <Radio label="驳回"></Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="审批意见：">
                                         <Input v-model="approveDetail.note" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
        </Modal> 
        <div v-if="showAdd">
            <Modal v-model="showAdd" class-name="make-return" title="添加商品" width="90">
                <th-add :orderNum="orderNum" :storeNum="storeNum" isTmp="yesDetail" @getAdd="addNewReturnData"></th-add>
            </Modal>     
        </div>        
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import thAdd from './addNewReturn.vue';
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater,sortBy } from '@/config/mUtils';
    import { purchaseManageReturnDetail, apiAllStatus, purchaseManageReturnDetailEdit, purchaseManageReturnDetailBasicEdit, apiMapDetail, purchaseManageReturnDelete,apiGetgenerateInvoice, purchaseManageApproveAction, purchaseManageTHUpdate, purchaseManageTHModelName, purchaseManageWorkFlow, apiGetPurchaseReturnPayReadyByReturn } from '@/config/getData';
    export default {
        components: {
            thAdd
        },  
        data () {
            return {
                loading: false,
                fromAdd: this.$route.query.fromAdd,
                orderNum: '',
                storeNum: '',
                showAdd: false,
            	isEdit: false,
                isBasicEdit: false,
                canEdit: true,
                canDelete: false,
                canAbandon: false,
                canBack: false,
                canPush: false,
                canApprove: false,
                showDelete: false,
                showAbandon: false,
                returnDetail: {
                    province_no: '',
                    city_no: '',
                    district_no: '',
                    province_name: '',
                    city_name: '',
                    district_name: '',
                    order_return_no:  this.$route.query.param,
                    receive_name: '',
                    receive_phone: '',
                    receive_address: '',
                    selectdCities: [],
                    note: ''
                },
                copyReturnDetail: {},
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                allAddressArr: [],
                returnStatusObj: {},
                buyProductList: [],
                EditedProductList: [],
                copyProductList: [],
                typeObj: {
                    order_return_no: '',
                    type: ''
                },
                ruleValidate: {
                    receive_name: [
                        { required: true, message: '退货联系人不能为空', trigger: 'blur' }
                    ],
                    receive_phone: [
                        { required: true, message: '退货联系方式不能为空', trigger: 'blur' }
                    ],
                    receive_address: [
                        { required: true, message: '退货联系地址不能为空', trigger: 'blur' }
                    ],
                    selectdCities: [
                        { required: true, message: '退货地址区域不能为空', trigger: 'blur', type: 'array' }
                    ]
                },
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                canReturnMoney: false,       
                canReturnInvoice: false       
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
             //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.buyProductList.sort(sortBy(column.prop, isDec));
            },
        	backTo () {
        		history.go(-1);
        	},
            addNew() {
                this.showAdd = true;
            },            
            redirectOtherPage (pageName, query) {
                util.redirectPage(this, pageName, query);
            },
            editBasic() {
                this.copyReturnDetail = JSON.parse(JSON.stringify(this.returnDetail));
                this.isBasicEdit = true;
            },
            saveBasic() {
                this.$refs['returnDetail'].validate((valid) => {
                    if (valid) {
                        purchaseManageReturnDetailBasicEdit(this, {
                            params: JSON.stringify(this.returnDetail)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功!');
                                this.isBasicEdit = false;
                                this.getDetail(); 
                                this.getWorkFlow();                           
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                });
            },
            cancelBasic() {
                this.returnDetail = JSON.parse(JSON.stringify(this.copyReturnDetail));
                this.isBasicEdit = false;
            },
            editAllList () {
                this.copyProductList = JSON.parse(JSON.stringify(this.buyProductList));
                this.buyProductList.forEach(item => {
                    item.isEdit = true;
                });
                this.isEdit = true;
            },
            changeAmount(scope, index) {
                let reg = /^[1-9]\d*$/;
                let isNum = reg.test(+scope.row.return_num);
                if (!isNum || +scope.row.return_num > +scope.row.change_num) {
                    this.$Message.error('格式有误或数目大于可退!');
                }
                // let tmpArr = JSON.parse(JSON.stringify(this.buyProductList));
                scope.row.return_price = this.multiply(scope.row.return_num, scope.row.buy_price, 4);
                this.buyProductList.splice(index, 1, scope.row);
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.buyProductList.forEach(item => {
                    this.returnCount.total_num +=  +item.return_num;
                    this.returnCount.total_amount = this.add(this.returnCount.total_amount, item.return_price);
                });
                this.returnCount.total_num =this.returnCount.total_num.toFixed(0);
                this.returnCount.total_amount = this.returnCount.total_amount.toFixed(4);
            },
            deleteItem(index) {
                this.buyProductList.splice(index, 1);
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.buyProductList.forEach(item => {
                    this.returnCount.total_num +=  +item.return_num;
                    this.returnCount.total_amount = this.add(this.returnCount.total_amount, item.return_price);
                });
                this.returnCount.total_num =this.returnCount.total_num.toFixed(0);
                this.returnCount.total_amount = this.returnCount.total_amount.toFixed(4);
            },            
            saveEdit() {
                let reg = /^[1-9]\d*$/;
                let invalidate = false;
                let numToolarge = false;
                let currentIndex = 0;
                for (let i = 0; i < this.buyProductList.length; i++) {
                    let isNum = reg.test(this.buyProductList[i].return_num);
                    if (!isNum) {
                        invalidate = true;
                        currentIndex = i + 1;
                        break;
                    }
                    if (+this.buyProductList[i].return_num > +this.buyProductList[i].change_num) {
                        numToolarge = true;
                        currentIndex = i + 1;
                        break;
                    }
                }
                if (invalidate) {
                    this.$Message.error('第' + currentIndex + '行退货数量格式有误!');
                    return;
                }
                if (numToolarge) {
                    this.$Message.error('第' + currentIndex + '行退货数量不能大于可退数量!');
                    return;
                }
                this.EditedProductList = [];
                this.buyProductList.forEach(item => {
                    this.EditedProductList.push({
                        gh_id: item.gh_id,
                        number: item.return_num
                    });
                });
                purchaseManageReturnDetailEdit(this, {
                    order_return_no: this.$route.query.param,
                    params: JSON.stringify({
                        list: this.EditedProductList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getDetail();
                         this.getWorkFlow(); 
                        this.isEdit = false;
                   } else {
                        this.$Message.error(res.message);
                   }
                });
            },
            cancelEdit() {
                this.buyProductList = JSON.parse(JSON.stringify(this.copyProductList));
                this.buyProductList.forEach(item => {
                    item.isEdit = false;
                });
                this.isEdit = false;
            },
            confirmApprove() {
                purchaseManageApproveAction(this, {
                    order_no: this.$route.query.param,
                    is_pass: this.approveDetail.isPass === '同意' ? 1 : 0,
                    note: this.approveDetail.note,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('审批完成!');
                        this.getWorkFlow();
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },    
            doApprove() {
                this.showApprove = true;
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['return_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatusObj = res.data.return_status;
                        this.getDetail();
                    }
                });
            },
            getWorkFlow() {
                purchaseManageWorkFlow(this, {
                    order_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.workFlowArr = res.data.tracks;
                        this.currentFlow = res.data.current_key;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                    }
                });
            },             
            getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },
            getCurrentAddress(value, selected) {
                this.returnDetail.province_no = value[0] || '';
                this.returnDetail.city_no = value[1] || '';
                this.returnDetail.district_no = value[2] || '';
            },           
            getDetail () {
                purchaseManageReturnDetail(this, {
                    params: JSON.stringify({order_return_no: this.$route.query.param})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderNum = res.data.return_basic.buy_order_no;
                        this.storeNum = res.data.return_basic.arrive_store;

                        this.returnDetail = res.data.return_basic;
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.return_basic.return_status == '0') && (Cookies.get('user_no') === res.data.return_basic.create_user_no);
                        // 单据状态“待退款”，且当前登录人员为单据的创建人时展示申请退款；
                        this.canReturnMoney = (res.data.return_basic.return_status == '2') && (Cookies.get('user_no') === res.data.return_basic.create_user_no);
                        // 单据状态“待退款/已完成”，且当前登录人员为单据的创建人时展示申请退票；
                        this.canReturnInvoice = (res.data.return_basic.return_status == '4' || res.data.return_basic.return_status == '2') && (Cookies.get('user_no') === res.data.return_basic.create_user_no);
                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示编辑
                                this.canEdit = ((res.data.return_basic.return_status == '0') && (Cookies.get('user_no') === res.data.return_basic.create_user_no)) || ((res.data.return_basic.return_status == '3') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName).then(isIn => {
                                        this.canPush = ((res.data.return_basic.return_status == '0') && (Cookies.get('user_no') === res.data.return_basic.create_user_no) && isIn) || ((res.data.return_basic.return_status == '3') && isTaskCreater && isCurrent);
                                        
                                    });
                                });
                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.return_basic.return_status == '1') || (res.data.return_basic.return_status == '3')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.return_basic.return_status == '3') && isTaskCreater && isCurrent;
                            });
                            
                        });

                        

                        // 单据状态“已审批”，且且当前登录人员为单据最终审批人时展示回退；
                        isFinalApprover(this, this.$route.query.param).then(isFinal => {
                            this.canBack = (res.data.return_basic.return_status == '2') && isFinal;
                        });


                        res.data.return_product.forEach(item => {
                            item.isEdit = false;
                        });
                        this.buyProductList = res.data.return_product;
                        this.returnCount.total_num = res.data.return_total.total_num;
                        this.returnCount.total_amount = res.data.return_total.total_amount;
                        this.returnDetail.selectdCities = [this.returnDetail.province_no, this.returnDetail.city_no, this.returnDetail.district_no] = [res.data.return_basic.province_no, res.data.return_basic.city_no, res.data.return_basic.district_no];
                    }
                });
            },
            deleteReturn() {
                this.showDelete = true;
            },
            updateTH(type) {
                if (type == '0' && (this.isBasicEdit || this.isEdit)) {
                    this.$Message.error('请先保存再提交');
                    return;
                }
                this.typeObj = {
                    order_return_no: this.$route.query.param,
                    type: ''
                };
                let typeName = '';
                switch(type) {
                    case '0':
                        this.typeObj.type = 'submit';
                        typeName = '提交';
                        break;
                    case '1':
                        this.typeObj.type = 'invalid';
                        typeName = '废弃';
                        break; 
                    case '2':
                        this.typeObj.type = 'backspace';
                        typeName = '回退';
                        break;           
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    purchaseManageTHUpdate(this, {
                        params: JSON.stringify(this.typeObj)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success( typeName + '成功!');
                            this.getDetail();
                             this.getWorkFlow(); 
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                }
            },    
            cancelAbandon() {
                this.showAbandon = false;
            },
            confirmAbandon() {
                this.loading = true;
                purchaseManageTHUpdate(this, {
                    params: JSON.stringify(this.typeObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('废弃成功!');
                        this.showAbandon = false;
                        this.getDetail();
                        this.getWorkFlow(); 
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },        
            confirmDelete() {
                purchaseManageReturnDelete(this, {
                    params: JSON.stringify({
                        order_return_no:  this.$route.query.param
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.showDelete = false;
                        util.openNewPage(this, 'purchase_manage_TH_index');
                        this.$router.push({
                            name: 'purchase_manage_TH_index'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            cancelDelete() {
                this.showDelete = false;
            },
            getModalName() {
                return new Promise(success => {
                    purchaseManageTHModelName(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {    
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },
            goToHTD (id) {
                util.openNewPage(this, 'purchase_manage_HT_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_HT_detail',
                    query: {
                        param: id
                    }
                });
            },
            goToReturnMoney () {
                apiGetPurchaseReturnPayReadyByReturn(this, {
                    order_return_no: this.$route.query.param
                }).then(res => {
                    if (res && res.status === 1) {
                        util.redirectPage(this, 'purchase_manage_HT_toTKD', {
                            param: this.$route.query.param,
                            type: 'return'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            toTPD(){
              let tmp = [];
              for(let i in this.buyProductList){
                tmp.push(this.buyProductList[i].id);
              }
                let list = {};
                list = JSON.stringify({
                    order_invoice_type: 1,
                    from_order_no: 1,
                    from_order: this.returnDetail.order_return_no,
                    return_detail_id: tmp
                });
                apiGetgenerateInvoice(this, {
                        params: list
                    }).then(res => {
                        if (res && res.status == 1){
                            this.handleClick({param: list}, 'purchase_manage_HT_toTPD');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            }, 
            addNewReturnData(selectedItems) {
                let selectedId;
                selectedItems.forEach(item => {
                    // 数据初始化
                    item.isEdit = true;
                    item.hh = this.buyProductList.length + 1;
                    item.return_num = 0;
                    item.return_price = 0;
                    item.gh_id = item.id;
                    item.brand_name = item.cpppmc;
                    item.product_name = item.cpmc;
                    item.product_model = item.cpxh;
                    item.product_order_no = item.cpdhh;
                    item.product_unit = item.jldw;
                    item.product_order_no = item.cpdhh;
                    item.product_order_no = item.cpdhh;


                    selectedId = item.gh_id;
                    let isRepeat = false;
                    this.buyProductList.forEach(item => {
                        if (item.gh_id == selectedId) {
                            isRepeat = true;
                        }
                    });
                    if (!isRepeat) {
                        this.buyProductList.push(item);
                    }
                });
                this.showAdd = false;
            }                      
        },
        created () {
            this.getWorkFlow();
            this.getStatus();
            this.getMapDetail();
        }
    };
</script>