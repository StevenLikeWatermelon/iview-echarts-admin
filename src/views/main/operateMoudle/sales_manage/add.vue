<style>
    .sale_manage_msg {
        color: red;
    }
</style>

<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    活动基本信息
                </p>
                <Form :label-width="120" :model="limitForm" ref="limitForm" :rules="limitRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="活动名称：" prop="act_name">
                            <Input v-model="limitForm.act_name" placeholder="请输入活动名称" style="width:300px;" @on-change="changeTrue"></Input>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="活动时间：" prop="datetime">
                            <DatePicker type="datetimerange" placeholder="请选择活动时间" :value='limitForm.datetime' @on-change="datetime" style="width:300px;"></DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="图片：" prop="imgSrc">
                            <div v-if="limitForm.imgSrc"><img :src="this.imgURL + limitForm.imgSrc" width="120" style="border:1px solid #eee;"></div>
                            <div style="height:32px;">
                                <Upload :action="uploadUrl"
                                        :format="['jpg', 'png', 'jpeg']"
                                        :on-format-error="handleFormatError"
                                        :on-success="handleSuccess"
                                        :show-upload-list="false">
                                    <Button type="primary" icon="ios-cloud-upload-outline" style="width: 120px;">上传 图片</Button>
                                </Upload>
                            </div>
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
                <p slot="title" class="card-title">
                    导入活动商品
                </p>
                <div>
                    <Row class="margin-bottom-10">
                        <Col span="24">
                            <Upload :action="importApi" name="file" :format="['csv']" :on-success="bulkImport" :on-format-error="bulkImportError" :show-upload-list="false" style="margin-right:0;">
                                <Button type="primary" icon="ios-cloud-upload-outline">批量导入</Button>
                            </Upload>
                            <Button type="primary" @click="templateDown" style="margin-left:10px;">模板下载</Button>
                        </Col>
                    </Row>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" :index="indexMethod" label="行号"></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号" sortable="custom" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" sortable="custom" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxhmj" label="商品面价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.cpxhmj == '0.00'}">{{ scope.row.cpxhmj }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="discount" label="限时折扣" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="sale_price" label="特卖价格" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column label="秒杀库存" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.stock_num > scope.row.actual_num}">{{ scope.row.stock_num }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="actual_num" label="实际库存" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="lead_time" label="货期" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="zszt" label="在售状态" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.zszt == '0'}">{{ zsztStatus[scope.row.zszt] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>-->
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary"  class="margin-top-10" style="margin:auto;margin-left:20px;" @click="save" :disabled="is_right">保存</Button>
            </Card>
            </Col>
        </Row>
        <div id="goods-upload-div" style="display:none">
            <input type="file" name="goodsCsvFile" id="goods-upload"/>
        </div>
        <!--导入提示弹框-->
        <Modal v-model="showSucessInfo" width="400" :closable="true" :mask-closable="true">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p v-for="item in successInfoMsg">{{item}}</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="hasKnow()">知道了</Button>
            </div>
        </Modal>
        <!--弹框-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">保存该条活动</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction('cancel')">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction('sure')">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import $ from '@/libs/jquery';
    import Papa from '@/libs/papaparse';
    import pagination from '../../../common/pagination.vue';
    import { apiGetSalesLimitTimeAdd, apiGetSalesLimitProImport, apiGetSalesLimitGoodsDetail,apiAllStatus, apiGetSalesLimitTimeTemplate } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';

    export default {
        data () {
            const nameValid = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入活动名称'));
                } else if (value.length < 2 || value.length > 20) {
                    return callback(new Error('活动名称在2 ~ 20 个字符之间'));
                } else {
                    callback();
                }
            };
            const timeValid = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入活动时间'));
                } else {
                    callback();
                }
            };
            const imgValid = (rule, value, callback) => {
                if (this.limitForm.imgSrc === '') {
                    return callback(new Error('请选择活动图片'));
                } else {
                    callback();
                }
            };
            return {
                limitForm: {
                    act_name: '',
                    datetime: '',
                    imgSrc: ''
                },
                actTable: {
                    data: []
                },
                act_id: '',
                currentPage: 1,
                limit: 10,
                zsztStatus:[],
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                limitRules: {
                    act_name: [
//                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { validator: nameValid, trigger: 'blur'}
                    ],
                    datetime: [
//                        { required: true, message: '请输入活动时间', trigger: 'on-change' },
                        { validator: timeValid, trigger: 'on-change'}
                    ],
                    imgSrc: [
                        { validator: imgValid, trigger: 'on-change'}
//                       { required: true, message: '请上传活动图片', trigger: 'on-change' }
                    ]
                },
                publicModal: false,
                loadding: false,
                uploadUrl: this.baseUrl + '/v1/activity/seckill/upload-pic?token=' + setToken(),
                showSucessInfo: false,
                successInfoMsg: [],
                isShow: false,
                is_right: false,
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
            };
        },
        components: {
            pagination
        },
        methods: {

            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['zszt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.zsztStatus = res.data.zszt;

                    }
                });
            },

            changeTrue () {
                this.is_right = false;
            },
            getData () {
                //活动商品
                apiGetSalesLimitGoodsDetail(this, {
                    params: JSON.stringify(this.notempty({
                        id: this.act_id,
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    }))
                }).then(res => {
                    if (res && res.status == 1){
                        this.actTable.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            save () {
                this.$refs['limitForm'].validate((valid) => {
                    if (valid) {
                        this.publicModal = true;
                        this.loadding = false;
                    }
                });
            },
            sureAction (name) {
                if (name === 'cancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'sure') {
                    this.loadding = true;

                    let listSend = [];
                    this.actTable.data.forEach(item => {
                        listSend.push({
                            cpdhh: item.cpdhh,
                            discount: item.discount,
                            stock_num:item.stock_num
                        });
                    });

                    apiGetSalesLimitTimeAdd(this, {
                        params: JSON.stringify(this.notempty({
                            promote_name: this.limitForm.act_name,
                            start_time: this.limitForm.datetime[0],
                            end_time: this.limitForm.datetime[1],
                            promote_img: this.limitForm.imgSrc
                        })),
                        info: JSON.stringify({
                        list: listSend
                    })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.act_id = res.data.id;
                            this.publicModal = false;
                            this.isShow = true;
                            this.is_right = true;
                            //this.getData();
                            let argu =  {param: this.act_id} ;

                            this.$router.push({
                                name: 'operate_sales_limit_time_detail',
                                query: argu
                            });

                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loadding = false;
                    });
                }
            },
            templateDown() {
                apiGetSalesLimitTimeTemplate(this, {});
            },
            bulkImport (arr) {
                this.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                apiGetSalesLimitProImport(this, {
                    id: this.act_id,
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.actTable.data = res.data.list;
                        if (res.data.error_msg && res.data.error_msg.length > 0) {
                            this.successInfoMsg = [];
                            this.successInfoMsg = res.data.error_msg;
                            this.showSucessInfo = true;
                        } else {
                            this.$Message.success('导入成功!');
                        }
                    } else {
                        this.$Message.error({content: res.data, duration: 5});
                    }
                });
            },
            hasKnow () {
                this.showSucessInfo = false;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            bulkImportError(file){
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请选择csv文件。'
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                    this.limitForm.imgSrc = response.data.url;
                    this.is_right = false;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                    this.$refs['limitForm'].validate((valid) => {
                        if (valid) {}
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
            },
            datetime (time) {
                this.is_right = false;
                this.limitForm.datetime = time;
//                console.log(this.limitForm.act_time, 'aaa');
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
            indexMethod (index) {
                return  (this.currentPage - 1) * this.limit + index + 1;
            },
            backTo () {
                history.go(-1);
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            }
        },
        beforeCreate() {
            /**
             * csv file to 2D arr
             * */
            $.fn.csv2arr = function( callback ){
                if( typeof(FileReader) == 'undefined' ){    //if not H5
                    alert("IE9及以下浏览器不支持，请使用Chrome或Firefox浏览器\nYour browser is too old,please use Chrome or Firefox");
                    return false;
                }
                if( ! $(this)[0].files[0]){
                    alert("请选择文件\nPlease select a file");
                    return false;
                }
                var fReader = new FileReader();
                fReader.readAsDataURL( $(this)[0].files[0] );
                window.$fileDOM = $(this);
                fReader.onload = function(evt){
                    var data = evt.target.result;
                    //      console.log( data );
                    var encoding = checkEncoding( data );
                    //      console.log(encoding);
                    //转换成二维数组，需要引入Papaparse.js
                    Papa.parse( $($fileDOM)[0].files[0], {
                        encoding: encoding,
                        complete: function(results) {       // UTF8 \r\n与\n混用时有可能会出问题
                            //              console.log(results);
                            var res = results.data;
                            if( res[ res.length-1 ] == ""){ //去除最后的空行
                                res.pop();
                            }
                            callback && callback( res );
                        }
                    });
                }
                fReader.onerror = function(evt){
                    //      console.log(evt);
                    alert("文件已修改，请重新选择(Firefox)\nThe file has changed,please select again.(Firefox)");
                }

                //检查编码，引用了 jschardet
                function checkEncoding( base64Str ){
                    //这种方式得到的是一种二进制串
                    var str = atob( base64Str.split(";base64,")[1] );
                    //      console.log(str);
                    //要用二进制格式
                    var encoding = jschardet.detect( str );
                    encoding = encoding.encoding;
                    //      console.log( encoding );
                    if( encoding == "windows-1252"){    //有时会识别错误（如UTF8的中文二字）
                        encoding = "ANSI";
                    }
                    return encoding;
                }
            }
        },
        created () {
            this.getStatus();
//            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            }
        }
    };
</script>
