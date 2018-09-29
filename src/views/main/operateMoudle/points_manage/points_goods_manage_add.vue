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
                    <Row>
                        <Form ref="addFormInfo" :model="addFormInfo" :rules="ruleValidate" :label-width="120">
                            <Col span="6">
                                <FormItem label="商品名称：" prop="integral_product_name">
                                    <Input v-model="addFormInfo.integral_product_name"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="计量单位：" prop="integral_product_unit">
                                    <Input v-model="addFormInfo.integral_product_unit"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="积分商品类型：" prop="integral_product_type">
                                    <Select v-model="addFormInfo.integral_product_type">
                                        <Option v-for="(status, index) in pointsTypeArr" :value="status.value" :key="index">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                             <Col span="6">
                                <FormItem label="兑换积分：" prop="redeem_integral">
                                    <Input v-model="addFormInfo.redeem_integral"></Input>
                                </FormItem>
                            </Col>
                             <Col span="6">
                                <FormItem label="库存数量：" prop="integral_product_num">
                                    <Input v-model="addFormInfo.integral_product_num"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="积分商品状态：" prop="integral_product_status">
                                    <Select v-model="addFormInfo.integral_product_status">
                                        <Option v-for="(status, index) in pointsStatusArr" :value="status.value" :key="index">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                             <Col span="6">
                                <FormItem label="排序：" prop="sort">
                                    <Input v-model="addFormInfo.sort"></Input>
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
                    <pics-tmp :picsArr='addFormInfo.product_original_image_local'></pics-tmp>
                    <Row  style="margin-top:40px;">
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
                    <div id="operate-edit"></div>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 10001;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="success" :loading="loading" style="margin-left:20px;" @click="saveAddData">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    let E = require('wangeditor');
    let editor;
    import { operatePointsGoodsAddApi, apiAllStatus } from '@/config/getData';
    import {setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    import picsTmp from '@/views/common/multiPictures.vue'
    export default {
        data () {
            return {
                addFormInfo: {
                    integral_product_name: '',
                    integral_product_unit: '',
                    integral_product_type: '0',
                    redeem_integral: '',
                    integral_product_num: '',
                    integral_product_status: '0',
                    sort: this.$route.query.maxSort || '',
                    product_original_image_local: [],
                    integral_product_detail: '',
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
                    integral_product_status: [{
                        required: true, message: '积分商品状态不能为空', trigger: 'blur'
                    }],
                    sort: [{
                        required: true, message: '排序输入有误', trigger: 'blur', pattern: /^[1-9]\d*$/,
                    }],
                },
                pointsStatusArr: [],
                pointsTypeArr: [],
                uploadUrl: this.baseUrl + '/v1/mall/integral/upload-pic?&token=' + setToken(),


                loading: false,
            };
        },
        components: {
            picsTmp
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['integral_product_type', 'integral_product_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};

                        // 积分商品状态
                        for (let key in res.data.integral_product_status) {
                            if (res.data.integral_product_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.integral_product_status[key]
                                };
                                this.pointsStatusArr.push(tmpObj);
                            }
                        }

                        // 积分商品类型
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
                });
            }, 
            saveAddData() {
                if (this.addFormInfo.product_original_image_local.length <= 0) {
                    this.$Message.error('积分商品图片信息不能为空!')
                    return;
                }
                let tmpBaseUrl = this.imgURL;
                this.addFormInfo.product_original_image = this.addFormInfo.product_original_image_local.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));
                this.$refs['addFormInfo'].validate((valid) => {
                    if (valid) {
                        this.addFormInfo.integral_product_detail = editor.txt.html();
                        this.loading = true;
                        operatePointsGoodsAddApi(this, {
                            params: JSON.stringify(this.addFormInfo)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'points_goods_manage_detail',{
                                    param: res.data.integral_product_no,
                                    fromAdd: 1
                                });
                                this.$router.push({
                                    name: 'points_goods_manage_detail',
                                    query: {
                                        param: res.data.integral_product_no,
                                        fromAdd: 1
                                    }
                                });
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        })
                    }
                })
            },
            displayPic(res, file, fileList) {
                let tmpUrl = this.imgURL + res.data.url;
                this.addFormInfo.product_original_image_local.push(tmpUrl);
            },
            createdEditor() {
                // 创建编辑器
                let tmpBaseUrl = this.imgURL;
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
            },
            backTo () {
                history.go(-1);
            }
        },
        mounted() {
            this.createdEditor();
        },
        created() {
            this.getStatus();
        }
    };
</script>
