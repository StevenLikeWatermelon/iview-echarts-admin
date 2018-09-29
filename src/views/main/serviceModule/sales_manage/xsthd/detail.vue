<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
    .service-return .ivu-input {
        height: 30px;
    }
</style>
<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <div slot="extra" v-show="is_edit" v-auth="xsthdDetailLimit">
                    <a @click="editAllBasic()" v-show="!isEditBasic">
                        <Icon type="edit"></Icon>
                        编辑
                    </a>
                    <a @click="saveEdit()" v-show="isEditBasic">
                        <Icon type="checkmark"></Icon>
                        保存
                    </a>
                    <a @click.prevent="cancelEdit" v-show="isEditBasic" style="margin-left: 15px;">
                        <Icon type="close"></Icon>
                        取消
                    </a>
                </div>                   
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="销售退货单编号：" style="margin:0;">
                            {{ thdDetail.return_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货申请单编号：" style="margin:0;">
                            {{ thdDetail.return_apply_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ thdDetail.sell_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ returnStatus[thdDetail.return_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货总额：" style="margin:0;">
                            {{ parseFloat(thdDetail.return_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="其他金额：" style="margin:0;">
                            {{ thdDetail.other_amount | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="其他金额：" style="margin:0;" prop="other_amount">
                            <Input v-model="thdDetail.other_amount" placeholder="请输入其他金额"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应退金额：" style="margin:0;">
                            {{ parseFloat(thdDetail.must_total).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售人员：" style="margin:0;">
                            {{ thdDetail.seller }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售部门：" style="margin:0;">
                            {{ thdDetail.seller_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服人员：" style="margin:0;">
                            {{ thdDetail.server }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服部门：" style="margin:0;">
                            {{ thdDetail.server_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="退货仓库：" style="margin:0;">
                            {{ thdDetail.return_store }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="退货仓库：" style="margin:0;" prop="return_store_no">
                            <Select v-model="thdDetail.return_store_no" filterable>
                                <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="退货物流：" style="margin:0;">
                            {{ fhwlStatus[thdDetail.return_shipping] }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="退货物流：" style="margin:0;" prop="return_shipping">
                            <Select v-model="thdDetail.return_shipping" filterable>
                                <Option v-for="item in fhwlStatusArr" :value="item.fhwlbh" :key="item.fhwlbh">{{ item.fhwlmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;">
                            {{ thdDetail.return_ship_no }}
                        </FormItem>
                        </Col>
                        <Col span="6" v-show="isEditBasic">
                        <FormItem label="快递单号：" style="margin:0;" prop="return_ship_no">
                            <Input v-model="thdDetail.return_ship_no" placeholder="请输入快递单号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="退货原因：" style="margin:0;">
                            {{ thdDetail.note }}
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
                    客户信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ khDetail.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.yhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.xsbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.kf }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.kfbm }}
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
                    <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="xsthdDetail_export" class="margin-left-10">导出</Button>
                    </Col>
                    </Row>
                    <div slot="extra" v-show="is_edit" v-auth="xsthdDetailLimit">
                        <a @click="edit('thmx')" v-show="!isEditList">
                            <Icon type="edit"></Icon>
                            编辑
                        </a>
                        <a @click="close('thmxsave')" v-show="isEditList">
                            <Icon type="checkmark"></Icon>
                            保存
                        </a>
                        <a  @click="close('thmxcancel')" v-show="isEditList" style="margin-left: 15px;">
                            <Icon type="close"></Icon>
                            取消
                        </a>
                    </div>                     
                    <Row class="special-return-detail">
                        <Form>
                            <Col span="6">
                                <FormItem label="退货商品总数：">
                                    <span>{{returnCount.total_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="退货商品总额：">
                                    <span>{{ parseFloat(returnCount.total_amount).toFixed(4) }}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="100" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="order_price" label="退货单价" sortable min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="order_num" label="合同数量">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.order_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="isEditList" show-overflow-tooltip prop="can_return_num" label="可退数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.can_return_num) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="return_num" label="本次退货数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span v-if="!isEditList"> {{ parseInt(scope.row.return_num) }}</span>
                                    <Input v-model="scope.row.return_num" v-else @on-blur="valithsl(scope.row.return_num, scope.row.can_return_num, scope.$index)" @on-change="changeAmount()"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="returnPrice" label="退货金额">
                                <template slot-scope="scope">
                                    <span> {{ (scope.row.order_price * scope.row.return_num).toFixed(4) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </Card>
            </Col>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('service-sales-thd')">返回</Button>
                <Button type="primary" v-if="!fromAdd || fromxshtd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="info" class="margin-top-10" style="margin:auto;"  @click="deleteOrder()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-show="canReturnStore" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="applyReturnStore()" v-auth="xsthdDetailLimit">申请退货入库单</Button>
                <Button v-show="canApplyReturn" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="applyReturnMoney()" v-auth="xsthdDetailLimit">申请退款</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete">
            <p>确认删除该销售退货单?</p>
        </Modal>  
         <Modal v-model="showAbandon" title="确认废弃" >
            <p>确认废弃该销售退货单?</p>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import util from '@/libs/util';
    import {apiThdDetailNew,apiThdApproved,apiThdReturnNew, allStoreInfos, apiAllStatus, apiThdDetailBasicEdit, apiThdReturnDeleteNew, purchaseManageWorkFlow, serviceManageTHUpdate, ServiceTHModelName,purchaseManageApproveAction, apiSendLogistic,exportThdDetailNew } from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater} from '@/config/mUtils';

    export default {
        data () {
            return {
                loading: false,
                xsthdDetail_export:'xsthdDetail_export',
                fhwlStatus:{},
                fromAdd: this.$route.query.fromAdd,
                fromxshtd: this.$route.query.fromxshtd,
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
                        { required: true, message: '退货仓库不能为空', trigger: 'blur' }
                    ]
                },  
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                storageList: [],   
                fhwlStatusArr: [],  
                thdbh: this.$route.query.param,
                thdDetail: {
                    other_amount: '',
                    return_store_no: '',
                    return_shipping: '',
                    return_ship_no: ''
                },
                khDetail: {},
                is_edit: false,
                isEditBasic: false,
                isEditList: false,
                returnStatus: {},
                thdList: {
                    title: [],
                    data: []
                },
                showDelete: false,
                canDelete: false,
                canReturnStore: false,
                canPush:false,
                canAbandon: false,
                canApprove: false,
                canApplyReturn: false,
                typeObj: {},
                showAbandon: false,
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                xsthdDetailLimit: 'service-xsthd-detail-limit'
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_return_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_return_status;
                        this.getAllStoreInfos();
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fhwlStatusArr = res.data;
                        this.fhwlStatus = {};
                        for (let i in res.data) {
                            this.fhwlStatus[res.data[i].fhwlbh] = res.data[i].fhwlmc; 
                        } 
                    }
                });
            },   
            changeAmount() {
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.data.forEach(item => {
                    this.returnCount.total_num +=  +item.return_num;
                    this.returnCount.total_amount +=  +(item.return_num * item.order_price);
                });
                this.returnCount.total_num =this.returnCount.total_num.toFixed(0);
                this.returnCount.total_amount = this.returnCount.total_amount.toFixed(4);
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
            editAllBasic() {
                this.isEditBasic = true;
            },
            cancelEdit() {
                this.isEditBasic = false;
                this.getData();
            },
            saveEdit() {
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        apiThdDetailBasicEdit(this, {
                            params: JSON.stringify(this.thdDetail)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                this.isEditBasic = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                        
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                })
            },
            deleteOrder() {
                this.showDelete = true;
            },
            confirmDelete() {
                apiThdReturnDeleteNew(this, {
                    params: JSON.stringify({
                        return_no: this.thdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.$router.push({
                            name: 'service-sales-thd'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            updateTH(type) {
                this.typeObj = {
                    return_no: this.$route.query.param,
                    return_status: ''
                };
                let typeName = '';
                switch(type) {
                    case '0':
                        this.typeObj.return_status = 'submit';
                        typeName = '提交';
                        break;
                    case '1':
                        this.typeObj.return_status = 'invalid';
                        typeName = '废弃';
                        break;         
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    serviceManageTHUpdate(this, {
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
            cancelAbandon() {
                this.showAbandon = false;
            },
            confirmAbandon() {
                this.loading = true;
                serviceManageTHUpdate(this, {
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
            applyReturnMoney () {
                util.openNewPage(this, 'service-xstkd-toTKD', {
                    param: this.$route.query.param,
                    form_order_type: 1
                });
                this.$router.push({
                    name: 'service-xstkd-toTKD',
                    query: {
                        param: this.$route.query.param,
                        form_order_type: 1
                    }
                });
            },
            applyReturnStore () {
                this.$router.push({
                    name: 'service-xsthd-makeInStore',
                    query: {
                        param: this.$route.query.param
                    }
                });
            },

            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行退货数量大于可退货数量');
                }
            },
            toExport(){
                exportThdDetailNew(this, {
                    params: JSON.stringify(this.notempty({
                        'return_no': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        //成功
                    }
                });
            },
            getData () {
                apiThdDetailNew(this, {
                    params: JSON.stringify(this.notempty({
                        'return_no': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.custom;
                        this.thdDetail = res.data.info;
                        // res.data.detail.forEach(item => {
                        //     item.return_num = 0;
                        //     item.returnPrice = 0;
                        // });
                        this.thdList.data = res.data.detail;
                        this.changeAmount();
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.info.return_status == '0') && (Cookies.get('user_no') === res.data.info.create_user_no);
                        // 单据状态“已完成/待退款”，且当前登录人员为单据的创建人展示申请入库；
                        this.canReturnStore = (res.data.info.return_status == '3' || res.data.info.return_status == '4') && (Cookies.get('user_no') === res.data.info.create_user_no);
                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示编辑
                                this.is_edit = ((res.data.info.return_status == '0') && (Cookies.get('user_no') === res.data.info.create_user_no)) || ((res.data.info.return_status == '-1') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName).then(isIn => {
                                        this.canPush = ((res.data.info.return_status == '0') && (Cookies.get('user_no') === res.data.info.create_user_no) && isIn) || ((res.data.info.return_status == '-1') && isTaskCreater && isCurrent);
                                        
                                    });
                                });

                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.info.return_status == 1) || (res.data.info.return_status == '-1')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.info.return_status == -1) && isTaskCreater && isCurrent;
                                // 单据状态“已完成”，且当前登录人员为单据创建人展示申请退款；
                                this.canApplyReturn = (res.data.info.return_status == 4) && (Cookies.get('user_no') === res.data.info.create_user_no);
                            });
                            
                        });     


                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            getModalName() {
                return new Promise(success => {
                    ServiceTHModelName(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {    
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },            
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            /*修改*/
            edit (name) {
                if (name === 'thmx') {
                    this.isEditList = true;
                }
            },
            close (name) {
                if (name === 'thmxcancel') {
                    this.isEditList = false;
                    this.getData();
                } else if (name === 'thmxsave') {
                    let list = [];
                    for(let i = 0; i < this.thdList.data.length; i++){
                        let tmp = {};
                        tmp['order_detail_id'] = this.thdList.data[i]['order_detail_id'];
                        tmp['return_num'] = this.thdList.data[i]['return_num'];
                        tmp['can_return_num'] = this.thdList.data[i]['can_return_num'];

                        if(parseInt(tmp['can_return_num']) < parseInt(tmp['return_num'])){
                            this.$Message.error('第【'+ (i+1) +'】行退货数量大于可退货数量');
                            return;
                        }
                        list.push(tmp);
                    }
                    let allZero = true;
                    list.forEach(item => {
                        if (+item.return_num != 0) {
                            allZero = false;
                        }
                    });
                    if (allZero) {
                        this.$Message.error('保存的退货数量不能都为0');
                        return;
                    }
                    apiThdReturnNew(this, {
                        params: JSON.stringify({
                            return_no: this.thdDetail.return_no,
                            details: list
                        })
                    }).then(res => {
                        if(res && res.status == 1){
                            this.$Message.success(res.message);
                            this.isEditList = false;
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            }
        },
        created () {
            this.getStatus();
            this.getWorkFlow();
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
