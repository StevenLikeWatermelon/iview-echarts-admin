<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="6">
            <Card>
                <Tree :data="productData" @on-select-change="typeChecked"></Tree>
            </Card>
            </Col>
            <Col span="18" class="padding-left-10">
            <Row>
                <Col span="24">
                <Card>
                    <Form :model="orderInfo" :label-width="120" class="model-style">
                        <Row>
                            <Col span="4">
                            <Input v-model="orderInfo.product_no" placeholder="输入产品系列编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Input v-model="orderInfo.product_type" placeholder="输入产品类别" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                            <Select v-model="orderInfo.state" placeholder="请选择" @on-change="search">
                                <Option v-for="item in cplbArr" :key="item.value" :label="item.label" :value="item.value"></Option>
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
                    <Row class="margin-bottom-10" v-auth="buttonShow">
                        <Col span="24">
                        <Button type="primary" @click="addNew">新增</Button>
                        </Col>
                    </Row>
                    <el-table :data="orderData.data" border stripe style="text-align: center"  max-height="570">
                        <el-table-column label="上级类别编号" prop="up_cplbbh" width="140" >
                            <template slot-scope="scope">
                                <span>{{scope.row.up_cplbbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="up_cplbmc" label="上级类别名称"  show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="is_edit[scope.$index]">{{scope.row.up_cplbmc}}</span>
                                <Select v-model="scope.row.up_cplbbh" placeholder="请选择" filterable v-else transfer>
                                    <Option v-for="item in allProductTypeArr" :key="item.cplbbh" :value="item.cplbbh">{{ item.cplbmc }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column label="产品类别编号" prop="cplbbh" width="140" ></el-table-column>
                        <el-table-column prop="cplbmc" label="产品类别名称" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="is_edit[scope.$index]">{{scope.row.cplbmc}}</span>
                                <Input v-model="scope.row.cplbmc" placeholder="请填写产品类别名称" v-else></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" width="150">
                            <template slot-scope="scope">
                                <span v-if="is_edit[scope.$index]">{{ cplbzt[scope.row.state] }}</span>
                                <Select v-model="scope.row.state" placeholder="请选择" size="small" v-else transfer>
                                    <Option v-for="item in cplbState" :key="item.value" :value="item.value">{{ item.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="is_true" width="150">
                            <template slot-scope="scope">

                                <span style="color: rgb(45, 140, 240);cursor: pointer;" v-if="is_edit[scope.$index]" @click="edit(scope.$index)">修改</span>
                                <div v-else>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="remove(scope.$index)">取消</span>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left:20px;" @click="save(scope.$index)">保存</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                </Card>
                </Col>
            </Row>
            </Col>
        </Row>
        <Modal v-model="addModal" :mask-closable=false :width="400">
            <h3 slot="header">产品类别新增</h3>
            <Form :model="addProduct" :label-width="120" ref="addForm" :rules="addRules">
                <FormItem label="上级类别编号：" style="margin:0;">
                    <span>{{ addProduct.sjlbbh }}</span>
                </FormItem>
                <FormItem label="上级类别名称：" style="margin:20px 0 0;" prop="sjlbbh">
                    <Select v-model="addProduct.sjlbbh" placeholder="请选择" style="width:200px;" filterable>
                        <Option v-for="item in allProductTypeArr" :key="item.cplbbh" :value="item.cplbbh">{{ item.cplbmc }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品类别名称：" style="margin:20px 0 0;" prop="cplbmc">
                    <Input v-model="addProduct.cplbmc" placeholder="请填写产品类别名称" style="width:200px;"></Input>
                </FormItem>
                <FormItem label="状态：" style="margin:20px 0 0;" prop="state">
                    <Select v-model="addProduct.state" placeholder="请选择" style="width:200px;">
                        <Option v-for="item in cplbState" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" :loading="loading" @click="sure">确定</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetProductTypeObtain, apiGetProductTypeList, operateAllBrandstype, apiGetProductTypeListInfo, apiGetProductTypeModify, apiGetProductTypeAdd } from '@/config/getData';
    import { notempty, manualCheck} from '@/config/mUtils';

    export default {
        data () {
            return {
                buttonShow: 'type_list_add_all_button',
                productData: [],
                orderInfo: {
                    product_no: '',
                    product_type: '',
                    state: 'all'
                },
                orderData: {
                    data: []
                },
                spinShow: true,
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                unlockStatus: '',
                unlockStatusArr: [],
                is_edit: [],
                addModal: false,
                addProduct: {
                    sjlbbh: '',
                    sjlbmc: '',
                    state: '',
                    cplbmc: ''
                },
                options: [],
                value: '',
                cplbzt: [],
                cplbArr: [
                    {
                        value: 'all',
                        label: '选择状态'
                    }
                ],
                cplbState: [],
                productTypeArr: [],
                allProductTypeArr: [],
                cplbbh_parent: '',
                addRules: {
                    sjlbbh: [
                        { required: true, message: '请选择上级类别名称', trigger: 'on-change' }
                    ],
                    cplbmc: [
                        { required: true, message: '请填写类别名称', trigger: 'blur' }
                    ],
                    state: [
                        { required: true, message: '请选择状态', trigger: 'on-change' }
                    ]
                },
                loading: false,
                spinShow: true,
                is_true: true,
                is_left_choosed: false
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['cplb_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cplbzt = res.data.cplb_state;
                        let tmpObj = {};
                        for (let key in res.data.cplb_state) {
                            if (res.data.cplb_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cplb_state[key]
                                };
                                this.cplbArr.push(tmpObj);
                                this.cplbState.push(tmpObj);
                            }
                        }
                    }
                });
                /*获取所有产品类别*/
                operateAllBrandstype(this, {
                    type: 'all'
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allProductTypeArr = res.data.list;
                        this.spinShow = false;
                    }
                });
            },
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getProductType () {
                apiGetProductTypeObtain(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.productData = res.data;
                        this.productData[0].expand = true;
                    }
                });
            },
            getData () {
                apiGetProductTypeList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        cplbbh: this.orderInfo.product_no,
                        cplbmc: this.orderInfo.product_type,
                        state: this.orderInfo.state === 'all' ? '' : this.orderInfo.state
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        for (let i = 0; i < this.totalnum; i++) {
                            this.is_edit[i] = true;
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getInfo () {
                apiGetProductTypeListInfo(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        cplbbh: this.cplbbh_parent
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        for (let i = 0; i < this.totalnum; i++) {
                            this.is_edit[i] = true;
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            edit (index) {
                this.is_edit.splice(index, 1, false);
            },
            save (index) {
                apiGetProductTypeModify(this, {
                    params: JSON.stringify({
                        cplbbh: this.orderData.data[index].cplbbh,
                        cplbmc: this.orderData.data[index].cplbmc,
                        up_cplbbh: this.orderData.data[index].up_cplbbh,
                        state: this.orderData.data[index].state
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.is_edit.splice(index, 1, true);
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            remove (index) {
                this.is_edit.splice(index, 1, true);
                this.getInfo();
            },
            typeChecked (value) {
                if(value.length != 0){
                    this.is_left_choosed = true;
                    this.productTypeArr = value;
                    this.cplbbh_parent = this.productTypeArr[0].cplbbh;
                    this.getInfo();
                }

            },
            addNew () {
                this.addModal = true;
                this.addProduct.cplbmc = '';
                this.addProduct.sjlbbh = '';
                this.addProduct.state = '';
            },
            cancel () {
                this.addModal = false;
                this.addProduct.cplbmc = '';
                this.addProduct.sjlbbh = '';
                this.addProduct.state = '';
            },
            sure () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        apiGetProductTypeAdd(this, {
                            params: JSON.stringify({
                                cplbmc: this.addProduct.cplbmc.trim(),
                                up_cplbbh: this.addProduct.sjlbbh,
                                state: this.addProduct.state
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                this.addModal = false;
                                this.loading = false;
                                this.getData();
                            } else {
                                this.loading = false;
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            search () {
                this.is_left_choosed = false;
                this.currentPage = 1;
                this.getData();
                this.getProductType();
            },
            reset () {
                this.orderInfo.product_no = '';
                this.orderInfo.product_type = '';
                this.orderInfo.state = 'all';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                if (this.is_left_choosed == false) {
                    this.getData();
                } else {
                    this.getInfo();
                }
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                if (this.is_left_choosed == false) {
                    this.getData();
                } else {
                    this.getInfo();
                }
            }
        },
        created () {
            this.getStatus();
            this.getProductType();
            this.getData();
            this.is_true = manualCheck(this.buttonShow);
        }
    };
</script>