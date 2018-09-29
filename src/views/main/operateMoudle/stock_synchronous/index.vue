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
                            <Select v-model="orderInfo.supplyer" filterable @on-change="search">
                                <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.brand" filterable @on-change="search">
                                <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpxh" placeholder="输入型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.cpmcty" placeholder="输入通用系列" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.status" filterable @on-change="search">
                                <Option v-for="status in statusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
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
                <Col span="24" style="margin-bottom: 10px;">
                    <Button type="primary" @click="useit(1)" v-auth="use_btn">启用</Button>
                    <Button type="primary" @click="useit(0)" v-auth="use_btn">禁用</Button>
                    <Button type="primary" @click="deleteit()" v-auth="delete_btn" style="margin-right:20px;">删除</Button>
                    <span>库存数量:<span style="margin-left:15px;color: #FF0000;">{{totalNum}}</span></span>
                    <span style="margin-left:20px;">勾选库存数量:<span style="margin-left:15px;color: #FF0000;">{{chooseNum}}</span></span>
                </Col>
                <el-table :data="dataList"  ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll"   max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column prop="cpxhbh" label="型号编号" width="120" sortable="custom" show-overflow-tooltip fixed></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" width="120" sortable="custom" show-overflow-tooltip fixed></el-table-column>
                    <el-table-column prop="cpxh" label="型号" show-overflow-tooltip sortable="custom" width="160" fixed></el-table-column>
                    <el-table-column prop="gysmc" label="供应商" width="200" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" sortable="custom" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" sortable="custom" show-overflow-tooltip width="142"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="cpxhmj" label="面价" sortable="custom" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="product_price" label="采购单价" sortable="custom" show-overflow-tooltip width="100"></el-table-column>
                    <el-table-column prop="discount" label="折扣" show-overflow-tooltip width="110"></el-table-column>
                    <el-table-column prop="stock_num" label="库存数量" show-overflow-tooltip sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="update_time" label="更新时间" show-overflow-tooltip sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="is_deleted" label="状态 " show-overflow-tooltip sortable="custom" width="80"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"  class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiGetPurchaseSupplierList,operateAllBrandsList,apiGetSupplierStock,apiGetSupplierStockUse,apiGetSupplierStockDelete } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                use_btn: 'stock_synchronous_use_button',
                delete_btn: 'stock_synchronous_delete_button',
                totalNum: 0,
                chooseNum: 0,
                orderInfo: {
                    supplyer: 'all',
                    brand: 'all',
                    cpdhh: '',
                    cpxh: '',
                    cpmc: '',
                    cpmcty: '',
                    status: 'all',
                },
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
                statusArr: [
                    {
                        value: 'all',
                        label: '选择供状态'
                    },
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '2',
                        label: '禁用'
                    }
                ],
                dataList: [],
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                totalPrice: 0,
                multipleSelection: [],
            };
        },
        components: {
            pagination
        },
        methods: {
            deleteit () {
                apiGetSupplierStockDelete(this,{
                    params: JSON.stringify(this.notempty({
                        ids: JSON.stringify(this.multipleSelection)
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.getData();
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            useit (type) {
                apiGetSupplierStockUse(this,{
                    params: JSON.stringify(this.notempty({
                        use: type,
                        ids: JSON.stringify(this.multipleSelection)
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.getData();
                        this.$Message.success(res.message);
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            getStatus () {
                apiGetPurchaseSupplierList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });
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
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                    this.chooseNum = (+this.chooseNum + +row.stock_num);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                    this.chooseNum = (+this.chooseNum - +row.stock_num);
                }
            },
            selectAll (selection) {
                this.dataList.forEach(item => {
                    this.selectOne(selection.length, item);
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

            getData () {
                apiGetSupplierStock(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier_no: this.orderInfo.supplyer === 'all' ? '' : this.orderInfo.supplyer,
                        brand_no: this.orderInfo.brand === 'all' ? '' : this.orderInfo.brand,
                        order_no: this.orderInfo.cpdhh,
                        cpxh: this.orderInfo.cpxh,
                        cpmc: this.orderInfo.cpmc,
                        cptyxl: this.orderInfo.cpmcty,
                        status: this.orderInfo.status,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList= res.data.list;
                        this.totalNum = res.data.total_num;
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
