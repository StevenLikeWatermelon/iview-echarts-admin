<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="form.return_no" placeholder="请输入销售退货单号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.return_apply_no" placeholder="请输入退货申请单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.brand_no" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.return_status" @on-change="search">
                                    <Option v-for="item in returnStatusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="form.datetime" placeholder="请选择申请退货时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="form.datetime_verify" placeholder="请选择审核时间" @on-change="changeDate_verify" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                            <Select v-model="form.service_man"  placeholder="选择客服" @on-change="search" filterable>
                                <Option v-for="status in service_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Select v-model="form.sales_man"  placeholder="选择销售" @on-change="search" filterable>
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
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="THDMXList_export">导出</Button>
                    </Col>
                </Row>    
                    <el-table :data="returnList" border stripe style="text-align: center;width: 100%" @sort-change="manualSort" max-height="570">
                        <el-table-column show-overflow-tooltip label="销售退货单编号" width="120" >
                             <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.return_no,'service-xsthd-detail')">{{scope.row.return_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="create_time" label="申请退货时间" sortable="custom" width="180"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="verify_time" label="审核时间" sortable="custom" width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" sortable="custom" width="200"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="order_num" label="合同数量" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_num" label="本次退货数量" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_price" label="退货单价" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_amount" label="退货金额" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="customer_name" label="客户名称" width="200"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="lxr" label="联系人"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="sjhm" label="联系方式"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_apply_no" label="退货申请单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.return_apply_no,'service-thsqd-detail')">{{scope.row.return_apply_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="sell_order_no" label="销售合同单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.sell_order_no,'service-sales-htd-detail')">{{scope.row.sell_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="状态" sortable="custom" prop="return_status">
                            <template slot-scope="scope">
                                <span>{{returnStatus[scope.row.return_status] }}</span>
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
            </col>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus, apiAllBrands, apiXsthdMxList,exportThdMxList,apiGetAllServiceMan,apiGetAllSalesman} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                THDMXList_export:'THDMXList_export',
                form: {
                    return_no: '',
                    customer_name:'',
                    return_apply_no:'',
                    product_order_no: '',
                    product_model: '',
                    product_name: '',
                    brand_no: 'all',
                    return_status: 'all',
                    datetime: [],
                    datetime_verify:[],
                    service_man: 'all',
                    sales_man: 'all',
                },
                returnList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'djrq',
                orderDirection: 'desc',
                returnStatus:[],
                returnStatusArr: [
                    {
                        label: '选择订单状态',
                        value: 'all'
                    }
                ],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
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
        methods: {
            goToDetail (id,path) {
                util.openNewPage(this, path, {
                    param: id
                });
                this.$router.push({
                    name: path,
                    query: {
                        param: id
                    }
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
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.brand_noAllSelect.push({
                                value: item.cpppbh,
                                label: item.cpppmc
                            });
                        });
                    }
                });
            },  
            toExport(){
                exportThdMxList(this, {
                    params: JSON.stringify(this.notempty({
                        return_no: this.form.return_no,
                        customer_name:this.form.customer_name,
                        return_apply_no:this.form.return_apply_no,
                        product_order_no: this.form.product_order_no,
                        product_model: this.form.product_model,
                        product_name: this.form.product_name,
                        brand_no: this.form.brand_no === 'all' ? '' : this.form.brand_no,
                        return_status: this.form.return_status === 'all' ? '' : this.form.return_status,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        starttime_verify: this.form.datetime_verify[0],
                        endtime_verify: this.form.datetime_verify[1],
                        service_man: this.form.service_man === 'all' ? '' : this.form.service_man,
                        sales_man: this.form.sales_man === 'all' ? '' : this.form.sales_man,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },                   
            getData () {
                apiXsthdMxList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                         return_no: this.form.return_no,
                        customer_name:this.form.customer_name,
                        return_apply_no:this.form.return_apply_no,
                        product_order_no: this.form.product_order_no,
                        product_model: this.form.product_model,
                        product_name: this.form.product_name,
                        brand_no: this.form.brand_no === 'all' ? '' : this.form.brand_no,
                        return_status: this.form.return_status === 'all' ? '' : this.form.return_status,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        starttime_verify: this.form.datetime_verify[0],
                        endtime_verify: this.form.datetime_verify[1],
                        service_man: this.form.service_man === 'all' ? '' : this.form.service_man,
                        sales_man: this.form.sales_man === 'all' ? '' : this.form.sales_man,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.returnList = res.data.list;
                    }
                });
            },           
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form = {
                    return_no: '',
                    customer_name:'',
                    return_apply_no:'',
                    product_order_no: '',
                    product_model: '',
                    product_name: '',
                    brand_no: 'all',
                    return_status: 'all',
                    datetime: [],
                    datetime_verify: [],
                    service_man: 'all',
                    sales_man: 'all',
                };
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
            changeDate (time) {
                this.form.datetime = time;
                this.search();
            },
            changeDate_verify (time) {
                this.form.datetime_verify = time;
                this.search();
            }        
        },
        created () {
            this.getStatus();
            this.getData();
            this.getAllBrands();
        },
    };
</script>