<style>
    .product-info-manage .ivu-input {
        height: 30px;
    }
</style>
<template>
    <div class="product-info-manage">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        商品基础信息
                        <span v-auth="buttonAuth">
                            <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-show="!isEditInfo"  @click="editAndCopy()"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                            <span style="font-weight:normal;float:right;" v-show="isEditInfo">
                                <Button type="default" size="small"  @click="cancelEdit()">取消</Button>
                                <Button type="primary" size="small"  @click="saveEdit()">保存</Button>
                            </span>
                        </span>
                    </p>
                    <Row>
                        <Form inline :label-width="100">
                            <Col span="6">
                                <FormItem label="商品型号编号：">
                                    <span>{{detailInfo.cpxhbh}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="商品订货号：">
                                    <span v-show="!isEditInfo">{{detailInfo.cpdhh}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.cpdhh"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="商品型号：">
                                    <span v-show="!isEditInfo">{{detailInfo.cpxh}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.cpxh"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品编号：">
                                    <span  style="color: rgb(45, 140, 240);cursor: pointer;" @click="goToCpDetail">{{detailInfo.cpbh}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品品牌：">
                                    <span>{{detailInfo.cpppmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品名称：">
                                    <span>{{detailInfo.cpmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="通用系列：">
                                    <span>{{detailInfo.cpmcty}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品类别：">
                                    <span>{{detailInfo.cplbmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品模型名称：">
                                    <span>{{detailInfo.cpmxmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="计量单位：">
                                    <span v-show="!isEditInfo">{{detailInfo.jldw}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.jldw"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="净重：">
                                    <span v-show="!isEditInfo">{{detailInfo.jz}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.jz"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="最小包装数：">
                                    <span v-show="!isEditInfo">{{detailInfo.zxbzs}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.zxbzs"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="排序：">
                                    <span>{{detailInfo.cpxhpx}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="备注：">
                                    <span v-show="!isEditInfo">{{detailInfo.cpxhbz}}</span>
                                    <Input v-show="isEditInfo" v-model="detailInfo.cpxhbz"></Input>
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
                        商品图片信息
                    </p>
                    <pics-tmp :picsArr='detailPics'></pics-tmp>
                    <Row  style="margin-top:40px;"  v-auth="buttonAuth">
                        <Col span="24">
                            <Upload multiple :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic" style="float: left;">
                                <Button type="success" icon="ios-cloud-upload-outline">上传图片</Button>
                            </Upload>
                            <Button type="primary" style="float: left;margin-left: 20px;" :loading="loading" @click="savePic()">保存修改</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        商品详情描述
                        <span style="font-weight:normal;float:right;">
                            <Button type="primary" size="small"  @click="saveContent()" :loading="loading"  v-auth="buttonAuth">保存</Button>
                        </span>
                    </p>
                    <div id="operate-edit"></div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    let E = require('wangeditor');
    let editor;
    import { operateGoodsManageDetail, operateGoodsDetailEdit, operateAllBrandsList, operateGoodsDisEdit, operateGoodsPicsEdit, operateAllBrandstype } from '@/config/getData';
    import {setToken} from '@/config/mUtils';
    import util from '@/libs/util';
    import picsTmp from '../../../common/multiPictures.vue'
    export default {
        data () {
            return {
                buttonAuth: 'goods_manage_detail_edit_button',
                isEditInfo: false,
                detailInfo: {},
                copyDetailInfo:{},
                uploadUrl: '' ,
                loading: false,
                allBrandList: [],
                productType:[],
                detailPics: []
            };
        },
        components: {
            picsTmp
        },
        methods: {
            editAndCopy() {
                this.copyDetailInfo = JSON.parse(JSON.stringify(this.detailInfo));
                this.isEditInfo = true;
            },
            goToCpDetail() {
                util.openNewPage(this, 'operate_products_detail', {
                    param: this.detailInfo.cpbh
                });
                this.$router.push({
                    name: 'operate_products_detail',
                    query: {
                        param: this.detailInfo.cpbh
                    }
                });
            },
            cancelEdit() {
                this.detailInfo = JSON.parse(JSON.stringify(this.copyDetailInfo));
                this.isEditInfo = false;
            },
            saveEdit() {
                this.detailInfo.cpdhh = this.detailInfo.cpdhh.trim();
                this.detailInfo.cpxh = this.detailInfo.cpxh.trim();
                operateGoodsDetailEdit(this, {
                    params: JSON.stringify(this.detailInfo)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        this.isEditInfo = false;
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            savePic() {
                let tmpPicsArr = [];
                let tmpBaseUrl = this.imgURL;
                tmpPicsArr = this.detailPics.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));
                this.loading = true;
                operateGoodsPicsEdit(this, {
                    params: JSON.stringify({
                        cpbh: this.detailInfo.cpbh,
                        cpxhbh: this.detailInfo.cpxhbh
                    }),
                    cptp: JSON.stringify(tmpPicsArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            saveContent() {
                let contentStr = editor.txt.html();
                this.loading = true;
                operateGoodsDisEdit(this, {
                    params: JSON.stringify({
                        cpbh: this.detailInfo.cpbh,
                        cpxhbh: this.detailInfo.cpxhbh
                    }),
                    cpxqms: contentStr
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        this.getDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            getAllBrand () {
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allBrandList = res.data.list;
                    }
                });
                operateAllBrandstype(this,{}).then(res => {
                    this.productType = res.data.list;
                });
            },
            getDetail() {
                let tmpBaseUrl = this.imgURL;
                operateGoodsManageDetail(this, {
                    cpxhbh: this.$route.query.id
                }).then(res => {
                    this.detailInfo = res.data;
                    this.uploadUrl = this.baseUrl + '/v1/product/goods/upload-cptp?cpbh=' + res.data.cpbh + '&cpxhbh=' + res.data.cpxhbh + '&token=' + setToken();
                    let tmpUrl;
                    // 创建编辑器
                    editor = new E('#operate-edit');
                    editor.customConfig.uploadImgServer = this.baseUrl + '/v1/product/goods/upload-cpxqms-pic?cpbh=' + res.data.cpbh + '&cpxhbh=' + res.data.cpxhbh + '&token=' + setToken();
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
                    editor.txt.html(this.detailInfo.cpxqms);
                    this.detailPics = [];
                    res.data.picture.forEach(item => {
                        tmpUrl = this.imgURL + item.image_url_src;
                        this.detailPics.push(tmpUrl);
                    });
                });
            },
            displayPic(res, file, fileList) {
                let tmpUrl = this.imgURL + res.data.url;
                this.detailPics.push(tmpUrl);
            }
        },
        created() {
            this.getAllBrand();
            this.getDetail();
        }
    };
</script>
