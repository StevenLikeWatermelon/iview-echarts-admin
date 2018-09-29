<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <div slot="extra" v-show="canEdit">
                    <span style="color: rgb(45, 140, 240);cursor: pointer;" v-show="!isEditBasic" @click="editBasic"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    <Button type="default" size="small" @click="cancelEditBasic" v-show="isEditBasic">取消</Button>
                    <Button type="primary" size="small" @click="confirmEditBasic" :loading="loading" v-show="isEditBasic">保存</Button>
                </div>
                <Form ref="formDetail" :model="formDetail" :rules="ruleValidate" :label-width="160">
                    <Row>
                        <Col span="8">
                            <FormItem label="定向价格单据编号：">
                                <span>{{formDetail.direct_order_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="单据状态：">
                                <span>{{orderStatusObj[formDetail.direct_status]}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8" v-show="!isEditBasic">
                            <FormItem label="生效时间：">
                                <span>{{formDetail.start_time}} - {{formDetail.end_time}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8" v-show="isEditBasic">
                            <FormItem label="生效时间：" prop="start_time">
                                <DatePicker type="datetimerange" placeholder="选择生效时间" :value='formDetail.validateDateRange' @on-change="getActiveTime" style="width: 100%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="客户编号：">
                                <span>{{formDetail.customer_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="客户名称：" v-show="!isEditBasic">
                                <span>{{formDetail.khmc}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="客户名称：" v-show="isEditBasic" prop="customer_no">
                                <Select v-model="formDetail.customer_no"  placeholder="请选择客户名称" filterable>
                                    <Option v-for="status in allCustomerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="备注：" v-show="!isEditBasic">
                                <span>{{formDetail.note}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="备注：" v-show="isEditBasic" prop="note">
                                <Input type="textarea" v-model="formDetail.note" style="width:100%;"></Input>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="创建人：">
                                <span>{{formDetail.create_user_no}}/{{formDetail.create_user_name}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="创建时间：">
                                <span>{{formDetail.create_time}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="审批时间：">
                                <span>{{formDetail.verify_time}}</span>
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
                    定向价格商品明细
                </p>
                <div slot="extra" v-show="canEdit">
                    <span style="color: rgb(45, 140, 240);cursor: pointer;" v-show="!isEditDetail" @click="editDetail"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    <Button type="default" size="small" @click="cancelEditDetail" v-show="isEditDetail">取消</Button>
                    <Button type="primary" size="small" @click="confirmEditDetail" :loading="loading" v-show="isEditDetail">保存</Button>
                </div>
                <div style="float:right;margin-bottom: 10px;" v-show="isEditDetail">
                    <span class="span-for-click" @click="fuzzySearch('allProducts')">添加商品</span>
                </div>
                <div>
                    <el-table :data="addDataListSingePage" border stripe style="text-align: center"  @sort-change="manualSort"  max-height="570">
                        <el-table-column show-overflow-tooltip label="行号" type="index"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品型号编号" prop="product_model_no"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="品牌" prop="cpppmc"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品名称" prop="cpmc"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品型号" prop="cpxh"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品订货号" prop="cpdhh"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="计量单位" prop="jldw"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品面价" prop="cpxhmj"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="定向折扣" prop="direct_discount"  sortable="custom">
                            <template slot-scope="scope">
                                 <Input v-model="scope.row.direct_discount" placeholder="请输入定向折扣" v-show="isEditDetail"></Input>
                                 <span  v-show="!isEditDetail">{{scope.row.direct_discount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作" prop="order_no" v-if="isEditDetail">
                            <template slot-scope="scope">
                                 <span class="pointer-hover" @click="deleteItem(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    <Row class="margin-top-10" v-show="isEditDetail">
                        <Col span="8" class="margin-top-10">
                            <Input type="textarea" v-model="bulktext" class="bulktext" :placeholder="textPlaceholder"></Input>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                            <Button type="primary" style="margin-top:88px;" @click="bulkAdd" :loading="loading">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                            <el-table :data="notFoundData" border stripe style="text-align: center" max-height="570">
                                <el-table-column show-overflow-tooltip label="订货号/产品型号" prop="product_order_no"></el-table-column>
                                <el-table-column show-overflow-tooltip label="失败原因" prop="message"></el-table-column>
                                <el-table-column show-overflow-tooltip label="模糊查询">
                                    <template slot-scope="scope" v-if="scope.row.type">
                                        <span class="span-for-click" @click="fuzzySearch(scope.row.product_order_no)">模糊查询</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <el-popover trigger="click" placement="top" v-if="scope.row.data && scope.row.data.length > 0">
                                            <p v-for="val in scope.row.data">
                                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="addToDatalist(val)">{{val.cpppmc}}, {{val.cpdhh}}</span>
                                            </p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium" style="color: rgb(45, 140, 240);">选择</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Col>
                    </Row>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="tasks.length > 0">
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
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" v-if="!isAdd" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" v-if="isAdd" @click="backToList()">返回</Button>
                <Button type="warning" v-if="canDelete" :loading="loading" style="margin-left:20px;" @click="deleteOrder">删除</Button>
                <Button type="primary" v-if="canSubmit" :loading="loading" style="margin-left:20px;" @click="updateOrder('submit')">提交</Button>
                <Button type="primary" v-if="canApprove" :loading="loading" style="margin-left:20px;" @click="showApproveModal">审批</Button>
                <Button type="primary" v-if="canAbandon" :loading="loading" style="margin-left:20px;" @click="updateOrder('invalid')">作废</Button>
            </Card>
            </Col>
        </Row>
        <Modal v-model='showAbandon' :mask-closable=false :width="300" title="确认作废">
            <p>是否确认作废单据信息？</p>
            <div slot="footer">
                <Button type="text" @click="cancelShowAbandon">取消</Button>
                <Button type="primary" :loading="loading" @click="doUpdateAction('invalid')">确定</Button>
            </div>
        </Modal>
        <Modal v-model='showDelete' :mask-closable=false :width="300" title="确认删除">
            <p>是否确认删除单据信息？</p>
            <div slot="footer">
                <Button type="text" @click="cancelShowDelete">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmDeleteOrder">确定</Button>
            </div>
        </Modal>
        <!--审批弹框-->
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="doApprove()">
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
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <orienteer-fuzzy :showFuzzy.sync="showFuzzy" :currentOrderId="currentOrderId" @addNewData="addNewFuzzyData"></orienteer-fuzzy>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, orienteeringPriceDetailApi, orienteeringPriceAddApi, apiCustomerInfoList, orienteeringPriceQueryApi, orienteeringPriceEditBasicApi, orienteeringPriceEditDetailApi,
             purchaseManageGetWorkFlow, apiOrienteeringPriceListModalName, orienteeringPriceUpdateStatusApi, orienteeringPriceDeleteApi, purchaseManageApproveAction } from '@/config/getData';
    import { sortBy, closeCurrentPage, isTaskCreater, isCurrentApprover, isInCreaters, isFinalApprover } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    import orienteerFuzzy from './orienteerFuzzy.vue';
    import pagination from '@/views/common/pagination.vue';

    export default {
        data () {
            return {
                showSpin: false,
                showFuzzy: false,
                currentOrderId: '',

                showAbandon: false,
                showDelete: false,
                showApprove: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                },
                canEdit: false,
                isEditBasic: false,
                isEditDetail: false,
                canDelete: false,
                canSubmit: false,
                canApprove: false,
                canAbandon: false,
                tasks: [],
                row_length: 0,
                task_now: 0,
                workFlowWidth: 100,
                createUserNo: Cookies.get('user_no'),
                orderId: this.$route.query.param,
                formDetail: {
                    direct_order_no: '',
                    direct_status: '',
                    start_time: '',
                    end_time: '',
                    validateDateRange: [],
                    note: '',
                    customer_no: '',
                    khmc: '',
                    create_user_no: '',
                    create_user_name: '',
                    verify_time: '',
                },
                loading: false,
                orderStatusObj: {},
                orderStatusArr: [{
                    value: 'all',
                    label: '选择单据状态'
                }],
                allCustomerArr: [],
                addDataList: [],
                addDataListSingePage: [],

                limit: 10,
                currentPage: 1,
                totalnum: 0,

                ruleValidate: {
                    customer_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    start_time: [
                        { required: true, message: '生效时间不能为空', trigger: 'blur' }
                    ]
                },
                textPlaceholder: `批量添加订货号和定向折扣/产品型号和定向折扣，用空格隔开（支持从Excel复制）
示例
RXZE1M2C 0.125
ZB2BZ101C 0.145
RXM2LB2BD 0.456`,
                notFoundData: [],
                bulktext: '',
                isAdd: +this.$route.query.fromAdd,
            };
        },
        components: {
            orienteerFuzzy,
            pagination
        },
        methods: {
            addNewIntoAllList(row) {
                this.addDataList.splice(0,0,row);
                this.getNowPage(this.currentPage);
            },
            fuzzySearch(id) {
                this.currentOrderId = id;
                this.showFuzzy = true;
            },
            addNewFuzzyData(fuzzyData) {
                fuzzyData.forEach(item => {
                    let hasExisted = false;
                    for (let i = 0; i < this.addDataList.length; i++) {
                        if (item.product_model_no == this.addDataList[i].product_model_no) {
                            hasExisted = true;
                            break;
                        }
                    }
                    if (!hasExisted) {
                        this.addNewIntoAllList(item);
                    }

                });
                this.showFuzzy = false;
            },
            getActiveTime (time) {
                this.formDetail.validateDateRange = time;
                this.formDetail.start_time = time[0] || '';
                this.formDetail.end_time = time[1] || '';
            },
            showApproveModal() {
                this.showApprove = true;
            },
            doApprove() {
                purchaseManageApproveAction(this, {
                    order_no: this.orderId,
                    is_pass: this.approveDetail.isPass,
                    note: this.approveDetail.note
                }).then(res => {
                    if (res && res.status == 1) {
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            updateOrder(status) {
                if (this.isEditDetail || this.isEditBasic) {
                    this.$Message.error('请先保存后再操作');
                    return;
                }
                if (status == 'submit') {
                    this.doUpdateAction(status);
                }
                if (status == 'invalid') {
                    this.showAbandon = true;
                }
            },
            doUpdateAction(status) {
                this.loading = true;
                orienteeringPriceUpdateStatusApi(this, {
                    params: JSON.stringify({
                        direct_order_no: this.orderId,
                        direct_status: status
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功');
                        if (status == 'invalid') {
                             this.showAbandon = false;
                        }                 
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            cancelShowAbandon() {
                this.showAbandon = false;
            },
            deleteOrder() {
                this.showDelete = true;
            },
            cancelShowDelete() {
                this.showDelete = false;
            },
            confirmDeleteOrder() {
                this.loading = true;
                orienteeringPriceDeleteApi(this, {
                    direct_order_no: this.orderId
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功');
                        this.showDelete = false;
                        this.backToList();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.orderId
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['direct_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatusObj = res.data.direct_status;
                        let tmpObj = {}; 
                        for (let key in res.data.direct_status) {
                            if (res.data.direct_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.direct_status[key]
                                };
                                this.orderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData() {
                this.showSpin = true;
                orienteeringPriceDetailApi(this, {
                    direct_order_no: this.orderId
                }).then(res => {
                    if (res && res.status == 1) {

                        this.getModalName().then(modalName => {
                            isInCreaters(this, modalName).then(isIn => {
                                isCurrentApprover(this, this.orderId).then(isCurrentApprover => {
                                    isTaskCreater(this, this.orderId).then(isTaskCreater => {
                                        // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 提交
                                        if ((+res.data.info.direct_status == 0 && this.createUserNo == res.data.info.create_user_no && isIn) || (+res.data.info.direct_status == -1 && isCurrentApprover && isTaskCreater)) {
                                            this.canSubmit = true;
                                        } else {
                                            this.canSubmit = false;
                                        }

                                        //单据状态“待提交”，且当前登录人员为单据的创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 编辑
                                        if ((+res.data.info.direct_status == 0 && this.createUserNo == res.data.info.create_user_no) || (+res.data.info.direct_status == -1 && isCurrentApprover && isTaskCreater)) {
                                            this.canEdit = true;
                                        } else {
                                            this.canEdit = false;
                                        }

                                        // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示
                                        this.canApprove = (+res.data.info.direct_status == 1 || +res.data.info.direct_status == -1) && isCurrentApprover && !isTaskCreater;

                                        // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 / 单据状态“已审批”，且当前登录人员为审批任务终审人时展示 作废
                                        isFinalApprover(this, this.orderId).then(isFinal => {
                                            if ((+res.data.info.direct_status == 2 && isFinal) || (+res.data.info.direct_status == -1 && isCurrentApprover && isTaskCreater)) {
                                                this.canAbandon = true;
                                            } else {
                                                this.canAbandon = false;
                                            }
                                        });

                                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示 删除
                                        if (+res.data.info.direct_status == 0 && this.createUserNo == res.data.info.create_user_no) {
                                            this.canDelete = true;
                                        } else {
                                            this.canDelete = false;
                                        }
                                    });
                                });
                            });
                        });
                        //基本信息
                        res.data.info.validateDateRange = [res.data.info.start_time, res.data.info.end_time];
                        this.formDetail = res.data.info;
                        // 详细信息
                        this.addDataList = res.data.detail;
                        this.getNowPage(this.currentPage);
                        // 流程表
                        this.getTask();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;

                });
            },
            editBasic() {
                this.isEditBasic = true;
            },
            cancelEditBasic() {
                this.isEditBasic = false;
                this.getData();
            },
            confirmEditBasic() {
                this.$refs['formDetail'].validate((valid) =>{
                    if (valid) {
                        this.loading = true;
                        orienteeringPriceEditBasicApi(this, {
                            params: JSON.stringify({
                                direct_order_no: this.orderId,
                                customer_no: this.formDetail.customer_no,
                                validite_time_start: this.formDetail.validateDateRange[0],
                                validite_time_end: this.formDetail.validateDateRange[1],
                                note: this.formDetail.note
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('修改成功');                     
                                this.isEditBasic = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        })
                    }   
                })
                
            },
            editDetail() {
                this.isEditDetail = true;
            },
            cancelEditDetail() {
                this.isEditDetail = false;
                this.getData();
            },
            confirmEditDetail() {
                let maxThree =  /^-?\d+(\.\d{1,3})?$/;
                for (let i = 0; i < this.addDataList.length; i++) {
                    let pageNum = Math.ceil((i + 1) / this.limit);
                    let rowIndex = (i + 1) % this.limit;
                    if (this.addDataList[i].direct_discount == '') {
                        this.$Message.error(`第${pageNum}页, 第${rowIndex}行定向折扣不能为空!`);
                        return;
                    }
                    if (+this.addDataList[i].direct_discount <= 0) {
                        this.$Message.error(`第${pageNum}页, 第${rowIndex}行定向折扣不能小于0!`);
                        return;
                    }
                    if (+this.addDataList[i].direct_discount > 1) {
                        this.$Message.error(`第${pageNum}页, 第${rowIndex}行定向折扣不能大于1!`);
                        return;
                    }
                    if (!maxThree.test(this.addDataList[i].direct_discount)) {
                        this.$Message.error(`第${pageNum}页, 第${rowIndex}行定向折扣小数点后位数不能超过3位!`);
                        return;
                    }
                }
                this.loading = true;
                orienteeringPriceEditDetailApi(this, {
                    params: JSON.stringify({
                        direct_order_no: this.orderId,
                        detail: this.addDataList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功');   
                        this.isEditDetail = false;                     
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
                
            },
            getAllcustomer() {
                apiCustomerInfoList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allCustomerArr.push({
                                value: item.khbh,
                                label: item.kh
                            });
                        });
                    }
                });
            },
            deleteItem(index) {
                for (let i = 0; i < this.addDataList.length; i++) {
                    if (this.addDataList[i].product_model_no === this.addDataListSingePage[index].product_model_no) {
                        this.addDataList.splice(i, 1);
                        break;
                    }
                }
                this.addDataListSingePage.splice(index, 1);
                this.getNowPage(this.currentPage);
            },
            /*批量添加*/
            bulkAdd () {
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                let goodsVaildArr = [];
                let arrToPost = [];
                for (let i in arrStr) {
                    arrList.push(arrStr[i].trim().replace(/\s+/g, ' ').split(' '));
                    //如果商品编号数量没填，则默认为1
                    if (arrList[i].length === 1) {
                        arrList[i][1] = 1;
                    }
                    if (arrList[i][0] !== '') {
                        goodsVaildArr.push(arrList[i]);
                    }
                }
                goodsVaildArr.forEach(item => {
                    arrToPost.push({
                        product_order_no: item[0],
                        direct_discount: item[1]
                    });
                });
                this.loading = true;
                orienteeringPriceQueryApi(this, {
                    params: JSON.stringify(arrToPost)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.successData && res.data.successData.length > 0) {
                            res.data.successData.forEach(item => {
                                let hasExisted = false;
                                for (let i = 0; i < this.addDataList.length; i++) {
                                    if (item.product_model_no == this.addDataList[i].product_model_no) {
                                        hasExisted = true;
                                        break;
                                    }
                                }
                                if (!hasExisted) {
                                    this.addNewIntoAllList(item);
                                }

                            });
                        }
                        if (res.data.failData && res.data.failData.length > 0) {
                            this.notFoundData = res.data.failData;
                        } else {
                            this.notFoundData = [];
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            addToDatalist(row) {
                let hasExisted = false;
                for (let i = 0; i < this.addDataList.length; i++) {
                    if (this.addDataList[i].product_model_no == row.product_model_no) {
                        hasExisted = true;
                        break;
                    }
                }
                if (!hasExisted) {
                    this.addNewIntoAllList(row);
                }
            },

            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.addDataListSingePage = this.addDataList.slice(_start, _end);
                this.totalnum = this.addDataList.length;
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.addDataList.sort(sortBy(column.prop, isDec));
                this.getNowPage(this.currentPage);
            },

            backTo () {
                history.go(-1);
            },
            backToList() {
                util.openNewPage(this, 'orienteering-price');
                this.$router.push({
                    name: 'orienteering-price'
                });
            },
            getModalName() {
                return new Promise(success => {
                    apiOrienteeringPriceListModalName(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {    
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },
        },
        created () {
            this.getAllcustomer();
            this.getStatus();
            this.getData();
        }
    };
</script>
