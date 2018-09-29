<style scoped="">
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
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
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    产品基础信息
                    <span v-auth="buttonShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('ppxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('ppxxcancel')">取消</Button>
                            <Button type="primary" @click="close('ppxxsave')">保存</Button>
                        </span>
                     </span>
                </p>
                <Form :label-width="100">
                    <Row>
                        <Col span="6">
                        <FormItem label="产品编号：" style="margin:0;">
                            {{ cpppbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="产品品牌名称：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.cpppmc }}</span>
                            <Select v-model="xjdDetail.cpppbh" placeholder="请选择" filterable v-else>
                                <Option v-for="status in brandArr" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="通用系列：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.cpmcty }}</span>
                            <Input v-model="xjdDetail.cpmcty" placeholder="请填写通用系列" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="产品类别：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.cplbmc }}</span>
                            <Select v-model="xjdDetail.cplbbh" placeholder="请选择" filterable v-else>
                                <Option v-for="status in cplbArr" :value="status.cplbbh" :key="status.cplbbh">{{ status.cplbmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="产品名称：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.cpmc }}</span>
                            <Input v-model="xjdDetail.cpmc" style="height:25px;" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="产品状态：" style="margin:0;">
                            <span v-if="is_edit">{{ cp_state[xjdDetail.is_deleted] }}</span>
                            <Select v-model="xjdDetail.is_deleted" placeholder="请选择" v-else>
                                <Option v-for="status in cpStateArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>


                        <Col span="6" class="margin-top-10">
                        <FormItem label="税收编码：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.tax_code }}</span>
                            <Input v-model="xjdDetail.tax_code" style="height:25px;" v-else></Input>
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
                    产品图片维护
                    <span v-auth="buttonShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="img_edit" @click="edit('tpwh')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('tpwhcancel')">取消</Button>
                            <Button type="primary" @click="close('tpwhsave')">保存</Button>
                        </span>
                    </span>
                </p>
                <div v-if="img_edit">
                    <div class="img-manage" v-for="(item, index) in imgArr">
                        <img :src="item">
                    </div>
                    <div class="clear"></div>
                </div>
                <div v-else>
                    <multi-pictures :picsArr="imgArr"></multi-pictures>
                    <Upload multiple :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic" :on-format-error="handleFormatError" class="margin-top-20">
                        <Button type="primary" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <div class="clear"></div>
                </div>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    产品详情描述
                    <span style="font-weight:normal;float:right;" v-auth="buttonShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="content_edit" @click="edit('content')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('contentcancel')">取消</Button>
                            <Button type="primary" @click="saveContent()">保存</Button>
                        </span>
                    </span>
                </p>
                <div v-show="content_edit" v-html="imgContent"></div>
                <div v-show="!content_edit" id="operate-edit"></div>
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
    </div>
</template>
<script type="text/ecmascript-6">
    let E = require('wangeditor');
    let editor;
    import multiPictures from '../../../../common/multiPictures.vue';
    import { apiAllStatus, apiGetProductSeriesDetail, operateAllBrandsList, operateAllBrandstype, apiGetProductSeriesModify, apiGetProductSeriesPic, apiGetProductSeriesCpxqmsKeep } from '@/config/getData';
    import {setToken} from '@/config/mUtils';

    export default {
        data () {
            return {
                buttonShow: 'operate_action_limit',
                cpppbh: this.$route.query.param,
                xjdDetail: {},
                is_edit: true,
                unlockStatus: '',
                unlockStatusArr: [],
                brandRules: {
                    cpppmc_ch: [
                        { required: true, message: '请输入品牌中文名称', trigger: 'blur' }
                    ],
                    cpppmc_en: [
                        { required: true, message: '请输入品牌英文名称', trigger: 'blur' }
                    ]
                },
                imgArr: [],
                cp_state: '',
//                img_edit: true,
                brandArr: [],
                cplbArr: [],
                cp_state: [],
                cpStateArr: [],
                uploadUrl: '',
                img_edit: true,
                content_edit:true,
                imgContent:'',
            };
        },
        components: {
            multiPictures
        },
        methods: {
            getStatus () {
                /*获取产品品牌*/
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.brandArr.push(res.data.list[i]);
                        }
                    }
                });
                operateAllBrandstype(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.cplbArr.push(res.data.list[i]);
                        }
                    }
                });
                apiAllStatus(this, {
                    type: JSON.stringify(['cp_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cp_state = res.data.cp_state;
                        let tmpObj = {};
                        for (let key in res.data.cp_state) {
                            if (res.data.cp_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cp_state[key]
                                };
                                this.cpStateArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                let tmpBaseUrl = this.imgURL;
                apiGetProductSeriesDetail(this, {
                    params: JSON.stringify({
                        cpbh: this.cpppbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xjdDetail = res.data.basic;
                        this.imgArr = res.data.cptp;
                        this.imgContent = res.data.cpxqms.cpxqms;
                        this.uploadUrl = this.baseUrl + '/v1/product/products/upload-pic?cpbh=' + this.cpppbh + '&token=' + setToken();
                        let tmpUrl;
                        this.imgArr = [];
                        res.data.cptp.forEach(item => {
                            tmpUrl = this.imgURL + item.image_url_src;
                            this.imgArr.push(tmpUrl);
                        });
                    }
                });
            },
            getEditor () {
                let tmpBaseUrl = this.imgURL;
                apiGetProductSeriesDetail(this, {
                    params: JSON.stringify({
                        cpbh: this.cpppbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        editor = new E('#operate-edit');
                        editor.customConfig.uploadImgServer = this.baseUrl + '/v1/product/products/cpxqms-upload?cpbh=' + this.cpppbh + '&token=' + setToken();
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
                        editor.txt.html(res.data.cpxqms.cpxqms);
                    }
                });
            },
            saveContent () {
                let contentStr = editor.txt.html();
                apiGetProductSeriesCpxqmsKeep(this, {
                    params: JSON.stringify({
                        cpbh: this.cpppbh,
                        cpxqms: contentStr
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        this.getEditor();
                        this.getData();
                        this.content_edit = true;
                    } else {
                        this.$Message.error('保存失败!');
                    }
                });
            },
            edit (name) {
                if (name === 'ppxx') {
                    this.is_edit = false;
                } else if (name === 'tpwh') {
                    this.img_edit = false;
                }else if(name === 'content'){
                    this.content_edit = false;
                }
            },
            close (name) {
                if (name === 'ppxxcancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'ppxxsave') {
                    this.is_edit = true;
                    apiGetProductSeriesModify(this, {
                        params: JSON.stringify({
                            cpbh: this.cpppbh,
                            cpppbh: this.xjdDetail.cpppbh,
                            cpmcty: this.xjdDetail.cpmcty.trim(),
                            cplbbh: this.xjdDetail.cplbbh,
                            cpmc: this.xjdDetail.cpmc.trim(),
                            is_deleted: this.xjdDetail.is_deleted,
                            tax_code: this.xjdDetail.tax_code,
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.getData();
                            this.$Message.success('修改成功');
                        } else {
                            this.getData();
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tpwhcancel') {
                    this.img_edit = true;
                    this.getData();
                } else if (name === 'tpwhsave') {
                    let tmpPicsArr = [];
                    let tmpBaseUrl = this.imgURL;
                    tmpPicsArr = this.imgArr.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));
                    apiGetProductSeriesPic(this, {
                        params: JSON.stringify({
                            cpbh: this.cpppbh,
                            pic: tmpPicsArr
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.getData();
                            this.img_edit = true;
                            this.$Message.success('修改成功');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }else if(name === 'contentcancel'){
                    this.content_edit = true;
                    this.getData();
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            displayPic (res, file, fileList) {
                let tmpUrl = this.imgURL + res.data.url;
                this.imgArr.push(tmpUrl);
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.getEditor();
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
