<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="info.column_name" placeholder="输入栏目名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="info.column_type"  placeholder="请选择栏目类型" filterable @on-change="search">
                                <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Col span="24" style="margin-bottom: 10px;">
                    <Button v-show="!isEdit" type="primary" v-auth="column_add_auth" @click="add">新建</Button>
                    <Button v-show="!isEdit" type="primary" v-auth="column_edit_auth" @click="edit">编辑</Button>
                    <Button v-show="isEdit" type="primary" v-auth="column_edit_auth" @click="editSave">保存</Button>
                    <Button v-show="isEdit" type="primary" v-auth="column_edit_auth" @click="editCancel">取消</Button>
                    <Button v-show="!isEdit" type="primary" v-auth="column_del_auth" @click="del">删除</Button>
                </Col>
                <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" width="1300"  v-show="!isEdit"> 
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="column_name" label="栏目名称" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.column_name}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column prop="column_type" label="栏目类型" show-overflow-tooltip sortable="custom"> 
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{typeSelectArr[scope.row.column_type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.sort}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :row-class-name="tableRowClassName" :data="orderData" border style="text-align: center" @sort-change="manualSort" width="1300" v-show="isEdit">
                    <el-table-column prop="column_name" label="栏目名称">
                        <template slot-scope="scope">
                            <Input v-if="isEdit" v-model="scope.row.column_name" placeholder="请输入栏目名称"></Input>
                        </template>
                    </el-table-column>
                     <el-table-column prop="column_type" label="栏目类型">
                        <template slot-scope="scope">
                            <Select v-if="isEdit" v-model="scope.row.column_type"  placeholder="请选择栏目类型" filterable transfer>
                                <Option v-for="item in typeCopyArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序">
                        <template slot-scope="scope">
                            <Input v-if="isEdit" v-model="scope.row.sort" placeholder="请输入排序"></Input>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='is_add' :title="'新建栏目'" :mask-closable=false :width="350" class="orderForm-approvePass">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="80" ref="addDetail" :model="addDetail" :rules="ruleValidateRegion">
                            <Row>
                                <Col span="24">
                                    <FormItem label="类型：" prop="column_type">
                                        <Select v-model="addDetail.column_type"  placeholder="请选择栏目类型" filterable>
                                            <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                   <FormItem label="栏目：" prop="column_name">
                                        <Input v-model="addDetail.column_name" placeholder="请输入栏目名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="排序：" prop="sort">
                                        <Input v-model="addDetail.sort" placeholder="排序"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="addCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="addSure">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showDelete" title="确认删除"  @on-ok="confirmDelete">
            <p>是否确认删除勾选的数据?</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiGetColumnList,apiAllStatus,apiAddColumn,apiColumnEditSave,apiColumnDel} from '@/config/getData';
    import { notempty, sortBy,setToken, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default { 
        data () {
            return {
                column_add_auth:"column_add_auth",
                column_edit_auth:"column_edit_auth",
                column_del_auth:"column_del_auth",
                default_sort:1,
                isEdit:false,
                info: {
                    column_name: '',
                    column_type: 'all',
                },
                addDetail:{
                    column_name:'',
                    column_type:'',
                    sort:'',
                },
                typeArr:[{
                    value: 'all',
                    label: '选择栏目类型'
                }],
                typeCopyArr:[],
                showDelete: false,
                orderData:[],
                loading: false,
                orderField: 'sort',
                orderDirection: 'asc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                spinShow: false,
                multipleInfo:[],
                multipleSelection:[],
                typeSelectArr:[],
                is_add:false,
                ruleValidateRegion: {
                    column_type: [
                        { required: true, message: '栏目类型不能为空', trigger: 'blur' }
                    ],
                    column_name: [
                        { required: true, message: '栏目名称不能为空', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '排序不能为空', trigger: 'blur' }
                    ]
                },
            };
        },
        components: {
            pagination
        },
        methods: {
            selectOne (selection, row) {
                this.multipleInfo = [];
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row))) {
                    this.multipleSelection.push(row);
                }
                if (!row.checked && this.multipleSelection.includes(row)) {
                    let index = this.multipleSelection.indexOf(row);
                    this.multipleSelection.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.orderData.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            add(){
                this.addDetail.sort = this.default_sort.toString();
                this.is_add = true;
            },
            addCancel(){
                this.$refs.addDetail.resetFields();
                this.is_add = false;
            },
            addSure(){
                this.$refs.addDetail.validate((valid) => {
                    if (valid) {
                        let sortReg = /^[1-9]\d*$/;
                        if (!sortReg.test(this.addDetail.sort)) {
                            this.$Message.error(`排序输入有误!`);
                            return;
                        }
                        this.loading = true;
                        apiAddColumn(this,{
                            params: JSON.stringify({
                                column_type: this.addDetail.column_type,
                                column_name: this.addDetail.column_name,
                                sort: this.addDetail.sort,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                //成功
                                this.is_add = false;
                                this.$Message.success('新建成功');
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                });
            },
            edit(){
                this.isEdit = true;
            },
            editCancel(){
                this.isEdit = false;
                this.getData();
            },
            editSave(){
                let sortReg = /^[1-9]\d*$/;
                for (let i = 0; i < this.orderData.column_name; i++) {
                    if (!this.orderData[i].menu_name) {
                        this.$Message.error(`第 ${ i + 1 }行栏目名称不能为空!`);
                        return;
                    }
                    if (!this.orderData[i].menu_type) {
                        this.$Message.error(`第 ${ i + 1 }行栏目类型不能为空!`);
                        return;
                    }
                    if (!sortReg.test(this.orderData[i].sort)) {
                        this.$Message.error(`第 ${ i + 1 }行排序输入有误!`);
                        return;
                    }
                }

                apiColumnEditSave(this, {
                    params: JSON.stringify(this.orderData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getData();
                        this.isEdit = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            del(){
                if(this.multipleSelection.length < 1){
                    this.$Message.error('请至少选择一项');
                    return;
                }else{
                    this.showDelete = true;
                }
            },
            confirmDelete() {
                apiColumnDel(this, {
                    params: JSON.stringify(this.multipleSelection)
                }).then(res => {
                    if (res && res.status == 1) {
                        if(res.message == ''){
                            this.$Message.success('删除成功!');
                        }else{
                            this.$Message.error('成功删除'+res.data.succ+'条,'+'</br>'+res.message);
                        }
                        this.reset();
                        this.showDelete = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['article_column_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.typeSelectArr = res.data.article_column_type;
                        let tmpObj = {}; 
                        for (let key in res.data.article_column_type) {
                            if (res.data.article_column_type.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.article_column_type[key]
                                };
                                this.typeArr.push(tmpObj);
                                this.typeCopyArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                this.spinShow = true;
                apiGetColumnList(this,{
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        column_name: this.info.column_name,
                        column_type: this.info.column_type === 'all'?'' : this.info.column_type,
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        let arr = [];
                        res.data.list.list.forEach(item => {
                            arr.push(parseInt(item.id));
                        });
                        this.default_sort = +res.data.id_max + +1;
                        this.orderData = res.data.list.list;
                        this.totalnum = res.data.list.totalCount;
                        this.spinShow = false;

                        this.$nextTick(() => {
                            this.orderData.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                    }else{
                        this.$Message.error(res.message);
                    }
                });},
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.info.column_name = '';
                this.info.column_type = 'all';
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
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
                this.orderDirection = column.order == "descending" ? 'asc' : 'desc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
        },
        created () {
            this.getStatus();
            this.getData();
        },
};
</script>

