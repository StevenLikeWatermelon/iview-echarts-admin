<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="salesForm" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="salesForm.province" placeholder="请输入省份" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" v-show="!isEdit" @click="edit">编辑</Button>
                    <Button type="primary" v-show="isEdit" @click="saveEdit">保存</Button>
                    <Button type="primary" v-show="isEdit" @click="cancelEdit">取消</Button>
                    </Col>
                </Row>
                <el-table :data="dataList" border stripe style="text-align: center" @sort-change="manualSort">
                    <el-table-column prop="sfbh" label="省份编号" >
                        <template slot-scope="scope">
                            <span>{{scope.row.sfbh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sfmc" label="省份名称" >
                        <template slot-scope="scope">
                            <span>{{scope.row.sfmc}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="yfje" label="运费金额" >
                        <template slot-scope="scope">
                            <span v-show="!isEdit">{{scope.row.yfje}}</span>
                            <Input v-show="isEdit" type="text" v-model="scope.row.yfje"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="myje" label="包邮金额" >
                        <template slot-scope="scope">
                            <span v-show="!isEdit">{{scope.row.myje}}</span>
                            <Input v-show="isEdit" type="text" v-model="scope.row.myje"></Input>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination> -->
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { operateCarriageManage, operateCarriageManageUpdate } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    export default {
        data () {
            return {
                salesForm: {
                    province: ''
                },
                isEdit: false,
                dataList: []
            };
        },
        components: {
            pagination
        },
        methods: {
            getData () {
                operateCarriageManage(this, {
                    params: JSON.stringify(this.notempty({
                        province: this.salesForm.province
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList = res.data;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            edit() {
                this.isEdit = true;
            },
            saveEdit() {
                operateCarriageManageUpdate(this, {
                    params: JSON.stringify({
                        data: this.dataList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        this.isEdit = false;
                        this.getData();
                    }
                });
            },
            cancelEdit() {
                this.isEdit = false;
                this.getData();
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesForm = {
                    yhm: ''
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
            this.getData();
        }
    };
</script>
