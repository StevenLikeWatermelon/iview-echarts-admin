<style>
    
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Form class="model-style">
                        <Row>
                            <Col span="4">
                                <Select v-model="customer_name" placeholder="请选择客户名称" filterable @on-change="getData(daterange)">
                                    <Option v-for="name in customerName" :value="name.khbh" :key="name.khbh">{{ name.kh_new }}</Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getData" style="width: 100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>    
        <Row class="margin-top-10">
            <col span="24">
                <Card>        
                    <el-table :data="salesData.data" border stripe style="text-align: center;width:100%;" @sort-change="manualSort">
                        <el-table-column show-overflow-tooltip label="客户编号" width="120">
                            <template slot-scope="scope">
                                <span  @click="handleClick(scope.row)" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.khbh}}</span></span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="khmc" label="客户名称" min-width="200"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="lxr" label="客户联系人" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="sjhm" label="客户联系方式" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="out_num" label="已出库出库单总数" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="out_amount" label="已出库总金额" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="last_time" label="上次出库时间" sortable="custom" width="150"></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import searchData from '../../../common/search.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiCustAnalyzeListOut, apiAllKh, apiCustomerAllStaff } from '@/config/getData';
    import {getStore, setStore, sortBy,getSpecialDateRange} from '@/config/mUtils';
    export default {
        components: {
            searchData,
            pagination
        },
        data () {
            return {
                customer_name: 'all',
                customerName: [{
                    khbh: 'all',
                    kh_new: '全部'
                }],
                salesData: {
                    title: [],
                    data: []
                },
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                ajaxHistoryData: [],
                dateRange: getSpecialDateRange(),
            };
        },
        methods: {
            handleClick (row) {
                // let argu = { khbh: row.khbh, khmc: row.khmc, lxr: row.lxr, sjhm: row.sjhm};
                // this.$router.push({
                //     name: 'custom_analyze_data',
                //     query: argu
                // });
            },
            getData (dateRange) {
                 if (dateRange) {
                    this.dateRange = dateRange;
                }
                apiCustAnalyzeListOut(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                        khbh: this.customer_name == 'all' ? '' : this.customer_name
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.ajaxHistoryData = res.data.list;
                        this.ajaxHistoryData.sort(sortBy('last_time', true));
                        this.totalnum = res.data.total_num;
                        if (res.data.total_num < this.limit) {
                            this.salesData.data = this.ajaxHistoryData;
                        } else {
                            this.salesData.data = this.ajaxHistoryData.slice(0, this.limit);
                        }
                    }
                });
            },
            getKh () {
                 apiAllKh(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.customerName = this.customerName.concat(res.data.kh_list);

                    }
                });
                 this.getData();
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
            }
        },
        created () {
            //打开日期共享
            this.$store.commit('broadcastShareState', true);
            if (this.$store.state.isGoback != 'custom') {
                this.$store.commit('broadcastSharedDateRange', JSON.parse(JSON.stringify(this.$store.state.watchWeekArr)));
                this.$store.commit('changeCurrentTab', 2);
            }
            this.getKh();
        }
    };
</script>