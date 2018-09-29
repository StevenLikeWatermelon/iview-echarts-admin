<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="salesForm" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="salesForm.act_name" placeholder="输入活动名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择活动时间" :value='salesForm.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesForm.act_state"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="item in salesForm.serviceArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Row class="margin-bottom-10" v-auth="buttonAuth">
                    <Col span="24">
                    <Button type="primary" @click="handleClick('', 'operate_sales_limit_time_add')">添加限时秒杀</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="活动名称"  min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.id, 'operate_sales_limit_time_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.promote_name}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动时间" prop="start_time" sortable="custom" width="350">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_time}} ~ {{scope.row.end_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="activity_status" label="活动状态" width="150"></el-table-column>
                    <el-table-column prop="status" label="状态" width="150">
                        <template slot-scope="scope">
                            <span>{{actStatusArr[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" width="150">
                        <template slot-scope="scope">
                            <div v-auth="buttonAuth">
                                <span class="span-for-click" v-if="scope.row.operation === '启用'" @click="action('on', scope.row.id)">{{scope.row.operation}}</span>
                                <span class="span-for-click" v-else-if="scope.row.operation === '停用'" @click="action('off', scope.row.id)">{{scope.row.operation}}</span>
                                <span v-else></span>
                                <span class="span-for-click" :style="scope.row.operation !== '' ? 'margin-left:10px' : '' " @click="action('delete', scope.row.id)" v-if="scope.row.operation !== '停用'" >删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em></P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, apiGetSalesLimitTimeList, apiGetSalesLimitDelete, apiGetSalesLimitOperation, apiGetSalesLimitStop } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    export default {
        data () {
            return {
                buttonAuth: 'limit_time_index_all_button',
                salesForm: {
                    act_name: '',
                    act_state: 'all',
                    datetime: '',
                    serviceArr: [{
                        value: 'all',
                        label: '选择状态'
                    }]
                },
                act_id: '',
                actStatusArr: [],
                orderData: {
                    data: []
                },
                orderStatus: '',
                orderStatusArr: [],
//                spinShow: true,
                date_from: '',
                date_to: '',
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: ''
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['activity_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.actStatusArr = res.data.activity_status;
//                        console.log(this.actStatusArr);
                        let tmpObj = {};
                        for (let key in res.data.activity_status) {
                            if (res.data.activity_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.activity_status[key]
                                };
                                this.salesForm.serviceArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetSalesLimitTimeList(this, {
                    params: JSON.stringify(this.notempty({
                        promote_name: this.salesForm.act_name,
                        status: this.salesForm.act_state === 'all' ? '' : this.salesForm.act_state,
                        start_time: this.salesForm.datetime[0],
                        end_time: this.salesForm.datetime[1],
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
//                setStore('tmpSearchObj' + this.$route.name, JSON.stringify(this.salesForm));
                this.getData();
            },
            reset () {
                this.salesForm.act_name = '';
                this.salesForm.act_state = 'all';
                this.salesForm.datetime = [];
                this.search();
            },
            action (name, id) {
                if (name === 'on') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '启用该条活动？';
                    this.publicCancel = 'onCancel';
                    this.publicSure = 'onSure';
                    this.act_id = id;
                } else if (name === 'off') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '停用该条活动？';
                    this.publicCancel = 'offCancel';
                    this.publicSure = 'offSure';
                    this.act_id = id;
                } else if (name === 'delete') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '删除该条活动？';
                    this.publicCancel = 'deleteCancel';
                    this.publicSure = 'deleteSure';
                    this.act_id = id;
                }
            },
            sureAction (name) {
                if (name === 'onCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'onSure') {
                    this.loadding = true;
                    apiGetSalesLimitOperation(this, {
                        params: JSON.stringify(this.notempty({
                            id: this.act_id,
                            type: 'enable'
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            //this.$Message.error(res.message);
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });

                        }
                    });
                } else if (name === 'offCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'offSure') {
                    this.loadding = true;
                    apiGetSalesLimitStop(this, {
                        id: this.act_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            //this.$Message.error(res.message);
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });
                        }
                    });
                } else if (name === 'deleteCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'deleteSure') {
                    this.loadding = true;
                    apiGetSalesLimitDelete(this, {
                       id: this.act_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            //this.$Message.error(res.message);
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });
                        }
                    });
                }
            },
            datetime (time) {
                this.salesForm.datetime = time;
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
                console.log(column);
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
//        activated() {
//            this.getData();
//        }
    };
</script>
