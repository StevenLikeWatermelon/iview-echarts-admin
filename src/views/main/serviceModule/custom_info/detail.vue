<style>
    .custom-info .ivu-form-item-content {
        position: relative;
        line-height: 32px;
        font-size: 12px;
        margin-left: 100px;
    }
    #invoiceAddr .ivu-form-item-label:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
    .img-manage{
        float:left;
        width:150px;
        height:150px;
        border: 1px solid rgba(204, 204, 204, 0.8);
    }
    .img-manage:nth-child(n+2) {
        margin-left:20px;
    }
    .img-manage img {
        width:100%;
        height:100%;
    }
</style>
<template>
<div class="custom-info">
    <Tabs :animated="false"  @on-click="tabDetail" v-model="changeTab">
        <TabPane label="基础信息" name="tab0">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        基础信息
                        <span v-auth="detailLimit">
                           <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('khxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                            <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('khxxcancel')">取消</Button>
                                    <Button type="primary" @click="close('khxxsave')">保存</Button>
                            </span> 
                        </span>
                    </p>
                    <Form  ref="basic_info" :model="basic_info" :rules="basicRules" :label-width="100">
                        <Row>
                            <Col span="6" style="margin-bottom: 10px;">
                            <FormItem label="手机号码：" style="margin:0;" v-show="is_edit">
                                <span>{{ basic_info.sjhm }}</span>
                            </FormItem>
                            <FormItem label="手机号码：" style="margin:0;" prop="sjhm" v-show="!is_edit">
                                <Input v-model="basic_info.sjhm" style="width: 160px;height:25px;"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" style="margin-bottom: 10px;" >
                            <FormItem label="客户名称：" style="margin:0;" v-show="is_edit">
                                <span >{{ basic_info.khmc }}</span>
                            </FormItem>
                            <FormItem label="客户名称：" style="margin:0;" prop="khmc" v-show="!is_edit">
                                <Input v-model="basic_info.khmc" style="width: 160px;height:25px;"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" style="margin-bottom: 10px;">
                            <FormItem label="联系人：" style="margin:0;" v-show="is_edit">
                                <span> {{ basic_info.lxr }}</span>
                            </FormItem>
                            <FormItem label="联系人：" style="margin:0;" prop="lxr" v-show="!is_edit">
                                <Input v-model="basic_info.lxr" style="width: 160px;height:25px;"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" style="margin-bottom: 10px;">
                            <FormItem label="积分：" style="margin:0;">
                                {{ basic_info.jf }}
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="客户等级：" style="margin:0;">
                                {{ basic_info.khdjmc }}
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="是否vip用户：" style="margin:0;">
                                <span v-if="is_edit"> {{ is_vip[basic_info.is_vip] }}</span>
                                <Select v-model="basic_info.is_vip"  placeholder="请选择" style="width: 100px;height:25px;" v-else>
                                    <Option v-for="(value, key) in is_vip" :value="key" :key="key">{{ value }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="是否免运用户：" style="margin:0;">
                                <span v-if="is_edit"> {{ is_my[basic_info.is_my] }}</span>
                                <Select v-model="basic_info.is_my"  placeholder="请选择" style="width: 100px;height:25px;" v-else>
                                    <Option v-for="(value, key) in is_my" :value="key" :key="key">{{ value }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="积分倍数：" style="margin:0;" v-show="is_edit">
                                <span> {{ basic_info.jfbs }}</span>
                            </FormItem>
                            <FormItem label="积分倍数：" style="margin:0;" prop="jfbs" v-show="!is_edit">
                                <Input v-model="basic_info.jfbs" style="width: 100px;height:25px;" placeholder="默认倍数为1"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="所属客服：" style="margin:0;" v-show="is_edit">
                                <span> {{ basic_info.sskf }}</span>
                            </FormItem>
                            <FormItem label="所属客服：" style="margin:0;" prop="czyg_ygbh" v-show="!is_edit">
                                <Select v-model="basic_info.czyg_ygbh" :disabled="!editDisabled"  placeholder="请选择" filterable style="width: 100px;height:25px;" @on-change="BindKf">
                                    <Option v-for="sale in orderInfo.sskfArr" :value="sale.czyg_ygbh" :key="sale.czyg_ygbh">{{ sale.czyg }}</Option>
                                </Select>

                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="客服所属部门：" style="margin:0;">
                                {{ basic_info.czygbm }}
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="所属销售：" style="margin:0;" v-show="is_edit">
                                <span> {{ basic_info.ssxs }}</span>
                            </FormItem>
                            <FormItem label="所属销售：" style="margin:0;" prop="ygbh" v-show="!is_edit">
                                <Select v-model="basic_info.ygbh" :disabled="!editDisabled"  placeholder="请选择" style="width: 100px;height:25px;" filterable @on-change="BindXs">
                                    <Option v-for="sale in orderInfo.ssxsArr" :value="sale.ygbh" :key="sale.ygbh">{{ sale.ygxm }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10"  style="margin-bottom: 10px;">
                            <FormItem label="销售所属部门：" style="margin:0;">
                                {{ basic_info.bmmc }}
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="新阳客户ID：" style="margin:0;">
                                <span v-if="is_edit"> {{ basic_info.xy_kh_id }}</span>
                                <Input v-model="basic_info.xy_kh_id" style="width: 100px;height:25px;" v-else></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="状态：" style="margin:0;">
                                <span v-if="is_edit"> {{ kh_is_deleted[basic_info.is_deleted] }}</span>
                                <Select v-model="basic_info.is_deleted"  placeholder="请选择" style="width: 100px;height:25px;" v-else>
                                    <Option v-for="(value, key) in kh_is_deleted" :value="key" :key="key">{{ value }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="企业认证：" style="margin:0;">
                                {{ is_qyrz[basic_info.is_qyrz] }}
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="传真号码：" style="margin:0;">
                                <span v-if="is_edit">{{ basic_info.czhm }}</span>
                                <Input v-model="basic_info.czhm" style="width: 160px;height:25px;" v-else></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="开户银行：" style="margin:0;">
                                <span v-if="is_edit">{{ basic_info.khkhyh }}</span>
                                <Input v-model="basic_info.khkhyh" style="width: 160px;height:25px;" v-else></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="银行账号：" style="margin:0;">
                                <span v-if="is_edit">{{ basic_info.khyhhh }}</span>
                                <Input v-model="basic_info.khyhhh" style="width: 160px;height:25px;" v-else></Input>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="是否短信屏蔽：" style="margin:0;">
                                <span v-if="is_edit">{{ is_shield[basic_info.is_shield] }}</span>
                                <Select v-model="basic_info.is_shield"  placeholder="请选择" style="width: 100px;height:25px;" v-else>
                                    <Option v-for="(value, key) in is_shield" :value="key" :key="key">{{ value }}</Option>
                                </Select>
                            </FormItem>
                            </Col>

                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="客户类型：" style="margin:0;" v-show="is_edit">
                                <span>{{ basic_info.khlxmc }}</span>
                            </FormItem>
                            <FormItem label="客户类型：" style="margin:0;" prop="khlxbh"  v-show="!is_edit">
                                <Select v-model="basic_info.khlxbh"  placeholder="请选择">
                                    <Option v-for="status in khlxStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">
                            <FormItem label="客户来源：" style="margin:0;" v-show="is_edit">
                                <span>{{ basic_info.khlymc }}</span>
                            </FormItem>
                            <FormItem label="客户来源：" style="margin:0;" prop="khlybh"  v-show="!is_edit">
                                <Select v-model="basic_info.khlybh"  placeholder="请选择">
                                    <Option v-for="status in khlyStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>



                            <Col span="24" class="margin-top-20">
                            <FormItem label="其他图片：" style="margin:0;" v-show="is_edit">
                                <multi-pictures :picsArr="imgArr" hideOpetate="yes"></multi-pictures>
                            </FormItem>
                            <FormItem label="其他图片：" style="margin:0;" v-show="!is_edit">
                                <span style="color: #cf0012">最多可上传10张（门头 店内 图片）</span>
                                <multi-pictures :picsArr="imgArr"></multi-pictures>
                                <Upload multiple :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :max-size="5120" :on-exceeded-size="handleMaxSize" class="margin-top-20">
                                    <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button>

                                </Upload>
                            </FormItem>
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
                    <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                </Card>
                </Col>
            </Row>
        </TabPane>
        <TabPane label="认证信息" name="tab1">
            <Row class="image-editor">
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        认证信息
                        <span v-auth="customauthenticationedit">
                            <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_rzxx" @click="edit('rzxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                            <span style="font-weight:normal;float:right;" v-else>
                                    <Button type="default" @click="close('rzxxcancel')">取消</Button>
                                    <Button type="primary" @click="close('rzxxsave')">保存</Button>
                            </span>
                        </span>
                    </p>
                    <Form v-show="is_rzxx" :label-width="120">
                        <Row>
                            <Col span="24">
                            <FormItem label="企业地址：" style="margin:0;">
                                {{ rzinfo.addr }}
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="营业执照图片：" style="margin:0;">
                                <span v-if="rzinfo.yyzztp != ''">
                                <a :href="this.imgURL + rzinfo.yyzztp" target="_blank"><img :src="this.imgURL + rzinfo.yyzztp" width="200px"></a>
                                </span>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Form v-show="!is_rzxx" :label-width="120" ref="rzinfo" :model="rzinfo" :rules="rzinfoRules">
                        <Row class="qyrz">
                            <Col span="24">
                            <FormItem label="认证地址：" style="margin:0;" prop="addressValue">
                                <Cascader :data="rzinfo.addressData" v-model="rzinfo.addressValue" style="width:300px;"></Cascader>
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="详细地址：" style="margin:0;" prop="khdz">
                                <Input v-model="rzinfo.khdz" style="width:300px;"></Input>
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="营业执照图片：" style="margin:0;" prop="yyzztp">
                                <Upload :action="uploadUrl"
                                        :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                                        :on-format-error="handleFormatError"
                                        :on-success="handleSuccess"
                                        :show-upload-list="false"
                                >
                                    <span>选择图片上传&nbsp;&nbsp;</span>
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                </Upload>
                                <span v-if="rzinfo.yyzztp != ''">
                                <a :href="this.imgURL + rzinfo.yyzztp" target="_blank"><img :src="this.imgURL + rzinfo.yyzztp" width="200px"></a>
                                </span>
                            </FormItem>
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
                    <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                    <Button type="info" class="margin-top-10" v-if="basic_info.is_qyrz == 2" style="margin:auto;" @click="toExamine('adopt')">审核通过</Button>
                    <Button type="warning" class="margin-top-10" v-if="basic_info.is_qyrz == 2" style="margin:auto;" @click="toExamine('reject')">审核驳回</Button>
                    <Button type="error" class="margin-top-10" v-if="basic_info.is_qyrz == 1" style="margin:auto;" @click="toExamine('invalid')">审核失效</Button>
                </Card>
                </Col>
            </Row>
        </TabPane>
        <TabPane label="积分记录" name="tab2">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title" v-if="is_jfxg">
                        积分记录
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="edit('jfjl')" v-auth="detailLimit"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                    </p>
                    <p slot="title" class="card-title" v-else>
                        积分修改
                        <span style="font-weight:normal;float:right;">
                                <Button type="default" @click="close('jfjlcancel')">取消</Button>
                                <Button type="primary" @click="close('jfjlsave')">保存</Button>
                        </span>
                    </p>
                    <div v-show="is_jfxg">
                        <el-table :data="jfjl.data" border stripe style="text-align: center">
                            <el-table-column prop="point" label="积分数量" >
                            </el-table-column>
                            <el-table-column prop="source" label="积分用途/来源">
                            <template slot-scope="scope">
                                <span> {{point_from[scope.row.source]}}</span>
                            </template>
                            </el-table-column>
                            <el-table-column prop="action" label="行为">
                            <template slot-scope="scope">
                                <span> {{point_action[scope.row.action]}}</span>
                            </template>
                            </el-table-column>
                            <el-table-column prop="ordernum" label="单据编号" width="120"></el-table-column>
                            <el-table-column prop="note" label="备注" min-width="120"></el-table-column>
                            <el-table-column prop="created" label="记录时间" width="150"></el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="jfjl.totalnum" :current="jfjl.currentPage"></pagination>
                    </div>
                    <Form v-show="!is_jfxg" :label-width="120" ref="jfjl" :model="jfjl" :rules="jfjlRules">
                        <Row class="jfjl">
                            <Col span="24">
                            <FormItem label="目前积分数量：" style="margin:0;">
                                <span style="font-size:16px;color:#cf0012;">{{jfjl.current_jfsl}}</span>
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="积分行为：" style="margin:0;" prop="jfxw">
                                <Select v-model="jfjl.jfxw"  placeholder="请选择" style="width:300px;">
                                    <Option v-for="(value, key) in point_action" :value="key" :key="key">{{ value }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="处理积分数量：" style="margin:0;" prop="cljfsl">
                                <Input v-model="jfjl.cljfsl" style="width:300px"></Input>
                            </FormItem>
                            </Col>
                            <Col span="24" class="margin-top-20">
                            <FormItem label="备注：" style="margin:0;" prop="state">
                                <Input type="textarea" v-model="jfjl.state" style="width:300px;"></Input>
                            </FormItem>
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
                    <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                </Card>
                </Col>
            </Row>
        </TabPane>
        <TabPane label="等级变动" name="tab3">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        等级变动
                    </p>
                    <el-table :data="levelchange.data" border stripe style="text-align: center">
                        <el-table-column prop="bdhdjmc" label="变动后" ></el-table-column>
                        <el-table-column prop="bdqdjmc" label="变动前"></el-table-column>
                        <el-table-column prop="sxsj" label="变动时间"></el-table-column>
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
        <TabPane label="收货地址" name="tab4">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        收货地址
                    </p>
                    <el-table :data="receiveAddress.data" border stripe style="text-align: center">
                        <el-table-column prop="shrxm" label="收货人" ></el-table-column>
                        <el-table-column prop="shrsjhm" label="收货人联系方式"></el-table-column>
                        <el-table-column prop="addr" label="收货地址"></el-table-column>
                        <el-table-column prop="sfmr" label="是否默认">
                        <template slot-scope="scope">
                            <span> {{sfmr[scope.row.sfmr]}}</span>
                        </template>
                        </el-table-column>
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
        <TabPane label="开票信息" name="tab5">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        开票信息
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="addInvoince()" v-auth="custominvioceadd"><Icon type="compose" class="margin-right-5"></Icon>添加</span>
                    </p>
                    <el-table :data="getinvoice.data" border stripe style="text-align: center">
                        <el-table-column prop="fplxmc" label="发票类型" min-width="120px">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.fplxmc}}</span>
                                <Select v-model="scope.row.fplxbh" style="width:200px;" placeholder="请选择类型" v-else transfer>
                                    <Option v-for="item in invoinceTypeArrForm" :value="item.value" :label="item.label" :key="item.value" ></Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fptt" label="发票抬头">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.fptt}}</span>
                                <Input v-model="scope.row.fptt" placeholder="请填写发票抬头" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="swdjzh" label="纳税人识别号">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.swdjzh}}</span>
                                <Input v-model="scope.row.swdjzh" placeholder="请填写纳税人识别号" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="kpdz" label="注册地址">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.kpdz}}</span>
                                <Input v-model="scope.row.kpdz" placeholder="请填写注册地址" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="kpdhhm" label="注册电话">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.kpdhhm}}</span>
                                <Input v-model="scope.row.kpdhhm" placeholder="请填写注册电话" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="jbkhyhmc" label="开户银行">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.jbkhyhmc}}</span>
                                <Input v-model="scope.row.jbkhyhmc" placeholder="请填写开户银行" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="jbkhzh" label="银行账号">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.jbkhzh}}</span>
                                <Input v-model="scope.row.jbkhzh" placeholder="请填写银行账号" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <span>{{auditStatusObj[scope.row.sfsh]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="custominvioceoperation" label="操作">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;" @click="editInvoice(scope.$index)"> 修改</span>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;" @click="examineInvoice(scope.row)" v-if="examineStatus[scope.row.id]"> 审核</span>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;" @click="deletedInvoice(scope.row.id)"> 删除</span>
                                </span>
                                <span v-else>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;" @click="saveInvoice(scope.$index)">保存</span>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;" @click="cancelInvoice(scope.$index)">取消</span>
                                </span>

                            </template>
                        </el-table-column>
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
        <TabPane label="收票地址" name="tab6">
            <Row>
                <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        收票地址
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" @click="addInvoiceAddr('', '', [], '', '0', '')" v-auth="detailLimit">
                            新增收票地址
                        </span>
                    </p>
                    <el-table :data="spAddrTable" border stripe style="text-align: center">
                        <el-table-column prop="shrxm" label="收票人"></el-table-column>
                        <el-table-column prop="shrdhhm" label="收票人联系方式" width="200"></el-table-column>
                        <el-table-column label="收票地址">
                             <template slot-scope="scope">
                                <span>{{scope.row.shsfmc + scope.row.shcsmc + scope.row.shxqmc + scope.row.shxxdz }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="kpdz" label="是否默认" width="80">
                             <template slot-scope="scope">
                                <span>{{ sfmr[scope.row.sfmr] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div>
                                    <div style="color: rgb(45, 140, 240);cursor: pointer;width:80px;display:inline-block;text-align:left;" v-if="scope.row.sfmr == 0" @click="setDefaultAddr(scope.row.id)">设为默认地址</div>
                                    <div style="color: #8a8a8a;width:80px;display:inline-block;text-align:left;" v-if="scope.row.sfmr == 1">默认地址</div>
                                    <div style="color: rgb(45, 140, 240);cursor: pointer;width:40px;display:inline-block;" @click="addInvoiceAddr(scope.row.shrxm, scope.row.shrdhhm, [parseInt(scope.row.shsfbh), parseInt(scope.row.shcsbh), parseInt(scope.row.shxqbh)], scope.row.shxxdz, scope.row.sfmr, scope.row.id)">修改</div>
                                    <div style="color: rgb(45, 140, 240);cursor: pointer;width:40px;display:inline-block;" @click="toExamine('invoiceAddrDel', scope.row.id)">删除</div>
                                </div>
                            </template>
                        </el-table-column>
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
    </Tabs>
    <!--确认弹框公用-->
    <Modal v-model='publickModal' :mask-closable='true' :width="300" class="orderForm-approvePass">
        <h3 slot="header">确认</h3>
        <div class="content">
            <span><Icon type="alert"></Icon></span>
            <span>
                <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>？</P>
            </span>
            <div class="clear"></div>
        </div>
        <div slot="footer">
            <Button type="text" @click="sureAction(publicCancel)">取消</Button>
            <Button type="primary" @click="sureAction(publicSure)">确定</Button>
        </div>
    </Modal>
    <!--开票地址弹框 -->
    <Modal v-model='invoiceAddressModal' :mask-closable='true' :width="500" class="orderForm-approvePass" id="invoiceAddr">
        <h3 slot="header">新增收票地址</h3>
        <Form :label-width="120" ref="invoiceAddress" :model="invoiceAddrForm" :rules="invoiceAddrRules">
            <Row>
                <Col span="24">
                <FormItem label="收票人：" style="margin:0;" prop="spr">
                    <Input v-model="invoiceAddrForm.spr" style="width: 300px;"></Input>
                </FormItem>
                </Col>
                <Col span="24" class="margin-top-20">
                <FormItem label="联系方式：" style="margin:0;" prop="lxfs">
                    <Input v-model="invoiceAddrForm.lxfs" style="width: 300px;"></Input>
                </FormItem>
                </Col>
                <Col span="24" class="margin-top-20">
                <FormItem label="收票地址：" style="margin:0;" prop="spdz">
                    <Cascader :data="rzinfo.addressData" v-model="invoiceAddrForm.spdz" style="width:300px;float:left;"></Cascader>
                    <div class="clear"></div>
                </FormItem>
                </Col>
                <Col span="24" class="margin-top-20">
                <FormItem label="详细地址：" style="margin:0;" prop="xxdz">
                    <Input v-model="invoiceAddrForm.xxdz" style="width: 300px;"></Input>
                </FormItem>
                </Col>
                <Col span="24" class="margin-top-20">
                <FormItem label="是否默认：" style="margin:0;" prop="isDefault">
                    <Radio-group v-model="invoiceAddrForm.isDefault">
                        <Radio label="0">否</Radio>
                        <Radio label="1">是</Radio>
                    </Radio-group>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="text" @click="sureAction('invoiceAddrCancel')">取消</Button>
            <Button type="primary" @click="sureAction('invoiceAddrSave')">确定</Button>
        </div>
    </Modal>



    <!--弹框公用-->
    <Modal v-model='publicDeleted' :mask-closable=false :width="300" class="orderForm-approvePass">
        <h3 slot="header">确认</h3>
        <div class="content">
            <span><Icon type="alert"></Icon></span>
            <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>?</P>
                </span>
            <div class="clear"></div>
        </div>
        <div slot="footer">
            <Button type="text" @click="clanceDeleted">取消</Button>
            <Button type="primary" :loading="loadding" @click="sureDeleted(deleted_id)">确定</Button>
        </div>
    </Modal>




    <!--审批弹框-->
        <Modal v-model="showApprove" title="请选择审批意见" @on-ok="examineAction">
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100">
                        <Row>
                            <Col span="24">
                            <FormItem label="审批结果：">
                                <RadioGroup v-model="isPass" >
                                    <Radio label="1">同意</Radio>
                                    <Radio label="0">驳回</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                </col>
            </Row>
        </Modal>

        
        <Modal v-model="showAdd" title="发票信息" class="modal-margin">
            <Form ref="addInvoinceForm" :model="addInvoinceForm" :rules="InvoinceFormRule" :label-width="95" :show-message="false">
                <FormItem label="客户编号">
                   <span>{{khbh}}</span>
                </FormItem>
                <FormItem prop="invoinceType" label="发票类型">
                    <Select v-model="addInvoinceForm.invoinceType" style="width:200px;" placeholder="请选择类型" @on-change="changeRequire">
                        <Option v-for="item in invoinceTypeArrForm" :value="item.value" :label="item.label" :key="item.value" ></Option>
                    </Select>
                </FormItem>
                <FormItem prop="invoinceStart" label="发票抬头">
                    <Input type="text" v-model="addInvoinceForm.invoinceStart" placeholder="发票抬头">
                    </Input>
                </FormItem>
                <FormItem prop="taxpayerNum" label="纳税人识别码">
                    <Input type="text" v-model="addInvoinceForm.taxpayerNum" placeholder="纳税人识别码">
                    </Input>
                </FormItem>
                <FormItem prop="registerAdressDetail" label="注册地址"  class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.registerAdressDetail" placeholder="详细地址">
                    </Input>
                </FormItem>
                <FormItem prop="registerPhone" label="注册电话" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.registerPhone" placeholder="注册电话">
                    </Input>
                </FormItem>
                <FormItem prop="openAccountBank" label="开户银行" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.openAccountBank" placeholder="开户银行">
                    </Input>
                </FormItem>
                <FormItem prop="bankAccount" label="银行账号" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.bankAccount" placeholder="银行账号">
                    </Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancelAddInvoince()">取消</Button>
                <Button type="primary"  @click="confirmAddInvoince('addInvoinceForm')" :loading="loading">确定</Button>
            </div>
        </Modal>




</div>
</template>
<script type="text/ecmascript-6">
//    import Cropper from 'cropperjs';
    import multiPictures from '@/views/common/multiPictures.vue';
    import { apiAllStatus,apiCustomerBasicInfo,apiCustomerAllStaff,apiCustomerBasicModify,apiCustomerIntegralInfo,apiCustomerIntegralModify,apiCustomerGradeInfo,apiCustomerAddressInfo,apiCustomerAuthenticationInfo,apiCustomerInvoiceInfo,apiCustomerAuthenticationExamine,apiMapDetail,apiCustomerAuthenticationModify, apiGetServiceInvoiceAdress, apiGetServiceInvoiceAddrModify, apiGetServiceInvoiceAddrSetDefault, apiGetServiceInvoiceAddrDel,addEditInvoince,apiDeletedCustomInvoice,invoiceCheckApi } from '@/config/getData';
    import { setToken, manualCheck } from '@/config/mUtils';
    import pagination from '../../../common/pagination.vue';
    export default {
        components: {
            pagination,
            multiPictures
        },
        data () {
            const validatesjhm = (rule, value, callback) => {
                let re = /^\d{11}$/;
                if (!re.test(value)) {
                    return callback(new Error('手机号码必须是11位数字'));
                } else {
                    callback();
                }
            };
           const validatejfbs = (rule, value, callback) => {
               let re = /^[0-9]\d*$/;
               if (!re.test(value)) {
                   return callback(new Error('积分倍数只能是数字'));
               } else {
                   callback();
               }
           };
            const validatecljfsl = (rule, value, callback) => {
                let re = /^[0-9]\d*$/;
                if (!re.test(value)) {
                    return callback(new Error('使用积分数量只能是数字'));
                } else {
                    callback();
                }
            };
            const validatejfxw = (rule, value, callback) => {
                if (value === '') {

                    return callback(new Error('积分行为不能为空'));
                } else {
                    callback();
                }
            };
            const validateadd = (rule, value, callback) => {
                if (isNaN(value[0])) {
                    return callback(new Error('认证地址不能为空'));
                } else {
                    callback();
                }
            };
          return {
              notDetail: 'service-custom-not-detail',
              detailLimit: 'service-custom-info-Limit',
              customauthenticationedit:'custom_authentication_edit',
              custominvioceoperation:manualCheck('custom_invioce_operation'),
              changeTab: 'tab0',
              editDisabled: false,
              jfjlRules:{
                  jfxw: [
                      {validator: validatejfxw, trigger: 'blur'}
                  ],
                  cljfsl:[
                      {required: true, message: '处理积分数量不能为空', trigger: 'blur'},
                      {validator: validatecljfsl, trigger: 'blur'}
                  ],
                  state:[
                      {required: true, message: '备注不能为空', trigger: 'blur'},
                  ],
              },
              rzinfoRules:{
                  addressValue: [
                      {validator: validateadd, trigger: 'blur'}
                  ],
                  khdz:[
                      {required: true, message: '详细地址不能为空', trigger: 'blur'},
                  ],
                  yyzztp:[
                      {required: true, message: '营业执照图片不能为空', trigger: 'blur'},
                  ],
              },
              basicRules:{
                  sjhm: [
                      {required: true, message: '手机号码不能为空', trigger: 'blur'},
                      {validator: validatesjhm, trigger: 'blur'}
                  ],
                  khmc: [
                      {required: true, message: '客户名称不能为空', trigger: 'blur'},
                  ],
                  lxr:[
                      {required: true, message: '联系人不能为空', trigger: 'blur'},
                  ],
                  jfbs:[
                      {required: true, message: '积分倍数不能为空', trigger: 'blur'},
                      {validator: validatejfbs, trigger: 'blur'}
                  ],
                  czyg_ygbh:[
                      {required: true, message: '所属客服不能为空', trigger: 'blur'},
                  ],
                  ygbh:[
                      {required: true, message: '所属销售不能为空', trigger: 'blur'},
                  ],
                  khlybh:[
                      {required: true, message: '客户来源不能为空', trigger: 'blur'},
                  ],
                  khlxbh:[
                      {required: true, message: '客户类型不能为空', trigger: 'blur'},
                  ],
              },
              khbh: this.$route.query.param,
              imgArr:[],
              basic_info: {
                  sjhm: '',
                  khmc: '',
                  lxr: '',
                  jf: '',
                  khdjmc: '',
                  is_vip: '',
                  is_my: '',
                  jfbs: '',
                  xy_kh_id: '',
                  sskf: '',
                  czyg_ygbm: '',
                  ssxs: '',
                  bmmc: '',
                  is_deleted: '',
                  is_qyrz: '',
                  czyg_ygbh:'',
                  ygbh:'',
                  is_shield:'',
                  khlymc:'',
                  khlxmc:'',
                  khlybh:'',
                  khlxbh:'',
              },
              khlxStatus:'',
              khlyStatus:'',
              khlxStatusArr: [
              ],
              khlyStatusArr: [
              ],
              orderInfo: {
                  sskfArr:'',
                  ssxsArr: '',

              },
              rzinfo: {
                  addr: '',
                  yyzztp: '',
                  addressValue: [],
                  addressData: [

                  ],
                  khdz: ''
              },
              jfjl: {
                  data: [],
                  limit: 10,
                  totalnum: 0,
                  currentPage: 1,
                  current_jfsl: '',
                  jfxw: '',
                  cljfsl: '',
                  state: '',
                  point: '',
                  source:'',
                  action:'',
                  ordernum:'',
                  note:'',
                  created:'',
              },
              levelchange: {
                  data: []
              },
              receiveAddress: {
                  data: []
              },
              getinvoice: {
                  data: []
              },
              kh_is_deleted: '',
              is_vip: '',
              is_my: '',
              is_qyrz: '',
              point_from: '',
              point_action: '',
              is_shield:'',
              is_edit: true,
              is_rzxx: true,
              is_jfxg: true,
              orderField: 'khbh',
              orderDirection: 'desc',
              type:'adopt',
              cropper1: {},
              option1: {
                  showCropedImage: false,
                  cropedImg: ''
              },
              publickModal: false,
              publicState: '',
              publicCancel: '',
              publicSure: '',
              initNum: 0,
              invoiceAddressModal: false,
              uploadUrl: this.baseUrl+'/v1/customers/customer/upload-pic?token=' + setToken(),
              spAddrTable: [],
              uploadList: [],
              invoiceAddrForm: {
                  spr: '',
                  lxfs: '',
                  spdz: '',
                  xxdz: '',
                  isDefault: '0'
              },
              invoiceAddrRules:{
                  spr: [
                      {required: true, message: '收票人不能为空', trigger: 'blur'},
                  ],
                  lxfs: [
                      {required: true, message: '联系方式不能为空', trigger: 'blur'},
                  ],
                  // spdz: [
                  //     {required: true, message: '收票地址不能为空', trigger: 'on-change'},
                  // ],
                  xxdz: [
                      {required: true, message: '详细地址不能为空', trigger: 'blur'},
                  ],
                  isDefault: [
                      {required: true, message: '请选择是否默认', trigger: 'on-change'},
                  ]
              },
              addrId: '',
              publicDeleted:false,
              deleted_id:'',
              invoinceTypeArrForm:[],
              auditStatusObj:{},
              showApprove:false,
              isPass:'1',
              examine_id:'',
              examine_swdjzh:'',
              examineStatus:[],
              showAdd:false,
              addInvoinceForm: {
                    customNum: '',
                    invoinceType: '',
                    invoinceStart: '',
                    taxpayerNum: '',
                    registerAdressSelect: [],
                    registerAdressDetail: '',
                    registerPhone: '',
                    openAccountBank: '',
                    bankAccount: '',
                },
              InvoinceFormRule: {
                    invoinceStart: [{ required: true, trigger: 'blur' }],
                    taxpayerNum: [{ required: true, trigger: 'blur' }],
              },
              isRequired: true,
              custominvioceadd:'custom_invioce_add',
              copyList:[],
          };
        },
        methods: {
            changeRequire (value) {
                let allrequired = document.getElementsByClassName('delete-class');
                let i = 0;
                if (value == 1 && allrequired && allrequired.length) { //目前发票类型写死1，与后端已沟通不改样式id
                    for (i = 0; i < allrequired.length; i++) {
                        allrequired[i].setAttribute('class', 'delete-class ivu-form-item ivu-form-item-required');
                    }
                    this.isRequired = true;
                } else {
                    if (allrequired && allrequired.length) {
                        for (i = 0; i < allrequired.length; i++) {
                            allrequired[i].setAttribute('class', 'delete-class ivu-form-item');
                        }
                        this.isRequired = false;
                    }
                }
            },
            cancelAddInvoince() {
                this.showAdd = false;
            },
            confirmAddInvoince(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('表单校验错误,请检查');
                        return;
                    } else {
                        this.loading = true;
                        addEditInvoince(this, {
                            params: JSON.stringify({
                                khbh: this.khbh,
                                fplxbh: this.addInvoinceForm.invoinceType,
                                fptt: this.addInvoinceForm.invoinceStart,
                                swdjzh: this.addInvoinceForm.taxpayerNum,
                                kpdz: this.addInvoinceForm.registerAdressDetail,
                                kpdhhm: this.addInvoinceForm.registerPhone,
                                jbkhyhmc: this.addInvoinceForm.openAccountBank,
                                jbkhzh: this.addInvoinceForm.bankAccount,
                                sfmr: 1,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message && this.$Message.success(res.message);
                                this.loading = false;
                                this.showAdd = false;
                                this.getInvoiceInfo();
                            } else {
                                this.$Message && this.$Message.error(res.message);
                                this.loading = false;
                            }
                        }, error => {
                            this.$Message && this.$Message.error(res.message);
                            this.loading = false;
                        });
                    }
                });
            },
            addInvoince() {
                this.addInvoinceForm.invoinceStart = this.basic_info.khmc;
                this.showAdd = true;
            },
            examineAction(){
                invoiceCheckApi(this, {
                    params: JSON.stringify({
                        swdjzh:this.examine_swdjzh,
                        id: this.examine_id,
                        audit_status: (this.isPass == '1')?'yes':'no'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message && this.$Message.success(res.message);
                        this.getInvoiceInfo();
                    } else {
                        this.$Message && this.$Message.error(res.message);
                    }
                })
            },
            examineInvoice(val){
                this.showApprove = true;
                this.examine_id = val.id;
                this.examine_swdjzh = val.swdjzh;
            },
            BindKf (type) {
                for(let i=0;i<this.orderInfo.sskfArr.length;i++){
                    if(type == this.orderInfo.sskfArr[i]['czyg_ygbh']){
                        this.basic_info.czygbm = this.orderInfo.sskfArr[i]['czygbm'];
                    }
                }
            },
            BindXs (type){
                for(let i=0;i<this.orderInfo.ssxsArr.length;i++){
                    if(type == this.orderInfo.ssxsArr[i]['ygbh']){
                        this.basic_info.bmmc = this.orderInfo.ssxsArr[i]['bmmc'];
                    }
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            handleSuccess (response, file, fileList) {       
               if(response.status == 1){
                   this.rzinfo.yyzztp = response.data.url;
                   this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
               }else{

                   this.$Notice.error({
                       title: '文件上传失败',
                       desc: '文件 ' + file.name + ' 上传失败。'
                   });
               }
            },
            //获取状态
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['kh_is_deleted', 'is_vip', 'is_my', 'is_qyrz', 'point_from', 'point_action','sfmr','is_shield','khly','khlx','fplx','sfsh'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.kh_is_deleted = res.data.kh_is_deleted;
                        this.is_vip = res.data.is_vip;
                        this.is_my = res.data.is_my;
                        this.is_qyrz = res.data.is_qyrz;
                        this.point_from = res.data.point_from;
                        this.point_action = res.data.point_action;
                        this.sfmr = res.data.sfmr;
                        this.is_shield = res.data.is_shield;

                        this.auditStatusObj = res.data.sfsh;


                        let tmpObj = {};
                        this.khlxStatus = res.data.khlx;
                        this.khlyStatus = res.data.khly;


                        for (let key in res.data.khlx) {
                            if (res.data.khlx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khlx[key]
                                };
                                this.khlxStatusArr.push(tmpObj);
                            }
                        }
                        for (let key in res.data.khly) {
                            if (res.data.khly.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khly[key]
                                };
                                this.khlyStatusArr.push(tmpObj);
                            }
                        }
                        let firstValue = true;
                        for (let key in res.data.fplx) {
                            if (res.data.fplx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fplx[key]
                                };
                                if (firstValue) {
                                    this.addInvoinceForm.invoinceType = key;
                                    this.changeRequire(key);
                                    firstValue = false;
                                }
                                this.invoinceTypeArrForm.push(tmpObj);
                            }
                        }



                    }
                });

                apiCustomerAllStaff(this,{
                    params: JSON.stringify({
                        type:'customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderInfo.sskfArr = res.data.list;
                    }
                });

                apiCustomerAllStaff(this,{
                    params: JSON.stringify({
                        type:'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderInfo.ssxsArr = res.data.list;
                    }
                });
            },
            //获取客户基本信息
            getBasicInfo(){
                /*基础信息*/
                apiCustomerBasicInfo(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh

                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        let info;
                        this.basic_info = res.data.basic_info;
                        info = res.data.basic_info.other_picture;
                        this.imgArr = [];
                        let tmpUrl;
                        info.forEach(item => {
                            tmpUrl = this.imgURL + item;
                            this.imgArr.push(tmpUrl);
                        });
                    }
                });
            },

            //获取客户的积分记录
            getIntegralInfo(){
                /*积分记录*/
                apiCustomerIntegralInfo(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.jfjl.limit,
                        pageNum: this.jfjl.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        khbh:this.khbh

                    }))
                }).then(res => {
                    if (res && res.status == 1) {

                        this.jfjl.data = res.data.list;
                        this.jfjl.totalnum = res.data.totalCount;
                        this.jfjl.limit = res.data.numPerPage;
                        this.jfjl.current_jfsl = res.data.jf;
                    }
                });
            },

            //获取客户等级变动记录
            getGradeInfo(){
                /*等级变动记录*/
                apiCustomerGradeInfo(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh

                    }))
                }).then(res => {
                    if (res && res.status == 1) {

                        this.levelchange.data = res.data.list;
                    }
                });
            },
            //获取客户收货地址信息
            getAddressInfo(){
                /*收货地址信息*/
                apiCustomerAddressInfo(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh
                    }))
                }).then(res => {

                    if (res && res.status == 1) {

                        this.receiveAddress.data = res.data.list;
                    }
                });
            },

            //获取客户企业认证信息
            getAuthenticationInfo(){
                /*企业认证信息*/
                apiCustomerAuthenticationInfo(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.rzinfo.addr = res.data.authentication_info.addr;
                        this.rzinfo.yyzztp = res.data.authentication_info.yyzztp;
                        this.rzinfo.khdz = res.data.authentication_info.khdz;
                        this.rzinfo.addressValue[0] = parseInt(res.data.authentication_info.sfbh);
                        this.rzinfo.addressValue[1] = parseInt(res.data.authentication_info.sqbh);
                        this.rzinfo.addressValue[2] = parseInt(res.data.authentication_info.xqbh);
                    }
                });
            },
            //获取客户开票信息
            getInvoiceInfo(){
                /*收货地址信息*/
                apiCustomerInvoiceInfo(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh
                    }))
                }).then(res => {
                    if (res && res.status == 1) {

                        res.data.list.forEach(item => {
                            item.isEdit = false;
                        });

                        this.getinvoice.data = res.data.list;
                    }else{
                        this.getinvoice.data = [];
                    }

                    this.getinvoice.data.forEach(item => {
                            this.examineStatus[item.id] = (item.sfsh == 0);
                        });

                });
            },
            /*获取发票地址*/
            getInvoiceAddress () {
                apiGetServiceInvoiceAdress(this, {
                    params: JSON.stringify(this.notempty({
                        khbh:this.khbh
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.spAddrTable = res.data.list;
                    }
                });
            },
            //获取所有的地区信息
            getAddInfo(){
                /*获取地址信息*/
                apiMapDetail(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        this.rzinfo.addressData = res.data;
                    }
                });
            },
            getData () {
                this.getBasicInfo();//获取客户基本信息
                this.getAddInfo();//获取所有的地址信息
            },
            tabDetail (name) {
                if (name === 'tab0') {
                    this.getBasicInfo();
                } else if (name === 'tab1') {
                    this.getAuthenticationInfo();
                } else if (name === 'tab2') {
                    this.getIntegralInfo();
                } else if (name === 'tab3') {
                    this.getGradeInfo();
                } else if (name === 'tab4') {
                    this.getAddressInfo();
                } else if (name === 'tab5') {
                    this.getInvoiceInfo();
                } else if (name === 'tab6') {
                    this.getInvoiceAddress();
                }
            },
            //增加收票地址
            addInvoiceAddr (spr, lxfs, spdz, xxdz, is_default, id) {
                this.invoiceAddressModal = true;
                this.invoiceAddrForm = {
                    spr: spr,
                    lxfs: lxfs,
                    spdz: spdz,
                    xxdz: xxdz,
                    isDefault: is_default
                }; 
                this.addrId = id;   
               
            },
            edit (name) {
                if (name === 'khxx') {
                    this.is_edit = false;
                } else if (name === 'rzxx') {
                    this.is_rzxx = false;
                } else if (name === 'jfjl') {
                    this.is_jfxg = false;
                }
            },
            close (name) {
                if (name === 'khxxcancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'khxxsave') {
                    let tmpPicsArr = [];
                    let tmpBaseUrl = this.imgURL;
                    tmpPicsArr = this.imgArr.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));
                    this.$refs.basic_info.validate((valid) => {
                        if (valid) {
                            /*基础信息修改*/
                            apiCustomerBasicModify(this, {
                                params: JSON.stringify(this.notempty({
                                    sjhm:this.basic_info.sjhm,
                                    khbh:this.khbh,
                                    khmc:this.basic_info.khmc.trim(),
                                    lxr:this.basic_info.lxr,
                                    jfbs:this.basic_info.jfbs,
                                    is_vip:this.basic_info.is_vip,
                                    is_my:this.basic_info.is_my,
                                    is_deleted:this.basic_info.is_deleted,
                                    ygbh:this.basic_info.ygbh,
                                    czyg_ygbh:this.basic_info.czyg_ygbh,
                                    xy_kh_id:this.basic_info.xy_kh_id,
                                    czhm:this.basic_info.czhm,
                                    khkhyh:this.basic_info.khkhyh,
                                    khyhhh:this.basic_info.khyhhh,
                                    is_shield:this.basic_info.is_shield,
                                    khlybh:this.basic_info.khlybh,
                                    khlxbh:this.basic_info.khlxbh,
                                    pic:tmpPicsArr,
                                }))
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.getBasicInfo();
                                    this.$Message.success(res.message);
                                    this.is_edit = true;

                                }else{
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });

                } else if (name === 'rzxxcancel') {
                    this.is_rzxx = true;
                    this.getData();
                } else if (name === 'rzxxsave') {
                    this.$refs.rzinfo.validate((valid) => {
                        if (valid) {
                            /*认证信息修改*/
                            apiCustomerAuthenticationModify(this, {
                                params: JSON.stringify(this.notempty({
                                    khbh: this.khbh,
                                    sfbh: typeof(this.rzinfo.addressValue[0]) == 'undefined' ? '' : this.rzinfo.addressValue[0].toString(),
                                    sqbh: typeof(this.rzinfo.addressValue[1]) == 'undefined' ? '' : this.rzinfo.addressValue[1].toString(),
                                    xqbh:typeof(this.rzinfo.addressValue[2]) == 'undefined' ? '' : this.rzinfo.addressValue[2].toString(),
                                    khdz: this.rzinfo.khdz,
                                    yyzztp: this.rzinfo.yyzztp,

                                }))
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success(res.message);
                                    this.getAuthenticationInfo();
                                    this.basic_info.is_qyrz = 2;
                                    this.is_rzxx = true;

                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                } else if (name === 'jfjlcancel') {
                    this.is_jfxg = true;
                    this.getData();
                } else if (name === 'jfjlsave') {
                    this.$refs.jfjl.validate((valid) => {
                        if (valid) {
                            /*积分修改*/
                            apiCustomerIntegralModify(this, {
                                params: JSON.stringify(this.notempty({
                                    khbh: this.khbh,
                                    action: this.jfjl.jfxw,
                                    point: this.jfjl.cljfsl,
                                    note: this.jfjl.state,

                                }))
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success(res.message)
                                    this.getIntegralInfo();//获取客户积分记录
                                    this.jfjl.jfxw = '';
                                    this.jfjl.cljfsl = '';
                                    this.jfjl.state = '';
                                    this.is_jfxg = true;
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    });
                }
            },
            backTo () {
                history.go(-1);
            },
            sureAction(name, id){
                //审核通过
                if(name == 'tgModalSave'){
                    /*认证审核通过*/
                    apiCustomerAuthenticationExamine(this, {
                        params: JSON.stringify(this.notempty({
                            khbh:this.khbh,
                            type:'adopt',

                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.basic_info.is_qyrz = res.data.status;
                            this.getData();

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                    this.publickModal = false;

                } else if(name == 'tgModalCancel'){
                    this.publickModal = false;
                } else if(name == 'bhModalSave'){
                    /*认证审核驳回*/
                    apiCustomerAuthenticationExamine(this, {
                        params: JSON.stringify(this.notempty({
                            khbh:this.khbh,
                            type:'reject',
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.basic_info.is_qyrz = res.data.status;
                            this.getAuthenticationInfo();

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                    this.publickModal = false;
                } else if(name == 'bhModalCancel'){
                    this.publickModal = false;
                } else if(name == 'sxModalSave'){
                    /*认证审核失效*/
                    apiCustomerAuthenticationExamine(this, {
                        params: JSON.stringify(this.notempty({
                            khbh:this.khbh,
                            type:'invalid',

                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.basic_info.is_qyrz = res.data.status;
                            this.getAuthenticationInfo();

                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                    this.publickModal = false;
                } else if(name == 'sxModalCancel'){
                    this.publickModal = false;
                } else if (name === 'invoiceAddrCancel') {
                    this.invoiceAddressModal = false;
                } else if (name === 'invoiceAddrSave') {
                    this.$refs.invoiceAddress.validate((valid) => {
                        if (valid) {
                            if (this.invoiceAddrForm.spdz.length != 0) {
                                apiGetServiceInvoiceAddrModify(this, {
                                    params: JSON.stringify(this.notempty({
                                        id: this.addrId,
                                        khbh:this.khbh,
                                        shrxm: this.invoiceAddrForm.spr,
                                        shrdhhm: this.invoiceAddrForm.lxfs,
                                        shdz: JSON.stringify(this.invoiceAddrForm.spdz),
                                        shxxdz: this.invoiceAddrForm.xxdz,
                                        sfmr: this.invoiceAddrForm.isDefault
                                    }))
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        this.invoiceAddressModal = false;
                                        this.$Message.success(res.message);
                                        this.getInvoiceAddress();
                                    }else{
                                        this.$Message.error(res.message);
                                    }
                                });
                            } else {
                                 this.$Message.error('请选择收票地址');
                            }
                        }
                    });
                } else if (name === 'spdzCancel') {
                     this.publickModal = false;
                } else if(name == 'spdzSave'){
                    /*收票地址删除*/
                    apiGetServiceInvoiceAddrDel(this, {
                        params: JSON.stringify(this.notempty({
                            id: this.addrId
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.publickModal = false;
                            this.getInvoiceAddress();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            setDefaultAddr (id) {
                apiGetServiceInvoiceAddrSetDefault(this, {
                    params: JSON.stringify(this.notempty({
                                id: id
                            }))
                    }).then(res => {
                            if (res && res.status == 1) {
                                this.getInvoiceAddress();
                            }else{
                                 this.$Message.error(res.message);
                            }                            
                });             
            },
            saveInvoice(index){
                addEditInvoince(this,{
                    params: JSON.stringify(this.notempty({
                        id: this.getinvoice.data[index].id,
                        khbh:this.khbh,
                        fplxbh:this.getinvoice.data[index].fplxbh,
                        fptt:this.getinvoice.data[index].fptt,
                        swdjzh:this.getinvoice.data[index].swdjzh,
                        kpdz:this.getinvoice.data[index].kpdz,
                        kpdhhm:this.getinvoice.data[index].kpdhhm,
                        jbkhyhmc:this.getinvoice.data[index].jbkhyhmc,
                        jbkhzh:this.getinvoice.data[index].jbkhzh,
                        sfmr:1,

                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.$Message.success(res.message);
                        this.getinvoice.data[index].isEdit = false;
                    }else{
                        this.$Message.error(res.message);
                    }

                });
            },
            //开票信息修改
            editInvoice(index){
                this.getinvoice.data[index].isEdit = true;
                this.copyList = JSON.parse(JSON.stringify(this.getinvoice.data));
            },
            cancelInvoice(index){
                this.getinvoice.data = JSON.parse(JSON.stringify(this.copyList));
                this.getinvoice.data[index].isEdit = false;
            },
            sureDeleted(id){
                apiDeletedCustomInvoice(this,{
                    id:id,
                }).then(res => {
                    if(res && res.status == 1){
                        this.$Message.success(res.message);
                        this.getInvoiceInfo();
                        this.publicDeleted = false;
                    }else{
                        this.$Message.error(res.message);
                    }

                });
            },

            clanceDeleted(){
                this.publicDeleted = false;
            },

            deletedInvoice(id){
               this.publicDeleted = true;
               this.deleted_id = id;
            },
            //企业认证审核
            toExamine(type, id){
                if(type == 'adopt'){
                    //审核通过
                    this.publickModal = true;
                    this.publicState = '审核通过';
                    this.publicCancel = 'tgModalCancel';
                    this.publicSure = 'tgModalSave';
                } else if(type == 'reject'){
                    //审核驳回
                    this.publickModal = true;
                    this.publicState = '审核驳回';
                    this.publicCancel = 'bhModalCancel';
                    this.publicSure = 'bhModalSave';
                } else if(type == 'invalid'){
                    //审核失效
                    this.publickModal = true;
                    this.publicState = '审核失效';
                    this.publicCancel = 'sxModalCancel';
                    this.publicSure = 'sxModalSave';
                } else if (type == 'invoiceAddrDel') {
                    /*收票地址删除*/
                    this.publickModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'spdzCancel';
                    this.publicSure = 'spdzSave';
                    this.addrId = id;
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
                this.initNum = 0;
            },
            displayPic (res, file, fileList) {
                if(this.imgArr.length < 10){
                    let tmpUrl = this.imgURL + res.data.url;
                    this.imgArr.push(tmpUrl);
                }

            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '图片过大，不可大于5M'
                });
            },
            handleBeforeUpload () {
                this.initNum++;
                let check = this.imgArr.length<= 10;
                if (!check) {
                    return false;
                }
                return check;
            },
            getNowPage (page) {
                this.jfjl.currentPage = page;
                this.getIntegralInfo();
            },
            getNowLimit (limit) {

                this.jfjl.limit = limit;
                this.jfjl.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
            this.editDisabled = manualCheck(this.notDetail);
            this.getData();
        }
    };
</script>