<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="form.bhd_no" placeholder="输入采购备货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.brand"  placeholder="请选择品牌" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.stock"  placeholder="请选择备货仓库" filterable @on-change="search">
                            <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.status"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in backStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.create_user" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.buy_user_no"  placeholder="请选择采购员" filterable @on-change="search">
                            <Option value="all">选择采购员</Option>
                            <Option v-for="status in buy_user_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
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
                <Row class="margin-bottom-10" v-if="is_current">
                    <Col span="24">
                    <Button type="primary" @click="handleClick('', 'purchase_manage_BH_add')">新增采购备货单</Button>
                    <Button type="primary" @click="toHTD" class="margin-left-10" v-auth="false">生成采购合同单</Button>
                    <Button type="primary" class="margin-left-10" v-auth="manageBHExport" @click="exportList">导出</Button>
                    <span style="padding-left: 20px;">备货总金额：</span><span style="color: #cf0012;">{{amount}}</span>
                    <span style="padding-left: 20px;">勾选备货金额：</span><span style="color: #cf0012;">{{checkamount}}</span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort" ref="multipleTable" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" :selectable="canSelect" fixed ><!--v-if="is_current"-->
                    </el-table-column>
                    <el-table-column label="采购备货单编号" prop="khbh" min-width="120">
                        <template slot-scope="scope">
                            <span @click="handleClick({param: scope.row.requisition_no}, 'purchase_manage_BH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.requisition_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand_name" label="品牌"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_order_no" label="订货号" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位 "></el-table-column>
                    <el-table-column prop="requisition_store_name" label="备货仓库 " width="150"  show-overflow-tooltip></el-table-column>
                    <el-table-column label="产品面价" prop="product_origin_price" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ (+scope.row.product_origin_price).toFixed(2)  }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备货折扣" prop="product_discount" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ scope.row.product_discount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备货单价" prop="requisition_price" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ scope.row.requisition_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备货数量" prop="requisition_num"></el-table-column>
                    <el-table-column label="备货金额" prop="requisition_amount" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ scope.row.requisition_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyed_num" label="已采购数量" min-width="100"></el-table-column>
                    <el-table-column prop="requisition_leadtime" label="备货货期(天)" width="120"></el-table-column>
                    <el-table-column prop="order_note" label="备注" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column label="状态" prop="requisition_status" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ backStatus[scope.row.requisition_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column label="创建人" min-width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购员" min-width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.buy_user_no }}<span v-show="scope.row.buy_user_no !=''">/</span>{{ scope.row.buy_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buy_order_nos" label="采购合同单编号" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.buy_order_nos.length == 0"></div>
                            <el-popover trigger="hover" placement="top" v-else>
                                <p v-for="val in scope.row.buy_order_nos"><span class="pointer-hover" @click="handleClick({param: val}, 'purchase_manage_HT_detail')">{{ val }}</span></p>
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
    import { apiAllStatus, operateAllBrandsList, apiGetPurchaseBhList,apiGetPurchaseBhListExport, apiGetCommonStockList, apiInBackupName, allpersonInfos } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                buy_user_list: [],
                form: {
                    bhd_no: '',
                    brand: 'all',
                    name: '',
                    htd_no: '',
                    order: '',
                    model: '',
                    stock: 'all',
                    datetime: '',
                    status: 'all',
                    create_user: '',
                    buy_user_no: 'all',
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
                        label: '选择状态',
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
                        label: '选择备货仓库'
                    }
                ],
                brand_ids: [],
                is_current: '',
                manageBHExport:'purchase_manage_BH_export',
                amount: '0.0000',
                checkamount:'0.0000',
            };
        },
        components: {
            pagination
        },
        methods: {
            getBuys () {
                allpersonInfos(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.buy_user_list = res.data.list;
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
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
            },
            canSelect (row) {
                return (row.requisition_status == 2 && parseInt(row.requisition_num) > parseInt(row.buyed_num));
            },
            selectOne(selection, row) {
                if(row.requisition_status == 2 && parseInt(row.requisition_num) > parseInt(row.buyed_num)) {
                    let tmp = [];
                    if (!!selection && typeof selection != 'number') {
                        row.checked = !row.checked;
                    } else {
                        row.checked = !!selection;
                    }
                    if (row.checked && !(this.multipleSelection.includes(row.id))) {
                        this.multipleSelection.push(row.id);
                        this.checkamount = this.add(this.checkamount, row.requisition_amount, 4);
                        console.log(this.checkamount, '222');
                    }
                    if (!row.checked && this.multipleSelection.includes(row.id)) {
                        let index = this.multipleSelection.indexOf(row.id);
                        this.multipleSelection.splice(index, 1);
                        this.checkamount = this.subtract(this.checkamount, row.requisition_amount, 4);
                        console.log(this.checkamount, '111');
                    }
                }else{
                    return false;
                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
                for (let i in this.multipleSelection) {
                    for (let j in this.orderData.data) {
                        if (this.multipleSelection[i] == this.orderData.data[j].id && (this.orderData.data[j].requisition_status != 2 || parseInt(this.orderData.data[j].requisition_num) <= parseInt(this.orderData.data[j].buyed_num))) {
                            this.multipleSelection.splice(i, 1);
                        }
                    }
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.backStatus = res.data.requisition_status;
                        let tmpObj = {};
                        this.backStatusArr = [ {
                            label: '选择状态',
                            value: 'all'
                        }];
                        for (let key in res.data.requisition_status) {
                            if (res.data.requisition_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.requisition_status[key]
                                };
                                this.backStatusArr.push(tmpObj);
                            }
                        }
                        /*是否为备货单可创建审批人 */
                        apiInBackupName(this, {
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                let modelName = res.data;
                                /*是否可创建执行人*/
                                isInCreaters(this, modelName, 1).then(result => {
                                    this.is_current = result;
                                });
                            }
                        });
                    }
                });
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
            toHTD () {
                this.brand_ids = [];
                for (let i in this.multipleSelection) {
                    this.brand_ids.push(this.multipleSelection[i]);
                }
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let argu = { ids: this.brand_ids };
                    util.openNewPage(this, 'purchase_manage_BH_HTD');
                    this.$router.push({
                        name: 'purchase_manage_BH_HTD',
                        query: argu
                    });
                    this.multipleSelection = [];
                }
            },


            /*导出*/
            exportList () {
                apiGetPurchaseBhListExport(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: 999999,
                        pageNum: 0,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        requisition_no: this.form.bhd_no,
                        brand_name: this.form.brand === 'all' ? '' : this.form.brand,
                        product_name: this.form.name,
                        buy_order_no: this.form.htd_no,
                        product_order_no: this.form.order,
                        product_model: this.form.model,
                        requisition_store_no: this.form.stock === 'all' ? '' : this.form.stock,
                        requisition_status: this.form.status === 'all' ? '' : this.form.status,
                        create_user: this.form.create_user,
                        buy_user_no: this.form.buy_user_no === 'all' ? '' : this.form.buy_user_no,
                        date_from: this.form.datetime[0],
                        date_to: this.form.datetime[1],
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            getData () {
                apiGetPurchaseBhList(this, {
                    params: JSON.stringify(this.notempty({
                        requisition_no: this.form.bhd_no,
                        brand_name: this.form.brand === 'all' ? '' : this.form.brand,
                        product_name: this.form.name,
                        buy_order_no: this.form.htd_no,
                        product_order_no: this.form.order,
                        product_model: this.form.model,
                        requisition_store_no: this.form.stock === 'all' ? '' : this.form.stock,
                        requisition_status: this.form.status === 'all' ? '' : this.form.status,
                        create_user: this.form.create_user,
                        buy_user_no: this.form.buy_user_no === 'all' ? '' : this.form.buy_user_no,
                        date_from: this.form.datetime[0],
                        date_to: this.form.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.amount = res.data.amount;
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
                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }
                        this.getStatus();
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.bhd_no = '';
                this.form.brand = 'all';
                this.form.name = '';
                this.form.htd_no = '';
                this.form.order = '';
                this.form.model = '';
                this.form.create_user = '';
                this.form.buy_user_no = 'all';
                this.form.stock = 'all';
                this.form.status = 'all';
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
            this.getBuys();
            this.getList();
            this.getData();
        },

    };
</script>
