<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="myLaunchTask" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="myLaunchTask.order_no" placeholder="请输入任务单据编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="myLaunchTask.task_order_type" placeholder="请选择"  @on-change="search">
                                    <Option v-for="status in taskTypes" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="myLaunchTask.status" placeholder="请选择" @on-change="search">
                                    <Option v-for="status in taskStatus" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="myLaunchTask.datetime" placeholder="请选择" @on-change="datetime" style="width:100%;"></DatePicker>
                            </Col>
                            <!-- <Col span="4" style="text-align: center;margin-bottom:0;">
                            <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                            <Button type="default" @click="reset">重置</Button>
                            </Col> -->
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10  margin-pag-botm">
            <col span="24">
            <Card>
                <el-table :data="taskList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip prop="data_id" label="任务编号" width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_no" label="任务单据编号"  width="150">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_page_config, scope.row.order_no)">{{scope.row.order_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" label="任务单据类型"   width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_user" label="任务发起人"   width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="单据提交时间"  width="180" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="process_user" label="当前处理人" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="status" label="单据状态" sortable="custom"  width="120">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getWorkFlow(scope.row.order_no)">{{taskStatusObj[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10"  class="pagination-style"></pagination>
            </Card>
            </col>
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
    import pagination from '../../../common/pagination.vue';
    import util from '@/libs/util';
    import { myLaunchTaskApi, apiAllStatus, myAllTaskTypes, purchaseManageWorkFlow} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                myLaunchTask: {
                    order_no: '',
                    task_order_type: 'all',
                    status: 'all',
                    datetime: []
                },
                taskList: [],
                showProcess: false,
                currentFlow: 0,
                workFlowArr: [],
                workFlowWidth: 100,                
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'create_time',
                orderDirection: 'desc',
                taskStatus: [{
                    value: 'all',
                    label: '选择单据状态'
                }],
                taskStatusObj: {},
                taskTypes: [{
                    value: 'all',
                    label: '选择任务单据类型'
                }]
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['workflow_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.taskStatusObj = res.data.workflow_status;
                        for(let prop in res.data.workflow_status) {
                            this.taskStatus.push({
                                value: prop,
                                label: res.data.workflow_status[prop]
                            })
                        }
                        this.getTypes();
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
            getTypes () {
                myAllTaskTypes(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.taskTypes.push({
                                label: item.name,
                                value: item.type
                            });
                        });
                    }
                    this.getData();
                });
            },
            getData () {
                myLaunchTaskApi(this, {
                    params: JSON.stringify(this.notempty({
                        order_no: this.myLaunchTask.order_no,
                        status: this.myLaunchTask.status == 'all' ? '' : this.myLaunchTask.status,
                        task_order_type: this.myLaunchTask.task_order_type == 'all' ? '' : this.myLaunchTask.task_order_type,
                        date_from: this.myLaunchTask.datetime[0],
                        date_to: this.myLaunchTask.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.taskList = res.data.list;
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
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.myLaunchTask.order_no = '';
                this.myLaunchTask.task_order_type = 'all';
                this.myLaunchTask.status = 'all';
                this.myLaunchTask.datetime = [];
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
            },
            datetime (time) {
                this.myLaunchTask.datetime = time;
                this.search();
            }
        },
        created () {
            this.getStatus();
        }
    };
</script>