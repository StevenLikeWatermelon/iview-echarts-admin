<template>
    <div>
        <Row class="margin-top-10 th-detail">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        单据基本信息
                    </p>                  
                    <Form :label-width="120">
                        <Row>
                            <Col span="6">
                                <FormItem label="销售请购单编号：" style="margin:0">
                                    <span>{{requisition_no}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建人：" style="margin:0">
                                    <span>{{basic_info.create_user_name}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="创建时间：" style="margin:0">
                                    <span>{{basic_info.create_time}}</span>
                                </FormItem>
                            </Col>
                            <Col span="24">
                                <FormItem label="备注：" style="margin:0">
                                    <span>{{basic_info.note}}</span>
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
                        <Icon type="ios-list"></Icon>
                        请购商品明细
                    </p>           
                    <Row>
                        <col span="24">
                            <div class="margin-bottom-10">
                                <span>请购商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                                <span class="margin-left-20">取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ cancelAll  }}</em></span>
                            </div>
                            <el-table :data="actTableData" border stripe style="text-align: center;" @sort-change="manualSort">
                                <el-table-column prop="hh" label="行号"></el-table-column>
                                <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                                <el-table-column prop="htsl" label="合同数量" sortable="custom" min-width="100"></el-table-column>
                                <el-table-column prop="requisition_num" label="请购数量"  sortable="custom" min-width="100"></el-table-column>
                                <el-table-column prop="able_modify_num" label="可取消数量"  sortable="custom" min-width="100"></el-table-column>
                                <el-table-column prop="change_num" label="取消数量" sortable="custom" min-width="100">
                                    <template slot-scope="scope">
                                        <Input type="text" v-model="scope.row.change_num" @on-change="getCount();" @on-blur="numChange(scope.row.change_num, scope.row.requisition_num, scope.$index)"></Input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="来源单据编号" width="120">
                                    <template slot-scope="scope">
                                        <span  @click="handleClick({param: scope.row.sell_order_no}, 'service-sales-htd-detail')" type="text" size="small">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.sell_order_no}}</span>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="采购合同单编号" width="120">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.buy_order_no.length > 0">
                                            <el-popover trigger="hover" placement="top">
                                                <p v-for="val in scope.row.buy_order_no"><span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: val}, 'purchase_manage_HT_detail')">{{ val }}</span></p>
                                                <div slot="reference" class="name-wrapper">
                                                    <el-tag size="medium" style="color: rgb(45, 140, 240);">查看</el-tag>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buy_user_name" label="采购员" width="120"></el-table-column>
                            </el-table>
                        </col>
                    </Row>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10 th-detail">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        备注：
                    </p>                  
                    <Form :label-width="120">
                        <Row>
                            <Col span="6">
                                <Input v-model="edit_note.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />

                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loadding" @click="add()">保存</Button>
            </Card>
            </Col>
        </Row>        
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { isCurrentApprover, isInCreaters, isFinalApprover, isTaskCreater, closeCurrentPage } from '@/config/mUtils';
    import { apiRequisitionDetail,apiRequisitionEditAdd} from '@/config/getData';

    export default {        
        components: {
            pagination
        },        
        data () {
            return {
                actTableData: [],
                goodsAll: 0,
                bulktext: '',
                edit_note: {},
                cancelAll: 0,
                showAdd: false,
                isEdit: false,
                isBasicEdit: false,
                canEdit: true,
                canDelete: false,
                canAbandon: false,
                canBack: false,
                canPush: false,
                canApprove: false,
                showDelete: false,
                showAbandon: false,
                basic_info:{},
                requisition_no:this.$route.query.param,
                salesRequirition: {
                    id: this.$route.query.param,
                    creator: '',
                    note: '',
                    time: '2018年4月3日09:57:01'
                },
                personalList: [{
                    label: '张三',
                    value: '张三'
                },{
                    label: '李四',
                    value: '李四'
                },{
                    label: '王二麻',
                    value: '王二麻'
                }],
                copysalesRequirition: {},
                requiritionCount: {
                    total_num: 0
                },
                allAddressArr: [],
                buyProductList: [{
                    hh: '1',
                    require_num: 323,
                    person: '张三'
                },{
                    hh: '2',
                    require_num: 323,
                    person: '李四'
                },{
                    hh: '3',
                    require_num: 323,
                    person: '王二麻'
                }],
                EditedProductList: [],
                copyProductList: [],
                typeObj: {
                    order_return_no: '',
                    type: ''
                },
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                isEditLabel: '已请购数量',

                //以下为弹窗内的数据初始化
                salesRequisition: {
                    brand: 'all',
                    daiding: '字段待定'
                },
                brandList: [{
                    label: '全部',
                    value: 'all'
                }],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',   
                selectedToAdd: [],
                productToAdd: [{
                    id: 1,
                    create_time: '2018年4月3日10:50:31',
                    note: 'test',
                    status: 'teststaus'
                },{
                    id: 12,
                    create_time: '2018年4月3日10:50:31',
                    note: 'test',
                    status: 'teststaus'
                },{
                    id: 13,
                    create_time: '2018年4月3日10:50:31',
                    note: 'test',
                    status: 'teststaus'
                },{
                    id: 14,
                    create_time: '2018年4月3日10:50:31',
                    note: 'test',
                    status: 'teststaus'
                }],
                loadding: false           
            };
        },
        methods: {
            add(){
                let detail = [];
                    for (let i in this.actTableData) {
                        let n = parseInt(i) + parseInt(1);
                        if (parseInt(this.actTableData[i].change_num) > parseInt(this.actTableData[i].requisition_num)) {
                            this.$Message.error('第' + n + '行的取消数量不能大于请购数量');
                            return false;
                        }

                        detail.push({
                            id:this.actTableData[i]['id'],
                            change_num:this.actTableData[i]['change_num'],
                            before_num:this.actTableData[i]['requisition_num'],
                            after_num:this.actTableData[i]['requisition_num'] - this.actTableData[i]['change_num']
                        });
                    }
                    this.loadding = true;
                    apiRequisitionEditAdd(this, {
                    params:JSON.stringify(this.notempty({
                        requisition_no:this.$route.query.param,
                        note:this.edit_note.note,
                        detail:detail
                        }))
                    }).then( res => {
                        if (res.status === 1) {
                            this.$Message.success(res.message);
                            closeCurrentPage(this);
                            this.loadding = false;
                            this.handleClick({param: res.data.change_no, fromAdd: '1'}, 'service-sales-qgxgd-detail');
                        }else{
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
            },
            numChange (m, n, index) {
                let i = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(m)) {
                    this.$Message.error('第' + i + '行的取消数量必须是大于等于0的整数');
                } else if (parseInt(m) > parseInt(n)) {
                    this.$Message.error('第' + i + '行的取消数量不能大于请购数量');
                }
            },
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                for (let i in this.actTableData) {
                    allNum = parseInt(allNum) + parseInt(this.actTableData[i].requisition_num);
                    allAmount = parseInt(allAmount) + parseInt(this.actTableData[i].change_num);
                }
                this.goodsAll = allNum;
                this.cancelAll = allAmount;
            },
            backTo () {
                history.go(-1);
            },
            getData(){
                console.log(this.$route.query.param);
                apiRequisitionDetail(this, {
                    params: JSON.stringify({ requisition_no: this.$route.query.param })
                }).then( res => {
                    if (res.status === 1) {
                        this.basic_info = res.data.basic_info;
                        for(let i in res.data.product_info){
                            res.data.product_info[i]['change_num'] = 0;
                        }
                        this.actTableData = res.data.product_info;
                        console.log(this.actTableData);
                        this.getCount();

                    }
                });

            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            }            
        },
        created () {
            this.getData();
        }
    };
</script>