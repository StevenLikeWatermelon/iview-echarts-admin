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
                <Form :label-width="120" :model="limitForm" ref="limitForm" :rules="limitRules">
                    <Row>
                        <Col span="12">
                            <FormItem label="活动名称：" prop="discount_name">
                                <Input v-model="limitForm.discount_name" placeholder="请输入活动名称"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="活动时间：" prop="activityTime">
                                <DatePicker type="datetimerange" placeholder="请选择活动时间" :value='limitForm.activityTime' @on-change="getActivityTime" style="width:100%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="活动描述：">
                                <Input v-model="limitForm.depict"  type="textarea"  placeholder="请输入活动描述"></Input>
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="活动图片：" prop="imgSrc">
                                <div v-if="limitForm.imgSrc"><img :src="imgURL + limitForm.imgSrc" width="120" style="border:1px solid #eee;"></div>
                                <div style="height:32px;">
                                    <Upload :action="uploadUrl"
                                            :format="['jpg', 'png', 'jpeg']"
                                            :on-success="handleSuccess"
                                            :show-upload-list="false">
                                        <Button type="primary" icon="ios-cloud-upload-outline" style="width: 120px;">上传 图片</Button>
                                    </Upload>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10" v-if="type != 3">
            <Col span="24">
                <Card v-if="type == '2'">
                    <p slot="title" class="card-title">
                        <span>活动品牌</span>
                    </p>
                    <div slot="extra">
                        <span class="span-for-click" @click="addNewData">新增</span>
                    </div>
                    <el-table :data="addDataList" border stripe style="text-align: center;width:50%">
                        <el-table-column label="品牌" prop="cpppmc" min-width="150"></el-table-column>
                        <el-table-column label="操作"  min-width="100">
                            <template slot-scope="scope">
                                <span class="span-for-click" @click="deleteAddData(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
                <Card v-if="type == '1'">
                    <p slot="title" class="card-title">
                        <span>活动系列</span>
                    </p>
                    <div slot="extra">
                        <span class="span-for-click" @click="addNewSeriesData">新增</span>
                    </div>
                    <el-table :data="addSeriesDataList" border stripe style="text-align: center;">
                        <el-table-column prop="cpbh" label="产品编号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpppmc" label="品牌" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpmcty" label="通用系列" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作"  min-width="100">
                            <template slot-scope="scope">
                                <span class="span-for-click" @click="deleteAddSeriesData(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
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
                <div slot="extra">
                    <span class="span-for-click" @click="addNewDiscount">新增</span>
                </div>
                <el-table :data="discountDataList" border stripe style="text-align: center;width:50%">
                    <el-table-column label="折扣金额" prop="money" min-width="100">
                        <template slot-scope="scope">
                             <Input v-model="scope.row.money" placeholder="请输入折扣金额"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column label="折扣" prop="discount" min-width="100">
                        <template slot-scope="scope">
                             <Input v-model="scope.row.discount" placeholder="请输入折扣"></Input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  min-width="100">
                        <template slot-scope="scope">
                            <span class="span-for-click" @click="deleteAddDiscount(scope.$index)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
                <Card>
                    <Button type="primary" class="margin-top-10" style="margin:auto;" @click="backTo">返回</Button>
                    <Button type="primary" style="margin-left:20px;" @click="save">保存</Button>
                </Card>
            </Col>
        </Row>
        <Modal v-model='showAdd' :mask-closable=false :width="520">
            <h3 slot="header">选择品牌</h3>
            <Row>
                <Col span="24">
                    <Select v-model="addBrand"  placeholder="请选择" filterable multiple>
                        <Option v-for="(item, index) in allBrandList" :value="item.cpppbh" :key="index">{{ item.cpppmc }}</Option>
                    </Select>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelAdd">取消</Button>
                <Button type="primary" :loading="loading" @click="comfirmAdd">确定</Button>
            </div>
        </Modal>
        <add-for-series :showSeiresAdd.sync="showSeiresAdd" @getCurrentSelect="getCurrentSelect"></add-for-series>
        <Modal v-model='showError' :mask-closable=false :width="1200">
            <h3 slot="header" v-if="type == '2'">当前活动时间内已存在启用中的品牌折扣活动</h3>
            <h3 slot="header" v-if="type == '3'">当前活动时间内已存在启用中的订单折扣活动</h3>
            <h3 slot="header" v-if="type == '1'">当前活动时间内已存在启用中的系列折扣活动</h3>
            <Row>
                <Col span="24">
                    <el-table :data="errorResDataList" border stripe style="text-align: center;">
                        <el-table-column label="活动编号" prop="discount_no" min-width="140"></el-table-column>
                        <el-table-column label="活动名称" prop="discount_name" min-width="140"></el-table-column>
                        <el-table-column label="品牌"  v-if="type == '2'" prop="brand_name" min-width="140"></el-table-column>
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
    </div>
