<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form inline>
                    <formItem style="margin-left:3%;float:left;">
                        <btn-grp NewFirstTitle="按省份统计" NewSecondTitle="按市区统计" @changeChartsData="getSearchType"></btn-grp>
                    </formItem>
                    <search-data @getDateRangeData="getData"></search-data>
                    <div class="clear"></div>
                </Form>
                <Row>
                    <Col span="24">
                    <customer-distribution :distributionArr="distributionArr"></customer-distribution>
                    </Col>
                    <Col span="24">
                        <el-table :data="customerData.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column prop="province" label="省份/自治区" ></el-table-column>
                            <el-table-column prop="city" label="市区" v-if="searchType === 'city'"></el-table-column>
                            <el-table-column prop="kh_all_nums" label="总客户数" sortable="custom"></el-table-column>
                            <el-table-column prop="kh_deal_nums" label="成交客户数" sortable="custom"></el-table-column>
                            <el-table-column prop="yfje" label="下单总金额" sortable="custom"></el-table-column>
                            <el-table-column prop="sfje" label="已支付总金额" sortable="custom"></el-table-column>
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
    import btnGrp from '../../../home/components/btnGrp.vue';
    import pagination from '../../../common/pagination.vue';
    import customerDistribution from '../../components/customerDistri.vue';
    import { customDistrutionList } from '@/config/getData';
    import {sortBy} from '@/config/mUtils';
    export default {
        name: 'customer-distribute',
        data () {
            return {
                customerData: {
                    title: [],
                    data: []
                },
                distributionArr: [],
                totalNum: 0,
                limit: 10,
                currentPage: 1,
                originData: [],
                searchType: 'province',
                searchDateRange: []
            };
        },
        components: {
            searchData,
            btnGrp,
            pagination,
            customerDistribution
        },
        methods: {
            getData (dateRange) {
                this.searchDateRange = dateRange;
                customDistrutionList(this, {
                    params: JSON.stringify({
                        starttime: this.searchDateRange[0] + ' 00:00:00',
                        endtime: this.searchDateRange[1] + ' 23:59:59',
                        type: this.searchType                        
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalNum = res.data.list.length;
                        this.originData = JSON.parse(JSON.stringify(res.data.list));
                        this.customerData.data = this.originData.slice(0, this.limit);
                        if (res.data.kh_all_list && res.data.kh_all_list.length) {
                            this.distributionArr.splice(0, 1, {
                                name: '总客户数分布',
                                type: 'map',
                                mapType: 'china',
                                roam: false,
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: res.data.kh_all_list
                            });
                        }
                        if (res.data.kh_deal_list && res.data.kh_deal_list.length) {
                            this.distributionArr.splice(1, 1, {
                                name: '成交客户数分布',
                                type: 'map',
                                mapType: 'china',
                                roam: false,
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: res.data.kh_deal_list
                            });
                        }
                        if (res.data.order_all_amount && res.data.order_all_amount.length) {
                            this.distributionArr.splice(2, 1, {
                                name: '总成交金额分布',
                                type: 'map',
                                mapType: 'china',
                                roam: false,
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: res.data.order_all_amount
                            });
                        }
                        if (res.data.order_pay_amount && res.data.order_pay_amount.length) {
                            this.distributionArr.splice(3, 1, {
                                name: '已支付金额分布',
                                type: 'map',
                                mapType: 'china',
                                roam: false,
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: res.data.order_pay_amount
                            });
                        }
                    } else {
                        res && this.$Message.error(res.message);;
                    }
                });
            },
            getSearchType (type) {
                this.searchType = type ? 'city' : 'province';
                this.getData(this.searchDateRange);
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.customerData.data = this.originData.slice(_start, _end);
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
            // 初始化日期范围/当前页,关闭日期共享
            this.$store.commit('broadcastShareState', false);
            this.$store.commit('changeCurrentTab', 2);
        }
    };
</script>
