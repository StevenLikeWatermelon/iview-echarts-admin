<style>
    .sale_manage_msg {
        color: red;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    活动基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="24">
                        <FormItem label="活动名称：" style="margin:0;">
                            {{ act_name }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="活动时间：" style="margin:0;">
                            {{ act_time }}
                        </FormItem>
                        </Col>
                        <Col span="24">
                        <FormItem label="图片：" style="margin:0;">
                           <img :src="this.imgURL + act_src" width="120" style="border:1px solid #eee;">
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
                    活动商品明细
                </p>
                <div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" :index="indexMethod" label="行号"></el-table-column>
                        <el-table-column label="订货号" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                            <span  @click="handleClick(scope.row)" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.cpdhh}}</span>
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" sortable="custom" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxh" label="产品型号" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpxhmj" label="商品面价" sortable="custom" width="120">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.cpxhmj == '0.00'}">{{ scope.row.cpxhmj }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="discount" label="限时折扣" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="sale_price" label="特卖价格" sortable="custom" min-width="120"></el-table-column>
                        <el-table-column label="特卖库存" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.stock_num > scope.row.actual_num}">{{ scope.row.stock_num }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="actual_num" label="实际库存" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="lead_time" label="货期" sortable="custom" width="100"></el-table-column>
                        <el-table-column prop="zszt" label="在售状态" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span :class="{sale_manage_msg: scope.row.zszt == '0'}">{{ zsztStatus[scope.row.zszt] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>-->
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;" @click="backTo()">返回</Button>
                <div style="display:inline-block;margin-left:20px;" v-auth="buttonAuth">
                    <Button type="primary" class="margin-top-10" v-if="status == '2'" style="margin:auto;" @click="action('on',id)">启用</Button>
                    <Button type="success" class="margin-top-10" v-if="status == '1'" style="margin:auto;" @click="action('off',id)">停用</Button>
                    <Button type="default" class="margin-top-10" v-if="status != '1'" style="margin:auto;" @click="action('delete',id)">删除</Button>
                </div>
            </Card>
            </Col>
        </Row>
        <Modal v-model='publicModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">{{publicState}}</em></P>
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
    import pagination from '../../../common/pagination.vue';
    import {apiGetSalesLimitTimeDetail, apiGetSalesLimitGoodsDetail,apiAllStatus,apiGetSalesLimitOperation,apiGetSalesLimitStop,apiGetSalesLimitDelete } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                act_id: this.$route.query.param,
                buttonAuth: 'limit_time_detail_all_button',
                act_name: '',
                act_time: '',
                act_src: '',
                status:'',
                actTable: {
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                zsztStatus: [],
                publicModal: false,
                loadding: false,
                publicState: '',
                publicCancel: '',
                publicSure: ''
            };
        },
        components: {
            pagination
        },
        methods: {

            action (name, id) {
                if (name === 'on') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '启用该条活动？';
                    this.publicCancel = 'onCancel';
                    this.publicSure = 'onSure';
                    this.act_id = id;
                } else if (name === 'off') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '停用该条活动？';
                    this.publicCancel = 'offCancel';
                    this.publicSure = 'offSure';
                    this.act_id = id;
                }else if (name === 'delete') {
                    this.publicModal = true;
                    this.loadding = false;
                    this.publicState = '删除该条活动？';
                    this.publicCancel = 'deleteCancel';
                    this.publicSure = 'deleteSure';
                    this.act_id = id;
                }
            },
            sureAction (name) {
                if (name === 'onCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'onSure') {
                    this.loadding = true;
                    apiGetSalesLimitOperation(this, {
                        params: JSON.stringify(this.notempty({
                            id: this.act_id,
                            type: 'enable'
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            //this.$Message.error(res.message);
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });

                        }
                    });
                } else if (name === 'offCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'offSure') {
                    this.loadding = true;
                    apiGetSalesLimitStop(this, {
                        id: this.act_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            //this.$Message.error(res.message);
                            this.$Message.error({
                                content: res.message,
                                duration: 5
                            });
                        }
                    });
                }else if (name === 'deleteCancel') {
                    this.publicModal = false;
                    this.loadding = false;
                } else if (name === 'deleteSure') {
                    this.loadding = true;
                    apiGetSalesLimitDelete(this, {
                        id: this.act_id
                    }).then(res => {
                        if (res && res.status == 1) {
                            //this.getData();
                            this.publicModal = false;
                            this.loadding = false;
                            this.$Message.success('删除成功');
                            //history.go(-1);
                            util.redirectPage(this, 'operate_sales_limit_time');


                        } else {
                            this.publicModal = false;
                            this.loadding = false;
                            this.$Message.error(res.message);
                        }
                    });
                }
            },

            handleClick (param) {
                let params = {};
                params = {
                    keywords: param.cpdhh,
                    cppp_cpppbh: param.cpppbh
                };
                util.openNewPage(this, 'operate_goods_price_manage_index', params);
                this.$router.push({
                    name: 'operate_goods_price_manage_index',
                    query: params
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['zszt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.zsztStatus = res.data.zszt;

                    }
                });
            },
            getData () {
                //基本信息
                apiGetSalesLimitTimeDetail(this, {
                    id: this.act_id
                }).then(res => {
                    if (res && res.status == 1){
                        this.act_name = res.data.basic_info.promote_name;
                        this.act_time = res.data.basic_info.start_time + ' ~ ' + res.data.basic_info.end_time;
                        this.act_src = res.data.basic_info.promote_img;
                        this.status = res.data.basic_info.status;
                        this.id = res.data.basic_info.id;

                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getProducts () {
                //活动商品
                apiGetSalesLimitGoodsDetail(this, {
                    params: JSON.stringify(this.notempty({
                        id: this.act_id,
                        all: 'all',
                    }))
                }).then(res => {
                    if (res && res.status == 1){
                        this.actTable.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
            indexMethod (index) {
                return  (this.currentPage - 1) * this.limit + index + 1;
            },
            backTo () {
                //history.go(-1);
                util.redirectPage(this, 'operate_sales_limit_time');

            },
            getNowPage (page) {
                this.currentPage = page;
                this.getProducts();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getProducts();
            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.getProducts();
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
