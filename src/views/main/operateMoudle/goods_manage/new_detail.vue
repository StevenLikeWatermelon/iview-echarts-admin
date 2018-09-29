<style>
  .el-table .warning-row {
    background: #d8e0f7;
  }
  .newPaperDetailDisGreen {
    background-color: rgba(0, 176, 80, 0.5);
  }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        商品基础信息
                    </p>
                    <Form :label-width="100" >
                        <Row>
                            <Col span="8">
                            <FormItem label="单据编号：">
                                <span>{{billsInfo.num}}</span>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="制单时间：">
                                <span>{{billsInfo.time}}</span>
                            </FormItem>
                            </Col>
                            <Col span="8">
                            <FormItem label="单据备注：">
                                <span>{{billsInfo.notes}}</span>
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
                        商品信息
                    </p>
                    <el-table :data="goodsData" border style="text-align: center" :row-class-name="tableRowClassName" max-height="570">
                        <el-table-column show-overflow-tooltip prop="zwpp" label="品牌" >
                            <template slot-scope="scope">
                                <span :class="{newPaperDetailDisGreen: (scope.row.no_pp == 1)}">{{scope.row.zwpp}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxlty" label="通用系列" min-width="120">
                            <template slot-scope="scope">
                                <span :class="{newPaperDetailDisGreen: (scope.row.no_ty == 1)}">{{scope.row.cpxlty}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxl" label="产品名称" min-width="150">
                            <template slot-scope="scope">
                                <span :class="{newPaperDetailDisGreen: (scope.row.no_xl == 1)}">{{scope.row.cpxl}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cplb" label="产品类别" >
                            <template slot-scope="scope">
                                <span :class="{newPaperDetailDisGreen: (scope.row.no_lb == 1)}">{{scope.row.cplb}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cjdhh" label="商品订货号" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cjwlh" label="商品型号" min-width="150"></el-table-column>
                        <!-- <el-table-column show-overflow-tooltip prop="xy_cp_id" label="新阳产品编码" >
                            <template slot-scope="scope">
                                <span>{{scope.row.xy_cp_id = scope.row.xy_cp_id || '--'}}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column show-overflow-tooltip prop="zxbzs" label="最小包装数" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jldw" label="计量单位" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jz" label="净重" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="bz" label="备注" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ztbz" label="状态备注" ></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-if="totalnum > 10"></pagination>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;" v-auth="buttonAuth">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="disDeleteModal()">删除</Button>
                <Button type="success" class="margin-top-10"  style="margin:auto;margin-left: 20px;" @click="goCheck()" v-show="!checkedStatus"  v-auth="operateAuth">审核通过</Button>
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
         <Modal  v-model="showModal"  title="确定删除"  @on-ok="deleteXZd">
            <p>确定删除该商品新增单?</p>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { getcpxzdDetail, xzdCheckApi, xzdDeleteApi } from '@/config/getData';
    export default {
        data () {
            return {
                isEdit: true,
                buttonAuth: 'add_order_detail_all_button',
                goodsData: [],
                allData: [],
                billsInfo: {
                    num: 0,
                    time: '',
                    notes: ''
                },
                showSpin: false,
                totalnum: 0,
                checkedStatus: true,
                currentPage: 1,
                showModal: false,
                limit: 10,
                operateAuth: 'goods-new-add-approve-button'
            };
        },
        components: {
            pagination
        },
        methods: { 
            getProductDetail() {
                this.showSpin = true;
                getcpxzdDetail(this, {
                    cpxzd_djbh: this.$route.query.cpxzdNum
                }).then(res => {
                    this.billsInfo.num = res.data.djbh;
                    this.billsInfo.time = res.data.djrq;
                    this.billsInfo.notes = res.data.djbz;
                    this.checkedStatus =  res.data.workflow_state == '3' ? false : true;
                    this.allData = res.data.mxs;
                    this.totalnum = res.data.mxs.length;
                    this.goodsData = this.allData.slice(0, this.limit);
                    this.showSpin = false;
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.goodsData = this.allData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            tableRowClassName({row, rowIndex}) {
                if (row.no_lb == 0 && row.no_pp == 0 && row.no_xl == 0 && row.no_ty == 0 && row.no_sku == 1) {
                    return 'warning-row';
                }
                return ''
            },
            goCheck() {
                this.showSpin = true;
                xzdCheckApi(this, {
                    cpxzd_djbh: this.billsInfo.num
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('审核成功');
                    } else {
                        this.$Message.error('审核失败,请检查状态备注');
                    }
                    this.showSpin = false;
                    this.getProductDetail();
                });
            },
            disDeleteModal() {
                this.showModal = true;
            },
            deleteXZd() {
                this.showSpin = true;
                xzdDeleteApi(this, {
                    cpxzd_djbh: this.billsInfo.num
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功');
                        history.go(-1);
                    } else {
                        this.$Message.error('删除失败');
                    }
                    this.showSpin = false;
                });
            }
        },
        created() {
            this.getProductDetail();
        }
    };
</script>
