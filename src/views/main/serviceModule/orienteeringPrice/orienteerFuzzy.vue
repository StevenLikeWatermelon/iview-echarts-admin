<template>
    <Modal v-model='showFuzzy' :mask-closable=false :width="90" :title="'当前模糊查询的订货号/产品型号:' + currentOrderId">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4">
                            <Select v-model="orderInfo.cpppbh"  placeholder="选择品牌" @on-change="search" filterable>
                                <Option value="all" key="all">全部品牌</Option>
                                <Option v-for="(val, index) in brandList" :value="val.cpppbh" :key="val.cpppbh">{{ val.cpppmc }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.cpmcty_id"  placeholder="选择通用系列" @on-change="search" filterable>
                                <Option value="all" key="all">全部通用系列</Option>
                                <Option v-for="(val, index) in allGeneralSeriesArr" :value="val.cpmcty_id" :key="val.cpmcty_id">{{ val.cpmcty }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.product" placeholder="输入订货号/产品型号/产品名称" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120"  class="model-style">
                    <Row>
                        <Col span="4" style="margin-bottom: 10px;">
                            <Button type="primary" :loading="loading" @click="confirmAddFuzzy">确定</Button>
                            <Button type="primary" @click="cancelShowFuzzy">取消</Button>
                        </Col>
                        <Col span="4">
                            <Input v-model="defalutPrice" placeholder="输入默认定向折扣"></Input>
                        </Col>
                    </Row>
                </Form>
                <el-table :data="fuzzyDataList" ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column  type="selection"  width="55"></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip sortable="custom" min-width="160"></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" show-overflow-tooltip sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" show-overflow-tooltip sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" show-overflow-tooltip sortable="custom"  min-width="150"></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" show-overflow-tooltip sortable="custom"  min-width="150"></el-table-column>
                    <el-table-column prop="jldw" label="计量单位" show-overflow-tooltip sortable="custom"  min-width="150"></el-table-column>
                    <el-table-column prop="cpxhmj" label="产品面价" show-overflow-tooltip sortable="custom"  min-width="150"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <div slot="footer" style="display:none"></div>
    </Modal>
</template>
<script>
    import { apiAllBrands, orienteeringPriceFuzzySearchApi, getAllGeneralSeriesListAPi } from '@/config/getData';
    import pagination from '@/views/common/pagination.vue';
    export default {
        data() {
            return {
                spinShow: false,
                loading: false,
                orderInfo: {
                    cpppbh: 'all',
                    cpmcty_id: 'all',
                    product: ''
                },
                defalutPrice: '',
                brandList: [],
                allGeneralSeriesArr: [],
                fuzzyDataList: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
            }
        },
        components: {
            pagination
        },
        props: ['showFuzzy', 'currentOrderId'],
        methods: {
            getAllBrands() {
                //获取所有产品品牌
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.brandList = res.data;
                    }
                });
            },
            getAllGeneralSeries() {
                //获取所有产品品牌
                getAllGeneralSeriesListAPi(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allGeneralSeriesArr = res.data;
                    }
                });
            },
            cancelShowFuzzy() {
                this.showFuzzy = false;
            },
            confirmAddFuzzy() {
                this.multipleSelectionAll.forEach(item => {
                    item.direct_discount = this.defalutPrice;
                });
                this.$emit('addNewData', this.multipleSelectionAll);
            },
            getFuzzyData() {
                this.spinShow = true;
                orienteeringPriceFuzzySearchApi(this, {
                    params: JSON.stringify({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        product_order_no: this.currentOrderId,
                        cpppbh: this.orderInfo.cpppbh == 'all' ? '' : this.orderInfo.cpppbh,
                        cpmcty_id: this.orderInfo.cpmcty_id == 'all' ? '' : this.orderInfo.cpmcty_id,
                        product: this.orderInfo.product,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.fuzzyDataList = res.data.data || [];
                        this.totalnum = res.data.totalCount;

                        this.$nextTick(() => {
                            this.fuzzyDataList.forEach(row => {
                                if (this.multipleSelection.includes(row.product_model_no)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                })
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.product_model_no))) {
                    this.multipleSelection.push(row.product_model_no);
                    this.multipleSelectionAll.push(row);
                }
                if (!row.checked && this.multipleSelection.includes(row.product_model_no)) {
                    let index = this.multipleSelection.indexOf(row.product_model_no);
                    this.multipleSelection.splice(index, 1);
                    this.multipleSelectionAll.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.fuzzyDataList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getFuzzyData();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getFuzzyData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getFuzzyData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getFuzzyData();
            }
        },
        created() {
            this.getAllGeneralSeries();
            this.getAllBrands();
        },
        watch: {
            showFuzzy(value) {
                this.$emit('update:showFuzzy', value);
                if (value) {
                    this.getFuzzyData();
                }
            }
        }
    };
</script>