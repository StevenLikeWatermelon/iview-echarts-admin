<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">修改密码</p>
                <Form :label-width="100" :model="formInfo" ref="formInfo" :rules="formRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="邮箱：" style="margin:0;">
                            <span>{{userInfo.user_email}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="员工账号：" style="margin:10px 0;">
                            <span>{{userInfo.user_no}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="姓名：" style="margin:0 0 10px;">
                            <span>{{userInfo.user_name}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="新密码：" style="margin:0 0 20px;" prop="newpwd">
                            <Input type="password" v-model="formInfo.newpwd" style="width:200px;margin:0;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="确认新密码：" style="margin:0 0 20px 0;" prop="pwdagain">
                            <Input type="password" v-model="formInfo.pwdagain" style="width:200px;margin:0;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <Button type="default" style="margin-left:100px;" @click="cancel">取消</Button>
                        <Button type="primary" style="margin-left:20px;" @click="sure">确定</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Modal v-model='comfirmModal' :mask-closable=false :closable="false" :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span style="font-size:10px;width:20px;height:20px;line-height: 20px;"><Icon type="checkmark-round"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 20px;font-size:12px;">密码修改成功，请重新登录！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="primary" @click="changesSure">确定</Button>
            </div>
        </Modal>
        <!--<Row style="margin-top: 68px;"></Row>-->
        <!--<Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">-->
            <!--<Col span="24">-->
            <!--<Card>-->
                <!--<Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>-->
            <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import {EditPasswordApi, apiLoginOut} from '@/config/getData';
    export default {
        data () {
            const validatePwd1 = (rule, value, callback) => {
                let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
                if (!reg.test(value)) {
                    return callback(new Error('密码必须含有数字和字母'));
                } else if (value.length < 8 || value.length > 18) {
                    return callback(new Error('密码长度在8 ~ 18位之间'));
                } else {
                    callback();
                }
            };
            const validatePwd2 = (rule, value, callback) => {
                if (value !== this.formInfo.newpwd) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userInfo: [],
                formInfo: {
                    newpwd: '',
                    pwdagain: ''
                },
                formRules: {
                    newpwd: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        { validator: validatePwd1, trigger: 'blur' }
                    ],
                    pwdagain: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: validatePwd2, trigger: 'blur' }
                    ]
                },
                comfirmModal: false
            };
        },
        methods: {
            backTo () {
                history.go(-1);
            },
            cancel () {
                this.backTo();
            },
            sure () {
                this.$refs.formInfo.validate((valid) => {
                    if (valid) {
                        EditPasswordApi(this, {
                            password: this.formInfo.newpwd
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.comfirmModal = true;
                            } else {
                                this.$Message.error(res.data);
                            }

                        });
                    }
                });
            },
            changesSure () {
                this.comfirmModal = false;
                apiLoginOut(this, {}).then(res => {});
            }
        },
        created () {
            this.userInfo = JSON.parse(Cookies.get('userInfo'));
        }
    };
</script>