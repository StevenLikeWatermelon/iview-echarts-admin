<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120" :model="form" ref="form" :rules="formRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="盘亏仓库：" style="margin:0;" prop="stock">
                            <Select v-model="form.stock"  placeholder="请选择" @on-change="storeChange" style="width:250px;" filterable>
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;" prop="note">
                            <Input type="textarea" v-model="form.note" style="width:400px;"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    盘亏出库商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>盘亏商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">盘亏商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney| toFiexedFour }}</em></span>
                        <span style="float:right;color: rgb(45, 140, 240);cursor:pointer;" @click="addGoods" v-if="!edit_goods">添加商品</span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort">
                        <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" width="80"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="can_inventory_num" label="可盘亏数量" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="inventory_num" label="盘亏数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.inventory_num" @on-blur="numChange(scope.row.inventory_num, scope.row.can_inventory_num, scope.$index);" @on-change="getCount();"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="inventory_price" label="盘亏单价" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="total_amount" label="盘亏金额" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.inventory_price * scope.row.inventory_num | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="盘亏库区" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="盘亏库位" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <Input v-model="scope.row.note"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作"  v-if="!edit_goods">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteRow(scope.$index, actTable.data)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loading"  @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
        <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT">
            <h3 slot="header">添加商品</h3>
            <div>
                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="addForm" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="addForm.brand"  placeholder="请选择" @on-change="search">
                                        <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="addForm.area"  @on-change="areaChange">
                                        <Option v-for="status in areaArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.order" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Select v-model="addForm.seat" :disabled="isDisable" @on-change="search">
                                        <Option v-for="status in seatArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="addForm.xhbh" placeholder="请输入商品型号编号" @on-enter="search"></Input>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="24">
                    <Card>
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="addSure">确定</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort2"  @selection-change="handleSelectionChange">
                            <el-table-column show-overflow-tooltip
                                    type="selection"
                                    width="55" :selectable="canSelect" fixed>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model_no" label="商品型号编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="gysmc" label="供应商" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="area_name" label="所属库区" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位" ></el-table-column>
                            <el-table-column show-overflow-tooltip prop="change_num" label="库存数量" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="requisition_num" label="库存金额" sortable="custom">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.buy_price * scope.row.change_num | toDecimal }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="operator_type" label="来源类型" sortable="custom">
                                <template slot-scope="scope">
                                    <span> {{ readyTypeArr[scope.row.operator_type] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="note" label="备注"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="sell_order_no" label="采购合同单编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_shipstock_no" label="采购发货单编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_instock_no" label="采购入库单编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="check_instock_no" label="盘盈入库单编号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="operator_name" label="创建人">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.operator_no  }} / {{ scope.row.operator_name }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="default" @click="goodsCancel">取消</Button>
                <!--<Button type="primary" @click="ToHTD">确定</Button>-->
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiGetAllStorageList, operateAllBrandsList, apiGetAllAreaList, apiGetAllSeatList, apiGetStockInventoryLossReady, apiGetStockInventoryLossAdd  } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                loading: false,
                form: {
                    stock: '',
                    note: ''
                },
                bhd_id: this.$route.query.param,
                actTable: {
                    data: []
                },
                orderField: '',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: 0,
                goodsAllMoney: 0,
                bulktext: '',
                stockArr: [],
                formRules: {
                    stock: [
                        { required: true, message: '请选择盘亏仓库', trigger: 'on-change' }
                    ],
                    note: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ]
                },
                storeList: [],
                back_store_name: '',
                searchData: [],
                goodsModal: false,
                addForm: {
                    brand: 'all',
                    name: '',
                    area: 'all',
                    order: '',
                    model: '',
                    seat: 'all',
                    xhbh: ''
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                brandArr: [
                    {
                        value: 'all',
                        label: '请选择品牌'
                    }
                ],
                areaArr: [
                    {
                        value: 'all',
                        label: '请选择库区'
                    }
                ],
                seatArr: [
                    {
                        value: 'all',
                        label: '请选择库位'
                    }
                ],
                isDisable: true,
                readyTypeArr: [],
                readyStatusArr: []
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiGetAllStorageList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.store_name;
                            item.value = item.store_no;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            getData () {
                //基本信息
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.cpppmc;
                            item.value = item.cpppbh;
                            this.brandArr.push(item);
                        });
                    }
                });
            },
            storeChange (val) {
                /*获取库区列表*/
                this.areaArr = [{
                    value: 'all',
                    label: '请选择库区'
                }];
                apiGetAllAreaList(this, {
                    store_no: val,
                    type: 1
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.forEach(item => {
                            item.label = item.area_name;
                            item.value = item.area_no;
                            this.areaArr.push(item);
                        });
                    }
                });
            },
            areaChange (val) {
                this.seatArr = [
                    {
                        value: 'all',
                        label: '请选择库位'
                    }
                ];
                if (val === 'all') {
                    this.isDisable = true;
                    this.addForm.seat = 'all';
                    this.search();
                } else {
                    this.isDisable = false;
                    apiGetAllSeatList(this, {
                        store_no: this.form.stock,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.seatArr.push(item);
                            });
                            this.addForm.seat = 'all';
                            this.search();
                        }
                    });
                }
            },
            /*添加商品*/
            getGoods () {
                let idArr = [];
                for (let i in this.actTable.data) {
                    idArr.push(this.actTable.data[i].id);
                }
                apiGetStockInventoryLossReady(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.addForm.brand == 'all' ? '' : this.addForm.brand,
                        product_model_no: this.addForm.xhbh,
                        product_name: this.addForm.name,
                        product_model: this.addForm.model,
                        product_order_no: this.addForm.order,
                        store_no: this.form.stock,
                        area_no: this.addForm.area == 'all' ? '' : this.addForm.area,
                        seat_no: this.addForm.seat == 'all' ? '' : this.addForm.seat,
                        num_filter: '',
                        except_stock_id: idArr,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.readyTypeArr = res.data.stock_from_type;
                        this.readyStatusArr = res.data.stock_type;
                    }
                });
            },
            addGoods () {
                if (this.form.stock === '' || !this.form.stock) {
                    this.$Message.error('请先选择盘亏仓库');
                } else {
                    this.goodsModal = true;
                    this.addForm = {
                        brand: 'all',
                        name: '',
                        area: 'all',
                        order: '',
                        model: '',
                        seat: 'all',
                        xhbh: ''
                    };
                    this.getGoods();
                }
            },
            goodsCancel () {
                this.goodsModal = false;
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            addSure () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.actTable.data.push({
                            id: 0,
                            area_name: this.multipleSelection[i].area_name,
                            area_no: this.multipleSelection[i].area_no,
                            brand_name: this.multipleSelection[i].cpppmc,
                            brand_no: this.multipleSelection[i].cpppbh,
                            can_inventory_num: this.multipleSelection[i].change_num,
                            inventory_num: '',
                            inventory_price: this.multipleSelection[i].buy_price,
                            product_model: this.multipleSelection[i].cpxh,
                            product_model_no: this.multipleSelection[i].product_model_no,
                            product_name: this.multipleSelection[i].cpmc,
                            product_order_no: this.multipleSelection[i].cpdhh,
                            rel_detail_id: this.multipleSelection[i].stock_id,
                            seat_name: this.multipleSelection[i].seat_name,
                            seat_no: this.multipleSelection[i].seat_no,
                            product_unit: this.multipleSelection[i].product_unit,
                            note: '',
                        });
                    }
