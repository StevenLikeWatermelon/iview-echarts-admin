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
                            <Input v-model="applyInfo.gysbh" placeholder="输入供应商编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.gysmc" placeholder="输入供应商名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.sjhm" placeholder="输入联系人手机号码" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="applyInfo.shzt" @on-change="search">
                                <Option v-for="status in applyStatus" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <DatePicker type="datetimerange" :value="applyInfo.datetime" placeholder="请选择" @on-change="getDateRange" style="width:100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
                <Card>
                    <Row style="margin-bottom: 15px;">
                        <col span="24">
                            <Button type="primary" style="margin-right:20px;" @click="goToAdd()" v-auth="addButton">添加</Button>
                            <!-- <Button type="primary" @click="deleteApply()">删除</Button> -->
                        </col>
                    </Row>
                    <el-table :row-class-name="tableRowClassName" :data="applyList" border style="text-align: center" @sort-change="manualSort"  @selection-change="handleSelectionChange" max-height="570">
                        <!-- <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column> -->
                        <el-table-column prop="gysbh" label="供应商编号" width="140">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.gysbh)">{{scope.row.gysbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gysmc" label="供应商名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="lxr" label="联系人" width="120"></el-table-column>
                        <el-table-column prop="sjhm" label="联系人手机号码" width="150"></el-table-column>
                        <el-table-column prop="gyslxmc" label="供应商类型" width="120"></el-table-column>
                        <el-table-column prop="gyssx" label="供应商属性" width="120">
                            <template slot-scope="scope">
                                <span>{{applyAttrObj[scope.row.gyssx]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shzt" label="状态" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span>{{ statusArr[scope.row.shzt] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="czyg" label="创建人" width="120"></el-table-column>
                        <el-table-column prop="barq" label="创建时间"  sortable="custom" width="160"></el-table-column>
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
    </div>
</template>

<script>
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    import pagination from '../../../../common/pagination.vue';
    import { purchaseApplyList, apiAllStatus, purchaseManageApplyDelete, purchaseManageApplyModel} from '@/config/getData';
    import { isInCreaters } from '@/config/mUtils';
    export default {
        name: 'purchase_apply_index',
        components: {
            pagination
        },
        data () {
            return {
                addButton: 'apply_list_add_button',
                showDelete: false,
                applyInfo: {
                    gysbh: '',
                    gysmc: '',
                    sjhm: '',
                    shzt: 'all',
                    datetime: [],

                },
                applyStatus: [],
                statusArr: [],
                selectedItems: [],
                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'barq',
                orderDirection: 'desc',
                applyAttrObj: {}
            };
        },
        methods: {
            canSelect (row) {
                return (row.shzt == 2);
            },
            handleSelectionChange(selection) {
                this.selectedItems = [];
                selection.forEach(item => {
                    this.selectedItems.push(item.gysbh);
                });
            },
            deleteApply () {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!')
                    return;
                }
                this.showDelete = true;
            },
            confirmDelete() {
                purchaseManageApplyDelete(this, {
                    gysbhs: JSON.stringify(this.selectedItems)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
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
                util.openNewPage(this, 'purchase_apply_add');
                this.$router.push({
                    name: 'purchase_apply_add'
                });
            },
            goToDetail (id) {
                util.openNewPage(this, 'purchase_apply_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_apply_detail',
                    query: {
                        param: id
                    }
                });
            },
            getDateRange (time) {
                this.applyInfo.datetime = time;
                this.search();
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['gys_shzt', 'gys_gyssx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.statusArr = res.data.gys_shzt;
                        this.applyStatus = [{
                            value: 'all',
                            label: '选择状态'
                        }];
                        res.data.gys_shzt.forEach((item, index) => {
                            this.applyStatus.push({
                                value: index,
                                label: item
                            });
                        });

                        this.applyAttrObj = res.data.gys_gyssx;
                        this.getData();
                    }
                });
            },            
            getData () {
                purchaseApplyList(this, {
                    params: JSON.stringify({
                        gysbh: this.applyInfo.gysbh,
                        gysmc: this.applyInfo.gysmc,
                        sjhm: this.applyInfo.sjhm,
                        shzt: this.applyInfo.shzt == 'all' ? '' : this.applyInfo.shzt,
                        date_from: this.applyInfo.datetime[0],
                        date_to: this.applyInfo.datetime[1],
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.applyList = res.data.list;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.applyInfo.gysbh = '';
                this.applyInfo.gysmc = '';
                this.applyInfo.sjhm = '';
                this.applyInfo.shzt = 'all';
                this.applyInfo.datetime = [];
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
        activated() {
            this.getStatus();
        }
    };
</script>