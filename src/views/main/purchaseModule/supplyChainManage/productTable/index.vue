<style>
    
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="orderInfo" class="model-style">
                        <Row>
                            <Col span="4">
                            <Select v-model="applyInfo.brand" filterable @on-change="search">
                                <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.series" placeholder="输入通用系列" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="applyInfo.supplyer" filterable @on-change="search">
                                <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Select v-model="applyInfo.type" @on-change="search">
                                <Option v-for="status in typeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                <el-table :data="applyList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="cpppmc" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="type" label="采购类型" sortable="custom" width="100">
                        <template slot-scope="scope">
                              <span>{{types[scope.row.type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商名称" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="discount_min" label="折扣下限" sortable="custom" width="100"></el-table-column>
                    <!-- <el-table-column label=" " width="30">
                        <template slot-scope="scope">
                              <span>~</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="discount_max" label="折扣上限" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="rebate" label="返点" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="leadtime" label="货期" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="note" label="备注"  min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="priority" label="优先级" sortable="custom" width="100"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
        </Row>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    import pagination from '../../../../common/pagination.vue';
    import { apiGetPurchaseStrategyList, apiAllStatus, operateAllBrandsList, apiGetPurchaseSupplierAll } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';
    export default {
        name: 'purchase_product_table',
        components: {
            pagination
        },
        data () {
            return {
                applyInfo: {
                    brand: 'all',
                    series: '',
                    product_name: '',
                    supplyer: 'all',
                    type: 'all'
                },
                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                brandArr: [
                    {
                        value: 'all',
                        label: '选择品牌'
                    }
                ],
                supperList: [
                    {
                        value: 'all',
                        label: '选择供应商'
                    }
                ],
                typeArr: [
                    {
                        value: 'all',
                        label: '选择采购类型'
                    }
                ],
                types: [],
                spinShow: true
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['supplier_buy_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.types = res.data.supplier_buy_type;
                        for (let key in res.data.supplier_buy_type) {
                            if (res.data.supplier_buy_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.supplier_buy_type[key]
                                };
                                this.typeArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getApi () {
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
            getData () {
                apiGetPurchaseStrategyList(this, {
                    params: JSON.stringify(this.notempty({
                        type: this.applyInfo.type == 'all' ? '' : this.applyInfo.type,
                        cpmcty: this.applyInfo.series,
                        cpmc: this.applyInfo.product_name,
                        brand_no: this.applyInfo.brand == 'all' ? '' : this.applyInfo.brand,
                        supplier_no: this.applyInfo.supplyer == 'all' ? '' : this.applyInfo.supplyer,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.applyList = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.applyInfo = {
                    brand: 'all',
                    series: '',
                    product_name: '',
                    supplyer: 'all',
                    type: 'all'
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
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
        },
        created () {
            this.getStatus();
            this.getApi();
        },
        activated() {
            this.getData();
        }
    };
</script>