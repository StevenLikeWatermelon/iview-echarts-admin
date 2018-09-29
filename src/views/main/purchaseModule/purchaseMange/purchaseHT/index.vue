<style>
    .pointer-hover:hover{
        color: rgb(45, 140, 240);
        cursor: pointer;
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
                        <Select v-model="form.applyer"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.dj_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in djStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.fk_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in zfStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.htd_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.stock"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.state"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in fhStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.create_user" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.order_attach_no" placeholder="输入纸质合同编号" @on-enter="search"></Input>
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
                    <Button type="primary" @click="handleClick({param: 'add'}, 'purchase_manage_HT_add')" v-if="is_current">新增采购合同单</Button>
                    <Button type="primary" @click="toExport" v-auth="HTlist_export" :class="{'margin-left-10': is_current}">导出</Button>
                    <span style="padding-left: 20px;">采购总金额：</span><span style="color: #cf0012;">{{amount}}</span>
                    <span style="padding-left: 20px;">勾选采购金额：</span><span style="color: #cf0012;">{{checkamount}}</span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column show-overflow-tooltip
                            type="selection"
                            width="55" :selectable="canSelect" fixed>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="采购合同单编号" prop="khbh" fixed width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.buy_order_no }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="gysmc" label="供应商" width="120" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="ckmc" label="到货仓库 " width="150" ></el-table-column> 
                    <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                   <el-table-column show-overflow-tooltip prop="total_amount" label="采购金额" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_ship_num" label="已发货数量" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="has_instock_num" label="已入库数量" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip label="单据状态" prop="order_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ djStatus[scope.row.order_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="付款状态" prop="pay_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ zfStatus[scope.row.pay_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="发货状态" prop="ship_status" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ fhStatus[scope.row.ship_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="创建人" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.create_user_no }}<span v-show="scope.row.create_user_no !=''">/</span>{{ scope.row.create_user_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="order_attach_no" label="纸质合同单号" min-width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseHtHomeList, apiGetCommonStockList, operateAllBrandsList, apiWaitShipList, apiGetgenerateInvoice, apiInMainName, purchaseManageSPModel,apiExportPurchaseHtHomeList } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        // name: 'purchase_manage_HT_index',
        data () {
            return {
                form: {
                    applyer: 'all',
                    dj_status: 'all',
                    fk_status: 'all',
                    htd_bh: '',
                    stock: 'all',
                    state: 'all',
                    // from_djbh: '',
                    create_user:'',
                    datetime: [],
                    // datetime1: [],
                    order_attach_no:''
                },
                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],      //生成发货单需要参数
                ship_list: '',              //发货单传递参数
                multipleCustomer: [],

                orderField: '',
                orderDirection: 'desc',
                supperList: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                djStatus: [],
                djStatusArr: [
                    {
                        value: 'all',
                        label: '选择单据状态'
                    }
                ],
                zfStatus: [],
                zfStatusArr: [
                    {
                        value: 'all',
                        label: '选择付款状态'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择到货仓库'
                    }
                ],
                fhStatus: [],
                fhStatusArr: [
                    {
                        value: 'all',
                        label: '选择发货状态'
                    }
                ],
                brandArr: [
                    {
                        label: '选择品牌',
                        value: 'all'
                    }
                ],
                is_current: '',
                // is_sp: false,
                is_tp: false,
                start_time: '',
                start_time1: '',
                end_time: '',
                end_time1: '',
                buySpecial: 'buySpecialRole',
                HTlist_export:'HTlist_export',
                checkamount:'0.0000',
                amount:'0.0000',
            };
        },
        components: {
            pagination
        },
        methods: {
            toExport(){
                apiExportPurchaseHtHomeList(this, {
                    params: JSON.stringify(this.notempty({
                        order_status: this.form.dj_status == 'all' ? '' : this.form.dj_status,
                        pay_status: this.form.fk_status == 'all' ? '' : this.form.fk_status,
                        ship_status: this.form.state == 'all' ? '' : this.form.state,
                        buy_order_no: this.form.htd_no,
                        order_attach_no: this.form.order_attach_no,
                        supplier_no: this.form.applyer == 'all' ? '' : this.form.applyer,
                        store_no: this.form.stock == 'all' ? '' : this.form.stock,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        create_user: this.form.create_user,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
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
                this.multipleSelectionamount = [];
            },
            canSelect (row) {
                return (row.order_status == 2);
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                console.log(this.multipleSelection);
                console.log(row.id);
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.checkamount = this.add(this.checkamount, row.total_amount, 4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);

                    this.checkamount = this.subtract(this.checkamount, row.total_amount, 4);

                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
                for (let i in this.multipleSelection) {
                    for (let j in this.orderData.data) {
                        if (this.multipleSelection[i] == this.orderData.data[j].id && this.orderData.data[j].order_status != 2) {
                            this.multipleSelection.splice(i, 1);
                            this.checkamount = this.subtract(this.checkamount, this.orderData.data[j].total_amount, 4);
                        }
                    }
                }
            },
            // toFHD () {
            //     let tmp = [];
            //     if (this.multipleSelection.length == 0) {
            //         this.$Message.error('请选择单据');
            //     } else {
            //         let ship_list = '';
            //         ship_list = this.multipleSelection.join(',');
            //         apiWaitShipList(this,{
            //             ids: JSON.stringify(ship_list)
            //         }).then(res => {
            //             if (res && res.status == 1) {
            //                 this.handleClick({param: ship_list}, 'purchase_manage_HT_toFHD');
            //             } else {
            //                 this.$Message.error(res.message);
            //             }
            //         });
            //     }
            // },
            toTPD () {
                let tmp = [];
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let list = {};
                    list = JSON.stringify({
                        order_invoice_type: 1,
                        from_order_no: 0,
                        from_order: '',
                        order_detail_id: this.multipleSelection
                    });
                    apiGetgenerateInvoice(this, {
                        params: list
                    }).then(res => {
                        if (res && res.status == 1){
                            this.handleClick({param: list}, 'purchase_manage_HT_toTPD');
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_order_status', 'buy_order_pay_status', 'buy_order_ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        /*单据状态*/
                        this.djStatus = res.data.buy_order_status;
                        for (let key in res.data.buy_order_status) {
                            if (res.data.buy_order_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_status[key]
                                };
                                this.djStatusArr.push(tmpObj);
                            }
                        }
                        /*支付状态*/
                        this.zfStatus = res.data.buy_order_pay_status;
                        for (let key in res.data.buy_order_pay_status) {
                            if (res.data.buy_order_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_pay_status[key]
                                };
                                this.zfStatusArr.push(tmpObj);
                            }
                        }
                        /*发货状态*/
                        this.fhStatus = res.data.buy_order_ship_status;
                        for (let key in res.data.buy_order_ship_status) {
                            if (res.data.buy_order_ship_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_order_ship_status[key]
                                };
                                this.fhStatusArr.push(tmpObj);
                            }
                        }

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
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
                        });
                    }
                });
            },
            getData () {
                apiGetPurchaseHtHomeList(this, {
                    params: JSON.stringify(this.notempty({
                        order_status: this.form.dj_status == 'all' ? '' : this.form.dj_status,
                        pay_status: this.form.fk_status == 'all' ? '' : this.form.fk_status,
                        ship_status: this.form.state == 'all' ? '' : this.form.state,
                        buy_order_no: this.form.htd_no,
                        order_attach_no: this.form.order_attach_no,
                        supplier_no: this.form.applyer == 'all' ? '' : this.form.applyer,
                        store_no: this.form.stock == 'all' ? '' : this.form.stock,
                        create_time: !this.start_time ? '' : this.start_time + '~' +  this.end_time,
                        create_user: this.form.create_user,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.amount = res.data.amount;
                        this.totalnum = res.data.totalCount;
                        this.supperList = [
                            {
                                value: 'all',
                                label: '选择供应商'
                            }
                        ];
                        res.data.suppliers.forEach(item => {
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
                    }
                });
            },
            search () {
                this.multipleSelection = [];
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.dj_status = 'all';
                this.form.fk_status = 'all';
                this.form.state = 'all';
                this.form.htd_no = '';
                this.form.applyer = 'all';
                this.form.order_attach_no = '',
                this.form.stock = 'all';
                this.form.datetime = [];
                // this.form.datetime1 = [];
                this.start_time = '';
                this.end_time = '';
                // this.start_time1 = '';
                // this.end_time1 = '';
                this.form.create_user = '';
                this.multipleSelection = [];
                this.search();
            },
            datetime (time) {
                this.form.datetime = time;
                this.start_time = this.form.datetime[0];
                this.end_time = this.form.datetime[1];
                this.search();
            },
            // datetime1 (time) {
            //     this.form.datetime1 = time;
            //     this.start_time1 = this.form.datetime1[0];
            //     this.end_time1 = this.form.datetime1[1];
            //     this.search();
            // },
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
        },
        activated () {
            // this.getData();
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
