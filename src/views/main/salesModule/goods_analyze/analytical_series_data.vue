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
                        <span style="color:#cf0012">{{brand_name}}</span>团队销售额分布
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
                                        <el-table-column prop="depart_name" label="团队名称" ></el-table-column>
                                        <el-table-column prop="htje" label="销售额"></el-table-column>
                                        <el-table-column label="占比">
                                            <template slot-scope="scope">
                                                <span style="color: #cf0012;">{{scope.row.percentage}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </Col>
                            <Col span="12">
                                <div  style="margin-top:-30px;">
                                    <pie-circle :diyDomIndex="0" :title="brand_name + '团队销售额分布'" :data="teamCircleData"></pie-circle>
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
                        <span style="color:#cf0012">{{brand_name}}</span>系列分析
                    </p>
                    <div>
                        <Row>
                            <Col span="12">
                                <Form style="margin-bottom: 20px;">
                                    <search-data @getDateRangeData="seriesData"></search-data>
                                    <div class="clear"></div>
                                </Form>
                                <div style="padding: 5px;">
                                    <el-table :data="seriesTab.data" height="350" border stripe style="text-align: center">
                                        <el-table-column prop="rank" label="排名" ></el-table-column>
                                        <el-table-column label="系列">
                                            <template slot-scope="scope">
                                                <span  @click="handleClick(scope.row)" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer">{{scope.row.cpxl}}</span></span>
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
                                <div>
                                    <pie-circle :diyDomIndex="1" :title="brand_name + '系列占比'" :data="seriesCircleData"></pie-circle>
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
    import pieCircle from '../../components/pieCircle.vue';
    import { apiGoodsBrandTeamAnalyze, apiGoodsBrandSeriesAnalyze } from '@/config/getData';
    import { getPercentWithPrecision } from '@/config/mUtils';
    export default {
        name: 'analytical_series_data',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                seriesTab: {
                    title: [],
                    data: []
                },
                teamCircleData: [],
                seriesCircleData: [],
                totalnum: 40,
                brand_name: this.$route.query.cpppmc,
                brand_bh: this.$route.query.cpppbh,
                dateRange: '',
                dateFromto: ''
            };
        },
        components: {
            searchData,
            pieCircle
        },
        methods: {
            handleClick (row) {
                let argu = {series_name: row.cpxl, brand_name: this.$route.query.cpppmc, cpppbh: this.brand_bh};
                this.$router.push({
                    name: 'single_good_analysis',
                    query: argu
                });
            },
            customAnalyzeData (dataRange) {
                this.dateRange = dataRange;
                apiGoodsBrandTeamAnalyze(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                        brand: this.brand_bh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.teamCircleData = [];
                        this.salesData.data = res.data.list;
                        let tmpArr = [];
                        let tmpPercent = [];
                        for (let i = 0; i < this.salesData.data.length; i++) {
                            tmpArr.push(this.salesData.data[i].htje);
                        }
                        tmpPercent = tmpArr.map((val, index) => getPercentWithPrecision(tmpArr, index, 2));
                        for (let i = 0; i < this.salesData.data.length; i++) {
                            this.salesData.data[i].percentage = tmpPercent[i] + '%';
                            //品牌团队销售额占比图形
                            this.teamCircleData.push({value: this.salesData.data[i].htje, name: this.salesData.data[i].depart_name});
                        }
                    }
                });
            },
            seriesData (dataRange) {
                this.dateFromto = dataRange;
                apiGoodsBrandSeriesAnalyze(this, {
                    params: JSON.stringify({
                        starttime: this.dateFromto[0] + ' 00:00:00',
                        endtime: this.dateFromto[1] + ' 23:59:59',
                        brand: this.brand_bh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.seriesCircleData = [];
                        this.seriesTab.data = res.data.list;
                        let tmpArr = [];
                        let tmpPercent = [];
                        for (let i = 0; i < this.seriesTab.data.length; i++) {
                            tmpArr.push(this.seriesTab.data[i].htje);
                        }
                        tmpPercent = tmpArr.map((val, index) => getPercentWithPrecision(tmpArr, index, 2));
                        for (let i = 0; i < this.seriesTab.data.length; i++) {
                            this.seriesTab.data[i].percentage = tmpPercent[i] + '%';
                            //品牌系列分析占比图形
                            this.seriesCircleData.push({value: this.seriesTab.data[i].htje, name: this.seriesTab.data[i].cpxl});
                        }
                    }
                });
            },
            backTo () {
                this.$store.commit('gobackState', 'goods');
                history.go(-1);
            }
        },
        created () {
            // 可在此从服务端获取表格数据
        }
    };
</script>
