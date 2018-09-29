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
                    基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="8">
                            <FormItem label="活动编号：">
                                <span>{{basicInfo.discount_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="活动名称：">
                                <span>{{basicInfo.discount_name}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="活动状态：">
                                <span>{{basicInfo.discount_status | activityStatus}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="活动描述：">
                                <span>{{basicInfo.depict}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="创建时间：">
                                <span>{{basicInfo.create_time}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="创建人：">
                                <span>{{basicInfo.create_user_name}}/{{basicInfo.create_user_no}}</span>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="活动时间：">
                                <span>{{basicInfo.start_time}} ~ {{basicInfo.end_time}}</span>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="活动图片：">
                                <img :src="basicInfo.imgSrc" width="120" style="border:1px solid #eee;">
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10"  v-if="type != 3">
            <Col span="24">
                <Card  v-if="type == '2'">
                    <p slot="title" class="card-title">
                        <span>活动品牌</span>
                    </p>
                    <el-table :data="addDataList" border stripe style="text-align: center;width:50%">
                        <el-table-column label="品牌" prop="brand_name" min-width="150"></el-table-column>
                    </el-table>
                </Card>
                <Card  v-if="type == '1'">
                    <p slot="title" class="card-title">
                        <span>活动系列</span>
                    </p>
                    <el-table :data="addDataList" border stripe style="text-align: center;">
                        <el-table-column prop="product_no" label="产品编号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="general_series" label="通用系列" min-width="150" show-overflow-tooltip></el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    活动折扣
                </p>
                <el-table :data="discountDataList" border stripe style="text-align: center;width:50%">
                    <el-table-column label="折扣金额" prop="money" min-width="100"></el-table-column>
                    <el-table-column label="折扣" prop="discount" min-width="100"></el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
                <Card>
                    <Button type="primary" class="margin-top-10" style="margin:auto;" v-if="fromAdd" @click="backToList">返回</Button>
                    <Button type="primary" class="margin-top-10" style="margin:auto;" v-if="!fromAdd" @click="backTo">返回</Button>
                    <Button type="primary" style="margin-left:20px;" :loading="loading" v-show="basicInfo.discount_status == 0" v-auth="updateAuth" @click="doUpdate(1)">启用</Button>
                    <Button type="primary" style="margin-left:20px;" :loading="loading" v-show="basicInfo.discount_status == 1" v-auth="updateAuth" @click="doUpdate(0)">停用</Button>
                    <Button type="primary" style="margin-left:20px;" :loading="loading" v-show="basicInfo.discount_status == 0" v-auth="deleteAuth" @click="deleteActivity">删除</Button>
                </Card>
            </Col>
        </Row>
        <Modal v-model='showError' :mask-closable=false :width="1200">
            <h3 slot="header" v-if="type == '2'">当前活动时间内已存在启用中的品牌折扣活动</h3>
            <h3 slot="header" v-if="type == '3'">当前活动时间内已存在启用中的订单折扣活动</h3>
            <h3 slot="header" v-if="type == '1'">当前活动时间内已存在启用中的系列折扣活动</h3>
            <Row>
                <Col span="24">
                    <el-table :data="errorResDataList" border stripe style="text-align: center;">
                        <el-table-column label="活动编号" prop="discount_no" min-width="140"></el-table-column>
                        <el-table-column label="活动名称" prop="discount_name" min-width="140"></el-table-column>
                        <el-table-column label="品牌" v-if="type == '2'" prop="brand_name" min-width="140"></el-table-column>
                        <el-table-column label="产品编号"  v-if="type == '1'" prop="product_no" min-width="140"></el-table-column>
                        <el-table-column label="产品名称"  v-if="type == '1'" prop="product_name" min-width="140"></el-table-column>
                        <el-table-column label="活动时间" min-width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.start_time}} ~ {{scope.row.end_time}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="showError = false">知道了</Button>
            </div>
        </Modal>
        <Modal v-model='showInfo' :mask-closable=false :width="1200">
            <h3 slot="header">以下内容是时间冲突活动</h3>
            <Row>
                <Col span="24">
                    <el-table :data="infoResDataList" border stripe style="text-align: center;">
                        <el-table-column label="活动编号" prop="discount_no" min-width="140"></el-table-column>
                        <el-table-column label="活动名称" prop="discount_name" min-width="140"></el-table-column>
                        <el-table-column label="活动类型" min-width="140">
                            <template slot-scope="scope">
                                <span>{{scope.row.type | activityType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="活动时间" min-width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.start_time}} ~ {{scope.row.end_time}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="cancelForceConfirm">取消</Button>
                <Button type="primary" :loading="loading" @click="forceConfirm">确定</Button>
            </div>
        </Modal>
        <Modal v-model='showDelete' :mask-closable=false>
            <h3 slot="header">确认删除</h3>
            <p>确认删除该条活动</p>
            <div slot="footer">
                <Button type="primary" @click="cancelDelete">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmDelete">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { operateDiscountDetailApi, operateDiscountUpdateApi, operateDiscountDeleteApi } from '@/config/getData';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                showDelete: false,
                showAdd: false,
                showError: false,
                showInfo: false,
                loading: false,
                id: this.$route.query.param,
                fromAdd: this.$route.query.fromAdd,
                type: this.$route.query.type,
                basicInfo: {
                    imgSrc: '',
                    discount_status: '',
                },
                statusType: '',
                now_activity: 1,

                addDataList: [],
                discountDataList: [],

                errorResDataList: [],
                infoResDataList: [],
            };
        },
        props: ['typeModule', 'updateAuth', 'deleteAuth'],
        methods: {
            deleteActivity() {
                this.showDelete = true;
            },
            cancelDelete() {
                this.showDelete = false;
            },
            confirmDelete() {
                this.loading = true;
                operateDiscountDeleteApi(this, {
                    discount_no: this.id
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功');
                        this.showDelete = false;
                        this.backToList();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            doUpdate(statusType = this.statusType) {
                this.statusType = statusType
                this.loading = true;
                operateDiscountUpdateApi(this, {
                    params: JSON.stringify({
                        discount_no: this.id,
                        use: this.statusType,
                        now_activity: this.now_activity
                    }),
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('更新成功');
                        this.showInfo = false;
                        this.showError = false;
                        this.getData();
                    }
                    if (res && res.status == 0) {
                        this.$Message.error(res.message);
                    }
                    // tatus：-2，所选折扣中存在进行的品牌/系列折扣，tpe=1或2才有此报错，列表返回data.list中
                    if (res && res.status == -2) {
                        this.errorResDataList = res.data.list;
                        this.showError = true;
                    }
                    // -3：展示当前所包含的活动，now_activity=1的时候才会校验，列表返回data.list中
                    if (res && res.status == -3) {
                        this.infoResDataList = res.data.list;
                        this.showInfo = true;
                    }
                    this.loading = false;
                });
            },
            getData () {
                //基本信息
                operateDiscountDetailApi(this, {
                    discount_no: this.id
                }).then(res => {
                    if (res && res.status == 1){
                        this.basicInfo = res.data.info;
                        this.basicInfo.imgSrc = this.imgURL + res.data.info.image;
                        this.addDataList = res.data.product;
                        this.discountDataList = res.data.range;

                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            cancelForceConfirm() {
                this.showInfo = false;
            },
            forceConfirm() {
                this.now_activity = 0;
                this.doUpdate();
            },
            backTo () {
                history.go(-1);
            },
            backToList () {
                util.openNewPage(this, this.typeModule);
                this.$router.push({
                    name: this.typeModule
                });
            },
        },
        created() {
            this.getData();
        },
        filters: {
            'activityType' (value) {
                switch(+value) {
                    case 1:
                        return '系列折扣';
                    case 2:
                        return '品牌折扣';
                    case 3:
                        return '订单折扣';
                }
            },
            'activityStatus' (value) {
                switch(+value) {
                    case 0:
                        return '停用';
                    case 1:
                        return '启用';
                }
            },
        }
    };
</script>
