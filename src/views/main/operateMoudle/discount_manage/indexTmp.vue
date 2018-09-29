<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="salesForm.discount_no" placeholder="输入活动编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="salesForm.discount_name" placeholder="输入活动名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="salesForm.discount_status"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="(item, index) in orderStatusArr" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择活动时间" :value='salesForm.activityTime' @on-change="getActivityTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='salesForm.createdTime' @on-change="getCreateTime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10"  v-auth="addButtonAuth">
                    <Col span="24">
                        <Button type="primary" @click="add">新增</Button>
                    </Col>
                </Row>
                <el-table :data="dataList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="活动编号"  prop="discount_no"  width="150" show-overflow-tooltip sortable="custom">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="goToDetail(scope.row.discount_no)">{{scope.row.discount_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="discount_name" label="活动名称" min-width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="discount_status" label="活动状态" width="100" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{orderStatusObj[scope.row.discount_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动时间" prop="start_time" width="300">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_time}} ~ {{scope.row.end_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" min-width="100" sortable="custom"></el-table-column>
                    <el-table-column prop="create_user_no" label="创建人"  min-width="90" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}}/{{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util';
    import {operateDiscountListApi } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    export default {
        data () {
            return {
                salesForm: {
                    discount_no: '',
                    discount_status: 'all',
                    discount_name: '',
                    activityTime: [],
                    createdTime: [],
                }, 
                dataList: [],

                orderStatusObj: {
                    '0': '停用',
                    '1': '启用',
                },
                orderStatusArr: [{
                    value: 'all',
                    label: '全部'
                },{
                    value: '0',
                    label: '停用'
                },{
                    value: '1',
                    label: '启用'
                }],

                currentPage: 1,
                limit: 10,
                orderField: '',
                totalnum: 0,
                orderDirection: 'desc',
            };
        },
        props: ['type', 'addMoudle', 'detailMoudle', 'addButtonAuth'],
        components: {
            pagination
        },
        methods: {
            add () {
                util.openNewPage(this, this.addMoudle, {
                    type: this.type
                });
                this.$router.push({
                    name: this.addMoudle,
                    query: {
                        type: this.type
                    }
                });
            },
            goToDetail(param) {
                util.openNewPage(this, this.detailMoudle, {
                    param,
                    type: this.type
                });
                this.$router.push({
                    name: this.detailMoudle,
                    query: {
                        param,
                        type: this.type
                    }
                });
            },
            getData () {
                operateDiscountListApi(this, {
                    params: JSON.stringify(this.notempty({
                        discount_no: this.salesForm.discount_no,
                        discount_name: this.salesForm.discount_name,
                        discount_status: this.salesForm.discount_status === 'all' ? '' : this.salesForm.discount_status,

                        discount_starttime: this.salesForm.activityTime[0],
                        discount_endtime: this.salesForm.activityTime[1],
                        start_time: this.salesForm.createdTime[0],
                        end_time: this.salesForm.createdTime[1],

                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })),
                    type: this.type,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList= res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getActivityTime(value) {
                this.salesForm.activityTime = value;
                this.search();
            },
            getCreateTime(value) {
                this.salesForm.createdTime = value;
                this.search();
            },
            search () {
                this.currentPage = 1;
                this.getData();
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
