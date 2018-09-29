<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">个人信息</p>
                <Form :label-width="100">
                    <Row>
                        <Col span="24">
                        <FormItem label="员工账号：" style="margin:0;">
                            <span>{{userInfo.user_no}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="姓名：" style="margin:0;">
                            <span>{{userInfo.user_name}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="手机号：" style="margin:0;">
                            <span>{{userInfo.phone}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="邮箱：" style="margin:0;">
                            <span>{{userInfo.user_email}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="部门：" style="margin:0;">
                            <span>{{depart.depart_name}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="角色：" style="margin:0;">
                            <span>{{rolesStr}}</span>
                        </FormItem>
                        </Col>
                        <!--<Col span="24">-->
                        <!--<FormItem label="职位：" style="margin:0;">-->
                            <!--<span>13131</span>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
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
    export default {
        data () {
            return {
                userInfo: [],
                depart: [],
                roles: [],
                allRoles: [],
                rolesStr: '',
                rolesTmp: []
            };
        },
        methods: {
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.userInfo = JSON.parse(Cookies.get('userInfo'));
            this.depart = JSON.parse(Cookies.get('depart'));
            this.roles = JSON.parse(Cookies.get('current_role'));
            this.allRoles = JSON.parse(Cookies.get('roles'));
            for (let i in this.allRoles) {
                this.rolesTmp.push(this.allRoles[i].role_name);
            }
            for (let i in this.rolesTmp) {
                if (i < this.rolesTmp.length-1) {
                    this.rolesStr = this.rolesStr + this.rolesTmp[i] + '， ';
                } else {
                    this.rolesStr = this.rolesStr + this.rolesTmp[i];
                }
            }
        }
    };
</script>