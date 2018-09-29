<style>
    .purchase-fh-detail .ivu-select-single .ivu-select-selection {
        height: 31px;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10 purchase-fh-detail">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                    <span style="font-weight:normal;float:right;" v-if="isCurrent">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_edit" @click="edit()"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('basicCancel')">取消</Button>
                            <Button type="primary" @click="close('basicSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <Form :label-width="120" ref="basicForm" :model="form" :rules="basicRules">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购发货单编号：">
                            {{ form.order_ship_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" >
                            {{ ship_status[form.order_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商：">
                            {{ form.gysmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商联系人：">
                            {{ form.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="是否直发客户：" v-show="is_submitEdit">
                            {{ is_direct[form.is_direct] }}

                        </FormItem>
                        <FormItem label="是否直发客户：" prop="is_direct" v-show="!is_submitEdit">
                            <Select v-model="form.is_direct"  placeholder="请选择" @on-change="direct">
                                <Option v-for="status in direct_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="到货仓库：" v-show="is_submitEdit">
                            {{ form.receive_stock_name }}
                        </FormItem>
                        <FormItem label="到货仓库："  prop="receive_stock" v-show="!is_submitEdit">
                                <Select v-model="form.receive_stock"  placeholder="请选择" @on-change="store" :disabled="stores">
                                    <Option value="888" v-show="not_real_store">虚拟仓库</Option>
                                    <Option v-for="status in store_list" :value="status.ckbh" :key="status.ckbh">{{ status.ckmc }}</Option>
                                </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="到货联系人：">
                            {{ form.receive_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="到货地址：">
                            {{ form.province_name + form.city_name + form.district_name + form.receive_address }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发货方式：">
                            <span v-if="is_edit">{{ fhfs[form.ship_type] }}</span>
                            <span v-else>
                                <Select v-model="form.ship_type"  placeholder="请选择发货方式" @on-change="shipType" style="margin-top:-10px;height: 16px;line-height: 16px;">
                                    <Option value="">不填</Option>
                                    <Option v-for="(value, index) in fhfs_list" :value="index" :key="index">{{ value }}</Option>
                                </Select>
                            </span>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="发货物流：">
                            <span v-if="is_edit">{{ form.ship_name }}</span>
                            <span v-else>
                                <Select v-model="form.ship_id"  placeholder="请选择发货物流" style="margin-top:-10px;height: 16px;line-height: 16px;">
                                    <Option value="">不填</Option>
                                    <Option v-for="val in fhwl_list" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                                </Select>
                            </span>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="物流单号：">
                            <span v-if="is_edit">{{ form.ship_no }}</span>
                            <span v-else>
                                <Input v-model="form.ship_no"  placeholder="请填写物流单号" style="margin-top:-10px;height: 16px;line-height: 16px;"></Input>
                            </span>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建人：">
                            {{ form.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" >
                            {{ form.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="货期："  v-if="!is_submitEdit" prop="hq">
                            <Input v-model="form.hq"  placeholder="请填写货期" type="number" style="margin-top:-10px;height: 16px;line-height: 16px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" >
                            <span v-if="is_submitEdit">{{ form.note }}</span>
                            <span v-else>
                                <Input type="textarea" v-model="form.note"  placeholder="请填写备注"></Input>
                            </span>
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
                    发货商品明细
                    <span style="font-weight:normal;float:right;" v-show="is_editProduct">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-show="edit_goods" @click="FhEdit"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <Button v-show="!edit_goods" type="default" @click="Fhcancel">取消</Button>
                        <Button v-show="!edit_goods" type="primary" @click="Fhsave">保存</Button>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>发货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">发货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                        <span style="color: rgb(45, 140, 240);cursor: pointer;float:right;" v-show="!edit_goods" @click="addGoods">添加商品</span>
                    </div>
                    <div v-show="edit_goods">
                        <el-table :row-class-name="tableRowClassName" :data="actTable" border style="text-align: center"  @sort-change="manualSort" >
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="num" label="发货数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip label="发货金额" sortable="custom">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.num, scope.row.buy_price, 4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_num" label="已入库数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_leadtime" label="货期（天）"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单编号">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                        {{ scope.row.buy_order_no }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="from_order_no" label="来源单据编号"></el-table-column>
                            <el-table-column label="采购入库单编号">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="scope.row.instock_num" @click="getInstock(scope.row.fh_id)" type="text" size="small">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;">查看</span>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div v-show="!edit_goods">
                        <el-table :row-class-name="tableRowClassName" :data="actTable" border style="text-align: center"  @sort-change="manualSort" >
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" fixed sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="ship_num" label="已发货数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="num" label="本次发货数量" sortable="custom">
                                <template slot-scope="scope">
                                    <Input type="text" v-model="scope.row.num" @on-change="verify(scope)"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="发货金额" sortable="custom">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.num, scope.row.buy_price, 4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_leadtime" label="货期（天）"></el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单编号">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                        {{ scope.row.buy_order_no }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="from_order_no" label="来源单据编号"></el-table-column>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;"  @click="deleteRow(scope.$index)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
            </Card>
            </Col>
            <!--采购入库单弹窗-->
            <Modal width="500" v-model="showInfo" title="采购入库单">
                <div v-for="(value,index) in instock_list" @click="gotoInstock(value)" style="cursor:pointer;line-height:30px;color:rgb(45, 140, 240);">{{ value }}</div>
            </Modal>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_FH_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" v-show="isdeleteed" @click="IsDeletedOrder">删除</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="abolish()" :loading="loading" v-show="isabolish" v-auth="buttonLimit">作废</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="submit()" :loading="loading" v-show="issubmit" >提交</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="applyEdit" v-show="modifyCondition">申请修改</Button>
                <Button type="primary" class="margin-left-10" style="margin:auto;margin-left:20px;"  @click="exportList" v-auth="buyshipdetailexport">导出</Button>
            </Card>
            </Col>
        </Row>



        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="500" class="orderForm-approvePass" :closable=false>
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#000;line-height: 40px;">发货商品对应的销售合同单剩余<em style="color:#cf0012;font-style: normal;">{{money}}</em>元待付款，</P>
                    <P style="font-size:16px;color:#000;line-height: 40px;">确认直发客户？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancel()">取消</Button>
                <Button type="primary" :loading="loadding" @click="ok()">确定</Button>
            </div>
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
                                    <Select v-model="formSearch.fk_status"  placeholder="请选择" @on-change="search">
                                        <Option v-for="status in zfStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.htd_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>

                                <Col span="4">
                                    <Select v-model="formSearch.brand"  placeholder="请选择" filterable @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>

                                <Col span="4">
                                    <Input v-model="formSearch.order" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.create_user" placeholder="请输入" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                                </Col>

                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择预计到货日期时间" :value='formSearch.datetime1' @on-change="datetime1" style="width: 100%;"></DatePicker>
                                </Col>
                                <Col span="4">
                                <Input v-model="formSearch.sell_order_no" placeholder="请输入销售合同单编号" @on-enter="search"></Input>
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
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" :selectable="canSelect" fixed></el-table-column>
                            <el-table-column label="采购合同单编号" prop="buy_order_no" fixed width="120">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="gysmc" label="供应商" width="120"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" ></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" width="150"></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" width="120"></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="100"></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位 " ></el-table-column>
                            <el-table-column prop="ckmc" label="到货仓库 " width="150"></el-table-column>
                            <el-table-column label="产品面价" prop="product_origin_price" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.product_origin_price).toFixed(2) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购折扣" prop="product_discount" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.product_discount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购单价" prop="buy_price" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" min-width="100"></el-table-column>
                            <el-table-column label="采购金额">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.buy_price, scope.row.buy_num, 4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="has_ship_num" label="已发货数量"></el-table-column>
                            <el-table-column prop="buy_leadtime" label="采购货期(天)"></el-table-column>
                            <el-table-column prop="expect_leadtime" label="预计到货日期" ></el-table-column>
                            <el-table-column prop="note" label="备注" width="150"></el-table-column>
                            <el-table-column label="单据状态" prop="order_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ djStatus[scope.row.order_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="付款状态" prop="pay_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ zfStatus[scope.row.pay_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货状态" prop="ship_status" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ fhStatus[scope.row.ship_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
                            <el-table-column label="创建人" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源单据编号" prop="from_order_no" width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.from_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号" prop="from_order_no" width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.sell_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ship_nos" label="采购发货单编号" width="120">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.ship_nos.length == 0"></div>
                                    <el-popover trigger="hover" placement="top" v-else>
                                        <p v-for="val in scope.row.ship_nos"><span class="pointer-hover">{{ val }}</span></p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="invoice_nos" label="采购收票单编号" width="120">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.invoice_nos.length == 0"></div>
                                    <el-popover trigger="hover" placement="top" v-else>
                                        <p v-for="val in scope.row.invoice_nos"><span class="pointer-hover">{{ val }}</span></p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="default" @click="goodsCancel">取消</Button>
                <!--<Button type="primary" @click="ToHTD">确定</Button>-->
            </div>
        </Modal>



        <!--删除弹窗-->
        <Modal v-model='DeletedModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="deletedCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="DeleteOrder">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiGetShipDetailExport,apiAllStatus,apiGetPurchaseCanShip,apiShipOrderDeleted,apiShipProductEdit,operateAllBrandsList,apiWaitShipList,apiGetShipSubmit,apiGetPurchaseHtList,apiShipIsDirect,apiGetCkDetailByCKBH,allStoreInfos,apiGetShipDetail,apiGetInstockByShip,apiGetShipAbolish,apiSendLogistic,apiModifyShipInfo, apiPurchaseShipEditToList } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                buyshipdetailexport: 'purchase_manage_FH_detail_export_button',
                loading: false,
                isCurrent: false,
                fhfs_list: [],
                fhwl_list: [],
                is_edit: true,
                fromAdd: this.$route.query.fromAdd,
                isabolish: false,
                issubmit:false,
                form: {},
                ship_no: this.$route.query.param,
                actTable: [],
                is_direct: '',              //直发用户列表
                ship_status: '',            //发货单状态
                goodsAll: 0,
                goodsAllMoney: 0,
                showInfo: false,
                instock_list: [],
                fhfs: [],
                buttonLimit: 'purchase_fh_detail_button',
                direct_list: [],
                is_submitEdit:true,
                store_list: [],
                publicModal: false,
                not_real_store:false,
                basicRules: {
                    is_direct: [
                        { required: true, message: '请选择是否直发客户', trigger: 'on-change' }
                    ],
                    receive_stock: [
                        { required: true, message: '请选择到货仓库', trigger: 'on-change' }
                    ],
                    hq: [
                        { required: true, message: '请填写货期', trigger: 'blur' }
                    ]
                },
                edit_goods:true,
                goodsModal:false,
                supplier_no:'',
                formSearch: {
                    fk_status:'all',
                    brand:'all',
                    datetime: [],
                    datetime1: [],
                    sell_order_no:'',
                },
                orderData:[],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                start_time: '',
                start_time1: '',
                end_time: '',
                end_time1: '',
                zfStatusArr: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                djStatus: [],
                zfStatus: [],
                fhStatus: [],
                multipleSelection: [],
                goods:[],
                is_editProduct:false,
                isdeleteed:false,
                DeletedModal:false,
                ajaxHistoryData:[],
                modifyCondition: false,
            };
        },
        components: {
            pagination
        },
        methods: {
            exportList () {
                apiGetShipDetailExport(this,{
                    ship_no: this.ship_no
                }).then(res => {

                });
            },
            deletedCancel(){
                this.DeletedModal = false;
            },
            IsDeletedOrder () {
                this.DeletedModal = true;
            },
            DeleteOrder(){
                apiShipOrderDeleted(this,{
                    order_ship_no: this.form.order_ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        util.openNewPage(this, 'purchase_manage_FH_index');
                        this.$router.push({
                            name: 'purchase_manage_FH_index'
                        });
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            Fhsave(){
                let tmp = {};
                for(let i = 0; i < this.actTable.length; i++){
                    if(this.actTable[i].num == ''){
                        this.$Message.error('发货数量必填!');
                        return;
                    }
                    let regu = /^[1-9]\d*$/;
                    if (!regu.test(this.actTable[i].num)) {
                        this.$Message.error('必须填入正整数');
                        return;
                    }

                    if(this.actTable[i].num > (this.actTable[i].buy_num - this.actTable[i].ship_num)){
                        this.$Message.error('不可大于可发货数量!');
                        return;
                    }
                    tmp[this.actTable[i].id] = this.actTable[i].num+'-'+this.form.hq;
                }

                apiShipProductEdit(this, {
                    data: JSON.stringify(tmp),
                    params: JSON.stringify(this.notempty({
                        order_ship_no: this.form.order_ship_no,
                    })),
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getData();
                        this.edit_goods = true;
                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            verify (scope) {
                let _index = scope.$index;
                let regu = /^[1-9]\d*$/;
                if (!regu.test(this.actTable[_index]['num'])) {
                    this.$Message.error('必须填入正整数');
                }
                if(this.actTable[_index]['num'] > (this.actTable[_index]['buy_num'] - this.actTable[_index]['ship_num'])){
                    this.$Message.error('不可大于可发货数量');
                }
                this.calculates();
            },
            search(){
                this.multipleSelection = [];
                this.currentPage = 1;
                this.getGoods();
            },
            reset(){
                this.formSearch.fk_status = 'all';
                this.formSearch.htd_no = '';
                this.formSearch.name = '';
                this.formSearch.order = '';
                this.formSearch.model = '';
                this.formSearch.brand = 'all';
                this.formSearch.datetime = [];
                this.formSearch.datetime1 = [];
                this.start_time = '';
                this.end_time = '';
                this.start_time1 = '';
                this.end_time1 = '';
                this.formSearch.create_user = '';
                this.formSearch.sell_order_no = '';
                this.multipleSelection = [];
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.orderData =  this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            goodsCancel(){
                this.goodsModal = false;
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].id);
                    }
                    let ship_list = '';
                    ship_list = this.goodsAddArr.join(',');

                    apiWaitShipList(this,{
                        ship_no:this.ship_no,
                        ids: JSON.stringify(ship_list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goods = [];
                            res.data.list.forEach(item => {
                                item.num = item.can_num;
                                item.product_leadtime = this.actTable[0].product_leadtime;
                                this.goods.push(item);
                            });
                            for (let i in this.goods) {
                                this.actTable.push(this.goods[i]);
                            }
                            this.calculates();
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });

                }
            },
            datetime (time) {
                this.formSearch.datetime = time;
                this.start_time = this.formSearch.datetime[0];
                this.end_time = this.formSearch.datetime[1];
                this.search();
            },
            datetime1 (time) {
                this.formSearch.datetime1 = time;
                this.start_time1 = this.formSearch.datetime1[0];
                this.end_time1 = this.formSearch.datetime1[1];
                this.search();
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable) {
                    if (row.id === this.actTable[i].id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            getGoods(){
                apiGetPurchaseCanShip(this, {
                    ship_status:JSON.stringify([0,1]),
                    ship_no:this.ship_no,
                    params: JSON.stringify(this.notempty({
                        supplier_no: this.supplier_no,
                        order_status: 2,
                        pay_status: this.formSearch.fk_status == 'all' ? '' : this.formSearch.fk_status,
                        buy_order_no: this.formSearch.htd_no,
                        product_name: this.formSearch.name,
                        product_order_no: this.formSearch.order,
                        product_model: this.formSearch.model,
                        brand_no: this.formSearch.brand == 'all' ? '' : this.formSearch.brand,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        expect_leadtime: !this.start_time1 ? '' : this.start_time1 + '~' +  this.end_time1,
                        create_user: this.formSearch.create_user,
                        sell_order_no: this.formSearch.sell_order_no,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.ajaxHistoryData = res.data.list;
                        this.totalnum = res.data.totalCount;
                        if (res.data.totalCount < this.limit) {
                            this.orderData = this.ajaxHistoryData;
                        } else {
                            this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                        }

                    }
                });
            },
            applyEdit () {
                apiPurchaseShipEditToList(this, {
                    ship_no: this.ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.handleClick({param: this.ship_no}, 'purchase_FHedit_make');
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            addGoods() {
                this.goodsModal = true;
                this.getGoods();
            },
            deleteRow (index) {
                this.actTable.splice(index,1);
                this.calculates();
            },
            calculates () {
                let allNum = 0;
                let allAmount = 0;
                for (let i in this.actTable) {
                    allNum = parseInt(allNum) + parseInt(+this.actTable[i].num);
                    allAmount = this.add(allAmount, this.multiply(this.actTable[i].num, this.actTable[i].buy_price), 4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
            },
            Fhcancel () {
                this.getData();
                this.edit_goods = true;
            },
            FhEdit () {
                this.edit_goods = false;
            },
            ok () {
                this.form.receive_address_id = [parseInt(this.tmp_list.shsfbh), parseInt(this.tmp_list.shsqbh), parseInt(this.tmp_list.shxqbh)];
                this.form.receive_address = this.tmp_list.shxxdz;
                this.form.receive_name = this.tmp_list.shrxm;
                //隐藏弹窗
                this.publicModal = false;
            },
            cancel () {
                this.form.is_direct = '0';
                this.form.receive_address_id = [];
                this.form.receive_address = '';
                this.form.receive_name = '';
                this.form.receive_stock = '';
                this.form.hq = '';
                this.not_real_store = false;
                this.stores = false;
                //隐藏弹窗
                this.publicModal = false;
            },
            direct () {
                let tmp = {};
                for(let key in this.actTable){
                    tmp[this.actTable[key].id] = this.actTable[key].num;
                }
                if(this.form.is_direct == 1){
                    apiShipIsDirect(this, {
                        data: JSON.stringify(tmp)
                    }).then(res => {
                        if (res && res.status == 1) {
                            if(res.data.can == 0){
                                this.form.is_direct = '0';
                                this.$Message.error(res.message);
                            }else{
                                //直发模式
                                this.form.receive_address_id = [];
                                this.form.receive_address = '';
                                this.form.receive_name = '';
                                this.form.receive_stock = '888';
                                this.not_real_store = true;
                                this.stores = true;
                                this.tmp_list = res.data.info;
                                //显示弹窗
                                if(res.data.money > 0){
                                    this.publicModal = true;
                                    this.money = res.data.money;
                                }else{
                                    this.ok();
                                }
                            }
                        }else{
                            this.form.is_direct = '0';
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.form.receive_address_id = [];
                    this.form.receive_address = '';
                    this.form.receive_name = '';
                    this.form.receive_stock = '';
                    this.not_real_store = false;
                    this.stores = false;
                    //隐藏弹窗
                    this.publicModal = false;
                }
            },
            store () {
                this.form.receive_address_id = [];
                this.form.receive_address = '';
                this.form.receive_name = '';
                if(this.form.receive_stock != '' && this.form.receive_stock != undefined){
                    apiGetCkDetailByCKBH(this, {
                        ckbh: this.form.receive_stock
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.form.receive_address_id = [parseInt(res.data.dzsfbh), parseInt(res.data.dzcsbh), parseInt(res.data.dzxqbh)];
                            this.form.receive_address = res.data.ckdz;
                            this.form.receive_name = res.data.ckfzr;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            close (param) {
                if(param === 'basicCancel'){
                    this.getData();
                    this.is_edit = true;
                    this.is_submitEdit = true;
                }else{
                    this.$refs.basicForm.validate((valid) => {
                        if (valid) {
                            apiModifyShipInfo(this, {
                                params: JSON.stringify({
                                    order_ship_no: this.form.order_ship_no,
                                    ship_type: this.form.ship_type,
                                    ship_id: this.form.ship_id,
                                    ship_no: this.form.ship_no,
                                    is_direct: this.form.is_direct,
                                    receive_stock: this.form.receive_stock,
                                    hq: this.form.hq,
                                    receive_name: this.form.receive_name,
                                    receive_address_id: this.form.receive_address_id,
                                    receive_address: this.form.receive_address,
                                    note: this.form.note

                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.is_edit = true;
                                    this.is_submitEdit = true;
                                    this.getData();
                                    this.$Message.success(res.message);
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                }
            },
            edit () {
                if(this.form.order_status == 0){
                    this.is_submitEdit = false;
                }
                this.is_edit = false;
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            //作废接口
            abolish () {
                this.loading = true;
                apiGetShipAbolish(this, {
                    ship_no: this.ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.isabolish = false;
                        this.form.order_status = -1;
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            //提交接口
            submit(){
                this.loading = true;
                apiGetShipSubmit(this, {
                    ship_no: this.ship_no
                }).then(res => {
                    if(res && res.status == 1){
                        this.issubmit = false;
                        this.getData();
                        this.$Message.success(res.message);
                    }else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            //获取采购入库单
            getInstock (fh_id) {
                apiGetInstockByShip(this, {
                    inmx_id: fh_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.instock_list = res.data.list;
                        this.showInfo = true;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            //跳转到采购入库单
            gotoInstock (in_no) {
                this.showInfo = false;

                let params = {};
                params = {
                    param: in_no
                };
                util.openNewPage(this, 'purchase_manage_RK_detail', params);
                this.$router.push({
                    name: 'purchase_manage_RK_detail',
                    query: params
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['is_direct','ship_status','fhfs','fhfs2','buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.is_direct = res.data.is_direct;
                        this.ship_status = res.data.ship_status;
                        this.fhfs = res.data.fhfs;
                        this.fhfs_list = res.data.fhfs2;
                        let tmpObj = {};
                        for (let key in res.data.is_direct) {
                            if (res.data.is_direct.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_direct[key]
                                };
                                this.direct_list.push(tmpObj);
                            }
                        }


                        this.djStatus = res.data.buy_order_status;
                        this.zfStatus = res.data.buy_order_pay_status;
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }

                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fhwl_list = res.data;
                    }
                });

                allStoreInfos(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.store_list = res.data.list;
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
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            //获取详情信息
            getData () {
                apiGetShipDetail(this, {
                    ship_no: this.ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data.ship_info;                 //基本信息
                        if(Cookies.get('user_no') == res.data.ship_info.create_user_no){
                            this.isCurrent = true;
                        }
                        if(this.form.order_status != -1 && this.form.order_status != 0) {
                            this.isabolish = true;
                        }
                        if(this.form.order_status == 0 && Cookies.get('user_no') == res.data.ship_info.create_user_no){
                            this.isdeleteed = true;
                            this.is_editProduct = true;
                            this.issubmit = true;
                        }else{
                            this.isdeleteed = false;
                            this.is_editProduct = false;
                            this.issubmit = false;
                        }

                        this.modifyCondition = (this.form.order_status == 2 || this.form.order_status == 4) && (Cookies.get('user_no') == res.data.ship_info.create_user_no);
                        this.form.hq = res.data.ship_list[0].product_leadtime;
                        this.actTable = [];        //列表
                        res.data.ship_list.forEach(item => {
                            this.actTable.push(item);
                        });
                        this.supplier_no = res.data.ship_info.supplier_no;
                        this.goodsAll = res.data.total_num;
//                        this.goodsAllMoney = res.data.total_price;
                        this.getCount();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            getCount () {
                this.goodsAllMoney = parseFloat(0).toFixed(4);
                for (let i in this.actTable) {
                    this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(this.actTable[i].buy_price, this.actTable[i].num), 4);
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
    };
</script>
