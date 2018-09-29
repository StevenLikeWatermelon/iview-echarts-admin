<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="search_info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <DatePicker type="daterange" placeholder="选择发送时间" :value='search_info.timeRange' @on-change="getCurrentTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.msg_status" @on-change="search">
                                <Option v-for="(item, index) in allMessageStatus" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.msg_type" @on-change="search">
                                <Option v-for="(item, index) in allMessageType" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.title" placeholder="输入关键字进行搜索" @on-enter="search"></Input>
                        </Col>                       
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10  margin-pag-botm">
            <Col span="24">
            <Card>
                <Button type="primary" style="margin-bottom:10px;" @click="markedAsRead">标记为已读</Button>
                <el-table :data="dataList" border stripe style="text-align: center;width:100%" @sort-change="manualSort" @selection-change="handleSelectionChange"  max-height="570">
                    <el-table-column show-overflow-tooltip   type="selection"   width="55"  :selectable="canSelect"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="title" min-width="180">
                        <template slot-scope="scope">
                            <span @click="goToDetail(scope.row.url, scope.row.id)" style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="消息类型" prop="type" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{allMessageTypeObj[scope.row.type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="阅读状态" prop="is_read" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{allMessageStatusObj[scope.row.is_read]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发送时间" prop="create_time" min-width="180" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus, userSystemMessageListApi, userSystemMessageReadApi } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                spinShow: false,
                search_info: {
                    timeRange: [],
                    msg_status: 'all',
                    msg_type: 'all',
                    title: '',
                },
                dataList: [],

                allMessageTypeObj: {},
                allMessageType:[{
                    value: 'all',
                    label: '全部消息类型',
                }],

                allMessageStatusObj: {},
                allMessageStatus:[{
                    value: 'all',
                    label: '全部消息状态',
                }],
                multipleSelection: [],
                orderField: '',
                orderDirection: 'desc',

                limit: 10,
                currentPage: 1,
                totalnum: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            goToDetail(url, id) {
                if (url) {
                    this.doReadAction([id]);
                    let queryArr = url.split(','); 
                    util.openNewPage(this, 'article_detail', {id: queryArr[0],type: queryArr[1]});
                    this.$router.push({
                        name: 'article_detail',
                        query: {id: queryArr[0],type: queryArr[1]}
                    });
                }
            },
            canSelect (row) {
                return row.is_read == 0;
            },
            markedAsRead() {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项！');
                    return;
                }
                let tmpArr = [];
                this.multipleSelection.forEach(item => {
                    tmpArr.push(item.id);
                });
                this.doReadAction(tmpArr);
                
            },
            doReadAction(arr) {
                this.spinShow = true;
                userSystemMessageReadApi(this, {
                    ids: JSON.stringify(arr)
                }).then(res => {
                    if(res && res.status == 1){
                        let currentTimeStamp = new Date().getTime();
                        this.$store.commit('updateMessageAction', currentTimeStamp);
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sys_msg_type', 'sys_msg_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};

                        this.allMessageStatusObj = res.data.sys_msg_status;
                        for (let key in res.data.sys_msg_status) {
                            if (res.data.sys_msg_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sys_msg_status[key]
                                };
                                this.allMessageStatus.push(tmpObj);
                            }
                        }

                        this.allMessageTypeObj = res.data.sys_msg_type;
                        for (let key in res.data.sys_msg_type) {
                            if (res.data.sys_msg_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sys_msg_type[key]
                                };
                                this.allMessageType.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                this.spinShow = true;
                userSystemMessageListApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        starttime: this.search_info.timeRange[0],
                        endtime: this.search_info.timeRange[1],

                        msg_type: this.search_info.msg_type === 'all' ? '' : this.search_info.msg_type,
                        msg_status: this.search_info.msg_status === 'all' ? '' : this.search_info.msg_status,

                        title: this.search_info.title,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },


            search () {
                this.currentPage = 1;
                this.getData();
            },
            getCurrentTime (time) {
                this.search_info.timeRange = time || [];
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
            this.getStatus();
            this.getData();
        }
    };
</script>
