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
                        品牌销售额占比
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <Form style="margin-bottom: 20px;">
                                    <search-data @getDateRangeData="customAnalyzeData"></search-data>
                                    <div class="clear"></div>
                                </Form>
                                <div style="padding: 5px;">
                                    <el-table :data="salesData.data" height="350" border stripe style="text-align: center">
                                        <el-table-column prop="rank" label="排名" ></el-table-column>
                                        <el-table-column label="品牌">
                                            <template slot-scope="scope">
                                                <Button  @click="handleClick(scope.row)" type="text" size="small"><span style="color: rgb(45, 140, 240)">{{scope.row.cpppmc}}</span></Button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="htje" label="销售额"></el-table-column>
                                        <el-table-column prop="percentage" label="占比">
                                            <template slot-scope="scope">
                                              <span style="color: #cf0012;">{{scope.row.percentage}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </Col>
                            <Col span="12">
                                <div  style="margin-top:-30px;">
                                    <pie-circle :diyDomIndex="0" title="品牌销售额占比" :data="seriesCircleData"></pie-circle>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="stats-bars"></Icon>
                    品牌销售额趋势
                </p>
                <div>
                    <Row>
                        <Col span="24">
                        <Form style="margin-bottom: 20px;">
                            <search-data @getDateRangeData="getBrandSalesTrendList"></search-data>
                            <div class="clear"></div>
                        </Form>
                        <multi-bar-chart :diyDomIndex="1" title="品牌销售额趋势" @changeSelectd="replaceSelected" :data="brandLineBarAmount" :date="DateAmount" :selected="selectedBrand"></multi-bar-chart>
                        </Col>
                    </Row>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import searchData from '../../../common/search.vue';
    import pieCircle from '../../components/pieCircle.vue';
    import multiBarChart from '../../components/multiBarChart.vue';
    import { apiGoodsBrandAnalyze, getBrandSalesTrend } from '@/config/getData';
    import { getPercentWithPrecision } from '@/config/mUtils';
    export default {
        name: 'brand_analyze',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                brandLineBarAmount: [],
                DateAmount: [],
                seriesCircleData: [],
                selectedBrand: {},
                totalnum: 40,
                dateRange: ''
            };
        },
        components: {
            searchData,
            pieCircle,
            multiBarChart
        },
        methods: {
            handleClick (row) {
                let argu = { cpppmc: row.cpppmc, cpppbh: row.cpppbh };
                this.$router.push({
                    name: 'goods_brand_series_analyze',
                    query: argu
                });
            },
            customAnalyzeData (dateRange) {
                this.dateRange = dateRange;
                this.getData();
            },
            getData () {
                apiGoodsBrandAnalyze(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.seriesCircleData = [];
                        this.salesData.data = res.data.list;
                        let tmpArr = [];
                        let tmpPercent = [];
                        for (let i = 0; i < this.salesData.data.length; i++) {
                            tmpArr.push(this.salesData.data[i].htje);
                        }
                        tmpPercent = tmpArr.map((val, index) => getPercentWithPrecision(tmpArr, index, 2));
                        for (let i = 0; i < this.salesData.data.length; i++) {
                            this.salesData.data[i].percentage = tmpPercent[i] + '%';
                            //品牌占比图形
                            this.seriesCircleData.push({value: this.salesData.data[i].htje, name: this.salesData.data[i].cpppmc});
                        }
                    }
                });
            },
            getBrandSalesTrendList (dateRange) {
                getBrandSalesTrend(this, {
                    params: JSON.stringify({"starttime": dateRange[0] + " 00:00:00","endtime": dateRange[1] + " 23:59:59"})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.brandLineBarAmount = [];
                        this.DateAmount = res.data.data_list;
                        for (let key in res.data.cpppxh) {
                            this.brandLineBarAmount.push({
                                name: key,
                                type: 'line',
                                stack: key,
                                data: res.data.cpppxh[key]
                            });
                        }
                        if (Object.keys(this.selectedBrand).length == 0) {
                            for (let key in res.data.cpppxh) {
                                if (key == '施耐德') {
                                    this.selectedBrand[key] = true;
                                } else {
                                    this.selectedBrand[key] = false;
                                }
                            }
                            
                        }
                    }
                })
            },
            replaceSelected (newSelected) {
                this.selectedBrand = newSelected;
            }
        },
        created () {
            //打开日期共享
            this.$store.commit('broadcastShareState', true);
            if (this.$store.state.isGoback != 'goods') {
                this.$store.commit('broadcastSharedDateRange', JSON.parse(JSON.stringify(this.$store.state.watchWeekArr)));
                this.$store.commit('changeCurrentTab', 2);
            }
        }
    };
</script>