</template>
<script>
    import { operateAllBrandsList, operateDiscountAddApi } from '@/config/getData';
    import { setToken, closeCurrentPage } from '@/config/mUtils';
    import addForSeries from './addForSeries.vue';

    import util from '@/libs/util';

    export default {
        data () {
            return {
                showSeiresAdd: false,
                showAdd: false,
                showError: false,
                showInfo: false,
                loading: false,
                limitForm: {
                    discount_name: '',
                    depict: '',
                    imgSrc: '',
                    now_activity: 1,
                    activityTime: [],
                },
                limitRules: {
                    discount_name: [
                        { required: true, message: '输入活动名称', trigger: 'blur' }
                    ],
                    activityTime: [
                        { required: true, message: '输入活动时间', trigger: 'blur', type: 'array'}
                    ],
                    imgSrc: [
                        { required: true,message: '上传活动图片', trigger: 'blur'}
                    ]
                },
                type: this.$route.query.type,
                addBrand: [],
                allBrandList: [],
                addDataList: [],
                addSeriesDataList: [],
                discountDataList: [],

                errorResDataList: [],
                infoResDataList: [],
                uploadUrl: this.baseUrl + '/v1/mall/market/upload-pic?token=' + setToken(),
            };
        },
        props: ['typeModule'],
        components: {
            addForSeries
        },
        methods: {
            addNewSeriesData() {
                this.showSeiresAdd = true;
            },
            getCurrentSelect(selected) {
                selected.forEach(item => {
                    let hasExisted = false;
                    for(let innerItem of this.addSeriesDataList) {
                        if (innerItem.cpbh === item.cpbh) {
                            hasExisted = true;
                            break;
                        }
                    }
                    if (!hasExisted) {
                        this.addSeriesDataList.push(item);
                    }
                })
            },
            deleteAddSeriesData(index) {
                this.addSeriesDataList.splice(index, 1);
            },
            save() {
                //校验基本信息form
                this.$refs['limitForm'].validate((valid) => {
                    if (valid) {
                        if (this.limitForm.imgSrc == '') {
                            this.$Message.error('请上传活动图片!');
                        } else {
                            this.validateOther();
                        }
                    }
                })
            },
            validateOther() {
                let maxTwo =  /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                let maxThree =  /^-?\d+(\.\d{1,3})?$/;
                let moneyTmpObj = {};
                let discountTmpObj = {};
                for (let i = 0; i < this.discountDataList.length; i++) {
                    if (isNaN(this.discountDataList[i].money)) {
                        this.$Message.error(`第${i+1}行折扣金额必须为数字`);
                        return;
                    }
                    if (isNaN(this.discountDataList[i].discount)) {
                        this.$Message.error(`第${i+1}行折扣必须为数字`);
                        return;
                    }
                    if (+this.discountDataList[i].money < 0) {
                        this.$Message.error(`第${i+1}行折扣金额不能小于0`);
                        return;
                    }
                    if (+this.discountDataList[i].discount <= 0) {
                        this.$Message.error(`第${i+1}行折扣不能小于等于0`);
                        return;
                    }
                    if (+this.discountDataList[i].discount > 1) {
                        this.$Message.error(`第${i+1}行折扣不能大于1`);
                        return;
                    }
                    if (!maxTwo.test(this.discountDataList[i].money)) {
                        this.$Message.error(`第${i+1}行折扣金额小数点不能大于2位`);
                        return;
                    }
                    if (!maxThree.test(this.discountDataList[i].discount)) {
                        this.$Message.error(`第${i+1}行折扣小数点不能大于3位`);
                        return;
                    }
                    if (moneyTmpObj[this.discountDataList[i].money]) {
                        this.$Message.error(`第${i+1}行折扣金额有重复`);
                        return;
                    } else {
                        moneyTmpObj[this.discountDataList[i].money] = true;
                    }
                    if (discountTmpObj[this.discountDataList[i].discount]) {
                        this.$Message.error(`第${i+1}行折扣有重复`);
                        return;
                    } else {
                        discountTmpObj[this.discountDataList[i].discount] = true;
                    }
                }
                let tmpDiscountArr = [...this.discountDataList].sort(function (pre, next) {
                    return pre['money'] - next['money'];
                });
                for (let i = 0; i < tmpDiscountArr.length; i++) {
                    if (tmpDiscountArr[i + 1]) {
                        if (+tmpDiscountArr[i + 1].discount  > +tmpDiscountArr[i].discount) {
                            this.$Message.error(`金额折扣不符合折扣规则： 折扣金额越大，折扣越小。`);
                            return;
                        }
                    }
                }
                this.doSave();
            },
            doSave() {
                let tmpArr = [];
                // 系列
                if (this.type == 1) {
                    this.addSeriesDataList.forEach(item => {
                        tmpArr.push(item.cpbh);
                    });
                }
                // 品牌
                if (this.type == 2) {
                    this.addDataList.forEach(item => {
                        tmpArr.push(item.cpppbh);
                    });
                }
                this.loading = true;
                operateDiscountAddApi(this, {
                    params: JSON.stringify(this.notempty({
                        discount_name: this.limitForm.discount_name,
                        depict: this.limitForm.depict,
                        image: this.limitForm.imgSrc,
                        now_activity: this.limitForm.now_activity,
                        type: this.type,

                        starttime: this.limitForm.activityTime[0],
                        endtime: this.limitForm.activityTime[1]
                    })),
                    product: JSON.stringify(tmpArr),
                    range: JSON.stringify(this.discountDataList),
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功');
                        closeCurrentPage(this);
                        util.openNewPage(this, this.typeModule,{
                            param: res.data.discount_no,
                            fromAdd: 1,
                            type: this.type
                        });
                        this.$router.push({
                            name: this.typeModule,
                            query: {
                                param: res.data.discount_no,
                                fromAdd: 1,
                                type: this.type
                            }
                        });
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
            getActivityTime(value) {
                this.limitForm.activityTime = value || [];
                this.$refs['limitForm'].validate();
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                    this.limitForm.imgSrc = response.data.url;
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                } else {
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
                this.$refs['limitForm'].validate();
            },
            addNewData() {
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allBrandList = res.data.list;
                        this.showAdd = true;
                    }
                });  
            },
            cancelAdd() {
                this.showAdd = false;
            },
            comfirmAdd() {
                this.addDataList = [];
                this.allBrandList.forEach(item => {
                    if (this.addBrand.includes(item.cpppbh)) {
                        this.addDataList.push({
                            cpppbh: item.cpppbh,
                            cpppmc: item.cpppmc,
                        });
                    }
                });
                this.showAdd = false;
            },
            addNewDiscount() {
                this.discountDataList.push({
                    money: '',
                    discount: ''
                });
            },
            deleteAddDiscount(index) {
                this.discountDataList.splice(index, 1);
            },
            deleteAddData(index) {
                this.addDataList.splice(index, 1);
            },
            cancelForceConfirm() {
                this.showInfo = false;
            },
            forceConfirm() {
                this.limitForm.now_activity = 0;
                this.doSave();
            },
            backTo () {
                history.go(-1);
            },
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
            }
        }
    };
</script>
