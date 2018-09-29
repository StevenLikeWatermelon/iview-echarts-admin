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
                <Form :label-width="120" :model="form" ref="form" :rules="formRules">
                    <Row>
                        <Col span="24">
                        <FormItem label="备货仓库：" style="margin:0;" prop="stock">
                            <Select v-model="form.stock"  placeholder="请选择备货仓库" @on-change="storeChange(form.stock)" style="width:250px;" filterable>
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="form.note" style="width:400px;"></Input>
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
                <div>
                    <div class="margin-bottom-10">
                        <span>备货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">备货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney| toFiexedFour }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="product_origin_price" label="产品面价" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <span>{{ (+scope.row.product_origin_price).toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product_discount" label="备货折扣" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.product_discount" @on-change="scope.row.requisition_price = (scope.row.product_discount * scope.row.product_origin_price ).toFixed(4);getCount();" @on-blur="zkChange(scope.row.product_discount, scope.$index)" ></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_price" label="备货单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.requisition_price" @on-change="scope.row.product_discount=(scope.row.requisition_price/scope.row.product_origin_price).toFixed(3);getCount();" @on-blur="djChange(scope.row.requisition_price, scope.$index)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_num" label="备货数量" sortable="custom" min-width="100">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.requisition_num" @on-change="getCount();" @on-blur="numChange(scope.row.requisition_num, scope.$index)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_amount" label="备货金额" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.requisition_price * scope.row.requisition_num | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_leadtime" label="备货货期(天)" width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.requisition_leadtime"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.note"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  v-if="!edit_goods">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteRow(scope.$index, actTable.data)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <Row class="margin-top-10">
                        <Col span="8" class="margin-top-10">
                        <Input type="textarea" v-model="bulktext" class="bulktext" @on-blur="isShow" @on-focus="isHidden" id="placeholderAction"></Input>
                        <div style="position: absolute;left:10px;top:10px;z-index: 0;" v-if="is_show" @click="isHidden">
                            <div style="color:#999;">批量添加订货号和备货数量/产品型号和备货数量，用空格隔开（支持从Excel复制）</div>
                            <div style="color:#999;">示例：</div>
                            <div style="color:#999;">101275386&nbsp;&nbsp;12</div>
                            <div style="color:#999;">101065317&nbsp;&nbsp;12</div>
                        </div>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                        <Button type="primary" style="margin-top:88px;" @click="bulkAdd">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                        <el-table :data="notFoundData" border stripe style="text-align: center">
                            <el-table-column label="订货号/产品型号" prop="order_no"></el-table-column>
                            <el-table-column label="模糊查询">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer" @click="getDetail(scope.row.order_no)">查看</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="失败原因" prop="reason"></el-table-column>
                            <el-table-column label="操作" prop="operate">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.operate.length == 0"></div>
                                    <el-popover trigger="click" placement="top" v-else>
                                        <p v-for="val in scope.row.operate">
                                            <span class="pointer-hover" @click="goodsChoose(val.brand_name, val.brand_no, val.product_model, val.product_model_no, val.product_name, val.product_no, val.product_order_no, val.product_origin_price, val.product_series, val.product_unit, val.requisition_num)">{{val.brand_name}}, {{val.product_order_no}}</span>
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
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>




        <Modal v-model="showProduct" @on-cancel="cancel" title="模糊查询" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                        <Form :label-width="100">
                            <Col span="6">
                            <FormItem label="订货号：">
                                <Input v-model="productOrderNo"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem label="产品型号：">
                                <Input v-model="productModel"></Input>
                            </FormItem>
                            </Col>
                            <Col span="6">
                            <FormItem>
                                <Button type="primary"  @click="search">搜索</Button>
                                <Button type="default" @click="reset">重置</Button>
                            </FormItem>
                            </Col>
                        </Form>
                    </Row>
                    <el-table :data="productList" border style="text-align: center">
                        <el-table-column prop="brand_name" label="品牌"></el-table-column>
                        <el-table-column label="产品名称" prop="product_name"></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" ></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" ></el-table-column>
                        <el-table-column prop="product_origin_price" label="产品面价"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="AddProduct(scope.row)">添加</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                </Card>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>




    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiGetCommonStockList, apiGetPurchaseBackupSearch, apiGetPurchaseBackupAdd,apiVagueSearch } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_BH_add',
        data () {
            return {
                form: {
                    stock: '',
                    note: ''
                },
                bhd_id: this.$route.query.param,
                actTable: {
                    data: []
                },
                orderField: 'id',
                orderDirection: 'desc',
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                qyrzStatus: '',
                productOrderNo:'',
                productModel:'',
                qyrzStatusArr: [],
                goodsAll: 0,
                goodsAllMoney: 0,
                bulktext: '',
                stockArr: [],
                formRules: {
                    stock: [
                        { required: true, message: '请选择备货仓库', trigger: 'on-change' }
                    ]
                },
                storeList: [],
                back_store_name: '',
                is_show: true,
                notFoundData: [],
                searchData: [],
                loadding: false,
                showProduct:false,
                productList:[],
                cpdhh:'',
            };
        },
        components: {
            pagination
        },
        methods: {
            getStatus () {
                apiGetCommonStockList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.storeList = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ckbh;
                            item.label = item.ckmc;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            storeChange (val) {
                for (let i in this.storeList) {
                    if (this.storeList[i].ckbh === val) {
                        this.back_store_name = this.storeList[i].ckmc;
                    }
                }
            },
            search(){
                this.currentPage = 1;
                this.getDetail(this.cpdhh);
            },
            reset() {
                this.productOrderNo = '';
                this.productModel = '';
                this.search();
            },
            confirmTranslate(){
                this.productOrderNo = '';
                this.productModel = '';
                this.showProduct = false;
            },
            cancel(){
                this.productOrderNo = '';
                this.productModel = '';
            },
            getDetail(val){
                apiVagueSearch(this,{
                    dhh:val,
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        cpdhh:this.productOrderNo,
                        cpxh:this.productModel,
                    }))
                }).then(res => {

                    if(res && res.status == 1){
                        this.productList = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.showProduct = true;
                        this.cpdhh = val;
                    }
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getDetail(this.cpdhh);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            AddProduct(val){
                val.product_discount = 1.000;
                val.requisition_price = val.product_origin_price;
                val.requisition_amount = val.requisition_price * val.requisition_num;
                val.requisition_leadtime = 1;
                for (let i = 0; i < this.actTable.data.length; i++) {
                    if (val.product_order_no === this.actTable.data[i].product_order_no && val.brand_name === this.actTable.data[i].brand_name) {
                        val.requisition_num = this.add(this.actTable.data[i].requisition_num, val.requisition_num);
                        val.product_discount = this.actTable.data[i].product_discount;
                        val.requisition_price = this.actTable.data[i].requisition_price;
                        val.requisition_leadtime = this.actTable.data[i].requisition_leadtime;
                        val.note = this.actTable.data[i].note;
                        this.actTable.data.splice(i, 1);
                    }
                }
                this.actTable.data.push(val);
                this.getCount();
            },
            getData () {
                //基本信息
            },
            goodsChoose (ppmc,ppbh, cpxh, xhbh, cpmc, cpbh, dhh, mj, ser, unit, num) {
                for (let i = 0; i < this.actTable.data.length; i++) {
                    if (dhh === this.actTable.data[i].product_order_no && ppbh === this.actTable.data[i].brand_no) {
                        this.actTable.data[i].requisition_num = this.add(this.actTable.data[i].requisition_num, num);
                        return;
                    }
                }
                this.actTable.data.push({
                    brand_name: ppmc,
                    brand_no: ppbh,
                    product_name: cpmc,
                    product_no: cpbh,
                    product_model: cpxh,
                    product_model_no: xhbh,
                    product_order_no: dhh,
                    product_unit: unit,
                    product_origin_price: mj,
                    product_discount: 1.000,
                    requisition_price: mj,
                    requisition_num: num,
                    requisition_leadtime: 1,
                    note: ''
                });
            },
            isHidden () {
                this.is_show = false;
                document.getElementById('placeholderAction').firstChild.focus();

            },
            isShow () {
                if (this.bulktext === '') {
                    this.is_show = true;
                } else {
                    this.is_show = false;
                }
            },
            /*批量添加*/
            bulkAdd () {
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                let goodsVaildArr = [];
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

                goodsVaildArr = goodsVaildArr.map(item => {
                    return item.join(' ');
                });
//                goodsVaildArr = goodsVaildArr.join(',');
//                console.log(goodsVaildArr);

                apiGetPurchaseBackupSearch(this, {
                    search_products: JSON.stringify(goodsVaildArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.found.forEach(item => {
                            item.product_discount = 1.000;
                            item.requisition_price = item.product_origin_price;
                            item.requisition_amount = item.requisition_price * item.requisition_num;
                            item.requisition_leadtime = 1;
                            for (let i = 0; i < this.actTable.data.length; i++) {
                                if (item.product_order_no === this.actTable.data[i].product_order_no && item.brand_name === this.actTable.data[i].brand_name) {
                                    item.requisition_num = this.add(this.actTable.data[i].requisition_num, item.requisition_num);
                                    item.product_discount = this.actTable.data[i].product_discount;
                                    item.requisition_price = this.actTable.data[i].requisition_price;
                                    item.requisition_leadtime = this.actTable.data[i].requisition_leadtime;
                                    item.note = this.actTable.data[i].note;
                                    this.actTable.data.splice(i, 1);
                                }
                            }
                            this.actTable.data.push(item);
                        });
                        this.getCount();
                        this.bulktext = '';
                        this.is_show = true;
                        this.notFoundData = [];
                        if(res.data.not_found.length != 0){
                            for (let i in res.data.not_found) {
                                this.notFoundData.push({order_no: res.data.not_found[i], reason: '订货号/产品型号不存在', operate: ''});
                            }
                        }
                        if(res.data.more_item.length != 0){
                            for (let i in res.data.more_item) {
                                this.notFoundData.push({order_no: i, reason: '存在多条', operate: res.data.more_item[i]});
                            }
                        }
                        if (res.data.not_own_item.length != 0) {
                            for (let i in res.data.not_own_item) {
                                this.notFoundData.push({order_no: res.data.not_own_item[i], reason: '不在您的备货范围内', operate: ''});
                            }
                        }
                        if (res.data.not_has_user.length != 0) {
                            for (let i in res.data.not_has_user) {
                                this.notFoundData.push({order_no: res.data.not_has_user[i], reason: '未配置采购策略', operate: ''});
                            }
                        }
                    }
                });
            },
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].requisition_num || this.actTable.data[i].requisition_num === ' ') {
                        this.actTable.data[i].requisition_num = 0;
                    }
                    if (!this.actTable.data[i].requisition_price || this.actTable.data[i].requisition_price === ' ') {
                        this.actTable.data[i].requisition_price = 0.00;
                    }
                    allNum = this.add(allNum, this.actTable.data[i].requisition_num);
