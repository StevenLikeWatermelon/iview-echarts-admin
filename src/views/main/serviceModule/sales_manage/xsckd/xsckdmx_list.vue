<style>
    
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="form.djbh" placeholder="输入销售出库单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="form.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="form.xshtd_djbh" placeholder="输入销售合同单号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.cpxh" placeholder="输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.hydh" placeholder="输入快递单号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.cpppbh" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.status" @on-change="search">
                                    <Option v-for="item in abolishStatusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.seller_no" filterable @on-change="search">
                                    <Option v-for="item in sellerArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="form.server_no" filterable @on-change="search">
                                    <Option v-for="item in serverArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                            <Select v-model="form.czygbm_bmbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in appointKfDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>

                            <Col span="4">
                            <Select v-model="form.xsygbm_bmbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in allSalesDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="form.datetime" placeholder="选择创建时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="form.datetime1" placeholder="选择出库时间" @on-change="changeDate1" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="form.note" placeholder="输入备注关键字" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="form.stock"  placeholder="请选择出库仓库" filterable @on-change="search">
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
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
                    <Button type="primary" @click="toExport" v-auth="CKDMXList_export">导出</Button>
                     <span style="padding-left: 20px;" :class="{'padding-ten': true}">出库总金额：</span><span style="color: rgb(255, 0, 0);">{{amount}}</span>
                        <span style="padding-left: 20px;" :class="{'padding-ten': true}">出库总数量：</span><span style="color: rgb(255, 0, 0);">{{totalNum}}</span>
                    <span style="padding-left: 20px;" :class="{'padding-ten': true}">勾选出库金额：</span><span style="color: rgb(255, 0, 0);">{{checkamount}}</span>
                    <span style="padding-left: 20px;" :class="{'padding-ten': true}">勾选出库数量：</span><span style="color: rgb(255, 0, 0);">{{checkNum}}</span>

                    </Col>
                </Row>    
                    <el-table :row-class-name="tableRowClassName" :data="returnList" border style="text-align: center;width: 100%" @sort-change="manualSort" @selection-change="handleSelectionChange"  max-height="570">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column label="销售出库单编号" width="130">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.xsckd_djbh,'service-xsckd-detail')">{{scope.row.xsckd_djbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="djrq" label="单据日期" sortable="custom" width="150"></el-table-column>
                        <el-table-column prop="out_time" label="出库时间" sortable="custom" width="150"></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" ></el-table-column>
                        <el-table-column prop="cksl" label="出库数量" ></el-table-column>
                        <el-table-column prop="rate" label="到款比例" ></el-table-column>
                        <el-table-column prop="ckdj" label="出库单价" width="120"></el-table-column>
                        <el-table-column prop="ckje" label="出库金额" width="120"></el-table-column>
                        <el-table-column prop="store_name" label="出库仓库" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="area_name" label="出库库区" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="seat_name" label="出库库位" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="khmc" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="lxr" label="联系人" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sjhm" label="联系方式" width="120"></el-table-column>
                        <el-table-column prop="xshtd_djbh" label="销售合同单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.xshtd_djbh,'service-sales-htd-detail')">{{scope.row.xshtd_djbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cghtd_djbh" label="采购合同单编号" width="130"></el-table-column>
                        <el-table-column prop="fhfsmc" label="发货方式" sortable="custom" width="100"></el-table-column>
                        <el-table-column prop="fhwlmc" label="发货物流" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="hydh" label="快递单号" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="xsyg" label="销售" width="120"></el-table-column>
                        <el-table-column prop="xsygbm" label="销售部门" width="120"></el-table-column>
                        <el-table-column prop="czyg" label="客服" width="120"></el-table-column>
                        <el-table-column prop="czygbm" label="客服部门" width="120"></el-table-column>
                        <el-table-column label="状态" sortable="custom" prop="status">
                            <template slot-scope="scope">
                                <span>{{abolishStatus[scope.row.status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="收货信息的备注" width="150" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
         <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading...</div>
        </Spin>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus,apiGetCommonStockList, apiAllBrands,apiGetDepart, apiXsckdMxList,exportXSCKDDetailList,allpersonInfos} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                CKDMXList_export:'CKDMXList_export',
                spinShow: false,
                form: {
                    djbh: '',
                    khmc:'',
                    xshtd_djbh:'',
                    cpppbh: 'all',
                    cpmc: '',
                    cpxh: '',
                    cpdhh: '',
                    hydh:'',
                    status: 'all',
                    server_no:'all',
                    seller_no:'all',
                    czygbm_bmbh:'all',
                    xsygbm_bmbh:'all',
                    datetime: [],
                    datetime1: [],
                    note:'',
                    stock: 'all',
                },
                returnList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'djrq',
                orderDirection: 'desc',
                abolishStatus:[],
                abolishStatusArr: [
                    {
                        label: '选择订单状态',
                        value: 'all'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择出库仓库'
                    }
                ],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                serverArr: [{
                    label: '选择客服',
                    value: 'all'
                }],
                sellerArr: [{
                    label: '选择销售',
                    value: 'all'
                }],
                appointKfDepart:[{
                    value: 'all',
                    label: '选择客服部门'
                }],
                allSalesDepart:[{
                    value: 'all',
                    label: '选择销售部门'
                }],
                amount:'0.0000',
                checkamount:'0.0000',
                totalNum:'0',
                checkNum:'0',
                multipleInfo:[],
                multipleSelection:[],
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
                    type: JSON.stringify(['xsckd'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.abolishStatus = res.data.xsckd;
                        let tmpObj = {};
                        for (let key in res.data.xsckd) {
                            if (res.data.xsckd.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xsckd[key]
                                };
                                this.abolishStatusArr.push(tmpObj);
                            }
                        }
                    }
                });


                //指定客服部门
                apiGetDepart(this, {
                    type: 'server'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.value = item.id;
                            item.label = item.depart_name;
                            this.appointKfDepart.push(item);
                        });
                    }
                });

                //指定销售部门
                apiGetDepart(this, {
                    type: 'sell'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.value = item.id;
                            item.label = item.depart_name;
                            this.allSalesDepart.push(item);
                        });
                    }
                });

                //获取仓库信息
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
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
            getAllServer () {
                allpersonInfos(this, {
                    type:3
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.serverArr.push({
                                value: item.user_no,
                                label: item.user_name
                            });
                        });
                    }
                });
            },
            getAllSeller () {
                allpersonInfos(this, {
                    type:1
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.sellerArr.push({
                                value: item.user_no,
                                label: item.user_name
                            });
                        });
                    }
                });
            },  
            toExport(){
                exportXSCKDDetailList(this, {
                    params: JSON.stringify(this.notempty({
                        djbh: this.form.djbh,
                        khmc: this.form.khmc,
                        xshtd_djbh: this.form.xshtd_djbh,
                        cpppbh: this.form.cpppbh === 'all' ? '' : this.form.cpppbh,
                        cpmc: this.form.cpmc,
                        hydh: this.form.hydh,
                        cpxh: this.form.cpxh,
                        cpdhh: this.form.cpdhh,
                        status: this.form.status === 'all' ? '' : this.form.status,
                        seller_no: this.form.seller_no === 'all' ? '' : this.form.seller_no,
                        server_no: this.form.server_no === 'all' ? '' : this.form.server_no,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        starttime1: this.form.datetime1[0],
                        endtime1: this.form.datetime1[1],
                        note: this.form.note,
                        czygbm_bmbh: this.form.czygbm_bmbh === 'all' ? '' : this.form.czygbm_bmbh,
                        xsygbm_bmbh: this.form.xsygbm_bmbh === 'all' ? '' : this.form.xsygbm_bmbh,
                        store_no: this.form.stock === 'all' ? '' : this.form.stock,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },     
            handleSelectionChange(val){
                this.multipleInfo = [],
                this.multipleSelection = val;
                for (let i in this.multipleSelection) {
                    this.multipleInfo.push(this.multipleSelection[i]);
                }

                this.checkamount = '0.0000';
                this.checkNum = '0';
                this.multipleInfo.forEach(item => {
                    this.checkamount = (+this.checkamount +  + item.ckje).toFixed(4);
                    this.checkNum = (+this.checkNum +  + item.cksl).toFixed(0);
                });

            },              
            getData () {
                this.spinShow = true;
                apiXsckdMxList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.form.djbh,
                        khmc: this.form.khmc,
                        hydh: this.form.hydh,
                        xshtd_djbh: this.form.xshtd_djbh,
                        cpppbh: this.form.cpppbh === 'all' ? '' : this.form.cpppbh,
                        cpmc: this.form.cpmc,
                        cpxh: this.form.cpxh,
                        cpdhh: this.form.cpdhh,
                        status: this.form.status === 'all' ? '' : this.form.status,
                        seller_no: this.form.seller_no === 'all' ? '' : this.form.seller_no,
                        server_no: this.form.server_no === 'all' ? '' : this.form.server_no,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        starttime1: this.form.datetime1[0],
                        endtime1: this.form.datetime1[1],
                        note: this.form.note,
                        czygbm_bmbh: this.form.czygbm_bmbh === 'all' ? '' : this.form.czygbm_bmbh,
                        xsygbm_bmbh: this.form.xsygbm_bmbh === 'all' ? '' : this.form.xsygbm_bmbh,
                        store_no: this.form.stock === 'all' ? '' : this.form.stock,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.list.totalCount;
                        this.returnList = res.data.list.list;
                        this.amount = res.data.amount;
                        this.totalNum = res.data.totalNum;
                        this.spinShow = false;
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
                this.form = {
                    djbh: '',
                    khmc:'',
                    xshtd_djbh:'',
                    cpppbh: 'all',
                    cpmc: '',
                    hydh:'',
                    cpxh: '',
                    cpdhh: '',
                    status: 'all',
                    server_no:'all',
                    seller_no:'all',
                    datetime: [],
                    datetime1: [],
                    note,
                    czygbm_bmbh:'all',
                    xsygbm_bmbh:'all',
                    stock:'all'
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
            changeDate1 (time) {
                this.form.datetime1 = time;
                this.search();
            }            
        },
        created () {
            this.getStatus();
            this.getData();
            this.getAllBrands();
            this.getAllSeller();
            this.getAllServer();
        },
    };
</script>