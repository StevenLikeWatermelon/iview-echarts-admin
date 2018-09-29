<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    品牌基础信息
                    <span v-auth="buttonShow">
                        <span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="is_edit" @click="edit('ppxx')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
                        <span style="font-weight:normal;float:right;" v-else>
                            <Button type="default" @click="close('ppxxcancel')">取消</Button>
                            <Button type="primary" @click="close('ppxxsave')">保存</Button>
                        </span>
                     </span>
                </p>
                <Form ref="brandForm" :model="xjdDetail" :rules="brandRules"  :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="品牌编号：" style="margin:0;">
                            {{ cpppbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="品牌中文名称：" style="margin:0;" prop="cpppmc">
                            <span v-if="is_edit">{{ xjdDetail.cpppmc }}</span>
                            <Input v-model="xjdDetail.cpppmc" style="width: 150px;height:25px;" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="品牌英文名称：" style="margin:0;" prop="cpppywmc">
                            <span v-if="is_edit">{{ xjdDetail.cpppywmc }}</span>
                            <Input v-model="xjdDetail.cpppywmc" style="width: 150px;height:25px;" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="品牌状态：" style="margin:0;">
                            <span v-if="is_edit">{{ cpppState[xjdDetail.cpppzt] }}</span>
                            <Select v-model="xjdDetail.cpppzt" placeholder="请选择" v-else style="width: 100px;">
                                <Option v-for="status in cpppStateArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-20">
                        <FormItem label="品牌排序：" style="margin:0;">
                            <span v-if="is_edit">{{ xjdDetail.cppppx }}</span>
                            <Input v-model="xjdDetail.cppppx" style="width: 150px;height:25px;" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="品牌图片：" style="margin:0;">
                            <div  v-if="is_edit">
                                <span  v-if="xjdDetail.pptp">
                                    <img :src="this.imgURL + xjdDetail.pptp" width="100" style="border:1px solid #eee;">
                                </span>
                            </div>
                            <div v-else>
                                <span  v-if="xjdDetail.pptp">
                                    <img :src="this.imgURL + xjdDetail.pptp" width="100" style="border:1px solid #eee;">
                                </span>
                                <Upload :action="uploadUrl"
                                        :format="['jpg', 'png', 'jpeg']"
                                        :on-format-error="handleFormatError"
                                        :on-success="handleSuccess"
                                        :show-upload-list="false">
                                    <Button type="primary" icon="ios-cloud-upload-outline">上传品牌图片</Button>
                                </Upload>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="Logo：" style="margin:0;">
                            <div v-if="is_edit">
                                <span v-if="xjdDetail.logo">
                                    <img :src="this.imgURL + xjdDetail.logo" width="100" style="border:1px solid #eee;">
                                </span>
                            </div>
                            <div v-else>
                                <span v-if="xjdDetail.logo">
                                    <img :src="this.imgURL + xjdDetail.logo" width="100" style="border:1px solid #eee;">
                                </span>
                                <Upload :action="uploadUrl"
                                        :format="['jpg', 'png', 'jpeg']"
                                        :on-format-error="handleFormatError"
                                        :on-success="handleSuccessLogo"
                                        :show-upload-list="false">
                                    <Button type="primary" icon="ios-cloud-upload-outline">上传品牌logo</Button>
                                </Upload>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="授权证书：" style="margin:0;">
                            <div v-if="is_edit">
                                <span v-if="xjdDetail.zstp">
                                    <img :src="this.imgURL + xjdDetail.zstp" width="100" style="border:1px solid #eee;">
                                </span>
                            </div>
                            <div v-else>
                                <span v-if="xjdDetail.zstp">
                                    <img :src="this.imgURL + xjdDetail.zstp" width="100" style="border:1px solid #eee;">
                                </span>
                                <Upload :action="uploadUrl"
                                        :format="['jpg', 'png', 'jpeg','zip', 'rar']"
                                        :on-format-error="handleFormatError"
                                        :on-success="handleSuccessZstp"
                                        :show-upload-list="false">
                                    <Button type="primary" icon="ios-cloud-upload-outline">上传授权证书</Button>
                                </Upload>
                            </div>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="品牌描述：" style="margin:0;">
                            <span v-if="is_edit">{{xjdDetail.cpppms}}</span>
                            <Input type="textarea" v-model="xjdDetail.cpppms" v-else style="width:60%;"></Input>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiGetProductBrandDetail, apiGetProductBrandModify } from '@/config/getData';
    import { setToken } from '@/config/mUtils';
    export default {
        name: 'service-sales-manage-xjddetail',
        data () {
            return {
                buttonShow: 'product_brand_detail_edit_button',
                cpppbh: this.$route.query.param,
                xjdDetail: {},
                is_edit: true,
                unlockStatusArr: [],
                brandRules: {
                    cpppmc: [
                        { required: true, message: '请输入品牌中文名称', trigger: 'blur' }
                    ],
                    cpppywmc: [
                        { required: true, message: '请输入品牌英文名称', trigger: 'blur' }
                    ],
//                    pptp: [
//                        { required: true, message: '请上传品牌图片', trigger: 'on-change' }
//                    ],
//                    logo: [
//                        { required: true, message: '请上传品牌logo', trigger: 'on-change' }
//                    ]
                },
                cpppState: [],
                cpppStateArr: [],
                uploadUrl: this.baseUrl + '/v1/product/brand/upload-pic?token=' + setToken()
            };
        },
        methods: {
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                    this.xjdDetail.pptp = response.data.url;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
            },
            handleSuccessLogo (response, file, fileList) {
                if (response.status == 1) {
                    this.xjdDetail.logo = response.data.url;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
            },
            handleSuccessZstp (response, file, fileList) {
                if (response.status == 1) {
                    this.xjdDetail.zstp = response.data.url;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['cppp_state' ])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.cpppState = res.data.cppp_state;
                        for (let key in res.data.cppp_state) {
                            if (res.data.cppp_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cppp_state[key]
                                };
                                this.cpppStateArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetProductBrandDetail(this, {
                    params: JSON.stringify({
                        cpppbh: this.cpppbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xjdDetail = res.data;
                    }
                });
            },
            //排序
            manualSort (column) {
//                let isDec = column.order == "descending" ? true : false;
//                this.orderDetail.goods.data.sort(sortBy(column.prop, isDec));
            },
            edit (name) {
                if (name === 'ppxx') {
                    this.is_edit = false;
                }
            },
            close (name) {
                if (name === 'ppxxcancel') {
                    this.is_edit = true;
                    this.getData();
                } else if (name === 'ppxxsave') {
                    this.$refs['brandForm'].validate((valid) => {
                        if (valid) {
                            apiGetProductBrandModify(this, {
                                params: JSON.stringify({
                                    cpppbh: this.cpppbh,
                                    cpppmc: this.xjdDetail.cpppmc.trim(),
                                    cpppywmc: this.xjdDetail.cpppywmc.trim(),
                                    cpppzt: this.xjdDetail.cpppzt,
                                    cppppx: this.xjdDetail.cppppx.trim(),
                                    logo: this.xjdDetail.logo,
                                    pptp: this.xjdDetail.pptp,
                                    zstp: this.xjdDetail.zstp,
                                    cpppms: this.xjdDetail.cpppms
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
                                    this.is_edit = true;
                                    this.getData();
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
            }
        },
        created () {
            this.getStatus();
            this.getData();
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
