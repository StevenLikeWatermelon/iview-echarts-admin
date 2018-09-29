<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <!-- <Icon type="bookmark"></Icon> -->
                        基本信息
                    </p>
                    <Form :label-width="120"  :model="outputDetailBasic">
                        <Row>
                            <Col span="6">
	                            <FormItem label="采购出库单编号：">
	                            	<span>{{outputDetailBasic.order_out_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="单据状态：">
	                                <span>{{outputStatusObj[outputDetailBasic.order_status]}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="采购退货单编号：">
	                                <span>{{outputDetailBasic.buy_return_no}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商：">
	                                <span>{{outputDetailBasic.gysmc}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="供应商联系人：">
	                                <span>{{outputDetailBasic.lxr}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="出库仓库：">
	                                <span>{{outputDetailBasic.out_store_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="退货联系人：">
	                                <span>{{outputDetailBasic.receive_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="退货联系方式：">
	                                <span>{{outputDetailBasic.receive_phone}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="出库地址：">
	                                <span>{{outputDetailBasic.province_name}}{{outputDetailBasic.city_name}}{{outputDetailBasic.district_name}}{{outputDetailBasic.receive_address}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建人：">
	                                <span>{{outputDetailBasic.create_user_name}}</span>
	                            </FormItem>
                            </Col>
                            <Col span="6">
	                            <FormItem label="创建时间：">
	                                <span>{{outputDetailBasic.create_time}}</span>
	                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        出库商品明细
                    </p>
                    <Row>
                    	<col span="24">
                    		<Form :label-width="120">
		                        <Row>
		                            <Col span="6">
			                            <FormItem label="出库商品总数：">
			                            	<span>{{totalNum}}</span>
			                            </FormItem>
		                            </Col>
		                            <Col span="6">
			                            <FormItem label="出库商品总额：">
			                                <span>{{totalAmount | toDecimal}}</span>
			                            </FormItem>
		                            </Col>
		                        </Row>
		                    </Form>
                    	</col>
                    </Row>
                    <Row>
                    	<col span="24">
		                    <el-table :data="outputDetailList" border stripe style="text-align: center;" @sort-change="manualSort">
		                        <el-table-column label="行号">
		                            <template slot-scope="scope">
		                                <span>{{scope.$index + 1}}</span>
		                            </template>
		                        </el-table-column>
		                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="product_name" label="产品名称" sortable="custom" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="product_model" label="产品型号"  sortable="custom" width="120" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="product_order_no" label="订货号" sortable="custom" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="product_unit" label="计量单位" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="buy_price" label="采购单价" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="buy_num" label="采购数量" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="return_num" label="退货数量" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="out_num" label="出库数量" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="amount" label="出库金额" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.amount | toDecimal}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="area_name" label="出库库区" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="seat_name" label="出库库位" show-overflow-tooltip></el-table-column>
		                        <el-table-column prop="buy_return_no" label="采购退货单编号" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                         <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.buy_return_no)">{{scope.row.buy_return_no}}</span>
                                    </template>      
                                </el-table-column>
		                    </el-table>
                    	</col>
                    </Row>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backToList('purchase_manage_CK_index')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" v-show="isout" @click="doOutPut()" v-auth="buttonLimit">出库</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" v-show="isabolish" @click="CKAbolish()" v-auth="buttonLimit">作废</Button>
            </Card>
            </Col>
        </Row>  
        <Modal v-model="showAbolish" title="确认作废">
            <p>确认作废该采购出库单?</p>
            <div slot="footer">
                <Button type="text" @click="cancelAbolish">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmAbolish">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { purchaseManageOutputDetail, apiAllStatus, purchaseManageOutputAbolish, purchaseManageDoOutput} from '@/config/getData';
    import { manualCheck,sortBy } from '@/config/mUtils';
    export default {
        data () {
            return {
                isout: false,
                loading: false,
                isabolish: false,
                isStore: manualCheck('allStoreRoles'),
            	showAbolish: false,
                fromAdd: this.$route.query.fromAdd,
            	id: this.$route.query.param,
                outputStatusObj: {},
                outputDetailBasic: {},
                outputDetailList: [],
                totalNum: 0,
                totalAmount: 0,
                buttonLimit: 'purchase-outstock-button'
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
             //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.outputDetailList.sort(sortBy(column.prop, isDec));
            },
        	backTo () {
        		history.go(-1);
        	},
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['ckd_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.outputStatusObj = res.data.ckd_status;
                        this.getData();
                    }
                });
            },            
            getData () {
                purchaseManageOutputDetail(this, {
                    out_no:  this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.outputDetailBasic = res.data.info;
                        if(res.data.info.order_status != -1){
                            this.isabolish = true;
                            if(res.data.info.order_status != 4 && this.isStore){
                                this.isout = true;
                            }
                        }
                        res.data.list.forEach(item => {
                            item.amount = this.multiply(item.out_num, item.buy_price);
                            this.totalNum = this.add(this.totalNum, item.out_num);
                            this.totalAmount = this.add(this.totalAmount, item.amount);
                        });
                        this.outputDetailList = res.data.list;

                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            CKAbolish() {
                this.showAbolish = true;
            },
            confirmAbolish() {
                this.loading = true;
                purchaseManageOutputAbolish(this,{
                    out_no:  this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('单据已作废!');
                        this.showAbolish = false;
                        this.isabolish = false;         //作废按钮隐藏
                        this.isout = false;             //出库按钮隐藏
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                })
            },
            cancelAbolish() {
                this.showAbolish = false;
            },
            doOutPut() {
                purchaseManageDoOutput(this,{
                    out_no:  this.$route.query.param
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.getData();
                        this.isout = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            goToDetail (id) {
                util.openNewPage(this, 'purchase_manage_TH_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_TH_detail',
                    query: {
                        param: id
                    }
                });
            }            
            
        },
        created () {
            this.getStatus();
        },
        filters: {
            //保留两位小数过滤器
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