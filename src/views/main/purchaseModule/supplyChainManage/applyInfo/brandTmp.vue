<style>
   .flex-center {
        width: 33%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 6px 0;
   } 
   .no-margin-bottom .ivu-form-item {
        margin-bottom: 0;
   }
   .no-upload-float .ivu-form-item-error-tip {
        top:30px;
   }
</style>
<template>
    <div class="no-margin-bottom no-upload-float" style="margin-top:15px;">
        <Card>
            <p slot="title" class="card-title">
                {{brandInfo.cpppmc}}
            </p>
            <div slot="extra" v-auth="buttonAuth">
                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteBrand">品牌删除</span>
            </div>
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <Form :label-width="150">
                            <Row v-show="!isEditBasic">
                                    <Col span="6">
                                        <FormItem label="是否有品牌授权：">
                                           <span>{{brandInfo.is_certificate == '0' ? '否' : '是'}}</span>
                                        </FormItem>
                                    </Col>
                                    <Col span="6">
                                        <FormItem label="授权证书电子版文件：">
                                           <a v-show="brandInfo.certificate_url" :href="brandInfo.certificate_url" target="_blank" style="padding-left:12px;"></Icon>查看文件</a>
                                        </FormItem>
                                    </Col>
                                    <Col span="6">
                                        <FormItem label="授权证书有效期：">
                                           <span>{{brandInfo.certificate_time_begin}}~{{brandInfo.certificate_time_end}}</span>
                                        </FormItem>
                                    </Col>
                                    <Col span="6" v-auth="buttonAuth">
                                        <div class="flex-center">
                                            <div>
                                                <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="!isEditBasic" @click="editBasic">编辑</span>
                                            </div>
                                            <div>
                                                <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="saveBasic">保存</span>
                                            </div>
                                            <div>
                                                <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="cancelBasic">取消</span>
                                            </div>
                                        </div>
                                    </Col>
                            </Row>
                            <Row v-show="isEditBasic && !isRequire">
                                <Col span="6">
                                    <FormItem label="是否有品牌授权：">
                                        <RadioGroup v-model="brandInfo.is_certificate" @on-change="changeIsRequire">
                                            <Radio label="1">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="0">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <FormItem label="授权证书电子版文件：">
                                        <Upload :action="uploadUrl"
                                                :format="['jpg', 'png', 'jpeg', 'pdf', 'doc','docx','zip', 'rar']"
                                                :on-format-error="handleFormatError"
                                                :on-success="handleSuccessZstp"
                                                :show-upload-list="false">
                                            <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                                        </Upload>
                                        <a v-show="brandInfo.certificate_url" :href="brandInfo.certificate_url" target="_blank" style="padding-left:12px;"></Icon>查看文件</a>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <FormItem label="授权证书有效期：">
                                        <DatePicker type="daterange" :value="datetimerange" placeholder="请选择" @on-change="getDateRange" style="width:100%;"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <div class="flex-center">
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="!isEditBasic" @click="editBasic">编辑</span>
                                        </div>
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="saveBasic">保存</span>
                                        </div>
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="cancelBasic">取消</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        <Row v-show="isEditBasic && isRequire">
                            <Form :label-width="150" ref="brandInfo" :model="brandInfo" :rules="ruleValidateStorage">
                                <Col span="6">
                                    <FormItem label="是否有品牌授权：">
                                        <RadioGroup v-model="brandInfo.is_certificate" @on-change="changeIsRequire">
                                            <Radio label="1">
                                                <span>是</span>
                                            </Radio>
                                            <Radio label="0">
                                                <span>否</span>
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <FormItem label="授权证书电子版文件：" prop="certificate_url">
                                        <Upload :action="uploadUrl"
                                                :format="['jpg', 'png', 'jpeg', 'pdf', 'doc','docx','zip', 'rar']"
                                                :on-format-error="handleFormatError"
                                                :on-success="handleSuccessZstp"
                                                :show-upload-list="false">
                                            <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
                                        </Upload>
                                        <a v-show="brandInfo.certificate_url" :href="brandInfo.certificate_url" target="_blank" style="padding-left:12px;"></Icon>查看文件</a>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <FormItem label="授权证书有效期：" prop="certificate_time_begin">
                                        <DatePicker type="daterange" :value="datetimerange" placeholder="请选择" @on-change="getDateRange" style="width:100%;"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="6" v-auth="buttonAuth">
                                    <div class="flex-center">
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="!isEditBasic" @click="editBasic">编辑</span>
                                        </div>
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="saveBasic">保存</span>
                                        </div>
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-show="isEditBasic" @click="cancelBasic">取消</span>
                                        </div>
                                    </div>
                                </Col>
                            </Form>
                        </Row>
                    </Card>
                </col>
            </Row>
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <p slot="title">
                            产品线明细列表
                        </p>
                        <Row class="margin-top-10">
                            <col span="24">
                                <Card>
                                     <Form :label-width="120">
                                        <Row>
                                            <Col span="6">
                                                <FormItem label="采购类型：">
                                                    <Select v-model="brandSearch.type">
                                                        <Option v-for="status in supplyTypeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span="6">
                                                <FormItem label="通用系列：">
                                                    <Input v-model="brandSearch.cpmcty" placeholder="请输入通用系列" @on-enter="search"></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="6">
                                                <FormItem label="产品名称：">
                                                    <Input v-model="brandSearch.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="6" style="text-align: center;margin-bottom:0;">
                                                <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                                                <Button type="primary" style="margin-right:30px;" @click="reset">重置</Button>
                                            </Col>
                                        </Row>
                                     </Form>
                                </Card>
                            </col>
                            <Col span="24" style="margin: 15px 0;" v-auth="buttonAuth">
                                <Button v-show="!isManualOperate" type="primary" @click="addGoods('1')">添加备货产品</Button>
                                <Button v-show="!isManualOperate" type="primary" style="margin-left: 50px;" @click="addGoods('2')">添加调货产品</Button>
                                <Button v-show="!isManualOperate" type="primary" style="margin-left: 50px;" @click="manualOperate">批量编辑</Button>
                                <Button v-show="!isManualOperate" type="primary" style="margin-left: 50px;" @click="deleteSupply">删除</Button>
                                <Button v-show="isManualOperate" type="primary" @click="saveManualOperate">保存</Button>
                                <Button v-show="isManualOperate" type="primary" style="margin-left: 50px;" @click="cancelManualOperate">取消</Button>
                            </Col>
                            <el-table :row-class-name="tableRowClassName" :data="productList" border style="text-align: center" @sort-change="manualSort" @selection-change="handleSelectionChange">
                                <el-table-column  type="selection"  width="55"></el-table-column>
                                <el-table-column prop="type" label="采购类型" sortable="custom">
                                    <template slot-scope="scope">
                                        <span>{{supplyTypeObj[scope.row.type]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="cpmcty" label="通用系列"></el-table-column>
                                <el-table-column prop="cpmc" label="产品名称"></el-table-column>
                                <el-table-column prop="discount_min" label="折扣下限" sortable="custom">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.discount_min}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.discount_min" placeholder="请输入折扣下限"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="discount_max" label="折扣上限" sortable="custom">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.discount_max}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.discount_max" placeholder="请输入折扣上限"></Input>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="rebate" label="返点" sortable="custom">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.rebate}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.rebate" placeholder="请输入返点"></Input>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="leadtime" label="货期" sortable="custom">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.leadtime}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.leadtime" placeholder="请输入货期"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="note" label="备注">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.note}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.note" placeholder="请输入备注"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="priority" label="优先级" sortable="custom">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEdit">{{scope.row.priority}}</span>
                                        <Input v-if="scope.row.isEdit" v-model="scope.row.priority" placeholder="请输入优先级"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" v-if="!isManualOperate">
                                    <template slot-scope="scope">
                                        <div>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="!scope.row.isEdit" @click="sortSupply(scope.row.type, scope.row.cpbh, scope.row.cpmc)">排序</span>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="!scope.row.isEdit" @click="editSupply(scope.$index)">编辑</span>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="scope.row.isEdit" @click="saveEditSupply(scope.row)">保存</span>
                                            <span style="color: rgb(45, 140, 240);cursor: pointer" v-if="scope.row.isEdit" @click="cancelEditSupply()">取消</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-if="totalnum > 10 && !isManualOperate"></pagination>
                        </Row>
                    </Card>
                </col>
            </Row>
        </Card>
        <Modal v-model="showAdd" width="1000" class-name="modal-no-absoute">
            <to-add :type="currentModalType" :brandNo="brandInfo.brand_no" ref="goodsToAdd" @cancelModal="cancelAddModal"></to-add>
            <div slot="footer"></div>
        </Modal>      
        <Modal v-model="showSupplyPriority" title="供应商优先级" width="1000">
            <Row>
                <col span="24">
                    <Card>
                        <div style="margin-bottom:20px;">
                            <span>产品名称：</span><span style="margin-left:15px;">{{currentProductName}}</span>
                        </div>
                        <el-table :row-class-name="tableRowClassName" :data="supplyPriorityList" border style="text-align: center;width:100%">
                            <el-table-column prop="supplier_no" label="供应商编号"></el-table-column>
                            <el-table-column prop="supplier_name" label="供应商名称"></el-table-column>
                            <el-table-column prop="discount_min" label="折扣下限"></el-table-column>
                            <el-table-column prop="discount_max" label="折扣上限"></el-table-column>
                            <el-table-column prop="rebate" label="返点"></el-table-column>
                            <el-table-column prop="leadtime" label="货期"></el-table-column>
                            <el-table-column prop="note" label="备注"></el-table-column>
                            <el-table-column prop="priority" label="优先级" sortable>
                                <template slot-scope="scope">
                                    <Input v-model="scope.row.priority" placeholder="请输入优先级" number></Input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelPriority">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmPriority">保存</Button>
            </div>
        </Modal>  
        <Modal v-model="showDelete" title="确认删除"  @on-ok="confirmDelete">
            <p>是否确认删除勾选的数据?</p>
        </Modal>  
        <Modal v-model="showDeleteBrand" title="确认删除"  @on-ok="confirmDeleteBrand">
            <p>是否确认删除该品牌信息?</p>
        </Modal>   
    </div>
