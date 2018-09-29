<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="120" >
                    <Row>
                        <Col span="8">
                        <FormItem label="品牌：">
                            <Select v-model="form.brand"  placeholder="请选择">
                                <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品名称：">
                            <Input v-model="form.name" placeholder="请输入产品名称" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="来源类型：">
                            <Select v-model="form.type"  placeholder="请选择">
                                <Option v-for="status in FromTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="订货号：">
                            <Input v-model="form.order" placeholder="请输入订货号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品型号：">
                            <Input v-model="form.model" placeholder="请输入产品型号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="来源单据编号：">
                            <Input v-model="form.from_djbh" placeholder="请输入来源单据编号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="ToHTD">生成采购合同单</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort"  @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55" fixed>
                    </el-table-column>
                    <el-table-column prop="brand_name" label="品牌" sortable="custom"></el-table-column>
                    <el-table-column prop="product_name" label="产品名称" ></el-table-column>
                    <el-table-column prop="product_model" label="产品型号" ></el-table-column>
                    <el-table-column prop="product_order_no" label="订货号" ></el-table-column>
                    <el-table-column prop="product_unit" label="计量单位" ></el-table-column>
                    <el-table-column label="产品面价" sortable="custom">
                        <template slot-scope="scope">
                            <span> {{ (scope.row.product_origin_price).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requisition_num" label="申请数量" sortable="custom"></el-table-column>
                    <el-table-column prop="buyed_num" label="已采购数量" sortable="custom"></el-table-column>
                    <el-table-column prop="ready_buy_num" label="待采购数量" sortable="custom"></el-table-column>
                    <el-table-column prop="order_type" label="来源类型" sortable="custom"></el-table-column>
                    <el-table-column label="来源单据编号 ">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;"> {{scope.row.requisition_no }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售合同单编号 ">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer;"> {{scope.row.sell_order_no }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseReadybuyList, operateAllBrandsList } from '@/config/getData';
    import { notempty, sortBy, manualCheck } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                form: {
                    applyer: '',
                    type: 'all',
                    dj_status: '',
                    fk_status: '',
                    htd_bh: '',
                    stock: '',
                    state: '',
                    from_djbh: '',
                    brand: 'all',
                    name: '',
                    fhd_no: '',
                    order: '',
                    model: '',
                    datetime: ''
                },
                orderData: {
                    data: [
                        {
                            khbh: '12313'
                        }
                    ]
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                multipleSelection: [],
                multipleCustomer: [],
                orderField: '',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                brandArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                FromTypeArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                brand_ids: []
            };
        },
        components: {
            pagination
        },
        methods: {
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
                for (let i in this.multipleSelection) {
                    this.brand_ids.push(this.multipleSelection[i].id);
                }
            },
            ToHTD () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let argu = { ids: this.brand_ids };
                    util.openNewPage(this, 'purchase_manage_BH_HTD');
                    this.$router.push({
                        name: 'purchase_manage_BH_HTD',
                        query: argu
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.qyrzStatus = res.data.is_qyrz;
                        let tmpObj = {};
                        for (let key in res.data.is_qyrz) {
                            if (res.data.is_qyrz.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_qyrz[key]
                                };
                                this.qyrzStatusArr.push(tmpObj);
                            }
                        }
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
            getData () {
                apiGetPurchaseReadybuyList(this, {
                    params: JSON.stringify(this.notempty({
                        brand_no: this.form.brand == 'all' ? '' : this.form.brand,
                        product_order_no: this.form.order,
                        product_model: this.form.model,
                        requisition_no: this.form.from_djbh,
                        product_name: this.form.name,
                        order_type: this.form.type == 'all' ? '' : this.form.type,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.form.brand = 'all';
                this.form.name = '';
                this.form.order = '';
                this.form.model = '';
                this.form.from_djbh = '';
                this.form.type = 'all';
                this.search();
            },
            datetime (time) {
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
