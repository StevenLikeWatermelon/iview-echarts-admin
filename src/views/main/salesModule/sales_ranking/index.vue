<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="stats-bars"></Icon>
                    销售排行
                </p>
                <Form inline>
                    <search-data @getDateRangeData="getPersonsInTeamList"></search-data>
                    <div class="clear"></div>
                </Form>
                <Row>
                    <Col span="12">
                    <pie-circle :diyDomIndex="0" title="订单额占比" :data="personalOrderSalesCircle"></pie-circle>
                    </Col>
                    <Col span="12">
                    <pie-circle :diyDomIndex="1" title="支付总额占比" :data="personalPaidSalesCircle"></pie-circle>
                    </Col>
                    <Col span="24" class="margin-top-10" style="text-align: center" >
                        <el-table :data="salesData.data" border stripe row-class-name="table-height" @sort-change="manualSort">
                            <el-table-column prop="rank" label="排名" sortable="custom" sort-by="rank"></el-table-column>
                            <el-table-column  label="销售人员" >
                                <template slot-scope="scope">
                                    <Button  @click="handleClick(scope.row)" type="text" size="small"><span style="color: rgb(45, 140, 240)">{{scope.row.user_name}}</span></Button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="order_amount" label="订单总额" sortable="custom"></el-table-column>
                            <el-table-column prop="paid_amount" label="支付总额" sortable="custom"></el-table-column>
                            <el-table-column prop="allpercentage" label="订单总额占比">
                                <template slot-scope="scope">
                                  <span style="color: #cf0012;">{{scope.row.allpercentage}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="paidPercent" label="支付总额占比">
                                <template slot-scope="scope">
                                  <span style="color: #cf0012;">{{scope.row.paidPercent}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalNum" :current="currentPage"></pagination>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import searchData from '../../../common/search.vue';
    import pieCircle from '../../components/pieCircle.vue';
    import pagination from '../../../common/pagination.vue';
    import { personsInTeamSales } from '@/config/getData';
    import { getPercentWithPrecision, sortBy } from '@/config/mUtils';
    export default {
        name: 'salesRanking-index',
        data () {
            return {
                salesData: {
                    title: [],
                    data: []
                },
                totalNum: 0,
                limit: 10,
                currentPage: 1,
                originData: [],
                personalOrderSalesCircle: [],
                personalPaidSalesCircle: []
            };
        },
        components: {
            searchData,
            pagination,
            pieCircle
        },
        methods: {
            handleClick(row) {
                let argu = { user_no: row.user_no, user_name: row.user_name };
                this.$router.push({
                    name: 'sales_analytical_data',
                    query: argu
                });
            },
            getPersonsInTeamList (dateRange) {
                personsInTeamSales(this, {
                    date_from: dateRange[0] + ' 00:00:00',
                    date_to: dateRange[1] + ' 23:59:59',
                    user_list: "all_sales_depart"
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpAllArr = [], tmpPaidArr = [], tmpAllPercent = [], tmpPaidPercent = [];
                        this.personalOrderSalesCircle = [];
                        this.personalPaidSalesCircle = [];
                        this.totalNum = res.data.user.length; //目前后端不传总数，前端只能通过判断length取值，后续如有风险请找后端jiangming
                        res.data.user.forEach(item => {
                            tmpAllArr.push(item.order_amount);
                            tmpPaidArr.push(item.paid_amount);
                        });
                        tmpAllPercent = tmpAllArr.map((val, index) => getPercentWithPrecision(tmpAllArr, index, 2));
                        tmpPaidPercent = tmpPaidArr.map((val, index) => getPercentWithPrecision(tmpPaidArr, index, 2));
                        res.data.user.forEach((item, index) => {
                            item.allpercentage = tmpAllPercent[index] + '%';
                            item.paidPercent = tmpPaidPercent[index] + '%';
                            this.personalOrderSalesCircle.push({value: item.order_amount, name: item.user_name});
                            this.personalPaidSalesCircle.push({value: item.paid_amount, name: item.user_name});
                        });
                        this.originData = JSON.parse(JSON.stringify(res.data.user));
                        this.salesData.data = this.originData.slice(0, this.limit);
                    }
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.salesData.data = this.originData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.originData.sort(sortBy(column.prop, isDec));
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            //打开日期共享
            this.$store.commit('broadcastShareState', true);
            if (this.$store.state.isGoback != 'sales') {
                this.$store.commit('broadcastSharedDateRange', JSON.parse(JSON.stringify(this.$store.state.watchWeekArr)));
                this.$store.commit('changeCurrentTab', 2);
            }
        }
    };
</script>
