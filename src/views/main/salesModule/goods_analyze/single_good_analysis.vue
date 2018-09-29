<style>
    .analyze-customer .ivu-form .ivu-form-item-label {
        font-size: 16px;
        font-weight: bold;
    }
    .analyze-customer .ivu-form-item-content {
        font-size: 16px;
        font-weight: bold;
        padding-top: 2px;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="stats-bars"></Icon>
                        <span style="color:#cf0012">{{brand_name}}&nbsp;&nbsp;{{series_name}}</span>商品分析
                    </p>
                    <div>
                        <Row>
                            <Col span="24">
                                <Form style="margin-bottom: 20px;">
                                    <search-data @getDateRangeData="customAnalyzeData"></search-data>
                                    <div class="clear"></div>
                                </Form>
                                <div style="padding: 5px;">
                                    <el-table :data="salesData.data" border stripe style="text-align: center" @sort-change="manualSort">
                                        <el-table-column  type="index" :index="indexMethod" label="序号" ></el-table-column>
                                        <el-table-column prop="cpxhbh" label="产品型号编号" ></el-table-column>
                                        <el-table-column prop="cpxh" label="产品型号" ></el-table-column>
                                        <el-table-column prop="cpppmc" label="品牌" ></el-table-column>
                                        <el-table-column prop="cpxl" label="系列" ></el-table-column>
                                        <el-table-column prop="cpdhh" label="订货号" ></el-table-column>
                                        <el-table-column prop="htsl" label="销量"  sortable="custom"></el-table-column>
                                        <el-table-column prop="htje" label="销售额" sortable="custom"></el-table-column>
                                        <el-table-column prop="percentage" label="销售额占比">
                                            <template slot-scope="scope">
                                              <span style="color: #cf0012;">{{scope.row.percentage}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import searchData from '../../../common/search.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiGoodsProductAnalyze } from '@/config/getData';
    import { sortBy} from '@/config/mUtils';
    export default {
        name: 'single_good_analysis',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                salesData1: {
                    title: [],
                    data: []
                },
                page: 1,
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                series_name: this.$route.query.series_name,
                brand_name: this.$route.query.brand_name,
                brand_bh: this.$route.query.cpppbh,
                ajaxHistoryData: [],
                dateRange: ''
            };
        },
        components: {
            searchData,
            pagination
        },
        methods: {
            customAnalyzeData (dataRange) {
                this.dateRange = dataRange;
                this.getData();
            },
            getData () {
                apiGoodsProductAnalyze(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                        brand: this.brand_bh,
                        serial: this.series_name
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
//                        this.salesData.data = res.data.list;
                        this.ajaxHistoryData = res.data.list;
                        this.totalnum = res.data.total_num;
                        if (res.data.total_num < this.limit) {
                            this.salesData.data = this.ajaxHistoryData;
                        } else {
                            this.salesData.data = this.ajaxHistoryData.slice(0, this.limit);
                        }
                        for (let i = 0; i < res.data.list.length; i++) {
                            res.data.list[i].htje = parseFloat(res.data.list[i].htje).toFixed(2);
                            res.data.list[i].percentage = parseFloat(parseFloat(res.data.list[i].htje / res.data.total_htje).toFixed(4) * 100).toFixed(2) + '%';
                        }
                    }
                });
            },
            backTo () {
                this.$store.commit('gobackState', 'goods');
                history.go(-1);
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.salesData.data = this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ajaxHistoryData.sort(sortBy(column.prop, isDec));
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            //排列序号
            indexMethod (index) {
                return  (this.currentPage - 1) * this.limit + index + 1;
            }
        },
        watch: {
            page: function () {
                this.getData();
            },
            limit: function () {
                this.getData();
            }
        },
        created () {
            // 可在此从服务端获取表格数据
//            this.getData();
        }
    };
</script>
