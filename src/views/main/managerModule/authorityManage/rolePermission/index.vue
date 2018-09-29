<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="addRole">新增角色</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center">
                    <el-table-column label="角色编号" prop="id" width="80">
                        <template slot-scope="scope">
                            <span @click="handleClick({param: scope.row.id}, 'role-permission-detail')">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.id}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="role_name" label="角色名称" width="150"></el-table-column>
                    <el-table-column prop="module_list" label="权限模块"></el-table-column>
                    <!-- <el-table-column prop="khbh" label="更新人员"></el-table-column>
                    <el-table-column prop="khbh" label="更新时间"></el-table-column> -->
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.id == 99">系统权限</span>
                            <span v-else>
                                <Button type="default" @click="deleteRole(scope.row.id)">删除</Button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>
        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
        <Modal v-model='deleteModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="deleteCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="deleteSure">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiGetManagerRoleList, apiGetManagerRoleDelete } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'role-permission',
        data () {
            return {
                orderData: {
                    data: []
                },
                deleteModal: false,
                loadding: false,
                currentRoleId: '',
                currentPage: 1,
                limit: 10,
                totalnum: 0,
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                apiGetManagerRoleList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            addRole () {
                this.handleClick('', 'role-permission-add');
            },
            deleteRole (id) {
                this.deleteModal = true;
                this.currentRoleId = id;
            },
            deleteCancel () {
                this.deleteModal = false;
            },
            deleteSure () {
                apiGetManagerRoleDelete(this, {
                    role_id: this.currentRoleId
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.deleteModal = false;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
        },
        created () {
            this.getData();
        },
        activated () {
        }
    };
</script>
