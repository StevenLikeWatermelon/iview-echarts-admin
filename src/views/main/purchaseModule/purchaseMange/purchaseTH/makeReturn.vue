<style>
    .make-return .ivu-modal-footer {
        display: none;
    }
    .make-return .ivu-card-body .ivu-form-item{
        margin-bottom: 0;
    }
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="bookmark"></Icon>
                        基本信息
                    </p>
                    <Form :label-width="120" ref="supplier_info" :model="supplier_info" :rules="ruleValidate">
                        <Row>
                            <Col span="6">
                                <FormItem label="供应商：">
                                    <span>{{copyInfo.gysmc}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="供应商联系人：">
                                    <span>{{copyInfo.lxr}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="供应商联系方式：">
                                    <span>{{copyInfo.sjhm}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="退货联系人：" prop="lxr">
                                    <Input v-model="supplier_info.lxr" placeholder="请输入退货联系人"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="退货联系方式：" prop="sjhm">
                                    <Input v-model="supplier_info.sjhm" placeholder="请输入退货联系方式"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <div style="width:50%;float:left">
                                    <FormItem label="联系地址区域：" prop="selectdCities">
                                        <Cascader :data="allAddressArr" v-model="supplier_info.selectdCities" filterable @on-change="getCurrentAddress"></Cascader>
                                    </FormItem>
                                </div>
                                <div style="width:50%;float:left;margin-left: -60px;">
                                    <FormItem prop="lxdz">
                                        <Input v-model="supplier_info.lxdz" placeholder="请输入联系地址"></Input>
                                    </FormItem>
                                </div>
                            </Col>
                            <Col span="8">
                                <FormItem label="退货原因：">
                                    <Input v-model="supplier_info.note" type="textarea" :rows="4" placeholder="请输入退货原因"></Input>
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
                        <Icon type="navicon-round"></Icon>
                        申请退货商品明细
                    </p>
                    <Row class="special-return-detail">
                        <col span="24">
                            <Form :label-width="120">
                                <Row>
                                    <Col span="6">
                                        <FormItem label="退货商品总数：">
                                            <span>{{totalInfo.totalNum}}</span>
                                        </FormItem>
                                    </Col>
                                    <Col span="6">
                                        <FormItem label="退货商品总额：">
                                            <span>{{totalInfo.totalAmount}}</span>
                                        </FormItem>
                                    </Col>
                                    <Col span="6" offset="6">
                                        <a @click="addNew()" style="float:right">
                                            <Icon type="plus"></Icon>
                                            添加商品
                                        </a>
                                    </Col>
                                </Row>
                            </Form>
                        </col>
                    </Row>                    
                    <el-table :data="returnList" border stripe style="text-align: center">
                        <el-table-column show-overflow-tooltip prop="hh" label="行号"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jldw" label="计量单位" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="ckmc" label="所属仓库" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="所属库区"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="所属库位"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="change_num" label="可退数量" ></el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_num" label="退货数量">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.return_num" placeholder="请输入退货数量" @on-change="changeAmount(scope)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="return_amount" label="退货金额"></el-table-column>
                        <el-table-column show-overflow-tooltip label="采购合同单编号" width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.buy_order_no)">{{scope.row.buy_order_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="deleteItem(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
            </col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:30px;" :loading="loadding" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
        <div v-if="showAdd">
            <Modal v-model="showAdd" class-name="make-return modal-no-absoute" title="添加商品" width="90">
                <th-add :orderNum="orderNum" :storeNum="storeNum" isTmp="yes" @getAdd="getAddData"></th-add>
            </Modal>     
        </div>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import thAdd from './addNewReturn.vue';
    import {purchaseManageConfirmReturn, apiMapDetail, purchaseManageConfirmAdd } from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';
    export default {
        components: {
            thAdd
        },
        data () {
            return {
                showAdd: false,
                orderNum: '',
                storeNum: '',
                supplier_info: {
                    buy_order_no: this.$route.query.orderNum,
                    lxr: '',
                    gysmc: '',
                    sjhm: '',
                    lxdz: '',
                    note: '',
                    province_no: '',
                    city_no: '',
                    selectdCities: [],
                    district_no: ''
                },
                copyInfo: {},
                returnList: [],
                totalInfo: {
                    totalNum: 0,
                    totalAmount: 0
                },
                allAddressArr: [],
                ruleValidate: {
                    lxr: [
                        { required: true, message: '退货联系人不能为空', trigger: 'blur' }
                    ],
                    sjhm: [
                        { required: true, message: '退货联系方式不能为空', trigger: 'blur' }
                    ],
                    lxdz: [
                        { required: true, message: '退货联系地址不能为空', trigger: 'blur' }
                    ],
                    selectdCities: [
                        { required: true, message: '退货联系地址不能为空', trigger: 'blur', type: 'array' }
                    ]
                },
                orderNumHasChangeTo: this.$route.query.orderNum,
                orderNumHasChanged: false,
                loadding: false
            };
        },
        methods: {
            getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },
            confirmedReturnList (idArr) {
                purchaseManageConfirmReturn(this, {
                    params: JSON.stringify({
                        gh_id: idArr
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.product_info.forEach(item => {
                            item.return_num = 0;
                            item.return_amount = 0;
                        });
                        //再次调接口时判断已经存在的列表项，并去交集去重
                        if (this.returnList.length <= 0 || this.orderNumHasChanged) {
                            this.supplier_info.gysmc = res.data.supplier_info.gysmc;
                            this.supplier_info.lxr = res.data.supplier_info.lxr;
                            this.supplier_info.sjhm = res.data.supplier_info.sjhm;
                            this.supplier_info.lxdz = res.data.supplier_info.lxdz;
                            this.supplier_info.note = '';
                            this.copyInfo = JSON.parse(JSON.stringify(this.supplier_info));
                            this.storeNum = res.data.supplier_info.store_no;
                            this.orderNum = res.data.product_info[0].buy_order_no;
                            console.log(this.orderNum)
                            if (!res.data.supplier_info.csbh && !res.data.supplier_info.sfbh && !res.data.supplier_info.xqbh) {
                                this.supplier_info.selectdCities = [this.supplier_info.province_no, this.supplier_info.city_no, this.supplier_info.district_no] = []; //默认为空
                            } else {
                                this.supplier_info.selectdCities = [this.supplier_info.province_no, this.supplier_info.city_no, this.supplier_info.district_no] = [res.data.supplier_info.sfbh, res.data.supplier_info.csbh, res.data.supplier_info.xqbh];
                            }
                            this.returnList = res.data.product_info;
                        } else {
                            //数组去重
                            res.data.product_info.forEach(newItem => {
                                let existedId = newItem.id;
                                let hasRepeatId = false;
                                this.returnList.forEach(item => {
                                    if (item.id == existedId) {
                                        hasRepeatId = true;
                                        return;
                                    }
                                });
                                if (!hasRepeatId) {
                                    this.returnList.push(newItem);
                                }
                            });
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            getCurrentAddress(value, selected) {
                this.supplier_info.province_no = value[0] || '';
                this.supplier_info.city_no = value[1] || '';
                this.supplier_info.district_no = value[2] || '';
            },
            changeAmount(scope) {
                let reg = /^[1-9]\d*$/;
                let isNum = reg.test(+scope.row.return_num);
                if (!isNum || +scope.row.return_num > +scope.row.change_num) {
                    this.$Message.error('格式有误或数目大于可退!');
                }
                scope.row.return_amount = this.multiply(scope.row.return_num, scope.row.buy_price, 4);
                this.totalInfo.totalNum = 0;
                this.totalInfo.totalAmount = 0;
                this.returnList.forEach(item => {
                    this.totalInfo.totalNum +=  +item.return_num;
                    this.totalInfo.totalAmount = this.add(this.totalInfo.totalAmount, item.return_amount);
                });
                this.totalInfo.totalNum = this.totalInfo.totalNum.toFixed(0);
                this.totalInfo.totalAmount = this.totalInfo.totalAmount.toFixed(4);
            },
            backTo () {
                history.go(-1);
            },
            addNew() {
                this.showAdd = true;
            },
            getAddData(newData) {
                this.confirmedReturnList(newData);
                this.showAdd = false;
            },
            deleteItem(index) {
                this.returnList.splice(index, 1);
                this.totalInfo.totalNum = 0;
                this.totalInfo.totalAmount = 0;
                this.returnList.forEach(item => {
                    this.totalInfo.totalNum +=  +item.return_num;
                    this.totalInfo.totalAmount = this.add(this.totalInfo.totalAmount, item.return_amount);
                });
            },
            save() {
                let reg = /^[1-9]\d*$/;
                let isNum = true;
                let currentIndex = 0;
                let numTooLarge = false;
                for (let i = 0; i < this.returnList.length; i++) {
                    isNum = reg.test(+this.returnList[i].return_num);
                    if (!isNum) {
                        currentIndex = i + 1;
                        break;
                    }
                    if (+this.returnList[i].return_num > +this.returnList[i].change_num) {
                        numTooLarge = true;
                        currentIndex = i + 1;
                        break;
                    }
                }
                if (!isNum) {
                    this.$Message.error('第' + currentIndex +'行退货数量输入不正确!');
                    return;
                }
                if (numTooLarge) {
                    this.$Message.error('第' + currentIndex +'行退货数量不能大于可退数量!');
                    return;
                }
                this.$refs['supplier_info'].validate((valid) => {
                    if (valid) {
                        let listSend = [];
                        this.returnList.forEach(item => {
                            listSend.push({
                                gh_id: item.id,
                                number: item.return_num
                            });
                        });
                        this.loadding = true;
                        purchaseManageConfirmAdd(this, {
                            params: JSON.stringify({
                                buy_order_no: this.supplier_info.buy_order_no,
                                receive_name: this.supplier_info.lxr,
                                receive_phone: this.supplier_info.sjhm,
                                province_no: this.supplier_info.province_no,
                                city_no: this.supplier_info.city_no,
                                district_no: this.supplier_info.district_no,
                                receive_address: this.supplier_info.lxdz,
                                note: this.supplier_info.note,
                            }),
                            return_info: JSON.stringify({
                                list: listSend
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功!');
                                this.loadding = false;
                                closeCurrentPage(this);                               
                                util.openNewPage(this, 'purchase_manage_TH_detail', {
                                    param: res.data.order_return_no,
                                    fromAdd: '1'
                                });
                                this.$router.push({
                                    name: 'purchase_manage_TH_detail',
                                    query:  {
                                        param: res.data.order_return_no,
                                        fromAdd: '1'
                                    }
                                }); 
                            } else {
                                this.loadding = false;
                                this.$Message.error(res.message);
                            }
                        })
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                });                

            }
        },
        created () {
            this.getMapDetail();
            this.orderNumHasChangeTo = this.$route.query.orderNum;
            this.confirmedReturnList(JSON.parse(this.$route.query.selectedId));
        },
        watch: {
            'orderNumHasChangeTo' (value) {
                this.orderNumHasChanged = true;
                this.confirmedReturnList(JSON.parse(this.$route.query.selectedId));
            }
        }
    };
</script>