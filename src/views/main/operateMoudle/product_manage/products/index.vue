<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.product_no" placeholder="输入产品编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.cpppbh"  placeholder="请选择产品品牌" filterable @on-change="search">
                            <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_type" placeholder="输入产品类别" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_model" placeholder="输入产品模型名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.public_series" placeholder="输入通用系列" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.series_name" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.is_deleted" placeholder="请选择" @on-change="search">
                            <Option v-for="status in cpStateArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.tax_code" placeholder="请选择" @on-change="search">
                            <Option v-for="status in taxCodeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
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
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="pldj" v-auth="buttonShow">批量冻结</Button>
                    <Button type="primary" @click="pljh" v-auth="buttonShow">批量激活</Button>
                    <Button type="primary" @click="handleClick('', 'operate_products_add')" v-auth="buttonShow">新增</Button>
                    <Button type="primary" @click="productExport">导出</Button>
                    <Button type="primary" @click="productDelete" v-auth="buttonShow">删除</Button>
                    <Button type="primary" @click="productTaxCode" v-auth="buttonShow">税收编码修改</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border style="text-align: center"  @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" v-if="is_true">
                    </el-table-column>
                    <el-table-column label="产品编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.cpbh, 'operate_products_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.cpbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.cpmc}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.cpmc"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpppmc" label="品牌中文名称" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.cpppmc}}</span>
                            <Select v-if="scope.row.isEdit" v-model="scope.row.cpppbh" placeholder="请选择" filterable @on-change="Bindcppp(scope.$index,scope.row.cpppbh)" transfer>
                                <Option v-for="status in brandArr" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpppywmc" label="品牌英文名称" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.cpmcty}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.cpmcty"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpmxbh" label="产品模型编号" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmxmc" label="产品模型名称" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cplbbh" label="产品类别编号" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cplbmc" label="产品类别名称"min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.cplbmc}}</span>
                            <Select v-if="scope.row.isEdit" v-model="scope.row.cplbbh" placeholder="请选择" filterable @on-change="Bindcplb(scope.$index,scope.row.cplbbh)" transfer>
                                <Option v-for="status in cplbArr" :value="status.cplbbh" :key="status.cplbbh">{{ status.cplbmc }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tax_code" label="税收编码"min-width="120"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isEdit">{{scope.row.tax_code}}</span>
                            <Input v-if="scope.row.isEdit" v-model="scope.row.tax_code"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="商品数量"min-width="100"></el-table-column>
                    <el-table-column prop="is_deleted" label="状态" >
                        <template slot-scope="scope">
                           <span v-if="!scope.row.isEdit">{{ cp_state[scope.row.is_deleted] }}</span>
                            <Select v-if="scope.row.isEdit" v-model="scope.row.is_deleted" placeholder="请选择" filterable transfer>
                                <Option v-for="status in cpStateselectArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </template>
                    </el-table-column>


                    <el-table-column label="操作" width="120" v-if="is_true">
                        <template slot-scope="scope">
                            <span  @click="editAndCopy(scope.$index)" type="text" size="small" v-if="!scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">修改</span></span>
                            <span  @click="cancelEdit(scope.$index)" type="text" size="small" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">取消</span></span>
                            <span  @click="save(scope.$index)" type="text" size="small" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;">保存</span></span>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>



        <Modal v-model="showAdd" title="税收编码" class="modal-margin">
            <Form ref="AddSourceObj" :model="AddTaxCodeeObj" :label-width="100" :show-message="false" >
                <FormItem prop="bz" label="税收编码：">
                    <Input v-model="AddTaxCodeeObj.tax_code" placeholder="请输入税收编码" style="width:200px;"></Input>
                    <!--<input type="text" v-model="AddTaxCodeeObj.tax_code" style="width:200px;">-->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel()">取消</Button>
                <Button type="primary"  @click="confirm()" :loading="loading">确定</Button>
            </div>
        </Modal>


        <!--<Spin fix  v-if="spinShow">-->
        <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
        <!--<div>Loading</div>-->
        <!--</Spin>-->
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import util from '@/libs/util';
    import { apiAllStatus, apiGetProductSeriesList,apiGetProductSeriesModify,operateAllBrandstype, apiGetProductSeriesOperation, apiGetProductTypeExport, operateAllBrandsList,apiGetProductSeriesDeleted,apiTaxCodeEdit } from '@/config/getData';
    import { notempty, manualCheck} from '@/config/mUtils';
    export default {
        name: 'operate_products_index',
        data () {
            return {
                buttonShow: 'producr_manage_index_all_button',
                orderInfo: {
                    product_no: '',
                    cpppbh: 'all',
                    brand_ch: '选择产品品牌',
                    brand_en: '',
                    product_type: '',
                    product_model: '',
                    public_series: '',
                    series_name: '',
                    is_deleted:'all',
                    tax_code:'all',
                },
                AddTaxCodeeObj: {
                    tax_code: '',
                },
                orderData: {
                    data: []
                },
                isEdit:false,
                showAdd: false,
                dateRange: '',
                orderStatus: '',
                orderStatusArr: [],
                spinShow: true,
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                multipleSelection: [],
                multipleCustomer: [],
                cp_state: '',
                allBrands: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                is_true: true,
                brandArr:[],
                cplbArr: [],
                cpStateArr:[
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                cpStateselectArr: [],
                taxCodeArr: [
                    {
                        label: '选择税收编码',
                        value: 'all'
                    },
                    {
                        label: '有编码',
                        value: '1'
                    },
                    {
                        label: '无编码',
                        value: '0'
                    },
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.isSelected) {
                 return 'selected-row';
                }
            },

            editAndCopy(index){
                this.orderData.data[index].isEdit = true;
            },
            cancelEdit(index){
                this.orderData.data[index].isEdit = false;
            },
            save(index){
                apiGetProductSeriesModify(this, {
                    params: JSON.stringify({
                        cpbh: this.orderData.data[index].cpbh,
                        cpppbh: this.orderData.data[index].cpppbh,
                        cpmcty: this.orderData.data[index].cpmcty,
                        cplbbh: this.orderData.data[index].cplbbh,
                        cpmc: this.orderData.data[index].cpmc,
                        is_deleted: this.orderData.data[index].is_deleted,
                        tax_code: this.orderData.data[index].tax_code,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.getData();
                        this.$Message.success('修改成功');
                    } else {
                        this.getData();
                        this.$Message.error(res.message);
                    }
                });

                this.orderData.data[index].isEdit = false;
            },
            Bindcppp(index,cpppbh){

                this.brandArr.forEach(item => {
                    if(item.cpppbh == cpppbh) {
                        this.orderData.data[index].cpppywmc = item.cpppywmc;
                        this.orderData.data[index].cpppmc = item.cpppmc;
                        this.orderData.data[index].cpppbh = item.cpppbh;
                    }
                })
            },
            Bindcplb(index,cplbbh,cplbmc){
                this.orderData.data[index].cplbbh = cplbbh;
                this.cplbArr.forEach(item => {
                    if(item.cplbbh == cplbbh) {
                        this.orderData.data[index].cplbmc = item.cplbmc;

                    }
                })
            },


            getStatus () {
                /*所有状态*/
                apiAllStatus(this, {
                    type: JSON.stringify(['cp_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cp_state = res.data.cp_state;
                        let tmpObj = {};
                        for (let key in res.data.cp_state) {
                            if (res.data.cp_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cp_state[key]
                                };
                                this.cpStateArr.push(tmpObj);
                                this.cpStateselectArr.push(tmpObj);
                            }
                        }

                    }
                });
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data.list);
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.brandArr.push(res.data.list[i]);
                        }
                    }
                });


                operateAllBrandstype(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.cplbArr.push(res.data.list[i]);
                        }
                    }
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
                for (let i = 0; i < this.allBrands.length; i++) {
                    if (this.orderInfo.cpppbh == this.allBrands[i].cpppbh) {
                        this.orderInfo.brand_ch = this.allBrands[i].cpppmc;
                        break;
                    }
                }
                apiGetProductSeriesList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        cpbh: this.orderInfo.product_no,
                        cpppmc: this.orderInfo.brand_ch === '选择产品品牌' ? '' : this.orderInfo.brand_ch,
                        cplbbh: this.orderInfo.product_type,
                        cpmxmc: this.orderInfo.product_model,
                        cpmcty: this.orderInfo.public_series,
                        cpxl: this.orderInfo.series_name,
                        is_deleted: this.orderInfo.is_deleted == 'all' ? '' : this.orderInfo.is_deleted,
                        tax_code: this.orderInfo.tax_code == 'all' ? '' : this.orderInfo.tax_code,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.isSelected = false;
                            item.isEdit = false;
                        });

                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            productExport () {
                for (let i = 0; i < this.allBrands.length; i++) {
                    if (this.orderInfo.cpppbh == this.allBrands[i].cpppbh) {
                        this.orderInfo.brand_ch = this.allBrands[i].cpppmc;
                        break;
                    }
                }
                apiGetProductTypeExport(this, {
                    params: JSON.stringify(this.notempty({
                        cpbh: this.orderInfo.product_no,
                        cpppmc: this.orderInfo.brand_ch === '选择产品品牌' ? '' : this.orderInfo.brand_ch,
                        cplbbh: this.orderInfo.product_type,
                        cpmxmc: this.orderInfo.product_model,
                        cpmcty: this.orderInfo.public_series,
                        cpxl: this.orderInfo.series_name,
                        is_deleted: this.orderInfo.is_deleted == 'all' ? '' : this.orderInfo.is_deleted,
                        tax_code: this.orderInfo.tax_code == 'all' ? '' : this.orderInfo.tax_code,
                    }))
                }).then(res => {
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.product_no = '';
                this.orderInfo.cpppbh = 'all';
                this.orderInfo.brand_ch = '选择产品品牌';
                this.orderInfo.product_type = '';
                this.orderInfo.product_model = '';
                this.orderInfo.public_series = '';
                this.orderInfo.series_name = '';
                this.orderInfo.is_deleted = 'all';
                this.orderInfo.tax_code = 'all';
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
            handleSelectionChange (val) {
                console.log(val)
                this.orderData.data.forEach(item => {
                    item.isSelected = false;
                });
                val.forEach(item => {
                    item.isSelected = true;
                });
                this.multipleCustomer = [];
                this.multipleSelection = val;
                for (let i in this.multipleSelection) {
                    this.multipleCustomer.push(this.multipleSelection[i].cpbh);
                }
            },
            pldj () {
                if (this.multipleCustomer.length == 0) {
                    this.$Message.error('请选择要冻结的产品');
                } else {
                    apiGetProductSeriesOperation(this, {
                        params: JSON.stringify({
                            info: this.multipleCustomer,
                            type: 'frozen'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            productDelete(){
                if (this.multipleCustomer.length == 0) {
                    this.$Message.error('请选择要删除的产品');
                } else {
                    console.log( JSON.stringify(this.multipleCustomer));

                    apiGetProductSeriesDeleted(this, {
                        params: JSON.stringify(this.multipleCustomer)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            productTaxCode(){
                if (this.multipleCustomer.length == 0) {
                    this.$Message.error('请选择要编辑的产品');
                } else {
                    this.showAdd = true;
                }

            },
            cancel() {
                this.showAdd = false;
            },
            confirm(){
                apiTaxCodeEdit(this, {
                    params: JSON.stringify(this.multipleCustomer),
                    tax_code: this.AddTaxCodeeObj.tax_code
                }).then(res => {
                    if (res && res.status == 1) {
                        this.showAdd = false;
                        this.$Message.success(res.message);
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });

            },
            pljh () {
                if (this.multipleCustomer.length == 0) {
                    this.$Message.error('请选择要激活的产品');
                } else {
                    apiGetProductSeriesOperation(this, {
                        params: JSON.stringify({
                            info: this.multipleCustomer,
                            type: 'activation'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success(res.message);
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.is_true = manualCheck(this.buttonShow);
        }
    };
</script>
