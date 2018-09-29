<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="100" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="salesRequisition.djbh" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="salesRequisition.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.cpppbh" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.czyg_ygbh"  placeholder="请选择客服" filterable @on-change="search">
                                    <Option value="all">选择客服</Option>
                                    <Option v-for="status in allServiceManList" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.xsyg_ygbh"  placeholder="请选择销售" filterable @on-change="search">
                                    <Option value="all">选择销售</Option>
                                    <Option v-for="status in allSalesmanList" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.cpxh" placeholder="输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="salesRequisition.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.khzfzt" @on-change="search">
                                    <Option v-for="item in payStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.xshtdzt" @on-change="search">
                                    <Option v-for="item in orderStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="salesRequisition.datetime" placeholder="选择创建时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
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
                    <Button type="primary" @click="toExport" v-auth="HTMXList_export">导出</Button>
                    </Col>
                </Row>    
                    <el-table :data="returnList" border stripe style="text-align: center;width: 100%" @sort-change="manualSort" max-height="570">
                        <el-table-column label="销售合同单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.djbh)">{{scope.row.djbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="khmc" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="service_man" label="客服" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="salesman" label="销售员" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="djrq" label="创建时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌"   width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" sortable="custom"  width="130" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom"  width="130" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom"  width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="jldw" label="计量单位"   width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmj" label="产品面价"  width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cert_price" label="认证单价"  width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htzk" label="合同折扣"  width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htdj" label="合同单价"  width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量"  width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column  show-overflow-tooltip prop="stock_num_now_lock" label="现货锁库数量"  sortable="custom" width="120"></el-table-column>
                        <el-table-column  show-overflow-tooltip prop="stock_num_on_lock" label="在途锁库数量"  sortable="custom" width="120"></el-table-column>
                        <el-table-column  show-overflow-tooltip prop="req_num" label="已请购数量"  sortable="custom" width="120"></el-table-column>
                        <el-table-column  show-overflow-tooltip prop="out_num" label="已出库数量"  sortable="custom" width="120"></el-table-column>
                        <el-table-column  show-overflow-tooltip label="支付状态" sortable="custom" prop="khzfzt"  width="100">
                            <template slot-scope="scope">
                                <span>{{payStatusObj[scope.row.khzfzt]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  show-overflow-tooltip label="订单状态" sortable="custom" prop="xshtdzt"  width="100">
                            <template slot-scope="scope">
                                <span>{{orderStatusObj[scope.row.xshtdzt] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiGetAllServiceMan, apiGetAllSalesman, apiAllStatus, apiAllBrands, allContractList,exportContractList} from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                HTMXList_export:'HTMXList_export',
                salesRequisition: {
                    djbh: '',
                    cpppbh: 'all',
                    cpmc: '',
                    cpxh: '',
                    cpdhh: '',
                    khzfzt: 'all',
                    xshtdzt: 'all',
                    xsyg_ygbh: 'all',
                    czyg_ygbh: 'all',
                    datetime: []
                },
                returnList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'djrq',
                orderDirection: 'desc',
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                allServiceManList:[],
                allSalesmanList:[],
                payStatusObj: {},
                payStatus: [
                    {
                        label: '选择支付状态',
                        value: 'all'
                    }
                ],
                orderStatusObj: {},
                orderStatus: [
                    {
                        label: '选择订单状态',
                        value: 'all'
                    }
                ]
            };
        },
        methods: {
            goToHTD (id) {
                util.openNewPage(this, 'service-sales-htd-detail', {
                    param: id
                });
                this.$router.push({
                    name: 'service-sales-htd-detail',
                    query: {
                        param: id
                    }
                });
            },            
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.payStatusObj = res.data.khzfzt;
                        this.orderStatusObj = res.data.xshtdzt;
                        let tmpObj = {};
                        for (let key in res.data.khzfzt) {
                            if (res.data.khzfzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khzfzt[key]
                                };
                                this.payStatus.push(tmpObj);
                            }
                        }
                        for (let key in res.data.xshtdzt) {
                            if (res.data.xshtdzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xshtdzt[key]
                                };
                                this.orderStatus.push(tmpObj);
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
            toExport(){
                exportContractList(this, {
                    params: JSON.stringify(this.notempty({
                        djbh: this.salesRequisition.djbh,
                        khmc: this.salesRequisition.khmc,
                        cpppbh: this.salesRequisition.cpppbh === 'all' ? '' : this.salesRequisition.cpppbh,
                        xsyg_ygbh: this.salesRequisition.xsyg_ygbh === 'all' ? '' : this.salesRequisition.xsyg_ygbh,
                        czyg_ygbh: this.salesRequisition.czyg_ygbh === 'all' ? '' : this.salesRequisition.czyg_ygbh,
                        cpmc: this.salesRequisition.cpmc,
                        cpxh: this.salesRequisition.cpxh,
                        cpdhh: this.salesRequisition.cpdhh,
                        khzfzt: this.salesRequisition.khzfzt === 'all' ? '' : this.salesRequisition.khzfzt,
                        xshtdzt: this.salesRequisition.xshtdzt === 'all' ? '' : this.salesRequisition.xshtdzt,
                        date_from: this.salesRequisition.datetime[0],
                        date_to: this.salesRequisition.datetime[1]
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },                   
            getData () {
                allContractList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.salesRequisition.djbh,
                        khmc: this.salesRequisition.khmc,
                        cpppbh: this.salesRequisition.cpppbh === 'all' ? '' : this.salesRequisition.cpppbh,
                        xsyg_ygbh: this.salesRequisition.xsyg_ygbh === 'all' ? '' : this.salesRequisition.xsyg_ygbh,
                        czyg_ygbh: this.salesRequisition.czyg_ygbh === 'all' ? '' : this.salesRequisition.czyg_ygbh,
                        cpmc: this.salesRequisition.cpmc,
                        cpxh: this.salesRequisition.cpxh,
                        cpdhh: this.salesRequisition.cpdhh,
                        khzfzt: this.salesRequisition.khzfzt === 'all' ? '' : this.salesRequisition.khzfzt,
                        xshtdzt: this.salesRequisition.xshtdzt === 'all' ? '' : this.salesRequisition.xshtdzt,
                        date_from: this.salesRequisition.datetime[0],
                        date_to: this.salesRequisition.datetime[1]
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
                this.salesRequisition = {
                    djbh: '',
                    khmc: '',
                    cpppbh: 'all',
                    xsyg_ygbh: 'all',
                    czyg_ygbh: 'all',
                    cpmc: '',
                    cpxh: '',
                    cpdhh: '',
                    khzfzt: 'all',
                    xshtdzt: 'all',
                    datetime: []
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
                if (column.prop == 'stock_num_now_lock' || column.prop == 'stock_num_on_lock' || column.prop == 'req_num' || column.prop == 'out_num') {
                    let isDec = column.order == "descending" ? true : false;
                    this.returnList.sort(sortBy(column.prop, isDec));
                } else {
                    this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                    this.orderField = column.prop;
                    this.currentPage = 1;
                    this.getData();
                }
            },
            changeDate (time) {
                this.salesRequisition.datetime = time;
                this.search();
            }           
        },
        created () {
            this.getStatus();
            this.getData();
            this.getAllBrands();
            this.getAllServiceMan();
            this.getAllSalesman();
        },
    };
</script>