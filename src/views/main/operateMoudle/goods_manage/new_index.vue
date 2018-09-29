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
                            <Input v-model="newPaperInfo.djbh" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择新增时间" :value='datetimeArr' style="width: 100%;" @on-change="getTime"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="newPaperInfo.workflow_state" @on-change="search">
                                <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <!-- <Col span="4" offset="18" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col> -->
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="2" style="margin-bottom: 10px;" v-auth="buttonAuth"><Button type="primary" @click="newAdd()">新增</Button></Col>
                <el-table :data="newPaperList" border stripe style="text-align: center" max-height="570">
                    <el-table-column prop="djbh" label="单据编号" min-width="120">
                        <template slot-scope="scope">
                            <span  @click="toDetail(scope.row.djbh)" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="新增时间" min-width="150"></el-table-column>
                    <el-table-column prop="workflow_state" label="单据状态" >
                        <template slot-scope="scope">
                            <span>{{statusObj[scope.row.workflow_state]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djbz" label="单据备注" min-width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import util from '@/libs/util';
    import pagination from '../../../common/pagination.vue';
    import { newNoteList, apiAllStatus } from '@/config/getData';
    export default {
        name: 'operate_goods_add_manage_index',
        data () {
            return {
                buttonAuth: 'add_order_add_button',
                newPaperInfo:{
                    djbh:'',
                    date_from: '',
                    date_to: '',
                    workflow_state: 'all',
                },
                statusObj: {},
                statusArr:[{
                    value: 'all',
                    label: '选择单据状态',
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
                util.openNewPage(this, 'operate_goods_manage_new_detail', {
                    cpxzdNum: numId
                });
                this.$router.push({
                    name: 'operate_goods_manage_new_detail',
                    query: {
                        cpxzdNum: numId
                    }
                });
            },
            newAdd() {
                util.openNewPage(this, 'operate_goods_manage_new_add');
                this.$router.push({
                    name: 'operate_goods_manage_new_add'
                });
            },
            getTime(value) {
                this.newPaperInfo.date_from = value[0];
                this.newPaperInfo.date_to = value[1];
                this.search();
            },
            getStatus() {
                apiAllStatus(this, {
                    type: JSON.stringify(['workflow_state'])
                }).then(res => {
                    let tmpObj = this.statusObj = res.data.workflow_state;
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
                newNoteList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        djbh: this.newPaperInfo.djbh,
                        date_from: this.newPaperInfo.date_from,
                        date_to: this.newPaperInfo.date_to,
                        workflow_state: this.newPaperInfo.workflow_state == 'all' ? '' : this.newPaperInfo.workflow_state
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
                this.newPaperInfo.djbh = '';
                this.newPaperInfo.date_from = '';
                this.newPaperInfo.date_to = '';
                this.newPaperInfo.workflow_state = 'all';
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
