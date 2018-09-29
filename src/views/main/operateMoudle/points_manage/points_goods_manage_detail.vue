<style>
    .product-info-manage .ivu-select-single .ivu-select-selection {
        height: 30px;
    }
</style>
<template>
    <div class="product-info-manage">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        积分商品基础信息
                    </p>
                    <div slot="extra" v-show="addFormInfo.integral_product_status == '0'">
                        <span class="span-for-click" v-show="!isEditBasic" @click="editBasic">编辑</span>
                        <Button type="default" size="small" :loading="loading" v-show="isEditBasic"  @click="cancelEditBasic()">取消</Button>
                        <Button type="primary" size="small" :loading="loading" v-show="isEditBasic"  @click="saveEditBasic()">保存</Button>
                    </div>
                    <Row>
                        <Form ref="addFormInfo" :model="addFormInfo" :rules="ruleValidate" :label-width="120">
                            <Col span="6">
                                <FormItem label="商品编号：">
                                    <span>{{addFormInfo.integral_product_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="商品名称：">
                                    <span>{{addFormInfo.integral_product_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isEditBasic">
                                <FormItem label="商品名称：" prop="integral_product_name">
                                    <Input v-model="addFormInfo.integral_product_name"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="计量单位：">
                                    <span>{{addFormInfo.integral_product_unit}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isEditBasic">
                                <FormItem label="计量单位：" prop="integral_product_unit">
                                    <Input v-model="addFormInfo.integral_product_unit"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="积分商品类型：">
                                    <span>{{pointsTypeObj[addFormInfo.integral_product_type]}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="isEditBasic">
                                <FormItem label="积分商品类型：" prop="integral_product_type">
                                    <Select v-model="addFormInfo.integral_product_type">
                                        <Option v-for="(status, index) in pointsTypeArr" :value="status.value" :key="index">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="兑换积分：">
                                    <span>{{addFormInfo.redeem_integral}}</span>
                                </FormItem>
                            </Col>
                             <Col span="6" v-show="isEditBasic">
                                <FormItem label="兑换积分：" prop="redeem_integral">
                                    <Input v-model="addFormInfo.redeem_integral"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="库存数量：">
                                    <span>{{addFormInfo.integral_product_num}}</span>
                                </FormItem>
                            </Col>
                             <Col span="6" v-show="isEditBasic">
                                <FormItem label="库存数量：" prop="integral_product_num">
                                    <Input v-model="addFormInfo.integral_product_num"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="积分商品状态：">
                                    <span>{{pointsStatusObj[addFormInfo.integral_product_status]}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6" v-show="!isEditBasic">
                                <FormItem label="排序：">
                                    <span>{{addFormInfo.sort}}</span>
                                </FormItem>
                            </Col>
                             <Col span="6" v-show="isEditBasic">
                                <FormItem label="排序：" prop="sort">
                                    <Input v-model="addFormInfo.sort"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建人：">
                                    <span>{{addFormInfo.create_user_info}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建时间：">
                                    <span>{{addFormInfo.create_time}}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        积分商品图片信息
                    </p>
                    <div slot="extra" v-show="addFormInfo.integral_product_status == '0'">
                        <span class="span-for-click" v-show="!isEditPicsArr" @click="editPicsArr">编辑</span>
                        <Button type="default" size="small" :loading="loading" v-show="isEditPicsArr"  @click="cancelEditPicsArr()">取消</Button>
                        <Button type="primary" size="small" :loading="loading" v-show="isEditPicsArr"  @click="saveEditPicsArr()">保存</Button>
                    </div>
                    <pics-tmp :picsArr='addFormInfo.product_original_image_local'></pics-tmp>
                    <Row  style="margin-top:40px;" v-show="isEditPicsArr">
                        <Col span="24">
                            <Upload multiple :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic" style="float: left;">
                                <Button type="success" icon="ios-cloud-upload-outline">上传图片</Button>
                            </Upload>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        积分商品详情描述
                    </p>
                    <div slot="extra" v-show="addFormInfo.integral_product_status == '0'">
                        <span class="span-for-click" v-show="!isEditDiscrip" @click="editDiscrip">编辑</span>
                        <Button type="default" size="small" :loading="loading" v-show="isEditDiscrip"  @click="cancelEditDiscrip()">取消</Button>
                        <Button type="primary" size="small" :loading="loading" v-show="isEditDiscrip"  @click="saveEditDiscrip()">保存</Button>
                    </div>
                    <div id="operate-edit" v-show="isEditDiscrip"></div>
                    <div v-show="!isEditDiscrip" v-html="addFormInfo.integral_product_detail"></div>
                </Card>
            </Col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete"
            @on-cancel="cancelDelete">
            <p>确认删除当前积分商品?</p>
        </Modal>  
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 10001;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;" v-if="fromAdd" @click="backToList">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;" v-if="!fromAdd" @click="backTo">返回</Button>
                <Button type="primary" :loading="loading" style="margin-left:20px;" v-show="addFormInfo.integral_product_status == '0'" @click="updatePoints('1')">上架</Button>
                <Button type="primary" :loading="loading" style="margin-left:20px;" v-show="addFormInfo.integral_product_status == '1'" @click="updatePoints('0')">下架</Button>
                <Button type="primary" :loading="loading" style="margin-left:20px;" v-show="addFormInfo.integral_product_status == '0'" @click="deletePoints">删除</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    let E = require('wangeditor');
    let editor;
    import { operatePointsGoodsDetailApi, apiAllStatus, operatePointsGoodsEditDetailBasicApi, operatePointsGoodsEditDetailPicsApi, operatePointsGoodsUpdateApi, operatePointsGoodsDeleteApi } from '@/config/getData';
    import {setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    import picsTmp from '@/views/common/multiPictures.vue'
    export default {
        data () {
            return {
                fromAdd: this.$route.query.fromAdd,
                isEditBasic: false,
                isEditPicsArr: false,
                isEditDiscrip: false,
                showDelete: false,

                addFormInfo: {
                    integral_product_no: '',
                    integral_product_name: '',
                    integral_product_unit: '',
                    integral_product_type: '0',
                    redeem_integral: '',
                    integral_product_num: '',
                    integral_product_status: '0',
                    sort: '',
                    product_original_image_local: [],
                    integral_product_detail: '',
                    create_user_info: '',
                    create_time: '',
                },
                ruleValidate: {
                    integral_product_name: [{
                        required: true, message: '商品名称不能为空', trigger: 'blur'
                    }],                    
                    integral_product_unit: [{
                        required: true, message: '计量单位不能为空', trigger: 'blur'
                    }],
                    integral_product_type: [{
                        required: true, message: '积分商品类型不能为空', trigger: 'blur'
                    }],
                    redeem_integral: [{
                        required: true, message: '兑换积分输入有误', trigger: 'blur', pattern: /^[1-9]\d*$/,
                    }],
                    integral_product_num: [{
                        required: true, message: '库存数量输入有误', trigger: 'blur', pattern: /^[1-9]\d*$/,
                    }],
                    sort: [{
                        required: true, message: '排序输入有误', trigger: 'blur', pattern: /^[1-9]\d*$/,
                    }],
                },
                pointsStatusObj: {},
                pointsTypeArr: [],
                pointsTypeObj: {},
                uploadUrl: this.baseUrl + '/v1/mall/integral/upload-pic?&token=' + setToken(),


                loading: false,
            };
        },
        components: {
            picsTmp
        },
        methods: {
            updatePoints(type) {
                this.loading = true;
                operatePointsGoodsUpdateApi(this, {
                    params: JSON.stringify({
                        integral_product_no: this.$route.query.param,
                        integral_product_status: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            deletePoints() {
                this.showDelete = true;
            },
            cancelDelete() {
                this.showDelete = false;
            },
            confirmDelete() {
                this.loading = true;
                operatePointsGoodsDeleteApi(this, {
                    integral_product_no: this.$route.query.param,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.showDelete = false;
                        this.backToList();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            editBasic() {
                if (this.isEditPicsArr || this.isEditDiscrip) {
                    this.$Message.error('请保存其他编辑项再操作');
                } else {
                    this.isEditBasic = true;
                }
            },
            cancelEditBasic() {
                this.getDetail();
                this.isEditBasic = false;
            },
            saveEditBasic() {
                this.$refs['addFormInfo'].validate((valid) => {
                    if (valid) {
                       this.DoSaveEditBasicAndDes(true);
                    }
                })
            },
            editPicsArr() {
                if (this.isEditBasic || this.isEditDiscrip) {
                    this.$Message.error('请保存其他编辑项再操作');
                } else {
                    this.isEditPicsArr = true;
                }
            },
            cancelEditPicsArr() {
                this.getDetail();
                this.isEditPicsArr = false;
            },
            saveEditPicsArr() {
                if (this.addFormInfo.product_original_image_local.length <= 0) {
                    this.$Message.error('积分商品图片信息不能为空!')
                    return;
                }
                let tmpBaseUrl = this.imgURL;
                this.addFormInfo.product_original_image = this.addFormInfo.product_original_image_local.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));
                this.loading = true;
                operatePointsGoodsEditDetailPicsApi(this, {
                    params: JSON.stringify({
                        integral_product_no: this.$route.query.param,
                        product_original_image: this.addFormInfo.product_original_image
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功');
                        this.getDetail();
                        this.isEditPicsArr = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })

            },
            editDiscrip() {
                if (this.isEditPicsArr || this.isEditBasic) {
                    this.$Message.error('请保存其他编辑项再操作');
                } else {
                    this.isEditDiscrip = true;
                }
            },
            cancelEditDiscrip() {
                this.getDetail();
                this.isEditDiscrip = false;
            },
            saveEditDiscrip() {
                this.addFormInfo.integral_product_detail = editor.txt.html();
                this.DoSaveEditBasicAndDes();
            },
            DoSaveEditBasicAndDes(isBasic) {
                this.loading = true;
                operatePointsGoodsEditDetailBasicApi(this, {
                    params: JSON.stringify(this.addFormInfo)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功');
                        this.getDetail();
                        if (isBasic) {
                            this.isEditBasic = false;
                        } else {
                            this.isEditDiscrip = false;
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['integral_product_type', 'integral_product_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};

                        // 积分商品状态
                        this.pointsStatusObj = res.data.integral_product_status;

                        // 积分商品类型
                        this.pointsTypeObj = res.data.integral_product_type;
                        for (let key in res.data.integral_product_type) {
                            if (res.data.integral_product_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.integral_product_type[key]
                                };
                                this.pointsTypeArr.push(tmpObj);
                            }
                        }
                    }
                    this.getDetail();
                });
            }, 
            getDetail() {
                let tmpBaseUrl = this.imgURL;
                operatePointsGoodsDetailApi(this, {
                    params: JSON.stringify({
                        integral_product_no: this.$route.query.param
                    })
                }).then(res => {
                    let tmpUrl;

                    this.addFormInfo.integral_product_no = res.data.integral_product_no;
                    this.addFormInfo.integral_product_name = res.data.integral_product_name;
                    this.addFormInfo.integral_product_unit = res.data.integral_product_unit;
                    this.addFormInfo.integral_product_type = res.data.integral_product_type.toString();
                    this.addFormInfo.redeem_integral = res.data.redeem_integral;
                    this.addFormInfo.integral_product_num = res.data.integral_product_num;
                    this.addFormInfo.integral_product_status = res.data.integral_product_status;
                    this.addFormInfo.sort = res.data.sort;

                    if (res.data.pic_url && res.data.pic_url.length > 0) {
                        this.addFormInfo.product_original_image_local = [];
                        res.data.pic_url.forEach(item => {
                            tmpUrl = this.imgURL + item.product_original_image;
                            this.addFormInfo.product_original_image_local.push(tmpUrl);
                        });
                    }
                    this.addFormInfo.integral_product_detail = res.data.integral_product_detail;
                    this.addFormInfo.create_user_info = res.data.create_user_no + ' / ' + res.data.create_user_name;
                    this.addFormInfo.create_time = res.data.create_time;

                    // 创建编辑器
                    editor = new E('#operate-edit');
                    editor.customConfig.uploadImgServer = this.baseUrl + '/v1/mall/integral/upload?&token=' + setToken();
                    editor.customConfig.uploadFileName  = 'myFileName[]';
                    editor.customConfig.uploadImgHooks = {
                        customInsert: function (insertImg, result, editor) {
                            if (typeof result.data.url == 'string') {
                                let url =  tmpBaseUrl + result.data.url;
                                insertImg(url);
                            } else {
                                result.data.url.forEach(item => {
                                    let url =  tmpBaseUrl + item;
                                    insertImg(url);
                                });
                            }
                        }
                    };
                    editor.create();
                    editor.txt.html(this.addFormInfo.integral_product_detail);
                });
            },
            displayPic(res, file, fileList) {
                let tmpUrl = this.imgURL + res.data.url;
                this.addFormInfo.product_original_image_local.push(tmpUrl);
            },

            backTo () {
                history.go(-1);
            },
            backToList () {
                util.openNewPage(this, 'points_goods_manage');
                this.$router.push({
                    name: 'points_goods_manage'
                });
            },
        },
        created() {
            this.getStatus();
        }
    };
</script>
