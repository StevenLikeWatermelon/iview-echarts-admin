<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                    <span v-show="basicEditCondtion">
                    	<span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="edit_basic" @click="edit('basic')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
	                    <span style="font-weight:normal;float:right;" v-else>
	                        <Button type="default" @click="close('basicCancel')">取消</Button>
	                        <Button type="primary" @click="close('basicSave')">保存</Button>
	                    </span>
                    </span>
                </p>
                <Form :label-width="140">
                    <Row>
                        <Col span="6">
                        <FormItem label="采购发货修改单编号：" style="margin:0;">
                            {{ info.ship_modify_no }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="单据状态：" style="margin:0;">
                            {{ instock_status[info.order_status] }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="采购发货单编号：" style="margin:0;">
                            <span>{{ info.order_ship_no }}</span>
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="备注：" style="margin:0;">
                            <span v-if="edit_basic"> {{ info.note }} </span>
                            <Input type="textarea" v-model="info.note" v-else></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建人：" style="margin:0;">
                            {{ info.create_user_no }} / {{info.create_user_name}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="创建时间：" style="margin:0;">
                            {{ info.create_time }}
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
                    修改商品明细
                    <span v-show="basicEditCondtion">
                    	<span style="font-weight:normal;color: rgb(45, 140, 240);cursor: pointer;float:right;" v-if="edit_goods" @click="edit('goods')"><Icon type="compose" class="margin-right-5"></Icon>修改</span>
	                    <span style="font-weight:normal;float:right;" v-else>
	                        <Button type="default" @click="close('goodsCancel')">取消</Button>
	                        <Button type="primary" @click="close('goodsSave')">保存</Button>
	                    </span>
                    </span>
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
                        <el-table-column show-overflow-tooltip prop="instock_num" label="已入库数量" sortable="custom" width="110px" show-overflow-tooltip v-if="!edit_goods"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cancel_num" label="取消数量" sortable="custom" width="100px" show-overflow-tooltip>
                        	<template slot-scope="scope">
                        		<span  v-if="edit_goods">{{scope.row.cancel_num}}</span>
                                <Input type="text" v-model="scope.row.cancel_num"  @on-blur="numChange(scope.$index)" @on-change="calculates" v-else></Input>
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
                        <el-table-column prop="from_order_no" label="来源单据编号" width="120"></el-table-column>
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
                <Button type="default" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="modal('del')" v-show="basicEditCondtion">删除</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" v-show="basicEditCondtion" @click="modal('tj')">提交</Button>
            </Card>
            </Col>
        </Row>
        <!--弹框公用-->
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em>！</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="sureAction(publicCancel)">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus,apiPurchaseShipModifyDetail, apiPurchaseShipModifyDelete, apiPurchaseShipModifyBasic, apiPurchaseShipModifyGoods, apiPurchaseShipModifySubmit, apiPurchaseShipEditMake} from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                publicModal: false,
                publicState: '',
                publicCancel: '',
                publicSure: '',
                loadding: false,
                info: {},
                ship_no: this.$route.query.param,
                actTable: {
                    data: []
                },
                instock_status: [],
                edit_goods: true,
                edit_basic: true,
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                cancelAll: 0,
                cancelMoney: 0.0000,
                basicEditCondtion: false,
                detailEditCondition: false
            };
        },
        methods: {
            modal (name) {
                if (name === 'del') {
                    this.publicModal = true;
                    this.publicState = '删除';
                    this.publicCancel = 'delcancel';
                    this.publicSure = 'delsure';
                    this.loadding = false;
                } else if (name === 'tj') {
                	if (this.edit_goods && this.edit_basic) {
                		this.publicModal = true;
	                    this.publicState = '提交';
	                    this.publicCancel = 'tjcancel';
	                    this.publicSure = 'tjsure';
	                    this.loadding = false;
                	} else {
                		this.$Message.error('请先保存再提交');
                	}
                }
            },
            sureAction (name) {
                if (name === 'delcancel') {
                    //删除取消
                    this.publicModal = false;
                } else if (name === 'delsure') {
                    //删除确定
                    this.loadding = true;
                    apiPurchaseShipModifyDelete(this, {
                        ship_modify_no: this.ship_no
                    }).then(res => {
                        if (res && res.status == 1) {
                           closeCurrentPage(this);
                       	   this.handleClick('', 'purchase_FHedit_index');
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'tjcancel') {
                    //提交取消
                    this.publicModal = false;
                } else if (name === 'tjsure') {
                    //提交确定
                    this.loadding = true;
                    apiPurchaseShipModifySubmit(this, {
                        ship_modify_no: this.ship_no
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.publicModal = false;
                            this.loadding = false;
                            this.getData();
                        } else {
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['ship_modify_no'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.instock_status = res.data.ship_modify_no;
                    }
                });
            },
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
                apiPurchaseShipModifyDetail(this, {
                    ship_modify_no: this.ship_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.info = res.data.info;
                        this.actTable.data = res.data.list;
                        this.basicEditCondtion = this.info.create_user_no == Cookies.get('user_no') && this.info.order_status == 0;
                        // this.detailEditCondition = this.info.create_user_no == Cookies.get('user_no') && this.info.order_status == 0;
                        this.calculates();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            edit (name) {
                if (name === 'basic') {
                	this.edit_basic = false;
                } else if (name === 'goods') {
                	this.edit_goods = false;
                }
            },
            close (name) {
                if (name === 'basicCancel') {
                    this.getData();
                    this.edit_basic = true;
                } else if (name === 'basicSave') {
                    //基本信息保存
                    apiPurchaseShipModifyBasic(this, {
                        params: JSON.stringify({
                            ship_modify_no: this.ship_no,
                            note: this.info.note
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.edit_basic = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                } else if (name === 'goodsCancel') {
                    this.getData();
                    this.edit_goods = true;
                } else if (name === 'goodsSave') {
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
	            		} else if (parseInt(this.actTable.data[i].cancel_num) < 0 || parseInt(this.actTable.data[i].cancel_num) > parseInt(this.actTable.data[i].can_cancel)) {
		            		this.$Message.error('第' + n + "行的取消数量必须小于等于发货数量和已入库数量之差");
		            		return false;
		            	}
	            	}
	            	if (sum == this.actTable.data.length) {
	            		this.$Message.error("取消数量不能全为0！");
		            	return false;
	            	}
                    this.actTable.data.forEach(item => {
                        goodsArr.push({
                            id: item.id,
                            num: item.cancel_num 
                        });
                    });
                    apiPurchaseShipModifyGoods(this, {
                        params: JSON.stringify({
                            ship_modify_no: this.ship_no
                        }),
                        list: JSON.stringify(goodsArr)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.edit_goods = true;
                            this.getData();
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
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
            	if (this.$route.query.isBack) {
            		this.handleClick('', 'purchase_FHedit_index'); 
            	} else {
            		history.go(-1);
            	}
            }
        },
        created () {
            this.getStatus();
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
