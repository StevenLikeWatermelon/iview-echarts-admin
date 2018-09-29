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
	                            <Input v-model="salesRequisition.djbh" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.cpppbh" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                            <Col span="4">
                            <Input v-model="salesRequisition.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.czyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                    <Option v-for="item in salesRequisition.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="salesRequisition.xsyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                    <Option v-for="item in salesRequisition.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                    <Row style="margin-bottom:10px;" v-auth="serviceButton" v-show="buttonShow">
                        <col span="24">
                            <Row>
                                <Col span="6">
                                    <Button type="primary" @click="makeSalesRequire()">生成销售请购单</Button>
                                </Col>
                            </Row>
                        </col>
                    </Row>                               
                    <el-table :row-class-name="tableRowClassName" :data="infoList" border style="text-align: center;width: 100%" @sort-change="manualSort"  @selection-change="handleSelectionChange" max-height="570">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="销售合同单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.djbh)">{{scope.row.djbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="djrq" label="创建时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称"  min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号"  min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号"  min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="jldw" label="计量单位" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htsl" label="合同数量" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requisition_num" label="待请购数量"  min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="stock" label="可用库存"  min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="arrive_fund_rate" label="到款比例" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="purchase_user_name" label="采购员"width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.purchase_user_no}}/{{scope.row.purchase_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付状态" sortable="custom" prop="khzfzt" min-width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{khzfStatusObj[scope.row.khzfzt] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态" sortable="custom" prop="xshtdzt" min-width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{xshtdStatusObj[scope.row.xshtdzt] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="xsyg" label="销售人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="czyg" label="客服人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
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
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import { apiAllStatus, apiAllBrands,purchaseManagesalesRequiritionReadyList,purchaseManageQGModelName,apiCustomerAllStaff} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                buttonShow:false,
                serviceButton:'service_dqgmx_toHTD',
                salesRequisition: {
                    khzfzt:'all',
                    xshtdzt:'all',
                    cpppbh:'all',
                    datetime:[],
                    khmc:'',
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
                infoList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                selectedToAdd: [],
                selectedToJudge: [],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                xshtdStatusObj:{
                    value: 'all',
                    label: '全部'
                },
                khzfStatusObj:{
                    value: 'all',
                    label: '全部'
                },
                payStatus: [
                    {
                        label: '选择支付状态',
                        value: 'all'
                    }
                ],
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
            makeSalesRequire () {
                let hasSeller = true;
                if(this.selectedToAdd.length == 0){
                    this.$Message.error('请至少选择一项');
                    return;
                }
                for (let i = this.selectedToJudge.length - 1; i >= 0; i--) {
                    if (!this.selectedToJudge[i]) {
                        hasSeller = false;
                        break;
                    }
                }
                if (!hasSeller) {
                    this.$Message.error('存在无采购人员的勾选项!');
                    return;
                }
                util.openNewPage(this, 'purchase_manage_HT_toRequireDetail', {
                    selectedArr: JSON.stringify(this.selectedToAdd)
                });
                this.$router.push({
                    name: 'purchase_manage_HT_toRequireDetail',
                    query: {
                        selectedArr: JSON.stringify(this.selectedToAdd)
                    }
                });
            },            
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xshtdzt','khzfzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.xshtdStatusObj = res.data.xshtdzt;
                        let tmpObj = {};
                        for (let key in res.data.xshtdzt) {
                            if (res.data.xshtdzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xshtdzt[key]
                                };
                                this.orderStatus.push(tmpObj);
                            }
                        }
                        this.khzfStatusObj = res.data.khzfzt;

                        for (let key in res.data.khzfzt) {
                            if (res.data.khzfzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khzfzt[key]
                                };
                                this.payStatus.push(tmpObj);
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
                            this.salesRequisition.allSales.push(item);
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
                            this.salesRequisition.appointKf.push(item);
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
            handleSelectionChange(selectedVal) {
                this.selectedToAdd = [];
                this.selectedToJudge = [];
                selectedVal.forEach(item => {
                    this.selectedToAdd.push(item.sell_detail_id);
                    this.selectedToJudge.push(item.purchase_user_no);
                });
            },                   
            getData () {
                // 请替换接口名称
                purchaseManagesalesRequiritionReadyList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.salesRequisition.djbh,
                        cpppbh: this.salesRequisition.cpppbh === 'all' ? '' : this.salesRequisition.cpppbh,
                        cpmc: this.salesRequisition.cpmc,
                        cpxh: this.salesRequisition.cpxh,
                        cpdhh: this.salesRequisition.cpdhh,
                        xshtdzt: this.salesRequisition.xshtdzt === 'all' ? '' : this.salesRequisition.xshtdzt,
                        khztzt: this.salesRequisition.khztzt === 'all' ? '' : this.salesRequisition.khztzt,
                        start_time: this.salesRequisition.datetime[0],
                        end_time: this.salesRequisition.datetime[1],
                        khmc:this.salesRequisition.khmc,
                        czyg_ygbh: this.salesRequisition.czyg_ygbh === 'all' ? '' : this.salesRequisition.czyg_ygbh,
                        xsyg_ygbh: this.salesRequisition.xsyg_ygbh === 'all' ? '' : this.salesRequisition.xsyg_ygbh,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.infoList = res.data.list;

                        this.getModalName().then(modalName => {
                            //当前登录人是否可创建工作流
                            isInCreaters(this, modalName,2).then(isIn => {
                                //待生成销售请购单按钮显示
                                this.buttonShow = isIn;
                            });
                        });


                     
                    }
                });
            },
            getModalName() {
                return new Promise(success => {
                    purchaseManageQGModelName(this, {}).then(res => {
                        if (res && res.status == 1) {
                            success(res.data);
                        } else {
                            this.$Message.error('获取modalname失败!');
                            success('');
                        }
                    });
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesRequisition.id = '';
                this.salesRequisition.djbh = '';
                this.salesRequisition.cpppbh = 'all';
                this.salesRequisition.cpmc = '';
                this.salesRequisition.cpxh = '';
                this.salesRequisition.cpdhh = '';
                this.salesRequisition.xshtdzt = 'all';
                this.salesRequisition.khztzt = 'all';
                this.salesRequisition.datetime = [];
                this.salesRequisition.khmc = '';
                this.salesRequisition.xsyg_ygbh = 'all';
                this.salesRequisition.czyg_ygbh = 'all';
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

                this.salesRequisition.datetime = time;
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