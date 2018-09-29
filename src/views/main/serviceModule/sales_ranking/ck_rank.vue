<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24" >
                <Card>
                    <Form inline :label-width="80"  class="model-style">
                        <Row>
                            <Col span="4">
                            <DatePicker type="daterange" placeholder="选择时间" format="yyyy-MM-dd" :value='dateRange' @on-change="getServiceSalesRank" style="width: 100%;"></DatePicker>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col>
                <Card>
                    <Row>
                        <Col span="24" style="text-align: center">
                        <el-table :data="ckList" border stripe row-class-name="table-height" @sort-change="manualSort">
                            <el-table-column prop="rank" label="排名" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="ygbh"  label="客服编号" show-overflow-tooltip> </el-table-column>
                            <el-table-column prop="ygxm" label="客服姓名" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="out_order_num" label="出库单数量" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="sell_product_num" label="合同商品数量" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="out_product_num"  label="出库商品数量" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="out_customer_num" label="出库客户数" sortable="custom" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="out_amount" label="出库总金额" sortable="custom" show-overflow-tooltip></el-table-column>
                        </el-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { serviceCkRank } from '@/config/getData';
    import { sortBy, getSpecialDateRange } from '@/config/mUtils';
    export default {
        data () {
            return {
                orderStatus: 'all',
                orderStatusArr: [{
                    value: 'all',
                    label: '全部'
                }],
                dateRange: getSpecialDateRange(),
                ckList: []
            };
        },
        methods: {
            getServiceSalesRank (dateRange) {
                console.log(1);
                if (dateRange) {
                    this.dateRange = dateRange;
                }
                serviceCkRank(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.ckList = res.data;
                    }
                });
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ckList.sort(sortBy(column.prop, isDec));
            }
        },
        created () {
            this.getServiceSalesRank();
        }
    };
</script>
