<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="140" >
                    <Row>
                        <Col span="8">
                        <FormItem label="产品订货号：">
                            <Input v-model="form.cpdhh" placeholder="请输入产品订货号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="品牌：">
                            <Select v-model="form.brand"  placeholder="请选择" @on-change="selectBrand" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in brand_list" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="系列：">
                            <Select v-model="form.series"  placeholder="请选择" :disabled="cpxl" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="(value,index) in series_list" :value="value" :key="value">{{ value }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品编号：">
                            <Input v-model="form.cpbh" placeholder="请输入产品编号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品型号编号：">
                            <Input v-model="form.cpxhbh" placeholder="请输入产品型号编号" @on-enter="search"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="创建人：">
                            <Select v-model="form.create_no"  placeholder="请选择" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in sales_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="采购员编号：">
                            <Select v-model="form.purchase_user_no"  placeholder="请选择" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in sales_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="备货员编号：">
                            <Select v-model="form.stock_user_no"  placeholder="请选择" filterable>
                                <Option value="all">全部</Option>
                                <Option v-for="status in sales_list" :value="status.user_no" :key="status.user_no">{{ status.user_name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8" style="text-align: center;margin-bottom:0;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
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
                    <Col span="24">
                    <a href="http://static.yidian-dev.com/buy/template/product_user.csv"><Button type="primary">下载模板</Button></a>
                    <Button type="primary" @click="csvToJson()">Excel导入</Button>
                    <Button type="primary" @click="deleteit()">删除</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll">
                    <el-table-column
                            type="selection"
                            width="55" :selectable="canSelect" fixed>
                    </el-table-column>
                    <el-table-column prop="product_order_no" label="产品订货号" sortable="custom"></el-table-column>
                    <el-table-column prop="product_model_no" label="产品型号编号" sortable="custom"></el-table-column>
                    <el-table-column prop="brand_name" label="品牌名称" sortable="custom"></el-table-column>
                    <el-table-column prop="product_no" label="产品编号" sortable="custom"></el-table-column>
                    <el-table-column prop="product_series" label="产品系列" sortable="custom"></el-table-column>
                    <el-table-column prop="create_user_no" label="创建人" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}}&nbsp;/&nbsp;{{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_depart_id" label="创建人部门" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.create_depart_id}}&nbsp;/&nbsp;{{scope.row.create_depart_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchase_user_no" label="采购员" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.purchase_user_no}}&nbsp;/&nbsp;{{scope.row.purchase_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock_user_no" label="备货员" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.stock_user_no}}&nbsp;/&nbsp;{{scope.row.stock_user_name}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
            </Card>
            </Col>
        </Row>
        <div id="csv-upload-div" style="display:none">
            <input type="file" name="csvfile" id="csv-upload" />
        </div>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
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
    </div>
</template>
<script type="text/ecmascript-6">
    import $ from '@/libs/jquery';
    import Papa from '@/libs/papaparse';
    import pagination from '../../../../common/pagination.vue';
    import { purchaseCpPartyList,apiAllBrands,apiAllSeries,purchaseCpPartyDelete,purchaseCpPartyAdd,purchaseGetSales } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_CP_index',
        data () {
            return {
                showSucessInfo: false,
                showSpin: false,
                cpxl: true,
                form: {
                    cpdhh: '',                  //产品订货号
                    brand: 'all',               //品牌
                    series: 'all',              //系列
                    cpbh: '',                   //产品编号
                    cpxhbh: '',                 //产品型号编号
                    create_no: 'all',           //创建人
                    purchase_user_no: 'all',    //采购员编号
                    stock_user_no: 'all',       //备货员编号
                },
                series_list: [],                //系列列表
                sales_list: [],                 //销售列表
                brand_list: [],                 //品牌列表

                orderData: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                multipleSelection: [],
            };
        },
        components: {
            pagination
        },
        methods: {
            hasKnow () {
                this.showSucessInfo = false;
            },
            //获取角色所属员工
            getSales () {
                purchaseGetSales(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.sales_list = res.data.list;
                    }
                });
            },
            csvToJson() {
                $('#csv-upload').trigger('click');
                $('#csv-upload').on('change', () => {
                    let fileType = $("input[name=csvfile]")[0].files[0].name.slice(-3);
                    if (fileType != 'csv') {
                        this.$Message.error('请选择csv文件!');
                        return;
                    }
                    this.showSpin = true;
                    $("input[name=csvfile]").csv2arr(arr => {
                        purchaseCpPartyAdd(this, {
                            data: JSON.stringify(JSON.parse(JSON.stringify(arr)))
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success(res.message);
                                if (res.data.wrong_list && res.data.wrong_list.length > 0) {
                                    this.successInfoMsg = [];
                                    this.successInfoMsg = res.data.wrong_list;
                                    this.showSucessInfo = true;
                                }
                                this.reset();
                            } else {
                                this.$Message.error(res.message);
                            }
                            $('#csv-upload').remove();
                            $('#csv-upload-div').html('<input type="file" name="csvfile" id="csv-upload" />');
                            this.showSpin = false;
                        });
                    });
                });
            },
            //删除所选行
            deleteit () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择单据');
                } else {
                    let list = {};
                    list = JSON.stringify({
                        ids: this.multipleSelection
                    });
                    purchaseCpPartyDelete(this, {
                        params: list
                    }).then(res => {
                        if (res && res.status == 1){
                            this.$Message.success(res.message);
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            //选择品牌
            selectBrand () {
                apiAllSeries(this, {
                    cpppbh: JSON.stringify(this.form.brand)
                }).then(res => {
                    if(res && res.status == 1){
                        this.series_list = res.data;
                        this.cpxl = false;
                    }
                });
            },
            //获取所有品牌
            getAllBrand () {
                apiAllBrands(this, {

                }).then(res => {
                    if(res && res.status == 1){
                        this.brand_list = res.data;
                    }
                });
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            //获取列表数据
            getData () {
                purchaseCpPartyList(this,{
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        brand: this.form.brand == 'all' ? '' : this.form.brand,                                         //品牌
                        series: this.form.series == 'all' ? '' : this.form.series,                                      //系列
                        cpbh: this.form.cpbh,                                                                           //产品编号
                        cpxhbh: this.form.cpxhbh,                                                                       //产品型号编号
                        cpdhh: this.form.cpdhh,                                                                         //产品订货号
                        create_no: this.form.create_no == 'all' ? '' : this.form.create_no,                             //创建人
                        purchase_user_no: this.form.purchase_user_no == 'all' ? '' : this.form.purchase_user_no,        //采购员编号                                           //采购员编号
                        stock_user_no: this.form.stock_user_no == 'all' ? '' : this.form.stock_user_no,                 //备货员编号
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            //搜索
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getData();
            },
            //重置
            reset () {
                this.form.brand = 'all';
                this.form.series = 'all';
                this.form.cpbh = '';
                this.form.cpxhbh = '';
                this.form.create_no = 'all';
                this.form.purchase_user_no = '';
                this.form.stock_user_no = '';

                this.orderField = '';              //排序字段
                this.orderDirection = 'desc';      //排序顺序
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            //获取所有品牌
            this.getAllBrand();

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
        activated () {
            //获取列表数据
            this.getData();
            //获取人员
            this.getSales();
        }
    };
</script>
