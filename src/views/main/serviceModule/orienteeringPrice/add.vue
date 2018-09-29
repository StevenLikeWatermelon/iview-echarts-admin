<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form ref="formDetail" :model="formDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="12">
                            <FormItem label="客户名称：" prop="customer_no">
                                <Select v-model="formDetail.customer_no"  placeholder="请选择客户名称" filterable>
                                    <Option v-for="status in allCustomerArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="生效时间：" prop="validateDateRange">
                                <DatePicker type="datetimerange" placeholder="选择生效时间" :value='formDetail.validateDateRange' @on-change="getActiveTime" style="width: 50%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="备注：" prop="note">
                                <Input type="textarea" v-model="formDetail.note" style="width:100%;"></Input>
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
                    定向价格商品明细
                </p>
                <div slot="extra">
                    <span class="span-for-click" @click="fuzzySearch('allProducts')">添加商品</span>
                </div>
                <div>
                    <el-table :data="addDataList" border stripe style="text-align: center"  @sort-change="manualSort" max-height="570">
                        <el-table-column show-overflow-tooltip label="行号" type="index"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品型号编号" prop="product_model_no"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="品牌" prop="cpppmc"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品名称" prop="cpmc"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品型号" prop="cpxh"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品订货号" prop="cpdhh"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="计量单位" prop="jldw"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="产品面价" prop="cpxhmj"  sortable="custom"></el-table-column>
                        <el-table-column show-overflow-tooltip label="定向折扣" prop="direct_discount"  sortable="custom">
                            <template slot-scope="scope">
                                 <Input v-model="scope.row.direct_discount" placeholder="请输入定向折扣"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作" prop="order_no">
                            <template slot-scope="scope">
                                 <span class="pointer-hover" @click="deleteItem(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>

                    <Row class="margin-top-10">
                        <Col span="8" class="margin-top-10">
                            <Input type="textarea" v-model="bulktext" class="bulktext" :placeholder="textPlaceholder"></Input>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                            <Button type="primary" style="margin-top:88px;" @click="bulkAdd">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                            <el-table :data="notFoundData" border stripe style="text-align: center">
                                <el-table-column show-overflow-tooltip label="订货号/产品型号" prop="product_order_no"></el-table-column>
                                <el-table-column show-overflow-tooltip label="失败原因" prop="message"></el-table-column>
                                <el-table-column show-overflow-tooltip label="模糊查询">
                                    <template slot-scope="scope" v-if="scope.row.type">
                                        <span class="span-for-click" @click="fuzzySearch(scope.row.product_order_no)">模糊查询</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <el-popover trigger="click" placement="top" v-if="scope.row.data && scope.row.data.length > 0">
                                            <p v-for="val in scope.row.data">
                                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="addToDatalist(val)">{{val.cpppmc}}, {{val.cpdhh}}</span>
                                            </p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium" style="color: rgb(45, 140, 240);">选择</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Col>
                    </Row>
                </div>
            </Card>
            </Col>
        </Row>
        <orienteer-fuzzy :showFuzzy.sync="showFuzzy" :currentOrderId="currentOrderId" @addNewData="addNewFuzzyData"></orienteer-fuzzy>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" style="margin-left:20px;" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { orienteeringPriceAddApi, apiCustomerInfoList, orienteeringPriceQueryApi } from '@/config/getData';
    import { sortBy, closeCurrentPage } from '@/config/mUtils';
    import orienteerFuzzy from './orienteerFuzzy.vue';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                showFuzzy: false,
                currentOrderId: '',

                formDetail: {
                    customer_no: '',
                    validateDateRange: [],
                    note: ''
                },
                allCustomerArr: [],
                addDataList: [],
                ruleValidate: {
                    customer_no: [
                        { required: true, message: '客户编号不能为空', trigger: 'blur' }
                    ],
                    validateDateRange: [
                        { required: true, message: '生效时间不能为空', trigger: 'blur', type: 'array' }
                    ]
                },
                textPlaceholder: `批量添加订货号和定向折扣/产品型号和定向折扣，用空格隔开（支持从Excel复制）
示例
RXZE1M2C 0.125
ZB2BZ101C 0.145
RXM2LB2BD 0.456`,
                notFoundData: [],
                bulktext: '',
            };
        },
        components: {
            orienteerFuzzy
        },
        methods: {
            fuzzySearch(id) {
                this.currentOrderId = id;
                this.showFuzzy = true;
            },
            addNewFuzzyData(fuzzyData) {
                fuzzyData.forEach(item => {
                    let hasExisted = false;
                    for (let i = 0; i < this.addDataList.length; i++) {
                        if (item.product_model_no == this.addDataList[i].product_model_no) {
                            hasExisted = true;
                            break;
                        }
                    }
                    if (!hasExisted) {
                        this.addDataList.push(item);
                    }

                });
                this.showFuzzy = false;
            },
            getActiveTime (time) {
                this.formDetail.validateDateRange = time;
            },
            getAllcustomer() {
                apiCustomerInfoList(this, {
                    params: JSON.stringify({
                        all: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allCustomerArr.push({
                                value: item.khbh,
                                label: item.kh
                            });
                        });
                    }
                });
            },
            deleteItem(index) {
                this.addDataList.splice(index, 1);
            },
            save() {
                this.$refs['formDetail'].validate((valid) =>{
                    if (valid) {
                        let maxThree =  /^-?\d+(\.\d{1,3})?$/;
                        for (let i = 0; i < this.addDataList.length; i++) {
                            if (this.addDataList[i].direct_discount == '') {
                                this.$Message.error(`第${i + 1}行定向折扣不能为空!`);
                                return;
                            }
                            if (+this.addDataList[i].direct_discount <= 0) {
                                this.$Message.error(`第${i + 1}行定向折扣不能小于0!`);
                                return;
                            }
                            if (+this.addDataList[i].direct_discount > 1) {
                                this.$Message.error(`第${i + 1}行定向折扣不能大于1!`);
                                return;
                            }
                            if (!maxThree.test(this.addDataList[i].direct_discount)) {
                                this.$Message.error(`第${i + 1}行定向折扣小数点后位数不能超过3位!`);
                                return;
                            }
                        }
                        orienteeringPriceAddApi(this, {
                            params: JSON.stringify({
                                customer_no: this.formDetail.customer_no,
                                validite_time_start: this.formDetail.validateDateRange[0],
                                validite_time_end: this.formDetail.validateDateRange[1],
                                note: this.formDetail.note,
                                detail: this.addDataList
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('新增成功');
                                closeCurrentPage(this);
                                util.openNewPage(this, 'orienteering-price-detail',{
                                    param: res.data.direct_order_no,
                                    fromAdd: 1
                                });
                                this.$router.push({
                                    name: 'orienteering-price-detail',
                                    query: {
                                        param: res.data.direct_order_no,
                                        fromAdd: 1
                                    }
                                });                          
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                    }   
                })
            },
            /*批量添加*/
            bulkAdd () {
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                let goodsVaildArr = [];
                let arrToPost = [];
                for (let i in arrStr) {
                    arrList.push(arrStr[i].trim().replace(/\s+/g, ' ').split(' '));
                    //如果商品编号数量没填，则默认为1
                    if (arrList[i].length === 1) {
                        arrList[i][1] = 1;
                    }
                    if (arrList[i][0] !== '') {
                        goodsVaildArr.push(arrList[i]);
                    }
                }
                goodsVaildArr.forEach(item => {
                    arrToPost.push({
                        product_order_no: item[0],
                        direct_discount: item[1]
                    });
                });

                orienteeringPriceQueryApi(this, {
                    params: JSON.stringify(arrToPost)
                }).then(res => {
                    if (res && res.status == 1) {
                        if (res.data.successData && res.data.successData.length > 0) {
                            res.data.successData.forEach(item => {
                                let hasExisted = false;
                                for (let i = 0; i < this.addDataList.length; i++) {
                                    if (item.product_model_no == this.addDataList[i].product_model_no) {
                                        hasExisted = true;
                                        break;
                                    }
                                }
                                if (!hasExisted) {
                                    this.addDataList.push(item);
                                }

                            });
                        }
                        if (res.data.failData && res.data.failData.length > 0) {
                            this.notFoundData = res.data.failData;
                        } else {
                            this.notFoundData = [];
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            addToDatalist(row) {
                let hasExisted = false;
                for (let i = 0; i < this.addDataList.length; i++) {
                    if (this.addDataList[i].product_model_no == row.product_model_no) {
                        hasExisted = true;
                        break;
                    }
                }
                if (!hasExisted) {
                    this.addDataList.push(row);
                }
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.addDataList.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getAllcustomer();
        }
    };
</script>
