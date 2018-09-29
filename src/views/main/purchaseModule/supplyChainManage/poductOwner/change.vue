<style>

</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <col span="24">
            <Card>
                <Form :label-width="120"  :model="orderInfo">
                    <Row>
                        <Col span="8">
                        <FormItem label="品牌：">
                            <Select v-model="applyInfo.brand" filterable>
                                <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="通用系列：">
                            <Input v-model="applyInfo.series" placeholder="请输入通用系列" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品名称：">
                            <Input v-model="applyInfo.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品型号：">
                            <Input v-model="applyInfo.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="订货号：">
                            <Input v-model="applyInfo.order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="品牌经理：">
                            <Select v-model="applyInfo.manager" filterable>
                            	 <Option value="all">全部</Option>
                                <Option v-for="status in managerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="采购员：">
                            <Select v-model="applyInfo.purchaser" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in buyers" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="备货员：">
                            <Select v-model="applyInfo.stocker" filterable>
                            	<Option value="all">全部</Option>
                                <Option v-for="status in buyers" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <div>
                <Select v-model="typeTmp.valid" style="float:left;width:120px;" @on-change="typeChange">
                    <Option v-for="status in typeTmp.tmpArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                </Select>
                <Button type="primary" class="margin-left-20" @click="exportIn" style="float:left;">分配负责人</Button>
                <div class="clear"></div>
            </div>
            <el-table :row-class-name="tableRowClassName" :data="applyList" border style="text-align: center" @sort-change="manualSort" ref="multipleTable" @select="selectOne"  @select-all="selectAll" class="margin-top-10">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="cpppmc" label="品牌" width="120"></el-table-column>
                <el-table-column prop="gysmc" label="通用系列" ></el-table-column>
                <el-table-column prop="cpmcty" label="产品名称" ></el-table-column>
                <el-table-column prop="cpxh" label="产品型号" min-width="150"></el-table-column>
                <el-table-column prop="cpdhh" label="订货号" width="100"></el-table-column>
                <el-table-column label="采购员" width="120">
                	<template slot-scope="scope">
                        <span>{{ scope.row.purchase_user_no }} <em v-if="scope.row.purchase_user_no">/ </em>{{scope.row.purchase_user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备货员" width="120">
                	<template slot-scope="scope">
                        <span>{{ scope.row.stock_user_no }} <em v-if="scope.row.stock_user_no">/ </em>{{scope.row.stock_user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌经理" width="120">
                	<template slot-scope="scope">
                        <span>{{ scope.row.brand_manager_no }} <em v-if="scope.row.brand_manager_no">/ </em>{{scope.row.brand_manager_name}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" ></pagination>
        </Row>
        <Modal v-model="exportInModal" :mask-closable=true :width="300" :closable=true>
            <h3 slot="header">分配负责人</h3>
            <Form class="content" :label-width="100">
                <Row>
                    <Col span="24">
                    <FormItem label="采购员：">
                        <Select v-model="applyOwner.purchaser" filterable>
                            <Option v-for="status in buyers" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="备货员：">
                        <Select v-model="applyOwner.stocker" filterable>
                            <Option v-for="status in buyers" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="品牌经理：">
                        <Select v-model="applyOwner.manager" filterable>
                            <Option v-for="status in managerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelIn()">取消</Button>
                <Button type="primary" @click="sureIn()">确定</Button>
            </div>
        </Modal>
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
    import { apiGetPurchaseGoodsUserList, operateAllBrandsList, allpersonInfos, apiGetPurchaseProductUserAssign} from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';
    export default {
        // name: 'purchase_product_owner_change',
        components: {
            pagination
        },
        data () {
            return {
                applyInfo: {
                    brand: 'all',
                    series: '',
                    product_name: '',
                    product_model: '',
                    order_no: '',
                    purchaser: 'all',
                    stocker: 'all',
                    manager: 'all'
                },
                applyStatus: [],
                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                exportInModal: false,
                typeTmp: {
                    valid: '1',
                    tmpArr: [
                        {
                            label: '产品明细',
                            value: '0'
                        },
                        {
                            label: '商品明细',
                            value: '1'
                        }
                    ]
                },
                applyOwner: {
                    purchaser: '',
                    stocker: '',
                    manager: ''
                },
                brandArr: [
                    {
                        value: 'all',
                        label: '全部'
                    }
                ],
                spinShow: true,
                buyers: [],
                managerArr: [],
                multipleSelection: [],
                buyersChoosed: [],
                stokersChoosed: [],
                managersChoosed: []
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
            typeChange (val) {
                if (val == 0) {
                    this.handleClick('', 'purchase_product_owner');
                } else {
                    this.handleClick('', 'purchase_product_owner_change');
                }
            },
            selectOne(selection, row) {
                let tmp = [];
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.cpxhbh))) {
                    this.multipleSelection.push(row.cpxhbh);
                    this.buyersChoosed.push(row.purchase_user_no);
                    this.stokersChoosed.push(row.stock_user_no);
                    this.managersChoosed.push(row.brand_manager_no);
                }
                if (!row.checked && this.multipleSelection.includes(row.cpxhbh)) {
                    let index = this.multipleSelection.indexOf(row.cpxhbh);
                    this.multipleSelection.splice(index, 1);
                    this.buyersChoosed.splice(index, 1);
                    this.stokersChoosed.splice(index, 1);
                    this.managersChoosed.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.applyList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            deleteApply () {
                if (this.selectedItems.length <= 0) {
                    this.$Message.error('请至少选择一项!')
                    return;
                }
                this.showDelete = true;
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
                allpersonInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.user_no;
                            item.label = item.user_name;
                            this.buyers.push(item);
                        });
                    }
                });
                allpersonInfos(this, {
                	type: '5'
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.user_no;
                            item.label = item.user_name;
                            this.managerArr.push(item);
                        });
                    }
                });
            },
            getData () {
                apiGetPurchaseGoodsUserList(this, {
                    params: JSON.stringify({
                        cpppbh: this.applyInfo.brand == 'all' ? '' : this.applyInfo.brand,
                        cpmcty: this.applyInfo.series,
                        cpmc: this.applyInfo.product_name,
                        cpxh: this.applyInfo.product_model,
                        cpdhh: this.applyInfo.order_no,
                        purchase_user_no: this.applyInfo.purchaser == 'all' ? '' : this.applyInfo.purchaser, 
                        stock_user_no: this.applyInfo.stocker == 'all' ? '' : this.applyInfo.stocker, 
                        brand_manager_no: this.applyInfo.manager == 'all' ? '' : this.applyInfo.manager, 
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.applyList = res.data.list;
                        this.spinShow = false;
                        this.$nextTick(() => {
                            this.applyList.forEach(row => {
                                if (this.multipleSelection.includes(row.cpxhbh)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }
                });
            },
            exportIn () {
                if (this.multipleSelection == 0) {
                    this.$Message.error('请选择产品');
                } else {
                    /*选择的采购员是否相同*/
                     if (this.buyersChoosed.length == 1) {
                        this.applyOwner.purchaser = this.buyersChoosed[0];
                     } else if (this.buyersChoosed.length == 2) {
                        if (this.buyersChoosed[0] === this.buyersChoosed[1]) {
                            this.applyOwner.purchaser = this.buyersChoosed[0];
                        } else {
                            this.applyOwner.purchaser = '';
                        }
                     } else {
                        for (let i = 0; i < this.buyersChoosed.length-1; i++) {
                            if (this.buyersChoosed[i] !== this.buyersChoosed[i+1]) {
                                this.applyOwner.purchaser = '';
                                break;
                            } else {
                                this.applyOwner.purchaser = this.buyersChoosed[0];
                            }
                        }
                     }
                     /*选中的备货员是否相同*/
                     if (this.stokersChoosed.length == 1) {
                        this.applyOwner.stocker = this.stokersChoosed[0];
                     } else if (this.stokersChoosed.length == 2) {
                        if (this.stokersChoosed[0] === this.stokersChoosed[1]) {
                            this.applyOwner.stocker = this.stokersChoosed[0];
                        } else {
                            this.applyOwner.stocker = '';
                        }
                     } else {
                        for (let i = 0; i < this.stokersChoosed.length-1; i++) {
                            if (this.stokersChoosed[i] !== this.stokersChoosed[i+1]) {
                                this.applyOwner.stocker = '';
                                break;
                            } else {
                                this.applyOwner.stocker = this.stokersChoosed[0];
                            }
                        }
                     }
                     /*选中的品牌经理是否相同*/
                     if (this.managersChoosed.length == 1) {
                        this.applyOwner.manager = this.managersChoosed[0];
                     } else if (this.managersChoosed.length == 2) {
                        if (this.managersChoosed[0] === this.managersChoosed[1]) {
                            this.applyOwner.manager = this.managersChoosed[0];
                        } else {
                            this.applyOwner.manager = '';
                        }
                     } else {
                        for (let i = 0; i < this.managersChoosed.length-1; i++) {
                            if (this.managersChoosed[i] !== this.managersChoosed[i+1]) {
                                this.applyOwner.manager = '';
                                break;
                            } else {
                                this.applyOwner.manager = this.managersChoosed[0];
                            }
                        }
                     }
                     this.exportInModal = true;
                }
            },
            cancelIn () {
                this.exportInModal = false;
            },
            sureIn () {
                apiGetPurchaseProductUserAssign(this, {
                    params: JSON.stringify({
                        type: 'cpxhbh',
                        purchase_user_no: this.applyOwner.purchaser,
                        stock_user_no: this.applyOwner.stocker,
                        brand_manager_no: this.applyOwner.manager
                    }),
                    list: JSON.stringify(this.multipleSelection)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.exportInModal = false;
                        this.getData();
                        this.multipleSelection = [];
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            discountChange (val) {
                var reg = /^\d+\.?(\d{1,3})?$/;
                if (!reg.test(val)) {
                    this.$Message.error('折扣最多保留3位小数');
                } else if (parseInt(val * 1000) > parseInt(1000)) {
                    this.$Message.error('折扣不可大于1');
                }
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
                    product_model: '',
                    order_no: '',
                    purchaser: 'all',
                    stocker: 'all',
                    manager: 'all'
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
            // this.getStatus();
            this.getApi(); 
            this.getData();
        },
        activated() {
           
        }
    };
</script>