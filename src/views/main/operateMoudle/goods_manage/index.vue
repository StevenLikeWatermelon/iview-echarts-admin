<style>
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="manageList" :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="manageList.cpxhbh" placeholder="输入商品型号编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="manageList.cppp"  placeholder="请选择产品品牌" filterable @on-change="search">
                            <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="manageList.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="manageList.cpmcty" placeholder="输入通用系列" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Cascader :data="allTypes" v-model="manageList.cplb" filterable @on-change="searchCascader" placeholder="选择类别"></Cascader>
                        </Col>
                        <Col span="4">
                        <Input v-model="manageList.cpxh" placeholder="输入商品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="manageList.cpdhh" placeholder="输入商品订货号" @on-enter="search"></Input>
                        </Col>
                        <!-- <Col span="4">
                        <Input v-model="manageList.xy_cp_id" placeholder="请输入新阳产品编码" @on-enter="search"></Input>
                        </Col> -->
                        <Col span="4">
                        <Select v-model="manageList.cpzt"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="item in goodsStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <!-- <Col span="4">
                        <FormItem label="新阳产品绑定：">
                            <Select v-model="manageList.xy_bind"  placeholder="请选择绑定状态" filterable>
                                <Option v-for="item in xyBindStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col> -->
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择新增时间" :value='manageList.timeRange' style="width: 100%;" @on-change="getTime"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="24" style="margin-bottom: 10px;" v-auth="buttonAuth">
                    <Upload :action="importApi" name="file" :format="['csv']" :on-success="handleSuccess" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">更新型号</Button>
                    </Upload>
                    <Button type="primary" @click="modelTmpExport()">更新型号模板</Button>
                    <Upload :action="importUpdateApi" name="file" :format="['csv']" :on-success="handleSuccess2" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">更新产品型号关联关系</Button>
                    </Upload>
                    <Button type="primary" @click="modelTmpExport1()">更新产品型号关联关系模板</Button>
                    <Button type="primary" @click="addNew()">新增</Button>
                    <Button type="primary" @click="getData(1)">导出</Button>
                    <Button type="primary" @click="doActive('active')">激活</Button>
                    <Button type="primary" @click="doActive('freeze')">冻结</Button>
                    <Button type="primary" @click="newAdd()">新增上架</Button>
                    <Button type="primary" @click="translatePrd()">转移产品</Button>
                    <Button type="primary" @click="Deletedpop()">删除</Button>
                </Col>
                <el-table :row-class-name="tableRowClassName" :data="goodsList" border style="text-align: center" @sort-change="manualSort" @selection-change="handleSelectionChange" max-height="570">
                    <el-table-column  type="selection"  width="55"></el-table-column>
                    <el-table-column prop="cpxhbh" label="商品型号编号"  width="120">
                        <template slot-scope="scope">
                            <span  @click="toDetail(scope.row.cpxhbh)" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.cpxhbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpzt" label="商品状态" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.cpzt == 1 ? '激活' : '冻结'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpppmc" label="商品品牌" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称"  min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cplbmc" label="产品类别" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="商品型号" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="商品订货号" min-width="120" show-overflow-tooltip sortable="custom"></el-table-column>
                    <!-- <el-table-column prop="xy_cp_id" label="新阳产品编码" ></el-table-column> -->
                    <el-table-column prop="djrq" label="新增时间"   sortable="custom" width="150"></el-table-column>

                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
         <Modal v-model="showModal" title="导入结果">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
                            <Row>
                                <Col span="24">
                                    <FormItem label="导入成功：">
                                        <span>{{importInfo.success}}条</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="导入失败：">
                                        <span>{{importInfo.fail}}条</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="cancelShowModal">确定</Button>
                <Button type="primary" @click="confirmExportFailedList">导出失败数据</Button>
            </div>
        </Modal>
        <Modal v-model="showModal1" title="导入结果">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
                            <Row>
                                <Col span="24">
                                    <FormItem label="导入成功：">
                                        <span>{{importInfo1.success}}条</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="导入失败：">
                                        <span>{{importInfo1.fail}}条</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="cancelShowModal1">确定</Button>
                <Button type="primary" @click="confirmExportFailedList1">导出失败数据</Button>
            </div>
        </Modal>
        <Modal v-model="showTranslate" title="转入产品选择" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                        <Form :label-width="100">
                            <Col span="6">
                            <FormItem label="产品编号：">
                                <Input v-model="productId"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem>
                                <Button type="primary"  @click="searchCpbh">搜索</Button>
                            </FormItem>
                            </Col>
                        </Form>
                    </Row>
                    <el-table :row-class-name="tableRowClassName" :data="productSelectedList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column label="产品编号" prop="cpbh" width="120"></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmcty" label="通用系列"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cplbmc" label="产品类别" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="is_deleted" label="状态" width="100">
                            <template slot-scope="scope">
                                <span>{{ cp_state[scope.row.is_deleted] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

        <!--删除弹窗-->
        <Modal v-model='DeletedModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="deletedCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="DeletedGoods">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import util from '@/libs/util';
    import {setToken} from '@/config/mUtils';
    import { operateGoodsManageList,apiDeletedGoods, apiAllBrands, apiAlltypes, goodsListExport, activeAndFrozen,apiGetProductSeriesList,apiAllStatus,apiGetProductCpxhTransfer,apiExportModelTmp,apiImportModel,apiExportFailedproduct,apiExportProductTmp,apiUpdateModel,apiExportFailedModel} from '@/config/getData';
    export default {
        name: 'operate_goods_manage_index',
        data () {
            return {
                buttonAuth: 'goods_manage_all_button',
                manageList: {
                    cpxhbh: '',
                    cppp: 'all',
                    cpmc: '',
                    cpmcty: '',
                    cpxh: '',
                    cplb: [],
                    cpdhh: '',
                    xy_cp_id: '',
                    cpzt: 'all',
                    xy_bind: 'all',
                    timeRange: [],
                },
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                importUpdateApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                showSpin: false,
                showModal: false,
                showModal1: false,
                failedData: [],
                failedData1: [],
                importInfo: {
                    success: 0,
                    fail: 0
                },
                importInfo1: {
                    success: 0,
                    fail: 0
                },
                allBrands: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                allTypes: [],
                goodsStatus: [{
                    value: '0',
                    label: '冻结'
                },{
                    value: '1',
                    label: '激活'
                },{
                    value: 'all',
                    label: '选择产品状态'
                }],
                xyBindStatus: [{
                    value: '0',
                    label: '未绑定'
                },{
                    value: '1',
                    label: '绑定'
                },{
                    value: 'all',
                    label: '全部'
                }],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                orderDirection: 'desc',
                orderField: 'cpxhbh',
                goodsList: [],
                selectdArr:[],
                showTranslate: false,
                productId:'',
                productSelectedList:[],
                newCpbh:'',
                DeletedModal:false,
            }
        },
        components: {
            pagination
        },
        methods: {
            Deletedpop(){
                if (this.selectdArr.length == 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.DeletedModal = true;
            },
            DeletedGoods(){
                if (this.selectdArr.length == 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                apiDeletedGoods(this, {
                    params: JSON.stringify(this.selectdArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.DeletedModal = false;
                        this.getData();
                    } else {
                        this.$Message.error({content:res.message,duration:0,closable:true});
                        this.DeletedModal = false;
                        this.getData();
                    }
                });

            },
            deletedCancel(){
                this.DeletedModal = false;
                this.getData();
            },
            toDetail(numId) {
                util.openNewPage(this, 'operate_goods_manage_index_detail', {
                    id: numId
                });
                this.$router.push({
                    name: 'operate_goods_manage_index_detail',
                    query: {
                        id: numId
                    }
                });
            },
            newAdd() {
                util.openNewPage(this, 'operate_goods_manage_add_detail');
                this.$router.push({
                    name: 'operate_goods_manage_add_detail'
                });
            },
            getTime (value) {
                this.manageList.timeRange = value;
                this.search();
            },
            handleSuccess(arr){
                 this.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                apiImportModel(this, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.importInfo.success = res.data.success_count;
                        this.importInfo.fail = res.data.error_count;
                        this.failedData = res.data.error_msg;
                        this.showModal = true;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                });
            },
            handleSuccess2(arr){
                 this.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                apiUpdateModel(this, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.importInfo1.success = res.data.success_count;
                        this.importInfo1.fail = res.data.error_count;
                        this.failedData1 = res.data.error_msg;
                        this.showModal1 = true;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                });
            },
            modelTmpExport() {
                apiExportModelTmp(this, {});
            },
            modelTmpExport1() {
                apiExportProductTmp(this, {});
            },
            cancelShowModal() {
                this.showModal = false;
            },
            cancelShowModal1() {
                this.showModal1 = false;
            },
            confirmExportFailedList() {
                apiExportFailedproduct(this, {
                    params: JSON.stringify(this.failedData)
                });
            },
            confirmExportFailedList1() {
                apiExportFailedModel(this, {
                    params: JSON.stringify(this.failedData1)
                });
            },
            doActive(type) {
                if (this.selectdArr.length == 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                activeAndFrozen(this, {
                    action: type,
                    cpxhbh: JSON.stringify(this.selectdArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (row.isSelected) {
                    return 'selected-row';
                }
            },
            translatePrd(){

                if (this.selectdArr.length == 0) {
                    this.$Message.error('请选择转入的产品!');
                    return;
                }
                this.showTranslate = true;
            },
            getStatus () {
                /*所有状态*/
                apiAllStatus(this, {
                    type: JSON.stringify(['cp_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cp_state = res.data.cp_state;
                    }
                });
            },
            searchCpbh(){
                if(this.productId != ''){
                    apiGetProductSeriesList(this, {
                        params: JSON.stringify(this.notempty({
                            numPerPage: 99999,
                            cpbh: this.productId,
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.isSelected = false;
                            });
                            this.productSelectedList = res.data.list;
                        }
                    });
                }
            },
            confirmTranslate(){
                if(this.newCpbh == ''){
                    this.$Message.error('请选择转入的产品');
                    return;
                }

                apiGetProductCpxhTransfer(this, {
                    cpbh:this.newCpbh,
                    params: JSON.stringify({
                        info: this.selectdArr,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.showTranslate = false;
                        this.$Message.success('转移成功');
                        this.getData();

                    }
                    else{
                        this.$Message.error('转移失败');
                    }
                });

            },
            handleCurrentChange(val) {
                this.newCpbh = val.cpbh;

            },
            addNew() {
                util.openNewPage(this, 'operate_goods_manage_new_add');
                this.$router.push({
                    name: 'operate_goods_manage_new_add'
                });
            },
            handleSelectionChange(value) {
                this.productSelectedList.forEach(item => {
                    item.isSelected = false;
                });
                this.selectdArr = [];
                value.forEach(item => {
                    item.isSelected = true;
                    this.selectdArr.push(item.cpxhbh);
                });
            },
            getAllBrandsAndTypes () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data);
                    }
                })
                apiAlltypes(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allTypes = res.data;
                    }
                })
            },
            getData(isExport) {
                this.showSpin = true;
                let tmpObj = {
                    pageNum: this.currentPage,
                    numPerPage: this.limit,
                    orderField: this.orderField,
                    orderDirection: this.orderDirection,
                    starttime: this.manageList.timeRange[0],
                    endtime: this.manageList.timeRange[1],
                    cpxhbh: this.manageList.cpxhbh,
                    cppp: this.manageList.cppp == 'all' ? '' : this.manageList.cppp,
                    cpmc: this.manageList.cpmc,
                    cpmcty: this.manageList.cpmcty,
                    cpmcty: this.manageList.cpmcty,
                    cpxh: this.manageList.cpxh,
                    cpxh: this.manageList.cpxh,
                    cplb: JSON.stringify(this.manageList.cplb),
                    cpdhh: this.manageList.cpdhh,
                    xy_cp_id: this.manageList.xy_cp_id,
                    cpzt: this.manageList.cpzt == 'all' ? '' : this.manageList.cpzt,
                    xy_bind: this.manageList.xy_bind == 'all' ? '' : this.manageList.xy_bind
                };
                if (!isExport) {
                    operateGoodsManageList(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        this.goodsList = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.showSpin = false;
                    });
                } else {
                    goodsListExport(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        this.showSpin = false;
                    });
                }
            },
            searchCascader(values) {
                this.manageList.cplb = values;
                this.search();
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.manageList = {
                    cpxhbh: '',
                    cppp: 'all',
                    cpxl: '',
                    cpmcty: '',
                    cpxh: '',
                    cplb: [],
                    cpdhh: '',
                    xy_cp_id: '',
                    cpzt: 'all',
                    xy_bind: 'all',
                    timeRange: []
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
            }
        },
        created () {
            this.getAllBrandsAndTypes();
            this.getData();
            this.getStatus();
        }
    };
</script>
