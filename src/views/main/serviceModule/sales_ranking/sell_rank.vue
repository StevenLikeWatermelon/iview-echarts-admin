<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24" >
            <Card>
                <Form inline :label-width="80"  class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="orderStatus" placeholder="请选择订单状态" @on-change="getServiceSalesRank(dateRange)">
                            <Option v-for="name in orderStatusArr" :value="name.value" :key="name.value">{{ name.label }}</Option>
                        </Select>
                        </Col>
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
                    <el-table :data="salesList" border stripe row-class-name="table-height" @sort-change="manualSort">
                        <el-table-column prop="rank" label="排名" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ygbh"  label="客服编号" show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="ygxm" label="客服姓名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="order_num" label="订单数量" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="order_detail_num" label="订单行项目数" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customer_num"  label="交易客户数" sortable="custom" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="order_amount" label="订单总金额" sortable="custom" show-overflow-tooltip></el-table-column>
                    </el-table>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { serviceSalesRank, apiAllStatus } from '@/config/getData';
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
                salesList: []
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xshtdzt'])
                }).then(res => {
                    let tmpObj;
                    for (let key in res.data.xshtdzt) {
                        if (res.data.xshtdzt.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.xshtdzt[key]
                            };
                            this.orderStatusArr.push(tmpObj);
                        }
                    }
                    this.getServiceSalesRank();
                });
            },
            getServiceSalesRank (dateRange) {
                if (dateRange) {
                    this.dateRange = dateRange;
                }
                serviceSalesRank(this, {
                    params: JSON.stringify({
                        starttime: this.dateRange[0] + ' 00:00:00',
                        endtime: this.dateRange[1] + ' 23:59:59',
                        xshtdzt: this.orderStatus == 'all' ? '' : this.orderStatus
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.salesList = res.data;
                    }
                });
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.salesList.sort(sortBy(column.prop, isDec));
            }
        },
        created () {
            this.getStatus()
        }
    };
</script>
