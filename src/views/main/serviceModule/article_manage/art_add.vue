<style>
    .art_add .ivu-card-body {
        margin-bottom: -25px;
    }
</style>

<template>
    <div style="position: relative" class="diy-opcity ">
        <Row style="z-index:99999;" class="art_add">
            <Col span="24">
            <Card>
                <Form :model="info" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="info.title" placeholder="输入文章标题"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="info.column_no"  placeholder="请选择栏目" filterable>
                                <Option v-for="item in columnArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <FormItem label="栏目类型：">
                                {{ typeSelectArr[column_type] }}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <div id="operate-edit"></div>
            </Card>
            </Col>
        </Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 88888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:150px;" @click="saveAdd()">保存</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;" @click="saveCancel()">取消</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    let E = require('wangeditor');
    let editor;
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus,apiArtSave,apiGetColumnList} from '@/config/getData';
    import { notempty, sortBy,setToken, manualCheck, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    export default { 
        data () {
            return {
                isEdit:false,
                column_type: this.$route.query.param,
                info: {
                    title: '',
                    column_no: '',
                    content:'',
                },
                columnArr:[],
                columnSelectArr:[],
                releaseSelectArr:[],
                is_add:false,
                typeSelectArr:[],
            };
        },
        methods: {
            getEditor () {
                let tmpBaseUrl = this.imgURL;

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
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['article_column_type'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.typeSelectArr = res.data.article_column_type;
                    }
                });

                apiGetColumnList(this, {
                    params: JSON.stringify({
                        is_list:1,
                        column_type:this.column_type,
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
            },
            saveCancel(){
                history.go(-1);
            },
            saveAdd(){
                this.info.content = editor.txt.html();
                apiArtSave(this,{
                    params: JSON.stringify(this.info)
                }).then(res =>{
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        closeCurrentPage(this);
                        util.openNewPage(this, 'article_detail',{
                            param: res.data.id
                        });
                        this.$router.push({
                            name: 'article_detail',
                            query: {
                                id: res.data.id,
                                type: this.column_type,
                            },
                        });
                    }else{
                        this.$Message.error(res.message);
                        // this.getStatus();
                    }
                });
            },
        },
        created () {
            this.getStatus();
        },
        mounted(){
            this.getEditor();
        },
};
</script>

