<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="info.title" placeholder="输入标题" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="info.column_no"  placeholder="请选择栏目" filterable @on-change="search">
                                <Option v-for="item in columnArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="info.is_release"  placeholder="是否发布" filterable @on-change="search">
                                <Option v-for="item in releaseArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择发布时间" :value="info.release_time" @on-change="changeDatetime" style="width:100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                            <DatePicker type="datetimerange" placeholder="选择更新时间" :value="info.update_time" @on-change="changeDatetime_update" style="width:100%;"></DatePicker>
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
                    <Button v-show="!isEdit" type="primary" v-auth="notice_add_auth" @click="add">新建</Button>
                    <Button v-show="!isEdit" type="primary" v-auth="notice_edit_auth" @click="edit">编辑</Button>
                    <Button v-show="isEdit" type="primary" v-auth="notice_edit_auth" @click="editSave">保存</Button>
                    <Button v-show="isEdit" type="primary" v-auth="notice_edit_auth" @click="editCancel">取消</Button>
                    <Button v-show="!isEdit" type="primary" v-auth="notice_del_auth" @click="del">删除</Button>
                </Col>
                <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" width="1300"  v-show="!isEdit"> 
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="title" label="标题" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit" @click="handleClick(scope.row.id, 'article_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.title}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="column_name" label="栏目" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.column_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_release" label="发布状态" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{releaseSelectArr[scope.row.is_release]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="release_time" label="发布时间" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.release_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_time" label="更新时间" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.update_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="art_sort" label="排序" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.art_sort}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :row-class-name="tableRowClassName" :data="orderData" border style="text-align: center" @sort-change="manualSort" width="1300" v-show="isEdit">
                    <el-table-column prop="title" label="标题" sortable="custom">
                        <template slot-scope="scope">
                            <span v-if="isEdit">{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="column_name" label="栏目" sortable="custom">
                        <template slot-scope="scope">
                            <span v-if="isEdit">{{scope.row.column_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_release" label="发布状态" sortable="custom">
                        <template slot-scope="scope">
                            <span v-if="isEdit">{{releaseSelectArr[scope.row.is_release]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="release_time" label="发布时间" sortable="custom">
                        <template slot-scope="scope">
                            <span v-if="isEdit">{{scope.row.release_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_time" label="更新时间" sortable="custom">
                        <template slot-scope="scope">
                            <span v-if="isEdit">{{scope.row.update_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="art_sort" label="排序">
                        <template slot-scope="scope">
                            <Input v-if="isEdit" v-model="scope.row.art_sort" placeholder="请输入排序"></Input>
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
    import { apiGetArtList,apiAllStatus,apiAddColumn,apiArtListEditSave,apiArtDel,apiGetColumnList} from '@/config/getData';
    import { notempty, sortBy,setToken, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default { 
        data () {
            return {
                notice_add_auth:"notice_add_auth",
                notice_edit_auth:"notice_edit_auth",
                notice_del_auth:"notice_del_auth",
                isEdit:false,
                info: {
                    column_no: 'all',
                    title: '',
                    is_release:'all',
                    release_time:'',
                    update_time:'',
                },
                addDetail:{
                    column_name:'',
                    column_type:'',
                    sort:'',
                },
                typeArr:[{
                    value: 'all',
                    label: '选择栏目'
                }],
                releaseArr:[{
                    value: 'all',
                    label: '是否发布'
                }],
                showDelete: false,
                orderData:[],
                loading: false,
                orderField: 'art_sort',
                orderDirection: 'asc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                spinShow: false,
                multipleInfo:[],
                multipleSelection:[],
                typeSelectArr:[],
                releaseSelectArr:[],
                columnArr:[{
                    value: 'all',
                    label: '选择栏目'
                }],
                columnSelectArr:[],
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
            handleClick (param, path) {
                util.openNewPage(this, path, {id:param,type:3});
                this.$router.push({
                    name: path,
                    query: {id:param,type:3}
                });
            },
            changeDatetime (time) {
                this.info.release_time = time;
                this.search();
            },
            changeDatetime_update (time) {
                this.info.update_time = time;
                this.search();
            },
            add(){
                util.openNewPage(this, 'article_add');
                this.$router.push({
                    name: 'article_add',
                    query: {
                                param: 3
                            },
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
                    if (!sortReg.test(this.orderData[i].sort)) {
                        this.$Message.error(`第 ${ i + 1 }行排序输入有误!`);
                        return;
                    }
                }

                apiArtListEditSave(this, {
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
                apiArtDel(this, {
                    params: JSON.stringify(this.multipleSelection)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.error('成功删除'+res.data.succ+'条</br>'+res.message);
                        this.reset();
                        this.showDelete = false;
                    }
                });
            },
            getStatus () {
                apiGetColumnList(this, {
                    params: JSON.stringify({
                        is_list:1,
                        column_type:3,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                            this.columnSelectArr = res.data.list;
                            let tmpObj = {}; 
                            res.data.list.forEach(item => {
                                tmpObj = {
                                        value: item.column_no,
                                        label: item.column_name
                                    };
                                    this.columnArr.push(tmpObj);
                            });
                        
                    }
                });

                apiAllStatus(this, {
                    type: JSON.stringify(['article_column_type','article_is_release'])
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
                            }
                        }

                        this.releaseSelectArr = res.data.article_is_release;
                        let tmpObjcp = {}; 
                        for (let key in res.data.article_is_release) {
                            if (res.data.article_is_release.hasOwnProperty(key)) {
                                tmpObjcp = {
                                    value: key,
                                    label: res.data.article_is_release[key]
                                };
                                this.releaseArr.push(tmpObjcp);
                            }
                        }
                    }
                });
            },
            getData () {
                this.spinShow = true;
                apiGetArtList(this,{
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        type:3,
                        title:this.info.title,
                        column_no: this.info.column_no === 'all'?'' : this.info.column_no,
                        is_release: this.info.is_release === 'all'?'' : this.info.is_release,                    
                        release_time_start: this.info.release_time[0],
                        release_time_end: this.info.release_time[1],
                        update_time_start: this.info.update_time[0],
                        update_time_end: this.info.update_time[1],
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData = res.data.list;
                        this.totalnum = res.data.totalCount;
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
                this.info.column_no = 'all';
                this.info.is_release = 'all';
                this.info.title = '';
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

