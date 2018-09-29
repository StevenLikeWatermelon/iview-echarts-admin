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
                    <el-table :data="goodsData" border style="text-align: center" :row-class-name="tableRowClassName">
                        <el-table-column prop="brand_name" label="品牌"width="120" ></el-table-column>
                        <el-table-column prop="general_series" label="通用系列" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_category_name" label="产品类别"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" label="产品状态" width="120"></el-table-column>
                        <el-table-column prop="note" label="失败原因" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" v-if="checkedStatus">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteItem(scope.row.id)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-if="totalnum > 10"></pagination> -->
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card v-if="checkedStatus">
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="disDeleteModal()" >删除</Button>
                <Button type="success" class="margin-top-10"  style="margin:auto;margin-left: 20px;" @click="goCheck()">审核通过</Button>
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
    import pagination from '@/views/common/pagination.vue';
    import { operateProductAddDetail, operateProductAddDetailDelete, operateProductAddDetailCheck, operateProductAddDelete } from '@/config/getData';
    import { manualCheck } from '@/config/mUtils';
    export default {
        data () {
            return {
                isEdit: true,
                goodsData: [],
                allData: [],
                billsInfo: {
                    num: 0,
                    time: '',
                    notes: ''
                },
                showSpin: false,
                totalnum: 0,
                checkedStatus: false,
                currentPage: 1,
                showModal: false,
                limit: 10,
                operateAuth: manualCheck('opreate_add_new_all_button')
            };
        },
        components: {
            pagination
        },
        methods: { 
            getProductDetail() {
                this.showSpin = true;
                operateProductAddDetail(this, {
                    order_no: this.$route.query.order_no
                }).then(res => {
                    this.billsInfo.num = res.data.basic_info.order_no;
                    this.billsInfo.time = res.data.basic_info.create_time;
                    this.billsInfo.notes = res.data.basic_info.note;
                    this.checkedStatus =  (res.data.basic_info.status == '0' && this.operateAuth) ? true : false;
                    this.goodsData = res.data.product_info;
                    this.showSpin = false;
                });
            },
            deleteItem(id) {
                operateProductAddDetailDelete(this, {
                    params: JSON.stringify([id]),
                    order_no: this.$route.query.order_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功');
                        this.getProductDetail();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            goCheck() {
                this.$Spin.show();
                operateProductAddDetailCheck(this, {
                    order_no: this.$route.query.order_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('审核成功');
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.$Spin.hide();
                    this.getProductDetail();
                });
            },
            disDeleteModal() {
                this.showModal = true;
            },
            deleteXZd() {
                this.showSpin = true;
                operateProductAddDelete(this, {
                    order_no: this.$route.query.order_no
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功');
                        history.go(-1);
                    } else {
                       this.$Message.error(res.message);
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
