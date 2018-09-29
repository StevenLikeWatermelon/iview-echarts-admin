<style>
    .speciial-select .ivu-select-dropdown {
        top: -66px !important;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="form.brand"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.supplier"  placeholder="请选择" filterable @on-change="search">
                            <!--<Option value="all">全部</Option>-->
                            <Option v-for="status in supplierArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.type"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in FromTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.from_djbh" placeholder="输入来源单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.buyer"  placeholder="请选择" filterable  @on-change="search">
                            <Option v-for="status in buyerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.creater" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.sell_order_no" placeholder="输入销售合同单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.rel_order_type" placeholder="选择" @on-change="search">
                            <Option v-for="status in relOrderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </FormItem>
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
                    <Button type="primary" @click="ToHTD" v-if="is_current">生成采购合同单</Button>
                    <Button type="primary" @click="reAllot" v-show="is_allot" v-auth="buttonLimit">采购员重分配</Button>
                    <Button type="primary" :class="is_allot ? 'margin-left-10': ''" v-auth="readybuyExport" @click="exportList">导出</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort" ref="multipleTable" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" ></el-table-column>
                    <el-table-column show-overflow-tooltip label="供应商" min-width="240">
                        <template slot-scope="scope">
                            <Select v-model="scope.row.supplier_no" placeholder="请选择" @on-change="supplierChange(scope.row.id, scope.row.supplier_no,scope.$index)" transfer>
                                <Option v-for="item in scope.row.supplier_list" :key="item.supplier_no" :value="item.supplier_no">{{ item.supplier_name }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="供应商库存" prop="supplier_stock" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip label="供应商价格" prop="supplier_price" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip label="产品面价" prop="product_origin_price" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ (+scope.row.product_origin_price).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="requisition_num" label="申请数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="requisition_price" label="申请单价" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="buyed_num" label="已采购数量" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="ready_buy_num" label="待采购数量" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_type" label="来源类型" sortable="custom" width="100">
                        <template slot-scope="scope">
                            <span> {{fromType[scope.row.order_type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="来源单据编号 " width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.requisition_no }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="货期 " width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.product_leadtime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="创建人" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="采购员" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.buy_user_no }}<span v-show="scope.row.buy_user_no !=''">/</span>{{ scope.row.buy_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="销售合同单编号" width="120">
                        <template slot-scope="scope">
                            <span> {{scope.row.sell_order_no }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rel_order_type" label="销售合同单单据类型" min-width="150">
                        <template slot-scope="scope">
                            <span> {{relOrderStatus[scope.row.rel_order_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="purchase_supplier_name" label="咨询供应商" width="120" v-if="param === 'add' ? false : true"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="now_note" label="采购备注" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="note" label="客服备注" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="purchase_discount" label="咨询折扣" width="150" v-if="param === 'add' ? false : true"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Modal v-model="ReAllotModel" title="采购员重分配" @on-ok="sureAction" :width="400">
            <Form :label-width="120" :model="buyerForm" ref="buyerForm" :rules="buyerRules">
                <Row>
                    <Col span="24">
                    <FormItem label="重分配的采购员：" prop="buyer">
                        <Select v-model="buyerForm.buyer" placeholder="请选择">
                            <Option v-for="status in buyerList" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="default" @click="delAction">取消</Button>
                <Button type="primary" @click="sureAction">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseReadybuyList, apiGetPurchaseReadybuyListExport, operateAllBrandsList, allpersonInfos, apiGetPurchaseWorkerAssign, apiInMainName, apiGetPurchaseSupplierAll, getSupplierStock } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                form: {
                    applyer: '',
                    type: 'all',
                    dj_status: '',
                    fk_status: '',
                    htd_bh: '',
                    stock: '',
                    state: '',
                    from_djbh: '',
                    brand: 'all',
                    name: '',
                    fhd_no: '',
                    order: '',
                    model: '',
                    creater: '',
                    buyer: 'all',
                    datetime: '',
                    supplier: 'all',
                    sell_order_no:'',
                    rel_order_type: 'all',
                },
                param: this.$route.query.param,
                is_allot: false,
                orderData: {
                    data: [
                        {
                            khbh: '12313'
                        }
                    ]
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                orderField: '',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                brandArr: [
                    {
                        label: '选择品牌',
                        value: 'all'
                    }
                ],
                fromType: ['其他'],
                FromTypeArr: [
                    {
                        label: '选择来源类型',
                        value: 'all'
                    }
                ],
                brand_ids: [],
                ReAllotModel: false,
                buyerForm: {
                    buyer: ''
                },
                buyerRules: {
                    buyer: [
                        { required: true, message: '请选择本次重分配的采购员', trigger: 'on-change' },
                    ]
                },
                buyerArr: [
                    {
                        label: '选择采购员',
                        value: 'all'
                    }
                ],
                buyerList: [],
                is_current: '',
                supplierArr: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                supplierChoosed: [],
                buy_discount_choosed: [],
                buttonLimit: 'purchase_ready_buy_redist',
                readybuyExport:'purchase_manage_ready_buy_export',
                relOrderStatus: '',
                relOrderStatusArr: [
                    {
                        label: '选择销售合同单单据类型',
                        value: 'all'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getLimit () {
                /*是否合同单审批流可创建人*/
                apiInMainName(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let modelName = res.data;
                        /*是否可创建执行人*/
                        isInCreaters(this, modelName).then(result => {
                            this.is_current = result;
                        });
                    }
                });
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            selectOne(selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.supplierChoosed.push(row.supplier_no);
                    this.buy_discount_choosed.push(row.purchase_discount);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.supplierChoosed.splice(index, 1);
                    this.buy_discount_choosed.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            supplierChange (id, supplierNo, index) {
                getSupplierStock(this, {
                    params: JSON.stringify(this.notempty({
                        product_model_no: this.orderData.data[index].product_model_no,
                        supplier_no: supplierNo,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data[index].supplier_stock = res.data.supplier_stock;
                        this.orderData.data[index].supplier_price = res.data.supplier_price;
                    }
                });
                for (let i in this.multipleSelection) {
                    if (this.multipleSelection[i] === id) {
                        this.supplierChoosed[i] = supplierNo;
                    }
                }
            },
            ToHTD () {
                this.brand_ids = [];
                let supplierSelection = '';
                for (let i in this.multipleSelection) {
                    this.brand_ids.push(this.multipleSelection[i]);
                }
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                        if (this.supplierChoosed.length > 2) {
                            for (let i=0; i<this.supplierChoosed.length-1;i++) {
                                if (this.supplierChoosed[i] === '' || this.supplierChoosed[i+1] === '') {
                                    this.$Message.error('勾选的商品必须选择采购供应商');
                                    return false;
                                } else if (this.supplierChoosed[i] !== this.supplierChoosed[i+1]) {
                                    this.$Message.error('勾选的商品必须为相同的采购供应商！');
                                    return false;
                                }
                            }
                        }
                        if (this.supplierChoosed.length == 2) {
                            if (this.supplierChoosed[0] === '' || this.supplierChoosed[1] === '') {
                                this.$Message.error('勾选的商品必须选择采购供应商');
                                return false;
                            } else if (this.supplierChoosed[0] !== this.supplierChoosed[1]) {
                                this.$Message.error('勾选的商品必须为相同的采购供应商！');
                                return false;
                            }
                        }
                        if (this.supplierChoosed.length == 1) {
                            if (this.supplierChoosed[0] === '') {
                                this.$Message.error('勾选的商品必须选择采购供应商');
                                return false;
                            }
                        }
                        supplierSelection = this.supplierChoosed[0];
                        this.handleClick({ids: this.brand_ids, supplier_no: supplierSelection, discountChoosed: this.buy_discount_choosed}, 'purchase_manage_BH_HTD');
                } 
            },
            reAllot () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    this.ReAllotModel = true;
                }
            },
            delAction () {
                this.ReAllotModel = false;
            },
            sureAction () {
                this.$refs['buyerForm'].validate((valid) => {
                    if (valid) {
                        this.brand_ids = [];
                        for (let i in this.multipleSelection) {
                            this.brand_ids.push(this.multipleSelection[i]);
                        }
                        apiGetPurchaseWorkerAssign(this, {
                            ids: JSON.stringify(this.brand_ids),
                            buyer_no: this.buyerForm.buyer
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.ReAllotModel = false;
                                this.getData();
                                this.multipleSelection = [];
                                this.supplierChoosed = [];
                                this.buy_discount_choosed = [];
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_order_from','sell_rel_order_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*来源类型*/
                        for (let i in res.data.buy_order_from) {
                            this.fromType.push(res.data.buy_order_from[i]);
                        }
                        for (let key in res.data.buy_order_from) {
                            if (res.data.buy_order_from.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_from[key]
                                };
                                this.FromTypeArr.push(tmpObj);
                            }
                        }
                        this.relOrderStatus = res.data.sell_rel_order_type;
                        for (let key in res.data.sell_rel_order_type) {
                            if (res.data.sell_rel_order_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_rel_order_type[key]
                                };
                                this.relOrderStatusArr.push(tmpObj);
                            }
                        }

                    }
                });
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
                        });
                    }
                });
                allpersonInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.buyerList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.user_no;
                            item.label = item.user_name;
                            this.buyerArr.push(item);
                        });
                    }
                });
                apiGetPurchaseSupplierAll(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            res.data.forEach(item => {
                                item.value = item.supplier_no;
                                item.label = item.supplier_name;
                                this.supplierArr.push(item);
                            });
                        }
                    }
                });
            },

            /*导出*/
            exportList () {
                apiGetPurchaseReadybuyListExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        brand_no: this.form.brand == 'all' ? '' : this.form.brand,
                        product_order_no: this.form.order,
                        product_model: this.form.model,
                        requisition_no: this.form.from_djbh,
                        sell_order_no:this.form.sell_order_no,
                        product_name: this.form.name,
                        date_from: this.form.datetime[0],
                        date_to: this.form.datetime[1],
                        create_user: this.form.creater,
                        buy_user_no: this.form.buyer == 'all' ? '' : this.form.buyer,
                        order_type: this.form.type == 'all' ? '' : this.form.type,
                        supplier_no: this.form.supplier == 'all' ? '' : this.form.supplier,
                        rel_order_type: this.form.rel_order_type == 'all' ? '' : this.form.rel_order_type,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },

            getData () {
                apiGetPurchaseReadybuyList(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.form.brand == 'all' ? '' : this.form.brand,
                        product_order_no: this.form.order,
                        product_model: this.form.model,
                        requisition_no: this.form.from_djbh,
                        sell_order_no: this.form.sell_order_no,
                        product_name: this.form.name,
                        date_from: this.form.datetime[0],
                        date_to: this.form.datetime[1],
                        create_user: this.form.creater,
                        buy_user_no: this.form.buyer == 'all' ? '' : this.form.buyer,
                        order_type: this.form.type == 'all' ? '' : this.form.type,
                        supplier_no: this.form.supplier == 'all' ? '' : this.form.supplier,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        rel_order_type: this.form.rel_order_type == 'all' ? '' : this.form.rel_order_type,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                        if (this.param === 'add') {
                            this.is_allot = false;
                        } else {
                            this.is_allot = true;
                        }
                        this.getLimit();
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.brand = 'all';
                this.form.name = '';
                this.form.order = '';
                this.form.model = '';
                this.form.from_djbh = '';
                this.form.sell_order_no = '';
                this.form.type = 'all';
                this.form.creater = '';
                this.form.buyer = 'all';
                this.form.supplier = 'all';
                this.form.datetime = [];
                this.multipleSelection = [];
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
            this.getStatus();
            this.getData();
        }
    };
</script>
