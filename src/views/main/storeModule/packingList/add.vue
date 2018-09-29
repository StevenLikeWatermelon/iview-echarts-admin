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
                        <FormItem label="盘盈仓库：" style="margin:0;" prop="stock">
                            <Select v-model="form.stock"  placeholder="请选择" @on-change="storeChange" style="width:250px;" filterable>
                                <Option v-for="status in stockArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;" prop="note">
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
                    盘盈入库商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>盘盈商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll}}</em></span>
                        <span class="margin-left-20">盘盈商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位" width="100"></el-table-column>
                        <el-table-column prop="inventory_num" label="盘盈数量" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.inventory_num" @on-blur="numChange(scope.row.inventory_num, scope.$index);" @on-change="getCount();"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inventory_price" label="盘盈单价" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.inventory_price" @on-change="getCount();"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_amount" label="盘盈金额" sortable="custom" width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.inventory_price * scope.row.inventory_num | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requisition_leadtime" label="盘盈库区" width="120" show-overflow-tooltip>
                             <template slot-scope="scope">
                                <Select v-model="scope.row.area_no" placeholder="请选择" filterable  @on-change="areaChange(scope.row.area_no, scope.$index)" transfer>
                                    <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="seat_no" label="盘盈库位" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <Select v-model="scope.row.seat_no" placeholder="请选择" filterable :disabled="scope.row.isChoose" transfer>
                                    <Option v-for="status in scope.row.seatArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <Input v-model="scope.row.note"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteRow(scope.$index, actTable.data)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <Row class="margin-top-10">
                        <Col span="8" class="margin-top-10">
                        <Input type="textarea" v-model="bulktext" class="bulktext" @on-blur="isShow" @on-focus="isHidden" id="placeholderAction"></Input>
                        <div style="position: absolute;left:10px;top:10px;z-index: 0;" v-if="is_show" @click="isHidden">
                            <div style="color:#999;">批量添加订货号和数量，用空格隔开（支持从Excel复制）</div>
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
                            <el-table-column label="订货号" prop="order_no"></el-table-column>
                            <el-table-column label="失败原因" prop="reason"></el-table-column>
                            <el-table-column label="操作" prop="operate">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.operate.length == 0"></div>
                                    <el-popover trigger="click" placement="top" v-else>
                                        <p v-for="val in scope.row.operate">
                                            <span class="pointer-hover" @click="goodsChoose(val.brand_name, val.product_model, val.requisition_num, val.product_origin_price, val.product_name, val.product_order_no)">{{val.brand_name}}, {{val.product_order_no}}</span>
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
                <Button type="success" :loading="loading" class="margin-top-10" style="margin:auto;margin-left:20px;" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiGetAllStorageList, apiGetAllSeatList, apiGetAllAreaList, apiGetStockInventoryProfitBeforeAdd, apiGetStockInventoryProfitAdd } from '@/config/getData';
    import { notempty, sortBy, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                form: {
                    stock: '',
                    note: ''
                },
                loading: false,
                bhd_id: this.$route.query.param,
                actTable: {
                    data: []
                },
                orderField: 'djrq',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: 0,
                goodsAllMoney: 0,
                bulktext: '',
                stockArr: [],
                AreaArr: [],
                seatArr: [],
                formRules: {
                    stock: [
                        { required: true, message: '请选择盘盈仓库', trigger: 'on-change' }
                    ],
                    note: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ]
                },
                storeList: [],
                back_store_name: '',
                is_show: true,
                notFoundData: [],
                searchData: []
            };
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
            },
            storeChange (val) {
                apiGetAllAreaList(this, {
                    store_no: this.form.stock,
                    type: 1
                }).then(res => {
                    if (res && res.status == 1) {
                         //成功
                         this.AreaArr = [];
                         res.data.forEach(item => {
                             item.label = item.area_name;
                             item.value = item.area_no;
                             this.AreaArr.push(item);
                         });
                     }
                });          
            },
            areaChange (val, index) {
                this.actTable.data[index].isChoose = false;
                apiGetAllSeatList(this, {
                    store_no: this.form.stock,
                    area_no: val,
                    type: 1
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.actTable.data[index].seatArr = [];
                        res.data.forEach(item => {
                            item.label = item.seat_name;
                            item.value = item.seat_no;
                            this.actTable.data[index].seatArr.push(item);
                        });
                        this.actTable.data[index].seat_no = '';
                    }
                });
            },
            getData () {
                //基本信息
                apiGetAllStorageList(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.label = item.store_name;
                            item.value = item.store_no;
                            this.stockArr.push(item);
                        });
                    }
                });
            },
            goodsChoose (ppmc, cpxh, pysl, pyjg, cpmc, dhh) {
                for (let i = 0; i < this.actTable.data.length; i++) {
                    if (dhh === this.actTable.data[i].product_order_no && ppmc === this.actTable.data[i].brand_name) {
                        this.actTable.data[i].inventory_num = parseInt(this.actTable.data[i].inventory_num) + parseInt(pysl);
                        this.actTable.data[i].inventory_amount = this.actTable.data[i].inventory_num * this.actTable.data[i].inventory_price;
                        this.getCount();
                        return;
                    }
                }
                let moneyCal = pysl * inventory_price;
                this.actTable.data.push({
                    area_no: '',
                    brand_name: ppmc,
                    inventory_num: pysl,
                    inventory_price: '',
                    note: '',
                    product_model: cpxh,
                    product_name: cpmc,
                    product_order_no: dhh,
                    seat_no: '',
                    inventory_amount: moneyCal,
                    isChoose: true,
                    seatArr: []
                });
                this.getCount();
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

                 apiGetStockInventoryProfitBeforeAdd(this, {
                    search_products: JSON.stringify(goodsVaildArr)
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.found.forEach(item => {
                            item.inventory_num = item.requisition_num;
                            item.inventory_price = 0;
                            item.area_no = '';
                            item.seat_no = '';
                            item.note = '';
                            item.seatArr = [];
                            item.inventory_amount = item.inventory_price * item.inventory_num;
                            for (let i = 0; i < this.actTable.data.length; i++) {
                                if (item.product_order_no === this.actTable.data[i].product_order_no && item.brand_name === this.actTable.data[i].brand_name) {
                                    item.inventory_num = parseInt(this.actTable.data[i].inventory_num) + parseInt(item.requisition_num);
                                    item.inventory_price = this.actTable.data[i].inventory_price;
                                    item.inventory_amount = item.inventory_price * item.inventory_num;
                                    item.area_no = this.actTable.data[i].area_no;
                                    item.seat_no = this.actTable.data[i].seat_no;
                                    item.note = this.actTable.data[i].note;
                                    this.actTable.data.splice(i, 1);
                                }
                            }
                            if (item.area_no === '' || !item.area_no) {
                                item.isChoose = true;
                            } else {
                                item.isChoose = false;
                                apiGetAllSeatList(this, {
                                       store_no: this.store_no,
                                       area_no: item.area_no,
                                       type: 1
                                }).then(result => {
                                        if (result && result.status == 1) {
                                            //成功
                                            result.data.forEach(rel => {
                                                rel.label = rel.seat_name;
                                                rel.value = rel.seat_no;
                                                item.seatArr.push(rel);
                                            });
                                         }
                                });     
                            }
                            this.actTable.data.push(item);
                        });
                        this.getCount();
                        this.bulktext = '';
                        this.is_show = true;
                        this.notFoundData = [];
                        if(res.data.not_found.length != 0){
                            for (let i in res.data.not_found) {
                                this.notFoundData.push({order_no: res.data.not_found[i], reason: '订货号不存在', operate: ''});
                            }
                        }
                        if(res.data.more_item.length != 0){
                            for (let i in res.data.more_item) {
                                this.notFoundData.push({order_no: i, reason: '存在多条', operate: res.data.more_item[i]});
                            }
                        }
                        // if (res.data.not_own_item.length != 0) {
                        //     for (let i in res.data.not_own_item) {
                        //         this.notFoundData.push({order_no: res.data.not_own_item[i], reason: '不在您的备货范围内', operate: ''});
                        //     }
                        // }
                        // if (res.data.not_has_user.length != 0) {
                        //     for (let i in res.data.not_has_user) {
                        //         this.notFoundData.push({order_no: res.data.not_has_user[i], reason: '未配置采购策略', operate: ''});
                        //     }
                        // }
                    }
                });
            },
            getCount () {
                let allNum = 0;
                let allAmount = parseFloat(0).toFixed(4);
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === ' ') {
                        this.actTable.data[i].inventory_num = 0;
                    }
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].inventory_num);
                    allAmount = (+allAmount  + this.actTable.data[i].inventory_price * this.actTable.data[i].inventory_num).toFixed(4);
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
                            if (!this.actTable.data[i].inventory_num || this.actTable.data[i].inventory_num === '') {
                                this.$Message.error('第' + n + '行的盘盈数量不能为空');
                                return false;
                            } else if (!/^\d+$/.test(this.actTable.data[i].inventory_num)) {
                                this.$Message.error('第' + n + '行的盘盈数量必须是大于等于0的整数');
                                return false;
                            } else if (this.actTable.data[i].inventory_price === '') {
                                this.$Message.error('第' + n + '行的盘盈单价不能为空');
                                return false;
                            } else if (!reg4.test(this.actTable.data[i].inventory_price)) {
                                this.$Message.error('第' + n + '行的盘盈单价最多保留到小数后四位');
                                 return false;
                            } else if (!this.actTable.data[i].area_no || this.actTable.data[i].area_no === '') {
                                this.$Message.error('第' + n + '行的盘盈库区不能为空');
                                return false;
                            } else if (!this.actTable.data[i].seat_no || this.actTable.data[i].seat_no === '') {
                                this.$Message.error('第' + n + '行的盘盈库位不能为空');
                                return false;
                            } else {
                                goodsNewArr.push({
                                    // id: this.actTable.data[i].id,
                                    seat_no: this.actTable.data[i].seat_no,
                                    inventory_num: this.actTable.data[i].inventory_num,
                                    inventory_price: this.actTable.data[i].inventory_price,
                                    area_no: this.actTable.data[i].area_no,
                                    product_order_no: this.actTable.data[i].product_order_no,
                                    note: this.actTable.data[i].note,
                                });
                            }
                        }
                        if (goodsNewArr.length != 0) {
                            this.loading = true;
                            apiGetStockInventoryProfitAdd(this, {
                                params: JSON.stringify({
                                    store_no: this.form.stock,
                                    note: this.form.note
                                }),
                                list: JSON.stringify(goodsNewArr)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    //成功
                                    closeCurrentPage(this);
                                    this.handleClick({param: res.data.inventory_no, fromAdd: 'add'}, 'packing-list-detail');
                                    this.$Message.success('添加成功');
                                } else {
                                    this.$Message.error(res.message[0]);
                                }
                                this.loading = false;
                            });
                        } else {
                            this.$Message.error('请添加盘盈入库商品');
                        }
                    }
                });
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
            },
            priceChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                var reg4 = /^\d+\.?(\d{1,4})?$/;
                if (!val || val === '') {
                    this.$Message.error('第' + n + '行的盘盈单价不能为空');
                } else if (!reg4.test(val)) {
                    this.$Message.error('第' + n + '行的盘盈单价最多保留到小数后四位');
                }
            },
            numChange (val, index) {
                let n = parseInt(index) + parseInt(1);
                if (!/^\d+$/.test(val)) {
                    this.$Message.error('第' + n + '行的盘盈数量必须是大于等于0的整数');
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
