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
                <Form ref="formDetail" :label-width="160">
                    <Row>
                        <Col span="8">
                            <FormItem label="采购备货单编号：">
                                <span>{{formDetail.rel_order_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="备货修改单编号：">
                                <span>{{formDetail.order_change_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="单据状态：">
                                <span>{{orderStatusObj[formDetail.change_status]}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="备注：" v-show="!isEditBasic">
                                <span>{{formDetail.note}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="备注：" v-show="isEditBasic">
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
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    备货修改商品明细
                </p>
                <div slot="extra" v-show="canEdit">
                    <span style="color: rgb(45, 140, 240);cursor: pointer;" v-show="!isEditDetail" @click="editDetail"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    <Button type="default" size="small" @click="cancelEditDetail" v-show="isEditDetail">取消</Button>
                    <Button type="primary" size="small" @click="confirmEditDetail" :loading="loading" v-show="isEditDetail">保存</Button>
                </div>
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <span>备货修改商品总数：</span><span style="color:#cf0012;">{{totalNum}}</span>
                        <span style="padding-left: 20px;">备货修改商品总额：</span><span style="color:#cf0012;">{{totalMoney}}</span>
                    </Col>
                </Row>
                <div>
                    <el-table :data="addDataList" border stripe style="text-align: center"  @sort-change="manualSort"  max-height="570">
                        <el-table-column show-overflow-tooltip label="行号" type="index"></el-table-column>
                        <el-table-column show-overflow-tooltip label="品牌" prop="brand_name" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品名称" prop="product_name" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品型号" prop="product_model" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="订货号" prop="product_order_no" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="计量单位" prop="product_unit" ></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品面价" prop="product_origin_price" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="备货折扣" prop="product_discount" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="备货单价" prop="requisition_price" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="备货数量" prop="requisition_num" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="可取消数量" prop="can_cancel_num" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="取消数量" prop="direct_discount" >
                            <template slot-scope="scope">
                                 <Input v-model="scope.row.cancel_num" placeholder="请输入取消数量" v-show="isEditDetail" @on-change="changeCancelAmount(scope.$index)"></Input>
                                 <span  v-show="!isEditDetail">{{scope.row.cancel_num}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="取消金额" prop="cancel_amount"></el-table-column>
                        <el-table-column show-overflow-tooltip label="货期" prop="requisition_leadtime"></el-table-column>
                        <el-table-column show-overflow-tooltip label="备注" prop="note"></el-table-column>
                        <el-table-column show-overflow-tooltip label="采购员" >
                            <template slot-scope="scope">
                                 <span>{{scope.row.buy_user}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, purchangeBackEditDetailApi, orienteeringPriceQueryApi, purchangeBackEditBasciEditApi, purchangeBackEditDetailEditApi,
             purchaseManageGetWorkFlow, purchangeBackEditModalNameApi, purchangeBackEditUpdateApi, purchangeBackEditDeleteApi, purchaseManageApproveAction } from '@/config/getData';
    import { sortBy, closeCurrentPage, isTaskCreater, isCurrentApprover, isInCreaters, isFinalApprover } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                totalNum: 0,
                totalMoney: 0,
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
                    rel_order_no: '',
                    order_change_no: '',
                    change_status: '',
                    note: '',
                },
                loading: false,
                orderStatusObj: {},
                orderStatusArr: [{
                    value: 'all',
                    label: '选择单据状态'
                }],
                addDataList: [],
                isAdd: +this.$route.query.fromAdd,
            };
        },
        methods: {
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
                purchangeBackEditUpdateApi(this, {
                    order_change_no: this.orderId,
                    type: status
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
                purchangeBackEditDeleteApi(this, {
                    order_change_no: this.orderId
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
                    type: JSON.stringify(['change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatusObj = res.data.change_status;
                        let tmpObj = {}; 
                        for (let key in res.data.change_status) {
                            if (res.data.change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.change_status[key]
                                };
                                this.orderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData() {
                purchangeBackEditDetailApi(this, {
                    order_change_no: this.orderId
                }).then(res => {
                    if (res && res.status == 1) {

                        this.getModalName().then(modalName => {
                            isInCreaters(this, modalName, 2).then(isIn => {
                                isCurrentApprover(this, this.orderId).then(isCurrentApprover => {
                                    isTaskCreater(this, this.orderId).then(isTaskCreater => {
                                        // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 提交
                                        if ((+res.data.info.change_status == 0 && this.createUserNo == res.data.info.create_user_no && isIn) || (+res.data.info.change_status == 3 && isCurrentApprover && isTaskCreater)) {
                                            this.canSubmit = true;
                                        } else {
                                            this.canSubmit = false;
                                        }

                                        //单据状态“待提交”，且当前登录人员为单据的创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 编辑
                                        if ((+res.data.info.change_status == 0 && this.createUserNo == res.data.info.create_user_no) || (+res.data.info.change_status == 3 && isCurrentApprover && isTaskCreater)) {
                                            this.canEdit = true;
                                        } else {
                                            this.canEdit = false;
                                        }

                                        // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示 审批
                                        this.canApprove = (+res.data.info.change_status == 1 || +res.data.info.change_status == 3) && isCurrentApprover && !isTaskCreater;

                                        // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示 作废
                                        isFinalApprover(this, this.orderId).then(isFinal => {
                                            if ((+res.data.info.change_status == 3 && isCurrentApprover && isTaskCreater)) {
                                                this.canAbandon = true;
                                            } else {
                                                this.canAbandon = false;
                                            }
                                        });

                                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示 删除
                                        if (+res.data.info.change_status == 0 && this.createUserNo == res.data.info.create_user_no) {
                                            this.canDelete = true;
                                        } else {
                                            this.canDelete = false;
                                        }
                                    });
                                });
                            });
                        });
                        //基本信息
                        this.formDetail = res.data.info;
                        // 详细信息
                        this.addDataList = res.data.detail;
                        this.calculateTotal();
                        // 流程表
                        this.getTask();
                    }
                });
            },
            changeCancelAmount(index) {
                this.addDataList[index].cancel_amount = this.multiply(this.addDataList[index].cancel_num, this.addDataList[index].requisition_price, 4);
                this.calculateTotal();
            },
            calculateTotal() {
                this.totalNum = 0;
                this.totalMoney = 0;
                this.addDataList.forEach(item => {
                    this.totalNum = +this.totalNum + +item.cancel_num;
                    this.totalMoney = this.add(this.totalMoney, item.cancel_amount);
                });
                this.totalMoney = this.totalMoney.toFixed(4);
            },
            editBasic() {
                this.isEditBasic = true;
            },
            cancelEditBasic() {
                this.isEditBasic = false;
                this.getData();
            },
            confirmEditBasic() {
                this.loading = true;
                purchangeBackEditBasciEditApi(this, {
                    order_change_no: this.orderId,
                    params: JSON.stringify({
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
                });
                
            },
            editDetail() {
                this.isEditDetail = true;
            },
            cancelEditDetail() {
                this.isEditDetail = false;
                this.getData();
            },
            confirmEditDetail() {
                let reg = /^(0|[1-9]\d*)$/;
                let noZero = false;
                for (let i = 0; i < this.addDataList.length; i++) {
                    if (!reg.test(this.addDataList[i].cancel_num)) {
                        this.$Message.error(`第${i + 1}行取消数量输入有误!`);
                        return;
                    }
                    if (+this.addDataList[i].cancel_num > +this.addDataList[i].can_cancel_num) {
                        this.$Message.error(`第${i + 1}行取消数量不能大于可取消数量!`);
                        return;
                    }
                    if (+this.addDataList[i].cancel_num > 0) {
                        noZero = true;
                    }
                }
                if (!noZero) {
                    this.$Message.error('取消数量不能全部为0!');
                    return;
                }
                let tmpArr = [];
                this.addDataList.forEach(item => {
                    tmpArr.push({
                        cancel_num: +item.cancel_num,
                        detail_id: item.id,
                    });
                });


                this.loading = true;
                purchangeBackEditDetailEditApi(this, {
                    order_change_no: this.orderId,
                    params: JSON.stringify(tmpArr)
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
            deleteItem(index) {
                this.addDataList.splice(index, 1);
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.addDataList.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            backToList() {
                util.openNewPage(this, 'purchase_manage_BH_edit_index');
                this.$router.push({
                    name: 'purchase_manage_BH_edit_index'
                });
            },
            getModalName() {
                return new Promise(success => {
                    purchangeBackEditModalNameApi(this, {}).then(res => {
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
            this.getStatus();
            this.getData();
        }
    };
</script>
