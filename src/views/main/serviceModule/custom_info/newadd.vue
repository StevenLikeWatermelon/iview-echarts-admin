<style >
    .custom-info .ivu-form-item-content {
        position: relative;
        line-height: 32px;
        font-size: 12px;
        margin-left: 100px;
    }
</style>
<template>
    <div class="custom-info">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    信息新增
                    <span style="font-weight:normal;float:right;" >
                        <Button type="default" @click="backTo()">取消</Button>
                        <Button type="primary" @click="save">保存</Button>
                    </span>
                </p>
                <Form ref="basic_info" :model="basic_info" :rules="basicRules">
                    <Row>
                        <Col span="6">
                        <FormItem label="手机号码：" style="margin:0;" prop="sjhm">
                            <Input v-model="basic_info.sjhm" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;" prop="khmc">
                            <Input v-model="basic_info.khmc" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="联系人：" style="margin:0;" prop="lxr">
                            <Input v-model="basic_info.lxr" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="积分：" style="margin:0;">
                            {{ basic_info.jf }}
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="客户等级：" style="margin:0;">
                            {{ basic_info.khdjmc }}
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="是否vip用户：" style="margin:0;">
                            <span> {{ is_vip[basic_info.is_vip] }}</span>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="是否免运用户：" style="margin:0;">
                            <span > {{ is_my[basic_info.is_my] }}</span>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="积分倍数：" style="margin:0;" prop="jfbs">
                            <Input v-model="basic_info.jfbs" style="width: 100px;height:25px;" placeholder="默认倍数为1"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="所属客服：" style="margin:0;" prop="czyg_ygbh">
                            <Select v-model="basic_info.czyg_ygbh"  placeholder="请选择" style="width: 100px;height:25px;" filterable  @on-change="BindKf">
                                <Option v-for="sale in orderInfo.sskfArr" :value="sale.czyg_ygbh" :key="sale.czyg_ygbh">{{ sale.czyg }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ basic_info.czygbm }}
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="所属销售：" style="margin:0;" prop="ygbh">
                            <Select v-model="basic_info.ygbh"  placeholder="请选择" style="width: 100px;height:25px;" filterable @on-change="BindXs">
                                <Option v-for="sale in orderInfo.ssxsArr" :value="sale.ygbh" :key="sale.ygbh">{{ sale.ygxm }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10" >
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ basic_info.bmmc }}
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="新阳客户ID：" style="margin:0;">
                            <span> {{ basic_info.xy_kh_id }}</span>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="状态：" style="margin:0;">
                            <span> {{ kh_is_deleted[basic_info.is_deleted] }}</span>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="企业认证：" style="margin:0;">
                            {{ is_qyrz[basic_info.is_qyrz] }}
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="传真号码：" style="margin:0;">
                            <Input v-model="basic_info.czhm" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="开户银行：" style="margin:0;">
                            <Input v-model="basic_info.khkhyh" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="银行账号：" style="margin:0;">
                            <Input v-model="basic_info.khyhhh" style="width: 160px;height:25px;" ></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="是否短信屏蔽：" style="margin:0;">
                            {{ is_shield[basic_info.is_shield] }}
                        </FormItem>
                        </Col>

                        <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">

                        <FormItem label="客户类型：" style="margin:0;" prop="khlxbh">
                            <Select v-model="basic_info.khlxbh"  placeholder="请选择">
                                <Option v-for="status in khlxStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>

                        <Col span="6" class="margin-top-10" style="margin-bottom: 10px;">

                        <FormItem label="客户来源：" style="margin:0;" prop="khlybh">
                            <Select v-model="basic_info.khlybh"  placeholder="请选择">
                                <Option v-for="status in khlyStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>


                        <Col span="24" class="margin-top-20">
                        <FormItem label="其他图片：" style="margin:0;">
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
    </div>
