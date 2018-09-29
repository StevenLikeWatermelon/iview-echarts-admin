<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
</style>
<!-- 客服的销售合同单详情页面是公用页面，另加按钮或者模块，需要考虑角色的权限问题 -->
<template>
    <div>
        <Tabs :animated="false" @on-click="tabDetail" v-model="changeTab">
            <TabPane label="合同单详情" name="tab0">
                <Row>
                    <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            单据基本信息
                            <span v-show="limit_edit" v-auth="serviceShow">  <!-- v-auth="serviceShow" -->
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('djxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('djxxcancel')">取消</Button>
                                    <Button type="primary" @click="close('djxxsave')">保存</Button>
                                </span>
                            </span>
                        </p>
                        <Form ref="basicInfoForm" :model="xshtdDetail" :rules="basicInfoRules">
                            <Row>
                                <Col span="6">
                                <FormItem label="销售合同单编号：" style="margin:0;">
                                    {{ xshtdDetail.djbh }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="下单时间：" style="margin:0;">
                                    {{ xshtdDetail.djrq }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="订单状态：" style="margin:0;">
                                    {{ orderStatus[xshtdDetail.xshtdzt] }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="支付状态：" style="margin:0;">
                                    {{ payStatus[xshtdDetail.khzfzt] }}
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="订单金额：" style="margin:0;">
                                    {{ xshtdDetail.ddje | toDecimal }}
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                    <FormItem label="物流金额：" prop="wlje" style="margin:0;" >
                                        <Input v-model="xshtdDetail.wlje" style="width: 100px;height:25px;"  v-if="str_shown"></Input>
                                        <span v-else>{{ xshtdDetail.wlje | toDecimal }}</span>
                                    </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="物流优惠金额：" prop="ship_free_amount" style="margin:0;" >
                                    <Input v-model="xshtdDetail.ship_free_amount" style="width: 100px;height:25px;"  v-if="str_shown"></Input>
                                    <span v-else>{{ xshtdDetail.ship_free_amount | toDecimal }}</span>
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                    <FormItem label="优惠金额：" prop="yhje" style="margin:0;" >
                                        <Input v-model="xshtdDetail.yhje" style="width: 100px;height:25px;" v-if="str_shown"></Input>
                                        <span v-else>{{ xshtdDetail.yhje | toDecimal }}</span>
                                    </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="应付金额：" style="margin:0;">
                                    {{ (parseFloat(xshtdDetail.ddje).toFixed(2) * 100 + parseFloat(xshtdDetail.wlje).toFixed(2) * 100 - parseFloat(xshtdDetail.yhje).toFixed(2) * 100 - parseFloat(xshtdDetail.ship_free_amount).toFixed(2) * 100) / 100 | toDecimal }}
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="实付金额：" style="margin:0;">
                                    {{ xshtdDetail.sfje | toDecimal }}
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="本次积分：" style="margin:0;">
                                    {{ (parseFloat(xshtdDetail.ddje).toFixed(2) * 100 + parseFloat(xshtdDetail.wlje).toFixed(2) * 100 - parseFloat(xshtdDetail.yhje).toFixed(2) * 100) / 1000 | toInt }}
                                </FormItem>
                                </Col>
                                <Col span="6" :class="str_shown ? 'margin-top-20' : '' ">
                                <FormItem label="团购单编号：" style="margin:0;" v-if="xshtdDetail.tgorder_no">
                                    {{ xshtdDetail.tgorder_no }}
                                </FormItem>
                                </Col>
                            </Row>
                            <Row class="margin-top-10" style="border-top:1px dashed #d4d4d4;padding-top:16px;">
                                <Col span="6" v-if="xshtdDetail.xjdbh">
                                <FormItem label="询价单编号：" style="margin:0;">
                                    {{ xshtdDetail.xjdbh}}
                                </FormItem>
                                </Col>
                                <Col span="6" v-if="xshtdDetail.xy_ht_id">
                                <FormItem label="新阳合同单号：" style="margin:0;">
                                    {{ xshtdDetail.xy_ht_id}}
                                </FormItem>
                                </Col>
                                <div class="clear"></div>
                                <Col span="6">
                                <FormItem label="销售人员：" style="margin:0;">
                                    <span v-if="is_edit">{{xshtdDetail.xsyg_ygbh}}/{{ xshtdDetail.xsyg}}</span>
                                    <div v-else>
                                        <span v-auth="selectYg">{{xshtdDetail.xsyg_ygbh}}/{{ xshtdDetail.xsyg}}</span>
                                        <span v-auth="selectManage">
                                             <Select v-model="xshtdDetail.xsyg_ygbh"  placeholder="请选择" style="width:150px;" filterable>
                                                <Option v-for="staff in all_Sales" :value="staff.ygbh" :key="staff.ygbh">{{ staff.ygxm }}</Option>
                                            </Select>
                                        </span>
                                    </div>
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="销售部门：" style="margin:0;">
                                    {{ xshtdDetail.xsygbm}}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客服人员：" style="margin:0;">
                                    <span v-if="is_edit">{{xshtdDetail.czyg_ygbh}}/{{ xshtdDetail.czyg}}</span>
                                    <div v-else>
                                        <span v-auth="selectYg">{{xshtdDetail.czyg_ygbh}}/{{ xshtdDetail.czyg}}</span>
                                        <span v-auth="selectManage">
                                            <Select v-model="xshtdDetail.czyg_ygbh"  placeholder="请选择" style="width:150px;" filterable>
                                                <Option v-for="staff in allKf" :value="staff.czyg_ygbh" :key="staff.czyg_ygbh">{{ staff.czyg }}</Option>
                                            </Select>
                                        </span>
                                    </div>
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客服部门：" style="margin:0;">
                                    {{ xshtdDetail.czygbm}}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="客户留言：" style="margin:0;">
                                    {{ xshtdDetail.customer_message}}
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
                            客服备注
                            <span v-auth="kfbzEditLimit"  v-show="limit_edit || kfbzEdit2">
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_kfbz" @click="edit('kfbz')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('kfbzcancel')">取消</Button>
                                    <Button type="primary" @click="close('kfbzsave')">保存</Button>
                                </span>
                            </span>
                        </p>
                        <Form :label-width="120">
                            <Row>
                                <Col span="24">
                                <FormItem label="客服备注：" style="margin:0;">
                                    <Input v-model="xshtdDetail.djbz" type="textarea" style="width: 80%;" v-if="!is_kfbz"></Input>
                                    <span v-else>{{ xshtdDetail.djbz}}</span>
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
                            <span v-auth="customShow">
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="khxxIs_edit" @click="edit('khxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('khxxcancel')">取消</Button>
                                    <Button type="primary" @click="close('khxxsave')">保存</Button>
                                </span>
                            </span>
                        </p>
                        <Form :label-width="120">
                            <Row>
                                <Col span="6">
                                <FormItem label="客户编号：" style="margin:0;">
                                    {{ xshtdDetail.khbh }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客户名称：" style="margin:0;">
                                    <Input v-model="xshtdDetail.khmc" style="width:100%;" disabled v-if="!is_khxx"></Input>
                                    <span v-else>{{ xshtdDetail.khmc }}</span>
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客户联系人：" style="margin:0;">
                                    {{ xshtdDetail.lxr}}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客户联系方式：" style="margin:0;">
                                    {{ xshtdDetail.sjhm }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="所属销售：" style="margin:0;">
                                    {{xshtdDetail.kh_xsyg_ygbh}}/{{ xshtdDetail.kh_xsyg }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="销售所属部门：" style="margin:0;">
                                    {{ xshtdDetail.kh_xsygbm }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="所属客服：" style="margin:0;">
                                    {{xshtdDetail.kh_czyg_ygbh}}/{{ xshtdDetail.kh_czyg }}
                                </FormItem>
                                </Col>
                                <Col span="6">
                                <FormItem label="客服所属部门：" style="margin:0;">
                                    {{ xshtdDetail.kh_czygbm }}
                                </FormItem>
                                </Col>
                                <Col span="6">
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
                            收货信息
                            <span v-show="xshtdDetail.xshtdzt == 0 || xshtdDetail.xshtdzt == 7" v-auth="receiveGoodsLimit">
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="shxxIs_edit" @click="edit('shxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('shxxcancel')">取消</Button>
                                    <Button type="primary" @click="close('shxxsave')">保存</Button>
                                </span>
                            </span>
                        </p>
                        <Form>
                            <Row v-if="shxxIs_edit">
                                <Col span="8">
                                <FormItem label="发货方式：" style="margin:0;">
                                    {{ xshtdDetail.fhfsmc }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="收货人：" style="margin:0;">
                                  {{ xshtdDetail.shrxm }}
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="收货人联系方式：" style="margin:0;">
                                   {{ xshtdDetail.shrsjhm }}
                                </FormItem>
                                </Col>
                                <Col span="24">
                                <FormItem label="收货地址：" style="margin:0;">
                                    {{ xshtdDetail.shsfmc }}&nbsp;{{xshtdDetail.shsqmc}}&nbsp;{{xshtdDetail.shxqmc}}&nbsp;{{xshtdDetail.shxxdz}}
                                </FormItem>
                                </Col>
                            </Row>
                            <!--修改-->
                            <Row v-else>
                                <Col span="24">
                                <FormItem label="发货方式：" style="margin:0;">
                                    <Select v-model="xshtdDetail.fhfsmc" style="width: 200px;" @on-change="sendwaysChange">
                                        <Option v-for="(value, key) in send_ways" :value="value" :key="value">{{ value }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-10">
                                <FormItem label=" 收 货 人 ：" style="margin:0;">
                                    <Input v-model="xshtdDetail.shrxm" style="width: 200px;" :disabled = "xshtdDetail.fhfs === '自提' || receInfo"></Input>
                                </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-10">
                                <FormItem label="联系方式：" style="margin:0;">
                                    <span v-if="shxxIs_edit">{{ xshtdDetail.shrsjhm }}</span>
                                    <Input v-model="xshtdDetail.shrsjhm" style="width: 200px;" :disabled = "xshtdDetail.fhfs === '自提' || receInfo"></Input>
                                </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-10">
                                <FormItem label="收货地址：" style="margin:0;">
                                    <Cascader :data="address.data" :value="address.value2" filterable style="width:300px;float:left;" :disabled = "xshtdDetail.fhfs === '自提' || receInfo" @on-change="selectAddress"></Cascader>
                                </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-10">
                                <FormItem label=" 详细地址 ：" style="margin:0;">
                                    <Input v-model="xshtdDetail.shxxdz" style="width: 300px;" :disabled = "xshtdDetail.fhfs === '自提' || receInfo"></Input>
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
                            商品明细
                            <span v-show="xshtdDetail.xshtdzt == 0 || xshtdDetail.xshtdzt == 7 || xshtdDetail.xshtdzt == 3 || xshtdDetail.xshtdzt == 4" v-auth="goodsDetailLimit">
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="goodsIs_edit" @click="edit('spmx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('spmxcancel')">取消</Button>
                                    <Button type="primary" :loading="loadding" @click="close('spmxsave')">保存</Button>
                                </span>
                            </span>
                        </p>
                        <Form>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;">合同总数量：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{htzsl}}</em></span>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">订单金额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{xshtdDetail.ddje | toDecimal}}</em></span>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">物流金额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{xshtdDetail.wlje | toDecimal}}</em></span>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">物流优惠金额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{xshtdDetail.ship_free_amount | toDecimal}}</em></span>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">优惠金额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{xshtdDetail.yhje | toDecimal}}</em></span>
                            <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">应付金额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{xshtdDetail.yfje | toDecimal}}</em></span>
                            <el-table :data="goods_detail" border stripe style="text-align: center"  max-height="500"  @sort-change="manualSort">
                                <el-table-column show-overflow-tooltip type="index" label="行号" fixed="left"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" sortable="custom" min-width="120" fixed="left"  ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" sortable="custom" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" sortable="custom" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxl" label="系列" sortable="custom" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpmj" label="商品面价" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <div>
                                            <span> {{ parseFloat(scope.row.cpmj).toFixed(2) }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="cert_price" label="认证单价" sortable="custom" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="htzk" label="合同单价" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.htdj" v-if="!goodsIs_edit && xshtdDetail.xshtdzt != 4 && !has_change_order" @on-change="scope.row.htzk = (Math.ceil(parseFloat(scope.row.htdj / scope.row.cpmj).toFixed(4) * 1000) / 1000).toFixed(3)" @on-blur="djChange(scope.row.htdj, scope.row.cpdhh)"></Input>
                                        <span v-else> {{ parseFloat(scope.row.htdj).toFixed(2) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="合同折扣" prop="htdj" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.htzk" v-if="!goodsIs_edit && xshtdDetail.xshtdzt != 4 && xshtdDetail.xshtdzt != 3 && !has_change_order" @on-change="scope.row.htdj = (Math.ceil(parseFloat(scope.row.htzk * scope.row.cpmj).toFixed(3) * 100) / 100).toFixed(2)" @on-blur="zkChange(scope.row.htzk, scope.row.cpdhh)"></Input>
                                        <span v-else> {{ parseFloat(scope.row.htzk).toFixed(3) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_avg_price" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip label="合同数量" prop="htsl" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.htsl" v-if="!goodsIs_edit && xshtdDetail.xshtdzt != 4 && xshtdDetail.xshtdzt != 3 && !has_change_order" @on-change="changeHtsl(scope.row.htsl, scope.$index)"></Input>
                                        <span v-else> {{ parseInt(scope.row.htsl) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="未出库数量" prop="dcksl" sortable="custom" min-width="130">
                                    <template slot-scope="scope">
                                        <span> {{ scope.row.dcksl }}</span>
                                        <!-- parseInt(scope.row.htsl) - parseInt(scope.row.stock_num_out) -->
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="onstock_lock" label="现货锁库" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="onwaystock_lock" label="在途锁库" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip label="锁库数量" prop="locking" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="goodsIs_edit">
                                            <span v-if="parseInt(scope.row.locking) > 0" @click="toDo('showStockLockRecordsModal',scope.$index)" style="color: rgb(45, 140, 240);cursor: pointer;"> {{ parseInt(scope.row.locking) }}</span>
                                            <span v-if="parseInt(scope.row.locking) == 0"> {{ parseInt(scope.row.locking) }}</span>
                                        </span>
                                        <Input v-model="scope.row.locking" @on-blur="lockingLimit(scope.row.locking, scope.row.htsl, scope.row.stock, scope.row.stock_num_out)" v-else></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="ready_req" label="待请购数量" sortable="custom" min-width="130"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="req_num" label="已请购数量" sortable="custom" min-width="130"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="stock" label="可用库存" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip label="货期" prop="hthq" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.hthq" v-if="!goodsIs_edit"></Input>
                                        <span v-else> {{ scope.row.hthq }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="小计" prop="htje" sortable="custom" min-width="120">
                                    <template slot-scope="scope">
                                        <span v-if="goodsIs_edit"> {{ parseFloat(scope.row.htje).toFixed(2) }}</span>
                                        <span v-else>{{ parseFloat(scope.row.htdj * scope.row.htsl).toFixed(2) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="操作" v-if="!goodsIs_edit && xshtdDetail.xshtdzt != 4 && xshtdDetail.xshtdzt != 3  && !has_change_order">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="goodsDelete(scope.$index, goods_detail)">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <Row v-if="!goodsIs_edit && (xshtdDetail.xshtdzt == 0 || xshtdDetail.xshtdzt == 7 || xshtdDetail.xshtdzt == 3) && !has_change_order" class="margin-top-20">
                                <Col span="6">
                                <FormItem style="margin:0;">
                                    <Input type="textarea" v-model="goods_newdhh"></Input>
                                </FormItem>
                                </Col>
                                <Col span="6" class="padding-left-20 margin-top-10">
                                <Button type="primary" @click="addGoods">批量添加</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="default" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                        <span>
                            <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('pass')" v-if="orderPassLimit">审核通过</Button>
                            <!-- <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('xytb')" v-if="!xshtdDetail.xy_ht_id && xshtdDetail.xshtdzt != 7 && xshtdDetail.xshtdzt != 6 && xshtdDetail.xshtdzt != 10">新阳同步</Button>
                            <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('xysc')" v-if="xshtdDetail.xy_ht_id">新阳删除</Button> -->
                            <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('jhdd')" v-if="orderActiveLimit">激活订单</Button>
                            <Button type="warning" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('zf')" v-if="orderThrowLimit">作废</Button>
                           <!--  <Button type="error" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toDo('kjkc')" v-if="xshtdDetail.unlock_status == 0">扣减库存</Button> -->
                            <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="download(xshtdDetail.djbh)" v-if="orderDownloadLimit">合同下载</Button>
                            <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="toApplyReturn(xshtdDetail.djbh)" v-if="orderCanReturn">申请售后</Button>
                            <Button type="primary" v-auth="htddetailExport" class="margin-left-20" @click="exportList">导出</Button>


                        </span>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="收款信息" name="tab1">
                <div v-if="isSkxxShow">
                    <Row>
                        <Col span="24">
                        <Card>
                            <p slot="title" class="card-title">待付款信息
                                <span style="color: rgb(45, 140, 240);cursor: pointer;float:right;font-weight:normal;" @click="edit('skxx')" v-show="payForm.can_receipt" v-auth="orderGatherLimit">收款</span>
                            </p>
                            <Form :label-width="120">
                                <Row>
                                    <Col span="8">
                                    <FormItem label="应付金额：" style="margin:0;">
                                        {{ payForm.must_total | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="退货总额：" style="margin:0;">
                                        {{ payForm.return_total | toDecimal }}
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8">
                                    <FormItem label="待支付金额：" style="margin:0;">
                                        {{ payForm.to_pay_total | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="16" class="padding-left-20">
                                    <p style="color:#8a8a8a;font-size:12px;margin-left:10px;"><Icon type="information-circled" style="color:#2d8cf0;margin-right:8px;"></Icon>待支付金额 =（应付金额-退货总额）-（已付总额 - 已退总额）- 待确认退款总额</p>
                                    <p style="color:#8a8a8a;font-size:12px;margin-left: 29px;">{{payForm.to_pay_total | toDecimal}} = ({{payForm.must_total | toDecimal}} - {{payForm.return_total | toDecimal}}) - ({{payForm.receipt_info.receipted_total | toDecimal}} - {{payForm.refund_info.returned_total | toDecimal}}) - {{payForm.refund_info.to_return_total | toDecimal}}</p>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                        </Col>
                    </Row>
                    <Row class="margin-top-10" v-if="isShowskxx"> <!--v-if="payForm.receipt_info.detail.length > 0"-->
                        <Col span="24">
                        <Card>
                            <p slot="title" class="card-title">收款记录</p>
                            <div class="margin-bottom-10">
                                <span class="margin-left-20">已付总额： <em style="color:#cf0012;font-style: normal;">{{ payForm.receipt_info.receipted_total | toDecimal }}</em></span>
                            </div>
                            <el-table :data="payForm.receipt_info.detail" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip prop="djbh" label="销售收款单编号" min-width="120">
                                    <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.djbh}, 'service-xsskd-detail')">
                                        {{ scope.row.djbh }}
                                    </span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="skfsmc" label="支付方式"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="pzhm" label="收款凭证号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="skje" label="收款金额">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.skje | toDecimal}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="dkrq" label="收款时间" sortable="custom" min-width="150"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="status" label="状态">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status == 0 ">正常</span>
                                        <span v-if="scope.row.status == 1 " style="color:#cf0012;">已作废</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <span v-show="scope.row.status == 0"  style="color: rgb(45, 140, 240);cursor: pointer;" @click="receiveThrow(scope.row.djbh)" v-auth="serviceZfButton">作废</span>
                                        <span v-if="scope.row.status == 1"></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Card>
                        </Col>
                    </Row>
                    <Row class="margin-top-10" v-if="isShowtkxx"> <!--v-if="payForm.refund_info.detail.length > 0"-->
                        <Col span="24">
                        <Card>
                            <p slot="title" class="card-title">退款记录</p>
                            <div class="margin-bottom-10">
                                <span>待确认退款总额： <em style="color:#cf0012;font-style: normal;">{{ payForm.refund_info.to_return_total }}</em></span>
                                <span class="margin-left-20">已退款总额： <em style="color:#cf0012;font-style: normal;">{{ payForm.refund_info.returned_total }}</em></span>
                            </div>
                            <el-table :data="payForm.refund_info.detail" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip prop="refund_no" label="销售退款单编号" width="120">
                                    <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.refund_no}, 'service-xstkd-detail')">
                                        {{ scope.row.refund_no }}
                                    </span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="from_order_type" label="来源单据类型" sortable="custom" width="120">
                                    <template slot-scope="scope">
                                        <span>{{ refundFromType[scope.row.from_order_type] }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="from_order_no" label="来源单据编号" width="120">
                                    <template slot-scope="scope">
                                        <span  @click="handleClick({param: scope.row.from_order_no}, 'service-xsthd-detail')" style="color: rgb(45, 140, 240);cursor: pointer;" v-if="scope.row.from_order_type == 1">{{scope.row.from_order_no}}</span>
                                        <span  @click="handleClick({param: scope.row.from_order_no}, 'service-htxgd-detail')" style="color: rgb(45, 140, 240);cursor: pointer;" v-if="scope.row.from_order_type == 2">{{scope.row.from_order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_total" label="退款金额"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="create_time" label="退款时间" sortable="custom" width="150"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="refund_status" label="状态" sortable="custom">
                                    <template slot-scope="scope">
                                        <span>{{ reFoundStatus[scope.row.refund_status] }}</span>
                                    </template>
                                </el-table-column>
                                <!--<el-table-column show-overflow-tooltip prop="pay_way" label="退款方式" ></el-table-column>-->
                                <!--<el-table-column show-overflow-tooltip prop="pay_identity" label="交易凭证号" ></el-table-column>-->
                            </el-table>
                        </Card>
                        </Col>
                    </Row>
                </div>
                <div v-else>
                    <Row class="margin-top-10">
                        <Col span="24">
                        <Card>
                            <p slot="title" class="card-title">
                                <span>收款</span>
                            </p>
                            <Form :label-width="120" ref="receiveForm" :model="skxx" :rules="receiveRules"> <!---->
                                <Row>
                                    <Col span="24">
                                    <FormItem label="收款方式：" style="margin:0;">
                                        <Select v-model="skxx.skfs" style="width: 200px;" disabled="true">
                                            <Option v-for="(value, key) in zffs" :value="key" :key="key">{{ value }}</Option>
                                        </Select>
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-20">
                                    <FormItem label="应付金额：" style="margin:0;">
                                        <span style="font-size:16px;color: #cf0012;">{{ payForm.must_total | toDecimal}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-20">
                                    <FormItem label="未付款金额：" style="margin:0;">
                                        <span style="font-size:16px;color: #cf0012;">{{payForm.to_pay_total | toDecimal}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-20">
                                    <FormItem label="本次收款金额：" style="margin:0;" prop="skje" class="redRequire">
                                        <Input v-model="skxx.skje" style="width: 200px;" ></Input>
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-20">
                                    <FormItem label="当前资金池余额：" style="margin:0;">
                                        {{ payForm.funds_can_total | toDecimal }}
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-20">
                                    <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:120px;" :loading="loadding3" @click="saveSkxx">保存</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                        </Col>
                    </Row>
                </div>
                <Row style="margin-top: 68px;"></Row>
                <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
                    <Col span="24">
                    <Card>
                        <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    </Card>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="出库信息" name="tab2">
                <Row>
                    <Col span="24"  v-if="ckmx.data.length == 0 && ckmx.hasData.length == 0">
                    <Card>
                        <p slot="title" class="card-title">出库商品</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                    <Col span="24" v-if="ckmx.data.length > 0 ">
                    <Card>
                        <p slot="title" class="card-title">
                            待出库商品明细
                            <span  v-auth="orderDeliverLimit" v-show="xshtdDetail.xshtdzt != 5">
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="edit('ckmx')" v-if="ckIs_edit">出库</span>
                                <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('ckmxcancel');getCkInfo()">取消</Button>
                                    <Button type="primary" @click="close('ckmxsave')" :loading="loadding2">保存</Button>
                                </span>
                            </span>
                        </p>
                        <div>
                            <el-table :data="ckmx.data" border stripe style="text-align: center" v-if="ckIs_edit" @sort-change="ckmxDataSort">
                                <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" sortable="custom" width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" sortable="custom" width="100" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" sortable="custom" min-width="150"  ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxl" label="系列" sortable="custom" min-width="120"  ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" sortable="custom" min-width="120"  ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="has_out_num" label="已出库数量" sortable="custom" width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="can_ck" label="待出库数量" sortable="custom" width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip label="到款比例">
                                    <template slot-scope="scope">
                                        <span> {{ arrive_funds_rate }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="ckmc" label="锁库仓库" sortable="custom" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="area_name" label="库区" sortable="custom" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="seat_name" label="库位" sortable="custom" ></el-table-column>
                                <el-table-column show-overflow-tooltip label="出库单价" prop="return_avg_price" sortable="custom" min-width="100"></el-table-column>
                            </el-table>
                            <Form :label-width="120" ref="ckmxForm" :model="ckmx" :rules="ckmxRules" v-else>
                                <Col span="8" >
                                <FormItem label="发货方式：" style="margin:0;" @on-change="changeShip">
                                    <Select v-model="ckmx.fhfs" >
                                        <Option v-for="(value, key) in send_ways" :value="key" :key="key">{{ value }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <Col span="8">
                                <FormItem label="发货物流：" style="margin:0;" prop="fhwl">
                                    <Select v-model="ckmx.fhwl">
                                        <Option v-for="val in fhwl" :value="val.fhwlbh" :key="val.fhwlbh">{{ val.fhwlmc }}</Option>
                                    </Select>
                                </FormItem>
                                </Col>
                                <!--<Col span="8" class="margin-top-10" v-if="false">-->
                                <!--<FormItem label="快递单号：" style="margin:0;">-->
                                    <!--<Input v-model="ckmx.kddh"></Input>-->
                                <!--</FormItem>-->
                                <!--</Col>-->
                                <Col span="8">
                                <FormItem label="收货人：" style="margin:0;" prop="shr">
                                    <Input v-model="ckmx.shr"></Input>
                                </FormItem>
                                </Col>
                                <Col span="8" class="margin-top-20">
                                <FormItem label="收货地址：" style="margin:0;" prop="address">
                                    <Cascader :data="address.data" filterable :value="ckmx.address" style="width:100%;" @on-change="selectRecAddress"></Cascader>
                                </FormItem>
                                </Col>
                                <Col span="8" class="margin-top-20">
                                <FormItem label="详细地址：" style="margin:0;" prop="xxdz">
                                    <Input v-model="ckmx.xxdz"></Input>
                                </FormItem>
                                </Col>
                                <Col span="8" class="margin-top-20">
                                <FormItem label="收货人联系方式：" style="margin:0;" prop="phone">
                                    <Input v-model="ckmx.phone"></Input>
                                </FormItem>
                                </Col>
                                <Col span="16" class="margin-top-20">
                                <FormItem label="备注：" style="margin:0;" prop="note">
                                    <Input type="textarea" v-model="ckmx.note"></Input>
                                </FormItem>
                                </Col>
                                <Col span="16" class="margin-top-20">
                                <FormItem label="装箱单备注：" style="margin:0;" prop="note">
                                    <Input type="textarea" v-model="ckmx.ship_note" placeholder="此备注信息会打印到客户收货回执单，请谨慎填写"></Input>
                                </FormItem>
                                </Col>
                                <div class="clear"></div>
                                <Col span="24" style="margin-top: 10px;">
                                    <span style="padding-left: 20px;">出库总金额：</span>
                                    <span style="color:#cf0012;">{{ out_total_amount }}</span>
                                </Col>
                                <el-table :data="ckmx.data" border stripe style="text-align: center" class="margin-top-20" @sort-change="ckmxDataSort">
                                    <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" sortable="custom" min-width="120" ></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" sortable="custom" min-width="100" ></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" sortable="custom" min-width="150" ></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="cpxl" label="系列" sortable="custom" min-width="120" ></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" sortable="custom" min-width="120"></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="has_out_num" label="已出库数量" sortable="custom" min-width="120"></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="can_ck" label="待出库数量" sortable="custom" min-width="120"></el-table-column>
                                    <el-table-column show-overflow-tooltip label="本次出库数量" prop="bccksl" min-width="120">
                                        <template slot-scope="scope">
                                            <Input v-model="scope.row.bccksl" @on-change="ckNow(scope.row.bccksl, scope.row.can_ck)"></Input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="percent" label="到款比例" sortable="custom" min-width="100">
                                        <template slot-scope="scope">
                                            <span> {{ arrive_funds_rate }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip label="出库单价" prop="return_avg_price" sortable="custom" min-width="100">
                                        <template slot-scope="scope">
                                            <span> {{ parseFloat(scope.row.return_avg_price).toFixed(4) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip label="出库金额" prop="htzj" sortable="custom" min-width="120">
                                        <template slot-scope="scope">
                                            <span> {{ parseFloat(scope.row.bccksl * scope.row.return_avg_price).toFixed(4) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="ckmc" label="锁库仓库" sortable="custom" min-width="120" ></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="area_name" label="库区" sortable="custom"></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="seat_name" label="库位" sortable="custom"></el-table-column>
                                    <el-table-column show-overflow-tooltip label="操作">
                                        <template slot-scope="scope">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="goodsDelete(scope.$index, ckmx.data);calcOutTotalAmount()">删除</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </Form>
                        </div>
                    </Card>
                    </Col>
                    <Col span="24" v-for="val in ckmx.hasData" v-if="ckmx.hasData.length > 0">
                    <Card>
                        <p slot="title" class="card-title">
                            已出库商品明细
                        </p>
                        <!--已出库明细-->
                        <div class="border-dashed-top">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="8">
                                    <FormItem label="单据编号：" style="margin:0;">
                                        {{val.info.ckd_djbh}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="出库时间：" style="margin:0;">
                                        {{val.info.djrq}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="状态：" style="margin:0;">
                                        {{xsckd[val.info.ckd_status]}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="出库仓库：" style="margin:0;">
                                        {{val.info.ckmc}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="仓库联系人：" style="margin:0;">
                                        {{val.info.ckfzr}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="发货方式：" style="margin:0;">
                                        {{val.info.fhfsmc}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="发货物流：" style="margin:0;">
                                        {{val.info.fhwlmc}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="快递单号：" style="margin:0;">
                                        {{val.info.hydh}}
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="收货人：" style="margin:0;">
                                        {{val.info.receive_name}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="收货人联系方式：" style="margin:0;">
                                        {{val.info.receive_phone}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="收货地址：" style="margin:0;">
                                        {{val.info.receive_address}}
                                    </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="出库总量：" style="margin:0;">
                                        {{val.info.ckzl}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8" class="margin-top-10">
                                    <FormItem label="出库总金额：" style="margin:0;">
                                        {{val.info.ckzje}}
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-10">
                                    <FormItem label="备注：" style="margin:0;">
                                        {{val.info.note}}
                                    </FormItem>
                                    </Col>
                                    <Col span="24" class="margin-top-10">
                                    <FormItem label="装箱单备注：" style="margin:0;">
                                        {{val.info.ship_note}}
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <el-table :data="val.list" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" sortable></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" sortable ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" sortable min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxl" label="系列" sortable min-width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cksl" label="已出库数量" sortable width="120"></el-table-column>
                                <el-table-column show-overflow-tooltip label="出库单价" prop="ckdj" sortable min-width="100">
                                    <template slot-scope="scope">
                                        <span> {{ parseFloat(scope.row.ckdj).toFixed(4) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="出库金额" prop="ckje" sortable min-width="100">
                                    <template slot-scope="scope">
                                        <span> {{ parseFloat(scope.row.ckje).toFixed(4) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="到款比例">
                                    <template slot-scope="scope">
                                        <span> {{ arrive_funds_rate }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="area_name" label="库区" sortable ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="seat_name" label="库位" sortable ></el-table-column>
                            </el-table>
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
            <TabPane label="退货信息" name="tab3">
                <Row>
                    <Col span="24" v-if="allthdDetail.length == 0">
                    <Card>
                        <p slot="title" class="card-title">退货商品明细</p>
                            <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                    <Col span="24" v-for="(val, index) in allthdDetail" v-else>
                    <Card>
                        <p slot="title" class="card-title">
                            退货商品明细
                        </p>
                        <div class="border-dashed-top">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="8">
                                    <FormItem label="销售退货单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.info.return_no, fromxshtd: '1'}, 'service-xsthd-detail')">{{val.info.return_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="退货申请单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.info.return_apply_no}, 'service-thsqd-detail')">{{val.info.return_apply_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="申请退货时间：" style="margin:0;">
                                        {{val.info.create_time}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="状态：" style="margin:0;">
                                        {{ returnStatus[val.info.return_status]}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="合同总数量：" style="margin:0;">
                                        {{ val.info.order_num }}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="商品总额：" style="margin:0;">
                                        {{val.info.order_price | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="退货商品总数：" style="margin:0;">
                                        {{val.info.return_num }}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="退货商品总额：" style="margin:0;">
                                        {{ parseFloat(val.info.return_price).toFixed(4) }}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="其他金额：" style="margin:0;">
                                        {{val.info.other_amount | toDecimal}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="应退金额：" style="margin:0;">
                                        {{ parseFloat(val.info.must_total).toFixed(4) }}
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <el-table :data="val.list" border stripe style="text-align: center" >
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="100" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_price" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="order_num" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip label="退货金额"  prop="return_amount" sortable="custom" min-width="100"></el-table-column>
                            </el-table>
                            <div v-if="val.workFlow.approval_task"><!---->
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
            <TabPane label="修改信息" name="tab4">
                <Row>
                    <Col span="24" v-if="changeDetail.length == 0">
                    <Card>
                        <p slot="title" class="card-title">修改商品明细</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                    <Col span="24" v-for="(val, index) in changeDetail" v-else>
                    <Card>
                        <p slot="title" class="card-title">
                            修改商品明细
                        </p>
                        <!--请购记录-->
                        <div class="border-dashed-top">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="6">
                                    <FormItem label="合同修改单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.info.order_change_no}, 'service-htxgd-detail')">{{val.info.order_change_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="退货申请单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.info.rel_order_no}, 'service-thsqd-detail')">{{val.info.rel_order_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="申请修改时间：" style="margin:0;">
                                        {{val.info.create_time}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="状态：" style="margin:0;">
                                        {{changeStatusArr[val.info.change_status]}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="合同总数量：" style="margin:0;">
                                        {{val.info.htsl}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="商品总额：" style="margin:0;">
                                        {{val.info.goods_money}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="取消商品总数：" style="margin:0;">
                                        {{val.info.cancel_num}}
                                    </FormItem>
                                    </Col>
                                    <Col span="6">
                                    <FormItem label="取消商品总额：" style="margin:0;">
                                        {{val.info.cancel_total}}
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <el-table :data="val.list" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌"  ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="jldw" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="return_avg_price" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="before_num" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cancel_num" label="取消数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cancel_total" label="取消金额" sortable="custom" min-width="100"></el-table-column>
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
            <TabPane label="请购信息" name="tab5">
                <Row>
                    <Col span="24" v-if="resqusitionInfo.length == 0 && resqusitionRecord.length == 0">
                    <Card>
                        <p slot="title" class="card-title">待请购商品明细</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                    <Col span="24" v-if="resqusitionInfo.length != 0">
                    <Card>
                        <p slot="title" class="card-title">
                            待请购商品明细
                            <span>
                                <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="toQGD" v-if="isShowToQg">生成请购单</span>
                            </span>
                        </p>
                        <div>
                            <el-table :data="resqusitionInfo" border stripe style="text-align: center" @sort-change="readyQgDataSort">
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="jldw" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="requisition_num" label="待请购数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="stock" label="可用库存" min-width="100"></el-table-column>
                            </el-table>
                        </div>
                    </Card>
                    </Col>
                    <Col span="24" v-for="(val, index) in resqusitionRecord">
                    <Card>
                        <p slot="title" class="card-title">
                            请购记录
                        </p>
                        <!--请购记录-->
                        <div class="border-dashed-top">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="8">
                                    <FormItem label="销售请购单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.requisition_no}, 'service-sales-xsqgd-detail')">{{val.requisition_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="请购时间：" style="margin:0;">
                                        {{val.create_time}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="状态：" style="margin:0;">
                                        {{val.requisition_status}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="请购商品总数：" style="margin:0;">
                                        {{val.requisition_count}}
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <el-table :data="val.detail" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="requisition_num" label="请购数量" sortable="custom" min-width="100" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="stock" label="可用库存" min-width="100" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrive_funds_rate" label="到款比例" sortable="custom" min-width="100" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单单号" width="120" >
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.buy_order_no.length == 0"></div>
                                        <el-popover trigger="hover" placement="top" v-else>
                                            <p v-for="val in scope.row.buy_order_no"><span>{{ val }}</span></p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_user_name" label="采购员" width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip label="采购数量" width="100">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getBuyNum(scope.row.id,scope.row.buy_num)">{{scope.row.buy_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="采购发货数量" width="100" >
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getShipNum(scope.row.id,scope.row.ship_num)">{{scope.row.ship_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="采购入库数量" width="100" >
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getInstockNum(scope.row.id,scope.row.instock_num)">{{scope.row.instock_num}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="销售出库数量" width="100" >
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer"@click="getCkNum(scope.row.id,scope.row.cksl)">{{scope.row.cksl}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="val.workFlow.approval_task"><!---->
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
            <TabPane label="开票信息" name="tab6">
                <Row>
                    <Col span="24"  v-if="(toInvoiceData.length == 0 || toInvoiceData === 'null') && invoiceRecord.length == 0">
                    <Card>
                        <p slot="title" class="card-title">待开票商品明细</p>
                        <div style="text-align: center;">未查询到数据</div>
                    </Card>
                    </Col>
                    <Col span="24" v-if="toInvoiceData.length != 0">
                    <Card>
                        <p slot="title" class="card-title">
                            待开票商品明细
                            <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="toInvoice" v-auth="orderInvoiceLimit">开票</span>
                        </p>
                        <div>
                            <el-table :data="toInvoiceData" border stripe style="text-align: center" @sort-change="toInvoiceDataChange">
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="order_num" label="出库数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="toInvoice_num" label="待开票数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_price" label="开票单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_amount" label="开票金额" sortable="custom" min-width="100"></el-table-column>
                            </el-table>
                        </div>
                    </Card>
                    </Col>
                    <Col span="24" v-for="(val, index) in invoiceRecord">
                    <Card>
                        <p slot="title" class="card-title">
                            开票记录
                        </p>
                        <!--开票记录-->
                        <div class="border-dashed-top">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="8">
                                    <FormItem label="开票单编号：" style="margin:0;">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val.invoiceInfo.invoice_no}, 'service-xskpd-detail')">{{val.invoiceInfo.invoice_no}}</span>
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="申请开票时间：" style="margin:0;">
                                        {{val.invoiceInfo.create_time}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="状态：" style="margin:0;">
                                        {{invoiceStatusArr[val.invoiceInfo.invoice_status]}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="开票总数：" style="margin:0;">
                                        {{val.invoiceInfo.totalNum}}
                                    </FormItem>
                                    </Col>
                                    <Col span="8">
                                    <FormItem label="开票商品总额：" style="margin:0;">
                                        {{val.invoiceInfo.totalAmount}}
                                    </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <el-table :data="val.invoiceDetails" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="order_num" label="出库数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_num" label="开票数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_price" label="开票单价" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="invoice_total" label="开票金额" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="khzfzt" label="支付状态" sortable="custome" width="100">
                                    <template slot-scope="scope">
                                        <span>{{payStatus[scope.row.khzfzt]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="xshtdzt" label="订单状态" sortable="custome" width="100">
                                    <template slot-scope="scope">
                                        <span>{{orderStatus[scope.row.xshtdzt]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="销售出库单编号"  min-width="130">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.out_order_no}, 'service-xsckd-detail')"> {{ scope.row.out_order_no }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="销售合同单编号"  min-width="120">
                                    <template slot-scope="scope">
                                        <span> {{ scope.row.sell_order_no }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10" v-if="feeTable.length > 0">
                    <Col span="24">
                        <Card>
                            <p slot="title" class="card-title">
                                运费明细
                            </p>
                            <div>
                                <span style="font-weight:normal;font-size:12px;line-height: 40px;" class="margin-left-20">运费总额：<em style="font-style:normal;color: #cf0012;margin-left:10px;">{{feeAll | toDecimal}}</em></span>
                                <el-table :data="feeTable" border stripe style="text-align: center"  @sort-change="feeTableSort">
                                    <el-table-column show-overflow-tooltip prop="freight_amount" label="运费金额" sortable="custome"></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="invoice_price" label="开票单价" sortable="custome"></el-table-column>
                                    <el-table-column show-overflow-tooltip prop="khzfzt" label="支付状态" sortable="custome">
                                        <template slot-scope="scope">
                                            <span>{{payStatus[scope.row.khzfzt]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="xshtdzt" label="订单状态" sortable="custome">
                                        <template slot-scope="scope">
                                            <span>{{orderStatus[scope.row.xshtdzt]}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip label="销售合同单编号"  min-width="120">
                                        <template slot-scope="scope">
                                            <span> {{ scope.row.sell_order_no }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
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
        </Tabs>
        <!--Modal-弹框公用-->
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
        <!--Modal-退货单退款-->
        <Modal v-model='thTkModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">退款</h3>
            <div class="content">
                <span style="font-size:10px;width:20px;height:20px;line-height: 20px;"><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 20px;font-size:12px;">请确认<em style="font-style: normal;">货物已收回可以退款</em>再确定！</P>
                </span>
                <div class="clear"></div>
            </div>
            <Form :label-width="80" ref="thxxForm" :model="thxx" :rules="thxxRules">
                <Row>
                    <Col span="24" class="margin-top-20">
                    <FormItem label="退款金额：" style="margin:0;">
                        <span style="font-size:16px;color: #cf0012;">{{ thxx.thd_thze | toDecimal}}</span>
                    </FormItem>
                    </Col>
                    <Col span="24" class="margin-top-20">
                    <FormItem label="其他金额：" style="margin:0;" prop="thd_qtje">
                        <Input v-model="thxx.thd_qtje" @on-change="thxx.thd_ytje = parseFloat((parseInt(thxx.thd_thze * 100) + parseInt(thxx.thd_qtje * 100)) / 100).toFixed(2)"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24" class="margin-top-20">
                    <FormItem label="应退金额：" style="margin:0;">
                        <Input v-model="thxx.thd_ytje"  disabled></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="sureAction('thTkcancel')">取消</Button>
                <Button type="primary" @click="sureAction('thTksure')">确定</Button>
            </div>
        </Modal>
        <!--Modal-弹框公用-->
        <Modal v-model='ship_pop' :mask-closable=true :width="450" class="orderForm-approvePass" :closable=true>
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#000;line-height: 40px;">该销售合同单到款比例不为1，确认出库？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancel_ship()">取消</Button>
                <Button type="primary" @click="ok_ship()">确定</Button>
            </div>
        </Modal>
        <!--Modal-开票弹框-->
        <Modal v-model='invoiceModal' :mask-closable=true :width="450" :closable=true>
            <h3 slot="header">确认</h3>
            <div class="content">
                <Form>
                    <Row>
                        <Col span="24">
                        <FormItem style="margin:0;text-align:center;" prop="isDefault">
                            <Radio-group v-model="invoice.is_default">
                                <Radio label="2">开增值税普票</Radio>
                                <Radio label="1" class="margin-left-20">开增值税专票</Radio>
                            </Radio-group>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction('invoiceCancel')">取消</Button>
                <Button type="primary" @click="sureAction('invoiceSave')" :loading="loadding">确定</Button>
            </div>
        </Modal>
        <!-- Modal-采购发货单 -->
        <Modal v-model="showShip" title="采购发货单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderShipList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column show-overflow-tooltip label="采购发货单编号" min-width="120" prop="rel_order_no" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="num" label="发货数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="receive_stock_name" label="到货仓库" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_leadtime" label="货期" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="expect_leadtime" label="预计到货日期" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ship_name" label="发货物流" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ship_no" label="物流单号" ></el-table-column>
                        <el-table-column show-overflow-tooltip min-width="120" label="采购员" >
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{ shipStatusObj[scope.row.order_status] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
        <!-- Modal-采购入库单 -->
        <Modal v-model="showInstock" title="采购入库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderInstockList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column show-overflow-tooltip min-width="120" label="采购入库单编号" prop="instock_no" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="num" label="发货数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="store_name" label="到货仓库" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="入库库区" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位" ></el-table-column>
                        <el-table-column show-overflow-tooltip min-width="120" label="采购员" >
                            <template slot-scope="scope">
                                <span>{{scope.row.buy_user_no}} / {{scope.row.buy_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{instockStatusObj[scope.row.instock_status]}}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

        <!--Model - 销售出库单-->
        <Modal v-model="showCk" title="销售出库单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <el-table :data="OrderCkList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column show-overflow-tooltip min-width="120" label="销售出库单单编号" prop="xsckd_djbh" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cksl" label="出库数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckdj" label="出库单价" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckje" label="出库金额" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckmc" label="出库仓库" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="出库库区" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="出库库位" ></el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{xsckdObj[scope.row.status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
        <!-- Modal-采购合同单 -->
        <Modal v-model="showBuy" title="采购合同单" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="OrderBuyList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="采购合同单号" min-width="120" prop="buy_order_no" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="gysmc" label="供应商" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ckmc" label="到货仓库" show-overflow-tooltip></el-table-column>
                    <el-table-column label="单据状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{buyObj[scope.row.order_status]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

        <!-- Modal-锁库详情 -->
        <Modal v-model="showStockLockRecordsModal" width='95' title="锁库详情" footer-hide :mask-closable="false" :loading="showStockLockRecordsLoading" @on-ok="showStockLockRecordsButtonOK">
                <Form :label-width="150">
                    <Row v-if="stockLockRecords.length!=0 && stockLockRecords.sell_goods.length!=0">
                        <Col span="8">
                            <FormItem label="产品型号编号：">
                                <span>{{ stockLockRecords.sell_goods.product_model_no }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="品牌：">
                                <span>{{ stockLockRecords.sell_goods.brand_name }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="订货号：">
                                <span>{{ stockLockRecords.sell_goods.product_order_no }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="产品型号：">
                                <span>{{ stockLockRecords.sell_goods.product_model }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="系列：">
                                <span>{{ stockLockRecords.sell_goods.product_series }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="合同数量：">
                                <span>{{ stockLockRecords.sell_goods.sell_num }}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="未出库数量：">
                                <span>{{ stockLockRecords.sell_goods.sell_num - stockLockRecords.sell_goods.stock_num_out }}</span>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="锁库数量：">
                                <span v-if="stockLockRecord_isedit">{{ stockLockRecords.sell_goods.stock_lock }}</span>
                                <!-- <Input placeholder="锁库数量" v-model="stockLockRecords.sell_goods.stock_lock" @on-blur="lockingLimit(stockLockRecords.sell_goods.stock_lock, stockLockRecords.sell_goods.htsl, stockLockRecords.sell_goods.stock, stockLockRecords.sell_goods.stock_num_out)" v-else></Input> -->
                                <InputNumber :max="stockLockRecords.sell_goods.sell_num - stockLockRecords.sell_goods.stock_num_out" :min="1" :step="1" v-model="stockLockRecords.sell_goods.stock_lock" v-else></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <div style="line-height:32px;">
                                <span v-show="stockLockRecords.is_edit">
                                    <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;" v-if="stockLockRecord_isedit" @click="getSellGoodsLockRecordInfo('edit',stockLockRecords.sell_goods.sell_order_no,stockLockRecords.sell_goods.sell_detail_id)">修改</span>
                                    <span style="font-weight:normal;margin-left:20px;" v-else>
                                        <span style="font-weight:normal;cursor: pointer;" @click="getSellGoodsLockRecordInfo('cancle',stockLockRecords.sell_goods.sell_order_no,stockLockRecords.sell_goods.sell_detail_id)">取消</span>
                                        <span style="font-weight:normal;color: rgb(45, 140, 240);margin-left:20px;cursor: pointer;" :loading="loadding" @click="saveSellGoodsStockLock(stockLockRecords.sell_goods.stock_lock,stockLockRecords.sell_goods.sell_order_no,stockLockRecords.sell_goods.sell_detail_id)">保存</span>
                                    </span>
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <div v-if="stockLockRecords.length!=0 && stockLockRecords.lock_records.length!=0">
                    <Row style="padding:10px 0;">
                        <Col span="24">
                            <el-table :data="stockLockRecords.lock_records" border style="text-align: center">
                                <el-table-column show-overflow-tooltip label="库存ID" prop="stock_id" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="change_type_txt" label="锁库类型" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="supplier_no" label="供应商编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="store_name" label="所属仓库" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="change_num" label="锁库数量" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="requisition_no" label="请购/备货单编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_shipstock_no" label="采购发货单编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="product_instock_no" label="采购/销退入库单编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="check_instock_no" label="盘盈入库单编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrival_time" label="预计到货日期" ></el-table-column>
                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.can_deleted == 1" @click="confirmSellGoodsFreeLock(scope.row.stock_id,stockLockRecords.sell_goods.sell_order_no,stockLockRecords.sell_goods.sell_detail_id)" style="color: rgb(45, 140, 240);cursor: pointer;"> 解锁</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Col>
                    </Row>
                </div>
        </Modal>
        <Modal v-model="confirmUnlock" title="确认解锁" @on-ok="setSellGoodsFreeLock" width="300">
            <p>是否确认解锁？</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiSalesHtdBasicInfo, apiSalesHtdInfoModify, apisendWays, apiMapDetail, apiSelfTakeAddress, 
        apiServiceSalesGoodsModify, apiServiceSalesGoodsAdd, apiServiceSalesCheckPass, apiServiceSalesFree, apiServiceSalesRecover, 
        apiServiceSalesVoid, apiServiceSalesUnlock, apiServiceToPayInfo, apiSkdCollect, apiCkdInfo, apiCkdLibrary, apiServiceSalesXync, 
        apiServiceSalesXydelete, apiCustomerAllStaff, apiSkdAbolish, apiCkdAbolish, apiThdDetailAll, apiThdDetail, apiThdReturn, 
        apiThdApproved, apiThdMoney,apiCustomerInfoDetail, apiSalesHtdRequsitionInfo, apiSalesHtdRequsitionReady, purchaseManageGetWorkFlow, 
        apiOrderManageDetailReturn, apiSalesHtdChangeDetail, apiSalesOrderInvoiceDetail, apiRequisitionModalName, apiSendLogistic,
        apiSalesHtdBasicInfoExport, apiSalesHtdApplyReturn,apiOrderShipInfo,apiOrderInstockInfo,apiOrderCkInfo, sellOrderEditNote, getSellGoodsLockRecords, setSellGoodsFreeLock,setSellLockGoods,apiOrderBuyInfo } from '@/config/getData';
    import { sortBy, notempty, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
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
            const validateMoney = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (value === '') {
                    return callback(new Error('请输入金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('金额必须是数字,且最多精确到2位！'));
                } else {
                    callback();
                }
            };
            const validateShipType = (rule, value, callback) => {
                if (this.isset(this.ckmx.fhfs)) {
                    return callback(new Error('发货方式不能为空'));
                } else {
                    callback();
                }
            };
            const validateFhwl = (rule, value, callback) => {
                if (this.isset(this.ckmx.fhwl) && (this.ckmx.fhfs != 300) && (this.ckmx.fhfs !== '')) {
                    return callback(new Error('请选择发货物流！'));
                } else {
                    callback();
                }

            };
            const validateSkje = (rule, value, callback) => {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (!value) {
                    return callback(new Error('请输入金额！'));
                } else if (!reg.test(value)) {
                    return callback(new Error('输入的数字最多精确到2位！'));
                } else if (parseFloat(value).toFixed(2) * 100 > parseFloat(this.payForm.to_pay_total).toFixed(2) * 100) {
                    return callback(new Error('本次收款不能大于未收款金额'));
                } else {
                    callback();
                }
            };
            return {
                ship_pop: false,
                changeTab: 'tab0',
                order_id: this.$route.query.order_id,
                htdbh: this.$route.query.htdbh || this.$route.query.param,
                lock: this.$route.query.lock,
                serviceShow: 'sales-detail-button',
                serviceZfButton: 'service-xsthd-detail-abolish-button',
                selectManage: 'service-xshtd-detail-ygxx-limit',
                selectYg: 'service-xshtd-detail-ygxx-look',
                customShow: 'sale_custom_deatil',
                xshtdDetail: {},
                goods_detail: [],
                goods_newdhh: '',
                /*发货方式*/
                send_ways: [],
                order_info: {
                    waitpay_money: ''
                },
                skxx: {
                    skfs: '1',
                    skje: ''
                },
                ckmx: {
                    data: [],
                    hasData: [],
                    fhfs: '',
                    fhwl: '',
                    kddh: '',
                    shr: '',
                    address: [],
                    xxdz: '',
                    phone: '',
                    note: '',
                    ship_note: ''
                },
                orderStatus: '',
                payStatus: '',
                returnStatus: '',
                is_edit: 'true',
                shxxIs_edit: 'true',
                khxxIs_edit: 'true',
                goodsIs_edit: 'true',
                skxxIs_edit: 'true',
                ckIs_edit: 'true',
                thIs_edit: 'true',
                is_khxx: 'false',
                /*地址*/
                address: {
                    value2: [],
                    data: []
                },
                //验证
                basicInfoRules: {
                    wlje: [
                        {validator: validateMoney, trigger: 'blur'}
                    ],
                    ship_free_amount: [
                        {validator: validateMoney, trigger: 'blur'}
                    ],
                    yhje: [
                        {validator: validateMoney, trigger: 'blur'}
                    ]
                },
                receiveRules: {
                    skje: [
                        // { required: true, message: '请输入本次收款金额', trigger: 'blur' },
                        {validator: validateSkje, trigger: 'blur'}
                    ]
                },
                ckmxRules: {
                    fhfs: [
                        { validator: validateShipType, trigger: 'on-change' }
                    ],
                    fhwl: [
                        { validator: validateFhwl, trigger: 'on-change' }
                    ],
                    shr: [
                        { required: true, message: '请输入收货人', trigger: 'blur' }
                    ],
                    // address: [
                    //    { required: true, message: '请输入收货地址', trigger: 'blur' }
                    // ],
                    xxdz: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入收货人联系方式', trigger: 'blur' }
                    ],
                },
                thxxRules: {
                    thd_qtje: [
                        {validator: validateMoney, trigger: 'blur'}
                    ]
                },
                receInfo: false,
                default_address: [],
                address_choosed: [],
                tmp: [],
                passModal: false,
                xytbModal: false,
                xyscModal: false,
                jhddModal: false,
                zfModal: false,
                kjkcModal: false,
                skzfModal: false,
                ckzfModal: false,
                thdPassModal: false,
                thBhModal: false,
                thTkModal: false,
                stockLockRecords: [],
                stockLockRecord_isedit:true,
                showStockLockRecordsModal: false,
                showStockLockRecordsLoading: true,
                xyTrue: true,
                htddetailExport:'service-sales-htd-detail-export',
                zffs: '',
                fhwl: '',
                allKf: '',
                all_Sales: '',
                skd_djbh: '',
                ckd_djbh: '',
                allthdDetail: [],
                thxx: {
                    thd_no: '',
                    thd_qtje: '',
                    thd_thze: '',
                    thd_ytje: ''
                },
                publicModal: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                htzsl: 0,
                loadding: false,
                loadding2: false,
                loadding3: false,
                limit_edit: true,
                resqusitionInfo: [
                    {brand: '1212'}
                ],
                resqusitionRecord: [],
                goods_ids: [],
                approval_task: false,
                tasks: [],
                row_length: 0,
                task_now: 0,
                workFlowWidth: 100,
                str_shown: false,
                has_change_order: false,
                changeDetail: [],
                changeStatusArr: [],
                toInvoiceData: [],
                invoiceRecord: [],
                invoiceStatusArr: [],
                isShowToQg: '',
                payForm: {
                    receipt_info: [],
                    refund_info: []
                },
                arrive_funds_rate: '',
                isShowskxx: false,
                isShowtkxx: false,
                refundFromType: [],
                reFoundStatus: [],
                isSkxxShow: true,
                feeAll: '',
                feeTable: [],
                invoiceModal: false,
                invoice: {
                    is_default: "2"
                },
                ids: [],
                hasAddress: false,
                receiveGoodsLimit: 'sales-detail-recv-limit',
                goodsDetailLimit: 'sales-detail-goods-limit',
                orderPassLimit: false,
                orderActiveLimit: false,
                orderThrowLimit: false,
                orderDownloadLimit: false,
                orderCanReturn: false,
                orderGatherLimit: 'sales-detail-gather-limit',
                orderDeliverLimit: 'sales-detail-delive-limit',
                orderInvoiceLimit: 'sales-detail-invoice-limit',
                is_kfbz: true,
                kfbzEditLimit: 'sales-detail-kfbz-edit',
                out_total_amount: 0,
                showShip:false,
                showInstock: false,
                showCk:false,
                OrderShipList:[],
                OrderInstockList:[],
                OrderCkList:[],
                kfbzEdit2: false, //2018年8月15日18:05:41 销售合同单 —— 合同单详情 ：客服备注修改按钮显示逻辑，在原有逻辑基础上增加1条：销售合同单状态 待发货或 部分发货 时候也显示
                shipStatusObj:{},
                instockStatusObj:{},
                xsckdObj:{},
                OrderBuyList:[],
                showBuy:false,
                buyObj:{},
                confirmUnlock: false,
                current_sell_order_no: '',
                current_sell_detail_id: '',
                current_stock_id: '',
            };
        },
        methods: {
            confirmTranslate(){
                this.showShip = false;
                this.showInstock = false;
                this.showCk = false;
                this.showBuy = false;
            },
            getBuyNum(id,num){
                if(num != '0'){
                    apiOrderBuyInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderBuyList = res.data;
                            this.showBuy = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购合同单');
                }
            },
            getShipNum(id,num){
                if(num != '0'){
                    apiOrderShipInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                            this.OrderShipList = res.data;
                            this.showShip = true;


                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购发货单');
                }
            },
            getInstockNum(id,num){
                if(num != '0'){
                    apiOrderInstockInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {

                            this.OrderInstockList = res.data;
                            this.showInstock = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的采购入库单');
                }
            },

            getCkNum(id,num){
                if(num != '0'){
                    apiOrderCkInfo(this, {
                        id:id,
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.OrderCkList = res.data;
                            this.showCk = true;

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }else{
                    this.$Message.error('无对应的销售出库单');
                }
            },
            cancel_ship () {
                this.ship_pop = false;
            },
            ok_ship () {
                this.ckIs_edit = false;
                this.ship_pop = false;
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getQgModal () {
                apiRequisitionModalName(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let modelName = res.data;
                        isInCreaters(this, modelName, 2).then(canCreater => {
                            this.isShowToQg = canCreater && manualCheck('sales-detail-tobeqg-limit');
                        });
                    }
                });
            },
            /*流程跟踪*/
            getTask (no) {
                purchaseManageGetWorkFlow(this, {
                    order_no: no
                }).then(res => {
                    if (res && res.status == 1){
                        this.task_now = res.data.current_key;
                        this.tasks = res.data.tracks;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.approval_task = true;
                    }
                });
            },
            //发货方式选择
            sendwaysChange (value) {
                if (value === '自提') {
                    this.receInfo = true;
                    this.getZt();
                } else {
                    this.xshtdDetail.shrxm = '';
                    this.xshtdDetail.shrsjhm = '';
                    this.xshtdDetail.shxxdz = '';
                    this.address.value2 = [];
                    this.receInfo = false;
                }
            },
            getAddressCheck (val, addressArr) {
                for (let i in addressArr) {
                    if (val[0] == addressArr[i].value) {
                        this.hasAddress = true;
                        this.address_choosed[0] = addressArr[i].label;
                    }
                    if (val[1] == addressArr[i].value) {
                        this.address_choosed[1] = addressArr[i].label;
                    }
                    if (val[2] == addressArr[i].value) {
                        this.address_choosed[2] = addressArr[i].label;
                    }
                    this.getAddressCheck(val, addressArr[i].children);
                }
            },
            //选择地址
            selectAddress (value, result) {
                this.address.value2 = value;

                this.hasAddress = false;
                this.getAddressCheck(value, this.address.data);
                if (!this.hasAddress) {
                    this.address_choosed = ['', '', ''];
                }
            },
            /*出库信息地址选择*/
            selectRecAddress (value, result) {
                this.ckmx.address = value;

                this.hasAddress = false;
                this.getAddressCheck(value, this.address.data);
                if (!this.hasAddress) {
                    this.address_choosed = ['', '', ''];
                }
            },
            lockingLimit (lock, htsl, stock, out_num) {
                // let numAdd = parseInt(lock) + parseInt(stock);
                let ready_out = parseInt(htsl) - parseInt(out_num);
                // if (parseInt(lock) > parseInt(stock)) {
                //     this.$Message.error('锁库数量不能大于可用库存');
                //     return false;
                // }
                if (parseInt(lock) > parseInt(ready_out)) {
                    this.$Message.error('锁库数量不能大于未出库数量');
                    return false;
                }
            },
            getZt () {
                apiSelfTakeAddress(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xshtdDetail.shrxm = res.data[0].ckmc;
                        this.xshtdDetail.shrsjhm = res.data[0].dhhm;
                        this.address.value2 = [res.data[0].dzsfbh, res.data[0].dzcsbh, res.data[0].dzxqbh ];
                        this.address_choosed = [res.data[0].dzsfmc, res.data[0].dzcsmc, res.data[0].dzxqmc];
                        this.xshtdDetail.shxxdz = res.data[0].ckdz;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt', 'sell_return_status', 'zffs', 'xsckd', 'change_status', 'sell_invoice', 'sell_refund_from_type', 'sell_refund', 'fhfs2','ship_status','instock_status','xsckd','buy_order_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                        this.returnStatus = res.data.sell_return_status;
                        this.zffs = res.data.zffs;
                        // this.fhwl = res.data.fhwl;
                        this.xsckd = res.data.xsckd;
                        this.changeStatusArr = res.data.change_status;
                        this.invoiceStatusArr = res.data.sell_invoice;
                        this.refundFromType = res.data.sell_refund_from_type;
                        this.reFoundStatus = res.data.sell_refund;
                        this.send_ways = res.data.fhfs2;
                        this.ckmx.fhfs = '200';
                        this.shipStatusObj = res.data.ship_status;
                        this.instockStatusObj = res.data.instock_status;
                        this.xsckdObj = res.data.xsckd;
                        this.buyObj = res.data.buy_order_status;
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fhwl = res.data;
                    }
                });
                apiMapDetail(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let valueToString = function (mapArr) {
                            mapArr.forEach(item => {
                                item.value = item.value.toString();
                                if (item.children && item.children.length > 0) {
                                    valueToString(item.children);
                                }
                            })  
                        };
                        valueToString(res.data);

                        this.address.data = res.data;
                    }
                });
                //所有客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allKf = res.data.list;
                    }
                });
                //所有销售
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.all_Sales = res.data.list;
                    }
                });
            },


            /*导出*/
            exportList () {
                apiSalesHtdBasicInfoExport(this, {
                    djbh: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },




            getBasicInfo () {
                this.goods_ids = [];
                apiSalesHtdBasicInfo(this, {
                    djbh: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.xshtdDetail = res.data;
                        //销售合同单 —— 合同单详情 ：客服备注修改按钮显示逻辑，在原有逻辑基础上增加1条：销售合同单状态 待发货或 部分发货 时候也显示
                        if (this.xshtdDetail.xshtdzt == 3 || this.xshtdDetail.xshtdzt == 4) {
                            this.kfbzEdit2 = true;
                        } else {
                            this.kfbzEdit2 = false;
                        }
                        if (manualCheck(this.selectManage) || (manualCheck(this.selectYg) && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7))) {
                            this.limit_edit = true;
                        } else {
                            this.limit_edit = false;
                        }
                        this.orderPassLimit = (this.xshtdDetail.xshtdzt == 7) && manualCheck('sales-detail-pass-limit');
                        this.orderActiveLimit = (this.xshtdDetail.xshtdzt == 10) && manualCheck('sales-detail-act-limit');
                        this.orderThrowLimit = (this.xshtdDetail.xshtdzt == 7 || this.xshtdDetail.xshtdzt == 0) && manualCheck('sales-detail-throw-limit');
                        this.orderDownloadLimit = (this.xshtdDetail.xshtdzt != 10 && this.xshtdDetail.xshtdzt != 6 && this.xshtdDetail.xshtdzt != 7) && manualCheck('sales-detail-download-limit');
                        /* 当前登录人员为当前订单所属客服或以上级别 订单状态 ：非已作废 || 非待审核 || 非已失效 shijiangming 2018-08-09 */
                        apiSalesHtdApplyReturn(this, {
                            order_no: this.htdbh,
                            just_can: true,
                            just_button: true,
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.orderCanReturn = manualCheck('service-apply-return-button');
                            }
                        });
                        
                        this.address.value2 = [res.data.shsfbh, res.data.shsqbh, res.data.shxqbh];
                        this.address_choosed = [res.data.shsfmc, res.data.shsqmc, res.data.shxqmc];
                        for (let i in res.data.products) {
                            res.data.products[i].dcksl = parseInt(res.data.products[i].htsl) - parseInt(res.data.products[i].stock_num_out);
                            this.goods_ids.push(res.data.products[i].id);
                        }
                        this.goods_detail = res.data.products;
                        this.htzsl = 0;
                        this.getData();
                        /*如果自提*/
                        if (this.xshtdDetail.fhfsmc === '自提') {
                            this.getZt();
                        }
                        /*是否存在合同修改单*/
                        this.has_change_order = res.data.has_change_order;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            djChange (value, dhh) {
                var reg = /^\d+\.?(\d{1,2})?$/;
                if (value === '') {
                    this.$Message.error('【' + dhh + '】请输入单价');
                } else if (!reg.test(value)) {
                    this.$Message.error('【' + dhh + '】单价必须是数字,且最多精确到2位！');
                }
            },
            zkChange (value, dhh) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                if (value === '') {
                    this.$Message.error('【' + dhh + '】请输入折扣');
                } else if (!reg.test(value)) {
                    this.$Message.error('【' + dhh + '】折扣必须是数字,且最多精确到3位！');
                }
            },
            /*商品删除*/
            goodsDelete (index, dataArr) {
                dataArr.splice(index, 1);
            },
            getSkInfo () {
                apiServiceToPayInfo(this, {
                    order_no: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.payForm = res.data;
                        this.skxx.skje = this.payForm.to_pay_total;
                        if (this.payForm.return_total ==='null' || this.payForm.return_total === '' || !this.payForm.return_total) {
                            this.payForm.return_total = 0;
                        }
                        this.isShowskxx = this.payForm.receipt_info.detail.length > 0 ? true : false;
                        this.isShowtkxx = this.payForm.refund_info.detail.length > 0 ? true : false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getCkInfo () {
                apiCkdInfo(this, {
                    params: JSON.stringify({
                        htd_djbh: this.htdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.arrive_funds_rate = res.data.arrive_funds_rate;
                        this.ckmx.shr = this.xshtdDetail.shrxm;
                        this.ckmx.address = this.address.value2;
                        this.ckmx.xxdz = this.xshtdDetail.shxxdz;
                        this.ckmx.phone = this.xshtdDetail.shrsjhm;
                        this.ckmx.data = [];
                        for (let i = 0; i < res.data.wait_ck.length; i++) {
                            res.data.wait_ck[i].bccksl = parseInt(res.data.wait_ck[i].can_ck);
                            this.ckmx.data.push(res.data.wait_ck[i]);
                        }
//                        this.ckmx.data = res.data.wait_ck;
                        this.ckmx.hasData = res.data.has_ck;
                    } else {
                        //this.$Message.error(res.message);
                    }
                });
            },
            getThInfo () {
                apiOrderManageDetailReturn(this, {
                    order_no: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
//                        this.allthdDetail = res.data;
                        if (res.data.length != 0) {
                            let allQueryArr = [];
                            for (let i in res.data) {
                                allQueryArr.push(queryAllWorkFLow(this, res.data[i].info.return_no))
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
                                this.allthdDetail = res.data;
                            })
                        }
                    }
                });
            },
            getChangeInfo () {
                apiSalesHtdChangeDetail(this, {
                    order_no: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.length != 0) {
                            let allQueryArr = [];
                            for (let i in res.data) {
                                allQueryArr.push(queryAllWorkFLow(this, res.data[i].info.order_change_no))
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
                                this.changeDetail = res.data;
                            })
                        }
                    }
                });
            },
            getData () {
                /*出库明细*/
                this.goods_ids = [];
                for (let i = 0; i < this.goods_detail.length; i++) {
                    if (!this.goods_detail[i].htsl || this.goods_detail[i].htsl === '') {
                        this.goods_detail[i].htsl = 0;
                    }
                    this.htzsl = parseInt(this.htzsl) + parseInt(this.goods_detail[i].htsl);
                    this.goods_ids.push(this.goods_detail[i].id);
                }
            },
            getQgInfo () {
                /*待请购商品明细*/
                apiSalesHtdRequsitionReady(this, {
                    ids: JSON.stringify(this.goods_ids)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.resqusitionInfo = res.data;
                        this.getQgModal();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
                /*请购记录*/
                apiSalesHtdRequsitionInfo(this, {
                    sell_order_no: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.length != 0) {
                            let allQueryArr = [];
                            for (let i in res.data) {
                                allQueryArr.push(queryAllWorkFLow(this, res.data[i].requisition_no))
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
                                this.resqusitionRecord = res.data;
                            })
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            toQGD () {
                this.handleClick({selectedArr: JSON.stringify(this.goods_ids)}, 'purchase_manage_HT_toRequireDetail');
            },
            getTkInfo () {
                apiSalesOrderInvoiceDetail(this, {
                    order_no: this.htdbh
                }).then(res => {
                    if (res && res.status == 1) {
                        this.toInvoiceData = res.data.toInvoice;
                        this.invoiceRecord = res.data.invoiceRecord;
                        for (let i in this.toInvoiceData) {
                            this.ids.push(this.toInvoiceData[i].order_detail_id);
                        }
                        this.feeTable = res.data.freightRecord.detail;
                        this.feeAll = res.data.freightRecord.total_freight_amount;
                        // for (let i in this.feeTable) {
                        //     this.feeAll += +this.feeTable[i].freight_amount;
                        // }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.goods_detail.sort(sortBy(column.prop, isDec));
            },
            ckmxDataSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ckmx.data.sort(sortBy(column.prop, isDec));
            },
            readyQgDataSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.resqusitionInfo.sort(sortBy(column.prop, isDec));
            },
            toInvoiceDataChange (column) {
                let isDec = column.order == "descending" ? true : false;
                this.toInvoiceData.sort(sortBy(column.prop, isDec));
            },
            EditGoodsDataSort (i, col) {
                let isDec = col.order == "descending" ? true : false;
                this.changeDetail[i].list.sort(sortBy(col.prop, isDec));
            },
            QgRecordDataSort (i, col) {
                let isDec = col.order == "descending" ? true : false;
                this.resqusitionRecord[i].detail.sort(sortBy(col.prop, isDec));
            },
            InvoiceRecordDataSort (i, col) {
                let isDec = col.order == "descending" ? true : false;
                this.invoiceRecord[i].invoiceDetails.sort(sortBy(col.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            //修改
            edit (name, djbh, index) {
                if (name === 'djxx') {
                    this.is_edit = false;
                    this.str_shown = !this.is_edit && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7) && !this.has_change_order;
                } else if(name === 'kfbz') {
                    this.is_kfbz = false;
                } else if (name === 'shxx') {
                    this.shxxIs_edit = false;
                    if (this.xshtdDetail.fhfsmc === '自提') {
                        this.receInfo = true;
                    }
                } else if (name === 'spmx') {
                    this.goodsIs_edit = false;
                    this.loadding = false;
                } else if (name === 'skxx') {
//                    this.handleClick({param: this.xshtdDetail.djbh, must_total: this.payForm.must_total, to_pay_total: this.payForm.to_pay_total, funds_can_total: this.payForm.funds_can_total }, 'service-xsskd-add');
//                    this.skxxIs_edit = false;
                    this.isSkxxShow = false;
                } else if (name === 'ckmx') {
                    let yfje = (parseFloat(this.xshtdDetail.ddje).toFixed(2) * 100 + parseFloat(this.xshtdDetail.wlje).toFixed(2) * 100 - parseFloat(this.xshtdDetail.yhje).toFixed(2) * 100 - parseFloat(this.xshtdDetail.ship_free_amount).toFixed(2) * 100) / 100;
                    let sfje = parseFloat(this.xshtdDetail.sfje).toFixed(2);
                    if(this.xshtdDetail.khzfzt == 0 || this.xshtdDetail.khzfzt ==3){
                        this.ship_pop = true;
                        // this.ckIs_edit = false;
                    }else{
                        this.ckIs_edit = false;
                    }
                    this.calcOutTotalAmount();
                } else if (name === 'thxx') {
                    this.thIs_edit = false;
                    apiThdDetail(this, {
                        params: JSON.stringify({
                            thd_djbh: djbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.allthdDetail[index].list = res.data.list;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if(name === 'khxx') {
                    this.is_khxx = false;
                    this.khxxIs_edit = false;
                    apiCustomerInfoDetail(this, {
                        params: JSON.stringify({
                            khbh: this.xshtdDetail.khbh,
                            type: 'info',
                            djbh: this.xshtdDetail.djbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.xshtdDetail.khmc = res.data.kh.khmc;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            close (name, index) {
                if (name === 'djxxcancel') {
                    this.is_edit = true;
                    this.str_shown = !this.is_edit && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7);
                    this.getBasicInfo();
                } else if (name === 'djxxsave') {
                    /*单据基本信息保存*/
                    if (!(this.is_edit) && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7)) {
                        this.$refs['basicInfoForm'].validate((valid) => {
                            if (valid) {
                                apiSalesHtdInfoModify(this, {
                                    djbh: this.htdbh,
                                    post_data: JSON.stringify({
                                        wlje: this.xshtdDetail.wlje,
                                        yhje: this.xshtdDetail.yhje,
                                        ship_free_amount: this.xshtdDetail.ship_free_amount,
                                        xsyg_ygbh: this.xshtdDetail.xsyg_ygbh,
                                        czyg_ygbh: this.xshtdDetail.czyg_ygbh,
                                        djbz: this.xshtdDetail.djbz
                                    })
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        this.is_edit = true;
                                        this.str_shown = !this.is_edit && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7);
                                        this.getBasicInfo();
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                });
                            }
                        });
                    } else {
                        apiSalesHtdInfoModify(this, {
                            djbh: this.htdbh,
                            post_data: JSON.stringify({
                                xsyg_ygbh: this.xshtdDetail.xsyg_ygbh,
                                czyg_ygbh: this.xshtdDetail.czyg_ygbh
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.is_edit = true;
                                this.getBasicInfo();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                } else if (name === 'kfbzcancel') {
                    this.is_kfbz = true;
                    this.getBasicInfo();
                } else if (name === 'kfbzsave') {
                    /*单据基本信息保存*/
                    if (!(this.is_kfbz) && (this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7 || this.xshtdDetail.xshtdzt == 3 || this.xshtdDetail.xshtdzt == 4)) {
                        sellOrderEditNote(this, {
                                    djbh: this.htdbh,
                                    post_data: JSON.stringify({
                                        djbz: this.xshtdDetail.djbz
                                    })
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        this.is_kfbz = true;
                                        this.getBasicInfo();
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                });
                    } else {
                        this.$Message.error('当前单据状态不支持修改!');
                    }
                } else if (name === 'shxxcancel') {
                    this.shxxIs_edit = true;
                    this.getBasicInfo();
                } else if (name === 'shxxsave') {
                    if (this.address.value2 && this.address.value2.length > 0) {
                        /*收货信息修改*/
                        apiSalesHtdInfoModify(this, {
                            djbh: this.htdbh,
                            post_data: JSON.stringify({
                                fhfsmc: this.xshtdDetail.fhfsmc,
                                fhfsbh: this.xshtdDetail.fhfsbh,
                                shrxm: this.xshtdDetail.shrxm,
                                shrsjhm: this.xshtdDetail.shrsjhm,
                                shsfmc: this.address_choosed[0],
                                shsfbh: this.address.value2[0],
                                shsqmc:  this.address_choosed[1],
                                shsqbh: this.address.value2[1],
                                shxqmc:  this.address_choosed[2],
                                shxqbh: this.address.value2[2],
                                shxxdz: this.xshtdDetail.shxxdz
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.shxxIs_edit = true;
                                this.getBasicInfo();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    } else {
                        this.$Message.error('收货地址不能为空！');
                    }
                } else if (name === 'spmxcancel') {
                    this.goodsIs_edit = true;
                    this.getBasicInfo();
                } else if (name === 'spmxsave') {
                    /*商品信息修改*/
                    let goodsNewArr = [];
                    var reg2 = /^\d+\.?(\d{1,2})?$/;
                    var reg3 = /^\d+\.?(\d{1,3})?$/;
                    for (let i = 0; i < this.goods_detail.length; i++) {
                        let ready_out = parseInt(this.goods_detail[i].htsl) - parseInt(this.goods_detail[i].stock_num_out);
                        let numAdd = parseInt(this.goods_detail[i].locking) + parseInt(this.goods_detail[i].stock);
                        if (!this.goods_detail[i].htdj || (parseFloat(this.goods_detail[i].htdj).toFixed(2) * 100 == 0)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同单价不能为0且不能为空');
                            this.goodsIs_edit = false;
                            return false;
                        } else if (!reg2.test(this.goods_detail[i].htdj)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同单价最多为两位小数');
                            this.goodsIs_edit = false;
                            return false;
                        } else if (!this.goods_detail[i].htzk || (parseFloat(this.goods_detail[i].htzk).toFixed(3) * 1000 == 0)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同折扣不能为0且不能为空');
                            this.goodsIs_edit = false;
                            return false;
                        } else if (!reg3.test(this.goods_detail[i].htzk)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同折扣最多为三位小数');
                            this.goodsIs_edit = false;
                            return false;
                        } else if ((this.xshtdDetail.xshtdzt == 0 || this.xshtdDetail.xshtdzt == 7) && (!this.goods_detail[i].htsl || (parseInt(this.goods_detail[i].htsl) < 1))) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同数量不能小于1');
                            this.goodsIs_edit = false;
                            return false;
                        } else if (this.goods_detail[i].locking === '') {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】锁库数量不能为空');
                            this.goodsIs_edit = false;
                            return false;
                        } /*else if (parseInt(this.goods_detail[i].locking) > parseInt(this.goods_detail[i].stock+this.goods_detail[i].stock_lock)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】锁库数量不能大于可用库存');
                            return false;
                        }*/ else if (parseInt(this.goods_detail[i].locking) > parseInt(ready_out)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】锁库数量不能大于未出库数量');
                            return false;
                        } else if ((parseInt(this.goods_detail[i].hthq) < 0)) {
                            this.$Message.error('【' + this.goods_detail[i].cpdhh + '】合同货期不能小于0');
                            this.goodsIs_edit = false;
                            return false;
                        } else {
                            goodsNewArr.push(this.goods_detail[i]);
                        }
                    }
                    if (goodsNewArr.length != 0) {
                        this.loadding = true;
                        apiServiceSalesGoodsModify(this, {
                            djbh: this.htdbh,
                            post_data: JSON.stringify(goodsNewArr)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.goodsIs_edit = true;
                                this.getBasicInfo();
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loadding = false;
                        });
                    }
                } else if (name === 'skxxcancel') {
                    this.skxxIs_edit = true;
                } else if (name === 'skxxsave') {
                    this.$refs.receiveForm.validate((valid) => {
                        if (valid) {
                            apiSkdCollect(this, {
                                params: JSON.stringify({
                                    htd_djbh: this.htdbh,
                                    skfs: this.skxx.skfs,
                                    skje: this.skxx.skje,
                                    jypz: this.skxx.jypzh
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.skxxIs_edit = true;
                                    this.getSkInfo();
                                    this.getBasicInfo();
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                } else if (name === 'ckmxcancel') {
                    this.ckIs_edit = true;
                } else if (name === 'ckmxsave') {
                    if (this.ckmx.address.length != 0) {
                        this.$refs.ckmxForm.validate((valid) => {
                            if (valid) {
                               this.loadding2 = true;
                               let tmpArr = {};
                               for (let i in this.ckmx.data) {
                                        tmpArr[this.ckmx.data[i].stock_id] = this.ckmx.data[i].bccksl;
                                    }
                                    apiCkdLibrary(this, {
                                        list: JSON.stringify(tmpArr),
                                        htd_djbh: this.htdbh,
                                        params: JSON.stringify({
                                            fhfs: this.ckmx.fhfs,
                                            fhwl: this.ckmx.fhwl,
                                            receive_name: this.ckmx.shr,
                                            receive_phone: this.ckmx.phone,
                                            receive_address: this.ckmx.xxdz,
                                            receive_address_id: JSON.stringify(this.ckmx.address),
                                            note: this.ckmx.note,
                                            ship_note: this.ckmx.ship_note
                                        })
                                    }).then(res => {
                                        if (res && res.status == 1) {
                                            this.ckIs_edit = true;
                                            this.ckmx.fhfs = '';
                                            this.ckmx.fhwl = '';
                                            this.ckmx.receive_name = '';
                                            this.ckmx.receive_phone = '';
                                            this.ckmx.receive_address = '';
                                            this.ckmx.receive_address_id = '';
                                            this.ckmx.note = '';
                                            this.ckmx.ship_note = '';
                                            this.loadding2 = false;
                                            this.getCkInfo();
                                        } else {
                                            this.loadding2 = false;
                                            this.$Message.error(res.message);
                                        }
                                    });
                            }
                        });
                    }  else {
                                this.$Message.error('收货地址不能为空！');
                            }

                } else if (name === 'thxxcancel') {
                    this.thIs_edit = true;
                    this.getThInfo();
                } else if (name === 'thxxsave') {
                    for (let i = 0; i < this.allthdDetail[index].list.length; i++) {
                        if (parseInt(this.allthdDetail[index].list[i].kthsl) < parseInt(this.allthdDetail[index].list[i].thsl)) {
                            this.$Message.error('【' + this.allthdDetail[index].list[i].cpdhh + '】退货数量不得大于可退货数量');
                            return false;
                        }
                    }
                    apiThdReturn(this, {
                        thd_djbh: this.allthdDetail[index].info.thd_djbh,
                        list: JSON.stringify(this.allthdDetail[index].list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.thIs_edit = true;
                            this.getThInfo();
                            this.$Message.success(res.message);
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'khxxcancel') {
                    this.is_khxx = true;
                    this.khxxIs_edit = true;
                    this.getBasicInfo();
                } else if (name === 'khxxsave') {
                    /*客户信息修改*/
                    apiCustomerInfoDetail(this, {
                        params: JSON.stringify({
                            khbh: this.xshtdDetail.khbh,
                            type: 'detail',
                            djbh: this.xshtdDetail.djbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.is_khxx = true;
                            this.khxxIs_edit = true;
                            this.getBasicInfo();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            saveSkxx () {
                this.$refs.receiveForm.validate((valid) => {
                    if (valid) {
                        this.loadding3 = true;
                        apiSkdCollect(this, {
                            params: JSON.stringify({
                                htd_djbh: this.htdbh,
                                skfs: this.skxx.skfs,
                                skje: this.skxx.skje
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.isSkxxShow = true;
                                this.loadding3 = false;
                                this.getBasicInfo();
                                this.getSkInfo();
                            } else {
                                this.loadding3 = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            /*批量添加*/
            addGoods () {
                let arr = this.goods_newdhh.replace(/[\r\n]/g, ',');
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

                goodsVaildArr = goodsVaildArr.map (item => {
                    return item.join(' ');
                });
                goodsVaildArr = goodsVaildArr.join(',');

                apiServiceSalesGoodsAdd(this, {
                    djbh: this.htdbh,
                    dhh_nums: goodsVaildArr
                }).then(res => {
                    if (res && res.status == 1) {
                        this.goods_newdhh = '';

                        for (let i = 0; i < this.goods_detail.length; i++) {
                            for (let j = 0; j < res.data.length; j++) {
                                if (this.goods_detail[i].cpdhh === res.data[j].cpdhh) {
                                    res.data.splice(j, 1);
                                }
                            }
                        }
                        this.goods_detail = this.goods_detail.concat(res.data);

                        if (res.message !== '') {
                            this.$Message.error(res.message);
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            toDo (name, index) {
                if (name === 'pass') {
                    this.publicModal = true;
                    this.publicState = '审核通过';
                    this.publicCancel = 'passcancel';
                    this.publicSure = 'passsure';
                    this.loadding = false;
                } else if (name === 'xysc') {
                    this.publicModal = true;
                    this.publicState = '新阳删除';
                    this.publicCancel = 'xysccancel';
                    this.publicSure = 'xyscsure';
                    this.loadding = false;
                } else if (name === 'xytb') {
                    this.publicModal = true;
                    this.publicState = '新阳同步';
                    this.publicCancel = 'xytbcancel';
                    this.publicSure = 'xytbsure';
                    this.loadding = false;
                } else if (name === 'jhdd') {
                    this.publicModal = true;
                    this.publicState = '激活订单';
                    this.publicCancel = 'jhddcancel';
                    this.publicSure = 'jhddsure';
                    this.loadding = false;
                } else if (name === 'zf') {
                    this.publicModal = true;
                    this.publicState = '作废';
                    this.publicCancel = 'zfcancel';
                    this.publicSure = 'zfsure';
                    this.loadding = false;
                } else if (name === 'kjkc') {
                    this.publicModal = true;
                    this.publicState = '扣减库存';
                    this.publicCancel = 'kjkccancel';
                    this.publicSure = 'kjkcsure';
                    this.loadding = false;
                } else if (name === 'thPass') {
                    this.publicModal = true;
                    this.publicState = '审批通过';
                    this.publicCancel = 'thdPasscancel';
                    this.publicSure = 'thdPasssure';
                    this.thxx.thd_no = this.allthdDetail[index].info.thd_djbh;
                    this.loadding = false;
                } else if (name === 'thBh') {
                    this.publicModal = true;
                    this.publicState = '审批驳回';
                    this.publicCancel = 'thBhcancel';
                    this.publicSure = 'thBhsure';
                    this.thxx.thd_no = this.allthdDetail[index].info.thd_djbh;
                    this.loadding = false;
                } else if (name === 'thTk') {
                    this.thTkModal = true;
                    this.thxx.thd_no = this.allthdDetail[index].info.thd_djbh;
                    this.thxx.thd_qtje = this.allthdDetail[index].info.qtje;
                    this.thxx.thd_thze = this.allthdDetail[index].info.thze;
                    this.thxx.thd_ytje = this.allthdDetail[index].info.ytje;
                    this.loadding = false;
                } else if (name === 'showStockLockRecordsModal') {
                    this.loadding = true;
                    getSellGoodsLockRecords(this,{
                        params: JSON.stringify({
                            sell_order_no: this.goods_detail[index].sell_order_no,
                            sell_detail_id: this.goods_detail[index].sell_detail_id,
                        })
                    }).then(res=>{
                        this.loadding = false;
                        if (res && res.status == 1) {
                            this.stockLockRecords = res.data;
                            this.showStockLockRecordsModal = true;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            toApplyReturn(djbh)
            {
                apiSalesHtdApplyReturn(this, {
                    order_no: this.htdbh,
                    just_can: true,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.handleClick({djbh: djbh}, 'service-apply-return');
                    } else {
                        this.$Message.error(res.message);
                        this.loadding = false;
                    }
                });
            },
            toInvoice () {
                this.invoiceModal = true;
            },
            sureAction (name) {
                if (name === 'passcancel') {
                    this.publicModal = false;
                } else if (name === 'passsure') {
                    this.loadding = true;
                    apiServiceSalesCheckPass(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();
                            this.$Message.success('审核通过');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'xysccancel') {
                    this.publicModal = false;
                } else if (name === 'xyscsure') {
                    this.loadding = true;
                    apiServiceSalesXydelete(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();
                            this.$Message.success('新阳删除成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'xytbcancel') {
                    this.publicModal = false;
                } else if (name === 'xytbsure') {
                    this.loadding = true;
                    apiServiceSalesXync(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();

                            this.$Message.success({
                                content: res.message,
                                duration: 5,
                            });
                        } else {
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });

                            this.loadding = false;
                        }
                    });
                } else if (name === 'jhddcancel') {
                    this.publicModal = false;
                } else if (name === 'jhddsure') {
                    this.loadding = true;
                    apiServiceSalesRecover(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();
                            this.$Message.success('订单激活成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'zfcancel') {
                    this.publicModal = false;
                } else if (name === 'zfsure') {
                    this.loadding = true;
                    apiServiceSalesVoid(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();
                            this.$Message.success('该订单已作废');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'kjkccancel') {
                    this.publicModal = false;
                } else if (name === 'kjkcsure') {
                    this.loadding = true;
                    apiServiceSalesUnlock(this, {
                        djbh: this.htdbh
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.getBasicInfo();
                            this.$Message.success('扣减库存成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'skzfcancel') {
                    this.publicModal = false;
                } else if (name === 'skzfsure') {
                    this.loadding = true;
                    apiSkdAbolish(this, {
                        params: JSON.stringify({
                            skd_djbh: this.skd_djbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.publicModal = false;
                            this.getSkInfo();
                            this.getBasicInfo();
                            this.$Message.success('作废成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'ckzfcancel') {
                    this.publicModal = false;
                } else if (name === 'ckzfsure') {
                    this.loadding = true;
                    apiCkdAbolish(this, {
                        params: JSON.stringify({
                            ckd_djbh: this.ckd_djbh
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.publicModal = false;
                            this.getCkInfo();
                            this.getBasicInfo();
                            this.$Message.success('作废成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'thdPasscancel') {
                    this.publicModal = false;
                } else if (name === 'thdPasssure') {
                    this.loadding = true;
                    apiThdApproved(this, {
                        params: JSON.stringify({
                            thd_djbh: this.thxx.thd_no,
                            pass: '1'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.publicModal = false;
                            this.getThInfo();
                            this.$Message.success('审批成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'thBhcancel') {
                    this.publicModal = false;
                } else if (name === 'thBhsure') {
                    this.loadding = true;
                    apiThdApproved(this, {
                        params: JSON.stringify({
                            thd_djbh: this.thxx.thd_no,
                            pass: '0'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.publicModal = false;
                            this.getThInfo();
                            this.$Message.success('驳回成功');
                        } else {
                            this.$Message.error(res.message);
                            this.loadding = false;
                        }
                    });
                } else if (name === 'thTkcancel') {
                    this.thTkModal = false;
                } else if (name === 'thTksure') {
                    this.$refs['thxxForm'].validate((valid) => {
                        if (valid) {
                            this.loadding = true;
                            apiThdMoney(this, {
                                params: JSON.stringify({
                                    thd_djbh: this.thxx.thd_no,
                                    qtje: this.thxx.thd_qtje
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
                                    this.thTkModal = false;
                                    this.getThInfo();
                                    this.$Message.success('退款成功');
                                } else {
                                    this.$Message.error(res.message);
                                    this.loadding = false;
                                }
                            });
                        }
                    });
                } else if (name === 'invoiceCancel') {
                    this.invoiceModal = false;
                } else if (name === 'invoiceSave') {
                    this.loadding = true;
                    this.invoiceModal = false;
                    this.ids = JSON.stringify(this.ids);
                    this.handleClick({ids: this.ids, type: this.invoice.is_default}, 'purchase_manage_HT_toInvoiceDetail');
                }
            },
            ckNow (bccksl, can_ck) {
                if (parseInt(bccksl) > parseInt(can_ck)) {
                    this.$Message.error('本次出库数量不能大于可出库数量');
                }
                this.calcOutTotalAmount();
            },
            calcOutTotalAmount () {
                let out_total_amount = 0;
                for(let i in this.ckmx.data){
                    out_total_amount = parseFloat( +out_total_amount  + +(this.ckmx.data[i].bccksl * this.ckmx.data[i].return_avg_price) ).toFixed(4);
                }
                this.out_total_amount = out_total_amount;
            },
            tabDetail (name) {
                if (name === 'tab0') {
                    this.getBasicInfo();
                } else if (name === 'tab1') {
                    this.getBasicInfo();
                    this.getSkInfo();
                } else if (name === 'tab2') {
                    this.getCkInfo();
                } else if (name === 'tab3') {
                    this.getThInfo();
                } else if (name === 'tab4') {
                    this.getChangeInfo();
                } else if (name === 'tab5') {
                    this.getQgInfo();
                } else if (name === 'tab6') {
                    this.getTkInfo();
                }
            },
            /*收款作废*/
            receiveThrow (skdDjbh) {
                this.skd_djbh = skdDjbh;
                this.publicModal = true;
                this.publicState = '作废';
                this.publicCancel = 'skzfcancel';
                this.publicSure = 'skzfsure';
                this.loadding = false;
            },
            /*出库单明细作废*/
            outThrow (ckdDjbh) {
                this.ckd_djbh = ckdDjbh;
                this.publicModal = true;
                this.publicState = '作废';
                this.publicCancel = 'ckzfcancel';
                this.publicSure = 'ckzfsure';
                this.loadding = false;
            },
            thxxNumchange (thsl, kthsl) {
                if (parseInt(thsl) > parseInt(kthsl)) {
                    this.$Message.error('退货数量不得大于可退货数量');
                }
            },
            changeShip (value) {
                if (value !== 300) {
                    this.ckmx.fhwl = '';
                    this.ckmx.kddh = '';
                }
            },
            changeHtsl (htsl, id) {
                let numAdd = parseInt(this.goods_detail[id].stock) + parseInt(this.goods_detail[id].locking);
                if (parseInt(htsl) < numAdd)  {
                    this.goods_detail[id].locking = htsl;
                } else {
                    this.goods_detail[id].locking = this.goods_detail[id].locking;
                }
                this.getData();
            },
            download(djbh)
            {
                var url = 'https://www.yidian-mall.com/member/order/api-pdf.html?djbh=' + djbh;
                window.open(url, '_blank').location;
            },
            feeTableSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.feeTable.sort(sortBy(column.prop, isDec));
            },
            getSellGoodsLockRecordInfo(type,sell_order_no,sell_detail_id){
                if (type == 'cancle') {
                    this.stockLockRecord_isedit = true;
                }
                if (type == 'edit') {
                    this.stockLockRecord_isedit = false;
                }
                //this.loadding = true;
                getSellGoodsLockRecords(this,{
                    params: JSON.stringify({
                        sell_order_no: sell_order_no,
                        sell_detail_id: sell_detail_id,
                    })
                }).then(res=>{
                    this.loadding = false;
                    if (res && res.status == 1) {
                        this.stockLockRecords = res.data;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            saveSellGoodsStockLock(stock_lock,sell_order_no,sell_detail_id){
                this.loadding = true;
                setSellLockGoods(this,{
                    params: JSON.stringify({
                        sell_order_no: sell_order_no,
                        sell_detail_id: sell_detail_id,
                        looking: stock_lock,
                    })
                }).then(res=>{
                    this.loadding = false;
                    if (res && res.status == 1) {
                        this.stockLockRecords = res.data;
                        this.$Message.info(res.message);
                        this.getSellGoodsLockRecordInfo('cancle',sell_order_no,sell_detail_id);
                        this.getBasicInfo();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            setSellGoodsFreeLock(){
                this.loadding = true;
                setSellGoodsFreeLock(this,{
                    params: JSON.stringify({
                        sell_order_no: this.current_sell_order_no,
                        sell_detail_id: this.current_sell_detail_id,
                        stock_id: this.current_stock_id,
                    })
                }).then(res=>{
                    this.loadding = false;
                    if (res && res.status == 1) {
                        this.stockLockRecords = res.data;
                        this.$Message.info(res.message);
                        this.getSellGoodsLockRecordInfo('cancle',this.current_sell_order_no,this.current_sell_detail_id);
                        this.getBasicInfo();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            confirmSellGoodsFreeLock(stock_id,sell_order_no,sell_detail_id){
                this.current_sell_order_no = sell_order_no;
                this.current_sell_detail_id = sell_detail_id;
                this.current_stock_id = stock_id;
                this.confirmUnlock = true;
            }
        },
        created () {
            this.getStatus();
            this.getBasicInfo();
            //没用到的字段不要添加干扰信息，此处出现这段文字的原因请参考上一个版本的文件里面此处有什么无用信息
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            },
            toInt: function (x) {
                const f = parseInt(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f;
            }
        }
    };
</script>
