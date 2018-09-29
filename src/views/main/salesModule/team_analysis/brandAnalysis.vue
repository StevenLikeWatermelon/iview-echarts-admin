<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row>
                    <Col span="12">
                    <span>团队名称： {{$route.query.teamName}}</span>
                    <span style="margin-left:50px;">团队主管： {{$route.query.managerName}}</span>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>

        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form inline :label-width="80"  class="model-style">
                    <Row>
                        <Col span="4">
                        <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getTeamSalesBrand"  style="width: 100%;"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24" style="text-align: center">
            <Card>
                <Row>
                    <el-table :data="teamData.data" border stripe row-class-name="table-height">
                        <el-table-column prop="rank"  label="排名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ckje" label="出库金额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="htje" label="销售额" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="percentage" label="占比" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span style="color: #cf0012;">{{scope.row.percentage}}%</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Row>
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
    import Cookies from 'js-cookie';
    import pieCircle from '../../components/pieCircle.vue';
    import { apiCustAnalyzeSalesAmount, getSalesCondition,TeamSalesBrand, personsInTeamSales } from '@/config/getData';
    import { getPercentWithPrecision, getStore,getSpecialDateRange } from '@/config/mUtils';
    export default {
        name: 'team_analysis-analyticalData',
        data () {
            return {
                teamData: {
                    title: [],
                    data: []
                },
                isService: '销售人员',
                dateRange: getSpecialDateRange(),
                teamCircleData: [],
                Total:[],
            };
        },
        methods: {
            backTo () {
                this.$store.commit('gobackState', 'team');
                history.go(-1);
            },
            getTeamSalesBrand (dateRange) {
                if (dateRange) {
                    this.dateRange = dateRange;
                }
                TeamSalesBrand(this, {
                    params: JSON.stringify({"starttime": this.dateRange[0] + ' 00:00:00',"endtime": this.dateRange[1] + ' 23:59:59', "depart_id": this.$route.query.depart_id})
                }).then(res => {
                    if (res && res.status == 1) {
                        this.teamCircleData = [];
                        let tmpArr = [], tmpPercent = [];
                        res.data.list.forEach(item => {
                            tmpArr.push(item.htje);
                        });
                        tmpPercent = tmpArr.map((val, index) => getPercentWithPrecision(tmpArr, index, 2));
                        res.data.list.forEach((item, index) => {
                            item.percentage = tmpPercent[index];
                            this.teamCircleData.push({value: item.htje, name: item.cpppmc});
                        });
                        this.teamData.data = res.data.list;
                    }
                });
            },
        },
        created () {
            this.getTeamSalesBrand();
        }
    };
</script>
