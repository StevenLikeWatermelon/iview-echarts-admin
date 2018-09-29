<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                    <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="edit_basic" @click="edit('basic')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    <span style="font-weight:normal;float:right;" v-if="edit_info">
                        <Button type="default" @click="close('basicCancel')">取消</Button>
                        <Button type="primary" @click="close('basicSave')">保存</Button>
                    </span>
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购入库单编号：" style="margin:0;">
                            {{ info.instock_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ instock_status[info.instock_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商：" style="margin:0;">
                            {{ info.gysmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{ info.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="入库仓库：" style="margin:0;">
                            <span>{{ info.ckmc }}</span>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="仓库地址：" style="margin:0;">
                            {{ info.dzsfmc + info.dzcsmc + info.dzxqmc + info.ckdz }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ info.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ info.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <span v-if="!edit_info"> {{ info.note }} </span>
                            <Input type="text" v-model="info.note" v-else></Input>
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
                    入库商品明细
                    <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="edit_basic2" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    <span style="font-weight:normal;float:right;" v-if="edit_goods">
                        <Button type="default" @click="close('goodsCancel')">取消</Button>
                        <Button type="primary" @click="close('goodsSave')">保存</Button>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>入库商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">入库商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                        <span style="color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="edit_goods" @click="addGoods">添加商品</span>
                    </div>
                    <div v-show="!edit_goods">
                        <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center;width:100%"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" fixed sortable="custom" min-width="120px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" fixed sortable="custom" min-width="120px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" fixed sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_price" label="采购单价" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_num" label="采购数量" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="num" label="发货数量" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip label="可入库数量" sortable="custom" v-if="edit_goods" min-width="100px">
                                <template slot-scope="scope">
                                    <span>{{ parseInt(scope.row.can_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="入库数量" sortable="custom" min-width="100px">
                                <template slot-scope="scope">
                                    <span>{{scope.row.instock_num}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpmj" label="入库金额" sortable="custom" min-width="100px">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.instock_num, scope.row.product_price, 4) }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column show-overflow-tooltip prop="area_name" label="入库库区" width="150">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.area_name }}</span>

                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位" width="150">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.seat_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单编号" width="150">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.buy_order_no, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="from_order_no" label="来源单据编号" width="120">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.from_order_no, scope.row.moudleName)">{{scope.row.from_order_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购发货单编号" width="150">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.rel_order_no, 'purchase_manage_FH_detail')" type="text" size="small">
                                    {{ scope.row.rel_order_no }}
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购员" width="150">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.buy_user_no }} / {{ scope.row.buy_user_name }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-show="edit_goods">
                        <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center;width:100%"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" fixed sortable="custom" min-width="120px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" fixed sortable="custom" min-width="120px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" fixed sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_price" label="采购单价" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_num" label="采购数量" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="num" label="发货数量" sortable="custom" min-width="100px"></el-table-column>
                            <el-table-column show-overflow-tooltip label="可入库数量" sortable="custom" v-if="edit_goods" min-width="100px">
                                <template slot-scope="scope">
                                    <span>{{ parseInt(scope.row.can_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="入库数量" sortable="custom" min-width="100px">
                                <template slot-scope="scope">
                                    <Input type="text" v-model="scope.row.instock_num" @on-change="verify(scope)"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpmj" label="入库金额" sortable="custom" min-width="100px">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.instock_num, scope.row.product_price, 4) }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column show-overflow-tooltip prop="area_name" label="入库库区" width="150">
                                <template slot-scope="scope">
                                    <Select  v-model="scope.row.area_no" placeholder="请选择"   @on-change="areaChange(scope.row.area_no, scope.$index)" transfer>
                                        <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                    </Select>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位" width="150">
                                <template slot-scope="scope">
                                    <Select v-model="scope.row.seat_no" placeholder="请选择"  :disabled="scope.row.isChoose" transfer>
                                        <Option v-for="status in scope.row.seat_list" :key="status.seat_no" :value="status.seat_no">{{ status.seat_name }}</Option>
                                    </Select>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单编号" width="150">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.buy_order_no, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="from_order_no" label="来源单据编号" width="120">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.from_order_no, scope.row.moudleName)">{{scope.row.from_order_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购发货单编号" width="150">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick(scope.row.rel_order_no, 'purchase_manage_FH_detail')" type="text" size="small">
                                    {{ scope.row.rel_order_no }}
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购员" width="150">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.buy_user_no }} / {{ scope.row.buy_user_name }}</span>
                                </template>
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
        </Row>
        <Row class="margin-top-10" v-if="approval_task">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    流程跟踪
                </p>
                <Steps :current="task_now" status="">
                    <Step :title="task.action" content="" v-for="task in tasks"></Step>
                </Steps>
                <Row class="margin-top-10">
                    <Col span="24">
                        <div v-for="task in tasks" :style="{width: workFlowWidth + '%'}" class="purchase-flow-div">
                            <p style="color:#999;">{{ task.user_name }}</p>
                            <p style="color:#999;">{{ task.time }}</p>
                            <p style="color:#999;">{{ task.note }}</p>
                        </div>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_RK_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" v-if="delete_btn" @click="modal('del')">删除</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" v-if="submit_btn" @click="modal('tj')">提交</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" v-if="abolish_btn" @click="modal('zf')">作废</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" v-if="approval_btn" @click="modal('sp')">审批</Button>
                <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" v-if="back_btn" @click="modal('ht')">回退</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
        <!--审批接口弹窗-->
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
                                    <Select v-model="formSearch.brand"  placeholder="请选择品牌" @on-change="search" filterable>
                                        <Option value="all">请选择品牌</Option>
                                        <Option v-for="status in brand_list" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.ship_no" placeholder="请输入采购发货单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
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
                        <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @selection-change="handleSelectionChange" @sort-change="manualSort1">
                            <el-table-column type="selection" width="55" :selectable="canSelect" fixed></el-table-column>


                            <el-table-column label="采购发货单编号" width="120" fixed>
                                <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.order_ship_no}, 'purchase_manage_FH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_ship_no}}</span>
                            </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位" width="100"></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="num" label="发货数量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column label="发货金额" width="120">
                                <template slot-scope="scope">
                                    <span>{{ multiply(scope.row.num, scope.row.buy_price, 4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ship_no2" label="物流单号" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="instock_num" label="已入库数量" width="100"></el-table-column>
                            <el-table-column label="状态" sortable="custom" prop="order_status">
                                <template slot-scope="scope">
                                    <span> {{ ship_status[scope.row.order_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建人" prop="create_user_no" width="120" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span> {{ scope.row.create_user_no }} / {{scope.row.create_user_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购合同单编号" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
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
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiInstockWaitList,operateAllBrandsList,apiInstockAddProduct,apiInstockDetail,apiInstockModifyInfo,apiInstockModifyList,apiInstockDelete,apiGetInstockModelName,apiInstockSubmit,apiInstockAbolish,purchaseManageApproveAction,purchaseManageGetWorkFlow,apiInstockBack,apiGetAllAreaList,apiGetAllSeatList } from '@/config/getData';
    import { notempty, sortBy, setToken, isInCreaters, isCurrentApprover, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                fromAdd: this.$route.query.fromAdd,
                approveDetail: {
                    isPass: '同意',
                },
                showApprove: false,
                publicModal: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                loadding: false,
                info: {},
                in_no: this.$route.query.param,
                actTable: {
                    data: []
                },
                instock_status: [],
                edit_goods: false,
                edit_basic: false,
                edit_basic2: false,
                edit_info: false,
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                htInfo: {
                    htId: '',
                    file: '',
                    uploadUrl: this.baseUrl + '/v1/product/brand/upload-pic?token=' + setToken()
                },
                delete_btn: false,
                submit_btn: false,
                abolish_btn: false,
                approval_btn: false,
                back_btn: false,
                model_name: '',
                approval_task: false,
                tasks: [],
                task_now: 0,
                workFlowWidth: 100,
                can_modify: false,
                AreaArr: [],
                seatArr: [],
                goodsModal:false,
                formSearch:{
                    brand:'all',
                    datetime: [],
                },
                orderData:[],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                ajaxHistoryData:[],
                brand_list: [],
                multipleSelection:[],
                supplier_no:'',
                ship_status:[],
                goodsAddArr:[],
                goods:[],
            };
        },
        components: {
            pagination
        },
        methods: {
            deleteRow (index) {
                this.actTable.data.splice(index,1);
                this.calculates();
            },
            //排序
            manualSort1 (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ajaxHistoryData.sort(sortBy(column.prop, isDec));
                if (this.totalnum < this.limit) {
                    this.orderData = this.ajaxHistoryData;
                } else {
                    this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                }
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable.data) {
                    if (row.fh_id === this.actTable.data[i].fhmx_id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            search(){
                this.currentPage = 1;
                this.multipleSelection = [];
                this.getGoods();
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].fh_id);
                    }
                    let instock_list = '';
                    instock_list = this.goodsAddArr.join(',');
                    apiInstockWaitList(this, {
                        instock_no:this.in_no,
                        ids: JSON.stringify(instock_list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            for (let i in res.data.list) {
                                res.data.list[i].seat_list = [];
                                if (res.data.list[i].area_no === '' || !res.data.list[i].area_no) {

                                    res.data.list[i].isChoose = true;
                                } else {
                                    res.data.list[i].isChoose = false;
                                    apiGetAllSeatList(this, {
                                        store_no: this.info.ckbh,
                                        area_no: res.data.list[i].area_no,
                                        type: 1
                                    }).then(result => {
                                        if (result && result.status == 1) {
                                            //成功
                                            res.data.list[i].seat_list = [];
                                            result.data.forEach(item => {
                                                item.label = item.seat_name;
                                                item.value = item.seat_no;
                                                res.data.list[i].seat_list.push(item);
                                            });
                                        }
                                    });
                                }
                            }
                            this.goods = [];
                            res.data.list.forEach(item => {
                                item.product_price = item.buy_price;
                                item.product_num = item.buy_num;
                                item.instock_num = item.now_num;
                                item.fhmx_id = item.id;
                                this.goods.push(item);
                            });
                            for (let i in this.goods) {
                                this.actTable.data.push(this.goods[i]);
                            }
                            this.calculates();
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            goodsCancel(){
                this.goodsModal = false;
            },
            reset(){
                this.formSearch.ship_no = '';                 //发货单编号
                this.formSearch.order_no = '';                //合同单编号
                this.formSearch.brand = 'all';                //品牌
                this.formSearch.product_name = '';            //产品名称
                this.formSearch.product_order_no = '';        //产品订货号
                this.formSearch.product_model = '';           //产品型号
                this.formSearch.datetime = '';                //时间
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
            datetime (time) {
                this.formSearch.datetime = time;
                this.search();
            },
            getGoods(){
                apiInstockAddProduct(this,{
                    in_no:this.in_no,
                    info: JSON.stringify(this.notempty({
                        store_no:this.info.ckbh,
                        supplier_no:this.info.gysbh,
                    })),
                    params: JSON.stringify(this.notempty({
                        ship_no: this.formSearch.ship_no,                                                         //发货单编号
                        order_no: this.formSearch.order_no,                                                       //合同单编号
                        brand: this.formSearch.brand == 'all' ? '' : this.formSearch.brand,                             //品牌
                        product_name: this.formSearch.product_name,                                               //产品名称
                        product_order_no: this.formSearch.product_order_no,                                       //产品订货号
                        product_model: this.formSearch.product_model,                                             //产品型号
                        starttime: this.formSearch.datetime[0],
                        endtime: this.formSearch.datetime[1],

                    }))
                }).then(res => {
                    this.ajaxHistoryData = res.data.list;
                    this.totalnum = res.data.totalCount;
                    if (res.data.totalCount < this.limit) {
                        this.orderData = this.ajaxHistoryData;
                    } else {
                        this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                    }
                });
            },
            addGoods() {
                this.goodsModal = true;
                this.getGoods();
            },
            areaChange (val, index) {
                if(val){
                    this.actTable.data[index].isChoose = false;
                    this.actTable.data[index].seat_no = '';

                    apiGetAllSeatList(this, {
                        store_no: this.info.ckbh,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.actTable.data[index].seat_list = [];
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.actTable.data[index].seat_list.push(item);
                            });
                        }
                    });
                }
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            confirmApprove() {
                purchaseManageApproveAction(this, {
                    order_no: this.in_no,
                    is_pass: this.approveDetail.isPass === '同意' ? 1 : 0,
                    note: this.approveDetail.note,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.getTask();
                        if(this.approveDetail.isPass === '同意'){
                            this.info.instock_status = '1';         //已审批状态
                        }else{
                            this.info.instock_status = '2';         //已驳回状态
                        }
                        this.approval_btn = false;
                        //审批按钮消失
                        this.approval_btn = false;
                        //回退按钮显示
                        isFinalApprover(this, this.in_no).then(res => {
                            if(res){
                                this.back_btn = true;
                            }
                        });
                        this.approveDetail = {};
                        this.approveDetail.isPass = '同意';
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.in_no
                }).then(res => {
                    if(res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            modal (name) {
                if (name === 'del') {
                    this.publicModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'delcancel';
                    this.publicSure = 'delsure';
                    this.loadding = false;
                } else if (name === 'tj') {
                    this.publicModal = true;
                    this.publicState = '提交';
                    this.publicCancel = 'tjcancel';
                    this.publicSure = 'tjsure';
                    this.loadding = false;
                } else if (name === 'zf') {
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'zfcancel';
                    this.publicSure = 'zfsure';
                    this.loadding = false;
                } else if (name === 'sp') {
                    this.showApprove = true;
                } else if (name === 'ht') {
                    this.publicModal = true;
                    this.publicState = '回退';
                    this.publicCancel = 'htcancel';
                    this.publicSure = 'htsure';
                    this.loadding = false;
                }
            },
            sureAction (name) {
                if (name === 'delcancel') {
                    //删除取消
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    //删除确定
                    this.loadding = true;
                    apiInstockDelete(this, {
                        in_no: this.in_no
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            util.redirectPage(this, 'purchase_manage_RK_index');
                            this.$Message.success(res.message);
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    //提交取消
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    //提交确定
                    this.loadding = true;
                    apiInstockSubmit(this, {
                        in_no: this.in_no
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getTask();
                            this.publicModal = false;
                            this.loadding = false;
                            this.info.instock_status = '4';         //待审批状态
                            this.$Message.success(res.message);
                            this.submit_btn = false;

                            this.edit_basic = false;
                            this.edit_basic2 = false;
                            this.edit_info = false;
                            this.edit_goods = false;
                            this.delete_btn = false;
                            this.abolish_btn = false;
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'zfcancel') {
                    //作废取消
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    //作废确认
                    this.loadding = true;
                    apiInstockAbolish(this, {
                        in_no: this.in_no
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getTask();
                            this.publicModal = false;
                            this.loadding = false;
                            this.info.instock_status = '-1';         //已作废状态
                            this.$Message.success(res.message);
                            //操作按钮消失
                            this.abolish_btn = false;
                            this.delete_btn = false;
                            this.submit_btn = false;
                            this.approval_btn = false;
                            this.back_btn = false;
                            //修改按钮消失
                            this.edit_basic = false;
                            this.edit_basic2 = false;
                            this.edit_info = false;
                            this.edit_goods = false;
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'spcancel') {
                    //审批取消
                    this.publicModal = false;
                } else if (name === 'spsure') {

                } else if (name === 'htcancel') {
                    //回退取消
                    this.publicModal = false;
                } else if (name === 'htsure') {
                    //回退确定
                    this.loadding = true;
                    apiInstockBack(this, {
                        in_no: this.in_no
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getTask();
                            this.loadding = true;
                            this.publicModal = false;
                            this.info.instock_status = '2';         //已驳回状态
                            this.back_btn = false;
                            this.$Message.success(res.message);
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            verify (scope) {
                let _index = scope.$index;
                let regu = /^[1-9]\d*$/;
                if (!regu.test(this.actTable.data[_index]['instock_num'])) {
                    this.actTable.data[_index]['instock_num'] = 1;
                    this.$Message.error('必须填入正整数');
                }
                if(this.actTable.data[_index]['instock_num'] > this.actTable.data[_index]['can_num']){
                    this.$Message.error('不可大于发货数量');
                }
                this.calculates();
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['instock_status','ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.instock_status = res.data.instock_status;
                        this.ship_status = res.data.ship_status;
                    }
                });
                operateAllBrandsList(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.brand_list = res.data.list;
                    }
                });
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            calculates () {
                this.goodsAll = 0;
                this.goodsAllMoney = parseFloat(0).toFixed(4);
                for(let key in this.actTable.data){
                    this.goodsAll += parseInt(this.actTable.data[key]['instock_num']);
                    this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(this.actTable.data[key].instock_num, this.actTable.data[key].product_price), 4);
                }
//                this.goodsAllMoney = this.goodsAllMoney.toFixed(4);
            },
            getData () {
                apiInstockDetail(this, {
                    in_no: this.in_no
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            switch(item.from_order) {
                                case '1':
                                    item.moudleName = 'purchase_manage_BH_detail';
                                    break;
                                case '2':
                                    item.moudleName = 'service-sales-xsqgd-detail';
                                    break;
                                default:
                                    item.moudleName = 'home_index'; //未匹配跳转首页
                            }
                        });
                        this.info = res.data.info;
                        this.actTable.data = res.data.list;

                        this.calculates();

                        apiGetAllAreaList(this, {
                            store_no: this.info.ckbh,
                            type: 1
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                this.AreaArr = [];
                                res.data.forEach(item => {
                                    item.label = item.area_name;
                                    item.value = item.area_no;
                                    this.AreaArr.push(item);
                                });
                            }
                        });

                        if(this.info.instock_status == '2'){
                            isCurrentApprover(this, this.in_no).then(res => {
                                if(res){
                                    isTaskCreater(this, this.in_no).then(task => {
                                        if(task){
                                            this.edit_basic = true;
                                            this.edit_basic2 = true;
                                        }
                                    });
                                }
                            });
                        }
                        //删除按钮是否显示
                        if(this.info.instock_status == '0' && Cookies.get('user_no') == this.info.create_user_no){
                            this.delete_btn = true;
                            this.edit_basic = true;
                            this.edit_basic2 = true;
                            //获取模型名称
                            apiGetInstockModelName(this, {

                            }).then(res => {
                                if (res && res.status == 1) {
                                    //判断是否是任务流创建人
                                    isInCreaters(this, res.data, 3).then(res => {
                                        if(res){
                                            //显示提交按钮
                                            this.submit_btn = true;
                                        }
                                    });
                                }else{
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                        //提交按钮显示逻辑二，同作废逻辑（已驳回）
                        if(this.info.instock_status == '2' && Cookies.get('user_no') == this.info.create_user_no){
                            isCurrentApprover(this, this.in_no).then(res => {
                                if(res){
                                    this.submit_btn = true;
                                    this.abolish_btn = true;
                                }
                            });
                        }
                        //审批按钮显示逻辑（已驳回，待审批）
                        if(this.info.instock_status == '2' || this.info.instock_status == '4'){
                            //当前登录人员为单据当前待审批人
                            isCurrentApprover(this, this.in_no).then(res => {
                                if(res){
                                    isTaskCreater(this, this.in_no).then(task => {
                                        if(!task){
                                            this.approval_btn = true;
                                        }
                                    });
                                }
                            });
                        }
                        //回退按钮显示逻辑（已审批）
                        if(this.info.instock_status == '1'){
                            isFinalApprover(this, this.in_no).then(res => {
                                if(res){
                                    this.back_btn = true;
                                }
                            });
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
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
            edit (name) {
                if (name === 'basic') {
                    this.edit_basic = false;
                    this.edit_info = true;
                } else if (name === 'goods') {
                    this.edit_goods = true;
                    this.edit_basic2 = false;
                }
            },
            close (name) {
                if (name === 'basicCancel') {
                    this.getData();
                    this.edit_basic = true;
                    this.edit_info = false;
                } else if (name === 'basicSave') {
                    //基本信息保存
                    apiInstockModifyInfo(this, {
                        params: JSON.stringify(this.notempty({
                            in_no: this.info.instock_no,
                            note: this.info.note
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.edit_basic = true;
                            this.edit_info = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.getData();
                    this.edit_goods = false;
                    this.edit_basic2 = true;
                } else if (name === 'goodsSave') {
                    let sett = [];
                    for(let key in this.actTable.data){
                        let tmp = {};
                        tmp['id'] = this.actTable.data[key].fhmx_id;
                        tmp['num'] = this.actTable.data[key].instock_num;
                        tmp['area_no'] = this.actTable.data[key].area_no;
                        tmp['seat_no'] = this.actTable.data[key].seat_no;
                        sett.push(tmp);
                    }
                    //发货单详情列表修改
                    apiInstockModifyList(this, {
                        in_no: this.info.instock_no,
                        data: JSON.stringify(sett)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.edit_goods = false;
                            this.edit_basic2 = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.getTask();
        },
    };
</script>
