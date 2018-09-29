<template>
    <div style="position: relative" class="diy-opcity xsqgd-detail">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="form.brand"  placeholder="请选择品牌" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                         <Input v-model="form.model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.supplier"  placeholder="请选择" filterable @on-change="search">
                            <Option value="all">选择供应商</Option>
                            <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.create_user" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10" v-auth="sureComplete">
                    <Col span="24">
                    <Button type="primary" @click="sureAction">确认完成</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort" ref="multipleTable" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column label="销售合同单编号" prop="djbh" width="120"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" ></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="jldw" label="计量单位 " ></el-table-column>
                    <el-table-column label="供应商" min-width="240">
                        <template slot-scope="scope">
                            <Select v-model="scope.row.supplier_no" @on-change="supplierChange(scope.row.id, scope.row.supplier_no,scope.$index)" transfer>
                                <Option v-for="item in scope.row.supplier_list" :key="item.supplier_no" :value="item.supplier_no">{{ item.supplier_name }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商库存" prop="supplier_stock" min-width="100"></el-table-column>
                    <el-table-column label="供应商价格" prop="supplier_price" min-width="100"></el-table-column>
                    <el-table-column label="产品面价" prop="cpmj" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column label="合同折扣" prop="htzk" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column label="合同单价" prop="htdj" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column label="合同数量" prop="htsl" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column label="合同金额" min-width="100">
                         <template slot-scope="scope">
                            <span>{{scope.row.htdj * scope.row.htsl | toDecimal }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="货期">
                        <template slot-scope="scope">
                            <Input v-model="scope.row.leadtime" @on-blur="leadChange(scope.row.id, scope.row.leadtime)"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购折扣" min-width="80">
                        <template slot-scope="scope">
                            <Input v-model="scope.row.discount" @on-blur="discountChange(scope.row.id, scope.row.discount, scope.$index)"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <Input v-model="scope.row.note" @on-blur="noteChange(scope.row.id, scope.row.note)"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column label="创建人" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.czyg_ygbh }}<span v-show="scope.row.czyg_ygbh">/</span>{{ scope.row.czyg }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <!-- 弹框公用 -->
        <Modal v-model='publicModal' :mask-closable=false :width="320" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">勾选的内容确认填写完成？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="publicCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="publicSure">确定</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { operateAllBrandsList, apiGetPurchaseToConfirmOrder, apiGetPurchaseSupplierAll, apiGetPurchaseConfirmOrder, getSupplierStock } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        name: 'purchase_tobe_confirm',
        data () {
            return {
                form: {
                    brand: 'all',
                    name: '',
                    htd_no: '',
                    order: '',
                    model: '',
                    supplier: 'all',
                    datetime: '',
                    create_user: ''
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                orderField: '',
                orderDirection: 'desc',
                backStatus: '',
                backStatusArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                brandArr: [
                    {
                        label: '选择品牌',
                        value: 'all'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                brand_ids: [],
                spinShow: true,
                supperList: [],
                publicModal: false,
                loadding: false,
                listPostArr: [],
                sureComplete: 'purchase_tobe_confirm_complete'
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
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            selectOne(selection, row) {
                let tmp = [];
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row))) {
                    this.multipleSelection.push(row);
                }
                if (!row.checked && this.multipleSelection.includes(row)) {
                    let index = this.multipleSelection.indexOf(row);
                    this.multipleSelection.splice(index, 1);
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
                    if (this.multipleSelection[i].id === id) {
                        this.multipleSelection[i].supplier_no = supplierNo;
                    }
                }
            },
            leadChange (id, leadtime) {
                for (let i in this.multipleSelection) {
                    if (this.multipleSelection[i].id === id) {
                        this.multipleSelection[i].leadtime = leadtime;
                    }
                }
            },
            discountChange (id, val, index) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                let n = parseInt(index) + parseInt(1);
                if (!reg.test(val)) {
                    this.$Message.error('第' + n +'行的采购折扣最多保留3位小数');
                } else if (parseInt(val * 1000) > parseInt(10000)) {
                    this.$Message.error('第' + n +'行的采购折扣不可大于10');
                }
                for (let i in this.multipleSelection) {
                    if (this.multipleSelection[i].id === id) {
                        this.multipleSelection[i].discount = val;
                    }
                }
            },
            noteChange (id, note) {
                for (let i in this.multipleSelection) {
                    if (this.multipleSelection[i].id === id) {
                        this.multipleSelection[i].note = note;
                    }
                }
            },
            getList () {
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
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
                                this.supperList.push(item);
                            });
                        }
                    }
                });
            },
            sureAction () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let listTmp = [];
                    var reg = /^\d+\.?(\d{1,3})?$/;
                    for (let i in this.multipleSelection) {
                        // let n = parseInt(i) + parseInt(1);
                        if (!this.multipleSelection[i].supplier_no) {
                             this.$Message.error('选中的供应商不能为空');
                            return false;
                        } else if (this.multipleSelection[i].discount) {
                            if (!reg.test(this.multipleSelection[i].discount)) {
                                 this.$Message.error('选中的采购折扣最多保留3位小数');
                                 return false;
                            } else if (parseInt(this.multipleSelection[i].discount * 1000) > parseInt(10000)) {
                                 this.$Message.error('选中的采购折扣不可大于10');
                                return false;
                            }
                         } else if (!this.multipleSelection[i].leadtime || this.multipleSelection[i].leadtime === '') {
                            this.$Message.error('选中的货期不能为空');
                            return false;
                        }
                        listTmp.push({
                            id: this.multipleSelection[i].id,
                            hthq: this.multipleSelection[i].leadtime,
                            htbz: this.multipleSelection[i].note,
                            purchase_discount: this.multipleSelection[i].discount,
                            purchase_supplier_no: this.multipleSelection[i].supplier_no
                        });                  
                     }
                    this.publicModal = true;
                    this.listPostArr = listTmp;
                    // this.multipleSelection = [];                   
                }
            },
            getData () {
                apiGetPurchaseToConfirmOrder(this, {
                    params: JSON.stringify(this.notempty({
                        cpppbh: this.form.brand === 'all' ? '' : this.form.brand,
                        cpmc: this.form.name,
                        xshtd_djbh: this.form.htd_no,
                        cpxh: this.form.model,
                        cpdhh: this.form.order,
                        supplier_no: this.form.supplier === 'all' ? '' : this.form.supplier,
                        create_no: this.form.create_user,
                        start_time: this.form.datetime[0],
                        end_time: this.form.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i in res.data.list) {
                            res.data.list[i].leadtime = '',
                            res.data.list[i].discount = '',
                            res.data.list[i].note = '';
                        }
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form = {
                    brand: 'all',
                    name: '',
                    htd_no: '',
                    order: '',
                    model: '',
                    supplier: 'all',
                    datetime: [],
                    create_user: ''
                };
                this.multipleSelection = [];
                this.search();
            },
            publicCancel () {
                this.publicModal = false;
                this.loadding = false;
            },
            publicSure () {
                this.loadding = true;
                apiGetPurchaseConfirmOrder(this, {
                         list: JSON.stringify(this.listPostArr)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.multipleSelection = [];
                            this.publicModal = false;
                            this.loadding = false;
                         } else {
                             this.$Message.error(res.message);
                        }
                });
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
            this.getList();
        },
        activated () {
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
