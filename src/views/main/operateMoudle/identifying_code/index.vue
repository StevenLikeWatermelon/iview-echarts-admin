<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="salesForm" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="salesForm.yhm" placeholder="输入手机号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesForm.send_status"  @on-change="search">
                            <Option v-for="item in allSendArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesForm.event" @on-change="search">
                            <Option v-for="(item, index) in allEventArr" :value="index" :key="index">{{ item }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesForm.verify_status" @on-change="search">
                            <Option v-for="item in allValidArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择发送时间" :value='salesForm.datetime' @on-change="filterDatetime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <el-table :data="dataList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="yhm" label="手机号码" width="120"></el-table-column>
                    <el-table-column prop="verify_code" label="验证码" width="120"></el-table-column>
                    <el-table-column prop="send_status" label="发送状态" width="120">
                        <template slot-scope="scope">
                            <span>{{actStatusObj[scope.row.send_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="send_back_msg" label="原因" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="send_time" label="发送时间" width="150"></el-table-column>
                    <el-table-column prop="verify_time" label="验证成功时间" width="150"></el-table-column>
                    <el-table-column prop="ip_address" label="IP地址" width="150"></el-table-column>
                    <el-table-column prop="ip_part" label="IP段" width="150"></el-table-column>
                    <el-table-column prop="event" label="事件" min-width="150" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, operateIdentifyingCodeEvent, operateIdentifyingCode } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'identifying_code_index',
        data () {
            return {
                salesForm: {
                    yhm: '',
                    send_status: 'all',
                    event: 0,
                    verify_status: 'all',
                    datetime: '',
                },
                allSendArr: [{
                    value: 'all',
                    label: '选择发送状态'
                }],
                actStatusObj: {},
                allEventArr: ['选择事件'],
                allValidArr: [{
                    value: 'all',
                    label: '选择验证状态'
                },{
                    value: '0',
                    label: '已验证'
                },{
                    value: '1',
                    label: '未验证'
                }],
                dataList: [],
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
            };
        },
        components: {
            pagination
        },
        methods: {
            getSendStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['send_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.actStatusObj = res.data.send_status;
                        let tmpObj = {};
                        for (let key in res.data.send_status) {
                            if (res.data.send_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.send_status[key]
                                };
                                this.allSendArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getEvent () {
                operateIdentifyingCodeEvent(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.allEventArr.push(item);
                        });
                    }
                });
            },
            getData () {
                operateIdentifyingCode(this, {
                    params: JSON.stringify(this.notempty({
                        yhm: this.salesForm.yhm,
                        send_status: this.salesForm.send_status == 'all' ? '' : this.salesForm.send_status,
                        verify_status: this.salesForm.verify_status == 'all' ? '' : this.salesForm.verify_status,
                        event: this.allEventArr[this.salesForm.event] == '选择事件' ? '' : this.allEventArr[this.salesForm.event],
                        date_from: this.salesForm.datetime[0],
                        date_to: this.salesForm.datetime[1],
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesForm = {
                    yhm: '',
                    send_status: 'all',
                    event: 0,
                    verify_status: 'all',
                    datetime: '',
                };
                this.search();
            },
            filterDatetime (time) {
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
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getSendStatus();
            this.getEvent();
            this.getData();
        }
    };
</script>
