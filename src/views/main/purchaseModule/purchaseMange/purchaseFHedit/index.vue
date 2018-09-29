<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  class="model-style">
                        <Row>
                        	<Col span="4">
                                <Select v-model="returnInfo.supplier_no" filterable @on-change="search">
                                    <Option v-for="item in supperList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="returnInfo.ship_status" @on-change="search">
                                    <Option v-for="item in shipStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                           <Input v-model="returnInfo.order_return_no" placeholder="请输入采购发货修改单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                           <Input v-model="returnInfo.buy_order_no" placeholder="请输入采购发货单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="returnInfo.keywords" placeholder="请输入创建人" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                           <DatePicker type="datetimerange" :value="returnInfo.datetime" placeholder="请选择创建时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
                            
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>                   
                    <el-table :data="returnList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                        <el-table-column label="采购发货修改单编号" width="150">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick({param:scope.row.ship_modify_no}, 'purchase_FHedit_detail')">{{scope.row.ship_modify_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gysmc" label="供应商" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="total_ship" label="发货总数量" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="total_modify" label="取消总数量" width="100" show-overflow-tooltip></el-table-column>
                         <el-table-column prop="total_ship_amount" label="发货总金额" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="total_modify_amount" label="取消总金额" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态" sortable="custom" width="100" prop="order_status">
                            <template slot-scope="scope">
                                <span>{{ shipStatusObj[scope.row.order_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" width="150" sortable="custom"  show-overflow-tooltip></el-table-column>
                        <el-table-column label="创建人" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ scope.row.create_user_no+'/'+ scope.row.create_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_order_no" label="采购发货单编号" width="150" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="handleClick({param:scope.row.order_ship_no}, 'purchase_manage_FH_detail')">{{scope.row.order_ship_no}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiPurchaseShipModifyList, apiAllStatus } from '@/config/getData';
    import { isInCreaters } from '@/config/mUtils';
    export default {
        name: 'purchase_FHedit_index',
        components: {
            pagination
        },
        data () {
            return {
                returnInfo: {
                    supplier_no: 'all',
                    order_return_no: '',
                    ship_status: 'all',
                    buy_order_no: '',
                    keywords:'',
                    datetime: []
                },
                returnList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                shipStatus: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                shipStatusObj: {},
                supperList: [
                    {
                        label: '选择供应商',
                        value: 'all'
                    }
                ],
                canAddReturn: false
            };
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
                apiAllStatus(this, {
                    type: JSON.stringify(['ship_modify_no'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.shipStatusObj = res.data.ship_modify_no;
                        let tmpObj = {};
                        for (let key in res.data.ship_modify_no) {
                            if (res.data.ship_modify_no.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.ship_modify_no[key]
                                };
                                this.shipStatus.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiPurchaseShipModifyList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier: this.returnInfo.supplier_no == 'all' ? '' : this.returnInfo.supplier_no,
                        status: this.returnInfo.ship_status == 'all' ? '' : this.returnInfo.ship_status,
                        ship_no: this.returnInfo.buy_order_no,
                        ship_modify_no: this.returnInfo.order_return_no,
                        create_user_no: this.returnInfo.keywords,
                        starttime: this.returnInfo.datetime[0],
                        endtime: this.returnInfo.datetime[1]
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.returnList = res.data.list;
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
                    }
                });
            },
            goToHTD (id) {
                util.openNewPage(this, 'purchase_manage_HT_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_HT_detail',
                    query: {
                        param: id
                    }
                });
            },            
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.returnInfo.supplier_no = 'all';
                this.returnInfo.ship_status = 'all';
                this.returnInfo.order_return_no = '';
                this.returnInfo.buy_order_no = '';
                this.returnInfo.arrive_store = 'all';
                this.returnInfo.keywords = '';
                this.returnInfo.datetime = [];
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
            changeDate (time) {
                this.returnInfo.datetime = time;
                this.search();
            },
            // getApplyModal() {
            //     purchaseManageTHModelName(this, {}).then(res => {
            //         if (res && res.status == 1) {
            //             isInCreaters(this, res.data).then(result => {
            //                 this.canAddReturn = result;
            //             });
            //         }
            //     });
            // }            
        },
        created () {
            // this.getApplyModal();
            this.getStatus();
        },
        activated() {
            this.getData();
        }
    };
</script>