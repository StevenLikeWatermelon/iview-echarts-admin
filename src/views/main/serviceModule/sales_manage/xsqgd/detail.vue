<style>
    .xsqgd-detail .el-table {
        /*overflow: visible;*/
    }
    .xsqgd-detail .el-table__body-wrapper {
        /*overflow: visible;*/
    }
</style>
<template>
    <div class="xsqgd-detail">
        <Row class="margin-top-10 th-detail">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        单据基本信息
                    </p>         
                    <Form :label-width="120">
                        <Row>
                            <Col span="6">
	                            <FormItem label="销售请购单编号：">
	                            	<span>{{salesRequirition.requisition_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建人：">
	                                <span>{{salesRequirition.create_user_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建时间：">
                                    <span>{{salesRequirition.create_time}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单据状态:">
                                   <span>{{requisitionStatusObj[salesRequirition.requisition_status] }}</span>
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
                        请购商品明细
                    </p>
                    <div slot="extra" v-show="canEdit" v-auth="xsqgdDetailEdit">
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
			                            <FormItem label="请购商品总数：">
			                            	<span>{{requiritionCount.total_num}}</span>
			                            </FormItem>
		                            </Col>
                                    <Col span="6" offset="12">
                                        <a @click="addNew()" v-show="isEdit" style="float:right">
                                            <Icon type="plus"></Icon>
                                            添加商品
                                        </a>
                                    </Col>
		                        </Row>
		                    </Form>
                    	</col>
                    </Row>
                    <Row>
                    	<col span="24">
		                    <el-table :row-class-name="tableRowClassName" :data="buyProductList" border style="text-align: center;" @sort-change="manualSort">
		                        <el-table-column show-overflow-tooltip prop="hh" label="行号"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号"  min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="htsl" label="合同数量"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="requisition_num" :label="isEditLabel" >
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row.isEdit">{{scope.row.requisition_num}}</span>
                                        <Input v-show="scope.row.isEdit" v-model="scope.row.requisition_num" placeholder="请输入请购数量" @on-change="changeAmount(scope)"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="sell_order_no" label="宜电库存数量" width="130">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="viewMallStock(scope.row.stock_detail)">{{scope.row.mall_stock}}</span>
                                    </template>
                                </el-table-column>
                                 <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="sell_order_no" label="来源单据编号" width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.sell_order_no)">{{scope.row.sell_order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="采购合同单编号" width="120">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.buy_order_no.length == 0"></div>
                                        <el-popover trigger="hover" placement="top" v-else>
                                            <p v-for="val in scope.row.buy_order_no"><span>{{ val }}</span></p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="采购员" width="120">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.buy_user_name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip v-if="isEdit" label="操作">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.$index)">删除</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="note" label="备注"></el-table-column>
                                <el-table-column label="采购数量" width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getBuyNum(scope.row.id,scope.row.buy_num)">{{scope.row.buy_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="采购发货数量" width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getShipNum(scope.row.id,scope.row.ship_num)">{{scope.row.ship_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="采购入库数量" width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getInstockNum(scope.row.id,scope.row.instock_num)">{{scope.row.instock_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="销售出库数量" width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getCkNum(scope.row.id,scope.row.cksl)">{{scope.row.cksl}}</span>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList('service-sales-xsqgd')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="warning" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="deleteReturn()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-if="canBack" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="updateTH('2')">回退</Button>
                <Button v-show="canQGEdit" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="toQGXGD()" v-auth="xsqgdDetailEdit">生成销售请购修改单</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete"
            @on-cancel="cancelDelete">
            <p>确认删除该销售请购单?</p>
        </Modal> 
        <Modal v-model="showAbandon" title="确认废弃">
            <p>确认废弃该销售请购单?</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbandon">确定</Button>
            </div>
        </Modal>         
        <Modal v-model="showApprove" title="请选择审批意见">
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
            <div slot="footer">
                <Button type="text" @click="cancelAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmApprove">确定</Button>
            </div>
        </Modal> 
        <Modal v-model="showAdd" class-name="make-return modal-no-absoute" title="添加商品" width="90">
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <Form :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="salesRequisition.cpppbh"  placeholder="请选择产品品牌" filterable @on-change="search">
                                        <Option v-for="item in brandList" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.djbh" placeholder="请输入销售合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpdhh" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpxh" placeholder="请输入产品型号" @on-enter="search"></Input>
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
                            <Icon type="navicon-round"></Icon>
                            待请购商品列表
                        </p>         
                        <Row style="margin-bottom:10px;">
                            <col span="24">
                                <Button type="primary"  @click="confirmAdd()">添加</Button>
                            </col>
                        </Row>                                
                        <el-table :row-class-name="tableRowClassName" :data="productToAdd" border style="text-align: center;width: 100%" @sort-change="manualSort"  @selection-change="handleSelectionChange">
                            <el-table-column show-overflow-tooltip type="selection" width="55" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip label="销售合同单编号" width="120">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.djbh)">{{scope.row.djbh}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="djrq" label="创建时间" sortable="custom" width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称"  min-width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号"  min-width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号"  min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="jldw" label="计量单位" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="requisition_num" label="待请购数量" min-width="100"></el-table-column>
                             <el-table-column show-overflow-tooltip prop="purchase_user_name" label="采购员" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.purchase_user_no }} <em v-if="scope.row.purchase_user_no">/</em> {{scope.row.purchase_user_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="支付状态" sortable="custom" prop="khzfzt" min-width="100">
                                <template slot-scope="scope">
                                    <span>{{payStatus[scope.row.khzfzt] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="订单状态" sortable="custom" prop="xshtdzt" min-width="100">
                                <template slot-scope="scope">
                                    <span>{{orderStatus[scope.row.xshtdzt] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                </col>
            </Row>
        </Modal>

        <Modal v-model="showShip" title="采购发货单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :row-class-name="tableRowClassName" :data="OrderShipList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="采购发货单编号" min-width="120" prop="rel_order_no" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="num" label="发货数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="receive_stock_name" label="到货仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_leadtime" label="货期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="expect_leadtime" label="预计到货日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ship_name" label="发货物流" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ship_no" label="物流单号" show-overflow-tooltip></el-table-column>
                        <el-table-column label="采购员" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{ shipStatusObj[scope.row.order_status] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
        <Modal v-model="showInstock" title="采购入库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :row-class-name="tableRowClassName" :data="OrderInstockList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="采购入库单编号" min-width="120" prop="instock_no" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="num" label="发货数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="instock_num" label="入库数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="store_name" label="到货仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="入库库区" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="入库库位" show-overflow-tooltip></el-table-column>
                        <el-table-column label="采购员" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{instockStatusObj[scope.row.instock_status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>


        <Modal v-model="showCk" title="销售出库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <Card>
                    <el-table :row-class-name="tableRowClassName" :data="OrderCkList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column label="销售出库单单编号" min-width="120" prop="xsckd_djbh" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cksl" label="出库数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckdj" label="出库单价" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckje" label="出库金额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckmc" label="出库仓库" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="出库库区" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="出库库位" show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{xsckdObj[scope.row.status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

        <Modal v-model="showBuy" title="采购合同单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :row-class-name="tableRowClassName" :data="OrderBuyList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="采购合同单号" min-width="120" prop="buy_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="gysmc" label="供应商" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ckmc" label="到货仓库" show-overflow-tooltip></el-table-column>
                    <el-table-column label="单据状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{buyObj[scope.row.order_status]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

        <Modal v-model="showMallStock" title="宜电可售库存" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="mallStockList" border style="text-align: center">
                    <el-table-column label="库存ID" min-width="100" prop="stock_id" show-overflow-tooltip></el-table-column>
                    <el-table-column label="供应商编号" min-width="120" prop="supplier_no" show-overflow-tooltip></el-table-column>
                    <el-table-column label="订货号" min-width="100" prop="product_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column label="产品型号" min-width="100" prop="product_model" show-overflow-tooltip></el-table-column>
                    <el-table-column label="库存类型" min-width="100" prop="stock_type" show-overflow-tooltip></el-table-column>
                    <el-table-column label="所属仓库" min-width="100" prop="store_name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="库存数量" min-width="100" prop="stock_num" show-overflow-tooltip></el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="showMallStock = false">确认</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import {apiAllStatus, purchaseManageWorkFlow,apiRequisitionDetail,purchaseManagesalesRequiritionBasicEdit,allpersonInfos,purchaseManagesalesRequiritionEdit,purchaseManagesalesRequiritionReadyList,apiAllBrands,purchaseManageRequisitionDelete,purchaseManageQGModelName,purchaseManageRequisitionUpdate,purchaseManageApproveAction,apiOrderShipInfo,apiOrderInstockInfo,apiOrderCkInfo,apiOrderBuyInfo } from '@/config/getData';
    export default {
        components: {
            pagination
        },        
        data () {
            return {
                showMallStock: false,
                mallStockList: [],
                requisitionStatusObj:{},
                loading: false,
                fromAdd: this.$route.query.fromAdd,
                showAdd: false,
                canQGEdit:false,
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
                salesRequirition: {
                    requisition_no: this.$route.query.param,
                    create_user_name: '',
                    note: '',
                    create_time: '2018年4月3日09:57:01'
                },
                personalList: [],
                copysalesRequirition: {},
                requiritionCount: {
                    total_num: 0
                },
                allAddressArr: [],
                buyProductList: [],
                EditedProductList: [],
                copyProductList: [],
                typeObj: {
                    order_return_no: '',
                    type: ''
                },
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                isEditLabel: '请购数量',

                //以下为弹窗内的数据初始化
                salesRequisition: {
                    cpppbh:'all'
                },
                brandList: [{
                    cpppbh: 'all',
                    cpppmc: '全部'
                }],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',   
                selectedToAdd: [],
                productToAdd: [],
                xsqgdDetailEdit: 'service-sales-xsqgd-edit',
                showShip:false,
                showInstock: false,
                showCk:false,
                OrderShipList:[],
                OrderInstockList:[],
                OrderCkList:[],
                shipStatusObj:{},
                instockStatusObj:{},
                xsckdObj:{},
                buyObj:{},
                OrderBuyList:[],
                showBuy:false,
            };
        },
        methods: {
            viewMallStock(detailData) {
                this.mallStockList = detailData || [];
                this.showMallStock = true;
            },
            confirmTranslate(){
                this.showShip = false;
                this.showInstock = false;
                this.showCk = false;
                this.showBuy = false;
            },

            getBuyNum(id,num){
                if(num != '0'){
                    apiOrderBuyInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderBuyList = res.data;
                            this.showBuy = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购合同单');
                }
            },

            getShipNum(id,num){
                if(num != '0'){
                    apiOrderShipInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                            this.OrderShipList = res.data;
                            this.showShip = true;


                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购发货单');
                }
            },
            getInstockNum(id,num){
                if(num != '0'){
                    apiOrderInstockInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                            this.OrderInstockList = res.data;
                            this.showInstock = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购入库单');
                }
            },

            getCkNum(id,num){
                if(num != '0'){
                    apiOrderCkInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderCkList = res.data;
                            this.showCk = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的销售出库单');
                }
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            toQGXGD(){
                 let requisition_no = this.$route.query.param;
                //let requisition_no = 'QG-180330-0018';
                this.handleClick({param: requisition_no}, 'service-sales-xsqgd-toQGXGD');
            },
        	backTo () {
        		history.go(-1);
        	},
            addNew() {
                this.showAdd = true;
                this.getData();
            },
            getData(){
                //获取带采购商品明细
                purchaseManagesalesRequiritionReadyList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.salesRequisition.djbh,
                        cpppbh:this.salesRequisition.cpppbh == 'all' ? '' : this.salesRequisition.cpppbh,
                        cpmc:this.salesRequisition.cpmc,
                        cpdhh:this.salesRequisition.cpdhh,
                        cpxh:this.salesRequisition.cpxh,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.productToAdd = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            redirectOtherPage (pageName, query) {
                util.redirectPage(this, pageName, query);
            },
            editBasic() {
                this.copysalesRequirition = JSON.parse(JSON.stringify(this.salesRequisition));
                this.isBasicEdit = true;
            },
            saveBasic() {
                purchaseManagesalesRequiritionBasicEdit(this, {
                    params: JSON.stringify(this.salesRequirition)
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
            },
            cancelBasic() {
                this.salesRequisition = JSON.parse(JSON.stringify(this.copysalesRequirition));
                this.isBasicEdit = false;
            },
            editAllList () {
                this.copyProductList = JSON.parse(JSON.stringify(this.buyProductList));
                this.isEditLabel = '请购数量';
                this.buyProductList.forEach(item => {
                    item.isEdit = true;
                });
                this.isEdit = true;
            },
            deleteItem(index) {
                this.buyProductList.splice(index, 1);
            },
            changeAmount(scope) {
                let reg = /^[1-9]\d*$/;
                let isNum = reg.test(+scope.row.requisition_num);
                if (!isNum) {
                    this.$Message.error('格式有误!');
                }
                this.requiritionCount.total_num = 0;
                this.buyProductList.forEach(item => {
                    this.requiritionCount.total_num +=  +item.requisition_num;
                });
                this.requiritionCount.total_num = this.requiritionCount.total_num.toFixed(0);
            },
            saveEdit() {
                let reg = /^[1-9]\d*$/;
                let invalidate = false;
                let currentIndex = 0;
                for (let i = 0; i < this.buyProductList.length; i++) {
                    let isNum = reg.test(this.buyProductList[i].requisition_num);
                    if (!isNum) {
                        invalidate = true;
                        currentIndex = i + 1;
                        break;
                    }
                }
                if (invalidate) {
                    this.$Message.error('第' + currentIndex + '行请购数量格式有误!');
                    return;
                }

                this.EditedProductList = [];
                this.buyProductList.forEach(item => {
                    this.EditedProductList.push({
                        id: item.sell_detail_id,
                        number: item.requisition_num,
                        user_no:item.buy_user_no
                    });
                });


                // 请购单添加
                purchaseManagesalesRequiritionEdit(this, {
                    requisition_no: this.$route.query.param,
                    params: JSON.stringify({
                        list: this.EditedProductList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getDetail();
                        this.getWorkFlow(); 
                        this.isEdit = false;
                        this.isEditLabel = '请购数量';
                   } else {
                        this.$Message.error(res.message);
                   }
                });
            },



            // 弹窗功能函数开始
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesRequisition.cpppbh = 'all';
                this.salesRequisition.djbh = '';
                this.salesRequisition.cpdhh = '';
                this.salesRequisition.cpxh = '';
                this.salesRequisition.cpmc = '';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
            handleSelectionChange(selectedVal) {
                this.selectedToAdd = [];
                selectedVal.forEach(item => {
                    this.selectedToAdd.push(item);
                });
            },
            confirmAdd() {
                if (this.selectedToAdd.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                let selectedId;
                this.selectedToAdd.forEach(item => {
                    // 数据初始化
                    item.isEdit = true;
                    item.hh = this.buyProductList.length + 1;
                    item.brand_name = item.cpppmc;
                    item.product_name = item.cpmc;
                    item.product_model = item.cpxh;
                    item.product_order_no = item.cpdhh;
                    item.product_unit = item.jldw;
                    item.requisition_num = 0;
                    item.sell_order_no = item.djrq;
                    item.buy_user_name = item.purchase_user_name;
                    item.buy_user_no = item.purchase_user_no;
                    selectedId = item.sell_detail_id;
                    let isRepeat = false;
                    this.buyProductList.forEach(item => {
                        if (item.sell_detail_id == selectedId) {
                            isRepeat = true;
                        }
                    });
                    if (!isRepeat) {
                        this.buyProductList.push(item);
                    }
                });
                this.showAdd = false;
            },     
            // 弹窗功能函数结束



            //以下审批流操作代码部分可复用，暂时不删除，不需要请自行删除
            cancelEdit() {
                this.buyProductList = JSON.parse(JSON.stringify(this.copyProductList));
                this.isEditLabel = '请购数量';
                this.buyProductList.forEach(item => {
                    item.isEdit = false;
                });
                this.isEdit = false;
            },
            confirmApprove() {
                this.loading = true;
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
                    this.showApprove = false;
                    this.loading = false;
                });
            },    
            doApprove() {
                this.showApprove = true;
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

            //获取单据详情信息
            getDetail () {
                // 自行修改接口名称
                apiRequisitionDetail(this, {
                    params: JSON.stringify({requisition_no: this.$route.query.param})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.salesRequirition = res.data.basic_info;

                        //删除；
                        this.canDelete = (res.data.basic_info.requisition_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no);

                        //当前用户是否是任务的创建人
                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            //获取当前登录人是否是任务审批人
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                //编辑
                                this.canEdit = ((res.data.basic_info.requisition_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no)) || ((res.data.basic_info.requisition_status == '-1') && isTaskCreater && isCurrent);


                                this.getModalName().then(modalName => {
                                    //当前登录人是否可创建工作流
                                    isInCreaters(this, modalName,2).then(isIn => {

                                        //提交
                                        this.canPush = ((res.data.basic_info.requisition_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no) && isIn) || ((res.data.basic_info.requisition_status == '-1') && isTaskCreater && isCurrent);
                                        //申请修改
                                        this.canQGEdit = (res.data.basic_info.requisition_status == '2') && isTaskCreater;
                                    });
                                });

                                //审批
                                this.canApprove = ((res.data.basic_info.requisition_status == '1') || (res.data.basic_info.requisition_status == '-1')) && isCurrent && !isTaskCreater;

                                // 作废；
                                this.canAbandon = (res.data.basic_info.requisition_status == '-1') && isTaskCreater && isCurrent;

                            });

                        });


                        isFinalApprover(this, this.$route.query.param).then(isFinal => {
                            // 回退；
                            this.canBack = (res.data.basic_info.requisition_status == '2') && isFinal;
                        });




                        res.data.product_info.forEach(item => {
                            item.isEdit = false;
                        });
                        this.buyProductList = res.data.product_info;
                        this.requiritionCount.total_num = res.data.total_num;
                    }
                });
            },
            deleteReturn() {
                this.showDelete = true;
            },
            updateTH(type) {
                this.typeObj = {
                    requisition_no: this.$route.query.param,
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
                        typeName = '作废';
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
                    purchaseManageRequisitionUpdate(this, {
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
                this.showApprove = false;
            },
            confirmAbandon() {
                this.loading = true;
                purchaseManageRequisitionUpdate(this, {
                    params: JSON.stringify(this.typeObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('作废成功!');
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
                purchaseManageRequisitionDelete(this, {
                    params: JSON.stringify({
                        requisition_no:  this.$route.query.param
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.showDelete = false;
                        util.openNewPage(this, 'service-sales-xsqgd');
                        this.$router.push({
                            name: 'service-sales-xsqgd'
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
                    purchaseManageQGModelName(this, {}).then(res => {
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
                util.openNewPage(this, 'service-sales-htd-detail', {
                    param: id
                });
                this.$router.push({
                    name: 'service-sales-htd-detail',
                    query: {
                        param: id
                    }
                });
            },
            goToBuyHTD(id){
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
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getAllInfos () {
                //获取所有采购员
                allpersonInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.personalList.push({
                                value: item.user_no,
                                label: item.user_name
                            });
                        });
                    }
                });

                //获取所有产品品牌
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {

                        this.brandList = this.brandList.concat(res.data);
                    }
                });

                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_status','khzfzt', 'xshtdzt','ship_status','instock_status','xsckd','buy_order_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                        this.requisitionStatusObj = res.data.requisition_status;
                        this.shipStatusObj = res.data.ship_status;
                        this.instockStatusObj = res.data.instock_status;
                        this.xsckdObj = res.data.xsckd;
                        this.buyObj = res.data.buy_order_status;
                    }
                });


            },
        },

        created () {
             this.getWorkFlow();
             this.getDetail();
             this.getAllInfos();
            // this.getMapDetail();
        }
    };
</script>