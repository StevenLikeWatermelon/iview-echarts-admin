<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-list"></Icon>
                        待请购商品明细
                    </p>           
                    <Row class="special-return-detail">
                    	<col span="24">
                    		<Form :label-width="120">
		                        <Row>
		                            <Col span="6">
			                            <FormItem label="请购商品总数：">
			                            	<span>{{requiritionCount.total_num}}</span>
			                            </FormItem>
		                            </Col>
                                    <Col span="6" offset="6" style="margin-left: 50%">
                                        <a @click="addNew()" style="float:right">
                                            <Icon type="plus"></Icon>
                                            添加商品
                                        </a>
                                    </Col>
		                        </Row>
		                    </Form>
                    	</col>
                    </Row>
                    <Row>
                    	<col span="24">
		                    <el-table :row-class-name="tableRowClassName" :data="buyProductList" border style="text-align: center;" @sort-change="manualSort">
		                        <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" width="150" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
		                        <el-table-column show-overflow-tooltip prop="jldw" label="计量单位"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="ready_lock_num" label="待请购数量"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="requisition_num" label="请购数量">
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.requisition_num" placeholder="请输入请购数量" @on-change="changeAmount(scope)"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="stock" label="可用库存" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="purchase_user_name" label="采购员" width="120">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.purchase_user_no}}/{{scope.row.purchase_user_name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="buy_order_no" label="来源单据编号" width="120">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="toHTD(scope.row.djbh)">{{scope.row.djbh}}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column show-overflow-tooltip prop="note" label="备注"  min-width="150" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <Input v-model="scope.row.note" placeholder="请输入备注" @on-change="changeAmount(scope)"></Input>
                                    </template>
                                </el-table-column>

                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.$index)">删除</span>
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
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loadding" @click="submit()">保存</Button>
            </Card>
            </Col>
        </Row>       
        <Modal v-model="showAdd" class-name="make-return modal-no-absoute" title="添加商品" width="90">
            <Row class="margin-top-10">
                <col span="24">
                    <Card>
                        <Form :label-width="120"  class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="salesRequisition.cpppbh"  placeholder="请选择产品品牌" filterable @on-change="search">
                                        <Option v-for="item in brandList" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.djbh" placeholder="请输入销售合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpdhh" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="salesRequisition.cpxh" placeholder="请输入产品型号" @on-enter="search"></Input>
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
                        <Icon type="navicon-round"></Icon>
                        待请购商品列表
                    </p>
                    <Row style="margin-bottom:10px;">
                        <col span="24">
                        <Button type="primary"  @click="confirmAdd()">添加</Button>
                        </col>
                    </Row>
                    <el-table :row-class-name="tableRowClassName" :data="productToAdd" border style="text-align: center;width: 100%" @sort-change="manualSort"  @selection-change="handleSelectionChange">
                        <el-table-column show-overflow-tooltip type="selection" width="55" prop="hh"></el-table-column>
                        <el-table-column show-overflow-tooltip label="销售合同单编号">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToHTD(scope.row.djbh)">{{scope.row.djbh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="djrq" label="创建时间" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jldw" label="计量单位" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="htsl" label="合同数量" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="requisition_num" label="待请购数量" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="arrive_fund_rate" label="到款比例" sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="purchase_user_name" label="采购员">
                            <template slot-scope="scope">
                                <span>{{scope.row.purchase_user_no}}/{{scope.row.purchase_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="支付状态" sortable="custom" prop="khzfzt">
                            <template slot-scope="scope">
                                <span>{{payStatus[scope.row.khzfzt] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="订单状态" sortable="custom" prop="xshtdzt">
                            <template slot-scope="scope">
                                <span>{{orderStatus[scope.row.xshtdzt] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                </Card>
                </col>
            </Row>            
        </Modal>


        <Modal v-model="showSave" title="以下商品有可用库存,可在销售合同单中手动锁" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <el-table :data="HaveStockInfo" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column label="订货号" min-width="120" prop="cpdhh" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="requisition_num" label="请购数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="stock" label="库存数量" show-overflow-tooltip></el-table-column>
                </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater } from '@/config/mUtils';
    import {purchaseManagesalesRequiritionReadyListtDetail,purchaseManagesalesRequiritionReadyList,apiAllBrands,apiAllStatus,purchaseManagesalesRequiritionAdd } from '@/config/getData';
    export default {
        components: {
            pagination
        },        
        data () {
            return {
                showAdd: false,
                salesRequirition: {
                    note: ''
                },
                copysalesRequirition: {},
                requiritionCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                slectedArrFromList: this.$route.query.selectedArr,
                buyProductList: [],
                EditedProductList: [],
                copyProductList: [],

                //以下为弹窗内的数据初始化
                salesRequisition: {
                    cpppbh: 'all',
                },
                brandList: [{
                    cpppbh: 'all',
                    cpppmc: '全部'
                }],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',   
                selectedToAdd: [],
                productToAdd: [],
                loadding: false,
                showSave:false,
                HaveStockInfo:[],
            };
        },
        methods: {
            cancel(){
                this.showSave = false;
            },
            confirmTranslate(){
                this.showSave = false;
                this.Save();
            },
            toHTD(djbh){
                util.openNewPage(this, 'service-sales-htd-detail', {
                    param: djbh
                });
                this.$router.push({
                    name: 'service-sales-htd-detail',
                    query: {
                        param: djbh
                    }
                });

            },
        	backTo () {
        		history.go(-1);
        	},
            addNew() {
                this.showAdd = true;
                this.getData();
            },
            getData(){
                //获取带采购商品明细
                purchaseManagesalesRequiritionReadyList(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.salesRequisition.djbh,
                        cpppbh:this.salesRequisition.cpppbh == 'all' ? '' : this.salesRequisition.cpppbh,
                        cpmc:this.salesRequisition.cpmc,
                        cpdhh:this.salesRequisition.cpdhh,
                        cpxh:this.salesRequisition.cpxh,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.productToAdd = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            redirectOtherPage (pageName, query) {
                util.redirectPage(this, pageName, query);
            },
            deleteItem(index) {
                this.buyProductList.splice(index, 1);
            },
            changeAmount(scope) {
                let reg = /^[1-9]\d*$/;
                let isNum = reg.test(+scope.row.requisition_num);
                if (!isNum) {
                    this.$Message.error('格式有误!');
                }
                this.requiritionCount.total_num = 0;
                this.requiritionCount.total_amount = 0;
                this.buyProductList.forEach(item => {
                    this.requiritionCount.total_num +=  +item.requisition_num;
                    this.requiritionCount.total_amount +=  +(item.requisition_num * item.htdj);
                });
                this.requiritionCount.total_num = this.requiritionCount.total_num.toFixed(0);
                this.requiritionCount.total_amount = this.requiritionCount.total_amount.toFixed(4);
            },
            saveEdit() {
                let reg = /^[1-9]\d*$/;
                let invalidate = false;
                let currentIndex = 0;
                for (let i = 0; i < this.buyProductList.length; i++) {
                    let isNum = reg.test(this.buyProductList[i].require_num);
                    if (!isNum) {
                        invalidate = true;
                        currentIndex = i + 1;
                        break;
                    }
                }
                if (invalidate) {
                    this.$Message.error('第' + currentIndex + '行退货数量格式有误!');
                    return;
                }

                // 请注意修改完把 isEditLabel 改回来
                purchaseManagesalesRequiritionEdit(this, {
                    order_return_no: this.$route.query.param,
                    params: JSON.stringify({
                        list: this.EditedProductList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getDetail();
                        this.getWorkFlow(); 
                        this.isEdit = false;
                        // this.isEditLabel = '已请购数量';
                   } else {
                        this.$Message.error(res.message);
                   }
                });
            },

            getDetail(){
                // 获取数据
                purchaseManagesalesRequiritionReadyListtDetail(this, {
                    ids: this.slectedArrFromList,
                }).then(res => {
                    if (res && res.status == 1) {
                        this.buyProductList = res.data;
                        //this.requiritionCount.total_num = res.data.total_num;
                        
//                        this.buyProductList.forEach(item => {
//                            item.requisition_num = 0;
//                        });


                    }
                });
            },

            submit(){
                //console.log(this.salesRequirition.note);
                let is_stock = false;
                this.EditedProductList = [];
                this.HaveStockInfo = [];
                this.buyProductList.forEach(item => {

                    if(item.stock > 0 ){
                        is_stock = true;
                        this.HaveStockInfo.push({
                            cpdhh:item.cpdhh,
                            cpxh:item.cpxh,
                            requisition_num:item.requisition_num,
                            stock:item.stock,
                        })
                    }
                    this.EditedProductList.push({
                        id: item.sell_detail_id,
                        number: item.requisition_num,
                        note:item.note
                    });
                });

                if(is_stock){
                    this.showSave = true;
                }else{
                    this.Save();
                }


            },


            Save(){
                this.loadding = true;
                // 商品明细信息修改
                purchaseManagesalesRequiritionAdd(this, {
                    note: this.salesRequirition.note,
                    params: JSON.stringify({
                        list: this.EditedProductList
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('新增成功!');

                        util.openNewPage(this, 'service-sales-xsqgd-detail', {
                            param: res.data.requisition_no,
                            fromAdd: 1
                        });
                        this.loadding = false;
                        this.$router.push({
                            name: 'service-sales-xsqgd-detail',
                            query: {
                                param: res.data.requisition_no,
                                fromAdd: 1
                            }
                        });
                    } else {
                        this.loadding = false;
                        this.$Message.error(res.message);
                    }
                });
            },



            // 弹窗功能函数开始
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.salesRequisition.cpppbh = 'all';
                this.salesRequisition.djbh = '';
                this.salesRequisition.cpdhh = '';
                this.salesRequisition.cpxh = '';
                this.salesRequisition.cpmc = '';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
            handleSelectionChange(selectedVal) {
                this.selectedToAdd = [];
                selectedVal.forEach(item => {
                    this.selectedToAdd.push(item);
                });
            },
            confirmAdd() {
                if (this.selectedToAdd.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                let selectedId;
                this.selectedToAdd.forEach(item => {
                    // 数据初始化

                    item.hh = this.buyProductList.length + 1;
                    item.requisition_num = 0;


                    selectedId = item.sell_detail_id;
                    let isRepeat = false;
                    this.buyProductList.forEach(item => {
                        if (item.sell_detail_id == selectedId) {
                            isRepeat = true;
                        }
                    });
                    if (!isRepeat) {
                        this.buyProductList.push(item);
                    }
                });
                this.showAdd = false;
            },
            // 弹窗功能函数结束

            goToHTD (id) {
                util.openNewPage(this, 'purchase_manage_HT_detail', {
                    param: id
                });
                this.$router.push({
                    name: 'purchase_manage_HT_detail',
                    query: {
                        param: id
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
            getAllInfos () {
                //获取所有采购员


                //获取所有产品品牌
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {

                        this.brandList = this.brandList.concat(res.data);
                    }
                });


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
        },
        created () {
            this.getAllInfos();
            // this.getWorkFlow();
             this.getDetail();
            // this.getMapDetail();
        }
    };
</script>