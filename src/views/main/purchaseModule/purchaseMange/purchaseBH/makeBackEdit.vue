<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="24">
                            <FormItem label="备货修改备注：">
                                <Input type="textarea" v-model="backEditForm.note" style="width:50%;"></Input>
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
                        备货商品明细
                    </p>
                    <el-table :data="dataList" border stripe style="text-align: center" max-height="570">
                        <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_origin_price" label="产品面价" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ (+scope.row.product_origin_price).toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_discount" label="备货折扣" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="requisition_price" label="备货单价" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="requisition_num" label="备货数量" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="can_cancel_num" label="可取消数量" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cancel_num" label="取消数量" min-width="110">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.cancel_num" @on-change="scope.row.cancel_price = (scope.row.cancel_num * scope.row.requisition_price).toFixed(3);"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cancel_price" label="取消金额" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="requisition_leadtime" label="备货货期(天)" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="note" label="备注" min-width="120"></el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loading" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiGetPurchaseBackupDetail, purchangeBackEditAddApi } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                backEditForm: {
                    note: '',
                },
                loading: false,
                dataList: []
            };
        },
        components: {
            pagination
        },
        methods: {
            getDetailData() {
                //基本信息
                apiGetPurchaseBackupDetail(this, {
                    requisition_no: this.$route.query.param,
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.detail.forEach(item => {
                            item.cancel_num = 0;
                            item.cancel_price = 0;
                        });
                        this.dataList = res.data.detail;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            save() {
                let reg = /^(0|[1-9]\d*)$/;
                let noZero = false;
                for (let i = 0; i < this.dataList.length; i++) {
                    if (!reg.test(this.dataList[i].cancel_num)) {
                        this.$Message.error(`第${i + 1}行取消数量输入有误!`);
                        return;
                    }
                    if (+this.dataList[i].cancel_num > +this.dataList[i].can_cancel_num) {
                        this.$Message.error(`第${i + 1}行取消数量不能大于可取消数量!`);
                        return;
                    }
                    if (+this.dataList[i].cancel_num > 0) {
                        noZero = true;
                    }
                }
                if (!noZero) {
                    this.$Message.error('取消数量不能全部为0!');
                    return;
                }
                this.loading = true;
                let tmpArr = [];
                this.dataList.forEach(item => {
                    tmpArr.push({
                        cancel_num: +item.cancel_num,
                        detail_id: item.id,
                    });
                });
                purchangeBackEditAddApi(this, {
                    requisition_no: this.$route.query.param,
                    params: JSON.stringify(tmpArr),
                    note: this.backEditForm.note
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('新增成功!');
                        closeCurrentPage(this);
                        util.openNewPage(this, 'purchase_manage_BH_edit_detail',{
                            param: res.data.order_change_no,
                            fromAdd: 1
                        });
                        this.$router.push({
                            name: 'purchase_manage_BH_edit_detail',
                            query: {
                                param: res.data.order_change_no,
                                fromAdd: 1
                            }
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getDetailData();
        }
    };
</script>