</template>
<script type="text/ecmascript-6">
    import multiPictures from '@/views/common/multiPictures.vue';
    import { setToken} from '@/config/mUtils';
    import { apiAllStatus,apiCustomerAdd,apiCustomerAllStaff } from '@/config/getData';
    export default {
        name: 'service-custom_info_detail',
        data () {
            const validateSjhm = (rule, value, callback) => {
                let re = /^1\d{10}$/;
                if (!re.test(value)) {
                    return callback(new Error('手机格式有误'));

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
            return {
                basicRules:{
                    sjhm:[
                        {required: true, message: '手机号码不能为空', trigger: 'blur'},
                        {validator: validateSjhm, trigger: 'blur'}
                    ],
                    khmc:[
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
                basic_info: {
                    sjhm: '',
                    khmc: '',
                    lxr: '',
                    jf: '0',
                    khdjmc: 'D3',
                    is_vip: '0',
                    is_my: '0',
                    jfbs: '1',
                    xy_kh_id: '',
                    czyg_ygbm: '',
                    bmmc: '',
                    is_deleted: '0',
                    is_qyrz: '0',
                    is_shield:'0',
                    czyg_ygbh:'',
                    ygbh:'',
                    khlybh:'',
                    khlxbh:''
                },
                imgArr: [],
                uploadUrl:this.baseUrl+'/v1/customers/customer/upload-other-pic?token=' + setToken(),
                khlxStatus:'',
                khlyStatus:'',
                initNum: 0,
                khlxStatusArr: [
                ],
                khlyStatusArr: [
                ],
                orderInfo: {
                    sskfArr:'',
                    ssxsArr: '',

                },
                kh_is_deleted: '',
                is_vip: '',
                is_my: '',
                is_qyrz: '',
                is_shield:''
            };
        },
        components: {
            multiPictures
        },
        methods: {
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['kh_is_deleted', 'is_vip', 'is_my', 'is_qyrz','is_shield','khly','khlx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.kh_is_deleted = res.data.kh_is_deleted;
                        this.is_vip = res.data.is_vip;
                        this.is_my = res.data.is_my;
                        this.is_qyrz = res.data.is_qyrz;
                        this.is_shield = res.data.is_shield;

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

                    }
                });
            },
            getData () {
                //获取到指定客服信息
                apiCustomerAllStaff(this,{
                    params: JSON.stringify({
                        type:'all_customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderInfo.sskfArr = res.data.list;

                    }
                });

                //获取指定销售信息
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
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
                this.initNum = 0;
            },
            displayPic (res, file, fileList) {
                if(this.imgArr.length < 10) {
                    let tmpUrl = this.imgURL + res.data.url;
                    this.imgArr.push(tmpUrl);
                }
            },
            handleBeforeUpload () {
                let check = this.imgArr.length + this.initNum <= 10;
                if (!check) {
                    return false;
                }
                return check;
            },
            backTo () {
                history.go(-1);
            },
            save () {

                let tmpPicsArr = [];
                let tmpBaseUrl = this.imgURL;
                tmpPicsArr = this.imgArr.map(item => item.replace(new RegExp(tmpBaseUrl, 'g'), ''));

                this.$refs.basic_info.validate((valid) => {
                    if (valid) {
                        apiCustomerAdd(this,{
                            params: JSON.stringify({
                                sjhm: this.basic_info.sjhm,
                                khmc: this.basic_info.khmc,
                                lxr: this.basic_info.lxr,
                                jfbs: this.basic_info.jfbs,
                                ygbh: this.basic_info.ygbh,
                                czyg_ygbh: this.basic_info.czyg_ygbh,
                                czhm:this.basic_info.czhm,
                                khkhyh:this.basic_info.khkhyh,
                                khyhhh:this.basic_info.khyhhh,
                                khlybh:this.basic_info.khlybh,
                                khlxbh:this.basic_info.khlxbh,
                                pic:tmpPicsArr,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success(res.message);
                                this.$router.push({
                                    name: 'service-custom-index'
                                });
                            }else{

                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },

    };
</script>