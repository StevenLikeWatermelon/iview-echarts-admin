<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Form :label-width="120":model="roles">
                        <Col span="24">
                        <FormItem label="角色名称：" style="margin:20px 0 0;" prop="name" class="redRequire">
                           <Input type="text" v-model="roles.name" style="width:300px;"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="角色类型：" style="margin:20px 0;" prop="type" class="redRequire">
                           <Select v-model="roles.type" placeholder="请选择" filterable style="width:300px;">
                                <Option v-for="(item, index) in roleType" :value="index" :key="index">{{ item }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Form>
                </Row>
                <Row class="margin-bottom-10">
                    <Col span="24" class="margin-top-20 margin-bottom-20">
                        <p style="font-size:18px;">角色权限设置</p>
                    </Col>
                    <Col span="24" v-for="(item, index) in moduleData" :class="index >= 1 ? 'margin-top-20' : ''">
                        <Card>
                            <p slot="title" class="card-title">
                                {{item.category_name}}模板
                            </p>
                            <div class="line-chart-con">
                                <Tree :data="item.tree_list" show-checkbox @on-check-change="nodeChoosed"></Tree>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                   <Col span="24" class="margin-top-20 margin-bottom-20">
                       <Button type="default" @click="cancel">取消</Button>
                       <Button type="primary" @click="save" class="margin-left-20">保存</Button>
                   </Col> 
                </Row>   
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiGetManagerRoleAdd, apiAllStatus, apiGetManagerRoleCategory } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                roles: {
                    name: '',
                    type: ''
                },
                spinShow: false,
                moduleData: [],
                roleType: [],
                idsChoosed: [],
                idsTmp: [],
                finalArr: []
            };
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['role_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.roleType = res.data.role_type;
                    }
                });
            },
            getData () {
                apiGetManagerRoleCategory(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.moduleData = res.data;
                        this.spinShow = false;
                    }
                });
            },
            /*找出选中的所有id*/
            getChecked (node) {
                node.forEach(item => {
                    if (item.checked === true) {
                        this.idsTmp.push(item.id);
                    }
                    for (let j in this.idsTmp) {
                        if (item.id == this.idsTmp[j]) {
                            this.idsTmp.push(item.parent_id); 
                            break; 
                        }
                    }
                    this.getChecked(item.children);
                });
            },
            nodeChoosed (val) {
                this.idsTmp = [];
                this.moduleData.forEach(item => {
                    this.getChecked(item.tree_list);
                });
                this.idsTmp = Array.from(new Set(this.idsTmp));
            },
            cancel () {
                this.handleClick('', 'role_permission');
            },
            save () {
                if (!this.roles.name) {
                    this.$Message.error('请输入角色名称！');
                    return;
                } else if (!this.roles.type) {
                    this.$Message.error('请输入角色类型！');
                    return;
                } else {
                    apiGetManagerRoleAdd(this, {
                        params: JSON.stringify({
                            role_name: this.roles.name,
                            role_type: this.roles.type,
                            module_ids: this.idsTmp
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.handleClick('', 'role_permission');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }   
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
