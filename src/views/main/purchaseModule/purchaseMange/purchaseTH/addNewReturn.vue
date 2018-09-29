<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10" v-if="!isTmp">
            <col span="24">
                <Card>
                    <Form :label-width="120">
                        <Row>
                            <Col span="6">
                            <FormItem label="供应商：">
                                <Select v-model="returnInfo.supplier_no" filterable>
                                    <Option v-for="item in applyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>                            
                            <Col span="6">
                            <FormItem label="品牌：">
                                <Select v-model="returnInfo.cpppbh" filterable>
                                    <Option v-for="item in brandsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="产品名称：">
                                <Input v-model="returnInfo.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="采购合同单编号：">
                                    <Input v-model="returnInfo.buy_order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="所属仓库：">
                                <Select v-model="returnInfo.store_no" @on-change="storeChange" filterable>
                                    <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="所属库区：">
                                <Select v-model="returnInfo.area_no"  :disabled="isDisableA"  @on-change="areaChange" filterable>
                                    <Option v-for="item in AreaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="所属库位：">
                                <Select v-model="returnInfo.seat_no" :disabled="isDisableB" filterable>
                                    <Option v-for="item in SeatList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="订货号：">
                                    <Input v-model="returnInfo.cpdhh" placeholder="请输入订货号" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="产品型号：">
                                    <Input v-model="returnInfo.cpxh" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6" style="text-align: center;margin-bottom:0;">
                                <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                                <Button type="default" @click="reset">重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10" v-if="isTmp">
            <col span="24">
                <Card>
                    <Form :label-width="120"  class="model-style">
                        <Row>
                            <Col span="4">
                                <Select v-model="returnInfo.cpppbh" filterable @on-change="search">
                                    <Option v-for="item in brandsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="returnInfo.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="returnInfo.cpdhh" placeholder="请输入订货号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="returnInfo.cpxh" placeholder="请输入产品型号" @on-enter="search"></Input>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>        
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="navicon-round"></Icon>
                        可退商品列表
                    </p>
                    <Row style="margin-bottom: 15px;" v-if="!isTmp">
                        <col span="24">
                            <Button type="primary" @click="confirmReturn()" :loading="loadding">确认退货</Button>
                        </col>
                    </Row> 
                    <Row style="margin-bottom: 15px;" v-if="isTmp">
                        <col span="24">
                            <Button type="primary" @click="confirmAdd()">确认添加</Button>
                        </col>
                    </Row>   
                    <el-table :row-class-name="tableRowClassName" :data="returnList" border style="text-align: center" ref="multipleTable" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll">
                        <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="gysmc" label="供应商名称" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号"  min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jldw" label="计量单位" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxhmj" label="产品面价"  sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价"  sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="change_num" label="库存数量"  sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckmc" label="所属仓库" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="所属库区"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位"></el-table-column>
                        <el-table-column show-overflow-tooltip label="采购合同单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail('purchase_manage_HT_detail', scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="采购发货单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail('purchase_manage_FH_detail', scope.row.buy_shipstock_no)">{{scope.row.buy_shipstock_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="采购入库单编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail('purchase_manage_RK_detail', scope.row.product_instock_no)">{{scope.row.product_instock_no}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" :direction="isTmp"></pagination>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
            </Card>
            </Col>
        </Row>        
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { purchaseManageReturnAdd, allStoreInfos, apiAllBrands, purchaseManageConfirmReturn, purchaseApplyList,apiGetAllAreaList,apiGetAllSeatList} from '@/config/getData';
    export default {
        components: {
            pagination
        },
        props: ['orderNum', 'storeNum', 'isTmp'],
        data () {
            return {
                returnInfo: {
                    cpppbh: 'all',
                    supplier_no: 'all',
                    cpmc: '',
                    buy_order_no: '',
                    cpdhh: '',
                    cpxh: '',
                    store_no: 'all',
                    area_no: 'all',
                    seat_no: 'all',
                },
                brandsList: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                storageList: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                AreaList: [
                    {
                        label:'全部',
                        value:'all'
                    }
                ],
                SeatList: [
                    {
                        label:'全部',
                        value:'all'
                    }
                ],
                applyList: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                returnList: [],
                selectedItems: [],
                selectedItemsAll: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                isDisableA: true,
                isDisableB: true,
                store_no: '',
                loadding: false
            };
        },
        methods: {
            selectOne(selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.selectedItems.includes(row.id))) {
                    this.selectedItems.push(row.id);
                    this.selectedItemsAll.push(row);
                }
                if (!row.checked && this.selectedItems.includes(row.id)) {
                    let index = this.selectedItems.indexOf(row.id);
                    this.selectedItems.splice(index, 1);
                }
            },
            selectAll(selection) {
                this.returnList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.brandsList.push({
                                value: item.cpppbh,
                                label: item.cpppmc
                            })
                        });
                    }
                })
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

            storeChange (val) {
                this.AreaList = [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ];
                if (val === 'all') {
                    this.isDisableA = true;
                    this.isDisableB = true;
                    this.returnInfo.area_no = 'all';
                    this.returnInfo.seat_no = 'all';
                } else {
                    this.isDisableA = false;
                    this.isDisableB = true;
                    this.returnInfo.seat_no = 'all';
                    apiGetAllAreaList(this, {
                        store_no: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.store_no = val;
                            res.data.forEach(item => {
                                item.label = item.area_name;
                                item.value = item.area_no;
                                this.AreaList.push(item);
                            });
                        }
                    });
                }
            },
            areaChange (val) {
                this.SeatList = [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ];
                if (val === 'all') {
                    this.isDisableB = true;
                    this.returnInfo.seat_no = 'all';
                } else {
                    this.isDisableB = false;
                    apiGetAllSeatList(this, {
                        store_no: this.store_no,
                        area_no: val
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.SeatList.push(item);
                            });
                        }
                    });
                }
            },


            goToDetail(moduleName, orderId) {
                util.openNewPage(this, moduleName, {
                    param: orderId
                });
                this.$router.push({
                    name: moduleName,
                    query: {
                        param: orderId
                    }
                });                
            },
            getAllApplyData () {
                purchaseApplyList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.applyList.push({
                                value: item.gysbh,
                                label: item.gysmc
                            });
                        });
                    }
                });
            },            
            getData () {
                purchaseManageReturnAdd(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        cpppbh: this.returnInfo.cpppbh == 'all' ? '' : this.returnInfo.cpppbh,
                        cpmc: this.returnInfo.cpmc,
                        buy_order_no: this.returnInfo.buy_order_no,
                        cpdhh: this.returnInfo.cpdhh,
                        cpxh: this.returnInfo.cpxh,
                        store_no: this.returnInfo.store_no == 'all' ? '' : this.returnInfo.store_no,
                        area_no: this.returnInfo.area_no == 'all' ? '' : this.returnInfo.area_no,
                        seat_no: this.returnInfo.seat_no == 'all' ? '' : this.returnInfo.seat_no,
                        supplier_no: this.returnInfo.supplier_no == 'all' ? '' : this.returnInfo.supplier_no
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        res.data.list.forEach(item => {
                            item.checked = false;
                        });
                        this.returnList = res.data.list;
                        this.$nextTick(() => {
                            this.returnList.forEach(row => {
                                if (this.selectedItems.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }
                });
            },
            confirmReturn () {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.loadding = true;
                purchaseManageConfirmReturn(this, {
                    params: JSON.stringify({
                        gh_id: this.selectedItems
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        util.openNewPage(this, 'purchase_manage_TH_make', {
                            selectedId: JSON.stringify(this.selectedItems),
                            orderNum: res.data.product_info[0].buy_order_no
                        });
                        this.loadding = false;
                        this.$router.push({
                            name: 'purchase_manage_TH_make',
                            query: {
                                selectedId: JSON.stringify(this.selectedItems),
                                orderNum: res.data.product_info[0].buy_order_no
                            }
                        });
                    } else {
                        this.loadding = false;
                        this.$Message.error(res.message);
                    }
                });
            },
            backTo () {
                history.go(-1);
            },            
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.returnInfo.cpppbh = 'all';
                this.returnInfo.supplier_no = 'all';
                this.returnInfo.cpmc = '';
                this.returnInfo.buy_order_no = this.orderNum || '';
                this.returnInfo.store_no = this.storeNum || 'all';
                this.returnInfo.area_no =  'all';
                this.returnInfo.seat_no =  'all';
                this.returnInfo.cpdhh = '';
                this.returnInfo.cpxh = '';
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
            confirmAdd() {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                if (this.isTmp == 'yes') {
                    this.$emit("getAdd", this.selectedItems);
                }
                if (this.isTmp == 'yesDetail') {
                    this.$emit("getAdd", this.selectedItemsAll);
                }
            }
        },
        created () {
            this.getAllBrands();
            this.getAllStoreInfos();
            this.getAllApplyData();
            console.log(this.orderNum)
            this.returnInfo.buy_order_no = this.orderNum || '';
            this.returnInfo.store_no = this.storeNum || 'all';
            this.getData();
        }
    };
</script>