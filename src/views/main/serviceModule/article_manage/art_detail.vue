<style>
    .art_detail .ivu-form-item-content {
        line-height: 30px;
    }
    .art_detail .ivu-form-item {
        margin-bottom: 2px;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity art_detail">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="info" :label-width="120" v-show="!isEdit">
                    <Row>
                        <Col span="6">
                            <FormItem label="标题名称：">
                                {{ info.title }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="栏目名称：">
                                {{columnSelectObj[info.column_no]}}
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="栏目类型：">
                                {{ typeSelectArr[type] }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="更新时间：">
                                {{ info.update_time }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="发布状态：">
                                {{ releaseSelectArr[info.is_release]}}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="发布时间：">
                                {{ info.release_time }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Form :model="info" :label-width="120" v-show="isEdit">
                    <Row>
                        <Col span="6">
                            <FormItem label="标题名称：">
                                <Input v-model="info.title" placeholder="输入文章标题"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="栏目名称：">
                                <Select v-model="info.column_no"  placeholder="请选择栏目" filterable>
                                    <Option v-for="item in columnArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem label="栏目类型：">
                                {{ typeSelectArr[type] }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="更新时间：">
                                {{ info.update_time }}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="发布状态：">
                                {{ releaseSelectArr[info.is_release]}}
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="发布时间：">
                                {{ info.release_time }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" style="margin-bottom: 64px;">
            <Col span="24">
            <Card>
                    <div v-show="!isEdit" v-html="imgContent"></div>
                    <div v-show="isEdit" id="operate-edit"></div>
            </Card>
            </Col>
        </Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>

                    <div v-show="!toRelease">
                        <Button type="primary" class="margin-top-10" style="margin:auto;" @click="back()">返回</Button>
                        <Button type="primary" class="margin-top-10" style="margin:auto;" v-auth="article_detail_release" @click="unRelease()">取消发布</Button>
                    </div>
                    <div v-show="toRelease">
                        <div v-show="!can_edit">
                            <Button type="primary" class="margin-top-10" style="margin:auto;" @click="back()">返回</Button>
                            <Button type="primary" class="margin-top-10" style="margin:auto;" v-auth="article_detail_edit" @click="edit()">修改</Button>
                            <Button type="primary" v-if="toRelease" class="margin-top-10" style="margin:auto;" v-auth="article_detail_release" @click="release()">发布</Button>
                        </div>
                        <div v-show="can_edit">
                            <Button type="primary" class="margin-top-10" style="margin:auto;" @click="back()">返回</Button>
                            <Button type="default" v-auth="article_detail_edit" @click="editCancel()">取消</Button>
                            <Button type="primary" v-auth="article_detail_edit" @click="editSave()">保存</Button>
                        </div>
                    </div> 
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    let E = require('wangeditor');
    let editor;
    import pagination from '../../../common/pagination.vue';
    import { apiArtDetail,apiArtEditSave,apiGetColumnList,apiArtRelease,apiAllStatus} from '@/config/getData';
    import { notempty, sortBy,setToken, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default { 
        data () {
            return {
                article_detail_edit:"article_detail_edit",
                article_detail_release:"article_detail_release",
                isEdit:false,
                can_edit:false,
                id: this.$route.query.id,
                type: this.$route.query.type,
                info: {
                    title: '',
                    column_no: '',
                    is_release:'',
                    release_time: '',
                    update_time:'',
                    content:'',
                },
                toRelease:true,
                columnArr:[],
                typeSelectArr:[],
                columnSelectObj:{},
                releaseSelectArr:[],
                is_add:false,
                imgContent:'',
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
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['article_column_type','article_is_release'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.releaseSelectArr = res.data.article_is_release;
                        this.typeSelectArr = res.data.article_column_type;
                    }
                });

                apiGetColumnList(this, {
                    params: JSON.stringify({
                        is_list:1,
                        column_type:this.type,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            this.columnSelectObj[item.column_no] = item.column_name;
                        });
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
            },
            back() {
                history.go(-1);
            },
            release(){
                let query = [this.$route.query.id, this.$route.query.type].join(',');
                apiArtRelease(this,{
                    params: JSON.stringify({
                        id: this.id,
                        is_release: 'release',
                        url: query,
                    })
                }).then(res =>{
                    if (res && res.status == 1) {
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            unRelease(){
                apiArtRelease(this,{
                    params: JSON.stringify({
                        id: this.id,
                        is_release: 'unRelease',
                    })
                }).then(res =>{
                    if (res && res.status == 1) {
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            edit(){
                this.isEdit = true;
                this.can_edit = true;
            },
            editCancel(){
                this.isEdit = false;
                this.can_edit = false;
            },
            editSave(){
                this.info.content = editor.txt.html();
                apiArtEditSave(this,{
                    params: JSON.stringify(this.info)
                }).then(res =>{
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.isEdit = false;
                        this.can_edit = false;
                        this.getData();
                        this.getStatus();
                        this.getEditor();
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            getData () {
                apiArtDetail(this,{
                    id: this.id,
                }).then(res =>{
                    if (res && res.status == 1) {
                        this.info = res.data;
                        this.imgContent = res.data.content;
                        if(res.data.is_release == 0){
                            this.toRelease = true;
                        }else{
                            this.toRelease = false;
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            getEditor () {
                let tmpBaseUrl = this.imgURL;
                apiArtDetail(this,{
                    id: this.id,
                }).then(res =>{
                    if (res && res.status == 1) {
                        //成功
                        editor = new E('#operate-edit');
                        editor.customConfig.uploadImgServer = this.baseUrl + '/v1/mall/art/upload?' + 'token=' + setToken();
                        editor.customConfig.uploadFileName  = 'myFileName[]';
                        editor.customConfig.uploadImgHooks = {
                            customInsert: function (insertImg, result, editor) {
                                if (typeof result.data.url == 'string') {
                                    let url =  tmpBaseUrl + result.data.url;
                                    insertImg(url);
                                } else {
                                    result.data.url.forEach(item => {
                                        let url =  tmpBaseUrl + item;
                                        insertImg(url);
                                    });
                                }
                                
                            }
                        };
                        editor.create();
                        editor.txt.html(res.data.content);
                    }
                });
            },
        },
         
        created () {
            this.getData();
            this.getStatus();
            this.getEditor();
        },
        watch: {
            '$route' () {
                this.id = this.$route.query.id;
                this.getData();
            }
        }
};
</script>

