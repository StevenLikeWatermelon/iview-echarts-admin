<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                    <span style="font-weight:normal;float:right;" v-if="is_canModify">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_edit" @click="edit('basic')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('basicCancel')">取消</Button>
                            <Button type="primary" @click="close('basicSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                     <div v-if="is_edit" style="font-size:12px;">
                          <Row>
                            <Col span="8">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">盘亏出库单编号：</label>
                                    <span>{{ djbh }}</span>
                                 </div>
                            </Col>
                             <Col span="8">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">盘亏仓库：</label>
                                    <span>{{ form.store_name }}</span>
                                 </div>
                            </Col>
                            <Col span="8">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">状态：</label>
                                    <span>{{ inventoryStatus[form.inventory_status] }}</span>
                                 </div>
                            </Col>
                            <Col span="24" class="margin-top-20">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">备注：</label>
                                    <span>{{ form.note }}</span>
                                 </div>
                            </Col>
                            <Col span="8" class="margin-top-20">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">创建人：</label>
                                    <span>{{ form.create_user_name }}</span>
                                 </div>
                            </Col>
                            <Col span="8" class="margin-top-20">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">创建时间：</label>
                                    <span>{{ form.create_time }}</span>
                                 </div>
                            </Col>
                            </Row>      
                     </div>
                     <Form :label-width="120" ref="formBasic" :model="form" :rules="formRules" v-else>
                        <Row>
                            <Col span="8">
                            <FormItem label="盘亏出库单编号：" style="margin:0;">
                                {{ djbh }}
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="盘亏仓库：" style="margin:0;">
                                <span>{{ form.store_name }}</span>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="状态：" style="margin:0;">
                                {{ inventoryStatus[form.inventory_status] }}
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="备注：" style="margin:0;" prop="note">
                                <Input type="textarea" v-model="form.note" style="width:50%;"></Input>
                            </FormItem>
                            </Col>
                            <Col span="8" class="margin-top-20">
                            <FormItem label="创建人：" style="margin:0;">
                                {{ form.create_user_name }}
                            </FormItem>
                            </Col>
                            <Col span="8" class="margin-top-20">
                            <FormItem label="创建时间：" style="margin:0;">
                                {{ form.create_time }}
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    盘亏出库商品明细
                    <span style="font-weight:normal;float:right;" v-if="is_canModify">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('goodsCancel')">取消</Button>
                            <Button type="primary" @click="close('goodsSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>盘亏商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">盘亏商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney| toFiexedFour }}</em></span>
                        <span style="float:right;color: rgb(45, 140, 240);cursor:pointer;" @click="addGoods" v-if="!edit_goods&& form.inventory_status != -1">添加商品</span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位" width="80"></el-table-column>
                        <el-table-column prop="can_inventory_num" label="可盘亏数量" width="100"></el-table-column>
                        <el-table-column prop="inventory_num" label="盘亏数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.inventory_num }}</span>
                                <Input v-model="scope.row.inventory_num" @on-blur="numChange(scope.row.inventory_num, scope.row.can_inventory_num, scope.$index);" @on-change="getCount();" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inventory_price" label="盘亏单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="total_amount" label="盘亏金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.inventory_price * scope.row.inventory_num | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="area_name" label="盘亏库区"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="盘亏库位"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.note }}</span>
                                <Input v-model="scope.row.note" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  v-if="!edit_goods&&form.inventory_status != -1">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteRow(scope.$index, actTable.data)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
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
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')" v-if="is_del">删除</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('tj')" v-if="is_submit || is_show">提交</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('zf')" v-if="is_show">作废</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sp')" v-if="is_approve">审批</Button><!---->
                <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('ht')" v-if="is_back">回退</Button>
                <a :href="hrefs" target="_blank" v-if="is_print"><Button v-auth="printButton" type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;">打印 </Button></a>
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
        <!--审批弹框-->
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="sureAction('spsure')">
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100">
                        <Row>
                            <Col span="24">
                            <FormItem label="审批结果：">
                                <RadioGroup v-model="approveDetail.isPass" >
                                    <Radio label="1">同意</Radio>
                                    <Radio label="0">驳回</Radio>
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
                        <Form :model="addForm" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="addForm.brand"  placeholder="请选择"  @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="addForm.area"  placeholder="请选择" @on-change="areaChange">
                                        <Option v-for="status in areaArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.order" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="addForm.seat"  placeholder="请选择" :disabled="isDisable"  @on-change="search">
                                        <Option v-for="status in seatArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.xhbh" placeholder="请输入商品型号编号" @on-enter="search"></Input>
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
                            <Button type="primary" @click="addSure">确定</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort2"  @selection-change="handleSelectionChange">
                            <el-table-column
                                    type="selection"
                                    width="55" :selectable="canSelect" fixed>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model_no" label="商品型号编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称"  min-width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号"  min-width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号"  min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="gysmc" label="供应商"  min-width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="area_name" label="所属库区" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="change_num" label="库存数量" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="requisition_num" label="库存金额" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price * scope.row.change_num | toDecimal }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="operator_type" label="来源类型" sortable="custom" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ readyTypeArr[scope.row.operator_type] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="sell_order_no" label="采购合同单编号" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_shipstock_no" label="采购发货单编号" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_instock_no" label="采购入库单编号" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="check_instock_no" label="盘盈入库单编号" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="operator_name" label="创建人" width="120">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.operator_no  }} / {{ scope.row.operator_name }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="default" @click="goodsCancel">取消</Button>
                <!--<Button type="primary" @click="ToHTD">确定</Button>-->
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, purchaseManageGetWorkFlow, apiGetStockInventoryLossDetail, apiGetAllStorageList, operateAllBrandsList, apiGetStockInventoryLossBasicEdit, apiGetAllAreaList, apiGetAllSeatList, apiGetStockInventoryLossProEdit, apiGetStockInventoryLossDeleted, apiGetStockInventoryLossReady, purchaseManageApproveAction, apiGetStockInventoryLossStatus, apiGetStockInventoryLossModel } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, setToken } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                printButton: 'packge_loss_print_button',
                is_print: false,
                hrefs: '',
                form: {},
                djbh: this.$route.query.param,
                actTable: {
                    data: []
                },
                orderField: '',
                orderDirection: 'desc',
                backStatus: '',
                is_edit: true,
                edit_goods: true,
                goodsAll: 0,
                goodsAllMoney: 0,
                stockArr: [],
                storeList: [],
                back_store_name: '',
                bulktext: '',
                is_show: true,
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                current_user: '',
                showApprove: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                },
                approval_task: false,
                tasks: [],
                row_length: 0,
                task_now: 0,
                workFlowWidth: 100,
                notFoundData: [],
                fromAdd: this.$route.query.fromAdd,
                goodsModal: false,
                addForm: {
                    brand: 'all',
                    name: '',
                    area: 'all',
                    order: '',
                    model: '',
                    seat: 'all',
                    xhbh: ''
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                inventoryStatus: [],
                formRules: {
                    note: [{ required: true, message: '请输入备注', trigger: 'blur' }]
                },
                brandArr: [
                    {
                        value: 'all',
                        label: '请选择品牌'
                    }
                ],
                areaArr: [
                    {
                        value: 'all',
                        label: '请选择库区'
                    }
                ],
                seatArr: [
                    {
                        value: 'all',
                        label: '请选择库位'
                    }
                ],
                isDisable: true,
                readyTypeArr: [],
                readyStatusArr: [],
                is_del: '',
                is_submit: '',
                is_show: '',
                is_approve: '',
                is_back: '',
                is_canModify: ''
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['inventory_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.inventoryStatus = res.data.inventory_status;
                        let tmpObj = {};
                        this.is_del =  this.current_user === this.form.create_user_no && this.form.inventory_status == 0;
                        /*是否为盘亏出库单可创建审批人 */
                        apiGetStockInventoryLossModel(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 1).then(result => {
                                    this.is_submit = result && this.current_user === this.form.create_user_no && this.form.inventory_status == 0;
                                });
                            }
                        });
                        isCurrentApprover(this, this.djbh).then(result => {
                            isTaskCreater(this, this.djbh).then(isTaskCreater => {
                                this.is_show = this.form.inventory_status == -1 && isTaskCreater && result;
                                this.is_approve = (this.form.inventory_status == -1 || this.form.inventory_status == 1) && result && !isTaskCreater;
                                this.is_canModify = (this.form.inventory_status == 0 && this.current_user === this.form.create_user_no) || (this.form.inventory_status == -1 && result && isTaskCreater);
                            });
                        });
                       /*最终审批流执行人*/
                        isFinalApprover(this, this.djbh).then(result => {
                            this.is_back = this.form.inventory_status == 2 && result;
                        });
                    }
                });
            },
            getApi () {
                apiGetAllStorageList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.store_name;
                            item.value = item.store_no;
                            this.stockArr.push(item);
                        });
                    }
                });
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.cpppmc;
                            item.value = item.cpppbh;
                            this.brandArr.push(item);
                        });
                    }
                });
            },
            areaChange (val) {
                this.seatArr = [
                    {
                        value: 'all',
                        label: '请选择库位'
                    }
                ];
                if (val === 'all') {
                    this.isDisable = true;
                    this.addForm.seat = 'all';
                    this.search();
                } else {
                    this.isDisable = false;
                    apiGetAllSeatList(this, {
                        store_no: this.form.store_no,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.seatArr.push(item);
                            });
                            this.addForm.seat = 'all';
                            this.search();
                        }
                    });
                }
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.djbh
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            getData () {
                //基本信息
                apiGetStockInventoryLossDetail(this, {
                    inventory_no: this.djbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data.basic_info;
                        //非已作废显示打印按钮
                        if(this.form.inventory_status != -2){
                            this.is_print = true;
                        }
                        //获取跳转链接
                        this.hrefs = this.baseUrl+'/model/index?token=' + setToken() + '&inventory_no=' + this.form.inventory_no;

                        this.current_user = Cookies.get('user_no');
                        this.actTable.data = res.data.list;
                        /*获取库区列表*/
                        this.areaArr = [{
                            value: 'all',
                            label: '请选择库区'
                        }];
                        apiGetAllAreaList(this, {
                            store_no: this.form.store_no,
                            type: 1
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                res.data.forEach(item => {
                                    item.label = item.area_name;
                                    item.value = item.area_no;
                                    this.areaArr.push(item);
                                });
                            }
                        });
                        this.getCount();
                        this.getStatus();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            /*添加商品*/
            getGoods () {
                let idArr = [];
                for (let i in this.actTable.data) {
                    idArr.push(this.actTable.data[i].id);
                }
                apiGetStockInventoryLossReady(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.addForm.brand == 'all' ? '' : this.addForm.brand,
                        product_model_no: this.addForm.xhbh,
                        product_name: this.addForm.name,
                        product_model: this.addForm.model,
                        product_order_no: this.addForm.order,
                        store_no: this.form.store_no,
                        area_no: this.addForm.area == 'all' ? '' : this.addForm.area,
                        seat_no: this.addForm.seat == 'all' ? '' : this.addForm.seat,
                        num_filter: '',
                        except_stock_id: idArr,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.readyTypeArr = res.data.stock_from_type;
                        this.readyStatusArr = res.data.stock_type;
                    }
                });
            },
            addGoods () {
                this.goodsModal = true;
                this.addForm = {
                        brand: 'all',
                        name: '',
                        area: 'all',
                        order: '',
                        model: '',
                        seat: 'all',
                        xhbh: ''
                    };
                this.getGoods();
            },
            goodsCancel () {
                this.goodsModal = false;
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            addSure () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.actTable.data.push({
                            id: 0,
                            area_name: this.multipleSelection[i].area_name,
                            area_no: this.multipleSelection[i].area_no,
                            brand_name: this.multipleSelection[i].cpppmc,
                            brand_no: this.multipleSelection[i].cpppbh,
                            can_inventory_num: this.multipleSelection[i].change_num,
                            inventory_num: '',
                            inventory_price: this.multipleSelection[i].buy_price,
                            product_model: this.multipleSelection[i].cpxh,
                            product_model_no: this.multipleSelection[i].product_model_no,
                            product_name: this.multipleSelection[i].cpmc,
                            product_order_no: this.multipleSelection[i].cpdhh,
                            rel_detail_id: this.multipleSelection[i].stock_id,
                            seat_name: this.multipleSelection[i].seat_name,
                            seat_no: this.multipleSelection[i].seat_no,
                            product_unit: this.multipleSelection[i].jldw,
                            note: '',
                        });
                    }
