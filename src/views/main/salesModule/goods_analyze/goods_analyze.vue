<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="stats-bars"></Icon>
                        商品销售分析
                    </p>
                    <Form inline :label-width="60">
                        <FormItem label="品牌：" style="float: left">
                            <Select v-model="brand" style="width:200px;" placeholder="请选择品牌" @on-change="chooseBrand" filterable>
                                <Option v-for="name in brandArr" :value="name.cpppbh" :key="name.cpppbh">{{ name.cpppmc }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="系列：" style="float: left">
                            <Select v-model="series" style="width:200px;" placeholder="请选择系列" filterable>
                                <Option v-for="(name, index) in seriesArr" :value="seriesArr[index]" :key="seriesArr[index]">{{ seriesArr[index]}}</Option>
                            </Select>
                        </FormItem>
                        <search-data style="margin-left:-70px;" @getDateRangeData="customAnalyzeData"></search-data>
                        <div class="clear"></div>
                    </Form>
                    <el-table :data="salesData.data" border stripe style="text-align: center" @sort-change="manualSort">
                        <el-table-column type="index" :index="indexMethod" label="序号" ></el-table-column>
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
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import searchData from '../../../common/search.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiGoodsProductAnalyze, apiAllBrands, apiAllSeries } from '@/config/getData';
    import {getStore, setStore, sortBy} from '@/config/mUtils';
    export default {
        name: 'goods_analyze',
        components: {
            searchData,
            pagination
        },
        data () {
            return {
                customer_name: '',
                customerName: [
                    {
                        key: '1',
                        label: 'aknsdkakdad'
                    },
                    {
                        key: '2',
                        label: 'xsdvbskfs'
                    }
                ],
                brand: 'all',
                brandArr: [{
                    cpppbh: 'all',
                    cpppmc: '全部'
                }],
                series: '',
                seriesArr: ['全部'],
                salesData: {
                    title: [],
                    data: []
                },
                page: 1,
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                ajaxHistoryData: [],
                dateRange: ''
            };
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
                        brand: this.brand == 'all' ? '' : this.brand,
                        serial: this.series == '全部' ? '' : this.series
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
            getBrand () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.brandArr = this.brandArr.concat(res.data);
                    }
                });
            },
            //选择品牌后
            chooseBrand (cpppbh) {
                this.series = '全部';
                this.seriesArr = ['全部']
                apiAllSeries(this, {
                    cpppbh: JSON.stringify([cpppbh])
                }).then(res => {
                    if (res && res.status == 1) {
                       this.seriesArr = this.seriesArr.concat(res.data);
                    }
                });
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
            // 初始化日期范围/当前页,关闭日期共享
            this.$store.commit('broadcastShareState', false);
            this.$store.commit('changeCurrentTab', 2);
            this.getBrand();
        }
    };
</script>