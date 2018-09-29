<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="search_info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="search_info.out_order_no" placeholder="请输入销售出库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.brand_no"  placeholder="请选择品牌" filterable @on-change="search">
                                <Option v-for="brand in allBrandList" :value="brand.cpppbh" :key="brand.cpppbh">{{ brand.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.sell_user_no"  placeholder="请选择销售" filterable @on-change="search">
                                <Option value="all">选择销售</Option>
                                <Option v-for="status in allSalesmanList" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="search_info.service_user_no"  placeholder="请选择客服" filterable @on-change="search">
                                <Option value="all">选择客服</Option>
                                <Option v-for="status in allServiceManList" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_order_no" placeholder="请输入产品订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="search_info.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='search_info.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择出库时间" :value='search_info.out_time' @on-change="datetime_out_time" style="width: 100%;"></DatePicker>
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
        <Row class="margin-top-10  margin-pag-botm">
            <Col span="24">
            <Card>
                <Button type="primary" style="margin-bottom:10px;" v-auth="out_bound_cost_export" @click="exportList">导出</Button>
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                    <el-table-column show-overflow-tooltip label="销售出库单编号" min-width="130">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.djbh, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip sortable="custom" prop="djrq" label="创建时间" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip sortable="custom" prop="out_time" label="出库时间" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="out_num" label="出库数量" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_tax_price" label="出库含税单价" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="out_tax_rate" label="出库税率" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="no_tax_price" label="出库未税单价" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_tax_amount" label="出库含税金额" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="no_tax_amount" label="出库未税金额" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="buy_price" label="采购含税单价" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="buy_tax_rate" label="采购税率" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="no_tax_buy_price" label="采购未税单价" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_tax_buy_amount" label="采购含税金额" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="no_tax_buy_amount" label="采购未税金额" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="store_name" label="出库仓库" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="area_name" label="出库库区" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="seat_name" label="出库库位" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="service" label="所属客服" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="service_depart" label="客服部门" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="salesman" label="所属销售" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="salesman_depart" label="销售部门" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip label="销售合同单编号" min-width="130">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.sell_order_no, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="customer" label="客户" min-width="200"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单编号" min-width="130"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="from_order_no" label="来源单据编号" min-width="130"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="supplier" label="供应商" min-width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" min-width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import { apiGetAllServiceMan, apiGetAllSalesman, operateAllBrandsList, apiOutBoundCostList, apiOutBoundCostExport } from '@/config/getData';
    import { notempty, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'out_bound_cost_index',
        data () {
            return {
                out_bound_cost_export:'out_bound_cost_export',
                search_info: {
                    brand_no: 'all',
                    sell_user_no: 'all',
                    service_user_no: 'all',
                    product_order_no: '',
                    product_model: '',
                    product_name: '',
                    out_order_no: '',
                    create_time: '',
                    outtime:'',
                    out_time:[],
                    datetime:[],
                    
                },
                orderData: {
                    data: []
                },
                allBrandList:[{
                    cpppbh: 'all',
                    cpppmc: '选择品牌',
                }],
                allServiceManList:[],
                allSalesmanList:[],
                orderField: 'djrq',
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
            getAllBrand () {
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        if (this.allBrandList.length == 1) {
                            this.allBrandList = this.allBrandList.concat(res.data.list);
                        }
                    }
                });
            },
            getAllServiceMan () {
                apiGetAllServiceMan(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allServiceManList = res.data.list;
                    }
                });
            },
            getAllSalesman () {
                apiGetAllSalesman(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allSalesmanList = res.data.list;
                    }
                });
            },
            getData () {
                apiOutBoundCostList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        create_time: this.search_info.create_time,
                        out_time: this.search_info.outtime,
                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        sell_user_no: this.search_info.sell_user_no === 'all' ? '' : this.search_info.sell_user_no,
                        service_user_no: this.search_info.service_user_no === 'all' ? '' : this.search_info.service_user_no,
                        product_order_no: this.search_info.product_order_no,
                        product_model: this.search_info.product_model,
                        product_name: this.search_info.product_name,
                        out_order_no: this.search_info.out_order_no,
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


            /*导出*/
            exportList () {
                apiOutBoundCostExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        create_time: this.search_info.create_time,
                        out_time: this.search_info.outtime,
                        brand_no: this.search_info.brand_no === 'all' ? '' : this.search_info.brand_no,
                        sell_user_no: this.search_info.sell_user_no === 'all' ? '' : this.search_info.sell_user_no,
                        service_user_no: this.search_info.service_user_no === 'all' ? '' : this.search_info.service_user_no,
                        product_order_no: this.search_info.product_order_no,
                        product_model: this.search_info.product_model,
                        product_name: this.search_info.product_name,
                        out_order_no: this.search_info.out_order_no,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },

            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.search_info = {
                    brand_no: 'all',
                    sell_user_no: 'all',
                    service_user_no: 'all',
                    product_order_no: '',
                    product_model: '',
                    product_name: '',
                    out_order_no: '',
                    create_time: '',
                    outtime:'',
                    out_time:[],
                    datetime:[],
                };
                this.search();
            },
            datetime (time) {
                this.search_info.datetime = time;
                this.search_info.create_time = this.search_info.datetime.join('~');
                this.search();
            },
            datetime_out_time (time) {
                this.search_info.out_time = time;
                this.search_info.outtime = this.search_info.out_time.join('~');
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
            this.getAllBrand();
            this.getAllServiceMan();
            this.getAllSalesman();
        },
        activated() {
            this.getData();
        }
    };
</script>
