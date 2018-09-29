<style>
    .purchase-flow {
		width:100%;
        position: relative;
    }
    .purchase-flow-div {
        height: 100%;
        float: left;
        padding-left: 30px;
    }
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <!-- <Icon type="bookmark"></Icon> -->
                        基本信息
                    </p>
                    <div slot="extra" v-if="canEdit">
                    	<a @click="editBasic()" v-show="!isEdit">
				            <Icon type="edit"></Icon>
				            编辑
				        </a>
				        <a @click="saveBasic()" v-show="isEdit">
				            <Icon type="checkmark"></Icon>
				            保存
				        </a>
				        <a @click.prevent="cancelBasic()" v-show="isEdit" style="margin-left: 15px;">
				            <Icon type="close"></Icon>
				            取消
				        </a>
                    </div>
                    <Form :label-width="120" ref="invoiceBasicInfo" :model="invoiceBasicInfo" :rules="ruleValidate">
                        <Row>
                            <Col span="6">
	                            <FormItem label="采购收票单编号：">
	                            	<span>{{invoiceBasicInfo.order_invoice_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="单据状态：">
	                                <span>{{invoiceBasicInfo.invoice_statusDis}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="发票类别：">
	                                <span>{{invoiceBasicInfo.order_invoice_typeDis}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商：">
	                                <span>{{invoiceBasicInfo.gysmc}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商联系人：">
	                                <span>{{invoiceBasicInfo.lxr}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem v-show="!isEdit" label="实际开票日期:">
                                    <span>{{invoiceBasicInfo.invoice_time}}</span>
                                </FormItem>
                                <FormItem v-show="isEdit" label="实际开票日期:" prop="invoice_time">
                                    <Date-picker type="date" format="yyyy-MM-dd" :value="invoiceBasicInfo.invoice_time" placeholder="选择日期" style="width: 200px" @on-change="changeDate"></Date-picker>
                                </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem v-show="!isEdit" label="发票号码：">
	                                <span>{{invoiceBasicInfo.invoice_no}}</span>
	                            </FormItem>
                                <FormItem v-show="isEdit" label="发票号码：" prop="invoice_no">
                                    <Input v-model="invoiceBasicInfo.invoice_no"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6" v-if="!normalType">
	                            <FormItem label="来源类型：">
	                                <span>{{invoiceBasicInfo.order_invoice_typeFromDis}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6" v-if="!normalType">
	                            <FormItem label="来源单据编号：">
	                                <span>{{invoiceBasicInfo.from_order}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem v-show="!isEdit" label="备注：">
	                                <span>{{invoiceBasicInfo.note}}</span>
	                            </FormItem>
                                <FormItem v-show="isEdit" label="备注：">
                                    <Input v-model="invoiceBasicInfo.note"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建人：">
	                                <span>{{invoiceBasicInfo.create_user_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建时间：">
	                                <span>{{invoiceBasicInfo.create_time}}</span>
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
                        <!-- <Icon type="ios-list"></Icon> -->
                        收票商品明细
                    </p>
                    <div slot="extra" v-if="canEdit">
                        <a @click="addGoods()" v-show="isEditDetail" style="font-weight:normal;margin-left: 65px;">
                            <Icon type="add"></Icon>
                            添加商品
                        </a>
                        <a @click="editDetail()" v-show="!isEditDetail">
                            <Icon type="edit"></Icon>
                            编辑
                        </a>
                        <a @click.prevent="cancelDetail()" v-show="isEditDetail" style="margin-left: 15px;">
                            <Icon type="close"></Icon>
                            取消
                        </a>
                        <a @click="saveDetail()" v-show="isEditDetail"  style="margin-left: 15px;">
                            <Icon type="checkmark"></Icon>
                            保存
                        </a>
                    </div>                    
                    <Row>
                    	<col span="24">
                    		<Form :label-width="120">
		                        <Row>
		                            <Col span="6">
			                            <FormItem label="收票商品总数：">
			                            	<span>{{invoiceDetailInfo.total_num}}</span>
			                            </FormItem>
		                            </Col>
		                            <Col span="6">
			                            <FormItem label="收票商品总额：">
			                                <span>{{invoiceDetailInfo.total_invoice_amount}}</span>
			                            </FormItem>
		                            </Col>
		                            <Col span="6">
			                            <FormItem label="收票商品未税总额：">
			                                <span>{{invoiceDetailInfo.total_invoice_cost_amount}}</span>
			                            </FormItem>
		                            </Col>
		                            <Col span="6">
			                            <FormItem label="收票商品总税额：">
			                                <span>{{invoiceDetailInfo.total_cost_amount}}</span>
			                            </FormItem>
		                            </Col>
		                        </Row>
		                    </Form>

                    	</col>
                    </Row>
                    <Row>
                        <col span="24">
                            <el-table :row-class-name="tableRowClassName" :data="invoiceDetailInfo.data" border style="text-align: center;width:100%" v-show="isEditDetail" @sort-change="manualSort">
                                <el-table-column show-overflow-tooltip label="行号">
                                    <template slot-scope="scope">
                                        <span>{{scope.$index + 1}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称"  sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_cost_price" label="未税单价" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="wait_invoice_num" :label="'待' + returnOrGet +'票数量'" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="num" :label="'本次' + returnOrGet + '票数量'" >
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row.isEditDetail">{{scope.row.invoice_num}}</span>
                                        <Input v-model="scope.row.invoice_num" v-show="scope.row.isEditDetail" @on-change="changeRelatedNum(scope.row);"></Input>
                                    </template>    
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_amount" :label="returnOrGet + '票金额'" >
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_cost_amount" label="未税金额" >
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="cost_amount" label="税额" >
                                </el-table-column>
                                <el-table-column prop="buy_order_no" label="采购合同单号" width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTDetail(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="rel_order_no" label="来源单号">
                                    <template slot-scope="scope">
                                         <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.rel_order_no, scope.row.moudleName)">{{scope.row.rel_order_no}}</span>
                                    </template>       
                                </el-table-column>
                                <el-table-column label="操作" >
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleted(scope.$index)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-table :row-class-name="tableRowClassName" :data="invoiceDetailInfo.data" border style="text-align: center;width:100%" v-show="!isEditDetail" @sort-change="manualSort">
                                <el-table-column show-overflow-tooltip label="行号">
                                    <template slot-scope="scope">
                                        <span>{{scope.$index + 1}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_cost_price" label="未税单价" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="num" :label="'本次' + returnOrGet + '票数量'" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row.isEditDetail">{{scope.row.invoice_num}}</span>
                                        <Input v-model="scope.row.invoice_num" v-show="scope.row.isEditDetail" @on-change="changeRelatedNum(scope.row);"></Input>
                                    </template>    
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_amount" :label="returnOrGet + '票金额'" min-width="100">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_cost_amount" label="未税金额" >
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="cost_amount" label="税额" >
                                </el-table-column>
                                <el-table-column prop="buy_order_no" label="采购合同单号" width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTDetail(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="rel_order_no" label="来源单号">
                                    <template slot-scope="scope">
                                         <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.rel_order_no, scope.row.moudleName)">{{scope.row.rel_order_no}}</span>
                                    </template>       
                                </el-table-column>
                            </el-table>
                        </col>
                    </Row>
                        
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10" v-if="workFlowArr.length > 0">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        流程跟踪
                    </p>
				    <Steps :current="currentFlow">
                        <Step v-for="item in workFlowArr" :title="item.action"></Step>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList('purchase_manage_SP_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="warning" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="deleteSP()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateSP('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="updateSP('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-if="canBack" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="updateSP('2')">回退</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete"
            @on-cancel="cancelDelete">
            <p>确认删除该采购收票单?</p>
        </Modal>
        <Modal v-model="showAbandon" title="确认废弃"> 
            <p>确认废弃该采购收票单?</p>
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



         <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT">
            <h3 slot="header">添加商品</h3>
            <div>
                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="formSearch" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="formSearch.brand_no"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.buy_order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.ship_no" placeholder="请输入采购发货编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.instock_no" placeholder="请输入采购入库单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="formSearch.store_no"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in storeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.date' @on-change="date" style="width: 100%;"></DatePicker>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="24">
                    <Card>
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="confirmAdd()">添加</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            <span class="margin-left-20">待收票总金额： <em style="color:#cf0012;font-style: normal;">{{totalAmount}}</em></span>
                            <span class="margin-left-20">勾选待收票金额： <em style="color:#cf0012;font-style: normal;">{{priceToGet}}</em></span>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="goodsData" ref="multipleTable" border style="text-align: center" @sort-change="manualSortAdd" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" :selectable="canSelect" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_no" label="采购入库单号" min-width="120">
                            <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.instock_no, 'purchase_manage_RK_detail')" type="text" size="small">  
                                <span>{{scope.row.instock_no}}</span>
                            </span>
                            </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_user" label="采购员" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="supplier_name" label="供应商" width="200"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" width="200" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" width="120" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="150" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="store_name" label="入库仓库 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="area_name" label="入库库区 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位 " ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位 " width="80"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购单价" prop="buy_price" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="ship_num" label="发货数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="wait_invoiced_num" label="待收票数量" min-width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_amount" label="入库金额" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_user" label="创建人"  width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单号" prop="buy_order_no" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.buy_order_no, 'purchase_manage_HT_detail')" type="text" size="small">  
                                <span>{{scope.row.buy_order_no}}</span>
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购发货单号" prop="rel_order_no" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.rel_order_no, 'purchase_manage_FH_detail')" type="text" size="small">  
                                <span>{{scope.row.rel_order_no}}</span>
                                </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
        </Modal>


    </div>
</template>

<script>
    import pagination from '../../../../common/pagination.vue';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater,sortBy } from '@/config/mUtils';
    import { purchaseManageSPDetail, purchaseManageSPBasicEdit, purchaseManageSPBackEdit, purchaseManageSPNomalEdit, purchaseManageSPDelete, purchaseManageSPUpdate, purchaseManageSPModel, purchaseManageInCreator, apiAllStatus, purchaseManageWorkFlow, purchaseManageApproveAction,apiGetPurchaseSPGoods,allStoreInfos,operateAllBrandsList,apiGetAddInvoice} from '@/config/getData';
    export default {
        data () {
            return {
                totalAmount:0.0000,
                priceToGet: 0.0000,
                loading: false,
                fromAdd: this.$route.query.fromAdd,
                goodsModal:false,
            	isEdit: false,
                isEditDetail: false,
                showDelete: false,
                showAbandon: false,
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                storeArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
            	id: this.$route.query.param,
            	normalType: this.$route.query.type == '0' ? true : false,
                returnOrGet: this.$route.query.type == '0' ? '收' : '退',
                pullOrPush: this.$route.query.type == '0' ? '入库' : '退货',
                invoiceBasicInfo: {
                    order_invoice_no: '',
                    invoice_status: '',
                    order_invoice_type: '',
                    gysmc: '',
                    lxr: '',
                    invoice_no: '',
                    // invoice_amount: '',
                    from_order_no: '',
                    from_order: '',
                    note: '',
                    create_user_name: '',
                    create_time: ''

                },
                goodsData:[],
                copyBasicInfo: {},
                invoiceDetailInfo: {
                    data: [],
                    total_invoice_amount: '',
                    total_invoice_cost_amount: '',
                    total_num: '',
                    total_cost_amount: ''
                },
                copyDetailInfo: {},
                ruleValidate: {
                    invoice_no: [
                        { required: true, message: '发票号码不能为空', trigger: 'blur' }
                    ],
                    invoice_time: [
                        { required: true, message: '发票日期必填',trigger: 'blur' }
                    ]
                },
                canEdit: true,
                canDelete: false,
                canAbandon: false,
                canBack: false,
                canPush: false,
                showApprove: false,
                typeObj: {
                    order_invoice_no: '',
                    invoice_status: ''
                },
                currentFlow: 0,
                workFlowArr: [],
                canApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                formSearch:{
                    brand_no:'all',
                    product_name:'',
                    buy_order_no:'',
                    ship_no:'',
                    product_order_no:'',
                    product_model:'',
                    instock_no:'',
                    store_no:'all',
                    date: '',
                },
            };
        },
        components: {
            pagination
        },
        methods: {
            //获取到货仓库列表
            getAllStore () {
                allStoreInfos(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.storeArr.push(item);
                        });
                    }
                });

                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
                        });
                    }
                });
            },
            search(){
                this.currentPage = 1;
                this.getGoods();
            },
            addGoods () {
                if(this.invoiceBasicInfo.order_invoice_type == 0){
                    this.goodsModal = true;
                    this.getGoods();
                }else{
                    this.$Message.error('暂不支持采购退票单');
                }
                
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getGoods();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            date (time) {
                this.formSearch.date = time;
                this.search();
            },
            goodsCancel(){
                this.goodsModal = false;
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].id);
                    }
                
                    let list = JSON.stringify({
                        instock_detail_id: this.goodsAddArr
                        });
                    apiGetAddInvoice(this,{
                        params: list
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goods = res.data.detail.data;
                            for (let i in this.goods) {
                                this.goods[i].num = this.goods[i].wait_invoice_num;
                                this.goods[i].isEditDetail = true;
                                this.invoiceDetailInfo.data.push(this.goods[i]);
                                this.invoiceDetailInfo.data.forEach(item => {
                                    this.changeRelatedNum(item);
                                });
                            }
                            this.invoiceDetailInfo.data.forEach(item => {
                                this.changeRelatedNum(item);
                            })
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });

                }

            },
            goToHTDetail(id) {
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
            getGoods(){
                apiGetPurchaseSPGoods(this, {
                    supplier_no:this.invoiceBasicInfo.supplier_no,
                    order_invoice_type:0,
                    params: JSON.stringify(this.notempty({
                        brand_no:this.formSearch.brand_no == 'all' ? '' : this.formSearch.brand_no,
                        product_name:this.formSearch.product_name,
                        buy_order_no:this.formSearch.buy_order_no,
                        ship_no:this.formSearch.ship_no,
                        product_order_no:this.formSearch.product_order_no,
                        product_model:this.formSearch.product_model,
                        instock_no:this.formSearch.instock_no,
                        store_no:this.formSearch.store_no == 'all' ? '' : this.formSearch.store_no,
                        starttime: this.formSearch.date[0],
                        endtime: this.formSearch.date[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.checked = false;
                            item.priceToGet = this.multiply(item.wait_invoiced_num, item.buy_price, 4);
                        });
                        this.goodsData = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.totalAmount = res.data.total_amount;
                    }
                });
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            reset(){
                this.formSearch.brand_no = 'all';
                this.formSearch.product_name = '';
                this.formSearch.buy_order_no = '';
                this.formSearch.ship_no = '';
                this.formSearch.product_order_no = '';
                this.formSearch.product_model = '';
                this.formSearch.instock_no = '';
                this.formSearch.store_no = 'all';
                this.formSearch.date = '';
                this.orderField = '';             //排序字段
                this.orderDirection = 'desc'; 
                this.search();
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.goodsData.forEach(item => {
                    item.checked = false;
                });
                this.multipleSelection = val;
                this.priceToGet = 0;
                val.forEach(item => {
                    item.checked = true;
                    this.priceToGet = this.add(this.priceToGet, item.priceToGet);
                });
                this.priceToGet = this.priceToGet.toFixed(4);
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.invoiceDetailInfo.data) {
                    if (row.id === this.invoiceDetailInfo.data[i].instock_detail_id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },

        	backTo () {
        		history.go(-1);
        	},
            goToDiffDetail (id, moduleName) {
                util.openNewPage(this, moduleName, {
                    param: id
                });
                this.$router.push({
                    name: moduleName,
                    query: {
                        param: id
                    }
                });
            },
            changeDate(time){
                this.invoiceBasicInfo.invoice_time = time;
            },
            doApprove() {
                this.showApprove = true;
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
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.invoiceDetailInfo.data.sort(sortBy(column.prop, isDec));
            },
            manualSortAdd (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.search();
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_invoice_type', 'buy_invoice_status', 'buy_invoice_from'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.invoice_statusAll = res.data.buy_invoice_status;
                        this.order_invoice_typeAll = res.data.buy_invoice_type;
                        this.order_invoice_typeFrom = res.data.buy_invoice_from;
                        this.getData();
                    }
                });
            },            
            getData () {
                purchaseManageSPDetail(this, {
                    params: JSON.stringify({
                        order_invoice_no: this.$route.query.param
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if(res.data.basicInfo.from_order_no == '0'){
                            this.normalType = true;
                            this.returnOrGet = '收';
                            this.pullOrPush = '入库';
                        }else if(res.data.basicInfo.from_order_no == '1'){
                            this.normalType = false;
                            this.returnOrGet = '退';
                            this.pullOrPush = '退货';
                        };
                        res.data.detail.data.forEach(item => {
                            switch(item.from_order_no) {
                                case '0':
                                    item.moudleName = 'purchase_manage_RK_detail';
                                    break;
                                case '1':
                                    item.moudleName = 'purchase_manage_TH_detail';
                                    break;
                                default:
                                    item.moudleName = 'home_index'; //未匹配跳转首页
                            }
                        });
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.basicInfo.invoice_status == '0') && (Cookies.get('user_no') === res.data.basicInfo.create_user_no);
                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据的创建人展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示
                                this.canEdit = ((res.data.basicInfo.invoice_status == '0') && (Cookies.get('user_no') === res.data.basicInfo.create_user_no)) || ((res.data.basicInfo.invoice_status == '4') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName, +this.$route.query.type).then(isIn => {
                                        this.canPush = ((res.data.basicInfo.invoice_status == '0') && (Cookies.get('user_no') === res.data.basicInfo.create_user_no) && isIn) || ((res.data.basicInfo.invoice_status == '4') && isTaskCreater && isCurrent);
                                        
                                    });
                                });
                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.basicInfo.invoice_status == '1') || (res.data.basicInfo.invoice_status == '4')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.basicInfo.invoice_status == '4') && isTaskCreater && isCurrent;
                            });

                        });
                        

                        // 单据状态“已审批”，且且当前登录人员为单据最终审批人时展示回退；
                        isFinalApprover(this, this.$route.query.param).then(isFinal => {
                            this.canBack = (res.data.basicInfo.invoice_status == '2') && isFinal;
                        });

                        this.invoiceBasicInfo = res.data.basicInfo;
                        this.invoiceBasicInfo.invoice_statusDis = this.invoice_statusAll[res.data.basicInfo.invoice_status];
                        this.invoiceBasicInfo.order_invoice_typeDis = this.order_invoice_typeAll[res.data.basicInfo.order_invoice_type];
                        this.invoiceBasicInfo.order_invoice_typeFromDis = this.order_invoice_typeFrom[res.data.basicInfo.from_order_no];
                        res.data.detail.data.forEach(item => {
                            item.isEditDetail = false;
                            if (item.change_num) {
                                item.ship_num = item.change_num;
                            }
                        });
                        this.invoiceDetailInfo = res.data.detail;
                        this.invoiceDetailInfo.data.forEach(item => {
                            this.changeRelatedNum(item);
                        });

                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            editBasic() {
                this.copyBasicInfo = JSON.parse(JSON.stringify(this.invoiceBasicInfo));
                this.isEdit = true;
            },
            saveBasic() {
                this.$refs['invoiceBasicInfo'].validate((valid) => {
                    if (valid) {
                        purchaseManageSPBasicEdit(this, {
                            params: JSON.stringify(this.invoiceBasicInfo)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('修改成功!');
                                this.getData();
                                this.isEdit = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                });
            },
            cancelBasic() {
                this.invoiceBasicInfo = JSON.parse(JSON.stringify(this.copyBasicInfo));
                this.isEdit = false;
            },
            editDetail() {
                this.copyDetailInfo = JSON.parse(JSON.stringify(this.invoiceDetailInfo));
                this.isEditDetail = true;
                this.invoiceDetailInfo.data.forEach(item => {
                    item.isEditDetail = true;
                });
            },
            saveDetail() {
                let reg = /^[1-9]\d*$/;
                let isNum = true;
                let currentIndex = 0;
                let numTooLarge = false;
                for (let i = 0; i < this.invoiceDetailInfo.data.length; i++) {
                    isNum = reg.test(+this.invoiceDetailInfo.data[i].invoice_num);
                    if (!isNum) {
                        currentIndex = i + 1;
                        break;
                    }
                    if (+this.invoiceDetailInfo.data[i].invoice_num > +this.invoiceDetailInfo.data[i].wait_invoice_num) {
                        numTooLarge = true;
                        currentIndex = i + 1;
                        break;
                    }
                }
                if (!isNum) {
                    this.$Message.error('第' + currentIndex +'行发票数量输入不正确!');
                    return;
                }
                if (numTooLarge) {
                    this.$Message.error('第' + currentIndex +'行发票数量不能大于可' + this.returnOrGet + '票数量!');
                    return;
                }
                if (this.normalType) {
                    purchaseManageSPNomalEdit(this, {
                        params: JSON.stringify({
                            order_invoice_no: this.$route.query.param,
                            detail: this.invoiceDetailInfo.data
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('修改成功!');
                            this.getData();
                            this.isEditDetail = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                    
                } else {
                    purchaseManageSPBackEdit(this, {
                        params: JSON.stringify({
                            order_invoice_no: this.$route.query.param,
                            from_order:  this.invoiceBasicInfo.from_order,
                            detail: this.invoiceDetailInfo.data
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('修改成功!');
                            this.getData();
                            this.isEditDetail = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }

            },
            deleted (index) {
                if (this.invoiceDetailInfo.data.length <= 1) {
                    this.$Message.error('只剩一条不能删除!');
                    return;
                }
                this.invoiceDetailInfo.data.splice(index,1);
                this.invoiceDetailInfo.data.forEach(item => {
                    this.changeRelatedNum(item);
                });
            },
            cancelDetail() {
                this.invoiceDetailInfo = JSON.parse(JSON.stringify(this.copyDetailInfo));
                this.isEditDetail = false;
                this.invoiceDetailInfo.data.forEach(item => {
                    item.isEditDetail = false;
                });
            },
            changeRelatedNum(row) {
                row.invoice_amount = this.multiply(row.invoice_num, row.buy_price, 4);
                row.invoice_cost_amount = this.multiply(row.invoice_num, row.buy_cost_price, 4);
                row.cost_amount = this.subtract(row.invoice_amount, row.invoice_cost_amount, 4);

                this.invoiceDetailInfo.total_num = 0;
                this.invoiceDetailInfo.total_invoice_amount = 0;
                this.invoiceDetailInfo.total_invoice_cost_amount = 0;
                this.invoiceDetailInfo.total_cost_amount = 0;
                this.invoiceDetailInfo.data.forEach(item => {
                    this.invoiceDetailInfo.total_num = this.add(this.invoiceDetailInfo.total_num, item.invoice_num);
                    this.invoiceDetailInfo.total_invoice_amount = this.add(this.invoiceDetailInfo.total_invoice_amount, item.invoice_amount);
                    this.invoiceDetailInfo.total_invoice_cost_amount = this.add(this.invoiceDetailInfo.total_invoice_cost_amount, item.invoice_cost_amount);
                    this.invoiceDetailInfo.total_cost_amount = this.add(this.invoiceDetailInfo.total_cost_amount, item.cost_amount);
                });
                this.invoiceDetailInfo.total_num = this.invoiceDetailInfo.total_num.toFixed(0);
                this.invoiceDetailInfo.total_invoice_amount = this.invoiceDetailInfo.total_invoice_amount.toFixed(4);
                this.invoiceDetailInfo.total_invoice_cost_amount = this.invoiceDetailInfo.total_invoice_cost_amount.toFixed(4);
                this.invoiceDetailInfo.total_cost_amount = this.invoiceDetailInfo.total_cost_amount.toFixed(4);

            },
            deleteSP() {
                this.showDelete = true;
            },
            confirmDelete() {
                purchaseManageSPDelete(this, {
                    params: JSON.stringify({
                        order_invoice_no: this.$route.query.param
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.showDelete = false;
                        util.openNewPage(this, 'purchase_manage_SP_index');
                        this.$router.push({
                            name: 'purchase_manage_SP_index'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            cancelDelete() {
                this.showDelete = false;
            },
            confirmAbandon() {
                this.loading = true;
                purchaseManageSPUpdate(this, {
                    params: JSON.stringify(this.typeObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('废弃成功!');
                        this.showAbandon = false;
                        this.getData();
                        this.getWorkFlow();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            cancelAbandon() {
                this.showAbandon = false;
            },
            updateSP(type) {
                this.typeObj = {
                    order_invoice_no: this.$route.query.param,
                    invoice_status: ''
                };
                let typeName = '';
                switch(type) {
                    case '0':
                        this.typeObj.invoice_status = 'submit';
                        typeName = '提交';
                        break;
                    case '1':
                        this.typeObj.invoice_status = 'invalid';
                        typeName = '废弃';
                        break; 
                    case '2':
                        this.typeObj.invoice_status = 'backspace';
                        typeName = '回退';
                        break;           
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    purchaseManageSPUpdate(this, {
                        params: JSON.stringify(this.typeObj)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success( typeName + '成功!');
                            this.getData();
                            this.getWorkFlow();
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                }
            },
            getModalName() {
                return new Promise(success => {
                    purchaseManageSPModel(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {    
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },
            goToDetail (id) {
                util.openNewPage(this, 'purchase_manage_HT_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_HT_detail',
                    query: {
                        param: id
                    }
                });
            }            
        },
        created () {
            this.getWorkFlow();
            this.getStatus();
            this.getAllStore();
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