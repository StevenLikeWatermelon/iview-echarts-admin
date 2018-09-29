<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.order_change_no" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer_name" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.rel_order_no" placeholder="输入退货申请单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.sell_order_no" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.change_status"  placeholder="选择单据状态" @on-change="search">
                            <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.czyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.xsyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="合同修改单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.order_change_no, 'service-htxgd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_change_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="申请退货时间"   sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="rel_order_no" label="退货申请单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.rel_order_no, 'service-thsqd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sell_order_no" label="销售合同单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.sell_order_no, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_name" label="客户名称"  min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" ></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  min-width="100"></el-table-column>   
                    <el-table-column prop="change_status" label="单据状态">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.change_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiHtxgdList,apiCustomerAllStaff } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util'

    export default {
        name: 'purchase_manage_htxgd',
        data () {
            return {
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ],
                orderInfo: {
                    order_change_no: '',
                    sell_order_no: '',
                    customer_name: '',
                    rel_order_no: '',
                    change_status: 'all',
                    datetime: [],
                    appointKf:[{
                        value: 'all',
                        label: '选择客服'
                    }],
                    allSales:[{
                        value: 'all',
                        label: '选择销售'
                    }],
                    czyg_ygbh:'all',
                    xsyg_ygbh:'all',
                },
                orderData: {
                    title: [],
                    data: []
                },
                orderField: 'create_time',
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
                    type: JSON.stringify(['change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.change_status;
                        let tmpObj = {};
                        for (let key in res.data.change_status) {
                            if (res.data.change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.change_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                    }
                });

                 //所有销售
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.all_Sales = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ygbh;
                            item.label = item.ygxm;
                            this.orderInfo.allSales.push(item);
                        });
                    }
                });

                //指定客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.czyg_ygbh;
                            item.label = item.czyg;
                            this.orderInfo.appointKf.push(item);
                        });
                    }
                });
            },
            getData () {
                apiHtxgdList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        start_time: this.orderInfo.datetime[0],
                        end_time: this.orderInfo.datetime[1],
                        order_change_no: this.orderInfo.order_change_no,
                        sell_order_no: this.orderInfo.sell_order_no,
                        customer_name: this.orderInfo.customer_name,
                        rel_order_no: this.orderInfo.rel_order_no,
                        change_status: this.orderInfo.change_status === 'all' ? '' : this.orderInfo.change_status,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
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
                    order_change_no: '',
                    sell_order_no: '',
                    customer_name: '',
                    rel_order_no: '',
                    change_status: 'all',
                    datetime: [],
                    xsyg_ygbh: 'all',
                    czyg_ygbh: 'all'
                };
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
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
        },
        activated() {
            this.getData();
        }
    };
</script>
