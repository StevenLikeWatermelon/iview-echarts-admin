<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="6">
                <Card>
                    <Tree :data="allProductCategory" @on-select-change="typeChecked"></Tree>
                </Card>
            </Col>
            <Col span="18" class="padding-left-10">
                <Row>
                    <Col span="24">
                        <Card>
                            <Form :label-width="120" class="model-style">
                                <Row>
                                    <Col span="4">
                                        <Input v-model="productInfo.menu_name" placeholder="输入商品分类名称" @on-enter="search"></Input>
                                    </Col>
                                    <Col span="4">
                                        <Select v-model="productInfo.product_category_no" placeholder="输入URL查询标识" filterable @on-change="search">
                                            <Option v-for="item in allTypeArr" :key="item.cplbbh" :label="item.cplbmc" :value="item.cplbbh"></Option>
                                        </Select>
                                    </Col>
                                    <Col span="4">
                                        <Select v-model="productInfo.status" @on-change="search">
                                            <Option v-for="item in allStatusArr" :key="item.value" :label="item.label" :value="item.value"></Option>
                                        </Select>
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
                                <Col span="24" v-show="!isEdit">
                                    <Button type="primary" @click="addNew">新增</Button>
                                    <Button type="primary" @click="BatchEdit" style="margin-left:15px;">批量编辑</Button>
                                    <Button type="primary" @click="deleteData" style="margin-left:15px;">删除</Button>
                                </Col>
                                <Col span="24" v-show="isEdit">
                                    <Button type="primary" @click="saveEdit">保存</Button>
                                    <Button type="primary" @click="cancelEdit" style="margin-left:15px;">取消</Button>
                                </Col>
                            </Row>
                            <el-table :row-class-name="tableRowClassName" :data="productDataList" border style="text-align: center"  max-height="570"  @selection-change="handleSelectionChange" @sort-change="manualSort" v-show="!isEdit">
                                <el-table-column show-overflow-tooltip type="selection" :selectable="selectable"></el-table-column>
                                <el-table-column show-overflow-tooltip label="商品分类名称" prop="menu_name" width="240" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip label="URL查询标识" prop="product_category_name" width="240" ></el-table-column>
                                <el-table-column show-overflow-tooltip label="排序" prop="sort" sortable="custom"></el-table-column>
                                <el-table-column show-overflow-tooltip label="状态" prop="status" sortable="custom">
                                    <template slot-scope="scope">
                                        <span>{{allStatusObj[scope.row.status]}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-table :row-class-name="tableRowClassName" :data="productDataList" border style="text-align: center"  max-height="570" @sort-change="manualSort" v-show="isEdit">
                                <el-table-column show-overflow-tooltip label="商品分类名称" prop="menu_name" width="240" sortable="custom">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.menu_name" placeholder="输入商品分类名称"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="URL查询标识" prop="product_category_name" width="240" >
                                    <template slot-scope="scope">
                                        <Select v-model="scope.row.product_category_no" placeholder="输入URL查询标识" filterable transfer v-if="isEdit">
                                            <Option v-for="(item, index) in noAllTypeArr" :key="index" :label="item.cplbmc" :value="item.cplbbh"></Option>
                                        </Select>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="排序" prop="sort" sortable="custom">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.sort" placeholder="输入排序"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="状态" prop="status" sortable="custom">
                                    <template slot-scope="scope">
                                        <Select v-model="scope.row.status" transfer>
                                            <Option v-for="status in noAllStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                        </Select>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Modal v-model="addModal" title="新增商品分类" width="750">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="120" ref="addInfo" :model="addInfo" :rules="ruleValidateAddInfo">
                            <Row>
                                <Col span="24">
                                    <FormItem label="所属上级：">
                                        <span>{{currentActivityName}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="商品分类名称：" prop="menu_name">
                                        <Input v-model="addInfo.menu_name" placeholder="输入商品分类名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="URL查询标识：" prop="product_category_no">
                                        <Select v-model="addInfo.product_category_no" placeholder="输入URL查询标识" ref="urlSelect" clearable  filterable>
                                            <Option v-for="item in noAllTypeArr" :key="item.cplbbh" :label="item.cplbmc" :value="item.cplbbh"></Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="排序：" prop="sort">
                                        <Input v-model="addInfo.sort" placeholder="输入排序" style="width: 50%"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="状态：" prop="status">
                                        <Select v-model="addInfo.status" style="width: 50%">
                                            <Option v-for="status in noAllStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelAdd">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAdd">保存</Button>
            </div>
        </Modal>
        <!--删除弹窗-->
        <Modal v-model='DeletedModal' title="确认删除">
            <p>勾选的商品分类及下级的商品分类将同时删除，确定删除？</p>
            <div slot="footer">
                <Button type="text" @click="deletedCancel">取消</Button>
                <Button type="primary" @click="DeletedGoods">确定</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, operateAllBrandstype, mallAllGoodsCategoryApi, mallAllGoodsCategoryListApi, mallAllGoodsCategoryAddApi, mallAllGoodsCategoryEditApi, mallAllGoodsCategoryDeleteApi } from '@/config/getData';
    import { notempty, manualCheck} from '@/config/mUtils';

    export default {
        data () {
            return {
                spinShow: false,
                addModal: false,
                isEdit: false,
                DeletedModal: false,
                allProductCategory: [],
                productDataList: [],
                productInfo: {
                    menu_name: '',
                    product_category_no: 'all',
                    status: 'all',
                },
                addInfo: {
                    parent_id: '0',
                    menu_name: '',
                    product_category_no: '',
                    sort: '',
                    status: '1'
                },
                ruleValidateAddInfo: {
                    menu_name: [
                        { required: true, message: '输入商品分类名称', trigger: 'blur' }
                    ],
                    product_category_no: [
                        { required: true, message: '输入URL查询标识', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '排序输入错误', trigger: 'blur', pattern: /^[1-9]\d*$/ }
                    ],
                    status: [
                        { required: true, message: '选择状态', trigger: 'blur' }
                    ]
                },
                allStatusArr: [{
                    label: '请选择状态',
                    value: 'all',
                }],
                noAllStatusArr: [],
                allTypeArr: [{
                    cplbmc: '请选择分类',
                    cplbbh: 'all',
                }],
                noAllTypeArr: [],
                currentActivityId: '1',
                currentActivityName: '商品分类',
                expandItemsArr: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                orderDirection: '',
                orderField: '',
                allStatusObj: [],
                maxSort: 0,
                loading: false,
                productSelectedList: [],
            };
        },
        components: {
            pagination
        },
        methods: {
            selectable(row, index) {
                return row.status == '0';
            },
            handleSelectionChange(value) {
                this.productSelectedList = [];
                value.forEach(item => {
                    this.productSelectedList.push(item.id);
                });
            },
            deleteData() {
                if (this.productSelectedList.length <= 0) {
                    this.$Message.error('至少选择一项!');
                    return;
                }
                this.DeletedModal = true;
            },
            deletedCancel() {
                this.DeletedModal = false;
            },
            DeletedGoods() {
                this.spinShow = false;
                mallAllGoodsCategoryDeleteApi(this, {
                    ids: JSON.stringify(this.productSelectedList)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.getData();
                        this.getAllCategory();
                        this.DeletedModal = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            BatchEdit() {
                this.isEdit = true;
            },
            cancelEdit() {
                this.isEdit = false;
                this.getData();
            },
            saveEdit() {
                let sortReg = /^[1-9]\d*$/;
                for (let i = 0; i < this.productDataList.length; i++) {
                    if (!this.productDataList[i].menu_name) {
                        this.$Message.error(`第 ${ i + 1 }行商品名称分类不能为空!`);
                        return;
                    }
                    if (!this.productDataList[i].product_category_no) {
                        this.$Message.error(`第 ${ i + 1 }行URL查询标识类不能为空!`);
                        return;
                    }
                    if (!this.productDataList[i].sort) {
                        this.$Message.error(`第 ${ i + 1 }行排序不能为空!`);
                        return;
                    }
                    if (!sortReg.test(this.productDataList[i].sort)) {
                        this.$Message.error(`第 ${ i + 1 }行排序输入有误!`);
                        return;
                    }
                }
                this.spinShow = false;
                mallAllGoodsCategoryEditApi(this, {
                    params: JSON.stringify(this.productDataList)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getData();
                        this.getAllCategory();
                        this.isEdit = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            getAllCategory() {
                this.spinShow = true;
                mallAllGoodsCategoryApi(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data[0].expand = true;
                        this.allProductCategory = res.data;
                        this.getCurrentExpandItem(this.allProductCategory);
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            getCurrentExpandItem(allTree) {
                for (let i = 0; i < allTree.length; i++) {
                    if (this.expandItemsArr.includes(this.currentActivityId)) {
                        allTree[i].expand = true;
                        return;
                    } else {
                        if (allTree[i].children && allTree[i].children.length > 0 ) {
                            this.getCurrentExpandItem(allTree[i].children);
                        }
                    }
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['cate_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allStatusObj = res.data.cate_status;
                        let tmpObj = {};
                        for (let key in res.data.cate_status) {
                            if (res.data.cate_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cate_status[key]
                                };
                                this.allStatusArr.push(tmpObj);
                                this.noAllStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                /*获取所有产品类别*/
                operateAllBrandstype(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allTypeArr = this.allTypeArr.concat(res.data.list);
                        this.noAllTypeArr = res.data.list;
                    }
                });
            },
            getData() {
                this.spinShow = true;
                mallAllGoodsCategoryListApi(this, {
                    id: this.currentActivityId,
                    params: JSON.stringify({
                        menu_name: this.productInfo.menu_name,
                        product_category_no: this.productInfo.product_category_no == 'all' ? '' : this.productInfo.product_category_no,
                        status: this.productInfo.status == 'all' ? '' : this.productInfo.status,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.productDataList = res.data.list;
                        this.maxSort = 0;
                        this.productDataList.forEach(item => {
                            if (+item.sort > +this.maxSort) {
                                this.maxSort = +item.sort;
                            }
                        });
                        this.addInfo.sort = this.maxSort + 1;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            typeChecked(checkedArr) {
                this.productInfo = {
                    menu_name: '',
                    product_category_no: 'all',
                    status: 'all',
                };
                if (checkedArr.length > 0) {
                    this.currentActivityId = checkedArr[0].value;
                    this.currentActivityName = checkedArr[0].title;
                    this.addInfo.parent_id = checkedArr[0].value;
                    if (!this.expandItemsArr.includes(this.currentActivityId) && checkedArr[0].expand) {
                        this.expandItemsArr.push(this.currentActivityId);
                    }
                    if (this.expandItemsArr.includes(this.currentActivityId) && !checkedArr[0].expand) {
                        let index = this.expandItemsArr.indexOf(this.currentActivityId);
                        this.expandItemsArr.splice(index, this.currentActivityId);
                    }
                    this.search();
                }
            },
            addNew() {
                this.addInfo.menu_name = '';
                this.$refs['urlSelect'].clearSingleSelect();
                this.addInfo.sort = this.maxSort + 1;
                this.addInfo.status = '1';
                this.addModal = true;
            },
            cancelAdd() {
                this.addModal = false;
            },
            confirmAdd() {
                this.$refs['addInfo'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        mallAllGoodsCategoryAddApi(this, {
                            params: JSON.stringify(this.addInfo)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('新增成功!');
                                this.getData();
                                this.getAllCategory();
                                this.addModal = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                })
            },
            search () {
                this.currentPage = 1;
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
            this.getAllCategory();
            this.getData();
        }
    };
</script>