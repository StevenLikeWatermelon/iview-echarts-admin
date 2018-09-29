<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="invoinceInfo" class="model-style">
                        <Row>
                        	<Col span="4">
                                <Select v-model="invoinceInfo.supplier_no" filterable @on-change="search">
                                    <Option v-for="item in supperList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="invoinceInfo.invoice_status" @on-change="search">
                                    <Option v-for="item in invoice_statusAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="invoinceInfo.order_invoice_type" @on-change="search">
                                    <Option v-for="item in order_invoice_typeAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.order_invoice_no" placeholder="请输入采购收票单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="invoinceInfo.brand_no" filterable @on-change="search">
                                    <Option v-for="item in brand_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="invoinceInfo.from_order_no" @on-change="search">
                                    <Option v-for="item in from_order_noAllSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.from_order" placeholder="请输入来源单据编号" @on-enter="search"></Input>
                            </Col>
                             <Col span="4">
                                <Input v-model="invoinceInfo.buy_order_no" placeholder="请输入采购合同单号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.invoice_no" placeholder="请输入发票号码" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="invoinceInfo.create_user" placeholder="请输入员工信息" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="invoinceInfo.datetime1" placeholder="请选择实际收票时间" @on-change="changeDatetime1" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <DatePicker type="datetimerange" :value="invoinceInfo.datetime" placeholder="请选择创建时间" @on-change="changeDatetime" style="width:100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10  margin-pag-botm">
            <col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                    <Col span="24">
                        <Button type="primary" @click="toExport" v-auth="SPList_export">导出</Button>
                        <span style="padding-left: 20px;">收票(退票)总金额：</span><span style="color:#cf0012;">{{amount}}</span>
                        <span style="padding-left: 20px;">勾选收票(退票)金额：</span><span style="color:#cf0012;">{{checkamount}}</span>
                    </Col>
                    
                </Row>
                    <el-table :row-class-name="tableRowClassName" :data="invoiceList" ref="multipleTable" border style="text-align: center;width:100%" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column prop="order_invoice_no" label="采购收票单编号"  fixed="left" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_invoice_no, scope.row.order_invoice_type)">{{scope.row.order_invoice_no}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="gysmc" label="供应商"  width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="instock_num" label="入库数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="return_num" label="退货数量" min-width="100"></el-table-column>
                        <el-table-column prop="invoice_num" label="收票数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="invoice_amount" label="收票金额" width="120"></el-table-column>
                        <el-table-column prop="invoice_no" label="发票号码" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="invoice_status" label="状态" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{ invoice_statusAll[scope.row.invoice_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_invoice_type" label="发票类别" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ order_invoice_typeAll[scope.row.order_invoice_type] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoice_time" label="实际开票时间" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="create_user" label="创建人" width="120"></el-table-column>
                        <el-table-column prop="from_order_no" label="来源类型" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span>{{ from_order_noAll[scope.row.from_order_no] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_order_no" label="采购合同单号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTDetail(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from_order" label="来源单据编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.from_order, scope.row.moudleName)">{{scope.row.from_order}}</span>
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
    import { purchaseManageSPList, apiAllStatus, allBrands, apiAllBrands,apiExportPurchaseSPList} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                SPList_export:'SPList_export',
                invoinceInfo: {
                    supplier_no: 'all',
                    invoice_status: 'all',
                    order_invoice_type: 'all',
                    order_invoice_no: '',
                    brand_no: 'all',
                    product_name: '',
                    from_order_no: 'all',
                    buy_order_no:'',
                    product_model: '',
                    product_order_no: '',
                    invoice_no: '',
                    from_order: '',
                    starttime: '',
                    endtime: '',
                    datetime: [],
                    datetime1: []
                },
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'create_time',
                orderDirection: 'desc',
                supperList: [{
                    label: '选择供应商',
                    value: 'all'
                }],
                invoice_statusAllSelect: [{
                    label: '选择状态',
                    value: 'all'
                }],
                invoice_statusAll: [],
                order_invoice_typeAllSelect: [{
                    label: '选择发票类别',
                    value: 'all'
                }],
                order_invoice_typeAll: [],
                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
                from_order_noAllSelect: [{
                    label: '选择来源类型',
                    value: 'all'
                }],
                from_order_noAll: [],
                invoiceList: [],
                amount:'0.0000',
                checkamount:'0.0000',
                multipleInfo:[],
                multipleSelection:[]
            };
        },
        methods: {
            goToDetail (id, type) {
                util.openNewPage(this, 'purchase_manage_SP_detail', {
                    param: id,
                    type: type
                });
                this.$router.push({
                    name: 'purchase_manage_SP_detail',
                    query: {
                        param: id,
                        type: type
                    }
                });
            },
            goToHTDetail(id) {
                util.openNewPage(this, 'purchase_manage_HT_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_HT_detail',
                    query: {
                        param: id
                    }
                });
            },
            goToDiffDetail (id, moduleName) {
                util.openNewPage(this, moduleName, {
                	param: id
                });
                this.$router.push({
                    name: moduleName,
                    query: {
                    	param: id
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_invoice_type', 'buy_invoice_from', 'buy_invoice_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.invoice_statusAll = res.data.buy_invoice_status;
                        res.data.buy_invoice_status.forEach((item, index) => {
                            this.invoice_statusAllSelect.push({
                                label: item,
                                value: index.toString()
                            })
                        });
                        this.order_invoice_typeAll = res.data.buy_invoice_type;
                        res.data.buy_invoice_type.forEach((item, index) => {
                            this.order_invoice_typeAllSelect.push({
                                label: item,
                                value: index.toString()
                            })
                        });
                        this.from_order_noAll = res.data.buy_invoice_from;
                        res.data.buy_invoice_from.forEach((item, index) => {
                            this.from_order_noAllSelect.push({
                                label: item,
                                value: index.toString()
                            })
                        });
                    }
                });
            },
//            handleSelectionChange(val) {
//                this.multipleInfo = [],
//                this.multipleSelection = val;
//                for (let i in this.multipleSelection) {
//                    this.multipleInfo.push(this.multipleSelection[i].invoice_amount);
//                }
//                this.checkamount = '0.0000';
//                this.multipleInfo.forEach(item => {
//                    this.checkamount = (+this.checkamount +  + item).toFixed(4);
//                });
//            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.checkamount = this.add(this.checkamount, row.invoice_amount, 4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.checkamount = this.subtract(this.checkamount, row.invoice_amount, 4);

                }
            },
            selectAll (selection) {
                this.invoiceList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            toExport(){
                apiExportPurchaseSPList(this, {
                    params: JSON.stringify({
                        supplier_no: this.invoinceInfo.supplier_no === 'all' ? '' : this.invoinceInfo.supplier_no,
                        invoice_status: this.invoinceInfo.invoice_status === 'all' ? '' : this.invoinceInfo.invoice_status,
                        order_invoice_type: this.invoinceInfo.order_invoice_type === 'all' ? '' : this.invoinceInfo.order_invoice_type,
                        order_invoice_no: this.invoinceInfo.order_invoice_no,
                        brand_no: this.invoinceInfo.brand_no === 'all' ? '' : this.invoinceInfo.brand_no,
                        product_name: this.invoinceInfo.product_name,
                        from_order_no: this.invoinceInfo.from_order_no === 'all' ? '' : this.invoinceInfo.from_order_no,
                        product_model: this.invoinceInfo.product_model,
                        product_order_no: this.invoinceInfo.product_order_no,
                        invoice_no: this.invoinceInfo.invoice_no,
                        from_order: this.invoinceInfo.from_order,
                        buy_order_no: this.invoinceInfo.buy_order_no,
                        create_user: this.invoinceInfo.create_user,
                        starttime: this.invoinceInfo.datetime[0],
                        endtime: this.invoinceInfo.datetime[1],
                        invoice_starttime: this.invoinceInfo.datetime1[0],
                        invoice_endtime: this.invoinceInfo.datetime1[1],
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                      //成功
                    }
                });
            },
            getData () {
                purchaseManageSPList(this, {
                    params: JSON.stringify({
                        supplier_no: this.invoinceInfo.supplier_no === 'all' ? '' : this.invoinceInfo.supplier_no,
                        invoice_status: this.invoinceInfo.invoice_status === 'all' ? '' : this.invoinceInfo.invoice_status,
                        order_invoice_type: this.invoinceInfo.order_invoice_type === 'all' ? '' : this.invoinceInfo.order_invoice_type,
                        order_invoice_no: this.invoinceInfo.order_invoice_no,
                        brand_no: this.invoinceInfo.brand_no === 'all' ? '' : this.invoinceInfo.brand_no,
                        product_name: this.invoinceInfo.product_name,
                        from_order_no: this.invoinceInfo.from_order_no === 'all' ? '' : this.invoinceInfo.from_order_no,
                        product_model: this.invoinceInfo.product_model,
                        product_order_no: this.invoinceInfo.product_order_no,
                        invoice_no: this.invoinceInfo.invoice_no,
                        from_order: this.invoinceInfo.from_order,
                        buy_order_no: this.invoinceInfo.buy_order_no,
                        create_user: this.invoinceInfo.create_user,
                        starttime: this.invoinceInfo.datetime[0],
                        endtime: this.invoinceInfo.datetime[1],
                        invoice_starttime: this.invoinceInfo.datetime1[0],
                        invoice_endtime: this.invoinceInfo.datetime1[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.list.forEach(item => {
                            switch(item.from_order_no) {
                                case '0':
                                    item.moudleName = 'purchase_manage_RK_detail';
                                    break;
                                case '1':
                                    item.moudleName = 'purchase_manage_TH_detail';
                                    break;
                                default:
                                    item.moudleName = 'home_index'; //未匹配跳转首页
                            }
                        });
                        this.invoiceList = res.data.list.list;
                        this.totalnum = res.data.list.totalCount;
                        this.amount = res.data.amount;
                        this.supperList = [
                            {
                                value: 'all',
                                label: '选择供应商'
                            }
                        ];
                        res.data.list.suppliers.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });

                        this.$nextTick(() => {
                            this.invoiceList.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }

                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getData();
            },
            reset () {
                this.invoinceInfo.supplier_no ='all';
                this.invoinceInfo.invoice_status ='all';
                this.invoinceInfo.order_invoice_type ='all';
                this.invoinceInfo.order_invoice_no ='';
                this.invoinceInfo.brand_no ='all';
                this.invoinceInfo.product_name ='';
                this.invoinceInfo.from_order_no ='all';
                this.invoinceInfo.product_model ='';
                this.invoinceInfo.product_order_no ='';
                this.invoinceInfo.from_order ='';
                this.invoinceInfo.buy_order_no ='';
                this.invoinceInfo.invoice_no = '';
                this.invoinceInfo.create_user ='';
                this.invoinceInfo.starttime ='';
                this.invoinceInfo.endtime ='';
                this.invoinceInfo.datetime =[];
                this.invoinceInfo.datetime1 =[];
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
            changeDatetime (time) {
                this.invoinceInfo.datetime = time;
                this.search();
            },
            changeDatetime1 (time) {
                this.invoinceInfo.datetime1 = time;
                this.search();
            }
        },
        created () {
            this.getStatus();
            this.getData();
//            this.getAllApplyData();
            this.getAllBrands();
        },
        activated() {
            
        }
    };
</script>