//                    for (let i in this.goodsAddArr) {
//                        this.actTable.data.push(this.multipleSelection[i]);
//                    }
                    this.getCount();
                    this.goodsModal = false;
                }
            },
            getCount () {
                let allNum = 0;
                let allAmount = parseFloat(0).toFixed(4);
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === ' ') {
                        this.actTable.data[i].inventory_num = 0;
                    }
                    if (!this.actTable.data[i].inventory_price || this.actTable.data[i].inventory_price === ' ') {
                        this.actTable.data[i].inventory_price = 0.00;
                    }
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].inventory_num);
                    allAmount = (+allAmount  + this.actTable.data[i].inventory_price * this.actTable.data[i].inventory_num).toFixed(4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
            },
            save () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let goodsNewArr = [];
                        var reg3 = /^\d+\.?(\d{1,3})?$/;
                        var reg4 = /^\d+\.?(\d{1,4})?$/;
                        for (let i in this.actTable.data) {
                            let n = parseInt(i) + parseInt(1);
                            if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === '') {
                                this.$Message.error('第' + n + '行的盘亏数量不能为空');
                                return false;
                            } else if (!/^\d+$/.test(this.actTable.data[i].inventory_num)) {
                                this.$Message.error('第' + n + '行的盘亏数量必须是大于等于0的整数');
                                return false;
                            } else if (parseInt(this.actTable.data[i].inventory_num) > parseInt(this.actTable.data[i].can_inventory_num) ) {
                                this.$Message.error('第' + n + '行的盘亏数量不能大于可盘亏数量');
                                return false;
                            } else {
                                goodsNewArr.push({
                                    id: this.actTable.data[i].id,
                                    seat_no: this.actTable.data[i].seat_no,
                                    inventory_num: this.actTable.data[i].inventory_num,
                                    inventory_price: this.actTable.data[i].inventory_price,
                                    product_model_no: this.actTable.data[i].product_model_no,
                                    brand_no: this.actTable.data[i].brand_no,
                                    brand_name: this.actTable.data[i].brand_name,
                                    product_name: this.actTable.data[i].product_name,
                                    product_model: this.actTable.data[i].product_model,
                                    product_order_no: this.actTable.data[i].product_order_no,
                                    rel_detail_id: this.actTable.data[i].rel_detail_id,
                                    product_unit: this.actTable.data[i].product_unit,
                                    note: this.actTable.data[i].note,
                                });
                            }
                        }
                        if (goodsNewArr.length != 0) {
                            this.loading = true;
                            apiGetStockInventoryLossAdd(this, {
                                params: JSON.stringify({
                                    store_no: this.form.stock,
                                    note: this.form.note
                                }),
                                detail: JSON.stringify(goodsNewArr),
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
                                    closeCurrentPage(this);
                                    this.handleClick({param: res.data.inventory_no, fromAdd: 'add'}, 'treasury-loss-detail');
                                    this.$Message.success('添加成功');
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            this.$Message.error('请添加盘亏出库商品');
                        }
                    }
                });
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            numChange (val, canNum, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的盘亏数量必须是大于等于0的整数');
                } else if (parseInt(val) > parseInt(canNum)) {
                    this.$Message.error('第' + n + '行的盘亏数量不能大于可盘亏数量');

                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            search () {
                this.currentPage = 1;
                this.getGoods();
            },
            reset () {
                this.addForm.brand = 'all';
                this.addForm.name = '';
                this.addForm.area = 'all';
                this.addForm.order = '';
                this.addForm.model = '';
                this.addForm.seat = 'all';
                this.addForm.xhbh = '';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getGoods();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getGoods();
            },
            manualSort2 (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getGoods();
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
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
