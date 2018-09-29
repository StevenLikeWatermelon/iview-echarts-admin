<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row>
                    <Form :label-width="120">
                        <Col span="24">
                        <FormItem label="角色编号：" style="margin:20px 0 0;">
                           {{roles.number}}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="角色名称：" style="margin:20px 0 0;" :class="isDetailLog? 'redRequire' : ''">
                           <Input type="text" v-model="roles.name" style="width:300px;" v-if="isDetailLog"></Input>
                           <span v-if="!isDetailLog">{{roles.name}}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="角色类型：" style="margin:20px 0;" :class="isDetailLog? 'redRequire' : ''">
                           <Select v-model="roles.type" placeholder="请选择" filterable style="width:300px;" v-if="isDetailLog">
                                <Option v-for="item in roleTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <span v-if="!isDetailLog">{{roleType[roles.type]}}</span>
                        </FormItem>
                        </Col>
                    </Form>
                </Row>
                <Row class="margin-bottom-10">
                    <Col span="24" class="margin-top-20 margin-bottom-20">
                        <p style="font-size:18px;">角色权限设置</p>
                    </Col>
                    <Col span="24" v-for="(item, index) in moduleData" :class="index >= 1 ? 'margin-top-20' : ''">
                        <!-- :style=" index % 2 == 0 ? 'padding-right:10px;' : 'padding-left:10px;'" :class="index >= 2 ? 'margin-top-20' : ''" -->
                            <Card>
                                <p slot="title" class="card-title">
                                    {{item.category_name}}模板
                                </p>
                                <div class="line-chart-con">
                                    <Tree :data="item.tree_list" show-checkbox  @on-check-change="nodeChoosed"></Tree>
                                </div>
                            </Card>
                        </Col>
                </Row>
                <Row>
                   <Col span="24" class="margin-top-20 margin-bottom-20">
                       <Button type="default" @click="back" v-if="!isDetailLog">返回</Button>
                       <Button type="default" @click="cancel" v-if="isDetailLog">取消</Button>
                       <Button type="primary" @click="save" class="margin-left-20" v-if="isDetailLog">保存</Button>
                       <Button type="primary" @click="modify" class="margin-left-20" v-if="!isDetailLog">修改</Button>
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
    import { apiGetManagerRoleDetail, apiAllStatus, apiGetManagerRoleCategory, apiGetManagerRoleEdit } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                roles: {
                    number: '',
                    name: '',
                    type: ''
                },
                spinShow: true,
                moduleData: [],
                isDetailLog: false,
                roleId: this.$route.query.param,
                idsArr: [],
                roleType: [],
                tmpArr: [],
                idsArr: [],
                idsChoosed: [],
                moduleDataTmp: [],
                idsTmp: [],
                roleTypeArr: []
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
                        let tmpObj = {};
                        for (let key in res.data.role_type) {
                            if (res.data.role_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: parseInt(key),
                                    label: res.data.role_type[key]
                                };
                                this.roleTypeArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetManagerRoleDetail(this, {
                    role_id: this.roleId
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.roles.number = res.data.id;
                        this.roles.name = res.data.role_name;
                        this.roles.type = res.data.role_type;
                        this.idsArr = res.data.module_ids;
                        this.idsTmp = [];
                        for (let i in this.idsArr) {
                            this.idsTmp.push(this.idsArr[i]);
                        }
                    }
                });
                apiGetManagerRoleCategory(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.tree_list.forEach(inner => {
                                this.getAllParent(inner);
                            })
                        });

                        res.data.forEach(item => {
                            // item.tree_list.forEach(tmp => {
                            //     tmp.checked = false;
                            // });
                            this.getTree(item.tree_list);
                        });
                        this.moduleData = res.data;
                        console.log(this.moduleData);
                        this.spinShow = false;
                    }
                });
            },
            getAllParent(singleTree, parent_id_full) {
                if (parent_id_full) {
                    let arr = parent_id_full.split(',');
                    singleTree.parent_id_all = [...arr, singleTree.parent_id].join(',');
                } else {
                     singleTree.parent_id_all = singleTree.parent_id;
                }
                singleTree.children.forEach(item => {
                    let tmpArr = singleTree.parent_id_all.split(',');
                    item.parent_id_all = [...singleTree.parent_id_all, item.parent_id].join(',');
                    if (item.children && item.children.length > 0) {
                        item.children.forEach(inner => {
                            this.getAllParent(inner, item.parent_id_all);
                        })
                    }
                });
            },
            /*根据接口返回的id，使得对应的module被选中*/
            getTree (node) {
                node.forEach(item => {
                    if (!this.isDetailLog) {
                        for (let i in this.idsArr) {
                            if (item.id == this.idsArr[i] && item.children.length == 0) {
                                item.checked = true;
                                item.disableCheckbox = true;
                                break;
                            } else {
                                item.checked = false;
                                item.disableCheckbox = true;
                            }
                        }
                        this.getTree(item.children);
                    } else {
                        for (let i in this.idsArr) {
                            if (item.id == this.idsArr[i] && item.children.length == 0) {
                                item.checked = true;
                                item.disableCheckbox = false;
                                break;
                            } else {
                                item.checked = false;
                                item.disableCheckbox = false;
                            }
                        }
                        this.getTree(item.children);
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
                            let tmpArr = item.parent_id_all.split(',');
                            tmpArr.forEach(item => {
                                this.idsTmp.push(item); 
                            });
                            break; 
                        }
                    }
                    this.getChecked(item.children);
                });
            },
            nodeChoosed (val) {        
                // console.log(val);
                this.idsTmp = [];
                this.moduleData.forEach(item => {
                    this.getChecked(item.tree_list);
                });
                this.idsTmp = Array.from(new Set(this.idsTmp));
            },
            back () {
                this.handleClick('', 'role_permission');
            },
            cancel () {
                this.isDetailLog = false;
                this.getData();
            },
            save () {
                // 修改保存
                if (!this.roles.name) {
                    this.$Message.error('请输入角色名称！');
                    return;
                } else if (!this.roles.type) {
                    this.$Message.error('请输入角色类型！');
                    return;
                } else {
                    apiGetManagerRoleEdit(this, {
                        role_id: this.roles.number,
                        params: JSON.stringify({
                            role_name: this.roles.name,
                            role_type: this.roles.type,
                            module_ids: this.idsTmp
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.isDetailLog = false;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            modify () {
                this.isDetailLog = true;
                this.moduleData.forEach(item => {
                    this.getTree(item.tree_list);
                });
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
    };
</script>
