<template>
    <div style="position: relative">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        商品基础信息
                    </p>
                    <Form inline :label-width="100">
                        <FormItem label="单据备注：" style="width: 100%">
                            <Input type="textarea" v-model="notes" :rows="2" placeholder="请输入单据备注"></Input>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        商品信息
                    </p>
                    <el-table :data="goodsData" border stripe style="text-align: center" max-height="570">
                        <el-table-column prop="brand" label="品牌" width="100"></el-table-column>
                        <el-table-column prop="series" label="通用系列" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="type" label="产品类别" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderNum" label="商品订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="model" label="商品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <!-- <el-table-column prop="xyNum" label="新阳产品编码" ></el-table-column> -->
                        <el-table-column prop="min" label="最小包装数" width="100"></el-table-column>
                        <el-table-column prop="unit" label="计量单位" width="100"></el-table-column>
                        <el-table-column prop="weight" label="净重" width="100"></el-table-column>
                        <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-if="totalnum > 10"></pagination>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <div style="width: 275px;margin: auto;" class="margin-top-10" >
                <Button type="primary" @click="downTemplate">下载模板</Button>
                <!--<Button type="primary" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="clickCSV()">导入</Button>-->
                <Upload :action="importApi" name="file" :format="['csv']" :on-success="handleSuccess" :show-upload-list="false">
                    <Button type="primary" icon="ios-cloud-upload-outline">导入</Button>
                </Upload>
                <Button type="info" :loading="loading"  style="margin-left: 20px;" @click="createNewProduct()">保存</Button>
                </div>
            </Card>
            </Col>
        </Row>
        <input type="file" name="csvfile" id="csv-upload" style="display: none" v-on:change="csvToJson()" />
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import $ from '@/libs/jquery';
    import util from '@/libs/util';
    import Papa from '@/libs/papaparse';
    import pagination from '../../../common/pagination.vue';
    import { createCpxzd,apiImportGoods,apiExportTemplate } from '@/config/getData';
    import {setToken} from '@/config/mUtils';
    export default {
        data () {
            return {
                loading: false,
                isEdit: true,
                goodsData: [],
                allData: [],
                postData: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                notes: '',
                showSpin: false,
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
            };
        },
        components: {
            pagination
        },
        methods: {
            handleSuccess(arr){
                this.showSpin = true;
                this.postData = JSON.parse(JSON.stringify(arr));
                apiImportGoods(this,{
                    params: JSON.stringify(this.postData)
                }).then(res => {
                    if(res && res.status == 1){
                        this.totalnum = res.data.length;
                        this.allData = res.data;
                        this.goodsData = this.allData.slice(0, this.limit);

                    }else{
                        this.$Message.error(res.message + res.data);
                    }
                    this.showSpin = false;
                });
            },
            clickCSV() {
                $('#csv-upload').trigger('click');
            },
            csvToJson() {
                let fileType = $("input[name=csvfile]")[0].files[0].name.slice(-3);
                if (fileType != 'csv') {
                    this.$Message.error('请选择csv文件!');
                    return;
                }
                this.showSpin = true;
                $("input[name=csvfile]").csv2arr(arr => {
                    this.postData = JSON.parse(JSON.stringify(arr));
                    // 去掉表头
                    let temObj = {};
                    let tmpArr = [];
                    arr.splice(0, 1);
                    arr.forEach(item => {
                        temObj = {
                            brand: item[0],
                            series: item[1],
                            name: item[2],
                            type: item[3],
                            orderNum: item[4],
                            model: item[5],
                            xyNum: item[6],
                            min: item[7],
                            unit: item[8],
                            weight: item[9],
                            notes: item[10]
                        };
                        tmpArr.push(temObj);
                    });
                    this.totalnum = tmpArr.length;
                    this.allData = tmpArr;
                    this.goodsData = this.allData.slice(0, this.limit);
                    this.showSpin = false;                
                });
            },


            downTemplate() {

                apiExportTemplate(this, {
                });
            },

            createNewProduct () {
                this.showSpin = true;
                this.loading = true;
                createCpxzd(this, {
                    djbz: this.notes,
                    cpxzdmxs: JSON.stringify(this.allData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        setTimeout(()=> {
                            util.openNewPage(this, 'operate_goods_manage_new_detail', {
                                cpxzdNum: res.cpxzd_djbh
                            });
                            this.$router.push({
                                name: 'operate_goods_manage_new_detail',
                                query: {
                                    cpxzdNum: res.cpxzd_djbh
                                }
                            });
                        }, 1000);
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                    this.loading = false;
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.goodsData = this.allData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
        },
        created() {
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
        }
    };
</script>