//                    allAmount = allAmount + this.actTable.data[i].requisition_price * this.actTable.data[i].requisition_num ;
                      allAmount = this.add(allAmount, this.multiply(this.actTable.data[i].requisition_price, this.actTable.data[i].requisition_num), 4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
            },
            save () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let goodsNewArr = [];
                        var reg3 = /^\d+\.?(\d{1,3})?$/;
                        var reg4 = /^\d+\.?(\d{1,4})?$/;
                        for (let i in this.actTable.data) {
                            let n = parseInt(i) + parseInt(1);
                            if (!this.actTable.data[i].product_discount || this.actTable.data[i].product_discount === '') {
                                this.$Message.error('第' + n + '行的备货折扣不能为空');
                                return false;
                            } else if (!reg3.test(this.actTable.data[i].product_discount)) {
                                this.$Message.error('第' + n + '行的备货折扣最多保留到小数后三位');
                                return false;
                            } else if (parseInt(this.actTable.data[i].product_discount * 1000) > 10000) {
                                this.$Message.error('第' + n + '行的备货折扣不能大于10');
                                return false;
                            } else if (!this.actTable.data[i].requisition_price || this.actTable.data[i].requisition_price === '') {
                                this.$Message.error('第' + n + '行的备货单价不能为空');
                                return false;
                            } else if (!reg4.test(this.actTable.data[i].requisition_price)) {
                                this.$Message.error('第' + n + '行的备货单价最多保留到小数后四位');
                                return false;
                            } else if (!this.actTable.data[i].requisition_num || this.actTable.data[i].requisition_num === '') {
                                this.$Message.error('第' + n + '行的备货数量不能为空');
                                return false;
                            } else if (!/^\d+$/.test(this.actTable.data[i].requisition_num)) {
                                this.$Message.error('第' + n + '行的备货数量必须是大于等于0的整数');
                                return false;
                            } else if (!this.actTable.data[i].requisition_leadtime || this.actTable.data[i].requisition_leadtime === '') {
                                this.$Message.error('第' + n + '行的备货货期不能为空');
                                return false;
                            } else {
                                goodsNewArr.push(this.actTable.data[i]);
                            }
                        }
                        if (goodsNewArr.length != 0) {
                            this.loadding = true;
                            apiGetPurchaseBackupAdd(this, {
                                params: JSON.stringify({
                                    requisition_store_no: this.form.stock,
                                    requisition_store_name: this.back_store_name,
                                    note: this.form.note,
                                    detail: goodsNewArr
                                })
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
//                                    res.data
                                    closeCurrentPage(this);
                                    util.openNewPage(this, 'purchase_manage_BH_detail', {param: res.data, fromAdd: '1'});
                                    this.$router.push({
                                        name: 'purchase_manage_BH_detail',
                                        query: {param: res.data, fromAdd: '1'}
                                    });
                                    this.loadding = false;
                                    this.$Message.success('添加成功');
                                } else {
                                    this.loadding = false;
                                    this.$Message.error(res.message);
                                }
                            });
                        } else {
                            this.$Message.error('请添加备货商品');
                        }
                    }
                });
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            zkChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg3 = /^\d+\.?(\d{1,3})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的备货折扣不能为空');
                } else if (parseInt(val * 1000) > 10000) {
                    this.$Message.error('第' + n + '行的备货折扣不能大于10');
                } else if (!reg3.test(val)) {
                    this.$Message.error('第' + n + '行的备货折扣最多保留到小数后三位');
                }
            },
            djChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg4 = /^\d+\.?(\d{1,4})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的备货单价不能为空');
                } else if (!reg4.test(val)) {
                    this.$Message.error('第' + n + '行的备货单价最多保留到小数后四位');
                }
            },
            numChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的备货数量必须是大于等于0的整数');
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(4);
            }
        }
    };
</script>
