<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="salesForm" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="salesForm.user_no" placeholder="输入员工账号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="salesForm.user_name" placeholder="输入员工姓名" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="salesForm.phone" placeholder="输入手机号码" @on-enter="search"></Input>
                        </Col>

                        <Col span="4">
                        <Select v-model="salesForm.depart_id" filterable @on-change="search">
                            <Option v-for="item in departmentsArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesForm.disabled" @on-change="search">
                            <Option v-for="item in disabledArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="goToRouter('staff_manage_add')">新增员工</Button>
                    </Col>
                </Row>
                <el-table :data="dataList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="user_no" label="员工账号" width="120">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="goToRouter('staff_manage_detail', scope.row.user_no)">{{scope.row.user_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="user_name" label="员工姓名" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="手机号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="user_email" label="邮箱" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="depart_name" label="所属部门" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="roles" label="角色" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="disabled" label="状态" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.disabled == 0 ? '启用' : '禁用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="myje" label="操作" width="200">
                        <template slot-scope="scope">
                            <Button  @click="toggleActive(scope.row.user_no, 1)" type="warning" size="small" v-show='scope.row.disabled == 0'>禁用</Button>
                            <Button  @click="toggleActive(scope.row.user_no, 0)" type="success" size="small" v-show='scope.row.disabled == 1'>启用</Button>
                            <Button  @click="showDeleteModal(scope.row.user_no)" type="error" size="small">删除</Button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Modal  v-model="showDelete"  title="确认删除" @on-ok="staffDelete">
            <p>确认删除?</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { systemManageStaffList, systemManageAllDeparts, systemManageStaffActive, systemManageStaffDelete } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                showDelete: false,
                currentRoleId: 0,
                salesForm: {
                    user_no: '',
                    user_name: '',
                    phone: '',
                    depart_id: 'all',
                    disabled: 'all',
                },
                disabledArr: [{
                    value: 'all',
                    label: '选择状态'
                },{
                    value: '0',
                    label: '启用'
                },{
                    value: '1',
                    label: '禁用'
                }],
                departmentsArr: [{
                    value: 'all',
                    label: '选择部门'
                }],
                dataList: [],
                currentPage: 1,
                limit: 10,
                orderField: '',
                totalnum: 0,
                orderDirection: 'desc',
            };
        },
        components: {
            pagination
        },
        methods: {
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
            getData () {
                systemManageStaffList(this, {
                    params: JSON.stringify(this.notempty({
                        user_no: this.salesForm.user_no,
                        user_name: this.salesForm.user_name,
                        phone: this.salesForm.phone,
                        depart_id: this.salesForm.depart_id == 'all' ? '' : this.salesForm.depart_id,
                        disabled: this.salesForm.disabled == 'all' ? '' : this.salesForm.disabled,
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            toggleActive (user_no, disabled) {
                systemManageStaffActive(this, {
                    user_no,
                    disabled
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpSpan = disabled == 1 ? '禁用' : '启用';
                        this.$Message.success(tmpSpan + '成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            showDeleteModal(user_no) {
                this.currentRoleId = user_no;
                this.showDelete = true;
            },
            staffDelete (user_no) {
                systemManageStaffDelete(this, {
                    user_no: this.currentRoleId,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            goToRouter(path, id) {
                util.openNewPage(this, path, {
                    param: id
                });
                this.$router.push({
                    name: path,
                    query: {
                        param: id
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesForm ={
                    user_no: '',
                    user_name: '',
                    phone: '',
                    depart_id: 'all',
                    disabled: 'all',
                };
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getDepartsData();
            this.getData();
        }
    };
</script>
