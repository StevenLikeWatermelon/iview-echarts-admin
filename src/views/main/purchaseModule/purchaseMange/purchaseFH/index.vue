<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="140" class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="form.supplier"  placeholder="请选择供应商" filterable @on-change="search">
                                <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.status"  placeholder="请选择状态" @on-change="search">
                                <Option value="all">请选择状态</Option>
                                <Option v-for="(index,value) in ship_status" :value="value" :key="value">{{ index }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.ship_no" placeholder="请输入采购发货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.brand"  placeholder="请选择品牌" @on-change="search" filterable>
                                <Option value="all">请选择品牌</Option>
                                <Option v-for="status in brand_list" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.instock_no" placeholder="请输入采购入库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.receive_store"  placeholder="请选择到货仓库" filterable @on-change="search">
                                <Option value="all">请选择到货仓库</Option>
                                <Option v-for="status in store_list" :value="status.ckbh" :key="status.ckbh">{{ status.ckmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.ship_no2" placeholder="请输入物流单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.create_user_no" placeholder="请输入创建人"></Input>
                        </Col>
                        <!-- <Col span="24" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col> -->
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
                     <Button type="primary" @click="toRKD" v-show="can_btn">生成采购入库单</Button>
                     <Button type="primary" @click="toExport" v-auth="FHlist_export" :class="{'margin-left-10': can_btn}">导出</Button>
                     <span style="padding-left: 20px;">发货总金额：</span><span style="color: #cf0012;">{{amount}}</span>
                     <span style="padding-left: 20px;">勾选发货金额：</span><span style="color: #cf0012;">{{checkamount}}</span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center;width:100%;" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"  max-height="570"> 
                    <el-table-column
                            type="selection"
                            :selectable="canSelect" 
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column label="采购发货单编号" width="120" fixed>
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.order_ship_no}, 'purchase_manage_FH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_ship_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_order_no" label="订货号" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位" width="100"></el-table-column>
                    <el-table-column prop="receive_stock_name" label="到货仓库" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="buy_price" label="采购单价" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="buy_num" label="采购数量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num" label="发货数量" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column label="发货金额" width="120">
                        <template slot-scope="scope">
                            <span>{{ multiply(scope.row.num, scope.row.buy_price, 4) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ship_no2" label="物流单号" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_num" label="已入库数量" width="100"></el-table-column>
                    <el-table-column label="状态" sortable="custom" prop="order_status">
                        <template slot-scope="scope">
                            <span> {{ ship_status[scope.row.order_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建人" prop="create_user_no" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{ scope.row.create_user_no }} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购合同单编号" width="120">
                        <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购入库单编号" width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.instock_num" @click="getInstock(scope.row.fh_id)" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">查看</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
            <!--采购入库单弹窗-->
            <Modal width="500" v-model="showInfo" title="采购入库单">
                <div v-for="(value,index) in instock_list" @click="gotoInstock(value)" style="cursor:pointer;line-height:30px;color:rgb(45, 140, 240);">{{ value }}</div>
            </Modal>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,operateAllBrandsList,allStoreInfos,apiGetShipList,apiGetInstockByShip,apiInstockWaitList,apiGetInstockModelName, purchaseManageSPModel, apiGetgenerateInvoice,apiExportShipList } from '@/config/getData';
    import { notempty,isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'purchase_manage_FH_index',
        data () {
            return {
                form: {
                    supplier: 'all',            //供应商
                    status: 'all',              //状态
                    ship_no: '',                //发货单编号
                    ship_no2: '',               //物流单号
                    order_no: '',               //合同单编号
                    brand: 'all',               //品牌
                    product_name: '',           //产品名称
                    instock_no: '',             //入库单编号
                    product_order_no: '',       //产品订货号
                    product_model: '',          //产品型号
                    receive_store: 'all',       //到货仓库
                    datetime: '',               //时间
                    create_user_no: '',         //创建人
                },
                supperList: [],              //供应商列表
                store_list: [],                 //仓库列表
                brand_list: [],                 //品牌列表
                ship_status: [],                //发货单列表

                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                showInfo: false,
                instock_list: [],               //入库单列表
                multipleSelection: [],          //生成入库单需要参数，
                copyAllSelecet: [],
                can_btn: false,
                FHlist_export:'FHlist_export',
                amount: '0.0000',
                checkamount:'0.0000',
            };
        },
        components: {
            pagination
        },
        methods: {
            toExport(){
                apiExportShipList(this,{
                    params: JSON.stringify(this.notempty({
                        // pageNum: this.currentPage,
                        // numPerPage: this.limit,
                        // orderField: this.orderField,
                        // orderDirection: this.orderDirection,
                        supplier: this.form.supplier == 'all' ? '' : this.form.supplier,                    //供应商
                        status: this.form.status == 'all' ? '' : this.form.status,                          //状态
                        ship_no: this.form.ship_no,                                                         //发货单编号
                        ship_no2: this.form.ship_no2,                                                       //物流单号
                        order_no: this.form.order_no,                                                       //合同单编号
                        brand: this.form.brand == 'all' ? '' : this.form.brand,                             //品牌
                        product_name: this.form.product_name,                                               //产品名称
                        instock_no: this.form.instock_no,                                                   //入库单编号
                        product_order_no: this.form.product_order_no,                                       //产品订货号
                        product_model: this.form.product_model,                                             //产品型号
                        receive_store: this.form.receive_store == 'all' ? '' : this.form.receive_store,     //到货仓库
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        create_user_no: this.form.create_user_no,                                           //创建人
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            canSelect (row) {
                let arr = [2,3,4,5];
                // if(parseInt(row.num) > parseInt(row.instock_num) && arr.indexOf(parseInt(row.order_status)) >= 0) {
                if(arr.indexOf(parseInt(row.order_status)) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            getBtn () {
                apiGetInstockModelName(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        isInCreaters(this, res.data, 3).then(result => {
                            if(result){
                                this.can_btn = true;
                            }
                        })
                    }
                })
            },
            toRKD () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                    return;
                }
                for (var i = 0; i < this.copyAllSelecet.length; i++) {
                    let valid = this.canSelect(this.copyAllSelecet[i]);
                    if (!valid) {
                        this.$Message.error('已经全部入库的采购发货单不可勾选且单据状态非已作废”');
                        return;
                    }
                }
                let ship_list = '';
                let tmpArr = [];
                this.multipleSelection.forEach(item => {
                    tmpArr.push(item);
                });
                ship_list = tmpArr.join(',');

                apiInstockWaitList(this, {
                    ids: JSON.stringify(ship_list)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.handleClick({param: ship_list}, 'purchase_manage_FH_toRKD');
//                        this.multipleSelection = [];
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            selectOne (selection, row) {
                let arr = [2,3,4,5];
                if(arr.indexOf(parseInt(row.order_status)) >= 0) {
                    if (!!selection && typeof selection != 'number') {
                        row.checked = !row.checked;
                    } else {
                        row.checked = !!selection;
                    }
                    if (row.checked && !(this.multipleSelection.includes(row.fh_id))) {
                        this.multipleSelection.push(row.fh_id);
                        this.copyAllSelecet.push(row);
                        this.checkamount = this.add(this.checkamount, this.multiply(row.buy_price,row.num), 4);
                    }
                    if (!row.checked && this.multipleSelection.includes(row.fh_id)) {
                        let index = this.multipleSelection.indexOf(row.fh_id);
                        this.multipleSelection.splice(index, 1);
                        this.copyAllSelecet.splice(index, 1);
                        this.checkamount = this.subtract(this.checkamount, this.multiply(row.buy_price,row.num), 4);
                    }
                } else {
                    return false;
                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });


            },
            //跳转到采购入库单
            gotoInstock (in_no) {
                this.showInfo = false;

                let params = {};
                params = {
                    param: in_no
                };
                util.openNewPage(this, 'purchase_manage_RK_detail', params);
                this.$router.push({
                    name: 'purchase_manage_RK_detail',
                    query: params
                });
            },
            //获取采购入库单
            getInstock (fh_id) {
                apiGetInstockByShip(this, {
                    inmx_id: fh_id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.instock_list = res.data.list;
                        this.showInfo = true;
                    }else{
                        this.$Message.error(res.message);
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
            //获取采购发货单状态
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.ship_status = res.data.ship_status;
                    }
                });
            },
            //获取列表数据
            getData () {
                apiGetShipList(this,{
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier: this.form.supplier == 'all' ? '' : this.form.supplier,                    //供应商
                        status: this.form.status == 'all' ? '' : this.form.status,                          //状态
                        ship_no: this.form.ship_no,                                                         //发货单编号
                        ship_no2: this.form.ship_no2,                                                       //物流单号
                        order_no: this.form.order_no,                                                       //合同单编号
                        brand: this.form.brand == 'all' ? '' : this.form.brand,                             //品牌
                        product_name: this.form.product_name,                                               //产品名称
                        instock_no: this.form.instock_no,                                                   //入库单编号
                        product_order_no: this.form.product_order_no,                                       //产品订货号
                        product_model: this.form.product_model,                                             //产品型号
                        receive_store: this.form.receive_store == 'all' ? '' : this.form.receive_store,     //到货仓库
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1],
                        create_user_no: this.form.create_user_no,                                           //创建人
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.amount = res.data.amount;
                        this.supperList = [
                            {
                                value: 'all',
                                label: '请选择供应商'
                            }
                        ];
                        res.data.suppliers.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.fh_id)) {
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
            //搜索
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getData();
            },
            //重置
            reset () {
                this.form.supplier = 'all';             //供应商
                this.form.status = 'all';               //状态
                this.form.ship_no = '';                 //发货单编号
                this.form.ship_no2 = '';                //物流单号
                this.form.order_no = '';                //合同单编号
                this.form.brand = 'all';                //品牌
                this.form.product_name = '';            //产品名称
                this.form.instock_no = '';              //入库单编号
                this.form.product_order_no = '';        //产品订货号
                this.form.product_model = '';           //产品型号
                this.form.receive_store = 'all';        //到货仓库
                this.form.datetime = '';                //时间
                this.orderField = '';                   //排序字段
                this.orderDirection = 'desc';           //排序顺序
                this.form.create_user_no = '';          //创建人

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
            //获取单据状态
            this.getStatus();
            //获取所有品牌
            this.getAllBrand();
            //获取所有到货仓库
            this.getAllStore();
            //入库单按钮显示逻辑
            //入库单按钮显示逻辑
            this.getBtn();
        },
        activated () {
            //获取列表数据
            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(4);
            }
        }
    };
</script>
