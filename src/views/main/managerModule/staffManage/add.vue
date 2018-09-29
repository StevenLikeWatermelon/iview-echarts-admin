<template>
    <div style="position: relative" class="diy-opcity">
        <Form :model="salesForm" :label-width="130" ref="salesForm" :rules="ruleValidate">
            <Row>
                <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            员工信息
                        </p>
                        <Row>
                            <Col span="8">
                            <FormItem label="员工工号：" prop="user_no">
                                <Input v-model="salesForm.user_no" placeholder="请输入员工工号" @on-enter="search"></Input>
                            </FormItem>
                            </Col>

                            <Col span="8">
                            <FormItem label="员工姓名：" prop="user_name">
                                <Input v-model="salesForm.user_name" placeholder="请输入员工姓名" @on-enter="search"></Input>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="手机号：" prop="phone">
                                <Input v-model="salesForm.phone" placeholder="请输入手机号码" @on-enter="search"></Input>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="邮箱：" prop="user_email">
                                <Input v-model="salesForm.user_email" placeholder="请输入邮箱" @on-enter="search"></Input>
                            </FormItem>
                            </Col>

                            <Col span="8">
                            <FormItem label="部门：" prop="depart_id">
                                <Select v-model="salesForm.depart_id" filterable>
                                    <Option v-for="item in departmentsArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="状态：">
                                <Select v-model="salesForm.disabled">
                                    <Option v-for="item in disabledArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="是否部门负责人：">
                                <RadioGroup v-model="salesForm.is_manager">
                                    <Radio label="1">
                                        <span>是</span>
                                    </Radio>
                                    <Radio label="0">
                                        <span>否</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
        <Form  :label-width="180" >
            <Row>
                <Col span="24">
                    <Card>
                        <p slot="title" class="card-title">
                            权限设置
                        </p>
                        <Row>
                            <Col span="24">
                                <FormItem label="账号权限：">
                                    <CheckboxGroup v-model="salesForm.role_ids_dis" @on-change="getCurrentRolesId">
                                        <Checkbox v-for="item in allRolesId" :label="item.id">
                                            <span>{{item.role_name}}</span>
                                        </Checkbox>
                                    </CheckboxGroup>
                                </FormItem>
                            </Col>
                            <Row v-for="item in checkedRolesAuthArr">
                                <Col span="6">
                                    <FormItem :label="item.role_name + '数据权限：'">
                                        <RadioGroup v-model="item.is_mydata_dis">
                                            <Radio label="0">
                                                <span>全部部门</span>
                                            </Radio>
                                            <Radio label="1">
                                                <span>自己</span>
                                            </Radio>
                                            <Radio label="2">
                                                <span>其他部门</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                
                                <Col span="12" v-show="item.is_mydata_dis == 2">
                                    <FormItem label="部门选择：">
                                        <Select v-model="item.specified_depart" filterable multiple>
                                            <Option v-for="item in departmentsArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        <Row>
                            <Col span="24" class="manual-clear">
                                <Card>
                                    <p slot="title" class="card-title">
                                        角色权限明细
                                    </p>
                                    <Row v-if="toggleShow">
                                        <Col span="11" v-for="item in allTreesArr" style="margin-bottom:15px;">
                                            <Card>
                                                <p slot="title" class="card-title">
                                                    {{item.category_name}}
                                                </p>
                                                <Row>
                                                    <Col span="24">
                                                        <Tree :data="item.tree_list"></Tree>
                                                    </Col>
                                                </Row>
                                                
                                            </Card>
                                        </Col>
                                    </Row>
                                    
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:10px;"  @click="addStaffSave">保存</Button>
            </Card>
            </Col>
        </Row>
        
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { systemManageStaffList, systemManageAllDeparts, apiGetManagerRoleList, apiGetManagerRoleCategory, apiGetManagerCurrentModules, apiGetManagerAddStaff } from '@/config/getData';
    import { notempty, closeCurrentPage } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                salesForm: {
                    user_no: '',
                    user_name: '',
                    phone: '',
                    role_ids_dis: [],
                    role_ids: [],
                    user_email: '',
                    is_manager: '0',
                    depart_id: '',
                    disabled: '0',
                },
                checkedRolesAuthArr: [],
                toggleShow: false,

                allRolesId: [],
                disabledArr: [{
                    value: '0',
                    label: '启用'
                },{
                    value: '1',
                    label: '禁用'
                }],
                departmentsArr: [],
                allTreesObj: {},
                ruleValidate: {
                    user_no: [
                        { required: true, message: '员工工号不能为空', trigger: 'blur' }
                    ],
                    user_name: [
                        { required: true, message: '员工姓名不能为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '手机号码格式有误', pattern: /^1\d{10}$/, trigger: 'blur'}
                    ],
                    user_email: [
                        { required: true, message: '员工邮箱不能为空', trigger: 'blur' }
                    ],
                    depart_id: [
                        { required: true, message: '员工部门不能为空', trigger: 'blur' }
                    ],
                    disabled: [
                        { required: true, message: '员工状态不能为空', trigger: 'blur' }
                    ]
                },
                allRolesObj: {}
            };
        },
        components: {
            pagination
        },
        methods: {
            getallRoles() {
                apiGetManagerRoleList(this, {
                    params: JSON.stringify({
                        all: 1
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allRolesId = res.data;
                        res.data.forEach(item => {
                            this.allRolesObj[item.id] = item.role_name;
                        });
                    }
                })
            },
            getAllTrees() {
                this.toggleShow = false;
                apiGetManagerRoleCategory(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.checkExist(item.tree_list);
                        });
                        this.allTreesArr = res.data;
                        this.toggleShow = true;
                    }
                });

            },
            getCurrentRolesId(values) {
                this.changeDisRolesAuth(values);
                this.changeDisplayTree(values);
            },
            changeDisRolesAuth(values) {
                let tmpArr = [];
                values.forEach(item => {
                    tmpArr.push({
                        role_id: item,
                        role_name: this.allRolesObj[item],
                        is_mydata_dis: '1',
                        is_mydata: '1',
                        specified_depart: []
                    });
                });
                tmpArr.forEach((item, index) => {
                    this.checkedRolesAuthArr.forEach(innerItem => {
                        if (innerItem && innerItem.role_id && innerItem.role_id == item.role_id) {
                            tmpArr.splice(index, 1, innerItem);
                        }
                    });
                });
                this.checkedRolesAuthArr = tmpArr;
            },
            changeDisplayTree(values) {
                apiGetManagerCurrentModules(this, {
                    role_ids: JSON.stringify(values)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allTreesObj = {};
                        res.data.forEach(item => {
                            this.allTreesObj[item] = true;
                        });
                        this.getAllTrees();
                    }
                })
            },
            checkExist(arr) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (!this.allTreesObj[arr[i].id]) {
                        arr.splice(i, 1);
                    }
                    if (arr[i] && arr[i].children && arr[i].children.length > 0) {
                        this.checkExist(arr[i].children);
                    }
                }
            },
            getDepartsData () {
                systemManageAllDeparts(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.departmentsArr.push({
                                value: item.id,
                                label: item.depart_name
                            });
                        });
                    }
                });
            },
            addStaffSave() {
                this.$refs['salesForm'].validate((valid) => {
                    if (valid) {
                        //账号权限不能为空
                        if (this.salesForm.role_ids_dis.length <= 0) {
                            this.$Message.error('账号权限不能为空!');
                            return;
                        }
                        
                        let tmpArr = JSON.parse(JSON.stringify(this.checkedRolesAuthArr));
                        
                        for (let i = 0; i < tmpArr.length; i++) {
                            // 其他部门不能为空
                            if (tmpArr[i].is_mydata_dis == '2' && tmpArr[i].specified_depart.length <= 0) {
                                this.$Message.error('第' + (i+1) + '行其他部门不能为空!');
                                return;
                            }
                            if (tmpArr[i].is_mydata_dis == '0') {
                                tmpArr[i].is_mydata = '0';
                                tmpArr[i].specified_depart = 'all';
                            }
                            if (tmpArr[i].is_mydata_dis == '1') {
                                tmpArr[i].is_mydata = '1';
                                tmpArr[i].specified_depart = '';
                            }
                            if (tmpArr[i].is_mydata_dis == '2') {
                                tmpArr[i].is_mydata = '0';
                            }
                            
                        }
                        this.salesForm.role_ids = tmpArr;
                        apiGetManagerAddStaff(this, {
                            params: JSON.stringify(this.salesForm)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功!');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'staff_manage_detail', {
                                    param: this.salesForm.user_no
                                });
                                this.$router.push({
                                    name: 'staff_manage_detail',
                                    query: {
                                        param: this.salesForm.user_no
                                    }
                                });
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getDepartsData();
            this.getallRoles();
            this.getAllTrees();
        }
    };
</script>
