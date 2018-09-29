<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="form.rel_order_no" placeholder="输入采购备货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.order_change_no" placeholder="输入备货修改单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.change_status"  placeholder="请选择状态" @on-change="search">
                                <Option v-for="status in backChangeStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.create_user_no" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10" v-if="is_current">
                    <Col span="24">
                    <Button type="primary" @click="exportList">导出</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="dataList" border style="text-align: center" max-height="570">
                    <el-table-column label="备货修改单编号" prop="order_change_no" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="handleClick({param: scope.row.order_change_no}, 'purchase_manage_BH_edit_detail')" style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_change_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购备货单编号" prop="khbh" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="handleClick({param: scope.row.rel_order_no}, 'purchase_manage_BH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备货数量" prop="requisition_num" min-width="100" show-overflow-tooltip sortable="custom"></el-table-column>
                    <el-table-column label="取消数量" prop="cancel_num" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="备货金额" prop="requisition_amount" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="取消金额" prop="cacncel_amount" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="备注" prop="note" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="状态" prop="change_status" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{ backChangeStatus[scope.row.change_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{ scope.row.create_user_no }}/{{ scope.row.create_user_name }} </span>
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
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, purchangeBackEditListApi } from '@/config/getData';
    import { notempty, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                form: {
                    rel_order_no: '',
                    order_change_no: '',
                    create_user_no: '',
                    change_status: 'all',
                    datetime: [],
                },
                dataList: [],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                backChangeStatus: {},
                backChangeStatusArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ]
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.backChangeStatus = res.data.change_status;
                        for (let key in res.data.change_status) {
                            if (res.data.change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.change_status[key]
                                };
                                this.backChangeStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            /*导出*/
            // exportList () {
            //     purchangeBackEditListApiExport(this, {
            //         params: JSON.stringify(this.notempty({
            //             numPerPage: 999999,
            //             pageNum: 0,
            //             orderField: this.orderField,
            //             orderDirection: this.orderDirection,
            //             order_change_no: this.form.bhd_no,
            //             buy_order_no: this.form.htd_no,
            //             buy_user_no: this.form.buy_user_no === 'all' ? '' : this.form.buy_user_no,
            //             requisition_store_no: this.form.stock === 'all' ? '' : this.form.stock,
            //             change_status: this.form.status === 'all' ? '' : this.form.status,
            //             create_user: this.form.create_user,
            //             start_time: this.form.datetime[0],
            //             end_time: this.form.datetime[1],
            //         }))
            //     })
            // },
            getData () {
                purchangeBackEditListApi(this, {
                    params: JSON.stringify(this.notempty({
                        rel_order_no: this.form.rel_order_no,
                        order_change_no: this.form.order_change_no,
                        create_user_no: this.form.create_user_no,
                        change_status: this.form.change_status === 'all' ? '' : this.form.change_status,
                        start_time: this.form.datetime[0],
                        end_time: this.form.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            datetime (time) {
                this.form.datetime = time;
                this.search();
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
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
    };
</script>
