<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.return_no" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.return_apply_no" placeholder="退货申请单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.return_status"  placeholder="选择单据状态" @on-change="search">
                                <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择审核时间" :value='orderInfo.datetime_verify' @on-change="datetime_verify" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.service_man"  placeholder="选择客服" @on-change="search" filterable>
                                <Option v-for="status in service_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.sales_man"  placeholder="选择销售" @on-change="search" filterable>
                                <Option v-for="status in sales_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <!-- <Col span="4" style="text-align: center;margin-bottom:0;">
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
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" @click="toExport" v-auth="XSTHList_export">导出</Button>
                    <a :href="hrefs" id="clickA"  target="_blank" style="display: none"></a>
                </Col>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column show-overflow-tooltip label="销售退货单号">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.return_no, 'service-xsthd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.return_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="申请退货时间"   sortable="custom" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="verify_time" label="审核时间"   sortable="custom" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="return_apply_no" label="退货申请单编号" >
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.return_apply_no, 'service-thsqd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.return_apply_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" width="200"  ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="lxr" label="联系人" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="yhm" label="联系方式" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="must_total" label="应退金额" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.must_total).toFixed(4)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="djzt" label="退货单状态">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.return_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="server_no" label="客服" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.server_no }} / {{ scope.row.server_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="seller_no" label="销售" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.seller_no }} / {{ scope.row.seller_name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiThdList,exportThdList,apiGetAllServiceMan,apiGetAllSalesman } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                XSTHList_export:'XSTHList_export',
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ],
                orderInfo: {
                    return_no: '',
                    customer_name: '',
                    return_apply_no: '',
                    return_status: 'all',
                    datetime: [],
                    datetime_verify: [],
                    service_man: 'all',
                    sales_man: 'all',
                },
                orderData: {
                    title: [],
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                sales_list: [
                    {
                        label: '选择销售',
                        value: 'all'
                    }
                ],
                service_list: [
                    {
                        label: '选择客服',
                        value: 'all'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_return_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_return_status;
                        let tmpObj = {};
                        for (let key in res.data.sell_return_status) {
                            if (res.data.sell_return_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_return_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetAllServiceMan(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.service_list.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetAllSalesman(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.sales_list.push(tmpObj);
                            }
                        }
                    }
                });
            },
            toExport(){
                 exportThdList(this, {
                    params: JSON.stringify(this.notempty({
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        starttime_verify: this.orderInfo.datetime_verify[0],
                        endtime_verify: this.orderInfo.datetime_verify[1],
                        return_no: this.orderInfo.return_no,
                        customer_name: this.orderInfo.customer_name,
                        return_apply_no: this.orderInfo.return_apply_no,
                        return_status: this.orderInfo.return_status === 'all' ? '' : this.orderInfo.return_status,
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                      //成功
                    }
                });
            },
            getData () {
                apiThdList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        starttime_verify: this.orderInfo.datetime_verify[0],
                        endtime_verify: this.orderInfo.datetime_verify[1],
                        return_no: this.orderInfo.return_no,
                        customer_name: this.orderInfo.customer_name,
                        return_apply_no: this.orderInfo.return_apply_no,
                        return_status: this.orderInfo.return_status === 'all' ? '' : this.orderInfo.return_status,
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    return_no: '',
                    customer_name: '',
                    return_apply_no: '',
                    return_status: 'all',
                    datetime: [],
                    datetime_verify: [],
                    service_man: 'all',
                    sales_man: 'all',
                };
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            datetime_verify (time) {
                this.orderInfo.datetime_verify = time;
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
