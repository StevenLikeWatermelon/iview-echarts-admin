<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="customer-title">
                    客户信息
                </p>
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="单据编号：" style="margin:0;">
                            {{ customer_info.djbh }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户名称：" style="margin:0;">
                            {{ customer_info.khmc }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：" style="margin:0;">
                            {{ customer_info.lxr }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：" style="margin:0;">
                            {{ customer_info.sjhm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：" style="margin:0;">
                            {{ customer_info.xsyg_ygbh }}/{{ customer_info.xsyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：" style="margin:0;">
                            {{ customer_info.xsygbm }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：" style="margin:0;">
                            {{ customer_info.czyg_ygbh }}/{{ customer_info.czyg }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：" style="margin:0;">
                            {{ customer_info.czygbm }}
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <p slot="title" class="detail-title">
                    售后商品明细
                </p>
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="toExport" v-auth="XSHTList_export">导出</Button>
                    </Col>
                </Row>
                <el-table :data="order_details" border stripe style="text-align: center"  max-height="500"  @sort-change="manualSort">
                    <el-table-column type="index" label="行号" fixed="left"></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" sortable="custom" min-width="120" fixed="left"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxl" label="系列" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmj" label="商品面价" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <div>
                                <span> {{ parseFloat(scope.row.cpmj).toFixed(2) }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="htzk" label="合同单价" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.htdj).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="合同折扣" prop="htdj" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ parseFloat(scope.row.htzk).toFixed(3) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="return_avg_price" label="退货单价" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="htsl" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="can_return_num" label="可退数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column label="退货数量" prop="return_num" sortable="custom" min-width="130">
                        <template slot-scope="scope">
                            <Input v-model="scope.row.return_num" @on-change="scope.row.return_total = parseFloat(scope.row.return_avg_price * scope.row.return_num).toFixed(4)" @on-blur="numChange(scope.row.return_num, scope.row.can_return_num, scope.row.cpdhh)"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column label="小计" prop="return_total" sortable="custom" min-width="120"></el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>    
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button  type="primary" class="margin-top-10" style="margin:auto;" @click="saveApplyReturn()">确定</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import {apiSalesHtdApplyReturn, apiSalesHtdApplyReturnSave, apiAllStatus} from '@/config/getData';
    import {notempty, sortBy, manualCheck} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                loading: false,
                htdbh: this.$route.query.djbh,
                invoiceLimit: 'service-xskpd-invoice-not',
                customer_info: [],
                order_details: [],
                orderStatus: [],
                payStatus: [],
                returnNums: {},
            };
        },
        methods: {
            saveApplyReturn () {
                this.loading = true;
                for(let i in this.order_details){
                    let _return_num = parseInt(this.order_details[i].return_num);
                    if(_return_num > this.order_details[i].can_return_num)
                    {
                        this.$Message.error('【' + this.order_details[i].cpdhh + '】退货数量不能大于可退数量');
                        return false;
                    }
                    this.returnNums[this.order_details[i].id] = _return_num;
                }
                apiSalesHtdApplyReturnSave(this, {
                    order_no: this.htdbh,
                    return_nums: JSON.stringify(this.returnNums),
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作成功!');
                        this.handleClick({}, 'service-sales-thsqd');
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            getData () {
                apiSalesHtdApplyReturn(this, {
                    order_no: this.htdbh
                }).then(res => {
                    if(res && res.status == 1){
                        this.customer_info = res.data.customer_info;
                        this.order_details = res.data.order_details;
                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderStatus = res.data.xshtdzt;
                        this.payStatus = res.data.khzfzt;
                    }
                });
            },
            numChange (r_num, c_num, dhh) {
                var reg = /^\d+?$/;
                if (r_num === '') {
                    this.$Message.error('【' + dhh + '】请输退货数量');
                } else if (!reg.test(r_num)) {
                    this.$Message.error('【' + dhh + '】退货数量必须是数字');
                }
                else if(r_num > c_num)
                {
                    this.$Message.error('【' + dhh + '】退货数量不能大于可退数量');
                }
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.data.sort(sortBy(column.prop, isDec));
            },
            feeTableSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.feeTable.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
        },
        created () {
            this.getStatus();
            this.getData();
            console.log(manualCheck(this.invoiceLimit), '此处也应该为true');
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            }
        }
    };
</script>
