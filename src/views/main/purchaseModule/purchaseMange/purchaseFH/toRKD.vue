<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="6">
                        <FormItem label="入库仓库：" style="margin:0;">
                            {{form.ckmc}}
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="仓库地址：" style="margin:0;">
                            {{ form.dzsfmc + form.dzcsmc + form.dzxqmc + form.ckdz }}
                        </FormItem>
                        </Col>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="备注：" style="margin:0;">
                            <Input type="textarea" v-model="form.note" style="width:550px;"  placeholder="请输入备注说明"></Input>
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
                    入库商品明细
                    <span style="font-weight:normal;float:right;">
                        <Button type="primary" @click="addGoods">添加商品</Button>
                    </span>
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>入库商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">入库商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center"  @sort-change="manualSort">
                        <el-table-column show-overflow-tooltip type="index" label="行号" fixed></el-table-column>
                        <el-table-column show-overflow-tooltip prop="brand_name" label="品牌" fixed width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" sortable="custom" fixed width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" sortable="custom" fixed width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" sortable="custom" fixed width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" sortable="custom" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" sortable="custom" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="num" label="发货数量" sortable="custom" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="instock_num" label="已入库数量" sortable="custom" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="can_num" label="待入库数量" sortable="custom" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip label="本次入库数量"  width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.now_num" @on-change="verify(scope)"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="stock_num" label="入库金额" sortable="custom"  width="100">
                            <template slot-scope="scope">
                                <span>{{ scope.row.now_num * scope.row.buy_price | toDecimal }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="area_name" label="入库库区" width="150">
                            <template slot-scope="scope">
                                <Select v-model="scope.row.area_no" placeholder="请选择" @on-change="areaChange(scope.row.area_no, scope.$index)" transfer filterable>
                                    <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="seat_name" label="入库库位" width="150">
                            <template slot-scope="scope" v-if="toggleSelect">
                                <Select v-model="scope.row.seat_no" placeholder="请选择" :disabled="scope.row.isChoose" transfer filterable>
                                    <Option v-for="status in scope.row.seat_list" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                </Select>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="采购合同单编号"  width="150">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="采购发货单编号"  width="150">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.rel_order_no}, 'purchase_manage_FH_detail')" type="text" size="small">
                                    {{ scope.row.rel_order_no }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleted(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>
        <!--添加商品弹框-->
        <Modal v-model='goodsModal' :mask-closable='false' class="orderForm-approvePass" :width="90" id="buy_toHT">
            <h3 slot="header">添加商品</h3>
            <div>
                <Row>
                    <Col span="24">
                    <Card>
                        <Form :model="formSearch" :label-width="120" class="model-style">
                            <Row>
                                <Col span="4">
                                    <Select v-model="formSearch.brand"  placeholder="请选择品牌" @on-change="search" filterable>
                                        <Option value="all">请选择品牌</Option>
                                        <Option v-for="status in brand_list" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.product_name" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.order_no" placeholder="请输入采购合同单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="formSearch.product_order_no" placeholder="请输入订货号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                <Input v-model="formSearch.product_model" placeholder="请输入产品型号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <Input v-model="formSearch.ship_no" placeholder="请输入采购发货单编号" @on-enter="search"></Input>
                                </Col>
                                <Col span="4">
                                    <DatePicker type="datetimerange" placeholder="请选择创建时间" :value='formSearch.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="24">
                    <Card>
                        <Row class="margin-bottom-10">
                            <Col span="24">
                            <Button type="primary" @click="confirmAdd()">添加</Button>
                            <Button type="default" @click="goodsCancel" style="margin-left:20px;">取消</Button>
                            </Col>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="orderData" ref="multipleTable" border style="text-align: center" @selection-change="handleSelectionChange" @sort-change="manualSort1">
                            <el-table-column show-overflow-tooltip type="selection" width="55" :selectable="canSelect" fixed></el-table-column>


                            <el-table-column show-overflow-tooltip label="采购发货单编号" width="120" fixed>
                                <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.order_ship_no}, 'purchase_manage_FH_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_ship_no}}</span>
                            </span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" width="120" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" width="120" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位" width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_price" label="采购单价" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="buy_num" label="采购数量" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="num" label="发货数量" width="100" sortable="custom"></el-table-column>
                            <el-table-column show-overflow-tooltip label="发货金额" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.num * scope.row.buy_price | toDecimal }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="ship_no2" label="物流单号" width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_num" label="已入库数量" width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip label="状态" sortable="custom" prop="order_status">
                                <template slot-scope="scope">
                                    <span> {{ ship_status[scope.row.order_status] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间" sortable="custom" width="120"></el-table-column>
                            <el-table-column show-overflow-tooltip label="创建人" prop="create_user_no" width="120">
                                <template slot-scope="scope">
                                    <span> {{ scope.row.create_user_no }} / {{scope.row.create_user_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="采购合同单编号" width="120">
                                <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.buy_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                    {{ scope.row.buy_order_no }}
                                </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
                    </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="default" @click="goodsCancel">取消</Button>
            </div>
        </Modal>


    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiInstockWaitList,apiAllStatus,apiInstockAddProduct,operateAllBrandsList,apiGenerateInstock,apiGetAllAreaList,apiGetAllSeatList } from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        data () {
            return {
                form: {},
                fhd_id: this.$route.query.param,
                actTable: {
                    data: []
                },
                goodsAll: 0,
                goodsAllMoney: 0.0000,
                AreaArr: [],
                seatArr: [],
                loadding: false,
                formSearch:{
                    brand:'all',
                    datetime: [],
                },
                goodsModal:false,
                orderData:[],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                ajaxHistoryData:[],
                brand_list: [],
                multipleSelection:[],
                supplier_no:'',
                ship_status:[],
                goodsAddArr:[],
                goods:[],
                toggleSelect: true
            };
        },
        components: {
            pagination
        },
        methods: {
            //排序
            manualSort1 (column) {
                let isDec = column.order == "descending" ? true : false;
                this.ajaxHistoryData.sort(sortBy(column.prop, isDec));
                if (this.totalnum < this.limit) {
                    this.orderData = this.ajaxHistoryData;
                } else {
                    this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                }
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            canSelect (row) {
                let canSelect = true;
                for (let i in this.actTable.data) {
                    if (row.fh_id === this.actTable.data[i].id) {
                        canSelect = false;
                    }
                }
                return canSelect;
            },
            datetime (time) {
                this.formSearch.datetime = time;
                this.search();
            },
            search(){
                this.currentPage = 1;
                this.multipleSelection = [];
                this.getGoods();
            },
            confirmAdd(){
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请至少选择一项');
                }else{
                    this.goodsAddArr = [];
                    for (let i in this.multipleSelection) {
                        this.goodsAddArr.push(this.multipleSelection[i].fh_id);
                    }
                    let instock_list = '';
                    instock_list = this.goodsAddArr.join(',');
                    apiInstockWaitList(this, {
                        ids: JSON.stringify(instock_list)
                    }).then(res => {
                        if (res && res.status == 1) {
                            for (let i in res.data.list) {
                                res.data.list[i].seat_list = [];
                                if (res.data.list[i].area_no === '' || !res.data.list[i].area_no) {

                                    res.data.list[i].isChoose = true;
                                } else {
                                    res.data.list[i].isChoose = false;
                                    apiGetAllSeatList(this, {
                                        store_no: this.form.ckbh,
                                        area_no: res.data.list[i].area_no,
                                        type: 1
                                    }).then(result => {
                                        if (result && result.status == 1) {
                                            //成功
                                            res.data.list[i].seat_list = [];
                                            result.data.forEach(item => {
                                                item.label = item.seat_name;
                                                item.value = item.seat_no;
                                                res.data.list[i].seat_list.push(item);
                                            });
                                        }
                                    });
                                }
                            }

                            this.goods = res.data.list;
                            for (let i in this.goods) {
                                this.actTable.data.push(this.goods[i]);
                            }
                            this.calculates();
                            this.goodsModal = false;
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            goodsCancel(){
                this.goodsModal = false;
            },
            reset(){
                this.formSearch.ship_no = '';                 //发货单编号
                this.formSearch.order_no = '';                //合同单编号
                this.formSearch.brand = 'all';                //品牌
                this.formSearch.product_name = '';            //产品名称
                this.formSearch.product_order_no = '';        //产品订货号
                this.formSearch.product_model = '';           //产品型号
                this.formSearch.datetime = '';                //时间
                this.search();
            },
            getGoods(){
                apiInstockAddProduct(this,{
                    info: JSON.stringify(this.notempty({
                        store_no:this.form.ckbh,
                        supplier_no:this.supplier_no,
                    })),
                    params: JSON.stringify(this.notempty({
                        ship_no: this.formSearch.ship_no,                                                         //发货单编号
                        order_no: this.formSearch.order_no,                                                       //合同单编号
                        brand: this.formSearch.brand == 'all' ? '' : this.formSearch.brand,                             //品牌
                        product_name: this.formSearch.product_name,                                               //产品名称
                        product_order_no: this.formSearch.product_order_no,                                       //产品订货号
                        product_model: this.formSearch.product_model,                                             //产品型号
                        starttime: this.formSearch.datetime[0],
                        endtime: this.formSearch.datetime[1],

                    }))
                }).then(res => {
                    this.ajaxHistoryData = res.data.list;
                    this.totalnum = res.data.totalCount;
                    if (res.data.totalCount < this.limit) {
                        this.orderData = this.ajaxHistoryData;
                    } else {
                        this.orderData = this.ajaxHistoryData.slice(0, this.limit);
                    }
                });
            },
            addGoods(){

                this.goodsModal = true;
                this.getStatus();
                this.getGoods();
            },
            //获取品牌列表
            getStatus () {
                operateAllBrandsList(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.brand_list = res.data.list;
                    }
                });
                apiAllStatus(this, {
                    type: JSON.stringify(['ship_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.ship_status = res.data.ship_status;
                    }
                });
            },

            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.orderData =  this.ajaxHistoryData.slice(_start, _end);

            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            seatChange (val, index) {
                this.actTable.data[index].seat_no = val;
            },
            areaChange (val, index) {
                if(val) {
                    this.toggleSelect = false;
                    apiGetAllSeatList(this, {
                        store_no: this.form.ckbh,
                        area_no: val,
                        type: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.actTable.data[index].seat_list = [];
                            res.data.forEach(item => {
                                item.label = item.seat_name;
                                item.value = item.seat_no;
                                this.actTable.data[index].seat_list.push(item);
                            });
                            this.actTable.data[index].seat_no = '';
                            this.actTable.data[index].isChoose = false;
                            this.toggleSelect = true;
                        }
                    });
                }
            },
            verify (scope) {
                let _index = scope.$index;
                let regu = /^[1-9]\d*$/;
                if (!regu.test(this.actTable.data[_index]['now_num'])) {
                    this.actTable.data[_index]['now_num'] = 1;
                    this.$Message.error('必须填入正整数');
                }
                if(this.actTable.data[_index]['now_num'] > this.actTable.data[_index]['can_num']){
                    this.$Message.error('不可大于发货数量');
                }
                this.calculates();
            },
            save () {
                let sett = [];
                let info = {};
                for(let key in this.actTable.data){
                    let tmp  = {};
                    tmp['id'] = this.actTable.data[key].id;
                    tmp['num'] = this.actTable.data[key].now_num;
                    tmp['area_no'] = this.actTable.data[key].area_no;
                    tmp['seat_no'] = this.actTable.data[key].seat_no;
                    sett.push(tmp);
                }
                info['ckbh'] = this.form.ckbh;
                info['note'] = this.form.note;
                this.loadding = true;
                apiGenerateInstock(this, {
                    info: JSON.stringify(info),
                    data: JSON.stringify(sett)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.loadding = false;
                        //跳转到入库单详情页
                        let param = {param:res.data.in_no, fromAdd: '1'};
                        closeCurrentPage(this);
                        util.openNewPage(this, 'purchase_manage_RK_detail', param);
                        this.$router.push({
                            name: 'purchase_manage_RK_detail',
                            query: param
                        });
                    } else {
                        this.loadding = false;
                        this.$Message.error(res.message);
                    }
                });
            },
            deleted (index) {
                this.actTable.data.splice(index,1);
                this.calculates();
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            calculates () {
                this.goodsAll = parseInt(0);
                this.goodsAllMoney = parseFloat(0).toFixed(4);
                for(let key in this.actTable.data){
                    this.goodsAll += parseInt(this.actTable.data[key]['now_num']);
                    this.goodsAllMoney = (+this.goodsAllMoney + this.actTable.data[key]['now_num'] * this.actTable.data[key]['buy_price']).toFixed(4);
                }
            },
            getData () {
                apiInstockWaitList(this, {
                    ids: JSON.stringify(this.fhd_id)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.form = res.data.stock_info;
                        this.supplier_no = res.data.supplier_no;
                        for (let i in res.data.list) {
                            /*res.data.list[i].isChoose = true;
                            res.data.list[i].seat_no = '';
                            res.data.list[i].seat_list = [];*/

                            res.data.list[i].seat_list = [];
                            if (res.data.list[i].area_no === '' || !res.data.list[i].area_no) {

                                res.data.list[i].isChoose = true;
                            } else {
                                res.data.list[i].isChoose = false;
                                apiGetAllSeatList(this, {
                                    store_no: this.form.ckbh,
                                    area_no: res.data.list[i].area_no,
                                    type: 1
                                }).then(result => {
                                    if (result && result.status == 1) {
                                        //成功
                                        res.data.list[i].seat_list = [];
                                        result.data.forEach(item => {
                                            item.label = item.seat_name;
                                            item.value = item.seat_no;
                                            res.data.list[i].seat_list.push(item);
                                        });
                                    }
                                });
                            }
                        }
                        this.actTable.data = res.data.list;
                        //计算价格和数量
                        this.calculates();

                        apiGetAllAreaList(this, {
                            store_no: this.form.ckbh,
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
                    }
                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
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
