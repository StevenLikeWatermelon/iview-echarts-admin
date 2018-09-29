<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.instock_no" placeholder="请输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.brand"  placeholder="请选择品牌" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_name" placeholder="产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_model" placeholder="产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_order_no" placeholder="产品订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.stock"  placeholder="请选择仓库" filterable @on-change="search">
                            <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.instock_status"  placeholder="选择单据状态" @on-change="search">
                            <Option v-for="status in returnStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.return_no" placeholder="销售退货单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.sell_order_no" placeholder="销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
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
                <el-table :data="orderData.data" border stripe style="text-align: center" @sort-change="manualSort"  max-height="570">
                    <el-table-column label="退货入库单编号" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.instock_no, 'service-thrkd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.instock_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customer_name" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contact_user" label="联系人" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contact_method" label="联系方式" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_order_no" label="产品订货号" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_price" label="入库单价" show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="return_num" label="退货数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_num" label="入库数量" show-overflow-tooltip></el-table-column>
                    <el-table-column label="入库金额" show-overflow-tooltip width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.instock_price * scope.row.instock_num | toDecimal }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="store_name" label="入库仓库"  min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area_name" label="入库库区" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seat_name" label="入库库位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="instock_status" label="单据状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{ returnStatus[scope.row.instock_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="return_no" label="销售退货单编号" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.return_no, 'service-xsthd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.return_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sell_order_no" label="销售合同单编号"  min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.sell_order_no, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span></span>
                        </template>
                    </el-table-column>
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
    import { apiAllStatus,apithrkdMxList,operateAllBrandsList,apiGetCommonStockList,apiGetAllServiceMan,apiGetAllSalesman } from '@/config/getData';
    import { notempty } from '@/config/mUtils';

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
                brandArr: [
                    {
                        label: '选择品牌',
                        value: 'all'
                    }
                ],
                stockArr: [
                    {
                        value: 'all',
                        label: '选择仓库'
                    }
                ],
                orderInfo: {
                    instock_no: '',
                    customer_name: '',
                    return_no: '',
                    sell_order_no: '',
                    instock_status: 'all',
                    datetime: [],
                    brand:'all',
                    product_name:'',
                    product_model:'',
                    product_order_no:'',
                    stock:'all',
                    service_man: 'all',
                    sales_man: 'all',
                },
                orderData: {
                    title: [],
                    data: []
                },
                orderField: 'create_time',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
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
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_instock_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_instock_status;
                        let tmpObj = {};
                        for (let key in res.data.sell_instock_status) {
                            if (res.data.sell_instock_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.sell_instock_status[key]
                                };
                                this.returnStatusArr.push(tmpObj);
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
                apithrkdMxList(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        instock_no: this.orderInfo.instock_no,
                        customer_name: this.orderInfo.customer_name,
                        brand_no: this.orderInfo.brand === 'all' ? '' : this.orderInfo.brand,
                        product_name:this.orderInfo.product_name,
                        product_model:this.orderInfo.product_model,
                        product_order_no:this.orderInfo.product_order_no,
                        store_no: this.orderInfo.stock === 'all' ? '' : this.orderInfo.stock,
                        instock_status: this.orderInfo.instock_status === 'all' ? '' : this.orderInfo.instock_status,
                        return_no: this.orderInfo.return_no,
                        sell_order_no: this.orderInfo.sell_order_no,
                        date_from: this.orderInfo.datetime[0],
                        date_to: this.orderInfo.datetime[1],
                        service_man: this.orderInfo.service_man === 'all' ? '' : this.orderInfo.service_man,
                        sales_man: this.orderInfo.sales_man === 'all' ? '' : this.orderInfo.sales_man,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    instock_no: '',
                    customer_name: '',
                    return_no: '',
                    sell_order_no: '',
                    instock_status: 'all',
                    datetime: [],
                    brand:'all',
                    product_name:'',
                    product_model:'',
                    product_order_no:'',
                    store_no:'all',
                    service_man: 'all',
                    sales_man: 'all',
                };
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
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
