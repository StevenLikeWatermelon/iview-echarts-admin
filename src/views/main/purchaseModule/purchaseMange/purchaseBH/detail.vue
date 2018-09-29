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
                    <span style="font-weight:normal;float:right;" v-if="isCurrent">
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
                        <FormItem label="采购备货单编号：" style="margin:0;">
                            {{ bhd_id }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ backStatus[form.requisition_status] }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="备货仓库：" style="margin:0;">
                            <span v-if="is_edit">{{ form.requisition_store_name }}</span>
                            <Select v-model="form.requisition_store_no"  placeholder="请选择状态" @on-change="storeChange" v-else>
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ form.create_user_name }}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ form.create_time }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <span v-if="is_edit">{{ form.note }}</span>
                            <Input type="textarea" v-model="form.note" v-else style="width:50%;"></Input>
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
                    备货商品明细
                    <span style="font-weight:normal;float:right;" v-if="isCurrent">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('goodsCancel')">取消</Button>
                            <Button type="primary" @click="close('goodsSave')">保存</Button>
                        </span>
                    </span>
                </p>
               <!--  <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="cgbhdDetail_export" class="margin-left-10">导出</Button>
                    </Col>
                </Row> -->
                <div>
                    <div class="margin-bottom-10">
                        <span>备货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">备货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney| toFiexedFour }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort" max-height="570">
                        <el-table-column type="index" label="行号" fixed></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip fixed></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" sortable="custom" min-width="150" show-overflow-tooltip fixed></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="product_origin_price" label="产品面价" sortable="custom"  min-width="100">
                            <template slot-scope="scope">
                                <span>{{ (+scope.row.product_origin_price).toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product_discount" label="备货折扣" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ (+scope.row.product_discount).toFixed(3) }}</span>
                                <Input type="text" v-model="scope.row.product_discount" @on-change="scope.row.requisition_price = (scope.row.product_discount * scope.row.product_origin_price ).toFixed(4);getCount();" @on-blur="zkChange(scope.row.product_discount, scope.$index)" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_price" label="备货单价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.requisition_price }}</span>
                                <Input type="text" v-model="scope.row.requisition_price" @on-change="scope.row.product_discount=(scope.row.requisition_price/scope.row.product_origin_price).toFixed(3);getCount();" @on-blur="djChange(scope.row.requisition_price, scope.$index)" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_num" label="备货数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.requisition_num }}</span>
                                <Input type="text" v-model="scope.row.requisition_num" @on-change="getCount();" @on-blur="numChange(scope.row.requisition_num, scope.$index)" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_amount" label="备货金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                    <span>{{ scope.row.requisition_price * scope.row.requisition_num | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_num" label="已采购数量" sortable="custom"  min-width="120"></el-table-column>
                        <el-table-column prop="requisition_leadtime" label="备货货期(天)" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.requisition_leadtime }}</span>
                                <Input type="text" v-model="scope.row.requisition_leadtime" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.note }}</span>
                                <Input type="text" v-model="scope.row.note" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购合同单编号" min-width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.buy_order_nos.length == 0"></div>
                                <el-popover trigger="hover" placement="top" v-else>
                                    <p v-for="val in scope.row.buy_order_nos"><span class="pointer-hover" @click="handleClick({param: val}, 'purchase_manage_HT_detail')">{{ val }}</span></p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购员" min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}}/{{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  v-if="!edit_goods">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteRow(scope.$index, actTable.data)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <Row class="margin-top-10" v-if="!edit_goods">
                        <Col span="8" class="margin-top-10">
                        <Input type="textarea" v-model="bulktext" class="bulktext" @on-blur="isShow" @on-focus="isHidden" id="placeholderAction"></Input>
                        <div style="position: absolute;left:10px;top:10px;z-index: 0;" v-if="is_show" @click="isHidden">
                            <div style="color:#999;">批量添加订货号和备货数量/产品型号和备货数量，用空格隔开（支持从Excel复制）</div>
                            <div style="color:#999;">示例：</div>
                            <div style="color:#999;">101275386&nbsp;&nbsp;12</div>
                            <div style="color:#999;">101065317&nbsp;&nbsp;12</div>
                        </div>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                        <Button type="primary" style="margin-top:88px;" @click="bulkAdd">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                        <el-table :data="notFoundData" border stripe style="text-align: center">
                            <el-table-column label="订货号/产品型号" prop="order_no"></el-table-column>
                            <el-table-column label="失败原因" prop="reason"></el-table-column>
                            <el-table-column label="操作" prop="operate">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.operate.length == 0"></div>
                                    <el-popover trigger="click" placement="top" v-else>
                                        <p v-for="val in scope.row.operate">
                                            <span class="pointer-hover" @click="goodsChoose(val.brand_name, val.brand_no, val.product_model, val.product_model_no, val.product_name, val.product_no, val.product_order_no, val.product_origin_price, val.product_series, val.product_unit, val.requisition_num)">{{val.brand_name}}, {{val.product_order_no}}</span>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_BH_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')" v-if="is_delete">删除</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('tj')" v-if="is_tj || is_submit">提交</Button>
                <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('zf')" v-if="is_submit">作废</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sp')" v-if="is_approve">审批</Button><!---->
                <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('ht')" v-if="is_back">回退</Button>
                <Button type="primary" @click="toExport" v-auth="cgbhdDetail_export" style="margin:auto;margin-left:20px;">导出</Button>
                <Button type="primary" @click="makeBackEdit" v-if="canMakeBackEdit" style="margin:auto;margin-left:20px;">申请修改</Button>
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
    import { apiAllStatus, apiGetPurchaseBackupDetail, apiGetCommonStockList, apiGetPurchaseBackupEditBasic, apiGetPurchaseBackupEditDetail, apiGetPurchaseBackupSearch, apiGetPurchaseBackupDelete, apiGetPurchaseBackupUpdateStatus, apiInBackupName, purchaseManageApproveAction, purchaseManageGetWorkFlow,exportPurchaseBackupDetail } from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                canMakeBackEdit: 0,
                cgbhdDetail_export:'cgbhdDetail_export',
                form: {

                },
                bhd_id: this.$route.query.param,
                actTable: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
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
                isCurrent: '',
                is_delete: '',
                is_tj: '',
                is_submit: '',
                is_approve: '',
                is_back: '',
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
                fromAdd: this.$route.query.fromAdd
            };
        },
        methods: {
            makeBackEdit() {
                if (+this.canMakeBackEdit === 1) {
                    let query = {
                        param: this.$route.query.param
                    };
                    util.openNewPage(this, 'purchase_manage_make_back_edit', query);
                    this.$router.push({
                        name: 'purchase_manage_make_back_edit',
                        query
                    });
                } else {
                    this.$Message.error('已经存在处理中的采购备货申请修改单');
                }
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.backStatus = res.data.requisition_status;
                        /*当前审批人执行人*/
                        this.is_delete = this.form.create_user_no === this.current_user && this.form.requisition_status == 0;
                        isCurrentApprover(this, this.bhd_id).then(result => {
                            isTaskCreater(this, this.bhd_id).then(isTaskCreater => {
                                this.is_approve = (this.form.requisition_status == -1 || this.form.requisition_status == 1) && result && !isTaskCreater;
                                this.isCurrent = ( this.form.create_user_no === this.current_user && this.form.requisition_status == 0) || (result && this.form.requisition_status == -1 && isTaskCreater);
                                this.is_submit = isTaskCreater && this.form.requisition_status == -1 && result;
                            });
                        });
                        /*是否可创建执行人*/
                        apiInBackupName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                isInCreaters(this, modelName, 1).then(canCreater => {
                                    this.is_tj = this.form.create_user_no === this.current_user && this.form.requisition_status == 0 && canCreater;
                                });
                            }
                        });
                        isFinalApprover(this, this.bhd_id).then(result => {
                            this.is_back = this.form.requisition_status == 2 && result;
                        });
                    }
                });
            },
            getApi () {
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.storeList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.bhd_id
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            storeChange (val) {
                for (let i in this.storeList) {
                    if (this.storeList[i].ckbh === val) {
                        this.form.requisition_store_name = this.storeList[i].ckmc;
                    }
                }
            },
            isHidden () {
                this.is_show = false;
                document.getElementById('placeholderAction').firstChild.focus();

            },
            isShow () {
                if (this.bulktext === '') {
                    this.is_show = true;
                } else {
                    this.is_show = false;
                }
            },
            /*批量添加*/
            bulkAdd () {
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                let goodsVaildArr = [];
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

                goodsVaildArr = goodsVaildArr.map(item => {
                    return item.join(' ');
                });
//                goodsVaildArr = goodsVaildArr.join(',');
//                console.log(goodsVaildArr);

                apiGetPurchaseBackupSearch(this, {
                    search_products: JSON.stringify(goodsVaildArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.found.forEach(item => {
                            item.product_discount = 1.000;
                            item.requisition_price = item.product_origin_price;
                            item.requisition_leadtime = 1;
                            item.buy_num = 0;
                            for (let i = 0; i < this.actTable.data.length; i++) {
                                if (item.product_order_no === this.actTable.data[i].product_order_no && item.brand_name === this.actTable.data[i].brand_name) {
                                    item.requisition_num = this.add(this.actTable.data[i].requisition_num, item.requisition_num);
                                    item.product_discount = this.actTable.data[i].product_discount;
                                    item.requisition_price = this.actTable.data[i].requisition_price;
                                    item.requisition_leadtime = this.actTable.data[i].requisition_leadtime;
                                    item.note = this.actTable.data[i].note;
                                    this.actTable.data.splice(i, 1);
                                }
                            }
                            item.buy_order_nos = [];
                            this.actTable.data.push(item);
                        });
                        this.getCount();
                        this.bulktext = '';
                        this.is_show = true;
                        this.notFoundData = [];
                        if(res.data.not_found.length != 0){
                            for (let i in res.data.not_found) {
                                this.notFoundData.push({order_no: res.data.not_found[i], reason: '订货号/产品型号不存在', operate: ''});
                            }
                        }
                        if(res.data.more_item.length != 0){
                            for (let i in res.data.more_item) {
                                this.notFoundData.push({order_no: i, reason: '存在多条', operate: res.data.more_item[i]});
                            }
                        }
                        if (res.data.not_own_item.length != 0) {
                            for (let i in res.data.not_own_item) {
                                this.notFoundData.push({order_no: res.data.not_own_item[i], reason: '不在您的备货范围内', operate: ''});
                            }
                        }
                        if (res.data.not_has_user.length != 0) {
                            for (let i in res.data.not_has_user) {
                                this.notFoundData.push({order_no: res.data.not_has_user[i], reason: '未配置采购策略', operate: ''});
                            }
                        }
                    }
                });
            },
            goodsChoose (ppmc,ppbh, cpxh, xhbh, cpmc, cpbh, dhh, mj, ser, unit, num) {
                for (let i = 0; i < this.actTable.data.length; i++) {
                    if (dhh === this.actTable.data[i].product_order_no && ppbh === this.actTable.data[i].brand_no) {
                        this.actTable.data[i].requisition_num = this.add(this.actTable.data[i].requisition_num, num);
                        return;
                    }
                }
                this.actTable.data.push({
                    brand_name: ppmc,
                    brand_no: ppbh,
                    product_name: cpmc,
                    product_no: cpbh,
                    product_model: cpxh,
                    product_model_no: xhbh,
                    product_order_no: dhh,
                    product_unit: unit,
                    product_origin_price: mj,
                    product_discount: 1.000,
                    requisition_price: mj,
                    requisition_num: num,
                    requisition_leadtime: 1,
                    buy_num: 0,
                    note: ''
                });
            },
            toExport(){
                //基本信息
                exportPurchaseBackupDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'requisition_no': this.bhd_id
                    }))
                    
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getData () {
                //基本信息
                apiGetPurchaseBackupDetail(this, {
                    requisition_no: this.bhd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data;
                        this.current_user = Cookies.get('user_no');
                        this.actTable.data = res.data.detail;
                        // can_apply_change：是否可生成备货修改改单 0:不可，1:可以，2:提示“已经存在处理中的采购备货申请修改单”
                        // 当前登录人员是备货制单人员时且采购备货单状态 ： 已审批 状态  时显示  。  判断是否存在处理中的备货修改单（非已作废），提示：已经存在处理中的采购备货申请修改单。
                        if (res.data.requisition_status == '2') {
                            this.canMakeBackEdit = +res.data.can_apply_change;
                        } else {
                            this.canMakeBackEdit = 0;
                        }
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
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].requisition_num || this.actTable.data[i].requisition_num === ' ') {
                        this.actTable.data[i].requisition_num = 0;
                    }
                    if (!this.actTable.data[i].requisition_price || this.actTable.data[i].requisition_price === ' ') {
                        this.actTable.data[i].requisition_price = 0.00;
                    }
                    allNum = this.add(allNum, this.actTable.data[i].requisition_num);
                    allAmount = this.add(allAmount, this.multiply(this.actTable.data[i].requisition_price, this.actTable.data[i].requisition_num), 4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
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
                    apiGetPurchaseBackupEditBasic(this, {
                        requisition_no: this.bhd_id,
                        params: JSON.stringify({
                            requisition_store_no: this.form.requisition_store_no,
                            requisition_store_name: this.form.requisition_store_name,
                            note: this.form.note
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.is_edit = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.edit_goods = true;
                    this.getData();
                } else if (name === 'goodsSave') {
                    let goodsNewArr = [];
                    var reg3 = /^\d+\.?(\d{1,3})?$/;
                    var reg4 = /^\d+\.?(\d{1,4})?$/;
                    for (let i in this.actTable.data) {
                        let n = parseInt(i) + parseInt(1);
                        if (!this.actTable.data[i].product_discount || this.actTable.data[i].product_discount === '') {
                            this.$Message.error('第' + n + '行的备货折扣不能为空');
                            return false;
                        } else if (!reg3.test(this.actTable.data[i].product_discount)) {
                            this.$Message.error('第' + n + '行的备货折扣最多保留到小数后三位');
                            return false;
                        } else if (parseInt(this.actTable.data[i].product_discount * 1000) > 10000) {
                            this.$Message.error('第' + n + '行的备货折扣不能大于10');
                            return false;
                        } else if (!this.actTable.data[i].requisition_price || this.actTable.data[i].requisition_price === '') {
                            this.$Message.error('第' + n + '行的备货单价不能为空');
                            return false;
                        } else if (!reg4.test(this.actTable.data[i].requisition_price)) {
                            this.$Message.error('第' + n + '行的备货单价最多保留到小数后四位');
                            return false;
                        } else if (!this.actTable.data[i].requisition_num || this.actTable.data[i].requisition_num === '') {
                            this.$Message.error('第' + n + '行的备货数量不能为空');
                            return false;
                        } else if (!/^\d+$/.test(this.actTable.data[i].requisition_num)) {
                            this.$Message.error('第' + n + '行的备货数量必须是大于等于0的整数');
                            return false;
                        } else if (!this.actTable.data[i].requisition_leadtime || this.actTable.data[i].requisition_leadtime === '') {
                            this.$Message.error('第' + n + '行的备货货期不能为空');
                            return false;
                        } else {
                            this.actTable.data[i].requisition_amount = parseFloat(this.actTable.data[i].requisition_price * this.actTable.data[i].requisition_num).toFixed(4);
                            goodsNewArr.push(this.actTable.data[i]);
                        }
                    }
                    if (goodsNewArr.length != 0) {
                        apiGetPurchaseBackupEditDetail(this, {
                            requisition_no: this.bhd_id,
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
                    if (this.is_edit && this.edit_goods ) {
                        this.publicModal = true;
                        this.publicState = '提交';
                        this.publicCancel = 'tjcancel';
                        this.publicSure = 'tjsure';
                        this.loadding = false;
                    } else {
                        this.$Message.error('请先保存再提交');
                    }
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
                    apiGetPurchaseBackupDelete(this, {
                        requisition_no: this.bhd_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            util.openNewPage(this, 'purchase_manage_BH_index');
                            this.$router.push({
                                name: 'purchase_manage_BH_index'
                            });
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.loadding = true;
                    apiGetPurchaseBackupUpdateStatus(this, {
                        requisition_no: this.bhd_id,
                        requisition_status: '1'
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
                    apiGetPurchaseBackupUpdateStatus(this, {
                        requisition_no: this.bhd_id,
                        requisition_status: '-2'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
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
                        order_no: this.bhd_id,
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
                    apiGetPurchaseBackupUpdateStatus(this, {
                        requisition_no: this.bhd_id,
                        requisition_status: '-1'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
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
            zkChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg3 = /^\d+\.?(\d{1,3})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的备货折扣不能为空');
                } else if (parseInt(val * 1000) > 10000) {
                    this.$Message.error('第' + n + '行的备货折扣不能大于10');
                } else if (!reg3.test(val)) {
                    this.$Message.error('第' + n + '行的备货折扣最多保留到小数后三位');
                }
            },
            djChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg4 = /^\d+\.?(\d{1,4})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的备货单价不能为空');
                } else if (!reg4.test(val)) {
                    this.$Message.error('第' + n + '行的备货单价最多保留到小数后四位');
                }
            },
            numChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的备货数量必须是大于等于0的整数');
                }
            },
             //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            backTo () {
                history.go(-1);
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
