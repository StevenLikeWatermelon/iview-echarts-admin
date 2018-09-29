<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="140" class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="form.supplier"  placeholder="选择供应商" filterable  @on-change="search">
                                <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.status"  placeholder="选择状态"  @on-change="search">
                                <Option value="all">选择状态</Option>
                                <Option v-for="(index,value) in instock_list" :value="value" :key="value">{{ index }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.in_no" placeholder="输入采购入库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.order_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.brand"  placeholder="选择品牌" filterable  @on-change="search">
                                <Option value="all">选择品牌</Option>
                                <Option v-for="status in brand_list" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.ship_no" placeholder="输入采购发货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_order_no" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.receive_store"  placeholder="选择入库仓库" filterable @on-change="storeChange">
                                <Option value="all">选择入库仓库</Option>
                                <Option v-for="status in store_list" :value="status.ckbh" :key="status.ckbh">{{ status.ckmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4" v-if="areaSelectDisplay">
                            <Select v-model="form.reservoir_area" placeholder="选择入库库区" @on-change="areaChange" filterable>
                                <Option v-for="val in AreaArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4" v-if="seatSelectDisplay">
                            <Select v-model="form.pool_position"  placeholder="选择入库库位"  @on-change="search" filterable>
                                <Option v-for="val in seatArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.buy_user_no"  placeholder="选择采购员" @on-change="search" filterable>
                                <Option value="all">选择采购员</Option>
                                <Option v-for="status in buy_user_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.create_user_no" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.from_order_no" placeholder="输入来源单号" @on-enter="search"></Input>
                        </Col>

                        <Col span="4">
                        <Select v-model="form.is_invoice"  placeholder="选择是否开票"  @on-change="search">
                            <Option v-for="val in isInvoiceArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
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
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toSPD" v-show="can_sp_btn" v-auth="sp_button">生成采购收票单</Button>
                    <Button type="primary" @click="toExport" v-auth="RKList_export" :class="{'margin-left-10': can_sp_btn && sp_button}">导出</Button>
                    <span style="padding-left: 20px;">入库总金额：</span><span style="color:#cf0012;">{{amount}}</span>
                    <span style="padding-left: 20px;">勾选入库金额：</span><span style="color:#cf0012;">{{checkamount}}</span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"  max-height="570">
                    <el-table-column
                            type="selection"
                            :selectable="canSelect" 
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column label="采购入库单编号" fixed width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.instock_no}, 'purchase_manage_RK_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.instock_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购员" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.buy_user_no }} / {{ scope.row.buy_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brand_name" label="品牌"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_order_no" label="订货号" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="store_name" label="入库仓库" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area_name" label="入库库区" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seat_name" label="入库库位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_price" label="采购单价" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_origin_price" label="采购面价" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_discount" label="采购折扣" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_num" label="采购数量" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num" label="发货数量" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_num" label="入库数量" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="return_num" label="退货数量" width="120" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="invoiced_num" label="已收票数量" width="120" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="wait_invoiced_num" label="待收票数量" width="120" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="入库金额" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ multiply(scope.row.product_price, scope.row.instock_num, 4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" sortable="custom" prop="instock_status">
                        <template slot-scope="scope">
                            <span> {{ instock_list[scope.row.instock_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" min-width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }} / {{ scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购合同单编号" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="from_order_no" label="来源单据编号" width="120">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDiffDetail(scope.row.from_order_no, scope.row.moudleName)">{{scope.row.from_order_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购发货单编号" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.rel_order_no}, 'purchase_manage_FH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.rel_order_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="invoice_nos" label="采购收票单编号" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.invoice_nos.length == 0"></div>
                            <el-popover trigger="hover" placement="top" v-else>
                                <p v-for="val in scope.row.invoice_nos"><span class="pointer-hover" @click="handleClick({param: val}, 'purchase_manage_SP_detail')">{{ val }}</span></p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apiInstockList,operateAllBrandsList,allStoreInfos,allpersonInfos,apiGetAllAreaList,apiGetgenerateInvoice,apiGetAllSeatList,purchaseManageSPModel,apiExportInstockList } from '@/config/getData';
    import { notempty, sortBy, manualCheck,isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                RKList_export:'RKList_export',
                areaSelectDisplay: false,
                seatSelectDisplay: false,
                can_sp_btn: false,
                sp_button: 'sp_bu',
                canshow: manualCheck('sp_bu'),
                supperList: [],              //供应商列表
                store_list: [],                 //仓库列表
                brand_list: [],                 //品牌列表
                instock_list: [],               //入库单状态列表
                buy_user_list: [],              //采购员列表
                form: {
                    supplier: 'all',
                    status: 'all',
                    in_no: '',
                    order_no: '',
                    brand: 'all',
                    product_name: '',
                    ship_no: '',
                    product_model: '',
                    product_order_no: '',
                    receive_store: 'all',
                    reservoir_area: 'all',
                    pool_position: 'all',
                    datetime: '',
                    buy_user_no: 'all',
                    create_user_no: '',
                    from_order_no:'',
                    is_invoice:'all',
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                multipleSelection: [],
                copyAllSelecet: [],
                amount:'0.0000',
                checkamount:'0.0000',
                AreaArr: [
                    {
                        value: 'all',
                        label: '选择入库库区'
                    }
                ],
                seatArr: [
                    {
                        value: 'all',
                        label: '选择入库库位'
                    }
                ],
                isInvoiceArr: [
                    {
                        value: 'all',
                        label: '选择是否开票'
                    },
                    {
                        value: '0',
                        label: '待收票'
                    },
                    {
                        value: '1',
                        label: '已收票'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            getSpBtn () {
                purchaseManageSPModel(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        isInCreaters(this, res.data, 0).then(result => {
                            // console.log(result);
                            if(result){
                                this.can_sp_btn = true;
                            }
                        })
                    }
                });
            },
            canSelect (row) {
                let arr = [1];
                // if(parseInt(row.num) > parseInt(row.instock_num) && arr.indexOf(parseInt(row.order_status)) >= 0) {
                if(arr.indexOf(parseInt(row.instock_status)) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            selectOne (selection, row) {
                 let arr = [1];
                if(arr.indexOf(parseInt(row.instock_status)) >= 0) {
                     if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                    } else {
                        row.checked = !!selection;
                    }
                    if (row.checked && !(this.multipleSelection.includes(row.id))) {
                        this.multipleSelection.push(row.id);
                        this.copyAllSelecet.push(row);
                        this.checkamount = this.add(this.checkamount, this.multiply(row.product_price, row.instock_num), 4);
                    }
                    if (!row.checked && this.multipleSelection.includes(row.id)) {
                        let index = this.multipleSelection.indexOf(row.id);
                        this.multipleSelection.splice(index, 1);
                        this.copyAllSelecet.splice(index, 1);
                        this.checkamount = this.subtract(this.checkamount, this.multiply(row.product_price, row.instock_num), 4)
                    }
                }else{
                    return false;
                }
               
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            toSPD () {

                if (this.multipleSelection.length == 0) {
                    this.$Message.error('选择单据');
                    return;
                }
                let ship_list = '';
                let list = JSON.stringify({
                        order_invoice_type: 0,
                        from_order_no: 0,
                        instock_detail_id: this.multipleSelection
                        });
                //此处接口为售票单接口
               apiGetgenerateInvoice(this, {
                    params: list
                }).then(res => {
                    if (res && res.status == 1){
                        this.handleClick({param: list,from_order_no:0}, 'purchase_manage_HT_toSPD');
                        this.multipleSelection = [];
                    } else {
                        let mess = '';
                        if (res.message.constructor === Array) {
                            for (let i in res.message) {
                                if (mess) {
                                    mess = mess + '</br>' + res.message[i];
                                } else {
                                    mess = res.message[i];
                                }   
                            }
                        } else {
                            mess = res.message;
                        }
                        this.$Message.error({
                            content: mess,
                            duration: 5,
                            closable: true
                        });
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
            storeChange (val) {
                this.form.reservoir_area = 'all';
                this.form.pool_position = 'all';
                this.areaSelectDisplay = false;
                this.seatSelectDisplay = false;

                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllAreaList(this, {
                        store_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.AreaArr = [
                                {
                                    value: 'all',
                                    label: '全部'
                                }
                            ];
                            this.store_no = val;
                            res.data.forEach(item => {
                                item.label = item.area_name;
                                item.value = item.area_no;
                                this.AreaArr.push(item);
                            });
                            this.areaSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            areaChange (val) {
                this.form.pool_position = 'all';
                this.seatSelectDisplay = false;
                if (val === 'all') {
                    this.search();
                } else {
                    apiGetAllSeatList(this, {
                        store_no: this.store_no,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.seatArr = [
                                {
                                    value: 'all',
                                    label: '全部'
                                }
                            ];
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.seatArr.push(item);
                            });
                            this.seatSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            getBuys () {
                allpersonInfos(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.buy_user_list = res.data.list;
                    }
                });
            },
            //获取品牌列表
            getAllBrand () {
                operateAllBrandsList(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.brand_list = res.data.list;
                    }
                });
            },
            //获取到货仓库列表
            getAllStore () {
                allStoreInfos(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.store_list = res.data.list;
                    }
                });
            },
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['instock_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.instock_list = res.data.instock_status;
                    }
                });
            },
            toExport(){
                 apiExportInstockList(this, {
                    params: JSON.stringify(this.notempty({
                        // pageNum: this.currentPage,
                        // numPerPage: this.limit,
                        // orderField: this.orderField,
                        // orderDirection: this.orderDirection,
                        supplier: this.form.supplier == 'all' ? '' : this.form.supplier,                    //供应商
                        status: this.form.status == 'all' ? '' : this.form.status,                          //状态
                        in_no: this.form.in_no,
                        order_no: this.form.order_no,
                        product_name: this.form.product_name,
                        ship_no: this.form.ship_no,
                        product_model: this.form.product_model,
                        product_order_no: this.form.product_order_no,
                        brand: this.form.brand == 'all' ? '' : this.form.brand,                             //品牌
                        receive_store: this.form.receive_store == 'all' ? '' : this.form.receive_store,     //入库仓库
                        area_no : this.form.reservoir_area == 'all' ? '' : this.form.reservoir_area,
                        seat_no: this.form.pool_position == 'all' ? '' : this.form.pool_position,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        buy_user_no: this.form.buy_user_no == 'all' ? '' : this.form.buy_user_no,
                        create_user_no: this.form.create_user_no,
                        from_order_no: this.form.from_order_no,
                        is_invoice:this.form.is_invoice == 'all' ? '' : this.form.is_invoice,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                       //成功
                    }
                });
            },
            getData () {
                apiInstockList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier: this.form.supplier == 'all' ? '' : this.form.supplier,                    //供应商
                        status: this.form.status == 'all' ? '' : this.form.status,                          //状态
                        in_no: this.form.in_no,
                        order_no: this.form.order_no,
                        product_name: this.form.product_name,
                        ship_no: this.form.ship_no,
                        product_model: this.form.product_model,
                        product_order_no: this.form.product_order_no,
                        brand: this.form.brand == 'all' ? '' : this.form.brand,                             //品牌
                        receive_store: this.form.receive_store == 'all' ? '' : this.form.receive_store,     //入库仓库
                        area_no : this.form.reservoir_area == 'all' ? '' : this.form.reservoir_area,
                        seat_no: this.form.pool_position == 'all' ? '' : this.form.pool_position,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        buy_user_no: this.form.buy_user_no == 'all' ? '' : this.form.buy_user_no,
                        create_user_no: this.form.create_user_no,
                        from_order_no: this.form.from_order_no,
                        is_invoice:this.form.is_invoice == 'all' ? '' : this.form.is_invoice,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.list.forEach(item => {
                            switch(item.from_order) {
                                case '1':
                                    item.moudleName = 'purchase_manage_BH_detail';
                                    break;
                                case '2':
                                    item.moudleName = 'service-sales-xsqgd-detail';
                                    break;
                                default:
                                    item.moudleName = 'home_index'; //未匹配跳转首页
                            }
                        });
                        this.orderData.data = res.data.list.list;
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
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }
                    }else{
                        this.$Message.error(res.message);
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
                this.form.supplier = 'all';
                this.form.status = 'all';
                this.form.in_no = '';
                this.form.order_no = '';
                this.form.brand = 'all';
                this.form.product_name = '';
                this.form.ship_no = '';
                this.form.product_model = '';
                this.form.product_order_no = '';
                this.form.receive_store = 'all';
                this.form.area_no = 'all';
                this.form.seat_no = 'all';
                this.form.datetime = '';
                this.orderField = '';              //排序字段
                this.orderDirection = 'desc';      //排序顺序
                this.form.buy_user_no = 'all';
                this.form.create_user_no = '';
                this.form.from_order_no = '';

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
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getAllBrand();
            this.getAllStore();
            this.getStatus();
            this.getBuys();
            this.getData();
            this.getSpBtn();
            // console.log(this.ddd, 11111)
        }
    };
</script>
