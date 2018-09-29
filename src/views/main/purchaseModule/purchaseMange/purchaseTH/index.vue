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
                                <Select v-model="returnInfo.return_status" @on-change="search">
                                    <Option v-for="item in returnStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                           <Input v-model="returnInfo.order_return_no" placeholder="请输入采购退货单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
	                           <Input v-model="returnInfo.buy_order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="returnInfo.arrive_store" filterable @on-change="search">
                                    <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
	                           <DatePicker type="datetimerange" :value="returnInfo.datetime" placeholder="请选择" @on-change="changeDate" style="width:100%;"></DatePicker>
                            </Col>
                            <Col span="4">
                                <Input v-model="returnInfo.keywords" placeholder="请输入创建人" @on-enter="search"></Input>
                            </Col>
                            <!-- <Col span="4" style="text-align: center;margin-bottom:0;">
	                            <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
	                            <Button type="default" @click="reset">重置</Button>
                            </Col> -->
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                    <Row style="margin-bottom: 15px;"  v-if="canAddReturn">
                        <col span="24">
                            <Button type="primary" @click="addNew()">新增采购退货单</Button>
                        </col>
                    </Row>                    
                    <el-table :data="returnList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                        <el-table-column show-overflow-tooltip label="采购退货单编号">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.order_return_no)">{{scope.row.order_return_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="gysmc" label="供应商"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckmc" label="退货仓库"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_num" label="退货总数量"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_amount" label="退货总金额"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="note" label="退货原因"></el-table-column>
                        <el-table-column show-overflow-tooltip label="状态" sortable="custom" prop="return_status">
                            <template slot-scope="scope">
                                <span>{{ returnStatusObj[scope.row.return_status] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" ></el-table-column>
                        <el-table-column show-overflow-tooltip label="创建人">
                            <template slot-scope="scope">
                                <span>{{ scope.row.create_user_no+'/'+ scope.row.create_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_order_no" label="采购合同单编号">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
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
    import { purchaseManageReturnList, apiAllStatus, allStoreInfos, purchaseManageApplyModel, purchaseManageTHModelName } from '@/config/getData';
    import { isInCreaters } from '@/config/mUtils';
    export default {
        name: 'purchase_manage_TH_index',
        components: {
            pagination
        },
        data () {
            return {
                returnInfo: {
                    supplier_no: 'all',
                    order_return_no: '',
                    return_status: 'all',
                    buy_order_no: '',
                    arrive_store: 'all',
                    keywords:'',
                    datetime: []
                },
                returnList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                returnStatus: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                returnStatusObj: {},
                supperList: [
                    {
                        label: '选择供应商',
                        value: 'all'
                    }
                ],
                storageList: [
                    {
                        label: '选择退货仓库',
                        value: 'all'
                    }
                ],
                canAddReturn: false
            };
        },
        methods: {
            goToDetail (id) {
                util.openNewPage(this, 'purchase_manage_TH_detail', {
                	param: id
                });
                this.$router.push({
                    name: 'purchase_manage_TH_detail',
                    query: {
                    	param: id
                    }
                });
            },
            addNew () {
                util.openNewPage(this, 'purchase_manage_TH_add');
                this.$router.push({
                    name: 'purchase_manage_TH_add'
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['return_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatusObj = res.data.return_status;
                        let tmpObj = {};
                        for (let key in res.data.return_status) {
                            if (res.data.return_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.return_status[key]
                                };
                                this.returnStatus.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getAllStoreInfos () {
                allStoreInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.storageList.push({
                                value: item.ckbh,
                                label: item.ckmc
                            });
                        });
                    }
                });
            },
            getData () {
                purchaseManageReturnList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier_no: this.returnInfo.supplier_no == 'all' ? '' : this.returnInfo.supplier_no,
                        return_status: this.returnInfo.return_status == 'all' ? '' : this.returnInfo.return_status,
                        order_return_no: this.returnInfo.order_return_no,
                        buy_order_no: this.returnInfo.buy_order_no,
                        arrive_store: this.returnInfo.arrive_store === 'all' ? '' : this.returnInfo.arrive_store,
                        keywords: this.returnInfo.keywords,
                        start_time: this.returnInfo.datetime[0],
                        end_time: this.returnInfo.datetime[1]
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
                this.returnInfo.return_status = 'all';
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
            getApplyModal() {
                purchaseManageTHModelName(this, {}).then(res => {
                    if (res && res.status == 1) {
                        isInCreaters(this, res.data).then(result => {
                            this.canAddReturn = result;
                        });
                    }
                });
            }            
        },
        created () {
            this.getApplyModal();
            this.getAllStoreInfos();
            this.getStatus();
        },
        activated() {
            this.getData();
        }
    };
</script>