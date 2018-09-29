<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                    <span style="font-weight:normal;float:right;" v-show="show_edit" v-auth="qgxgdDetailLimit">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_edit" @click="edit('basic')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('basicCancel')">取消</Button>
                            <Button type="primary" @click="close('basicSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="8">
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ change_no }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ info.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ info.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <span v-if="is_edit">{{ info.note }}</span>
                            <Input type="textarea" v-model="info.note" v-else style="width:50%;"></Input>
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
                    修改请购商品明细
                    <span style="font-weight:normal;float:right;" v-show="show_edit" v-auth="qgxgdDetailLimit">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('goodsCancel')">取消</Button>
                            <Button type="primary" @click="close('goodsSave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>请购商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ cancelAll  }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="sell_order_num" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="requisition_num" label="请购数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="change_num" label="取消数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.change_num }}</span>
                                <Input type="text" v-model="scope.row.change_num" @on-blur="numChange(scope.row.change_num, scope.row.requisition_num, scope.$index)" @on-change="getCount();" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="来源单据编号" width="120">
                            <template slot-scope="scope">
                                <span  @click="handleClick({param: scope.row.rel_order_no}, 'service-sales-xsqgd-detail')" type="text" size="small">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="销售合同单编号" width="120">
                            <template slot-scope="scope">
                                <span  @click="handleClick({param: scope.row.sell_order_no}, 'service-sales-htd-detail')" type="text" size="small">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购合同单编号" width="120">
                            <template slot-scope="scope">
                                <span  @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_user_name" label="采购员" width="120"></el-table-column>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('service-sales-qgxgd')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button v-if="is_delete" type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')">删除</Button>
                <Button v-if="is_submit" type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('tj')">提交</Button>
                <Button v-if="is_invalid" type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('zf')">作废</Button>
                <Button v-if="is_approve" type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sp')">审批</Button>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import { notempty, sortBy, manualCheck,isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater} from '@/config/mUtils';
    import { apiAllStatus, saleManageRequisitionEditDetail,apiRequisitionEditDetailUpdateInfo,apiRequisitionEditDetailUpdateDetail,apiRequisitionEditDel,apiRequisitionEditUpdateStatus,purchaseManageApproveAction,purchaseManageGetWorkFlow,apiGetqgxgdModelName } from '@/config/getData';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                fromAdd: this.$route.query.fromAdd,
                form: {},
                info: {},
                change_no: this.$route.query.param,
                actTable: {
                    data: [
                        {
                            brand_name: '1239',
                            order_num: '3',
                            requsition_num: '3',
                            change_num: '0'

                        }
                    ]
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                backStatus: '',
                is_edit: true,
                is_approve: false,
                is_submit: false,
                is_invalid: false,
                is_delete: false,
                edit_goods: true,
                goodsAll: 0,
                cancelAll: 0,
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
                tasks: [
                ],
                row_length: 0,
                task_now: 1,
                workFlowWidth: 50,
                show_edit: false,
                qgxgdDetailLimit: 'service-qgxgd-detail-limit'
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify([])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.change_no
                }).then(res => {
                    if(res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            getData () {
                this.show_edit=false;
                this.is_delete=false;
                this.is_submit = false;
                this.is_invalid = false;
                this.is_approve = false;
                let argu = { change_no: this.change_no };
                saleManageRequisitionEditDetail(this, {
                    params: JSON.stringify(argu)
                }).then( res => {
                    if (res.status === 1) {
                        this.info = res.data.info;                                  
                        this.actTable.data = res.data.detail;
                        this.getCount();
                        let user_no = Cookies.get('user_no');
                        //待提交
                        if(res.data.info.change_status == 0){
                            if(user_no == res.data.info.create_user_no){
                                this.show_edit=true;
                                this.is_delete=true;
                                apiGetqgxgdModelName(this, {
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        //判断是否是任务流创建人
                                        isInCreaters(this, res.data).then(res => {
                                            if(res){
                                            this.is_submit = true;
                                            }
                                        });
                                    }else{
                                        this.$Message.error(res.message);
                                    }
                                });
                            }
                            
                        }

                        if(res.data.info.change_status == 3){//已驳回
                            isTaskCreater (this,this.change_no).then(res =>{
                                if(res){
                                      //获取模型名称
                                    isCurrentApprover(this,this.change_no).then(res => {
                                                if(res){//审批任务当前 执行人
                                                    this.show_edit = true;
                                                    this.is_submit = true;
                                                    this.is_invalid = true;
                                                }
                                    });   
                                }
                            });
                        }

                        if(res.data.info.change_status == 1 || res.data.info.change_status == 3){
                            isTaskCreater (this,this.change_no).then(res =>{
                                if(!res){
                                    //判断是否是任务流当前审批人
                                    isCurrentApprover(this, this.change_no).then(res => {
                                        if(res){
                                            if(res){
                                                this.is_approve = true;
                                            } 
                                        }
                                    });   
                                }
                            }); 
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                for (let i in this.actTable.data) {
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].requisition_num);
                    allAmount = parseInt(allAmount) + parseInt(this.actTable.data[i].change_num);
                }
                this.goodsAll = allNum;
                this.cancelAll = allAmount;
            },
            edit (name) {
                if (name === 'basic') {
                    this.is_edit = false;
                } else if (name === 'goods') {
                    this.edit_goods = false;
                }
            },
            close (name) {
                if (name === 'basicCancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'basicSave') {
                    this.is_edit = true;
                    apiRequisitionEditDetailUpdateInfo(this, {
                    params:JSON.stringify(this.notempty({
                        change_no:this.change_no,
                        note:this.info.note == ''?'':this.info.note
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.$Message.success(res.message);
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.edit_goods = true;
                    this.getData();
                } else if (name === 'goodsSave') {
                    let detail = [];
                    for (let i in this.actTable.data) {
                        let n = parseInt(i) + parseInt(1);
                        if (parseInt(this.actTable.data[i].change_num) > parseInt(this.actTable.data[i].requisition_num)) {
                            this.$Message.error('第' + n + '行的取消数量不能大于请购数量');
                            return false;
                        }

                        detail.push({id:this.actTable.data[i]['id'],change_num:this.actTable.data[i]['change_num']});
                    }
                    apiRequisitionEditDetailUpdateDetail(this, {
                    params:JSON.stringify(this.notempty({
                        change_no:this.change_no,
                        detail:detail
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.edit_goods = true;
                            this.$Message.success(res.message);
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                    
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
                }
            },
            sureAction (name) {
                if (name === 'delcancel') {
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    this.loadding = true;
                    this.publicModal = false;
                    apiRequisitionEditDel(this, {
                    params:JSON.stringify(this.notempty({
                        change_no:this.change_no
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.getTask();
                            this.publicModal = false;
                            this.loadding = false;
                            util.openNewPage(this, 'service-sales-qgxgd');
                            this.$router.push({
                                name: 'service-sales-qgxgd'
                            });
                            this.$Message.success(res.message);
                        }else{
                            this.$Message.error(res.message);
                        }
                    });


                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.loadding = true;
                    this.publicModal = false;
                    apiRequisitionEditUpdateStatus(this, {
                    params:JSON.stringify(this.notempty({
                        change_no:this.change_no,
                        change_status: 'submit'
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                            this.getTask();
                            this.$Message.success('提交成功');
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    this.publicModal = false;
                    apiRequisitionEditUpdateStatus(this, {
                    params:JSON.stringify(this.notempty({
                        change_no:this.change_no,
                        change_status: 'invalid'
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                            this.getTask();
                            this.$Message.success('作废成功');
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'spcancel') {
                    this.showApprove = false;
                } else if (name === 'spsure') {
                    this.showApprove = false;
                     purchaseManageApproveAction(this, {
                        order_no: this.change_no,
                        is_pass: this.approveDetail.isPass,
                        note: this.approveDetail.note,
                    }).then(res => {
                        this.approveDetail = {};
                        if (res && res.status == 1) {
                            this.getTask();
                            this.getData();
                            this.$Message.success('操作成功');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            numChange (m, n, index) {
                let i = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(m)) {
                    this.$Message.error('第' + i + '行的取消数量必须是大于等于0的整数');
                } else if (parseInt(m) > parseInt(n)) {
                    this.$Message.error('第' + i + '行的取消数量不能大于请购数量');
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                util.openNewPage(this, 'service-sales-qgxgd', '');
                this.$router.push({
                    name: 'service-sales-qgxgd',
                    query: ''
                });
            }
        },
        created () {
//            this.getStatus();
            // this.getApi();
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
