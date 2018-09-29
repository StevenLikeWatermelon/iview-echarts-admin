<template>
    <Modal v-model='showSeiresAdd' :mask-closable=false :width="90" :closable="false">
        <h3 slot="header">选择活动系列</h3>
        <Row>
            <Col span="24">
                <Card>
                    <Form :model="orderInfo" :label-width="120"  class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="orderInfo.cpbh" placeholder="请输入产品编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="orderInfo.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="orderInfo.cpppbh" filterable @on-change="search">
                                    <Option v-for="(item, index) in brand_noAllSelect" :value="item.value" :key="index">{{ item.label }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="orderInfo.cpmcty" placeholder="请输入通用系列" @on-enter="search"></Input>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                            <Button type="primary" @click="comfirmSeiresAdd" style="margin-right:20px;">添加</Button>
                            <Button type="primary" @click="cancelSeriesAdd">取消</Button>
                        </Col>
                    </Row>
                    <el-table :data="dataList"  ref="multipleTable" border style="text-align: center;width:100%" :row-class-name="tableRowClassName" @select="selectOne"  @select-all="selectAll"   max-height="570">
                        <el-table-column  type="selection"  width="55" fixed></el-table-column>
                        <el-table-column prop="cpbh" label="产品编号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmcty" label="通用系列" min-width="150" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                </Card>
            </Col>
        </Row>
        <div slot="footer" style="display:none"></div>
    </Modal>
</template>
<script>
    import { apiAllBrands, operateDiscountAllSeriesApi } from '@/config/getData';
    import pagination from '@/views/common/pagination.vue';
    import {  } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                orderInfo: {
                    cpbh: '',
                    cpppbh: 'all',
                    cpmc: '',
                    cpmcty: '',
                },
                dataList: [],

                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,

                multipleSelection: [],
                multipleSelectionAll: [],

                brand_noAllSelect: [{
                    label: '选择品牌',
                    value: 'all'
                }],
            };
        },
        components: {
            pagination
        },
        props: ['showSeiresAdd'],
        methods: {
            cancelSeriesAdd() {
                this.showSeiresAdd = false;
                this.$emit('update:showSeiresAdd', this.showSeiresAdd);
                this.search();
            },
            comfirmSeiresAdd() {
                if(this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.$emit('getCurrentSelect', this.multipleSelectionAll);
                this.showSeiresAdd = false;
                this.$emit('update:showSeiresAdd', this.showSeiresAdd);
                this.search();
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.cpbh))) {
                    this.multipleSelection.push(row.cpbh);
                    this.multipleSelectionAll.push(row);
                }
                if (!row.checked && this.multipleSelection.includes(row.cpbh)) {
                    let index = this.multipleSelection.indexOf(row.cpbh);
                    this.multipleSelection.splice(index, 1);
                    this.multipleSelectionAll.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.dataList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            //获取所有品牌
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.forEach(item => {
                            this.brand_noAllSelect.push({
                                value: item.cpppbh,
                                label: item.cpppmc
                            });
                        });
                    }
                });
            },
            getData () {
                operateDiscountAllSeriesApi(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,

                        cpbh: this.orderInfo.cpbh,
                        cpmc: this.orderInfo.cpmc,
                        cpmcty: this.orderInfo.cpmcty,
                        cpppbh: this.orderInfo.cpppbh === 'all' ? '' : this.orderInfo.cpppbh,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.dataList= res.data.list;
                        this.totalnum = res.data.totalCount;

                        this.$nextTick(() => {
                            this.dataList.forEach(row => {
                                if (this.multipleSelection.includes(row.cpbh)) {
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
                this.multipleSelectionAll = [];
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
        },
        created() {
            this.getAllBrands();
            this.getData();
        }
    };
</script>
