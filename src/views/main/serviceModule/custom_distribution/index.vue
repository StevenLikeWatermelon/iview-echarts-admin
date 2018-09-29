<style scoped>
    .ivu-btn-warning {
        background-color: #ff99005c;
    }
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                            <Input v-model="orderInfo.khmc" placeholder="请输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Input v-model="orderInfo.sjhm" placeholder="请输入手机号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.status"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in khIsDeleteArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10" v-if="showRow">
                    <Col span="24">
                    <Button type="primary" v-auth="customDistriLimit" @click="handleClick()">客户分配</Button>
                    <Button type="primary" v-auth="servicecustomdistributionenable" @click="enable()">启用</Button>
                    <Button type="primary" v-auth="servicecustomdistributiondisable" @click="disable()">禁用</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="dataList" border style="text-align: center" @sort-change="manualSort" @selection-change="handleSelectionChange">
                    <el-table-column show-overflow-tooltip  type="selection"  width="55"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="khbh" label="客户编号" width="110"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="khmc" label="客户名称" min-width="200"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="sjhm" label="手机号码" width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="lxr" label="联系人" width="110"></el-table-column>
                    <el-table-column show-overflow-tooltip label="企业认证" width="110">
                        <template slot-scope="scope">
                            <span>{{componyConfirmObj[scope.row.is_qyrz] || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="jf" label="积分" sortable="custom" width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="khdjmc" label="客户等级" width="110"></el-table-column>
                    <el-table-column show-overflow-tooltip label="状态" width="100">
                        <template slot-scope="scope">
                            <span>{{customIsDelObj[scope.row.is_deleted] || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="addr" label="企业地址" min-width="200" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="barq" label="状态创建时间" sortable="custom" width="160"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="num" label="待分配订单数" sortable="custom" width="150"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Modal v-model="showDis" title="客户分配" class="modal-margin">
            <Row style="margin-bottom: 10px;">
                <Col span="24" style="text-align:center">
                    <Button type="warning" icon="alert"><span style="color: #000">客户分配后，系统会将客户的“待分配销售合同单”自动分配到绑定的客服、销售</span></Button>
                </Col>
            </Row>
            <Form ref="bindServiceObj" :model="bindServiceObj" :label-width="95" :show-message="false" >
                <FormItem prop="bindService" label="绑定的客服">
                    <Select v-model="bindServiceObj.bindService" style="width:200px;" placeholder="请选择客服" filterable>
                        <Option v-for="item in allService" :value="item.czyg_ygbh" :label="item.czyg" :key="item.czyg_ygbh" ></Option>
                    </Select>
                </FormItem>
                <FormItem prop="bindSale" label="绑定的销售">
                    <Select v-model="bindServiceObj.bindSale" style="width:200px;" placeholder="请选择销售" filterable>
                        <Option v-for="item in allSales" :value="item.ygbh" :label="item.ygxm" :key="item.ygbh" ></Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel()">取消</Button>
                <Button type="primary"  @click="confirm()" :loading="loading">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { customerDistribution,apicustomerDistributionState, apiAllStatus, apiCustomerAllStaff, customerDistribute} from '@/config/getData';
    import { sortBy, manualCheck } from '@/config/mUtils';
    export default {
        data () {
            return {
                orderInfo: {
                    khmc:'',
                    sjhm:'',
                    status:'all',
                },
                dataList: [],
                ajaxHistoryData: [],
                totalnum: 0,
                limit: 10,
                currentPage: 1,
                showDis: false,
                bindServiceObj: {
                    bindService: '',
                    bindSale: ''
                },
                customIsDelObj: {},
                componyConfirmObj: {},
                invoinceTypeArrForm: [],
                selectedData: [],
                allService: [],
                allSales: [],
                loading: false,
                customDistriLimit: 'service-custom-distri-limit',
                servicecustomdistributiondisable: 'service-custom-distribution-disable',
                servicecustomdistributionenable: 'service-custom-distribution-enable',
                showRow: false,
                khIsDeleteArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick () {
                if (this.selectedData.length <= 0) {
                    this.$Message.error('请至少选择一条数据!');
                } else {
                    this.showDis = true;
                }
            },
            //启用
            enable(){
                if (this.selectedData.length <= 0) {
                    this.$Message.error('请至少选择一条数据!');
                } else {
                    apicustomerDistributionState(this,{
                        type:'enable',
                        params: JSON.stringify(this.selectedData)
                    }).then(res => {
                        if(res && res.status == 1){
                            this.$Message.success(res.message);
                            this.getData();
                        }else{
                            this.$Message.error({content:res.message,duration:0,closable:true});
                            this.getData();
                        }
                    });
                }
            },
            //禁用
            disable(){
                if (this.selectedData.length <= 0) {
                    this.$Message.error('请至少选择一条数据!');
                } else {
                    apicustomerDistributionState(this,{
                        type:'disable',
                        params: JSON.stringify(this.selectedData)
                    }).then(res => {
                        if(res && res.status == 1){
                            this.$Message.success(res.message);
                            this.getData();
                        }else{
                            this.$Message.error({content:res.message,duration:0,closable:true});
                            this.getData();
                        }
                    });
                }
            },
            getStatus () {
                apiAllStatus(this, {
                     type: JSON.stringify(['is_qyrz','kh_is_deleted'])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.componyConfirmObj = res.data.is_qyrz;
                        this.customIsDelObj = res.data.kh_is_deleted;
                        let tmpObj ={};
                        for (let key in res.data.kh_is_deleted) {
                            if (res.data.kh_is_deleted.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.kh_is_deleted[key]
                                };
                                this.khIsDeleteArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getSalesAndService (type) {
                 apiCustomerAllStaff(this,{
                    params: JSON.stringify({
                        type: type
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        if (type == "all_customer_service") {
                            this.allService = res.data.list;
                            this.bindServiceObj.bindService = res.data.list[0].czyg_ygbh;
                        }
                        if (type == "all_sale") {
                            this.allSales = res.data.list;
                            this.bindServiceObj.bindSale = res.data.list[0].ygbh;
                        }
                    }
                });
            },
            search () {
                this.getData();
            },
            reset () {
                this.orderInfo.khmc = '';
                this.orderInfo.sjhm = '';
                this.search();
            },
            getData(closeModal) {
                customerDistribution(this, {
                    params: JSON.stringify({
                        khmc: this.orderInfo.khmc,
                        sjhm: this.orderInfo.sjhm,
                        is_deleted:(this.orderInfo.status === 'all')?'':this.orderInfo.status,
                    })
                }).then(res => {
                    if (res && res.data) {
                        this.ajaxHistoryData = res.data.list;
                        this.dataList = this.ajaxHistoryData.slice(0, this.limit);
                        this.totalnum = res.data.total_num;
                        if (closeModal) {
                            this.showDis = false;
                        }
                    } else {
                        this.$Message.error('获取客户列表失败!')
                    }
                });
            },
            doCustomerDistribute () {
                customerDistribute(this, {
                    params: JSON.stringify({
                        khbh: this.selectedData,
                        kfygbh: this.bindServiceObj.bindService,
                        xsygbh: this.bindServiceObj.bindSale
                    })
                }).then(res => {
                    if (res && res.status) {
                        if (res.tsxx && res.tsxx.length > 0) {
                            let errMsg = res.tsxx.join(',');
                            this.$Message.error(errMsg);
                        } else {
                            this.$Message.success('分配成功!');
                            this.getData(true);
                        }
                    }
                    this.loading = false;
                });
            },
            confirm() {
                this.loading = true;
                this.doCustomerDistribute();
            },
            cancel() {
                this.showDis = false;
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.dataList = this.ajaxHistoryData.slice(_start, _end);
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
            },
            handleSelectionChange (val) {
                this.selectedData = val.map(item => item.khbh);
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.getSalesAndService('all_customer_service');
            this.getSalesAndService('all_sale');
            //判断row是否显示
            this.showRow = manualCheck(this.customDistriLimit) || manualCheck(this.servicecustomdistributionenable) || manualCheck(this.servicecustomdistributiondisable);
        }
    };
</script>
