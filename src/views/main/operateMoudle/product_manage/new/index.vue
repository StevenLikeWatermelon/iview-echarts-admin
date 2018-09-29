<style>
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="newPaperInfo" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="newPaperInfo.order_no" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择新增时间" :value='datetimeArr' style="width: 100%;" @on-change="getTime"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="newPaperInfo.status" @on-change="search">
                            <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Col span="2" style="margin-bottom: 10px;"><Button type="primary" @click="newAdd()" v-auth="operateAuth">新增</Button></Col>
                <el-table :data="newPaperList" border stripe style="text-align: center" max-height="570">
                    <el-table-column prop="order_no" label="单据编号" width="150">
                        <template slot-scope="scope">
                            <span  @click="toDetail(scope.row.order_no)" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="新增时间"width="200"></el-table-column>
                    <el-table-column prop="status" label="单据状态" width="120">
                        <template slot-scope="scope">
                            <span>{{statusObj[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="单据备注" min-width="150" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { operateProductAddList, apiAllStatus } from '@/config/getData';
    export default {
        data () {
            return {
                operateAuth: 'operate_add_new_add_button',
                newPaperInfo:{
                    order_no:'',
                    start_time: '',
                    end_time: '',
                    status: 'all',
                },
                statusObj: {},
                statusArr:[{
                    value: 'all',
                    label: '选择状态',
                }],
                allList: [],
                newPaperList: [],
                datetimeArr: [],
                currentPage: 1,
                limit: 10,
                totalnum: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            toDetail(numId) {
                util.openNewPage(this, 'operate_products_new_detail', {
                    order_no: numId
                });
                this.$router.push({
                    name: 'operate_products_new_detail',
                    query: {
                        order_no: numId
                    }
                });
            },
            newAdd() {
                util.openNewPage(this, 'operate_products_new_add');
                this.$router.push({
                    name: 'operate_products_new_add'
                });
            },
            getTime(value) {
                this.newPaperInfo.start_time = value[0];
                this.newPaperInfo.end_time = value[1];
                this.search();
            },
            getStatus() {
                apiAllStatus(this, {
                    type: JSON.stringify(['increased_state'])
                }).then(res => {
                    let tmpObj = this.statusObj = res.data.increased_state;
                    for (let key in tmpObj) {
                        if (tmpObj.hasOwnProperty(key)) {
                            this.statusArr.push({
                                value: key,
                                label: tmpObj[key]
                            });
                        }
                    }
                });
            },
            getData() {
                operateProductAddList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        order_no: this.newPaperInfo.order_no,
                        start_time: this.newPaperInfo.start_time,
                        end_time: this.newPaperInfo.end_time,
                        status: this.newPaperInfo.status == 'all' ? '' : this.newPaperInfo.status
                    })
                }).then(res => {
                    if (res && res.status) {
                        this.newPaperList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error('获取列表失败')
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.newPaperInfo.order_no = '';
                this.newPaperInfo.start_time = '';
                this.newPaperInfo.end_time = '';
                this.newPaperInfo.status = 'all';
                this.datetimeArr = [];
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
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