</template>

<script>
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util';
    import {setToken} from '@/config/mUtils';
    import {apiSupplyCoBrandProduct, apiEditSupplyCoBrand, apiAllStatus, apiGetSupplyProductPriority, apiEditSupplyProductPriority, apiEditSupplyProductEdit, apiSingleSupplyProductDelete, apiDeleteSupplyBrand} from '@/config/getData';
    import toAdd from './toAddProducts.vue';
    export default {
        components: {
            pagination,
            toAdd
        },
        computed: {
            'datetimerange' () {
                return this.brandInfo.certificate_time_begin ? [this.brandInfo.certificate_time_begin, this.brandInfo.certificate_time_end] : [];
            }
        },
        props: ['brandInfo'],
        data () {
            return {
                loading: false,
                buttonAuth: 'apply_detail_cooperate_all_button',
                showAdd: false,
                isEditBasic: false,
                isRequire: false,
                showDelete: false,
                isManualOperate: false,
                manualEdit: false,
                cuuretDeleteId: '',
                showDeleteBrand: false,
                currentModalType: '0',
                uploadUrl: this.baseUrl + '/v1/supply/supplier/upload-supplier-attach?token=' + setToken(), 
                brandSearch: {
                    type: 'all',
                    cpmcty: '',
                    cpmc: ''
                },
                supplyTypeArr: [{
                    value: 'all',
                    label: '全部'
                }],
                supplyTypeObj: {},

                showSupplyPriority: false,
                currentProductName: '',
                supplyPriorityList: [],

                productList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'priority',
                orderDirection: 'asc',

                ruleValidateStorage: {
                    certificate_url: [
                        { required: true, message: '授权证书不能为空', trigger: 'blur' }
                    ],
                    certificate_time_begin: [
                        { required: true, message: '证书有效期不能为空', trigger: 'blur'}
                    ]
                },
                selectGoods: []
            };
        },
        methods: {
            deleteBrand() {
                this.showDeleteBrand = true;
            },
            confirmDeleteBrand() {
                apiDeleteSupplyBrand(this, {
                    id: this.brandInfo.id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.$emit('refreshList');
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['supplier_buy_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.supplyTypeObj = res.data.supplier_buy_type;
                        for (let key in res.data.supplier_buy_type) {
                            if (res.data.supplier_buy_type.hasOwnProperty(key)) {
                                this.supplyTypeArr.push({
                                    value: key,
                                    label: res.data.supplier_buy_type[key]
                                });
                            }
                        }
                    }
                });
            },
            getProductList() {
                this.$Spin.show();
                apiSupplyCoBrandProduct(this, {
                    supplier_no: this.$route.query.param,
                    brand_no:  this.brandInfo.brand_no,
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        type: this.brandSearch.type == 'all' ? '' : this.brandSearch.type,
                        cpmcty: this.brandSearch.cpmcty,
                        cpmc: this.brandSearch.cpmc
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        res.data.list.forEach(item => {
                            item.isEdit = this.manualEdit;
                        });
                        this.productList = res.data.list;
                        this.$Spin.hide();
                    }
                })
            },

            editBasic() {
                this.isEditBasic = true;
            },
            saveBasic() {
                if (this.brandInfo.is_certificate == '0') {
                    apiEditSupplyCoBrand(this, {
                        params: JSON.stringify(this.brandInfo)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('保存成功!');
                            this.$emit('refreshList');
                            this.isEditBasic = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else {
                    this.$refs['brandInfo'].validate((valid) => {
                        if (valid) {
                            apiEditSupplyCoBrand(this, {
                                params: JSON.stringify(this.brandInfo)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('保存成功!');
                                    this.$emit('refreshList');
                                    this.isEditBasic = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                            });
                        }
                    })
                }
            },
            cancelBasic() {
                this.isEditBasic = false;
            },
            addGoods(type) {
                this.currentModalType = type;
                this.$refs['goodsToAdd'].getData(type, 1);
                this.showAdd = true;
            },
            cancelAddModal() {
                this.showAdd = false;
                this.getProductList();
            },
            sortSupply(type, product_no, product_name) {
                apiGetSupplyProductPriority(this, {
                    type,
                    product_no
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.supplier_product.forEach(item => {
                            item.priority = +item.priority;
                        });
                        this.supplyPriorityList = res.data.supplier_product;
                        this.currentProductName = product_name;
                        this.showSupplyPriority = true;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            cancelPriority() {
                this.showSupplyPriority = false;
            },
            confirmPriority() {
                for (let i = 0; i < this.supplyPriorityList.length; i++) {
                    if (isNaN(this.supplyPriorityList[i].priority) || this.supplyPriorityList[i].priority == '') {
                        this.$Message.error('第' + (i+1) + '行优先级输入有误!');
                        return;
                    }
                }
                let tmpObj = {};
                this.supplyPriorityList.forEach(item => {
                    tmpObj[item.supplier_id] = item.priority;
                });
                this.loading = true;
                apiEditSupplyProductPriority(this, {
                    params: JSON.stringify(tmpObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改优先级成功!');
                        this.getProductList();
                        this.showSupplyPriority = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            editSupply(index) {
                this.productList[index].isEdit = true;
            },
            cancelEditSupply() {
                this.getProductList();
            },
            saveEditSupply(row) {
                if (isNaN(row.discount_min)) {
                    this.$Message.error('折扣下限输入有误!');
                    return;
                }
                if (isNaN(row.discount_max)) {
                    this.$Message.error('折扣上限输入有误!');
                    return;
                }
                if (isNaN(row.leadtime)) {
                    this.$Message.error('货期输入有误!');
                    return;
                }
                if (isNaN(row.priority) || row.priority == '') {
                    this.$Message.error('优先级输入有误!');
                    return;
                }
                if (+row.discount_max > 1) {
                    this.$Message.error('折扣上限不能大于1!');
                    return;
                }
                if (+row.discount_max <= 0 && !!row.discount_max) {
                    this.$Message.error('折扣上限不能小于0!');
                    return;
                }
                if (!!row.discount_max && row.discount_max.length > 5) {
                    this.$Message.error('折扣上限小数位不能大于3!');
                    return;
                }
                if (+row.discount_min > 1) {
                    this.$Message.error('折扣下限不能大于1!');
                    return;
                }
                if (+row.discount_min <= 0  && !!row.discount_min) {
                    this.$Message.error('折扣下限不能小于0!');
                    return;
                }
                if (!!row.discount_min && row.discount_min.length > 5) {
                    this.$Message.error('折扣下限小数位不能大于3!');
                    return;
                }
                if (!!row.discount_min && !!row.discount_max && (+row.discount_min > +row.discount_max)) {
                    this.$Message.error('折扣下限不能大于折扣上限!');
                    return;
                }

                if (isNaN(row.rebate)) {
                    this.$Message.error('返点输入有误!');
                    return;
                }

                if (+row.rebate > 1) {
                    this.$Message.error('返点不能大于1!');
                    return;
                }
                if (+row.rebate <= 0 && !!row.rebate) {
                    this.$Message.error('返点不能小于0!');
                    return;
                }
                if (!!row.rebate && row.rebate.length > 5) {
                    this.$Message.error('返点小数位不能大于3!');
                    return;
                }

                let tmpObj = {};
                tmpObj[row.id] = {
                    discount_min: row.discount_min,
                    discount_max: row.discount_max,
                    leadtime: row.leadtime,
                    note: row.note,
                    priority: row.priority,
                    rebate: row.rebate,
                };
                apiEditSupplyProductEdit(this, {
                    supplier_no: this.$route.query.param,
                    brand_no:  this.brandInfo.brand_no,
                    type: 1,
                    params: JSON.stringify(tmpObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getProductList();
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            deleteSupply() {
                if (this.selectGoods.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.showDelete = true;
            },
            confirmDelete() {
                apiEditSupplyProductEdit(this, {
                    supplier_no: this.$route.query.param,
                    brand_no:  this.brandInfo.brand_no,
                    delete_info: JSON.stringify(this.selectGoods),
                    type: 0,
                    params: JSON.stringify({})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.reset();
                        this.showDelete = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },

            manualOperate() {
                this.isManualOperate = true;
                this.manualEdit = true;
                this.productList.forEach(item => {
                    item.isEdit = true;
                });
            },
            cancelManualOperate() {
                this.manualEdit = false;
                this.getProductList();
                this.isManualOperate = false;
            },
            saveManualOperate() {
                for (let i = 0; i < this.productList.length; i++) {
                    let row = this.productList[i];
                    if (isNaN(row.discount_min)) {
                        this.$Message.error('第' + (i+1) + '行折扣下限输入有误!');
                        return;
                    }
                    if (isNaN(row.discount_max)) {
                        this.$Message.error('第' + (i+1) + '行折扣上限输入有误!');
                        return;
                    }
                    if (isNaN(row.leadtime)) {
                        this.$Message.error('第' + (i+1) + '行货期输入有误!');
                        return;
                    }
                    if (isNaN(row.priority) || row.priority == '') {
                        this.$Message.error('第' + (i+1) + '行优先级输入有误!');
                        return;
                    }
                    if (+row.discount_max > 1) {
                        this.$Message.error('第' + (i+1) + '行折扣上限不能大于1!');
                        return;
                    }
                    if (+row.discount_max <= 0  && !!row.discount_max) {
                        this.$Message.error('第' + (i+1) + '行折扣上限不能小于0!');
                        return;
                    }
                    if (!!row.discount_max && row.discount_max.length > 5) {
                        this.$Message.error('第' + (i+1) + '行折扣上限小数位不能大于3!');
                        return;
                    }
                    if (+row.discount_min > 1) {
                        this.$Message.error('第' + (i+1) + '行折扣下限不能大于1!');
                        return;
                    }
                    if (+row.discount_min <= 0  && !!row.discount_min) {
                        this.$Message.error('第' + (i+1) + '行折扣下限不能小于0!');
                        return;
                    }
                    if (!!row.discount_min && row.discount_min.length > 5) {
                        this.$Message.error('第' + (i+1) + '行折扣下限小数位不能大于3!');
                        return;
                    }
                    if ( !!row.discount_min && !!row.discount_max && (+row.discount_min > +row.discount_max)) {
                        this.$Message.error('第' + (i+1) + '行折扣下限不能大于折扣上限!');
                        return;
                    }
                    if (isNaN(row.rebate)) {
                        this.$Message.error('第' + (i+1) + '行返点输入有误!');
                        return;
                    }
                    if (+row.rebate > 1) {
                        this.$Message.error('第' + (i+1) + '行返点不能大于1!');
                        return;
                    }
                    if (+row.rebate <= 0  && !!row.rebate) {
                        this.$Message.error('第' + (i+1) + '行返点不能小于0!');
                        return;
                    }
                    if (!!row.rebate && row.rebate.length > 5) {
                        this.$Message.error('第' + (i+1) + '行返点小数位不能大于3!');
                        return;
                    }
                }

                let tmpObj = {};
                this.productList.forEach(row => {
                    tmpObj[row.id] = {
                        discount_min: row.discount_min,
                        discount_max: row.discount_max,
                        leadtime: row.leadtime,
                        note: row.note,
                        priority: row.priority,
                        rebate: row.rebate,
                    };
                });
                apiEditSupplyProductEdit(this, {
                    supplier_no: this.$route.query.param,
                    brand_no:  this.brandInfo.brand_no,
                    delete_info: JSON.stringify([]), //需求变动，删除和编辑分开调接口，所以此处为空
                    type: 0,
                    params: JSON.stringify(tmpObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.manualEdit = false;
                        this.getProductList();
                        this.isManualOperate = false;
                        this.$Message.success('修改成功!');
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },


            search() {
                this.currentPage = 1;
                this.getProductList();
            },
            reset() {
                this.brandSearch = {
                    type: 'all',
                    cpmcty: '',
                    cpmc: ''
                };
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getProductList();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getProductList();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getProductList();
            },
            getDateRange (time) {
                this.brandInfo.certificate_time_begin = time[0] ? time[0] : '';
                this.brandInfo.certificate_time_end = time[1] ? time[1] : '';
            },
            changeIsRequire(value) {
                this.isRequire = value == '0' ? false : true;
            },
            handleFormatError() {
                this.$Message.error('文件类型有误!');
            },
            handleSuccessZstp(res, file, fileList) {
                if(res.status == 1){
                    this.$Message.success("上传成功!");
                    this.brandInfo.certificate_url = this.imgURL + res.data;
                }else{
                    this.$Message.error("上传失败!");
                }

            },
            handleSelectionChange(selectedval) {
                this.selectGoods = [];
                selectedval.forEach(item => {
                    this.selectGoods.push(item.id);
                });
            }
        },
        mounted() {
            this.getStatus();
            this.getProductList();
        }
    };
</script>