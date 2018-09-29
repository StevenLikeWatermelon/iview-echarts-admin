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
                            <Input v-model="orderInfo.direct_order_no" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_no" placeholder="输入客户编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.customer_name" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.create_user" placeholder="请输入创建人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.createTime' @on-change="getCreateTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择审批时间" :value='orderInfo.approveTime' @on-change="getApproveTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择生效时间" :value='orderInfo.activeTime' @on-change="getActiveTime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.direct_status"  placeholder="选择单据状态" @on-change="search">
                                <Option v-for="(val, index) in orderStatusArr" :value="val.value" :key="val.value">{{ val.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.cpppbh"  placeholder="选择品牌" @on-change="search">
                                <Option v-for="(val, index) in brandList" :value="val.cpppbh" :key="val.cpppbh">{{ val.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.product" placeholder="输入订货号/产品型号/产品名称/产品型号编号" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" @click="Export" v-if="canAdd">新增定向价格</Button>
                    <Button type="primary" @click="Export" :class="{'margin-left-10': canAdd}" v-if="canExport">导出</Button>
                </Col>
                <el-table :data="dataList"  ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"   max-height="570">
                    <!-- <el-table-column
                        type="selection"
                        width="55" fixed>
                    </el-table-column> -->
                    <el-table-column label="定向价格单据编号"  show-overflow-tooltip width="180" fixed>
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.direct_order_no, 'orienteering-price-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.direct_order_no}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer_no" label="客户编号" show-overflow-tooltip sortable="custom" width="160"></el-table-column>
                    <el-table-column prop="khmc" width="200" label="客户名称" show-overflow-tooltip sortable="custom"></el-table-column>
                    <el-table-column prop="validite_time" label="生效时间" show-overflow-tooltip width="320"></el-table-column>
                    <el-table-column prop="product_model_no" label="产品型号编号" show-overflow-tooltip width="150" sortable="custom"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip width="150" sortable="custom"></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" show-overflow-tooltip width="150" sortable="custom"></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" show-overflow-tooltip width="150" sortable="custom"></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" show-overflow-tooltip width="150" sortable="custom"></el-table-column>
                    <el-table-column prop="jldw" label="计量单位" show-overflow-tooltip width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="cpxhmj" label="产品面价" show-overflow-tooltip width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="direct_discount" label="定向折扣" show-overflow-tooltip width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="direct_status" label="状态" show-overflow-tooltip sortable="custom" width="110">
                        <template slot-scope="scope">
                            <span> {{ orderStatusObj[scope.row.direct_status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="create_user" label="创建人" width="150"></el-table-column>
                    <el-table-column prop="verify_time" label="审批时间" width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import {apiAllStatus, apiAllBrands, orienteeringPriceListDetailApi, orienteeringPriceListDetailExportApi } from '@/config/getData';
    import { notempty, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                orderInfo: {
                    direct_order_no: '',
                    customer_no: '',
                    customer_name: '',
                    create_user: '',
                    createTime: [],
                    approveTime: [],
                    activeTime: [],
                    direct_status: 'all',
                    cpppbh: 'all',
                    product: '',
                },
                canExport: manualCheck('orienteering-price-export-button-auth'),
                canAdd: false,
                orderStatusObj: {},
                orderStatusArr: [{
                    value: 'all',
                    label: '选择单据状态'
                }],
                brandList: [{
                    cpppbh: 'all',
                    cpppmc: '选择品牌'
                }],
                dataList: [],
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                totalPrice: 0,
                multipleSelection: []
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
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.dataList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            Export() {
                orienteeringPriceListDetailExportApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        direct_order_no: this.orderInfo.direct_order_no,
                        customer_no: this.orderInfo.customer_no,
                        customer_name: this.orderInfo.customer_name,
                        create_user: this.orderInfo.create_user,
                        product: this.orderInfo.product,

                        create_time_start: this.orderInfo.createTime[0],
                        create_time_end: this.orderInfo.createTime[1],
                        verify_time_start: this.orderInfo.approveTime[0],
                        verify_time_end: this.orderInfo.approveTime[1],
                        validite_time_start: this.orderInfo.activeTime[0],
                        validite_time_end: this.orderInfo.activeTime[1],
                        direct_status: this.orderInfo.direct_status === 'all' ? '' : this.orderInfo.direct_status,
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                    }))
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
                    type: JSON.stringify(['direct_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatusObj = res.data.direct_status;
                        let tmpObj = {}; 
                        for (let key in res.data.direct_status) {
                            if (res.data.direct_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.direct_status[key]
                                };
                                this.orderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                //获取所有产品品牌
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.brandList = this.brandList.concat(res.data);
                    }
                });
            },
            getData () {
                orienteeringPriceListDetailApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        direct_order_no: this.orderInfo.direct_order_no,
                        customer_no: this.orderInfo.customer_no,
                        customer_name: this.orderInfo.customer_name,
                        create_user: this.orderInfo.create_user,
                        product: this.orderInfo.product,

                        create_time_start: this.orderInfo.createTime[0],
                        create_time_end: this.orderInfo.createTime[1],
                        verify_time_start: this.orderInfo.approveTime[0],
                        verify_time_end: this.orderInfo.approveTime[1],
                        validite_time_start: this.orderInfo.activeTime[0],
                        validite_time_end: this.orderInfo.activeTime[1],
                        direct_status: this.orderInfo.direct_status === 'all' ? '' : this.orderInfo.direct_status,
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList= res.data.list;
                        this.totalnum = res.data.totalCount;

                        this.$nextTick(() => {
                            this.dataList.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
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
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            getCreateTime (time) {
                this.orderInfo.createTime = time;
                this.search();
            },
            getApproveTime (time) {
                this.orderInfo.approveTime = time;
                this.search();
            },
            getActiveTime (time) {
                this.orderInfo.activeTime = time;
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
