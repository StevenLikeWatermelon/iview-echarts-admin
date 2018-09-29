<style>
    .pointer-hover:hover{
        color: rgb(45, 140, 240);
        cursor: pointer;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="form.change_no" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.requisition_no" placeholder="输入销售请购单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.change_status"  placeholder="选择单据状态" @on-change="search">
                            <Option v-for="val in changeStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' style="width: 100%;" @on-change="datetime"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.czyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in form.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.xsyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in form.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                    <el-table-column label="请购修改单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.change_no}, 'service-sales-qgxgd-detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.change_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                     <el-table-column prop="change_status" label="单据状态" width="120">
                        <template slot-scope="scope">
                            <span>{{changeStatus[scope.row.change_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requisition_num" label="请购商品总量" width="120"></el-table-column>
                    <el-table-column prop="change_num" label="取消商品总量" width="120"></el-table-column>
                    <el-table-column prop="requisition_no" label="销售请购单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.requisition_no}, 'service-sales-xsqgd-detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.requisition_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,saleManageRequisitionEditList,apiCustomerAllStaff } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'service-sales-qgxgd-index',
        data () {
            return {
                form: {
                    change_no: '',
                    requisition_no: '',
                    datetime: '',
                    change_status: 'all',
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
                orderField: 'djrq',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
//                spinShow: true,
                abolishorder_status: [],
                orderStatusArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                changeStatus: [],
                changeStatusArr: [
                    {
                        value: 'all',
                        label: '选择单据状态'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_change_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        this.changeStatus = res.data.requisition_change_status;
                        for (let key in res.data.requisition_change_status) {
                            if (res.data.requisition_change_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.requisition_change_status[key]
                                };
                                this.changeStatusArr.push(tmpObj);
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
                            this.form.allSales.push(item);
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
                            this.form.appointKf.push(item);
                        });
                    }
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                saleManageRequisitionEditList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        change_no: this.form.change_no,                    //修改单号
                        requisition_no: this.form.requisition_no,                    //请购单号
                        change_status: this.form.change_status == 'all' ? '' : this.form.change_status,  //状态
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        czyg_ygbh: this.form.czyg_ygbh === 'all' ? '' : this.form.czyg_ygbh,
                        xsyg_ygbh: this.form.xsyg_ygbh === 'all' ? '' : this.form.xsyg_ygbh,
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
                this.getData();
            },
            reset () {
                this.form.datetime = '';
                this.form.change_no = '';
                this.form.requisition_no = '';
                this.form.change_status = 'all';
                this.form.xsyg_ygbh = 'all';
                this.form.czyg_ygbh = 'all';
                this.search();
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
        },
        activated() {
            this.getData();
        }
    };
</script>
