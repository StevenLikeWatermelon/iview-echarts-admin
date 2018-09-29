<!--
    author: 沈文杰
    email: 15805199474@163.com
    phone: 158051994714
 -->
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.invoice_no" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_no" placeholder="请输入客户编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.invoice_type" @on-change="search">
                                <Option v-for="status in invoinceTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.phone" placeholder="请输入手机号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.invoice_status"  placeholder="选择单据状态" @on-change="search">
                                <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.invoice_number" placeholder="请输入发票号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.ship_type"  placeholder="选择发货物流" @on-change="search">
                                <Option v-for="item in logisticsArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.ship_no" placeholder="请输入物流单号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择开票时间" :value='orderInfo.invoicetime' @on-change="invoicetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.service_man"  placeholder="选择客服" @on-change="search" filterable>
                            <Option v-for="status in service_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.sales_man"  placeholder="选择销售" @on-change="search" filterable>
                            <Option v-for="status in sales_list" :value="status.value" :key="status.value">{{ status.label }}</Option>
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
                <Col span="24" style="margin-bottom: 10px;" v-auth="exportButton">
                    <Button type="primary" @click="Export">导出</Button>
                    <span style="margin-left:25px;">开票总金额(含税):</span><span style="margin-left:15px;color: #FF0000;">{{totalPrice}}</span>
                    <span style="margin-left:25px;">勾选开票总金额(含税):</span><span style="margin-left:15px;color: #FF0000;">{{checkamount}}</span>
                </Col>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data"  ref="multipleTable" border style="text-align: center;width:100%" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"   max-height="570">
                    <el-table-column
                        type="selection"
                        width="55" fixed>
                    </el-table-column>
                    <el-table-column label="开票单编号"  show-overflow-tooltip width="160" fixed>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.invoice_no, 'service-xskpd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.invoice_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="invoice_time" label="开票时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customer_no" label="客户编号" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="lxr" label="联系人"    show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="sjhm" label="手机号码" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column label="开票类型" show-overflow-tooltip width="150">
                        <template slot-scope="scope">
                            <span> {{ invoinceTypeObj[scope.row.invoice_type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="invoice_total" label="开票总额(含税)"   width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="before_tax_money" label="开票总额(未税)" width="150"   show-overflow-tooltip></el-table-column>
                    <el-table-column label="单据状态">
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.invoice_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ship_name" label="发货方式"   show-overflow-tooltip  width="150"></el-table-column>
                    <el-table-column prop="invoice_ship_no" label="快递单号"   show-overflow-tooltip  width="150"></el-table-column>
                    <el-table-column prop="invoice_number" label="发票号码"    show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="note" label="备注" show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="server_no" label="客服" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.server_no }} / {{ scope.row.server_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seller_no" label="销售" width="150">
                        <template slot-scope="scope">
                            <span> {{ scope.row.seller_no }} / {{ scope.row.seller_name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus,apixskpdList,apiSendLogistic,apiInvoiceExportList,apiGetAllServiceMan,apiGetAllSalesman } from '@/config/getData';
    import { notempty, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                returnStatus: {},
                returnStatusArr: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ],
                invoinceTypeObj: {},
                invoinceTypeArr: [
                    {
                        label: '选择发票类型',
                        value: 'all'
                    }
                ],
                orderInfo: {
                    invoice_no: '',
                    customer_no: '',
                    customer_name: '',
                    invoice_type: 'all',
                    phone: '',
                    invoice_number: '',
                    invoice_status: 'all',
                    ship_type: 'all',
                    ship_no: '',
                    datetime:'',
                    invoicetime: '',
                    service_man: 'all',
                    sales_man: 'all',
                },
                logisticsArr: [
                    {
                        label: '选择发货物流',
                        value: 'all'
                    }
                ],
                orderData: {
                    title: [],
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                totalPrice: 0,
                checkamount: 0,
                multipleSelection: [],
                exportButton:'invoice_export',
                hasButton: manualCheck('invoice_export'),
                sales_list: [
                    {
                        label: '选择销售',
                        value: 'all'
                    }
                ],
                service_list: [
                    {
                        label: '选择客服',
                        value: 'all'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.checkamount = (+this.checkamount +   +row.invoice_total).toFixed(4);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.checkamount = (+this.checkamount  - +row.invoice_total).toFixed(4);

                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            Export() {
                apiInvoiceExportList(this, {
                    params: JSON.stringify(this.notempty({
                        invoice_no: this.orderInfo.invoice_no,
                        customer_no: this.orderInfo.customer_no,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        invoice_starttime: this.orderInfo.invoicetime[0],
                        invoice_endtime: this.orderInfo.invoicetime[1],
                        invoice_type: this.orderInfo.invoice_type === 'all' ? '' : this.orderInfo.invoice_type,
                        customer_name: this.orderInfo.customer_name,
                        phone: this.orderInfo.phone,
                        invoice_status: this.orderInfo.invoice_status === 'all' ? '' : this.orderInfo.invoice_status,
                        invoice_number: this.orderInfo.invoice_number,
                        ship_type: this.orderInfo.ship_type === 'all' ? '' : this.orderInfo.ship_type,
                        ship_no: this.orderInfo.ship_no,
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        //成功
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_invoice', 'fplx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_invoice;
                        let tmpObj = {};
                        for (let key in res.data.sell_invoice) {
                            if (res.data.sell_invoice.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_invoice[key]
                                };
                                this.returnStatusArr.push(tmpObj);
                            }
                        }
                        this.invoinceTypeObj = res.data.fplx;
                        for (let key in res.data.fplx) {
                            if (res.data.fplx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fplx[key]
                                };
                                this.invoinceTypeArr.push(tmpObj);
                            }
                        }
                    }
                });
                apiSendLogistic(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        for (let key in res.data) {
                            if (res.data.hasOwnProperty(key)) {
                                console.log(key);
                                tmpObj = {
                                    value: res.data[key].fhwlbh,
                                    label: res.data[key].fhwlmc
                                };
                                this.logisticsArr.push(tmpObj);
                            }
                        }
                    }
                });

                apiGetAllServiceMan(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.service_list.push(tmpObj);
                            }
                        }
                    }
                });
                apiGetAllSalesman(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};
                        for (let key in res.data.list) {
                            if (res.data.list.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: res.data.list[key]['user_no'],
                                    label: res.data.list[key]['user_name']
                                };
                                this.sales_list.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apixskpdList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        invoice_no: this.orderInfo.invoice_no,
                        customer_no: this.orderInfo.customer_no,
                        starttime: this.orderInfo.datetime[0],
                        endtime: this.orderInfo.datetime[1],
                        invoice_starttime: this.orderInfo.invoicetime[0],
                        invoice_endtime: this.orderInfo.invoicetime[1],
                        invoice_type: this.orderInfo.invoice_type === 'all' ? '' : this.orderInfo.invoice_type,
                        customer_name: this.orderInfo.customer_name,
                        phone: this.orderInfo.phone,
                        invoice_status: this.orderInfo.invoice_status === 'all' ? '' : this.orderInfo.invoice_status,
                        invoice_number: this.orderInfo.invoice_number,
                        ship_type: this.orderInfo.ship_type === 'all' ? '' : this.orderInfo.ship_type,
                        ship_no: this.orderInfo.ship_no,
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.totalPrice = res.data.total_price;
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
                this.orderInfo = {
                    invoice_no: '',
                    customer_no: '',
                    customer_name: '',
                    invoice_type: 'all',
                    phone: '',
                    invoice_number: '',
                    invoice_status: 'all',
                    ship_type: 'all',
                    ship_no: '',
                    datetime:'',
                    invoicetime: '',
                    service_man: 'all',
                    sales_man: 'all',
                };
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
            datetime (time) {
                this.orderInfo.datetime = time;
                this.search();
            },
            invoicetime (time) {
                this.orderInfo.invoicetime = time;
                this.search();
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
