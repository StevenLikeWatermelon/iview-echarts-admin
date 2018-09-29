<style>
    
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="orderInfo" class="model-style">
                        <Row>
                            <Col span="4">
                            <Select v-model="applyInfo.brand" filterable @on-change="search">
                                <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.series" placeholder="输入通用系列" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.product_name" placeholder="输入产品名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="applyInfo.supplyer" filterable @on-change="search">
                                <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Select v-model="applyInfo.type"  @on-change="search">
                                <Option v-for="status in typeArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                            </Col>
                            <Col span="4">
                            <Input v-model="applyInfo.product_no" placeholder="输入产品编号" @on-enter="search"></Input>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Card>
                <col span="24">
                <div  v-auth="buttonAuth">
                    <Button type="error" @click="deleteApply()">删除</Button>
                    <Button type="primary" class="margin-left-20" @click="exportOut">导出</Button>
                    <Button type="primary" class="margin-left-20" @click="downloadTmp">导入模板下载</Button>
                    <Button type="success" class="margin-left-20" @click="exportIn">导入</Button>
                </div>
            </col>
            <el-table :row-class-name="tableRowClassName" :data="applyList" border style="text-align: center" @sort-change="manualSort"  ref="multipleTable"  @selection-change="handleSelectionChange"  class="margin-top-10" max-height="570">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="product_no" label="产品编号" sortable="custom"></el-table-column>
                <el-table-column prop="cpppmc" sortable="custom" label="品牌"></el-table-column>
                <el-table-column prop="cpmcty" label="通用系列" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cpmc" label="产品名称" width="150" sortable="custom"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="type" label="采购类型" sortable="custom" width="100">
                     <template slot-scope="scope">
                         <span>{{ types[scope.row.type] }}</span>
                     </template>
                </el-table-column>
                <el-table-column prop="gysmc" label="供应商名称" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="discount_min" label="折扣下限" sortable="custom" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.discount_min }}</span>
                        <Input type="text" v-model="scope.row.discount_min" v-else @on-blur="discountChange(scope.row.discount_min)"></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="discount_max" label="折扣上限" sortable="custom" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.discount_max }}</span>
                        <Input type="text" v-model="scope.row.discount_max" v-else  @on-blur="discountChange(scope.row.discount_max)"></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="rebate" label="返点" sortable="custom" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.rebate }}</span>
                        <Input type="text" v-model="scope.row.rebate" v-else  @on-blur="discountChange(scope.row.rebate)"></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="leadtime" label="货期" sortable="custom">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.leadtime }}</span>
                        <Input type="text" v-model="scope.row.leadtime" v-else></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注"  width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.note }}</span>
                        <Input type="text" v-model="scope.row.note" v-else></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="priority" label="优先级" sortable="custom" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit">{{ scope.row.priority }}</span>
                        <Input type="text" v-model="scope.row.priority" v-else></Input>
                    </template>
                </el-table-column>
                <el-table-column prop="shzt" label="操作" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEdit" style="color: rgb(45, 140, 240);cursor: pointer;" @click="editData(scope.$index)">编辑</span>
                        <div v-else>
                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="saveData(scope.$index)">保存</span>
                            <span class="margin-left-20" style="color: rgb(45, 140, 240);cursor: pointer;" @click="cancelData(scope.$index)">取消</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
        </Row>
         <Modal v-model="exportInModal" :mask-closable=true :width="300" :closable=true>
            <h3 slot="header">导入</h3>
            <div class="content">
                <Row>
                    <Col span="24">
                    <div>
                        <Upload :action="uploadUrl"
                                :format="['csv']"
                                :on-format-error="handleFormatError"
                                :on-success="handleSuccess"
                                :show-upload-list="false" style="display: block;width:100%;">
                            <Button type="default" icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                        <a v-if="upload.name" style="width:100%;color:#888;"><!--style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + upload.file" target="_blank"-->
                            <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件: {{upload.name}}
                        </a>
                    </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelIn()">取消</Button>
                <Button type="primary" :loading='loading' @click="sureIn()">确定</Button>
            </div>
        </Modal>
        <!-- 确认删除弹框 -->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="publicCancel">取消</Button>
                <Button type="primary" @click="publicSure">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showSucessInfo" width="400" :closable="true" :mask-closable="true">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p>{{successInfoMsg}}</p>
            </div>
            <div slot="footer">
                <Button type="error" @click="faildExport">失败数据导出</Button>
                <Button type="primary"  @click="hasKnow()">确定</Button>    
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
    import { apiGetPurchaseStrategyList, apiAllStatus, operateAllBrandsList, apiGetPurchaseSupplierList, apiGetPurchaseStrategyExport, apiGetPurchaseExportTemplate, apiGetPurchaseStrategyImport, apiGetPurchaseStrategyErrorExport, apiGetPurchaseBulkDelete, apiEditSupplyProductEdit } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';
    export default {
        name: 'purchase_strategy_table',
        components: {
            pagination
        },
        data () {
            return {
                buttonAuth: 'purchase_policy_index_all_button',
                applyInfo: {
                    brand: 'all',
                    series: '',
                    product_name: '',
                    supplyer: 'all',
                    type: 'all',
                    product_no:'',
                },
                multipleSelection: [],
                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'priority',
                orderDirection: 'asc',
                uploadUrl: this.baseUrl + '/common/read-csv?token=' + setToken(),
                upload: {
                    file: '',
                    name: ''
                },
                exportInModal: false,
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
                typeArr: [
                    {
                        value: 'all',
                        label: '选择采购类型'
                    }
                ],
                types: [],
                publicModal: false,
                showSucessInfo: false,
                successInfoMsg: '',
                fileArr: [],
                failedData: [],
                spinShow: true,
                loading: false
            };
        },
        methods: {
            handleSelectionChange(selection) {
                this.multipleSelection = [];
                selection.forEach(item => {
                    this.multipleSelection.push(item.id);
                });
            },
            hasKnow () {
                this.showSucessInfo = false;
            },
            faildExport () {
                apiGetPurchaseStrategyErrorExport(this, {
                    params: JSON.stringify(this.failedData)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            deleteApply () {
                if (this.multipleSelection.length <= 0) {
                    this.$Message.error('请至少选择一项!')
                    return;
                } else {
                    this.publicModal = true;
                }
            },
            publicCancel () {
                this.publicModal = false;
            },
            publicSure () {
                apiGetPurchaseBulkDelete(this, {
                    ids: JSON.stringify(this.multipleSelection)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.getData();
                        this.publicModal = false;
                    }
                });
                
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['supplier_buy_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.types = res.data.supplier_buy_type;
                        for (let key in res.data.supplier_buy_type) {
                            if (res.data.supplier_buy_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.supplier_buy_type[key]
                                };
                                this.typeArr.push(tmpObj);
                            }
                        }
                    }
                });
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
            },            
            getData () {
                apiGetPurchaseStrategyList(this, {
                    params: JSON.stringify(this.notempty({
                        product_no:this.applyInfo.product_no,
                        type: this.applyInfo.type == 'all' ? '' : this.applyInfo.type,
                        cpmcty: this.applyInfo.series,
                        cpmc: this.applyInfo.product_name,
                        brand_no: this.applyInfo.brand == 'all' ? '' : this.applyInfo.brand,
                        supplier_no: this.applyInfo.supplyer == 'all' ? '' : this.applyInfo.supplyer,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        for (let i in res.data.list) {
                            res.data.list[i].isEdit = true;
                        }
                        this.applyList = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                        this.$nextTick(() => {
                            this.applyList.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }
                });
            },
            editData (index) {
                this.applyList[index].isEdit = false;
            },
            saveData (index) {
                console.log(121);
                var reg = /^\d+\.?(\d{1,3})?$/;
                let n = parseInt(index) + parseInt(1);
                if (!reg.test(this.applyList[index].discount_min) && this.applyList[index].discount_min) {
                    this.$Message.error('折扣下限最多保留3位小数');
                } else if (parseInt(this.applyList[index].discount_min * 1000) > parseInt(1000) && this.applyList[index].discount_min) {
                    this.$Message.error('折扣下限不可大于1');
                } else if (!reg.test(this.applyList[index].discount_max) && this.applyList[index].discount_max) {
                    this.$Message.error('折扣上限最多保留3位小数');
                } else if (parseInt(this.applyList[index].discount_max * 1000) > parseInt(1000) && this.applyList[index].discount_max) {
                    this.$Message.error('折扣上限不可大于1');
                } else if (!this.applyList[index].priority) {
                    this.$Message.error('请填写优先级');    
                } else if (!reg.test(this.applyList[index].rebate) && this.applyList[index].rebate){
                    this.$Message.error('返点最多保留3位小数');
                } else if (parseInt(this.applyList[index].rebate * 1000) > parseInt(1000) && this.applyList[index].rebate) {
                    this.$Message.error('返点不可大于1');
                } else {
                    let goods = {};
                    goods[this.applyList[index].id] = {
                        discount_min: this.applyList[index].discount_min,
                        discount_max: this.applyList[index].discount_max,
                        leadtime: this.applyList[index].leadtime,
                        note: this.applyList[index].note,
                        priority: this.applyList[index].priority,
                        rebate: this.applyList[index].rebate,
                    };
                    apiEditSupplyProductEdit(this, {
                        params: JSON.stringify(goods),
                        supplier_no: this.applyList[index].supplier_no,
                        brand_no: this.applyList[index].brand_no,
                        type: '1'
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.applyList[index].isEdit = true;
                            this.getData();
                        } else {
                            this.$Message.error({
                                content: res.message,
                                duration: 5,
                                closable: true
                            });
                        }
                    });
                   
                }
            },
            cancelData (index) {
                this.applyList[index].isEdit = true;
                this.getData();
            },
            exportOut () {
                apiGetPurchaseStrategyExport(this, {
                    params: JSON.stringify(this.notempty({
                        product_no:this.applyInfo.product_no,
                        type: this.applyInfo.type == 'all' ? '' : this.applyInfo.type,
                        cpmcty: this.applyInfo.series,
                        cpmc: this.applyInfo.product_name,
                        brand_no: this.applyInfo.brand == 'all' ? '' : this.applyInfo.brand,
                        supplier_no: this.applyInfo.supplyer == 'all' ? '' : this.applyInfo.supplyer,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1) {}
                });
            },
            downloadTmp () {
                apiGetPurchaseExportTemplate(this, {}).then(res => {});
            },
            exportIn () {
                this.exportInModal = true;
                this.upload.name = '';
            },
            cancelIn () {
                this.exportInModal = false;
            },
            sureIn () {
                this.loading = true;
                // apiGetPurchaseStrategyImport
                let self = this;
                // self.showSpin = true;
                let postData = JSON.parse(JSON.stringify(this.fileArr));
                apiGetPurchaseStrategyImport(self, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.error_msg && res.data.error_msg.length > 0) {
                            this.successInfoMsg = res.data.success_count + '个导入成功,' + res.data.error_count + '个导入失败,';
                            this.loading = false;
                            this.showSucessInfo = true;
                            this.failedData = res.data.error_msg;
                            this.exportInModal = false;
                        } else {
                            this.exportInModal = false;
                            self.$Message.success('导入成功!');
                        }
                        self.getData();
                    } else {
                        self.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            discountChange (val) {
                if (val) {
                    var reg = /^\d+\.?(\d{1,3})?$/;
                    if (!reg.test(val)) {
                        this.$Message.error('最多保留3位小数');
                    } else if (parseInt(val * 1000) > parseInt(1000)) {
                        this.$Message.error('不可大于1');
                    }
                }                
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件：' + file.name + ' 格式不正确',
                    desc: '文件只支持 .csv 类型，请重新选择文件。'
                });
            },
            handleSuccess(arr, file, response) {
                 this.upload.name = file.name;
                 this.fileArr = arr;
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
                    supplyer: 'all',
                    type: 'all',
                    product_no:'',
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
            this.getStatus();
            this.getApi();
        },
        activated() {
            this.getData();
        }
    };
</script>