//                    for (let i in this.goodsAddArr) {
//                        this.actTable.data.push(this.multipleSelection[i]);
//                    }
                    this.getCount();
                    this.goodsModal = false;
                }
            },
            getCount () {
                let allNum = 0;
                let allAmount = parseFloat(0).toFixed(4);
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === ' ') {
                        this.actTable.data[i].inventory_num = 0;
                    }
                    if (!this.actTable.data[i].inventory_price || this.actTable.data[i].inventory_price === ' ') {
                        this.actTable.data[i].inventory_price = 0.00;
                    }
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].inventory_num);
                    allAmount =(+allAmount  + this.actTable.data[i].inventory_price * this.actTable.data[i].inventory_num).toFixed(4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
            },
            edit (name) {
                if (name === 'basic') {
                    this.is_edit = false;
//                    this.formRules.note = [{ required: true, message: '请输入备注', trigger: 'blur' }];
                } else if (name === 'goods') {
                    this.edit_goods = false;
                }
            },
            close (name) {
                if (name === 'basicCancel') {
                    this.is_edit = true;
//                    this.formRules.note = [];
                    this.getData();
                } else if (name === 'basicSave') {
                    this.$refs.formBasic.validate((valid) => {
                        if (valid) {
                            apiGetStockInventoryLossBasicEdit(this, {
                                params: JSON.stringify({
                                    inventory_no: this.djbh,
                                    note: this.form.note
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
//                                    this.formRules.note = [];
                                    this.is_edit = true;
                                    this.getData();
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.edit_goods = true;
                    this.getData();
                } else if (name === 'goodsSave') {
                    let goodsNewArr = [];
//                    var reg4 = /^\d+\.?(\d{1,4})?$/;
                    for (let i in this.actTable.data) {
                        let n = parseInt(i) + parseInt(1);
                        if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === '') {
                            this.$Message.error('第' + n + '行的盘亏数量不能为空');
                            return false;
                        } else if (!/^\d+$/.test(this.actTable.data[i].inventory_num)) {
                            this.$Message.error('第' + n + '行的盘亏数量必须是大于等于0的整数');
                            return false;
                        } else if (parseInt(this.actTable.data[i].inventory_num) > parseInt(this.actTable.data[i].can_inventory_num) ) {
                            this.$Message.error('第' + n + '行的盘亏数量不能大于可盘亏数量');
                            return false;
                        } else {
                            goodsNewArr.push({
                                id: this.actTable.data[i].id,
                                seat_no: this.actTable.data[i].seat_no,
                                inventory_num: this.actTable.data[i].inventory_num,
                                inventory_price: this.actTable.data[i].inventory_price,
                                product_model_no: this.actTable.data[i].product_model_no,
                                brand_no: this.actTable.data[i].brand_no,
                                brand_name: this.actTable.data[i].brand_name,
                                product_name: this.actTable.data[i].product_name,
                                product_model: this.actTable.data[i].product_model,
                                product_order_no: this.actTable.data[i].product_order_no,
                                rel_detail_id: this.actTable.data[i].rel_detail_id,
                                product_unit: this.actTable.data[i].product_unit,
                                note: this.actTable.data[i].note,
                            });
                        }
                    }
                    if (goodsNewArr.length != 0) {
                        apiGetStockInventoryLossProEdit(this, {
                            inventory_no: this.djbh,
                            detail: JSON.stringify(goodsNewArr)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.edit_goods = true;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error('请添加商品');
                    }
                }
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
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    this.loadding = true;
                    apiGetStockInventoryLossDeleted(this, {
                        inventory_no: this.djbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            closeCurrentPage(this);
                            this.handleClick('', 'treasury-loss');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.loadding = true;
                   apiGetStockInventoryLossStatus(this, {
                       params: JSON.stringify({
                           inventory_no: this.djbh,
                           type : 'submit' 
                       })
                   }).then(res => {
                       if (res && res.status == 1) {
                           this.publicModal = false;
                           this.loadding = false;
                           this.edit_goods = true;
                           this.getData();
                           this.getTask();
                       } else {
                           this.$Message.error(res.message);
                       }
                   });
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                   apiGetStockInventoryLossStatus(this, {
                       params: JSON.stringify({
                           inventory_no: this.djbh,
                           type : 'invalid' 
                       })
                   }).then(res => {
                       if (res && res.status == 1) {
                           this.publicModal = false;
                           this.loadding = false;
                           this.edit_goods = true;
                           this.getData();
                           this.getTask();
                       } else {
                           this.$Message.error(res.message);
                       }
                   });
                } else if (name === 'spcancel') {
                    this.publicModal = false;
                } else if (name === 'spsure') {
                   purchaseManageApproveAction(this, {
                       order_no: this.djbh,
                       is_pass: this.approveDetail.isPass,
                       note: this.approveDetail.note
                   }).then(res => {
                       if (res && res.status == 1) {
                           this.getData();
                           this.getTask();
                       } else {
                           this.$Message.error(res.message);
                       }
                   });
                } else if (name === 'htcancel') {
                    this.publicModal = false;
                } else if (name === 'htsure') {
                    this.loadding = true;
                   apiGetStockInventoryLossStatus(this, {
                       params: JSON.stringify({
                           inventory_no: this.djbh,
                           type : 'backspace' 
                       })
                   }).then(res => {
                       if (res && res.status == 1) {
                           this.publicModal = false;
                           this.loadding = false;
                           this.edit_goods = true;
                           this.getData();
                           this.getTask();
                       } else {
                           this.$Message.error(res.message);
                       }
                   });
                }
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            numChange (val, canNum, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的盘亏数量必须是大于等于0的整数');
                } else if (parseInt(val) > parseInt(canNum)) {
                    this.$Message.error('第' + n + '行的盘亏数量不能大于可盘亏数量');

                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            search () {
                this.currentPage = 1;
                this.getGoods();
            },
            reset () {
                this.addForm.brand = 'all';
                this.addForm.name = '';
                this.addForm.area = 'all';
                this.addForm.order = '';
                this.addForm.model = '';
                this.addForm.seat = 'all';
                this.addForm.xhbh = '';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getGoods();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getGoods();
            },
            manualSort2 (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getGoods();
            },
            backTo () {
                if (this.fromAdd === 'add') {
                    closeCurrentPage(this);
                    this.handleClick('', 'treasury-loss');                
                } else {
                    history.go(-1);
                }
            }
        },
        created () {
//            this.getStatus();
            this.getApi();
            this.getData();
            this.getTask();
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
