<style>
    
</style>
<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                地址信息
            </p>
            <div slot="extra" v-if="buttonAuth">
                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="addAddress">添加</span>
            </div>
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <el-table :data="applyList" border stripe style="text-align: center" @sort-change="manualSort">
                            <el-table-column type="index" label="行号" sortable="custom"></el-table-column>
                            <el-table-column prop="address_type" label="地址类型">
                                <template slot-scope="scope">
                                    <span>{{addressTypeObj[scope.row.address_type]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="order_no" label="所在地区" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.state_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="full_address" label="详细地址" ></el-table-column>
                            <el-table-column prop="contacter1" label="联系人1 姓名/联系方式" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.contacter1}}/{{scope.row.contacter1_mobile}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="contacter2" label="联系人2 姓名/联系方式" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.contacter2}}/{{scope.row.contacter2_mobile}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" v-if="buttonAuth">
                                <template slot-scope="scope">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;padding-right: 8px;" @click="editItem(scope.row)">编辑</span>
                                    <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.row.id)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10"></pagination> -->
                    </Card>
                </col>
            </Row>
        </Card>
        <Modal v-model="showAddEdit" :title="addOrEdit + '地址'" width="750">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="120" ref="addressDetail" :model="addressDetail" :rules="ruleValidateStorage">
                            <Row>
                                <Col span="24">
                                    <FormItem label="地址类型：" prop="address_type">
                                        <Select v-model="addressDetail.address_type">
                                            <Option v-for="item in addressTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="地址区域信息：" prop="selectdCities">
                                        <Cascader :data="allAddressArr" v-model="addressDetail.selectdCities" filterable @on-change="getCurrentAddress"></Cascader>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="地址详细信息：" prop="full_address">
                                        <Input v-model="addressDetail.full_address" placeholder="请输入详细地址"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="联系人1：" prop="contacter1">
                                        <Input v-model="addressDetail.contacter1" placeholder="请输入联系人1"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="联系方式1：" prop="contacter1_mobile">
                                        <Input v-model="addressDetail.contacter1_mobile" placeholder="请输入联系方式1"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="联系人2：" prop="contacter2">
                                        <Input v-model="addressDetail.contacter2" placeholder="请输入联系人2"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="联系方式2：" prop="contacter2_mobile">
                                        <Input v-model="addressDetail.contacter2_mobile" placeholder="请输入联系方式2"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelOperateLocation">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmOperateLocation">保存</Button>
            </div>
        </Modal> 
        <Modal v-model="showDelete" title="确认删除" @on-ok="confirmDelete">
            <p>确认删除？</p>
        </Modal>         
    </div>
</template>

<script>
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util';
    import {apiMapDetail, apiGetSupplyCoAddress, apiAddSupplyCoAddress, apiEditSupplyCoAddress, apiDeleteSupplyCoAddress, apiAllStatus} from '@/config/getData';
    import { manualCheck } from '@/config/mUtils';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                loading: false,
                buttonAuth: manualCheck('apply_detail_address_all_button'),
                supplyNo: this.$route.query.param,
                showAddEdit: false,
                showDelete: false,
                showDeleteId: '',
                addOrEdit: '新增',
                addressTypeArr: [],
                addressTypeObj: {},
                allAddressArr: [],
                addressDetail: {
                    supplier_no: this.$route.query.param,
                    address_type: '',
                    selectdCities: [],
                    province_no: '',
                    city_no: '',
                    state_no: '',
                    full_address: '',
                    contacter1: '',
                    contacter1_mobile: '',
                    contacter2: '',
                    contacter2_mobile: '',
                },

                applyList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',

                ruleValidateStorage: {
                    address_type: [
                        { required: true, message: '地址类型不能为空', trigger: 'blur' }
                    ],
                    selectdCities: [
                        { required: true, message: '退货地址区域不能为空', trigger: 'blur', type: 'array' }
                    ],
                    full_address: [
                        { required: true, message: '详细地址不能为空', trigger: 'blur'}
                    ],
                    contacter1: [
                        { required: true, message: '联系人1不能为空', trigger: 'blur' }
                    ],
                    contacter1_mobile: [
                        { required: true, message: '联系方式1不能为空', trigger: 'blur'}
                    ],
                    contacter2_mobile: [
                        { required: false, message: '联系方式2不能为空', trigger: 'blur'}
                    ]
                },
            };
        },
        methods: {
            //新增
            addAddress() {
                this.addOrEdit = '新增';
                this.$refs['addressDetail'].resetFields();
                this.showAddEdit = true;
            },
            cancelOperateLocation() {
                this.showAddEdit = false;
            },
            confirmOperateLocation() {
                this.$refs['addressDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.addOrEdit == '新增') {
                            apiAddSupplyCoAddress(this, {
                                params: JSON.stringify(this.addressDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('新增成功!');
                                    this.getSupplyAddressList();
                                    this.showAddEdit = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            apiEditSupplyCoAddress(this, {
                                params: JSON.stringify(this.addressDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.getSupplyAddressList();
                                    this.showAddEdit = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        }
                    }
                });
            },

            // 编辑
            editItem(item) {
                this.addressDetail = item;
                this.addressDetail.selectdCities = [item.province_no, item.city_no, item.state_no];
                this.addOrEdit = '编辑';
                this.showAddEdit = true;
            },

            //删除
            deleteItem(id) {
                this.showDeleteId = id;
                this.showDelete = true;
            },
            confirmDelete() {
                apiDeleteSupplyCoAddress(this, {
                    params: JSON.stringify({
                        id: this.showDeleteId
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.getSupplyAddressList();
                        this.showDelete = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },


            getSupplyAddressList() {
                apiGetSupplyCoAddress(this, {
                    supplier_no: this.supplyNo
                }).then(res => {
                    if (res && res.status == 1) {
                        this.applyList = res.data;
                    }
                });
            },

            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['supplier_address_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.addressTypeObj = res.data.supplier_address_type;
                        for (let key in res.data.supplier_address_type) {
                            if (res.data.supplier_address_type.hasOwnProperty(key)) {
                                this.addressTypeArr.push({
                                    value: key,
                                    label: res.data.supplier_address_type[key]
                                });
                            }
                        }
                    }
                });
            },  
            getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },

            getCurrentAddress(value) {
                [this.addressDetail.province_no, this.addressDetail.city_no, this.addressDetail.state_no] = value;
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
            datetime (time) {
                this.myLaunchTask.datetime = time;
            }
        },
        created () {
            this.getStatus();
            this.getMapDetail();
            this.getSupplyAddressList();
        }
    };
</script>