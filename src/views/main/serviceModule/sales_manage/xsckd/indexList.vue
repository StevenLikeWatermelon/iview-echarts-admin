<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.ckd_djbh" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.xshtd_djbh" placeholder="输入销售合同单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.hydh" placeholder="输入快递单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择下单时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择出库时间" :value='orderInfo.datetime1' @on-change="datetime1" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.status"  placeholder="选择出库单状态" @on-change="search">
                            <Option v-for="(val, index) in abolishStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.note" placeholder="输入备注关键字" @on-enter="search"></Input>
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

                        <Col span="4">
                        <Select v-model="orderInfo.czygbm_bmbh"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="item in orderInfo.appointKfDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>

                        <Col span="4">
                        <Select v-model="orderInfo.xsygbm_bmbh"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="item in orderInfo.allSalesDepart" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>

                        <Col span="4">
                        <Select v-model="orderInfo.stock"  placeholder="请选择出库仓库" filterable @on-change="search">
                            <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
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
                <Col span="24" style="margin-bottom: 10px;">
                <Button type="primary" @click="printing"  v-auth="xsckdPrint">打印出库单</Button>
                <Button type="primary" @click="toExport" v-auth="XSCKList_export" :class="canPrint ? 'margin-left-10': ''">导出</Button>
                <span style="padding-left: 20px;">出库总金额：</span><span style="color:#cf0012;">{{amount}}</span>
                <span style="padding-left: 20px;">出库总数量：</span><span style="color:#cf0012;">{{totalNum}}</span>
                <span style="padding-left: 20px;">勾选出库金额：</span><span style="color:#cf0012;">{{checkamount}}</span>
                <span style="padding-left: 20px;">勾选出库数量：</span><span style="color:#cf0012;">{{checkNum}}</span>
                <a :href="hrefs" id="clickA"  target="_blank" style="display: none"></a>

                </Col>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort" @selection-change="handleSelectionChange" max-height="570"> 
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="ckd_djbh" label="销售出库单编号" width="130">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.ckd_djbh, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.ckd_djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="下单时间"   sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="out_time" label="出库时间"   sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="djbh" label="销售合同单编号" sortable="custom" width="130">
                        <template slot-scope="scope">
                            <span  @click="handleClick2(scope.row.htdid, scope.row.djbh, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="khmc" label="客户名称"  min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="联系方式"  min-width="100"></el-table-column>
                    <el-table-column prop="htsl" label="合同数量"></el-table-column>
                    <el-table-column prop="cksl" label="出库数量"></el-table-column>
                    <el-table-column prop="ckje" label="出库金额" width="130">
                        <template slot-scope="scope">
                            <span> {{parseFloat(scope.row.ckje).toFixed(4)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fhfsmc" label="发货方式" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="fhwlmc" label="发货物流" ></el-table-column>
                    <el-table-column prop="hydh" label="快递单号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="状态" >
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">
                                <span style="color:#FF0000">{{abolishStatus[scope.row.status]}}</span>
                            </span>
                            <span v-else>{{abolishStatus[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ckmc" label="出库仓库" min-width="120" show-overflow-tooltip></el-table-column>

                    <el-table-column label="销售员工" min-width="120">
                        <template slot-scope="scope">
                        <span>{{scope.row.xsyg_ygbh}}/{{scope.row.xsyg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsygbm" label="销售员工部门" min-width="120"></el-table-column>
                    <el-table-column label="客服员工" min-width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.czyg_ygbh}}/{{scope.row.czyg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="czygbm" label="客服员工部门" min-width="120"></el-table-column>
                    <el-table-column prop="note" label="收货信息的备注" width="150" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading...</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiCkdList,apiCustomerAllStaff,apiGetDepart,apiAllStatus,exportCkdList,apiGetCommonStockList } from '@/config/getData';
    import { notempty, sortBy,setToken, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        
        data () {
            return {
                XSCKList_export:'XSCKList_export',
                hrefs: '',
                orderInfo: {
                    xshtd_djbh: '',
                    ckd_djbh: '',
                    khmc: '',
                    hydh:'',
                    datetime: '',
                    datetime1: '',
                    status: 'all',
                    note:'',
                    czyg_ygbh:'all',
                    xsyg_ygbh:'all',
                    czygbm_bmbh:'all',
                    xsygbm_bmbh:'all',
                    stock:'all',
                    appointKf:[{
                        value: 'all',
                        label: '选择客服'
                    }],
                    allSales:[{
                        value: 'all',
                        label: '选择销售'
                    }],
                    appointKfDepart:[{
                        value: 'all',
                        label: '选择客服部门'
                    }],
                    allSalesDepart:[{
                        value: 'all',
                        label: '选择销售部门'
                    }],
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
                spinShow: false,
                amount:'0.0000',
                checkamount:'0.0000',
                totalNum:'0',
                checkNum:'0',
                multipleInfo:[],
                multipleSelection:[],
                abolishStatus: [],
                abolishStatusArr: [{
                        value: 'all',
                        label: '选择出库单状态'
                    }],
                selectedDjbh: [],
                xsckdPrint:'xsckd_printing',
                canPrint: manualCheck('xsckd_printing'),
                stockArr: [
                    {
                        value: 'all',
                        label: '选择出库仓库'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            handleSelectionChange(selectedVal) {
                this.selectedDjbh = [];
                this.selectedStatus = [];
                selectedVal.forEach(item => {
                    this.selectedDjbh.push(item.ckd_djbh);
                    this.selectedStatus.push(item.status);
                });
                this.hrefs = this.baseUrl + '/model/xsckd?token=' + setToken() + '&djbh=' + JSON.stringify(this.selectedDjbh);

                this.multipleInfo = [],
                this.multipleSelection = selectedVal;
                for (let i in this.multipleSelection) {
                    this.multipleInfo.push(this.multipleSelection[i]);
                }

                this.checkamount = '0.00';
                this.checkNum = '0';
                this.multipleInfo.forEach(item => {
                    this.checkamount = (+this.checkamount +  + item.ckje).toFixed(4);
                    this.checkNum = (+this.checkNum +  + item.cksl).toFixed(0);
                });

            },
            printing() {
                if(this.selectedDjbh.length == 0){
                    this.$Message.error('请选择销售出库单');
                    return false;
                }

                if(this.selectedStatus.indexOf('1') > -1){
                    this.$Message.error('选中销售出库单的状态有非 已作废');
                    return false;
                }
                document.getElementById('clickA').click();


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

                //指定客服部门
                apiGetDepart(this, {
                    type: 'server'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.value = item.id;
                            item.label = item.depart_name;
                            this.orderInfo.appointKfDepart.push(item);
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
                            this.orderInfo.allSalesDepart.push(item);
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
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            handleClick2 (order_id, htdbh, path) {
                let argu = { order_id,htdbh };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            toExport(){
                exportCkdList(this, {
                    params: JSON.stringify(this.notempty({
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        starttime1: this.orderInfo.datetime1[0],
                        endtime1: this.orderInfo.datetime1[1],
                        xshtd_djbh: this.orderInfo.xshtd_djbh,
                        ckd_djbh: this.orderInfo.ckd_djbh,
                        khmc: this.orderInfo.khmc,
                        hydh: this.orderInfo.hydh,
                        status: this.orderInfo.status === 'all' ? '' : this.orderInfo.status,
                        note: this.orderInfo.note,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
                        czygbm_bmbh: this.orderInfo.czygbm_bmbh === 'all' ? '' : this.orderInfo.czygbm_bmbh,
                        xsygbm_bmbh: this.orderInfo.xsygbm_bmbh === 'all' ? '' : this.orderInfo.xsygbm_bmbh,
                        ckbh: this.orderInfo.stock === 'all' ? '' : this.orderInfo.stock,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                    //成功
                    }
                });
            },
            getData () {
                this.spinShow = true;
                apiCkdList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        starttime1: this.orderInfo.datetime1[0],
                        endtime1: this.orderInfo.datetime1[1],
                        xshtd_djbh: this.orderInfo.xshtd_djbh,
                        ckd_djbh: this.orderInfo.ckd_djbh,
                        khmc: this.orderInfo.khmc,
                        hydh: this.orderInfo.hydh,
                        status: this.orderInfo.status === 'all' ? '' : this.orderInfo.status,
                        note: this.orderInfo.note,
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh,
                        czygbm_bmbh: this.orderInfo.czygbm_bmbh === 'all' ? '' : this.orderInfo.czygbm_bmbh,
                        xsygbm_bmbh: this.orderInfo.xsygbm_bmbh === 'all' ? '' : this.orderInfo.xsygbm_bmbh,
                        ckbh: this.orderInfo.stock === 'all' ? '' : this.orderInfo.stock,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list.list;
                        this.totalnum = res.data.list.totalCount;
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
                this.orderInfo.datetime = '';
                this.orderInfo.datetime1 = '';
                this.orderInfo.xshtd_djbh = '';
                this.orderInfo.ckd_djbh = '';
                this.orderInfo.khmc = '';
                this.orderInfo.hydh = '';
                this.orderInfo.status = 'all';
                this.orderInfo.note = '';
                this.orderInfo.czyg_ygbh = 'all',
                this.orderInfo.xsyg_ygbh = 'all',
                this.orderInfo.czygbm_bmbh = 'all',
                this.orderInfo.xsygbm_bmbh = 'all',
                this.orderInfo.stock = 'all',
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            datetime1 (time) {
                this.orderInfo.datetime1 = time;
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
