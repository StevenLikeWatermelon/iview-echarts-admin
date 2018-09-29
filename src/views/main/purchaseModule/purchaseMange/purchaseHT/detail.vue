<style>
    #buy_toHT .ivu-modal-footer {
        display:none;
    }
</style>
<template>
    <div>
        <Tabs :animated="false" @on-click="tabDetail" v-model="changeTab">
            <TabPane label="合同单详情" name="tab0">
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
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购合同单编号：" style="margin:0;">
                                    {{ htd_id }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="单据状态：" style="margin:0;">
                                    {{ djStatus[form.order_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="付款状态：" style="margin:0;">
                                    {{ zfStatus[form.pay_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="发货状态：" style="margin:0;">
                                    {{ fhStatus[form.ship_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="供应商：" style="margin:0;">
                                    <span v-if="is_edit">{{ form.gysmc }}</span>
                                    <Select v-model="form.supplier_no"  placeholder="请选择" @on-change="gysChoose" filterable v-else>
                                        <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="供应商联系人：" style="margin:0;">
                                    <span v-if="is_edit">{{ form.gyslxr }}</span>
                                    <Input v-model="form.gyslxr"  placeholder="请填写供应商联系人" v-else disabled="true"></Input>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="供应商联系方式：" style="margin:0;">
                                    <span v-if="is_edit">{{ form.gyslxhm }}</span>
                                    <Input v-model="form.gyslxhm"  placeholder="请填写供应商联系方式" v-else disabled="true"></Input>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="发票类型：" style="margin:0;">
                                    <span v-if="is_edit">{{ fplx[form.invoice_type] }}</span>
                                    <Select v-model="form.invoice_type"  placeholder="请选择" v-else>
                                        <Option v-for="status in fplxArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="税率：" style="margin:0;">
                                    <span v-if="is_edit">{{ form.buy_tax_rate * 100 + '%' }}</span>
                                    <Select v-model="form.buy_tax_rate"  placeholder="请选择税率" v-else>
                                        <Option v-for="status in tax" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="到货仓库：" style="margin:0;" prop="ckbh">
                                    <span v-if="is_edit">{{ form.ckmc }}</span>
                                    <Select v-model="form.ckbh"  placeholder="请选择" @on-change="stockChoose" filterable  v-else>
                                        <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="24" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="备注：" style="margin:0;">
                                    <span v-if="is_edit">{{ form.note }}</span>
                                    <Input type="textarea" v-model="form.note" v-else style="width:50%;"></Input>
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="创建人：" style="margin:0;">
                                    {{ form.create_user_name }}
                                </FormItem>
                                </Col>
                                <Col span="8" :class="is_edit ? '' : 'margin-top-20'">
                                <FormItem label="创建时间：" style="margin:0;">
                                    {{ form.create_time }}
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
                            合同信息
                            <span style="font-weight:normal;float:right;" v-if="isCurrent">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_htxx" @click="edit('htxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('htxxCancel')">取消</Button>
                            <Button type="primary" @click="close('htxxSave')">保存</Button>
                        </span>
                    </span>
                        </p>
                        <div>
                            <div v-if="is_htxx" style="font-size:12px;">
                                <Row>
                                    <Col span="8">
                                    <div style="margin:0;">
                                        <label style="width:150px;display: block;text-align:right;float:left;padding-right:10px;">纸质合同编号：</label>
                                        <span>{{ htInfo.htId }}</span>
                                    </div>
                                    </Col>
                                    <Col span="16">
                                    <div style="margin:0;">
                                        <label style="width:150px;display: block;text-align:right;float:left;padding-right:10px;">纸质合同：</label>
                                        <span v-if="is_htxx">
                                            <a v-if="htInfo.file" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.file" target="_blank">
                                                <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件：{{htInfo.htName}}.{{htInfo.ext}}
                                            </a>
                                        <span v-else></span>
                            </span>
                                    </div>
                                    </Col>
                                </Row>
                            </div>
                            <Form :label-width="120" :model="htInfo" ref="htInfoForm" v-else>
                                <Row>
                                    <Col span="6">
                                    <FormItem label="纸质合同编号：" style="margin:0;">
                                        <Input v-model="htInfo.htId"  placeholder="请选择纸质合同编号"></Input>
                                    </FormItem>
                                    </Col>
                                    <Col span="18">
                                    <FormItem label="纸质合同：" style="margin:0;">
                                        <div>
                                            <Upload :action="htInfo.uploadUrl"
                                                    :format="['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'rar', 'xls', 'xlsx']"
                                                    :on-format-error="handleFormatError"
                                                    :on-success="handleSuccess"
                                                    :max-size="10240" :on-exceeded-size="handleMaxSize"
                                                    :show-upload-list="false" style="display: block;width:100%;">
                                                <Button type="default" icon="ios-cloud-upload-outline">上传文件</Button>
                                            </Upload>
                                            <a v-if="htInfo.file" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.file" target="_blank">
                                                <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件: {{htInfo.name}}
                                            </a>
                                        </div>
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
                            采购商品明细
                            <span style="font-weight:normal;float:right;" v-if="isCurrent">
                        <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span v-else>
                            <Button type="default" @click="close('goodsCancel')">取消</Button>
                            <Button type="primary" @click="close('goodsSave')">保存</Button>
                        </span>
                    </span>
                        </p>
                        <div>
                            <div class="margin-bottom-10">
                                <span>采购商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                                <span class="margin-left-20">采购商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney | toFiexedFour }}</em></span>
                                <span class="margin-left-20">采购商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllWS | toFiexedFour }}</em></span>
                                <span class="margin-left-20">采购商品总税额： <em style="color:#cf0012;font-style: normal;">{{ goodsAlltax | toFiexedFour }}</em></span>
                                <span style="color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="!edit_goods" @click="addGoods">添加商品</span>
                            </div>
                            <!-- 非修改状态 -->
                            <div v-show="edit_goods">
                                <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  max-height="570"  @sort-change="manualSort" >
                                    <el-table-column type="index" label="行号" fixed></el-table-column>
                                    <el-table-column prop="brand_name" label="品牌" fixed show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_name" label="产品名称" width="150" sortable="custom" fixed show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_model" label="产品型号"  width="150" sortable="custom" fixed show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_order_no" label="订货号" width="120" sortable="custom" fixed show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                                    <el-table-column prop="requisition_price" label="申请单价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="requisition_num" label="申请数量" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="product_origin_price" label="产品面价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="product_discount" label="采购折扣" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="buy_cost_price" label="未税单价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="buy_num" label="采购数量" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="cgje" label="采购金额" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="wsje" label="未税金额" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="tax_amount" label="税额" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="buy_leadtime" label="采购货期(天)" width="120"></el-table-column>
                                    <el-table-column prop="expect_leadtime" label="预计到货日期" width="120"></el-table-column>
                                    <el-table-column prop="note" label="备注" width="120" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="from_order_no" label="来源单据编号" width="120"></el-table-column>
                                    <el-table-column prop="make_user" label="来源单据创建人" width="160">
                                        <template slot-scope="scope">
                                            <span>
                                                <span >{{ scope.row.make_user_no }}</span>
                                                <span v-show="scope.row.make_user_no != '' && scope.row.make_user_name != ''">/</span>
                                                <span v-show='scope.row.make_user_name != 0'>{{ scope.row.make_user_name }}</span>
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <!-- 修改状态 -->
                            <div v-show="!edit_goods">
                                <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort">
                                    <el-table-column type="index" label="行号" fixed></el-table-column>
                                    <el-table-column prop="brand_name" label="品牌" fixed show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_name" label="产品名称" fixed sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_model" label="产品型号" fixed sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_order_no" label="订货号" fixed sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                                    <el-table-column prop="requisition_price" label="申请单价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="requisition_num" label="申请数量" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="product_origin_price" label="产品面价" sortable="custom" width="100"></el-table-column>
                                    <el-table-column prop="flag_discount" label="参考折扣" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <span>
                                                <span v-show='scope.row.discount_min != 0'>{{ scope.row.discount_min }}</span>
                                                <span v-show='scope.row.discount_min != 0 && scope.row.discount_max != 0'>-</span>
                                                <span v-show='scope.row.discount_max != 0'>{{ scope.row.discount_max }}</span>
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="product_discount" label="采购折扣" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <Input type="text" v-model="scope.row.product_discount" @on-change="scope.row.buy_price = multiply(scope.row.product_discount, scope.row.product_origin_price, 4);scope.row.cgje = multiply(scope.row.buy_price, scope.row.buy_num, 4);scope.row.wsje = multiply(divide(scope.row.buy_price, taxRate, 4), scope.row.buy_num, 4);scope.row.tax_amount = subtract(scope.row.cgje, scope.row.wsje, 4); getCount(); " @on-blur="zkChange(scope.row.product_discount, scope.$index)"></Input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <Input type="text" v-model="scope.row.buy_price" @on-change="scope.row.product_discount = divide(scope.row.buy_price, scope.row.product_origin_price, 3);scope.row.cgje = multiply(scope.row.buy_price, scope.row.buy_num, 4);scope.row.wsje = multiply(divide(scope.row.buy_price, taxRate, 4), scope.row.buy_num, 4);scope.row.tax_amount = subtract(scope.row.cgje, scope.row.wsje, 4); getCount();" @on-blur="djChange(scope.row.buy_price, scope.$index)"></Input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="buy_cost_price" label="未税单价" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ divide(scope.row.buy_price, taxRate, 4) }}</span>
                                        </template>
                                    </el-table-column>
                                    <!-- <el-table-column prop="buyed_num" label="已采购数量" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.buyed_num }}</span>
                                        </template>
                                    </el-table-column> -->
                                    <el-table-column prop="buy_num" label="采购数量" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <Input type="text" v-model="scope.row.buy_num" @on-blur="cgNum(scope.row.requisition_num, scope.row.buyed_num, scope.row.buy_num, scope.$index)" @on-change="changeNumNew(scope,scope.$index)"></Input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="cgje" label="采购金额" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.cgje | toDecimal }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="wsje" label="未税金额" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.wsje | toDecimal }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="tax_amount" label="税额" sortable="custom" width="100">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.tax_amount | toDecimal }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="buy_leadtime" label="采购货期(天)" width="120">
                                        <template slot-scope="scope">
                                            <Input type="text" v-model="scope.row.buy_leadtime" @on-change="expectLeadtime(scope.row)"></Input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="expect_leadtime" label="预计到货日期" width="120">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.expect_leadtime}}</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="note" label="备注" width="120" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <Input type="text" v-model="scope.row.note"></Input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="from_order_no" label="来源单据编号" width="120">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.from_order_no }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="make_user" label="来源单据创建人" width="160">
                                        <template slot-scope="scope">
                                            <span>
                                                <span >{{ scope.row.make_user_no }}</span>
                                                <span v-show="scope.row.make_user_no != '' && scope.row.make_user_name != ''">/</span>
                                                <span v-show='scope.row.make_user_name != 0'>{{ scope.row.make_user_name }}</span>
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;"  @click="deleteRow(scope.$index, actTable.data)">删除</span>
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
                        <!--fromAdd：从新增页面过来的返回按钮，需要直接跳转到列表页，因为单据新增完，新增页面会自动关闭-->
                        <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('purchase_manage_HT_index')">返回</Button>
                        <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                        <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')" v-if="is_delete">删除</Button>
                        <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('tj')" v-if="is_tj || is_submit">提交</Button>
                        <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('zf')" v-if="is_submit">作废</Button>
                        <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('sp')" v-if="is_approve">审批</Button> <!---->
                        <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('ht')" v-if="is_back">回退</Button>
                        <!--<Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toFKD" v-if="is_pay">申请付款</Button>&lt;!&ndash;  v-if="is_pay"&ndash;&gt;-->
                        <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toXGD" v-if="is_change">申请修改</Button> <!--v-if="is_change"-->
                        <!--<Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="handleClick(htd_id, 'purchase_manage_HT_toTHD')">申请退货 </Button>-->
                        <Button type="primary" class="margin-left-10" v-auth="HTdetailExport" @click="exportList">导出</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="付款信息" name="tab1">
                <Row>
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">付款信息
                            <span style="float: right;font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" @click="toFKD" v-if="is_pay && +payForm.stay_pay">申请付款</span>
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购商品总额：" style="margin:0;">
                                    {{ payForm.total_amount }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="采购商品退货总额：" style="margin:0;">
                                    {{ payForm.buy_return_amount }}
                                </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="8">
                                <FormItem label="待付款金额：" style="margin:0;">
                                    {{ payForm.stay_pay }}
                                </FormItem>
                                </Col>
                                <Col span="16" class="padding-left-20">
                                <p class="margin-left-10" style="color:#8a8a8a;font-size:12px;"><Icon type="information-circled" style="color:#2d8cf0;margin-right:10px;"></Icon>待付款金额 =（采购商品总额-采购商品退货总额）-（已付款总额 - 已退款总额）- 待确认付款金额</p>
                                <p style="color:#8a8a8a;font-size:12px;margin-left: 30px;">{{payForm.stay_pay}} = ({{payForm.total_amount}} - {{payForm.buy_return_amount}}) - ({{payForm.buy_pay}} - {{payForm.return_pay}}) - {{payForm.stay_buy_pay}}</p>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="payForm.pay_info.length > 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">付款记录</p>
                        <div class="margin-bottom-10">
                            <span>待确认付款金额： <em style="color:#cf0012;font-style: normal;">{{ payForm.stay_buy_pay }}</em></span>
                            <span class="margin-left-20">已付款金额： <em style="color:#cf0012;font-style: normal;">{{ payForm.buy_pay }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="payForm.pay_info" border style="text-align: center"  @sort-change="payRecordSort">
                            <el-table-column prop="order_payment_no" label="采购付款单编号">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.order_payment_no}, 'purchase_manage_FK_detail')">
                                        {{ scope.row.order_payment_no }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="pay_way" label="付款方式" ></el-table-column>
                            <el-table-column prop="pay_identity" label="交易凭证号" ></el-table-column>
                            <el-table-column prop="real_amount" label="付款金额" sortable="custom"></el-table-column>
                            <el-table-column prop="pay_status" label="状态" sortable="custom">
                                <template slot-scope="scope">
                                    <span>{{ payStatus[scope.row.pay_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" sortable="custom"></el-table-column>
                        </el-table>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="payForm.return_info.length > 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">退款记录</p>
                        <div class="margin-bottom-10">
                            <span>待确认退款金额： <em style="color:#cf0012;font-style: normal;">{{ payForm.stay_return_pay }}</em></span>
                            <span class="margin-left-20">已退款金额： <em style="color:#cf0012;font-style: normal;">{{ payForm.return_pay }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="payForm.return_info" border style="text-align: center"  @sort-change="returnRecordSort">
                            <el-table-column prop="brand_name" label="采购退款单编号">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.order_payment_no}, 'purchase_manage_TK_detail')">
                                        {{ scope.row.order_payment_no }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="from_order" label="来源单据类型" sortable="custom">
                                <template slot-scope="scope">
                                    <span>{{ tk_order_type[scope.row.from_order] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="from_order_no" label="来源单据编号" ></el-table-column>
                            <el-table-column prop="pay_way" label="退款方式" ></el-table-column>
                            <el-table-column prop="pay_identity" label="交易凭证号" ></el-table-column>
                            <el-table-column prop="real_amount" label="退款金额" sortable="custom"></el-table-column>
                            <el-table-column prop="pay_status" label="状态" sortable="custom">
                                <template slot-scope="scope">
                                    <span>{{ payStatus[scope.row.pay_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" sortable="custom"></el-table-column>
                        </el-table>
                    </Card>
                    </Col>
                </Row>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="发货信息" name="tab2">
                <Row class="margin-top-10" v-if="shipInfo.wait_ship.length == 0 && shipInfo.has_ship.length == 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">修改信息</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="shipInfo.wait_ship.length != 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            待发货商品明细
                            <span style="float: right;font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" @click="toFHD" v-show="form.order_status == 2" v-auth="buySpecial">生成采购发货单</span>
                        </p>
                        <el-table :row-class-name="tableRowClassName" :data="shipInfo.wait_ship" border style="text-align: center"  @sort-change="readySendSort">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" sortable="custom" width="100"></el-table-column>
                            <el-table-column prop="wait_ship_num" label="待发货数量" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="wait_ship_price" label="待发货金额" sortable="custom" width="120"></el-table-column>
                        </el-table>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="shipInfo.has_ship.length != 0" v-for="(val, index) in shipInfo.has_ship">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            发货记录
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购发货单编号：" style="margin:0;">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.info.order_ship_no}, 'purchase_manage_FH_detail')">
                                        {{ val.info.order_ship_no }}
                                    </span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发货时间：" style="margin:0;">
                                    {{ val.info.create_time }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="状态：" style="margin:0;">
                                    {{ ShipStatus[val.info.order_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="是否直发客户：" style="margin:0;">
                                    <span v-if="val.info.is_direct == 0">
                                        非直发
                                    </span>
                                    <span v-if="val.info.is_direct == 1">
                                        直发
                                    </span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发货方式：" style="margin:0;">
                                    {{ shipWays[val.info.ship_type] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发货物流：" style="margin:0;">
                                    {{ val.info.ship_name }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="物流单号：" style="margin:0;">
                                    {{ val.info.ship_no }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="到货仓库：" style="margin:0;">
                                    {{ val.info.receive_stock_name }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="到货联系人：" style="margin:0;">
                                    {{ val.info.receive_name }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="到货地址：" style="margin:0;">
                                    {{ val.info.province_name }}{{ val.info.city_name }}{{ val.info.district_name }}{{ val.info.receive_address }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="备注：" style="margin:0;">
                                    {{ val.info.note }}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div class="margin-bottom-10"  style="border-top:1px dashed #d4d4d4; padding-top:10px">
                            <span style="margin-left:41px;">发货商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.info.ship_num }}</em></span>
                            <span class="margin-left-20">发货商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.info.ship_amount }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="val.list" border style="text-align: center">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable width="120"></el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" sortable width="100"></el-table-column>
                            <el-table-column prop="rel_detail_price" label="发货单价" sortable width="120"></el-table-column>
                            <el-table-column prop="num" label="发货数量" sortable width="100"></el-table-column>
                            <el-table-column prop="total_price" label="发货金额" sortable width="120"></el-table-column>
                            <el-table-column prop="product_leadtime" label="货期(天)" width="100"></el-table-column>
                        </el-table>
                    </Card>
                    </Col>
                </Row>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="修改信息" name="tab3">
                <Row class="margin-top-10" v-if="editInfo.length == 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">修改信息</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-for="val in editInfo" v-if="editInfo.length > 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            修改记录
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购合同修改单编号：" style="margin:0;">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.order_change_no}, 'purchase_manage_HTedit_detail')">{{ val.order_change_no }}</span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="申请修改时间：" style="margin:0;">
                                    {{ val.update_time }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="状态：" style="margin:0;">
                                    {{ changeStatus[val.change_status] }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="备注：" style="margin:0;">
                                    {{ val.note }}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div class="margin-bottom-10" style="border-top:1px dashed #d4d4d4; padding-top:10px">
                            <span style="margin-left:41px;">采购商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.buy_num }}</em></span>
                            <span class="margin-left-20">采购商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.buy_amount }}</em></span>
                            <span style="margin-left:41px;">取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.reduce_total }}</em></span>
                            <span class="margin-left-20">取消商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.reduce_amount }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="val.product_info" border style="text-align: center" >
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable width="120"></el-table-column>
                            <el-table-column prop="before_num" label="采购数量" sortable width="100"></el-table-column>
                            <el-table-column prop="change_num" label="取消数量" sortable width="100"></el-table-column>
                            <el-table-column prop="change_amount" label="取消金额" sortable width="120"></el-table-column>
                        </el-table>
                        <div v-if="val.workFlow.approval_task">
                            <p style="color:#1c2438;font-weight:700;line-height: 50px;border-bottom:1px solid #e9eaec;" class="margin-bottom-20">
                                流程跟踪
                            </p>
                            <Steps :current="val.workFlow.task_now" status="">
                                <Step :title="task.action" content="" v-for="task in val.workFlow.tasks"></Step>
                            </Steps>
                            <Row class="margin-top-10">
                                <Col span="24">
                                <div v-for="task in val.workFlow.tasks" :style="{width: val.workFlow.workFlowWidth + '%'}" class="purchase-flow-div">
                                    <p style="color:#999;">{{ task.user_name }}</p>
                                    <p style="color:#999;">{{ task.time }}</p>
                                    <p style="color:#999;">{{ task.note }}</p>
                                </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="收票信息" name="tab4">
                <Row class="margin-top-10" v-if="invoiceInfoTmp.wait_invoice_details.length == 0 && invoiceInfoTmp.invoice_record.length == 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">收票信息</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="invoiceInfoTmp.wait_invoice_details.length > 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            待收票商品明细
                            <span style="float: right;font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" @click="toSPD"  v-if="is_sp && form.order_status == 2">生成采购收票单</span>
                        </p>
                        <el-table :row-class-name="tableRowClassName" :data="invoiceInfoTmp.wait_invoice_details" border style="text-align: center"  @sort-change="readyRecSort">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="instock_num" label="入库数量" sortable="custom" width="100"></el-table-column>
                            <el-table-column prop="wait_num" label="待收票数量" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="wait_amount" label="待收票金额" sortable="custom" width="120"></el-table-column>
                            <el-table-column prop="instock_no" label="入库单号" sortable="custom" width="130">
                                 <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick({param: scope.row.instock_no}, 'purchase_manage_RK_detail')">{{scope.row.instock_no}}</span>
                                    </template>
                            </el-table-column>
                        </el-table>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="invoiceInfoTmp.invoice_record.length > 0" v-for="val in invoiceInfoTmp.invoice_record">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            收票记录
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购收票单编号：" style="margin:0;">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;"  @click="goToDetail(val.invoiceInfo.order_invoice_no, val.invoiceInfo.order_invoice_type)">
                                        {{ val.invoiceInfo.order_invoice_no }}
                                    </span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="创建时间：" style="margin:0;">
                                    {{ val.invoiceInfo.create_time }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="单据状态：" style="margin:0;">
                                    {{ fpdStatus[val.invoiceInfo.invoice_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发票号码：" style="margin:0;">
                                    {{ val.invoiceInfo.invoice_no }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发票类别：" style="margin:0;">
                                    {{ invoiceType[val.invoiceInfo.order_invoice_type] }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="备注：" style="margin:0;">
                                    {{ val.invoiceInfo.note }}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div class="margin-bottom-10">
                            <span style="margin-left:41px;">收票商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalNum }}</em></span>
                            <span class="margin-left-20">收票商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalAmount }}</em></span>
                            <span style="margin-left:41px;">收票商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalCostAmount }}</em></span>
                            <span class="margin-left-20">收票商品总税额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalCost }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="val.invoiceDetails" border style="text-align: center">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable width="120"></el-table-column>
                            <el-table-column prop="instock_num" label="入库数量" sortable width="100"></el-table-column>
                            <el-table-column prop="invoice_num" label="收票数量" sortable width="100"></el-table-column>
                            <el-table-column prop="invoice_amount" label="收票金额" sortable width="120"></el-table-column>
                            <el-table-column prop="invoice_cost_amount" label="未税金额" sortable width="120"></el-table-column>
                            <el-table-column prop="cost_amount" label="税额" width="100"></el-table-column>
                        </el-table>
                        <div v-if="val.workFlow.approval_task">
                        <p style="color:#1c2438;font-weight:700;line-height: 50px;border-bottom:1px solid #e9eaec;" class="margin-bottom-20">
                        流程跟踪
                        </p>
                        <Steps :current="val.workFlow.task_now" status="">
                        <Step :title="task.action" content="" v-for="task in val.workFlow.tasks"></Step>
                        </Steps>
                        <Row class="margin-top-10">
                        <Col span="24">
                        <div v-for="task in val.workFlow.tasks" :style="{width: val.workFlow.workFlowWidth + '%'}" class="purchase-flow-div">
                        <p style="color:#999;">{{ task.user_name }}</p>
                        <p style="color:#999;">{{ task.time }}</p>
                        <p style="color:#999;">{{ task.note }}</p>
                        </div>
                        </Col>
                        </Row>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="invoiceInfoTmp.back_invoice_record.length > 0" v-for="val in invoiceInfoTmp.back_invoice_record">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            退票记录
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购收票单编号：" style="margin:0;">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.invoiceInfo.order_invoice_no}, 'purchase_manage_SP_detail')">
                                        {{ val.invoiceInfo.order_invoice_no }}
                                    </span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="创建时间：" style="margin:0;">
                                    {{ val.invoiceInfo.create_time }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="单据状态：" style="margin:0;">
                                    {{ fpdStatus[val.invoiceInfo.invoice_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="来源类型：" style="margin:0;">
                                    {{ tk_order_type[val.invoiceInfo.from_order_no] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发票号码：" style="margin:0;">
                                    {{ val.invoiceInfo.invoice_no }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发票类别：" style="margin:0;">
                                    {{ invoiceType[val.invoiceInfo.order_invoice_type] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="来源单据编号：" style="margin:0;">
                                    {{ val.invoiceInfo.from_order }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="备注：" style="margin:0;">
                                    {{ val.invoiceInfo.note }}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div class="margin-bottom-10">
                            <span style="margin-left:41px;">退票商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalNum }}</em></span>
                            <span class="margin-left-20"> 退票商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalAmount }}</em></span>
                            <span style="margin-left:41px;">退票商品未税总额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalCostAmount }}</em></span>
                            <span class="margin-left-20">退票商品总税额： <em style="color:#cf0012;font-style: normal;">{{ val.invoiceInfo.totalCost }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="val.invoiceDetails" border style="text-align: center">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号"  min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" sortable width="120"></el-table-column>
                            <el-table-column prop="return_num" label="退货数量" sortable width="100"></el-table-column>
                            <el-table-column prop="invoice_num" label="退票数量" sortable width="100"></el-table-column>
                            <el-table-column prop="invoice_amount" label="退票金额" sortable width="120"></el-table-column>
                            <el-table-column prop="invoice_cost_amount" label="未税金额" sortable width="120"></el-table-column>
                            <el-table-column prop="cost_amount" label="税额" sortable width="100"></el-table-column>
                        </el-table>
                        <div v-if="val.workFlow.approval_task">
                        <p style="color:#1c2438;font-weight:700;line-height: 50px;border-bottom:1px solid #e9eaec;" class="margin-bottom-20">
                        流程跟踪
                        </p>
                        <Steps :current="val.workFlow.task_now" status="">
                        <Step :title="task.action" content="" v-for="task in val.workFlow.tasks"></Step>
                        </Steps>
                        <Row class="margin-top-10">
                        <Col span="24">
                        <div v-for="task in val.workFlow.tasks" :style="{width: val.workFlow.workFlowWidth + '%'}" class="purchase-flow-div">
                        <p style="color:#999;">{{ task.user_name }}</p>
                        <p style="color:#999;">{{ task.time }}</p>
                        <p style="color:#999;">{{ task.note }}</p>
                        </div>
                        </Col>
                        </Row>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="退货信息" name="tab5">
                <Row class="margin-top-10" v-if="thRecord.length == 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">退货信息</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-for="val in thRecord" v-if="thRecord.length > 0">
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            退货记录
                        </p>
                        <Form :label-width="150">
                            <Row>
                                <Col span="8">
                                <FormItem label="采购退货单编号：" style="margin:0;">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.order_return_no}, 'purchase_manage_TH_detail')">
                                        {{ val.order_return_no }}
                                    </span>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="创建时间：" style="margin:0;">
                                    {{ val.create_time }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="单据状态：" style="margin:0;">
                                    {{ returnStatus[val.return_status] }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="退货仓库：" style="margin:0;">
                                    {{ val.arrive_store }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="退货联系人：" style="margin:0;">
                                    {{ val.receive_name }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="退货联系方式：" style="margin:0;">
                                    {{ val.receive_phone }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="退货地址：" style="margin:0;">
                                    {{ val.receive_address }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="退货原因：" style="margin:0;">
                                    {{ val.note }}
                                </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <div class="margin-bottom-10" style="border-top:1px dashed #d4d4d4; padding-top:10px">
                            <span style="margin-left:41px;">退货商品总数： <em style="color:#cf0012;font-style: normal;">{{ val.num }}</em></span>
                            <span class="margin-left-20"> 退货商品总额： <em style="color:#cf0012;font-style: normal;">{{ val.amount }}</em></span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="val.product_info" border style="text-align: center">
                            <el-table-column type="index" label="行号" ></el-table-column>
                            <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="ckmc" label="所属仓库" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="buy_price" label="采购单价" width="120"></el-table-column>
                            <el-table-column prop="buy_num" label="采购数量" sortable width="100"></el-table-column>
                            <el-table-column prop="return_num" label="退货数量" sortable width="100"></el-table-column>
                            <el-table-column prop="return_amount" label="退货金额" sortable width="120"></el-table-column>
                        </el-table>
                        <div v-if="val.workFlow.approval_task">
                        <p style="color:#1c2438;font-weight:700;line-height: 50px;border-bottom:1px solid #e9eaec;" class="margin-bottom-20">
                        流程跟踪
                        </p>
                        <Steps :current="val.workFlow.task_now" status="">
                        <Step :title="task.action" content="" v-for="task in val.workFlow.tasks"></Step>
                        </Steps>
                        <Row class="margin-top-10">
                        <Col span="24">
                        <div v-for="task in val.workFlow.tasks" :style="{width: val.workFlow.workFlowWidth + '%'}" class="purchase-flow-div">
                        <p style="color:#999;">{{ task.user_name }}</p>
                        <p style="color:#999;">{{ task.time }}</p>
                        <p style="color:#999;">{{ task.note }}</p>
                        </div>
                        </Col>
                        </Row>
                        </div>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
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
        <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT" class-name="modal-no-absoute">
            <h3 slot="header">添加商品</h3>
            <div>
                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="addForm" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                <Select v-model="addForm.brand"  placeholder="请选择" @on-change="search">
                                    <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.name" placeholder="输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.type"  placeholder="请选择" @on-change="search">
                                    <Option v-for="status in FromTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.order" placeholder="输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.model" placeholder="输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.from_djbh" placeholder="输入来源单据编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <DatePicker type="datetimerange" placeholder="选择创建时间" :value='addForm.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.buyer"  placeholder="请选择" filterable @on-change="search">
                                    <Option v-for="status in buyerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.creater" placeholder="输入创建人" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="addForm.sell_order_no" placeholder="输入销售合同单号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Select v-model="addForm.rel_order_type" placeholder="选择" @on-change="search">
                                    <Option v-for="status in relOrderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
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
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="ToHTD">确定</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center"  @selection-change="handleSelectionChange" @sort-change="manualSort1">
                            <el-table-column
                                    type="selection"
                                    width="55" :selectable="canSelect" fixed>
                            </el-table-column>
                            <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_name" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_model" label="产品型号" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_order_no" label="订货号" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_unit" label="计量单位" ></el-table-column>
                            <el-table-column label="产品面价" width="120">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.product_origin_price | toDecimal }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="requisition_num" label="申请数量" min-width="100"></el-table-column>
                            <el-table-column prop="requisition_price" label="申请单价" min-width="100"></el-table-column>
                            <el-table-column prop="buyed_num" label="已采购数量" min-width="120"></el-table-column>
                            <el-table-column prop="ready_buy_num" label="待采购数量" min-width="120"></el-table-column>
                            <el-table-column prop="supplier_stock" label="供应商库存" min-width="120"></el-table-column>
                            <el-table-column prop="supplier_price" label="供应商价格" min-width="120"></el-table-column>
                            <el-table-column prop="order_type" label="来源类型" min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ fromType[scope.row.order_type] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源单据编号"  min-width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.requisition_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="货期 " width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.product_leadtime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="now_note" label="采购备注" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="note" label="客服备注" width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="create_time" label="创建时间" min-width="150"></el-table-column>
                            <el-table-column label="创建人" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购员" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.buy_user_no }}<span v-show="scope.row.buy_user_no !=''">/</span>{{ scope.row.buy_user_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="销售合同单编号"  min-width="120">
                                <template slot-scope="scope">
                                    <span> {{scope.row.sell_order_no }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rel_order_type" label="销售合同单单据类型"  min-width="150">
                                <template slot-scope="scope">
                                    <span> {{relOrderStatus[scope.row.rel_order_type]}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="text" @click="goodsCancel">取消</Button>
                <Button type="primary" @click="ToHTD">确定</Button>
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

        <!--采购单价过高弹窗-->
        <Modal v-model="showOver" title="采购单价过高商品" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="overgoods" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="订货号" min-width="120" prop="product_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column label="产品型号" min-width="120" prop="product_model" show-overflow-tooltip></el-table-column>
                    <el-table-column label="申请单价" min-width="120" prop="requisition_price" show-overflow-tooltip></el-table-column>
                    <el-table-column label="采购单价" min-width="120" prop="buy_price" show-overflow-tooltip></el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="default"  @click="cancel">取消</Button>
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiGetPurchaseHtDetailExport, allpersonInfos, apiGetPurchaseHtDetail, apiGetPurchaseSupplierAll, apiGetCommonStockList, apiMapDetail, apiGetPurchaseHtDelete, apiGetPurchaseHtEdit, apiGetPurchaseHtGoodsDetailEdit, apiGetPurchaseReadybuyList, operateAllBrandsList, apiGetPurchaseHtAttachEdit, apiGetPurchaseHTStatusChange, apiInMainName, apiInPayName, apiInChangeName, purchaseManageApproveAction, purchaseManageGetWorkFlow, apiGetPurchaseHTDetailEdit, apiGetPurchaseHTDetailReturn, apiGetPurchaseHTDetailShip, apiGetPurchaseHTDetailPay, apiGetPurchaseHTDetailInvoice, purchaseManageSPModel } from '@/config/getData';
    import { notempty, sortBy, specialSortBy, setToken, isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    let queryAllWorkFLow = (vm, orderId) => {
        return new Promise((success) => {
            purchaseManageGetWorkFlow(vm, {
                order_no: orderId
            }).then(result => {
                success(result);
            });
        })
    };
    export default {
        data () {
            return {
                changeTab: 'tab0',
                fromAdd: this.$route.query.fromAdd,
                form: {
                    gyslxr: '',
                    gyslxhm: ''
                },
                addressForm: {
                    ckfzr: '',
                    sjhm: ''
                },
                tax: [
                    {
                        label: '16%',
                        value: '0.160'
                    }
                ],
                addressVal: ['jiangsu', 'suzhou', 'zhuozhengyuan'],
                addressData: [],
                htd_id: this.$route.query.param,
                actTable: {
                    data: [
                        {
                            cpdhh: '1239'
                        }
                    ]
                },
                is_edit: true,
                is_address: true,
                edit_goods: true,
                is_htxx: true,
                goodsAll: '0',
                goodsAllMoney: '0',
                goodsAllWS: '0',
                goodsAlltax: '0',
                htInfo: {
                    htId: '',
                    file: '',
                    name: '',
                    ext: '',
                    htName: '',
                    uploadUrl: this.baseUrl + '/v1/order/buy/main/upload-attach?token=' + setToken()
                },
                supperList: [],
                djStatus: [],
                djStatusArr: [],
                zfStatus: [],
                zfStatusArr: [],
                fhStatus: [],
                fhStatusArr: [],
                fplx: [],
                fplxArr: [],
                is_zf: ['非直发', '直发'],
                is_zfArr: [
                    {
                        value: '0',
                        label: '非直发'
                    },
                    {
                        value: '1',
                        label: '直发'
                    }
                ],
                stockList: [],
                stockArr: [],
                taxRate: parseFloat(1.16).toFixed(2),
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                supperAll: [],
                is_dis: false,
                default_store: '',
                default_fzr: '',
                default_sjhm: '',
                goodsModal: false,
                addForm: {
                    applyer: '',
                    type: 'all',
                    dj_status: '',
                    fk_status: '',
                    htd_bh: '',
                    stock: '',
                    state: '',
                    from_djbh: '',
                    brand: 'all',
                    name: '',
                    fhd_no: '',
                    order: '',
                    model: '',
                    datetime: '',
                    buyer: 'all',
                    creater: '',
                    sell_order_no:'',
                    rel_order_type: 'all',
                },
                orderData: {
                    data: [
                        {
                            khbh: '12313'
                        }
                    ]
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                orderField: '',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                fromType: ['其他'],
                FromTypeArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                brand_ids: [],
                goodsAddArr: [],
                current_user: '',
                is_delete: '',
                isCurrent: '',
                is_submit: '',
                is_approve: '',
                is_pay: '',
                is_change: '',
                is_tj: '',
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
                isDis: false,
                addressRules: {
                    is_direct: [
                        { required: true, message: '请选择是否直发', trigger: 'on-change' }
                    ],
                    ckbh: [
                        { required: true, message: '请选择到货仓库', trigger: 'on-change' }
                    ],
                    ckfzr: [
                        { required: true, message: '请填写到货联系人', trigger: 'blur' }
                    ],
                    sjhm: [
                        { required: true, message: '请填写到货联系方式', trigger: 'blur' }
                    ],
                    receive_address: [
                        { required: true, message: '请填写到货地址', trigger: 'blur' }
                    ]
                },
                payForm: {
                    return_info: [],
                    stay_pay: 0,
                    pay_info: []
                },
                payRecord: {
                    ready_pay: '',
                    has_pay: '',
                    data: []
                },
                returnRecord: {
                    ready_return: '',
                    has_return: '',
                    data: []
                },
                shipInfo: {
                    wait_ship: [],
                    has_ship: []
                },
                editInfo: {
                    editForm: {},
                    editTable: {
                        data: []
                    }
                },
                readyRecv: [],
                recevInfo: {
                    spRecord: [
                        {
                            data: []
                        }
                    ],
                    tpRecord: [
                        {
                            data: []
                        }
                    ]
                },
                invoiceInfoTmp: {
                    back_invoice_record: [],
                    invoice_record: [],
                    wait_invoice_details: []
                },
                thRecord: [],
                changeStatus: '',
                ShipStatus: '',
                shipWays: '',
                returnStatus: '',
                payStatus: '',
                tk_order_type: '',
                goodsIds: [],
                buyerArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                buyerList: [],
                is_sp: false,
                fpdStatus: '',
                invoiceType: '',
                buySpecial: 'buySpecialRoleDetail',
                HTdetailExport:'purchase_manage_HT_detail_export',
                overgoods:[],
                showOver:false,
                relOrderStatus: '',
                relOrderStatusArr: [
                    {
                        label: '选择销售合同单单据类型',
                        value: 'all'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            confirmTranslate(){
                this.SubmitHt();
            },
            cancel(){
                this.showOver = false;
                this.publicModal = false;
            },
            changeNumNew(scope,index) {
                scope.row.cgje = this.multiply(scope.row.buy_price, scope.row.buy_num, 4);
                scope.row.wsje = this.multiply(this.divide(scope.row.buy_price, this.taxRate, 4), scope.row.buy_num, 4);
                scope.row.tax_amount = this.subtract(scope.row.cgje, scope.row.wsje, 4);
                this.actTable.data.splice(index, 1, scope.row);
                this.getCount();
            },
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status', 'fplx', 'buy_order_from', 'change_status', 'ship_status', 'fhfs', 'return_status', 'buy_pay_status', 'buy_payment_from', 'buy_invoice_status','buy_invoice_type','buy_invoice_from','sell_rel_order_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*采购合同单单据状态*/
                        this.djStatus = res.data.buy_order_status;
                        for (let key in res.data.buy_order_status) {
                            if (res.data.buy_order_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_status[key]
                                };
                                this.djStatusArr.push(tmpObj);
                            }
                        }
                        /*采购合同单支付状态*/
                        this.zfStatus = res.data.buy_order_pay_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }
                        /*采购合同单发货状态*/
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_ship_status) {
                            if (res.data.buy_order_ship_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_ship_status[key]
                                };
                                this.fhStatusArr.push(tmpObj);
                            }
                        }
                        /*采购合同单发票类型*/
                        this.fplx = ['其他'];
                        for (let i in res.data.fplx) {
                            this.fplx.push(res.data.fplx[i]);
                        }
                        this.fplxArr = [];
                        for (let key in res.data.fplx) {
                            if (res.data.fplx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fplx[key]
                                };
                                this.fplxArr.push(tmpObj);
                            }
                        }
                        /*发票单状态*/
                        this.fpdStatus = res.data.buy_invoice_status;
                        this.invoiceType = res.data.buy_invoice_type;
                        /*采购合同单来源类型*/
                        for (let i in res.data.buy_order_from) {
                            this.fromType.push(res.data.buy_order_from[i]);
                        }
                        for (let key in res.data.buy_order_from) {
                            if (res.data.buy_order_from.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_from[key]
                                };
                                this.FromTypeArr.push(tmpObj);
                            }
                        }
                        //合同单来源类型
                        this.relOrderStatus = res.data.sell_rel_order_type;
                        for (let key in res.data.sell_rel_order_type) {
                            if (res.data.sell_rel_order_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_rel_order_type[key]
                                };
                                this.relOrderStatusArr.push(tmpObj);
                            }
                        }

                        /*修改单状态*/
                        this.changeStatus = res.data.change_status;
                        /*发货单单据状态*/
                        this.ShipStatus = res.data.ship_status;
                        /*发货单发货方式*/
                        this.shipWays = res.data.fhfs;
                        /*退货单状态*/
                        this.returnStatus = res.data.return_status;
                        /*付款单状态*/
                        this.payStatus = res.data.buy_pay_status;
                        /*退款单来源单据类型*/
                        this.tk_order_type = res.data.buy_invoice_from
                        /*单据权限判断*/
//                        this.is_delete = (this.current_user === this.form.create_user_no && this.form.order_status == 0);
                        /*当前审批人执行人*/
//                        isCurrentApprover(this, this.htd_id).then(result => {
//                            this.isCurrent = (this.form.create_user_no === this.current_user && this.form.order_status == 0) || (result && this.form.order_status == 3 && this.form.create_user_no === this.current_user);
//                            this.is_submit = this.form.create_user_no === this.current_user && this.form.order_status == 3 && result;
//                            this.is_approve = (this.form.order_status == 3 || this.form.order_status == 1) && result;
//                        });

                        /*当前审批人执行人*/
                        this.is_delete = this.form.create_user_no === this.current_user && this.form.order_status == 0;
                        isCurrentApprover(this, this.htd_id).then(result => {
                            isTaskCreater(this, this.htd_id).then(isTaskCreater => {
                                this.is_approve = (this.form.order_status == 1 || this.form.order_status == 3) && result && !isTaskCreater;
                                this.isCurrent = ( this.form.create_user_no === this.current_user && this.form.order_status == 0) || (result && this.form.order_status == 3 && isTaskCreater);
                                this.is_submit = isTaskCreater && this.form.order_status == 3 && result;
                            });
                        });
                        /*是否可创建执行人*/
                        apiInMainName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                isInCreaters(this, modelName, 0).then(canCreater => {
                                    this.is_tj = this.form.create_user_no === this.current_user && this.form.order_status == 0 && canCreater;
                                });
                            }
                        });
                        isFinalApprover(this, this.htd_id).then(result => {
                            this.is_back = this.form.order_status == 2 && result;
                        });
                        apiInPayName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 0).then(result => {
                                    this.is_pay = result && this.form.create_user_no === this.current_user && (this.form.pay_status == 0 || this.form.pay_status == 1) && this.form.order_status == 2;
                                });
                            }
                        });
                        apiInChangeName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 0).then(result => {
                                    this.is_change = result && this.form.create_user_no === this.current_user  && (this.form.ship_status == 0 || this.form.ship_status == 1) && this.form.order_status == 2;
                                });
                            }
                        });
                        /*收票是否可创建执行人*/
                        purchaseManageSPModel(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                isInCreaters(this, modelName, 0).then(result => {
                                    this.is_sp = result;
                                });
                            }
                        });
                    }
                });
            },
            getTask () {
                purchaseManageGetWorkFlow(this, {
                    order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            getList () {
                apiGetPurchaseSupplierAll(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.supperAll = res.data;
                        res.data.forEach(item => {
                            item.value = item.supplier_no;
                            item.label = item.supplier_name;
                            this.supperList.push(item);
                        });
                    }
                });
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.stockList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
                    }
                });
                apiMapDetail(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.addressData = res.data;
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
                allpersonInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.buyerList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.user_no;
                            item.label = item.user_name;
                            this.buyerArr.push(item);
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
             goToDetail (id, type) {
                util.openNewPage(this, 'purchase_manage_SP_detail', {
                    param: id,
                    type: type
                });
                this.$router.push({
                    name: 'purchase_manage_SP_detail',
                    query: {
                        param: id,
                        type: type
                    }
                });
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable.data) {
                    if (row.id === this.actTable.data[i].from_order_detail_id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            ToHTD () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
//                    let argu = { ids: this.brand_ids };
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {

                        //备货单
                        if (this.multipleSelection[i].order_type == '1') {
                            this.multipleSelection[i].buy_price = this.multipleSelection[i].requisition_price;
                            this.multipleSelection[i].product_discount = this.divide(this.multipleSelection[i].requisition_price, this.multipleSelection[i].product_origin_price, 3);
                        }

                        //请购单
                        if (this.multipleSelection[i].order_type == '2') {
                            if (this.multipleSelection[i].supplier_price == '0') {
                                this.multipleSelection[i].now_discount = 1;
                                this.multipleSelection[i].product_discount = this.multipleSelection[i].now_discount;
                                this.multipleSelection[i].buy_price = this.multipleSelection[i].product_origin_price;
                            }else{
                                this.multipleSelection[i].buy_price = this.multipleSelection[i].supplier_price;
                                this.multipleSelection[i].now_discount = this.divide(this.multipleSelection[i].buy_price, this.multipleSelection[i].product_origin_price, 3);
                                this.multipleSelection[i].product_discount = this.multipleSelection[i].now_discount;
                            }
                        }

                        this.multipleSelection[i].id = 0;
                        this.multipleSelection[i].buy_num = this.subtract(this.multipleSelection[i].requisition_num, this.multipleSelection[i].buyed_num);
                        this.multipleSelection[i].buy_leadtime = this.multipleSelection[i].product_leadtime;
                        this.multipleSelection[i].from_order_no = this.multipleSelection[i].requisition_no;
                        this.multipleSelection[i].cgje = this.multiply(this.multipleSelection[i].buy_price, this.multipleSelection[i].buy_num, 4);
                        this.multipleSelection[i].wsje = this.multiply(this.divide(this.multipleSelection[i].buy_price, this.taxRate, 4), this.multipleSelection[i].buy_num, 4);
                        this.multipleSelection[i].tax_amount = this.subtract(this.multipleSelection[i].cgje, this.multipleSelection[i].wsje, 4);


                        let startDate = new Date();
                        startDate = +startDate + 1000*60*60*24;
                        startDate = new Date(startDate);
                        let month = (startDate.getMonth()+1) > 9 ? (startDate.getMonth()+1) : '0' + (startDate.getMonth()+1);
                        let date = startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate();

                        this.multipleSelection[i].expect_leadtime= startDate.getFullYear()+"-"+month+"-"+date;


                        this.goodsAddArr.push(this.multipleSelection[i]);
                    }
                    for (let i in this.goodsAddArr) {
                        this.actTable.data.push(this.goodsAddArr[i]);
                    }
                    this.getCount();
                    this.goodsModal = false;
                }
            },
            toFKD () {
                this.handleClick({param: this.htd_id}, 'purchase_manage_HT_toFKD');
            },
            toFHD () {
                let ship_list = '';
                ship_list = this.goodsIds.join(',');
                this.handleClick({param: ship_list}, 'purchase_manage_HT_toFHD');
                this.goodsIds = [];
            },
            toXGD () {
                this.handleClick({param: this.htd_id}, 'purchase_manage_HT_toHTDedit')
            },
            toSPD () {
                let list = {};
                list = JSON.stringify({
                    order_invoice_type: 0,
                    from_order_no: 0,
                    instock_detail_id: this.goodsIds
                });
                this.handleClick({param: list,from_order_no:0}, 'purchase_manage_HT_toSPD');
                this.goodsIds = [];
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                let allWS = 0;
                let allTax = 0;
                for (let i in this.actTable.data) {
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].buy_num);
                    allAmount = this.add(allAmount, this.actTable.data[i].cgje, 4);
                    allWS = this.add(allWS, this.actTable.data[i].wsje, 4);
                    allTax = this.add(allTax, this.actTable.data[i].tax_amount, 4);

                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
                this.goodsAllWS = allWS;
                // console.log(this.goodsAllWS);
                this.goodsAlltax =allTax;
            },
            expectLeadtime(row){

                if(row.buy_leadtime == ''){
                    row.expect_leadtime = '';
                }
                else{
                    let create_time = this.form.create_time;

                    let startDate = new Date(create_time);
                    startDate = +startDate + 1000*60*60*24*row.buy_leadtime;
                    startDate = new Date(startDate);
                    let month = (startDate.getMonth()+1) > 9 ? (startDate.getMonth()+1) : '0' + (startDate.getMonth()+1);
                    let date = startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate();
                    row.expect_leadtime = startDate.getFullYear()+"-"+month+"-"+date;
                }

            },


            /*导出*/
            exportList () {
                apiGetPurchaseHtDetailExport(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },


            getData () {
                //基本信息
                apiGetPurchaseHtDetail(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form.order_status = res.data.order_info.order_status;
                        this.form.pay_status = res.data.order_info.pay_status;
                        this.form.ship_status = res.data.order_info.ship_status;
                        this.form.gysmc = res.data.order_info.gysmc;
                        this.form.supplier_no = res.data.order_info.supplier_no;
                        for (let i in this.supperAll) {
                            if (this.supperAll[i].supplier_no == this.form.supplier_no) {
                                this.form.gyslxr = this.supperAll[i].lxr;
                                this.form.gyslxhm = this.supperAll[i].sjhm;
                            }
                        }
                        this.form.invoice_type = res.data.order_info.invoice_type;
                        this.form.buy_tax_rate = res.data.order_info.buy_tax_rate;
                        this.form.note = res.data.order_info.note;
                        this.form.create_user_name = res.data.order_info.create_user_name;
                        this.form.create_user_no = res.data.order_info.create_user_no;
                        this.form.create_time = res.data.order_info.create_time;
                        this.form.total_amount = res.data.order_info.total_amount;
                        this.form.real_pay_amoumt = res.data.order_info.real_pay_amoumt;

                        this.form.gysmc = res.data.supplier.gysmc;
                        this.form.gysbh = res.data.supplier.gysbh;
                        this.form.gyslxmc = res.data.supplier.gyslxmc;
                        this.form.invoice_type = this.form.invoice_type.toString();
                        this.form.ckbh = res.data.store.ckbh;
                        this.form.ckmc = res.data.store.ckmc;
//                    this.addressForm = res.data.order_info;
//                        this.addressForm.is_direct = res.data.order_info.is_direct.toString();
//                        this.addressForm.ckmc = res.data.store.ckmc;
//                        this.addressForm.ckbh = res.data.order_info.store_no;
//                        this.default_store = res.data.store.ckbh;
//                        this.addressForm.ckfzr = res.data.order_info.receive_name;
//                        this.addressForm.sjhm = res.data.order_info.receive_phone;
//                        this.addressForm.province_name = res.data.order_info.province_name;
//                        this.addressForm.province_no = res.data.order_info.province_no;
//                        this.addressForm.city_name = res.data.order_info.city_name;
//                        this.addressForm.city_no = res.data.order_info.city_no;
//                        this.addressForm.district_name = res.data.order_info.district_name;
//                        this.addressForm.district_no = res.data.order_info.district_no;
//                        this.addressForm.receive_address = res.data.order_info.receive_address;
//                        this.addressVal = [parseInt(res.data.order_info.province_no), parseInt(res.data.order_info.city_no), parseInt(res.data.order_info.district_no)];
                        this.htInfo.htId = res.data.order_info.order_attach_no;
                        this.htInfo.file = res.data.order_info.order_attach;
                        this.htInfo.ext = res.data.order_info.attach_file_ext;
                        this.htInfo.name = res.data.order_info.attach_file_name + '.' + res.data.order_info.attach_file_ext;
                        this.htInfo.htName = res.data.order_info.attach_file_name;
                        for (let i in res.data.order_detail) {
//                            res.data.order_detail[i].buy_price = res.data.order_detail[i].product_origin_price * res.data.order_detail[i].buy_num;
                            res.data.order_detail[i].cgje = this.multiply(res.data.order_detail[i].buy_price, res.data.order_detail[i].buy_num, 4);
                            res.data.order_detail[i].wsje = this.multiply(this.divide(res.data.order_detail[i].buy_price, this.taxRate, 4), res.data.order_detail[i].buy_num, 4);
                            res.data.order_detail[i].tax_amount = this.subtract(res.data.order_detail[i].cgje, res.data.order_detail[i].wsje, 4);
                        }
                        this.actTable.data = res.data.order_detail;
                        this.getCount();
                        this.current_user = Cookies.get('user_no');
                        this.getStatus();
                    }
                });
            },
            getPayInfo () {
                apiGetPurchaseHTDetailPay(this, {
                    params: JSON.stringify({
                        buy_order_no: this.htd_id
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.payForm = res.data;
                    }
                });
            },
            getShipInfo () {
                apiGetPurchaseHTDetailShip(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.shipInfo = res.data;
                        this.goodsIds = [];
                        for (let i in this.shipInfo.wait_ship) {
                           this.goodsIds.push(this.shipInfo.wait_ship[i].id);
                        }
                    }
                });
            },
            getEditInfo () {
                apiGetPurchaseHTDetailEdit(this, {
                    params: JSON.stringify({
                        buy_order_no: this.htd_id
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        let allQueryArr = [];
                        for (let i in res.data) {
                            allQueryArr.push(queryAllWorkFLow(this, res.data[i].order_change_no))
                        }
                        Promise.all(allQueryArr).then(cot => {
                            for (let i in res.data) {
                                for (let j in cot) {
                                    if (i == j) {
                                        if (cot[j].status == 1) {
                                            res.data[i].workFlow = {
                                                task_now: cot[j].data.current_key,
                                                tasks: cot[j].data.tracks,
                                                workFlowWidth: 100 / cot[j].data.tracks.length,
                                                approval_task: true
                                            };
                                        } else {
                                            res.data[i].workFlow = {
                                                approval_task: false
                                            };
                                        }
                                    }
                                }
                            }
                            this.editInfo = res.data;
                        })
                    }
                });
            },
            getInvoice () {
                apiGetPurchaseHTDetailInvoice(this, {
//                    params: JSON.stringify({
                        buy_order_no: this.htd_id
//                    })
                }).then(res => {
                    if (res && res.status == 1) {
//                        this.invoiceInfo = res.data;
                        /*收票记录*/
                        let allQueryArr = [];
                        for (let i in res.data.invoice_record) {
                            allQueryArr.push(queryAllWorkFLow(this, res.data.invoice_record[i].invoiceInfo.order_invoice_no))
                        }
                        Promise.all(allQueryArr).then(cot => {
                            for (let i in res.data.invoice_record) {
                                for (let j in cot) {
                                    if (i == j) {
                                        if (cot[j].status == 1) {
                                            res.data.invoice_record[i].workFlow = {
                                                task_now: cot[j].data.current_key,
                                                tasks: cot[j].data.tracks,
                                                workFlowWidth: 100 / cot[j].data.tracks.length,
                                                approval_task: true
                                            };
                                        } else {
                                            res.data.invoice_record[i].workFlow = {
                                                approval_task: false
                                            };
                                        }
                                    }
                                }
                            }
                            this.invoiceInfoTmp.invoice_record = res.data.invoice_record;
                        });
                        /*退票记录*/
                        let allTpArr = [];
                        for (let i in res.data.back_invoice_record) {
                            allTpArr.push(queryAllWorkFLow(this, res.data.back_invoice_record[i].invoiceInfo.order_invoice_no))
                        }
                        Promise.all(allTpArr).then(cot => {
                            for (let i in res.data.back_invoice_record) {
                                for (let j in cot) {
                                    if (i == j) {
                                        if (cot[j].status == 1) {
                                            res.data.back_invoice_record[i].workFlow = {
                                                task_now: cot[j].data.current_key,
                                                tasks: cot[j].data.tracks,
                                                workFlowWidth: 100 / cot[j].data.tracks.length,
                                                approval_task: true
                                            };
                                        } else {
                                            res.data.back_invoice_record[i].workFlow = {
                                                approval_task: false
                                            };
                                        }
                                    }
                                }
                            }
                            this.invoiceInfoTmp.back_invoice_record = res.data.back_invoice_record;
                        });
                        this.invoiceInfoTmp.wait_invoice_details = res.data.wait_invoice_details;
                        for (let i in this.invoiceInfoTmp.wait_invoice_details) {
                            this.goodsIds.push(this.invoiceInfoTmp.wait_invoice_details[i].instock_id);
                        }
                    }
                });
            },
            getReturnInfo () {
                apiGetPurchaseHTDetailReturn(this, {
                    params: JSON.stringify({
                        buy_order_no: this.htd_id
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        let allQueryArr = [];
                        for (let i in res.data) {
                            allQueryArr.push(queryAllWorkFLow(this, res.data[i].order_return_no))
                        }
                        Promise.all(allQueryArr).then(cot => {
                            for (let i in res.data) {
                                for (let j in cot) {
                                    if (i == j) {
                                        if (cot[j].status == 1) {
                                            res.data[i].workFlow = {
                                                task_now: cot[j].data.current_key,
                                                tasks: cot[j].data.tracks,
                                                workFlowWidth: 100 / cot[j].data.tracks.length,
                                                approval_task: true
                                            };
                                        } else {
                                            res.data[i].workFlow = {
                                                approval_task: false
                                            };
                                        }
                                    }
                                }
                            }
                            this.thRecord = res.data;
                        })
                    }
                });
            },
            edit (name) {
                if (name === 'basic') {
                    this.is_edit = false;
                } else if (name === 'address') {
                    this.is_address = false;
                    if (this.addressForm.ckbh === '888') {
                        this.stockArr = [{
                            value: '888',
                            label: '虚拟仓库'
                        }];
                        this.isDis = true;
                    }
                } else if (name === 'htxx') {
                    this.is_htxx = false;
                } else if (name === 'goods') {
                    this.edit_goods = false;
                }
            },
            close (name) {
                if (name === 'basicCancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'basicSave') {
                    apiGetPurchaseHtEdit(this, {
                        buy_order_no: this.htd_id,
                        params: JSON.stringify({
                            supplier_no: this.form.supplier_no,
                            invoice_type: this.form.invoice_type,
                            store_no: this.form.ckbh,
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
                } else if (name === 'addressCancel') {
                    this.is_address = true;
                    this.getData();
                } else if (name === 'addressSave') {
                    this.$refs.addressForm.validate((valid) => {
                        if (valid) {
                            apiGetPurchaseHtEdit(this, {
                                buy_order_no: this.htd_id,
                                params: JSON.stringify(this.notempty({
                                    is_direct: this.addressForm.is_direct,
                                    store_no: this.addressForm.ckbh,
                                    province_no: this.addressForm.province_no,
                                    province_name: this.addressForm.province_name,
                                    city_no: this.addressForm.city_no,
                                    city_name: this.addressForm.city_name,
                                    district_no: this.addressForm.district_no,
                                    district_name: this.addressForm.district_name,
                                    receive_name: this.addressForm.ckfzr,
                                    receive_address: this.addressForm.receive_address,
                                    receive_phone: this.addressForm.sjhm
                                }))
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.is_address = true;
                                    this.addressForm.ckbh = res.data.store_no;
                                    this.addressForm.ckfzr = res.data.receive_name;
                                    this.addressForm.sjhm = res.data.receive_phone;
                                    this.getData();
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                } else if (name === 'htxxCancel') {
                    this.is_htxx = true;
                    this.getData();
                } else if (name === 'htxxSave') {
                    apiGetPurchaseHtAttachEdit(this, {
                        params: JSON.stringify(this.notempty({
                            buy_order_no: this.htd_id,
                            order_attach_no: this.htInfo.htId,
                            order_attach_url: this.htInfo.file
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.is_htxx = true;
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
                        var n = parseInt(i) + parseInt(1);
                        if (!this.actTable.data[i].product_discount || this.actTable.data[i].product_discount === '') {
                            this.$Message.error('第' + n + '行的采购折扣不能为空');
                            return false;
                        } else if (parseInt(this.actTable.data[i].product_discount * 1000) <= parseInt(0)) {
                            this.$Message.error('第' + n + '行的采购折扣不能为0');
                            return false;
                        } else if (!reg3.test(this.actTable.data[i].product_discount)) {
                            this.$Message.error('第' + n + '行的采购折扣最多保留到小数后三位');
                            return false;
                        } else if (parseInt(this.actTable.data[i].product_discount * 1000) > 10000) {
                            this.$Message.error('第' + n + '行的采购折扣不能大于10');
                            return false;
                        } else if (!this.actTable.data[i].buy_price || this.actTable.data[i].buy_price === '') {
                            this.$Message.error('第' + n + '行的采购单价不能为空');
                            return false;
                        } else if (!reg4.test(this.actTable.data[i].buy_price)) {
                            this.$Message.error('第' + n + '行的采购单价最多保留到小数后四位');
                            return false;
                        } else if (!this.actTable.data[i].buy_num || this.actTable.data[i].buy_num === '') {
                            this.$Message.error('第' + n + '行的采购数量不能为空');
                            return false;
                        } else if (parseInt(this.actTable.data[i].buy_num) <= parseInt(0) || parseInt(this.actTable.data[i].buy_num) > (parseInt(this.actTable.data[i].requisition_num) - parseInt(this.actTable.data[i].buyed_num))) {
                            this.$Message.error('第' + n + '行的采购数量不能小于等于0，且不能大于申请数量和已采购适量之差');
                            return false;
                        } else if (!this.actTable.data[i].buy_leadtime || this.actTable.data[i].buy_leadtime === '') {
                            this.$Message.error('第' + n + '行的采购货期不能为空');
                            return false;
                        } else {
                            goodsNewArr.push(this.actTable.data[i]);
                        }
                    }
                    if (goodsNewArr.length != 0) {
                        apiGetPurchaseHtGoodsDetailEdit(this, {
                            buy_order_no: this.htd_id,
                            params: JSON.stringify(goodsNewArr)
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
            /*添加商品*/
            getGoods () {
                apiGetPurchaseReadybuyList(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.addForm.brand == 'all' ? '' : this.addForm.brand,
                        product_order_no: this.addForm.order,
                        product_model: this.addForm.model,
                        requisition_no: this.addForm.from_djbh,
                        product_name: this.addForm.name,
                        sell_order_no: this.addForm.sell_order_no,
                        date_from: this.addForm.datetime[0],
                        date_to: this.addForm.datetime[1],
                        create_user: this.addForm.creater,
                        buy_user_no: this.addForm.buyer == 'all' ? '' : this.addForm.buyer,
                        order_type: this.addForm.type == 'all' ? '' : this.addForm.type,
                        supplier_no: this.form.supplier_no,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        rel_order_type: this.addForm.rel_order_type == 'all' ? '' : this.addForm.rel_order_type,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.buy_leadtime = 1;
                            item.expect_leadtime = '';
                        });
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            addGoods () {
                this.goodsModal = true;
                this.multipleSelection = [];
                this.getGoods();
            },
            goodsCancel () {
                this.goodsModal = false;
            },
            modal (name) {
                if (name === 'del') {
                    this.publicModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'delcancel';
                    this.publicSure = 'delsure';
                    this.loadding = false;
                } else if (name === 'tj') {
                    if (this.is_edit && this.is_htxx && this.edit_goods ) {
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
                    apiGetPurchaseHtDelete(this, {
                        buy_order_no: this.htd_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            util.openNewPage(this, 'purchase_manage_HT_index');
                            this.$router.push({
                                name: 'purchase_manage_HT_index'
                            });
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    this.overgoods = [];
                    for (let i in this.actTable.data) {
                        if( this.multiply(this.actTable.data[i].requisition_price, 0.97, 4) < this.actTable.data[i].buy_price){
                            this.overgoods.push({
                                product_order_no:this.actTable.data[i].product_order_no,
                                product_model:this.actTable.data[i].product_model,
                                requisition_price:this.actTable.data[i].requisition_price,
                                buy_price:this.actTable.data[i].buy_price,
                            })
                        }
                    }
                    if(this.overgoods.length != 0){
                        this.showOver = true;
                    }else{
                        this.SubmitHt();
                    }
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiGetPurchaseHTStatusChange(this, {
                        buy_order_no: this.htd_id,
                        operate_type: 'invalid'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getData();
                            this.getTask();
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loadding = false;
                    });
                } else if (name === 'spcancel') {
                    this.publicModal = false;
                } else if (name === 'spsure') {
                    purchaseManageApproveAction(this, {
                        order_no: this.htd_id,
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
                    apiGetPurchaseHTStatusChange(this, {
                        buy_order_no: this.htd_id,
                        operate_type: 'backspace'
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

            SubmitHt(){
                this.loadding = true;
                apiGetPurchaseHTStatusChange(this, {
                    buy_order_no: this.htd_id,
                    operate_type: 'submit'
                }).then(res => {
                    if (res && res.status == 1) {
                        this.showOver = false;
                        this.publicModal = false;
                        this.loadding = false;
                        this.getData();
                        this.getTask();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
//            stockChoose (val) {
//                for (let i in this.stockList) {
//                    if (this.stockList[i].ckbh === val) {
//                        this.addressForm.ckfzr = this.stockList[i].ckfzr;
//                        this.addressForm.sjhm = this.stockList[i].sjhm;
//                    }
//                }
//            },
            zfChoose (val) {
                if (val == 0) {
                    this.isDis = false;
                    this.stockArr = [];
                    this.stockList.forEach(item => {
                        item.value = item.ckbh;
                        item.label = item.ckmc;
                        this.stockArr.push(item);
                    });
                    this.form.stock = '';
                    this.form.goods_lxr = '';
                    this.form.goods_sjhm = '';
                } else {
                    this.stockArr = [{
                        value: '888',
                        label: '虚拟仓库'
                    }];
                    this.addressForm.ckbh = '888';
                    this.addressForm.ckfzr = '';
                    this.addressForm.sjhm = '';
                    this.isDis = true;
                }
            },
            gysChoose (val) {
                for (let i in this.supperAll) {
                    if (this.supperAll[i].supplier_no === val) {
                        this.form.gyslxr = this.supperAll[i].lxr;
                        this.form.gyslxhm = this.supperAll[i].sjhm;
                    }
                }
            },
            addressChoose (val, cot) {
                if (cot.length == 2) {
                    this.addressForm.province_name = cot[0].label;
                    this.addressForm.province_no = cot[0].value.toString();
                    this.addressForm.city_name = cot[1].label;
                    this.addressForm.city_no = cot[1].value.toString();
                    this.addressForm.district_name = '';
                    this.addressForm.district_no = '';
                } else {
                    this.addressForm.province_name = cot[0].label;
                    this.addressForm.province_no = cot[0].value.toString();
                    this.addressForm.city_name = cot[1].label;
                    this.addressForm.city_no = cot[1].value.toString();
                    this.addressForm.district_name = cot[2].label;
                    this.addressForm.district_no = cot[2].value.toString();
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件：' + file.name + ' 格式不正确',
                    desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.error({
                    title: '文件：' + file.name + ' 上传失败',
                    desc: '文件' + file.name + '不能超过10M'
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                        this.htInfo.file = response.data;
                        this.htInfo.name = file.name;
                        this.$Notice.success({
                            title: '文件上传成功',
                            desc: '文件 ' + file.name + ' 上传成功。'
                        });
                    } else {
                        this.$Notice.error({
                            title: '文件：' + file.name + ' 上传失败',
                            desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                        });
                    }
            },
            zkChange (zk, index) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                if (!reg.test(zk)) {
//                    zk = (+zk).toFixed(3);
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购折扣小数点最多为3位');
                } else if (parseInt(zk * 1000) > 10000) {
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购折扣不能大于10');
                }
            },
            djChange (dj, index) {
                var reg = /^\d+\.?(\d{1,4})?$/;
                if (!reg.test(dj)) {
                    this.$Message.error('第' + parseInt(index + 1) + '行 的采购单价小数点最多为4位');
//                    dj = (+dj).toFixed(4) ;
//                    return dj;
                }
            },
            cgNum (n, m, f, index) {
                var sub = parseInt(n) - parseInt(m);
                var n = parseInt(index) + parseInt(1);
                if (parseInt(f) <= 0) {
                    this.$Message.error('第' + n + '行 的采购数量必须大于0');
                    return false;
                } else if (parseInt(f) > parseInt(sub)) {
                    this.$Message.error('第' + n + '行 的采购数量必须小于申请数量和待采购数量之差');
                    return false;
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                if (column.prop == 'product_order_no') {
                    //对于字符串和数字混着写的列排序，统一按照字符串排序
                    this.actTable.data.sort(specialSortBy(column.prop, isDec));
                } else {
                    this.actTable.data.sort(sortBy(column.prop, isDec));
                }
            },
            //排序
            manualSort1 (column) {
                let isDec = column.order == "descending" ? true : false;
                if (column.prop == 'product_order_no') {
                    //对于字符串和数字混着写的列排序，统一按照字符串排序
                    this.orderData.data.sort(specialSortBy(column.prop, isDec));
                } else {
                    this.orderData.data.sort(sortBy(column.prop, isDec));
                }
            },
            payRecordSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.payForm.pay_info.sort(sortBy(column.prop, isDec));
            },
            returnRecordSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.payForm.return_info.sort(sortBy(column.prop, isDec));
            },
            readySendSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.shipInfo.wait_ship.sort(sortBy(column.prop, isDec));
            },
            sendRecordSort (column, i) {
                // console.log(column, i);
                let isDec = column.order == "descending" ? true : false;
                this.shipInfo.has_ship.list[i].sort(sortBy(column.prop, isDec));
            },
            editTableSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.editInfo.product_info.sort(sortBy(column.prop, isDec));
            },
            readyRecSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.invoiceInfoTmp.wait_invoice_details.sort(sortBy(column.prop, isDec));
            },
            ReceiveInvSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.invoiceInfoTmp.invoice_record.invoiceDetails.sort(sortBy(column.prop, isDec));
            },
            tpRecordSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.invoiceInfoTmp.back_invoice_record.invoiceDetails.sort(sortBy(column.prop, isDec));
            },
            thRecordSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thRecord.product_info.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            search () {
                this.currentPage = 1;
                this.getGoods();
            },
            reset () {
                this.addForm.brand = 'all';
                this.addForm.name = '';
                this.addForm.order = '';
                this.addForm.model = '';
                this.addForm.from_djbh = '';
                this.addForm.type = 'all';
                this.addForm.creater = '';
                this.addForm.buyer = 'all';
                this.addForm.sell_order_no = '',
                this.addForm.datetime = [];
                this.search();
            },
            tabDetail (name) {
                if (name === 'tab0') {
                    this.getData();
                } else if (name === 'tab1') {
                    this.getPayInfo();
                } else if (name === 'tab2') {
                    this.getShipInfo();
                } else if (name === 'tab3') {
                    this.getEditInfo();
                } else if (name === 'tab4') {
                    this.getInvoice();
                } else if (name === 'tab5') {
                    this.getReturnInfo();
                }
            },
            datetime (time) {
                this.addForm.datetime = time;
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getGoods();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getList();
            this.getData();
            this.getTask();
//            console.log(Cookies.get('user_no'));
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
