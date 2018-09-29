<style lang="less">
    @import './login.less';
    .error{
        color: #ed3f14
    }
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    <span v-if="isShow">欢迎登录</span>
                    <span v-else>忘记密码</span>
                </p>
                <div class="form-con" v-show="isShow" >
                    <Form>
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入邮箱" :autofocus="true" @on-enter="handleSubmit" @on-blur="emailBlur">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                            <div class="ivu-form-item-error-tip">{{ emailError }}</div>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" @on-enter="handleSubmit" @on-blur="pwdBlur">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                            <div class="ivu-form-item-error-tip">{{ pwdError }}</div>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                        <div style="height:20px;">
                           <span style="color:rgb(45, 140, 240);float: right;margin-top:-10px;cursor: pointer;" @click="forgetPwd">忘记密码？</span>
                        </div>
                    </Form>
                </div>
                <div class="form-con" v-show="!isShow">
                    <Form>
                        <FormItem prop="email">
                            <Input v-model="resetform.email" placeholder="请输入邮箱" :autofocus="true"  @on-enter="resetPassword" @on-blur="newemailBlur">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                            <div class="ivu-form-item-error-tip">{{ newEmailError }}</div>
                        </FormItem>
                        <FormItem>
                            <Button @click="resetPassword" type="primary" long>重置密码</Button>
                        </FormItem>
                        <div style="height:20px;">
                            <span style="color:rgb(45, 140, 240);float: right;margin-top:-10px;cursor: pointer;" @click="backLogin">返回登录</span>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>

import { apiLogin, ResetPasswordApi } from '@/config/getData';
export default {
    data () {
        const validateEmail = (rule, value, callback) => {
            let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!reg.test(value) && value !== '') {
                return callback(new Error('请输入正确的邮箱'));
            } else {
                callback();
            }
        };
        return {
            form: {
                userName: '',
                password: ''
            },
            resetform: {
                email: ''
            },
            emailError: '',
            pwdError: '',
            newEmailError: '',
            displayMsg: false,
            isShow: true
        };
    },
    methods: {
        emailBlur () {
            let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (this.form.userName === '') {
                this.emailError = '邮箱不能为空';
            } else if (!reg.test(this.form.userName)) {
                this.emailError = '请输入正确的邮箱';
            } else {
                this.emailError = '';
            }
        },
        pwdBlur () {
            if (this.form.password === '') {
                this.pwdError = '密码不能为空';
            } else {
                this.pwdError = '';
            }
        },
        handleSubmit () {
            let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (this.form.userName === '') {
                this.emailError = '邮箱不能为空';
            } else if (!reg.test(this.form.userName)) {
                this.emailError = '请输入正确的邮箱';
            } else if (this.form.password === '') {
                this.emailError = '';
                this.pwdError = '密码不能为空';
            } else {
                this.emailError = '';
                this.pwdError = '';
                apiLogin(this, {
                    params: JSON.stringify({
                        username: this.form.userName,
                        password: this.form.password
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        // 首次进行权限菜单过滤相关
                        this.$store.commit('updateMenulist');
                        //跳转到首页
                        this.$router.push({
                            name: 'home_index'
                        });
                    } else {
                        this.$Message.error(res.data);
                    }

                });
            }
        },
        forgetPwd () {
            this.emailError = '';
            this.pwdError = '';
            this.form.userName = '';
            this.form.password = '';
            this.isShow = false;
        },
        backLogin () {
            this.resetform.email = '';
            this.newEmailError = '';
            this.isShow = true;
        },
        newemailBlur () {
            let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (this.resetform.email === '') {
                this.newEmailError = '邮箱不能为空';
            } else if (!reg.test(this.resetform.email)) {
                this.newEmailError = '请输入正确的邮箱';
            } else {
                this.newEmailError = '';
            }
        },
        resetPassword () {
            let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (this.resetform.email === '') {
                this.newEmailError = '邮箱不能为空';
            } else if (!reg.test(this.resetform.email)) {
                this.newEmailError = '请输入正确的邮箱';
            } else {
                this.newEmailError = '';
                ResetPasswordApi(this, {
                    user_email: this.resetform.email
                }).then(res => {
                    if (res && res.status == 1) {
                        this.isShow = true;
                        this.$Notice.open({
                            title: '密码重置成功！',
                            desc: '新密码已经发送到您的邮箱，请至邮箱查看。',
                            duration: 5
                        });
                    } else {
                        this.$Message.error(res.message);
                    }

                });
            }
        }
    },
    mounted () {
        if (this.$route.query && this.$route.query.displayMsg == '1') {
            this.$Message.success('退出成功!');
        }
    }
};
</script>

<style>

</style>
