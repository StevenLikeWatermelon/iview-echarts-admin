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
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">盘盈入库单编号：</label>
                                    <span>{{ djbh }}</span>
                                 </div>
                            </Col>
                             <Col span="8">
                                <div style="margin:0;">
                                    <label style="width:120px;display: block;text-align:right;float:left;padding-right:10px;">盘盈仓库：</label>
                                    <span>{{ form.ckmc }}</span>
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
                            <FormItem label="盘盈入库单编号：" style="margin:0;">
                                {{ djbh }}
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="盘盈仓库：" style="margin:0;">
                                <span>{{ form.ckmc }}</span>
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
                    盘盈入库商品明细
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
                        <span>盘盈商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">盘盈商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney| toFiexedFour }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称"  min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位" width="100"></el-table-column>
                        <el-table-column prop="inventory_num" label="盘盈数量" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.inventory_num }}</span>
                                <Input v-model="scope.row.inventory_num" @on-blur="numChange(scope.row.inventory_num, scope.$index);" @on-change="scope.row.inventory_amount=scope.row.inventory_price*scope.row.inventory_num;getCount();" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inventory_price" label="盘盈单价" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.inventory_price }}</span>
                                <Input v-model="scope.row.inventory_price" @on-blur="priceChange(scope.row.inventory_price, scope.$index)" @on-change="scope.row.inventory_amount=scope.row.inventory_price*scope.row.inventory_num;getCount();" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inventory_amount" label="盘盈金额" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.inventory_amount | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_leadtime" label="盘盈库区" width="120" show-overflow-tooltip>
                             <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.area_name }}</span>
                                <Select v-model="scope.row.area_no" placeholder="请选择" filterable  @on-change="areaChange(scope.row.area_no, scope.$index)" v-else transfer>
                                    <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="seat_no" label="盘盈库位" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.seat_name }}</span>
                                <Select v-model="scope.row.seat_no" placeholder="请选择" filterable v-else :disabled="scope.row.isChoose" transfer>
                                    <Option v-for="status in scope.row.seatArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="edit_goods">{{ scope.row.note }}</span>
                                <Input v-model="scope.row.note" v-else></Input>
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
                            <div style="color:#999;">批量添加订货号和数量，用空格隔开（支持从Excel复制）</div>
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
                            <el-table-column label="订货号" prop="order_no"></el-table-column>
                            <el-table-column label="失败原因" prop="reason"></el-table-column>
                            <el-table-column label="操作" prop="operate">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.operate.length == 0"></div>
                                    <el-popover trigger="click" placement="top" v-else>
                                        <p v-for="val in scope.row.operate">
                                            <span class="pointer-hover" @click="goodsChoose(val.brand_name, val.product_model, val.requisition_num, val.product_origin_price, val.product_name, val.product_order_no)">{{val.brand_name}}, {{val.product_order_no}}</span>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiInventoryPrint, apiAllStatus, apiGetStockInventoryProfitDetail, purchaseManageGetWorkFlow, apiGetStockInventoryProfitInfo, apiGetStockInventoryProfitDetailUpdate, apiGetAllStorageList, apiGetAllSeatList, apiGetAllAreaList, apiGetStockInventoryProfitBeforeAdd, apiGetStockInventoryProfitDel, apiGetStockInventoryProfitStatus, purchaseManageApproveAction, apiGetStockInventoryLossModel } from '@/config/getData';
    import { notempty, sortBy, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, closeCurrentPage,setToken } from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                printButton: 'package_detail_print_button',
                is_print: false,
                hrefs: '',
                form: {

                },
                djbh: this.$route.query.param,
                actTable: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                inventoryStatus: [],
                is_edit: true,
                edit_goods: true,
                goodsAll: 0,
                goodsAllMoney: 0,
                stockArr: [],
                storeList: [],
                back_store_name: '',
                bulktext: '',
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
                formRules: {
                    note: [{ required: true, message: '请输入备注', trigger: 'blur' }]
                },
                store_no: '',
                AreaArr: [],
                seatArr: [],
                is_del: '',
                is_submit: '',
                is_show: '',
                is_approve: '',
                is_back: '',
                is_canModify: ''
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
                                isInCreaters(this, modelName, 0).then(result => {
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

                apiGetStockInventoryProfitBeforeAdd(this, {
                    search_products: JSON.stringify(goodsVaildArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.found.forEach(item => {
                            item.inventory_num = item.requisition_num;
                            item.inventory_price = '';
                            item.area_no = '';
                            item.seat_no = '';
                            item.note = '';
                            item.seatArr = [];
                            item.inventory_amount = item.inventory_price * item.inventory_num;
                            for (let i = 0; i < this.actTable.data.length; i++) {
                                if (item.product_order_no === this.actTable.data[i].product_order_no && item.brand_name === this.actTable.data[i].brand_name) {
                                    item.inventory_num = parseInt(this.actTable.data[i].inventory_num) + parseInt(item.requisition_num);
                                    item.inventory_price = this.actTable.data[i].inventory_price;
                                    item.inventory_amount = item.inventory_price * item.inventory_num;
                                    item.area_no = this.actTable.data[i].area_no;
                                    item.seat_no = this.actTable.data[i].seat_no;
                                    item.note = this.actTable.data[i].note;
                                    this.actTable.data.splice(i, 1);
                                }
                            }
                            if (item.area_no === '' || !item.area_no) {
                                item.isChoose = true;
                            } else {
                                item.isChoose = false;
                                apiGetAllSeatList(this, {
                                       store_no: this.store_no,
                                       area_no: item.area_no,
                                       type: 1
                                }).then(result => {
                                        if (result && result.status == 1) {
                                            //成功
                                            result.data.forEach(rel => {
                                                rel.label = rel.seat_name;
                                                rel.value = rel.seat_no;
                                                item.seatArr.push(rel);
                                            });
                                         }
                                });     
                            }
                            this.actTable.data.push(item);
                        });
                        this.getCount();
                        this.bulktext = '';
                        this.is_show = true;
                        this.notFoundData = [];
                        if(res.data.not_found.length != 0){
                            for (let i in res.data.not_found) {
                                this.notFoundData.push({order_no: res.data.not_found[i], reason: '订货号不存在', operate: ''});
                            }
                        }
                        if(res.data.more_item.length != 0){
                            for (let i in res.data.more_item) {
                                this.notFoundData.push({order_no: i, reason: '存在多条', operate: res.data.more_item[i]});
                            }
                        }
                        // if (res.data.not_own_item.length != 0) {
                        //     for (let i in res.data.not_own_item) {
                        //         this.notFoundData.push({order_no: res.data.not_own_item[i], reason: '不在您的备货范围内', operate: ''});
                        //     }
                        // }
                        // if (res.data.not_has_user.length != 0) {
                        //     for (let i in res.data.not_has_user) {
                        //         this.notFoundData.push({order_no: res.data.not_has_user[i], reason: '未配置采购策略', operate: ''});
                        //     }
                        // }
                    }
                });
            },
            goodsChoose (ppmc, cpxh, pysl, pyjg, cpmc, dhh) {
                for (let i = 0; i < this.actTable.data.length; i++) {
                    if (dhh === this.actTable.data[i].product_order_no && ppmc === this.actTable.data[i].brand_name) {
                        this.actTable.data[i].inventory_num = parseInt(this.actTable.data[i].inventory_num) + parseInt(pysl);
                        this.actTable.data[i].inventory_amount = this.actTable.data[i].inventory_num * this.actTable.data[i].inventory_price;
                        this.getCount();
                        return;
                    }
                }
                let moneyCal = pysl * inventory_price;
                this.actTable.data.push({
                    area_no: '',
                    brand_name: ppmc,
                    inventory_num: pysl,
                    inventory_price: '',
                    note: '',
                    product_model: cpxh,
                    product_name: cpmc,
                    product_order_no: dhh,
                    seat_no: '',
                    inventory_amount: moneyCal,
                    isChoose: true,
                    seatArr: []
                });
                this.getCount();
            },
            getData () {
                //基本信息
                apiGetStockInventoryProfitDetail(this, {
                    inventory_no: this.djbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data.info;
                        //非已作废显示打印按钮
                        if(this.form.inventory_status != -2){
                            this.is_print = true;
                        }
                        //获取跳转链接
                        this.hrefs = this.baseUrl+'/model/index?token=' + setToken() + '&inventory_no=' + this.form.inventory_no;
                        for (let j in this.stockArr) {
                            if (this.form.ckmc === this.stockArr[j].store_name) {
                                this.store_no = this.stockArr[j].store_no;
                                apiGetAllAreaList(this, {
                                    store_no: this.store_no,
                                    type: 1
                                }).then(result => {
                                    if (result && result.status == 1) {
                                        //成功
                                        this.AreaArr = [];
                                        result.data.forEach(item => {
                                            item.label = item.area_name;
                                            item.value = item.area_no;
                                           this.AreaArr.push(item);
                                        });
                                    }
                                });
                            }
                        }
                        this.current_user = Cookies.get('user_no');
                        for (let i in res.data.list) {
                            res.data.list[i].seatArr = [];
                            if (res.data.list[i].area_no === '' || !res.data.list[i].area_no) {
                                res.data.list[i].isChoose = true;
                            } else {
                                res.data.list[i].isChoose = false;
                                apiGetAllSeatList(this, {
                                    store_no: this.store_no,
                                    area_no: res.data.list[i].area_no,
                                    type: 1
                                }).then(result => {
                                    if (result && result.status == 1) {
                                        //成功
                                        res.data.list[i].seatArr = [];
                                        result.data.forEach(item => {
                                            item.label = item.seat_name;
                                            item.value = item.seat_no;
                                            res.data.list[i].seatArr.push(item);
                                        });
                                    }
                                });
                            }
                            res.data.list[i].inventory_amount = res.data.list[i].inventory_price * res.data.list[i].inventory_num;
                        }
                        this.actTable.data = res.data.list;
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
            areaChange (val, index) {
                this.actTable.data[index].isChoose = false;
                this.actTable.data[index].seat_no = '';
                apiGetAllSeatList(this, {
                    store_no: this.store_no,
                    area_no: val,
                    type: 1
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.actTable.data[index].seatArr = [];
                        res.data.forEach(item => {
                            item.label = item.seat_name;
                            item.value = item.seat_no;
                            this.actTable.data[index].seatArr.push(item);
                        });
                    }
                });
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
                    allAmount = (+allAmount  + this.actTable.data[i].inventory_price * this.actTable.data[i].inventory_num).toFixed(4);
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
                    this.$refs.formBasic.validate((valid) => {
                        if (valid) {
                            apiGetStockInventoryProfitInfo(this, {
                                params: JSON.stringify({
                                    inventory_no: this.djbh,
                                    note: this.form.note
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.formRules.note = [{ required: true, message: '请输入备注', trigger: 'blur' }];
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
                    var reg3 = /^\d+\.?(\d{1,3})?$/;
                    var reg4 = /^\d+\.?(\d{1,4})?$/;
                    for (let i in this.actTable.data) {
                        let n = parseInt(i) + parseInt(1);
                        if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === '') {
                            this.$Message.error('第' + n + '行的盘盈数量不能为空');
                            return false;
                        } else if (!/^\d+$/.test(this.actTable.data[i].inventory_num)) {
                            this.$Message.error('第' + n + '行的盘盈数量必须是大于等于0的整数');
                            return false;
                        } else if (!this.actTable.data[i].inventory_price || this.actTable.data[i].inventory_price === '') {
                            this.$Message.error('第' + n + '行的盘盈单价不能为空');
                            return false;
                        } else if (!reg4.test(this.actTable.data[i].inventory_price)) {
                            this.$Message.error('第' + n + '行的盘盈单价最多保留到小数后四位');
                             return false;
                        } else if (!this.actTable.data[i].area_no || this.actTable.data[i].area_no === '') {
                            this.$Message.error('第' + n + '行的盘盈库区不能为空');
                            return false;
                        } else if (!this.actTable.data[i].seat_no || this.actTable.data[i].seat_no === '') {
                            this.$Message.error('第' + n + '行的盘盈库位不能为空');
                            return false;
                        } else {
                            goodsNewArr.push({
                                // id: this.actTable.data[i].id,
                                seat_no: this.actTable.data[i].seat_no,
                                inventory_num: this.actTable.data[i].inventory_num,
                                inventory_price: this.actTable.data[i].inventory_price,
                                area_no: this.actTable.data[i].area_no,
                                product_order_no: this.actTable.data[i].product_order_no,
                                note: this.actTable.data[i].note,
                            });
                        }
                    }
                    if (goodsNewArr.length != 0) {
                        apiGetStockInventoryProfitDetailUpdate(this, {
                            params: JSON.stringify({
                                inventory_no: this.djbh,
                                store_no: this.store_no
                            }),
                            list: JSON.stringify(goodsNewArr)
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
                    apiGetStockInventoryProfitDel(this, {
                        inventory_no: this.djbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            closeCurrentPage(this);
                            this.handleClick('', 'packing-list');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.loadding = true;
                    apiGetStockInventoryProfitStatus(this, {
                        inventory_no: this.djbh,
                        inventory_status: '1'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.edit_goods = true;
                            this.getData();
                            this.getTask();
                        } else {
                            let mess = '';
                            if (res.message.constructor === Array) {
                                for (let i in res.message) {
                                    mess = res.message[i] + '</br>' + mess;
                                }
                            } else {
                                mess = res.message;
                            }
                            this.$Message.error({
                                content: mess,
                                duration: 5,
                                closable: true
                            });
                        }
                    });
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiGetStockInventoryProfitStatus(this, {
                        inventory_no: this.djbh,
                        inventory_status: '-2'
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
                    apiGetStockInventoryProfitStatus(this, {
                        inventory_no: this.djbh,
                        inventory_status: '-1'
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
             priceChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg4 = /^\d+\.?(\d{1,4})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的盘盈单价不能为空');
                } else if (!reg4.test(val)) {
                    this.$Message.error('第' + n + '行的盘盈单价最多保留到小数后四位');
                }
            },
            numChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的盘盈数量必须是大于等于0的整数');
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
                if (this.fromAdd === 'add') {
                    closeCurrentPage(this);
                    this.handleClick('', 'packing-list');                
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
