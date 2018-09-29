<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                        <Col span="24">
                            <Button type="primary" @click="addNew">新增</Button>
                        </Col>
                    </Row>
                    <el-table :data="dataList" border stripe style="text-align: center;width: 100%"  max-height="570" @sort-change="manualSort" >
                        <el-table-column show-overflow-tooltip label="活动名称" prop="recommend_name"></el-table-column>
                        <el-table-column show-overflow-tooltip label="图片路径" prop="pic_path">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="showPicture(scope.row.pic_path, scope.row.recommend_name)">{{scope.row.pic_path}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="链接地址" prop="url_path"></el-table-column>
                        <el-table-column show-overflow-tooltip label="排序" prop="sort" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="状态" prop="status" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{allStatusObj[scope.row.status]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="editItem(scope.$index)">编辑</span>
                                <span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 15px;" v-if="scope.row.status == 0" @click="deleteItem(scope.row.id)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addModal" :title="isAddModal == 1 ? '新增' : '编辑'" width="750">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100" ref="addInfo" :model="addInfo" :rules="ruleValidateAddInfo">
                            <Row>
                                <Col span="24">
                                    <FormItem label="活动名称：" prop="recommend_name">
                                        <Input v-model="addInfo.recommend_name" placeholder="输入活动名称" @on-enter="search"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="图片上传：">
                                        <Upload :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic" style="float: left;">
                                            <Button type="success" icon="ios-cloud-upload-outline">上传图片</Button>
                                        </Upload>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="图片路径："  prop="pic_path">
                                        <span>{{addInfo.pic_path}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="链接地址：">
                                        <Input v-model="addInfo.url_path" placeholder="输入链接地址" @on-enter="search"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="排序：" prop="sort">
                                        <Input v-model="addInfo.sort" placeholder="输入排序" @on-enter="search" style="width: 50%"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="状态：" prop="status">
                                        <Select v-model="addInfo.status" style="width: 50%">
                                            <Option v-for="status in allStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelAddOrEdit">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAddOrEdit">保存</Button>
            </div>
        </Modal>
        <Modal v-model="pickPicModal" :title="currentPicInfo.name" width="600">
            <Row>
                <col span="24">
                    <div style="width:100%" v-if="pickPicModal">
                        <img :src="currentPicInfo.url" :alt="currentPicInfo.name" style="width: 100%;height: auto;">
                    </div>
                </col>
            </Row>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="showDelete" title="确认删除">
            <p>确认删除?</p>
            <div slot="footer">
                <Button type="text" @click="cancelDelete">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmDelete">保存</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, mallActivityListApi, mallActivityAddApi, mallActivityEditApi, mallActivityDeleteApi } from '@/config/getData';
    import { setToken, manualCheck} from '@/config/mUtils';

    export default {
        data () {
            return {
                dataList: [],
                addModal: false,
                addInfo: {
                    recommend_name: '',
                    pic_path: '',
                    url_path: '',
                    sort: '',
                    id: '',
                    status: '1'
                },
                isAddModal: 1, // 1：新增， 2： 编辑
                pickPicModal: false,
                currentPicInfo: {
                    name: '',
                    url: ''
                },
                ruleValidateAddInfo: {
                    recommend_name: [
                        { required: true, message: '输入图片名称', trigger: 'blur' }
                    ],
                    pic_path: [
                        { required: true, message: '请上传图片', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '排序输入错误', trigger: 'blur', pattern: /^[1-9]\d*$/ }
                    ],
                    status: [
                        { required: true, message: '选择状态', trigger: 'blur' }
                    ]
                },
                uploadUrl: this.baseUrl + '/v1/mall/recommend/upload?token=' + setToken(),
                spinShow: false,
                orderField: '',
                orderDirection: '',
                allStatusObj: [],
                allStatusArr: [],
                loading: false,
                maxSort: 0,
                showDelete: false,
            };
        },
        methods: {
            addNew() {
                this.isAddModal = 1;
                this.addInfo.recommend_name = '';
                this.addInfo.pic_path = '';
                this.addInfo.url_path = '';
                this.addInfo.sort = this.maxSort + 1;
                this.addInfo.status = '1';
                this.addInfo.id = '';
                this.addModal = true;
            },
            editItem(index) {
                this.isAddModal = 0;
                this.addInfo.recommend_name = this.dataList[index].recommend_name;
                this.addInfo.pic_path = this.dataList[index].pic_path;
                this.addInfo.url_path = this.dataList[index].url_path;
                this.addInfo.sort = this.dataList[index].sort;
                this.addInfo.status = this.dataList[index].status;
                this.addInfo.id = this.dataList[index].id;
                this.addModal = true;
            },
            deleteItem(index) {
                this.addInfo.id = index;
                this.showDelete = true;
            },
            cancelDelete() {
                this.showDelete = false;
            },
            confirmDelete() {
                this.loading = true;
                mallActivityDeleteApi(this, {
                    id: this.addInfo.id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.getData();
                        this.showDelete = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            getData(){
                this.spinShow = true;
                mallActivityListApi(this, {
                    params: JSON.stringify({
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList = res.data.list;
                        this.maxSort = 0;
                        this.dataList.forEach(item => {
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
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['recommend_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allStatusObj = res.data.recommend_status;
                        let tmpObj = {};
                        this.allStatusArr = [];
                        for (let key in res.data.recommend_status) {
                            if (res.data.recommend_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.recommend_status[key]
                                };
                                this.allStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            showPicture(url, name) {
                this.currentPicInfo.name = name;
                this.currentPicInfo.url = this.imgURL + url;
                this.pickPicModal = true;
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.getData();
            },
            displayPic(res, file, fileList) {
                this.addInfo.pic_path = res.data.url;
                this.$refs['addInfo'].validate();
            },
            cancelAddOrEdit() {
                this.addModal = false;
            },
            confirmAddOrEdit() {
                this.$refs['addInfo'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        // 新增接口
                        if (this.isAddModal == 1) {
                            mallActivityAddApi(this, {
                                params: JSON.stringify(this.addInfo)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('上传成功!');
                                    this.getData();
                                    this.addModal = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            //编辑接口
                            mallActivityEditApi(this, {
                                params: JSON.stringify(this.addInfo)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.getData();
                                    this.addModal = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        }
                    }
                })
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>