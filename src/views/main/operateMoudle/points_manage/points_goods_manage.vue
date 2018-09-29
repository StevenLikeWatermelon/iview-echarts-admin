<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="orderInfo" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="searchInfo.integral_product_no" placeholder="输入积分商品编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchInfo.integral_product_name" placeholder="输入积分商品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="searchInfo.integral_product_status" @on-change="search">
                                    <Option v-for="(status, index) in pointsStatusArr" :value="status.value" :key="index">{{ status.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Select v-model="searchInfo.integral_product_type" @on-change="search">
                                    <Option v-for="(status, index) in pointsTypeArr" :value="status.value" :key="index">{{ status.label }}</Option>
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
                    <Row style="margin-bottom: 10px;">
                        <col span="24">
                            <Button v-show="maxSort != 'initData'" type="primary" style="margin-right:20px;" @click="goToAdd()">新增商品</Button>
                            <Button type="primary" style="margin-right:20px;" @click="patachUpdate('1')">批量上架</Button>
                            <Button type="primary" style="margin-right:20px;" @click="patachUpdate('0')">批量下架</Button>
                            <Button type="primary" style="margin-right:20px;" @click="patachDelete()">批量删除</Button>
                        </col>
                    </Row>
                    <el-table :row-class-name="tableRowClassName" :data="dataList" border style="text-align: center" @sort-change="manualSort"  @selection-change="handleSelectionChange" max-height="570">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="integral_product_no" label="积分商品编号" width="140" sortable="custom">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.integral_product_no)">{{scope.row.integral_product_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="integral_product_name" label="积分商品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="integral_product_unit" label="计量单位" width="100"></el-table-column>
                        <el-table-column prop="integral_product_num" label="库存数量" width="100"  sortable="custom"></el-table-column>
                        <el-table-column prop="redeem_integral" label="兑换积分" width="100"  sortable="custom"></el-table-column>
                        <el-table-column prop="sort" label="排序" width="100"  sortable="custom"></el-table-column>
                        <el-table-column prop="integral_product_status" label="积分商品状态" width="120">
                            <template slot-scope="scope">
                                <span>{{pointsStatusObj[scope.row.integral_product_status]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
        <Modal
            v-model="showDelete"
            title="确认删除"
            @on-ok="confirmDelete"
            @on-cancel="cancelDelete">
            <p>确认删除选中供应商?</p>
        </Modal>  
        <Modal
            v-model="showUpdate"
            :title="'确认' + updateTipInfo + '架'"
            @on-ok="confirmUpdate"
            @on-cancel="cancelUpdate">
            <p>确认{{updateTipInfo}}架勾选的积分商品?</p>
        </Modal>        
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus, operatePointsGoodsListApi, operatePointsGoodsPatchUpdateApi, operatePointsGoodsPatchDeleteApi} from '@/config/getData';
    import {  } from '@/config/mUtils';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                showDelete: false,
                showUpdate: false,
                updateTipInfo: '',
                maxSort: 'initData',
                searchInfo: {
                    integral_product_no: '',
                    integral_product_name: '',
                    integral_product_type: 'all',
                    integral_product_status: 'all',
                },

                pointsStatusObj: {},
                pointsStatusArr: [],

                pointsTypeObj: {},
                pointsTypeArr: [],

                selectedItems: [],
                dataList: [],

                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
            };
        },
        methods: {
            patachUpdate(type) {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!')
                    return;
                }
                this.updateTipInfo = type == '0' ? '下' : '上';
                this.showUpdate = true;
            },
            confirmUpdate() {
                operatePointsGoodsPatchUpdateApi(this, {
                    params: JSON.stringify({
                        integral_product_status: this.updateTipInfo == '上' ? '1' : '0',
                        integral_product_nos: this.selectedItems
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.message && res.message.length > 0) {
                            let str = '';
                            res.message.forEach(item => {
                                str += item;
                            });
                            this.$Modal.info({
                                title: '批量操作结果',
                                content: `<pre>${str}</pre>`
                            });
                        }
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            cancelUpdate() {
                this.showUpdate = false;
            },
            handleSelectionChange(selection) {
                this.selectedItems = [];
                selection.forEach(item => {
                    this.selectedItems.push(item.integral_product_no);
                });
            },
            patachDelete () {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!')
                    return;
                }
                this.showDelete = true;
            },
            confirmDelete() {
                operatePointsGoodsPatchDeleteApi(this, {
                    params: JSON.stringify({
                        integral_product_nos: this.selectedItems
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.message && res.message.length > 0) {
                            let str = '';
                            res.message.forEach(item => {
                                str += item;
                            });
                            this.$Modal.info({
                                title: '批量删除结果',
                                content: `<pre>${str}</pre>`
                            });
                        }
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            cancelDelete() {
                this.showDelete = false;
            },
            goToAdd () {
                let query = {
                    maxSort: this.maxSort
                }
                util.openNewPage(this, 'points_goods_manage_add', query);
                this.$router.push({
                    name: 'points_goods_manage_add',
                    query
                });
            },
            goToDetail (id) {
                util.openNewPage(this, 'points_goods_manage_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'points_goods_manage_detail',
                    query: {
                        param: id
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['integral_product_type', 'integral_product_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpObj = {};

                        // 积分商品状态
                        this.pointsStatusObj = res.data.integral_product_status;
                        this.pointsStatusArr = [{
                            value: 'all',
                            label: '选择积分商品状态'
                        }];
                        for (let key in res.data.integral_product_status) {
                            if (res.data.integral_product_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.integral_product_status[key]
                                };
                                this.pointsStatusArr.push(tmpObj);
                            }
                        }

                        // 积分商品类型
                        this.pointsTypeObj = res.data.integral_product_type;
                        this.pointsTypeArr = [{
                            value: 'all',
                            label: '选择积分商品类型'
                        }];
                        for (let key in res.data.integral_product_type) {
                            if (res.data.integral_product_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.integral_product_type[key]
                                };
                                this.pointsTypeArr.push(tmpObj);
                            }
                        }

                        this.getData();
                    }
                });
            },            
            getData () {
                operatePointsGoodsListApi(this, {
                    params: JSON.stringify({
                        integral_product_no: this.searchInfo.integral_product_no,
                        integral_product_name: this.searchInfo.integral_product_name,
                        integral_product_type: this.searchInfo.integral_product_type == 'all' ? '' : this.searchInfo.integral_product_type,
                        integral_product_status: this.searchInfo.integral_product_status == 'all' ? '' : this.searchInfo.integral_product_status,

                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.dataList = res.data.list;
                        this.maxSort = res.data.max_sort;
                    }
                });
            },
            search () {
                this.currentPage = 1;
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
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
        },
        created() {
            this.getStatus();
        }
    };
</script>