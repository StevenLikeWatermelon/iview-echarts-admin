<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="140">
                    <Row>
                        <Col span="24">
                        <FormItem label="发货修改单备注：" style="margin:0;">
                            <Input type="textarea" v-model="info.note"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    入库商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>发货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">发货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                        <span class="margin-left-20">取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ cancelAll }}</em></span>
                        <span class="margin-left-20">取消商品总额： <em style="color:#cf0012;font-style: normal;">{{ cancelMoney }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center;width:100%"  @sort-change="manualSort">
                        <el-table-column show-overflow-tooltip type="index" label="行号" fixed width="60"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" width="100" show-overflow-tooltip fixed></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称"  show-overflow-tooltip fixed sortable="custom" min-width="120px"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" show-overflow-tooltip fixed sortable="custom" min-width="120px"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" show-overflow-tooltip fixed sortable="custom" min-width="100px"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="num" label="发货数量" sortable="custom" width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="instock_num" label="已入库数量" sortable="custom" width="110px" show-overflow-tooltip></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cancel_num" label="取消数量" sortable="custom" width="100px" show-overflow-tooltip>
                        	<template slot-scope="scope">
                                <Input type="text" v-model="scope.row.cancel_num" @on-blur="numChange(scope.$index)" @on-change="calculates"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="取消金额" sortable="custom" width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_price, scope.row.cancel_num, 4) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_leadtime" show-overflow-tooltip label="采购货期(天)" sortable="custom" width="120px"></el-table-column>
                        <el-table-column show-overflow-tooltip label="采购合同单编号" width="150">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from_order_no" label="来源单据编号" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.from_order_no}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo">返回</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loading" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiPurchaseShipEditToList, apiPurchaseShipEditMake } from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                info: {
                	note: ''
                },
                ship_no: this.$route.query.param,
                actTable: {
                    data: []
                },
                loading: false,
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                cancelAll: 0,
                cancelMoney: 0.0000
            };
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            calculates () {
            	this.goodsAll = parseInt(0);
            	this.goodsAllMoney = parseFloat(0).toFixed(4);
            	this.cancelAll = parseInt(0);
                this.cancelMoney = parseFloat(0).toFixed(4);
                for(let key in this.actTable.data){
                    this.goodsAll += parseInt(this.actTable.data[key]['num']);
                    this.goodsAllMoney = this.add(this.goodsAllMoney, this.multiply(this.actTable.data[key].num, this.actTable.data[key].buy_price), 4);
                    this.cancelAll += parseInt(this.actTable.data[key]['cancel_num']);
                    this.cancelMoney = this.add(this.cancelMoney, this.multiply(this.actTable.data[key].cancel_num, this.actTable.data[key].buy_price), 4);
                }
            },
            getData () {
                apiPurchaseShipEditToList(this, {
                    ship_no: this.ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        // this.info = res.data.info;
                        for (let i in res.data) {
                        	res.data[i].cancel_num = 0;
                        }
                        this.actTable.data = res.data;
                        this.calculates();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            save () {
            	let goodsArr = [];
            	let sum = parseInt(0);
            	for (let i in this.actTable.data) {
            		let n = parseInt(i) + parseInt(1);
	            	if (this.actTable.data[i].cancel_num === "") {
		            	this.$Message.error('第' + n + '行的取消数量不能为空');
		            	return false;
		            } else if (isNaN(this.actTable.data[i].cancel_num)) {
		            	this.$Message.error('第' + n + "行的取消数量必须是整数");
		            	return false;
		            } else if (parseInt(this.actTable.data[i].cancel_num) < 0) {
		            	this.$Message.error('第' + n + "行的取消数量必须大于等于0");
		            	return false;
		            } else if (this.actTable.data[i].cancel_num == 0) {
	            		sum += 1;
	            	}  else if (parseInt(this.actTable.data[i].cancel_num) < 0 || parseInt(this.actTable.data[i].cancel_num) > parseInt(this.actTable.data[i].can_cancel)) {
		            	this.$Message.error('第' + n + "行的取消数量必须小于等于发货数量和已入库数量之差");
		            	return false;
		            } else {
	            		goodsArr.push(
	            			{
	            				id: this.actTable.data[i].id,
	            				num: this.actTable.data[i].cancel_num 
	            			});
	            	}
            	}
            	if (sum == this.actTable.data.length) {
	            	this.$Message.error("取消数量不能全为0！");
		            return false;
	            }
                this.loading = true;
            	apiPurchaseShipEditMake(this, {
                    params: JSON.stringify({
                    	note: this.info.note,
                    	ship_no: this.ship_no
                    }),
                    list: JSON.stringify(goodsArr)
                }).then(res => {
                    if (res && res.status == 1) {
                    	closeCurrentPage(this);
                        this.handleClick({param: res.data.ship_modify_no, isBack: '1'}, 'purchase_FHedit_detail');
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            numChange (index) {
            	let n = parseInt(index) + parseInt(1);
            	if (this.actTable.data[index].cancel_num === "" || !this.actTable.data[index].cancel_num) {
            		this.$Message.error('第' + n + '行的取消数量不能为空');
            	} else if (isNaN(this.actTable.data[index].cancel_num)) {
            		this.$Message.error('第' + n + "行的取消数量必须是整数");
            	} else if (parseInt(this.actTable.data[index].cancel_num) < 0) {
            		this.$Message.error('第' + n + "行的取消数量必须大于等于0");
            	} else if (parseInt(this.actTable.data[index].cancel_num) > parseInt(this.actTable.data[index].can_cancel)) {
            		this.$Message.error('第' + n + "行的取消数量必须小于等于发货数量和已入库数量之差");
            	}
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getData();
        },
        filters: {
            //保留4位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(4);
            }
        }
    };
</script>
