<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ thdDetail.order_change_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据时间：" style="margin:0;">
                            {{ thdDetail.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="退货申请单编号：" style="margin:0;">
                            {{ thdDetail.rel_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售合同单编号：" style="margin:0;">
                            {{ thdDetail.sell_order_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ returnStatus[thdDetail.change_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="取消商品总额：" style="margin:0;">
                            {{ parseFloat(thdDetail.reduce_amount).toFixed(4) }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="订单金额：" style="margin:0;">
                            {{ thdDetail.ddje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="应付金额：" style="margin:0;">
                            {{ thdDetail.yfje | toDecimal }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="实付金额：" style="margin:0;">
                            {{ thdDetail.sfje | toDecimal }}
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
                            {{ khDetail.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ khDetail.lxr}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ khDetail.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ khDetail.sell_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ khDetail.sell_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ khDetail.server_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ khDetail.server_depart }}
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
                        修改商品明细
                    </p>
                    <div slot="extra" v-show="is_edit" v-auth="orderEditLimit">
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
                                <FormItem label="取消商品总数：">
                                    <span>{{returnCount.total_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="取消商品总额：">
                                    <span>{{ parseFloat(returnCount.total_amount).toFixed(4) }}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column type="index" label="行号"></el-table-column>
                            <el-table-column prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column prop="return_price" label="退货单价" sortable min-width="100"></el-table-column>
                            <!--<el-table-column prop="htsl" label="合同数量">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span> {{ parseInt(scope.row.htsl) }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column prop="num" label="可取消数量" sortable>-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span> {{ parseInt(scope.row.num) }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <el-table-column prop="change_num" label="取消数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span v-if="!isEditList"> {{ parseInt(scope.row.change_num) }}</span>
                                    <Input v-model="scope.row.change_num" v-else @on-blur="valithsl(scope.row.change_num, scope.row.num, scope.$index)" @on-change="changeAmount()"></Input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="change_amount" label="取消金额" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ (scope.row.return_price * scope.row.change_num).toFixed(4) }}</span>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_htxgd')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="canDelete" type="info" class="margin-top-10" style="margin:auto;"  @click="deleteOrder()">删除</Button>
                <Button v-if="canPush" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loading" @click="updateTH('0')">提交</Button>
                <Button v-if="canAbandon" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;"  @click="updateTH('1')">作废</Button>
                <Button v-if="canApprove" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="doApprove()">审批</Button>
                <Button v-show="canApplyReturn" type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="applyReturnMoney()" v-auth="orderEditButton">申请退款</Button>
            </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete">
            <p>确认删除该销售退货单?</p>
        </Modal>  
         <Modal v-model="showAbandon" title="确认废弃">
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
    import {apiHtxgdDetail,apiThdApproved,apiHtxgdDetailEdit, allStoreInfos, apiAllStatus, apiThdDetailBasicEdit, apiHtxgdDetailDelete, purchaseManageWorkFlow, apiHtxgdDetailUpdate, apiHtxgdDetailModalName,purchaseManageApproveAction } from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater} from '@/config/mUtils';

    export default {
        data () {
            return {
                loading: false,
                orderEditLimit: 'service_htxgd_edit',
                orderEditButton: 'service_htxgd_button',
                fromAdd: this.$route.query.fromAdd,
                ruleValidate: {
                    ddje: [
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
                thdbh: this.$route.query.param,
                thdDetail: {
                    ddje: '',
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
                    type: JSON.stringify(['change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.change_status;
                        this.getData();
                    }
                });
            },   
            changeAmount() {
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.data.forEach(item => {
                    this.returnCount.total_num +=  +item.change_num;
                    this.returnCount.total_amount +=  +(item.change_num * item.return_price);
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
                apiHtxgdDetailDelete(this, {
                    params: JSON.stringify({
                        order_change_no: this.thdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.$router.push({
                            name: 'purchase_manage_htxgd'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            updateTH(type) {
                this.typeObj = {
                    order_change_no: this.$route.query.param,
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
                }
                if (type == '1') {
                    this.showAbandon = true;
                } else {
                    this.loading = true;
                    apiHtxgdDetailUpdate(this, {
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
                apiHtxgdDetailUpdate(this, {
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
                    form_order_type: 2
                });
                this.$router.push({
                    name: 'service-xstkd-toTKD',
                    query: {
                        param: this.$route.query.param,
                        form_order_type: 2
                    }
                });
            },

            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行取消数量大于可取消数量');
                }
            },
            getData () {
                apiHtxgdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'order_change_no': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.khDetail = res.data.kh_info;
                        this.thdDetail = res.data.basic_info;
                        this.thdList.data = res.data.product_info;
                        this.changeAmount();
                        // 单据状态“待提交”，且当前登录人员为单据的创建人时展示删除；
                        this.canDelete = (res.data.basic_info.change_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no);

                        isTaskCreater(this, this.$route.query.param).then(isTaskCreater => {
                            isCurrentApprover(this, this.$route.query.param).then(isCurrent => {
                                // 单据状态“待提交”，且当前登录人员为单据创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示编辑
                                this.is_edit = ((res.data.basic_info.change_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no)) || ((res.data.basic_info.change_status == '3') && isTaskCreater && isCurrent);

                                // 单据状态“待提交”，且当前登录人员为单据的创建人且为审批任务可创建人时展示；单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示提交
                                this.getModalName().then(modalName => {
                                    isInCreaters(this, modalName, 1).then(isIn => {
                                        this.canPush = ((res.data.basic_info.change_status == '0') && (Cookies.get('user_no') === res.data.basic_info.create_user_no) && isIn) || ((res.data.basic_info.change_status == '3') && isTaskCreater && isCurrent);
                                        
                                    });
                                });

                                // 单据状态“待审批/已驳回”，且当前登录人员为单据当前待审批人且当前登录人员非任务创建人时展示审批
                                this.canApprove = ((res.data.basic_info.change_status == '1') || (res.data.basic_info.change_status == '3')) && isCurrent && !isTaskCreater;
                                // 单据状态“已驳回”，且当前登录人员为任务创建人且为审批任务当前执行人时展示废弃；
                                this.canAbandon = (res.data.basic_info.change_status == '3') && isTaskCreater && isCurrent;
                                // 单据状态“已审批”，且当前登录人员为单据创建人展示申请退款；
                                this.canApplyReturn = (res.data.basic_info.change_status == '2') && (Cookies.get('user_no') === res.data.basic_info.create_user_no);
                            });
                            
                        });     


                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            getModalName() {
                return new Promise(success => {
                    apiHtxgdDetailModalName(this, {}).then(res => {
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
                        tmp['id'] = this.thdList.data[i]['id'];
                        tmp['number'] = this.thdList.data[i]['change_num'];
                        tmp['change_num'] = this.thdList.data[i]['change_num'];
                        tmp['num'] = this.thdList.data[i]['num'];
                        if(parseInt(tmp['num']) < parseInt(tmp['change_num'])){
                            this.$Message.error('第【'+ (i+1) +'】行取消数量大于可取消数量');
                            return;
                        }
                        list.push(tmp);
                    }
                    apiHtxgdDetailEdit(this, {
                        order_change_no: this.thdDetail.order_change_no,
                        params: JSON.stringify({
                            list
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
