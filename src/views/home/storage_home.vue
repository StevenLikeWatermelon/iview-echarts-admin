<style>
    .purchase-index .active {
        color: #57a3f3;
        background-color: #fff;
        border-color: #57a3f3;
    }
    .index-show-progress .ivu-modal-footer {
        display: none;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10"  type="flex" justify="space-around">
            <Col span="8">
            <div class="order-div" @click="goToWorkPlat('1')">
                <div style="height:40px; padding-top: 31px;">
                    <p style="font-size: 20px;">我的待办</p>
                    <p style="font-size: 40px;"><span  style="color: #f25e43;font-weight: 700">{{taskObj.to_process_num}}</span>个任务</p>
                </div>
            </div>
            </Col>
            <Col span="8">
                <div class="order-div" @click="goToWorkPlat('2')">
                    <div style="height:40px; padding-top: 31px;">
                        <p style="font-size: 20px;">我发起的</p>
                        <p style="font-size: 40px;"><span  style="color: #f25e43;font-weight: 700">{{taskObj.create_num}}</span>个任务</p>
                    </div>
                </div>
            </Col>
            <Col span="8">
                <div class="order-div" @click="goToWorkPlat('3')">
                    <div style="height:40px; padding-top: 31px;">
                        <p style="font-size: 20px;">我的已办</p>
                        <p style="font-size: 40px;"><span  style="color: #f25e43;font-weight: 700">{{taskObj.processed_num}}</span>个任务</p>
                    </div>
                </div>
            </Col>
        </Row>
        <Row class="margin-top-10 purchase-index">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="navicon-round"></Icon>
                        任务列表
                    </p>
                    <Row>
                        <Col span="24">
                            <Input v-model="serchParams.order_no"  icon="search" placeholder="请输入任务单据编号,按enter搜索" @on-enter="getTaskList()" style="float:right;width:300px;"></Input>
                            <ButtonGroup style="float:right;margin-right:20px;">
                                <Button v-for="(val, key) in statusList" @click="changeParams(key)" :class="{active: key == currentKey}">{{val}}</Button>
                            </ButtonGroup>
                            <div class="clear"></div>
                        </Col>
                    </Row>
                    <Row style="margin-top:15px;">
                        <Col span="24">
                            <el-table :data="taskList" border stripe style="text-align: center" @sort-change="manualSort">
                                <el-table-column show-overflow-tooltip width="130" prop="data_id" label="任务编号" ></el-table-column>
                                <el-table-column show-overflow-tooltip width="130" prop="order_no" label="任务单据编号" >
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_page_config, scope.row.order_no)">{{scope.row.order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip width="130" prop="name" label="任务单据类型" ></el-table-column>
                                <el-table-column show-overflow-tooltip width="130" prop="create_user" label="任务发起人" ></el-table-column>
                                <el-table-column show-overflow-tooltip width="150" prop="create_time" label="单据提交时间"  sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="process_user" label="当前处理人" ></el-table-column>
                                <el-table-column show-overflow-tooltip width="130" prop="status" label="单据状态"  sortable="custom">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getWorkFlow(scope.row.order_no)">{{statusList[scope.row.status]}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10"></pagination>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="showProcess" title="进度查看" width="1500" class="index-show-progress">
            <Row>
                <col span="24">
                    <Steps :current="currentFlow">
                        <Step v-for="item in workFlowArr" :title="item.action" ></Step>
                    </Steps>
                    <div v-for="item in workFlowArr" :style="{width: workFlowWidth + '%'}" class="purchase-flow-div">
                        <p>{{ item.user_name }}</p>
                        <p>{{ item.time }}</p>
                        <p>{{ item.note }}</p>            
                    </div>
                </col>
            </Row>
        </Modal>         
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { purchaseManageHomeTask, purchaseManageHomeTaskList, apiAllStatus, purchaseManageWorkFlow} from '@/config/getData';
    export default {
        data () {
            return {
                taskObj: {
                    create_num: 0,
                    processed_num:0,
                    to_process_num:0
                },
                statusList: {},
                serchParams: {
                    status: '',
                    order_no: ''
                },
                currentKey: 'all',
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                taskList: [],
                workFlowArr: [],
                currentFlow: 0,
                showProcess: false,
                orderField: 'create_time',
                orderDirection: 'desc',
                workFlowWidth: 100
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['workflow_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.statusList = res.data.workflow_status;
                        this.statusList.all = '全部';
                    }
                });
            },
            getWorkFlow(id) {
                purchaseManageWorkFlow(this, {
                    order_no: id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.workFlowArr = res.data.tracks;
                        this.currentFlow = res.data.current_key;
                        this.workFlowWidth = 100 / res.data.tracks.length;
                        this.showProcess = true;
                    }
                });
            },             
            goToDetail(modulename, queryid) {
                let queryParam = {
                    param: queryid
                };
                if (modulename == 'purchase_manage_SP_detail') {
                    queryParam.type = '0';
                }
                if (modulename == 'purchase_manage_TP_detail') {
                    queryParam.type = '1';
                    modulename = 'purchase_manage_SP_detail';
                }
                util.openNewPage(this, modulename, queryParam);
                this.$router.push({
                    name: modulename,
                    query: queryParam
                });
            },        
            getTaskTodo() {
                purchaseManageHomeTask(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.taskObj = res.data;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getTaskList() {
                purchaseManageHomeTaskList(this, {
                    params: JSON.stringify(this.notempty({
                        status: this.serchParams.status,
                        order_no: this.serchParams.order_no,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.taskList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            goToWorkPlat(type) {
                let moduleName = '';
                switch(type) {
                    case '1':
                        moduleName = 'my_work_table_todo';
                        break;
                    case '2':
                        moduleName = 'my_work_table_launch';
                        break;
                    case '3':
                        moduleName = 'my_work_table_done';
                        break;
                }
                util.openNewPage(this, moduleName);
                this.$router.push({
                    name: moduleName
                });

            },
            changeParams(status) {
                this.currentKey = status;
                this.serchParams.status = status == 'all' ? '' : status;
                this.getTaskList();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getTaskList();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getTaskList();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getTaskList();
            }
        },
        created: function () {
            this.getStatus();
            this.getTaskTodo();
            this.getTaskList();
        }
    };
</script>

