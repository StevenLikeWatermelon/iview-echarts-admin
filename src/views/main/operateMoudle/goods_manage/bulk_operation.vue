<style>
    .bulktext textarea{height:120px !important;position: relative;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    待批量操作商品列表
                </p>
                <div>
                    <div class="margin-bottom-10" v-auth="buttonAuth">
                        <Button type="primary" @click="bulkUp">批量上架</Button>
                        <Button type="primary" class="margin-left-10" @click="bulkDown">批量下架</Button>
                        <Button type="primary" class="margin-left-10" @click="allBulkUp">全量上架</Button>
                        <Button type="primary" class="margin-left-10" @click="allBulkDown">全量下架</Button>
                        <Button type="warning" class="margin-left-10" @click="deleteChoosed">移除</Button>
                        <Button type="error" class="margin-left-10" @click="deletedProduct">删除</Button>
                    </div>
                    <el-table :row-class-name="tableRowClassName" :data="actTable.data" border style="text-align: center" @selection-change="handleSelectionChange"  ref="multipleTable"  max-height="570">
                        <el-table-column show-overflow-tooltip
                                type="selection"
                                width="55"
                                reserve-selection>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxhbh" label="商品型号编号" width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="zszt" label="在售状态">
                            <template slot-scope="scope">
                                <span>{{ sellStatus[scope.row.zszt] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpppmc" label="商品品牌"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpmcty" label="通用系列" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cplbmc" label="产品类别"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxh" label="商品型号" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpdhh" label="商品订货号" min-width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="cpxhmj" label="面价">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.cpxhmj | toDecimal }}</span>
                                <Input v-if="scope.row.isEdit" v-model="scope.row.cpxhmj"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="zdjzk" label="认证折扣">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.zdjzk}}</span>
                                <Input v-if="scope.row.isEdit" v-model="scope.row.zdjzk"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="vipzk" label="vip折扣">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.vipzk}}</span>
                                <Input v-if="scope.row.isEdit" v-model="scope.row.vipzk"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="scjzk" label="商城折扣">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.isEdit">{{scope.row.scjzk}}</span>
                                <Input v-if="scope.row.isEdit" v-model="scope.row.scjzk"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="mjrq" label="面价维护时间" width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="sjrq" label="上架时间" width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="xjrq" label="下架时间" width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="message" label="失败原因" min-width="120"></el-table-column>
                        <el-table-column show-overflow-tooltip label="操作" width="120">
                            <template slot-scope="scope">
                                <span  @click="editAndCopy(scope.$index)" v-if="!scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">修改</span></span>
                                <span  @click="cancel(scope.$index)" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;">取消</span></span>
                                <span  @click="save(scope.$index)" v-if="scope.row.isEdit"><span style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 10px;">保存</span></span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalNum" :current="currentPage" :getPageSize="limit"></pagination>
                    <Row class="margin-top-10">
                        <Col span="8" class="margin-top-10">
                        <Input type="textarea" v-model="bulktext" class="bulktext" @on-blur="isShow" @on-focus="isHidden" id="placeholderAction"></Input>
                        <div style="position: absolute;left:10px;top:10px;z-index: 0;" v-if="is_show" @click="isHidden">
                            <div style="color:#999;">批量添加订货号，用空格隔开（支持从Excel复制）</div>
                            <div style="color:#999;">示例：</div>
                            <div style="color:#999;">101275386</div>
                            <div style="color:#999;">101065317</div>
                        </div>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                        <Button type="primary" style="margin-top:88px;" @click="bulkAdd">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                        <el-table :row-class-name="tableRowClassName" :data="notFoundData" border style="text-align: center">
                            <el-table-column show-overflow-tooltip label="订货号" prop="order_no"></el-table-column>
                            <el-table-column show-overflow-tooltip label="失败原因" prop="reason"></el-table-column>
                            <el-table-column show-overflow-tooltip label="操作" prop="operate">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.operate.length == 0"></div>
                                    <el-popover trigger="click" placement="top" v-else>
                                        <p v-for="val in scope.row.operate">
                                            <span class="pointer-hover" @click="goodsChoose(val)">{{val.cpppmc}}, {{val.cpdhh}}</span>
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
            </Card>
            </Col>
        </Row>
        <Modal v-model="showSucessInfo" width="400" :closable="true" :mask-closable="true">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p>{{successInfoMsg}}</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="hasKnow()">知道了</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiGetOperateSearchGoods, apiGetOperateGoodsUpdate, apiAllStatus, operatePriceEdit,deleteItems } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import pagination from '@/views/common/pagination.vue'
    import util from '@/libs/util';

    export default {
        data () {
            return {
                buttonAuth: 'goods_price_manage_operate_all_button',
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
                back_store_name: '',
                is_show: true,
                notFoundData: [],
                searchData: [],
                multipleSelection: [],
                currentGoodsId: [],
                productsModelArr: [],
                sellStatus: [],
                showSucessInfo: false,
                successInfoMsg: '',
                arrToUpAndDown: [],

                currentPage: 1,
                limit: 10,
                totalNum: 0,
                ajaxHistoryData: []
            };
        },
        components: {
            pagination
        },
        methods: {
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.actTable.data = this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            getData () {
                this.currentGoodsId = [];
                for (let i in this.actTable.data) {
                   this.currentGoodsId.push(this.actTable.data[i].id);
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['zszt'])
                }).then(res => {
                    this.sellStatus = res.data.zszt;
                });
            },
            goodsChoose (item) {
                for (let i in this.actTable.data) {
                    if (this.actTable.data[i].id === item.id) {
                        return false;
                    }
                }
                this.actTable.data.push(item);
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
            handleSelectionChange (val) {
                this.multipleSelection = val;
                this.arrToUpAndDown = [];
                val.forEach(item => {
                    this.arrToUpAndDown.push(item.cpxhbh);
                });
            },
            hasKnow () {
                this.showSucessInfo = false;
            },
            editAndCopy(index) {
                this.copyList = JSON.parse(JSON.stringify(this.actTable.data));
                this.actTable.data[index].isEdit = true;
            },
            cancel(index) {
                this.actTable.data = JSON.parse(JSON.stringify(this.copyList));
                this.actTable.data[index].isEdit = false;
            },
            save(index) {
                let tmpObj = {
                    cpxhbh: this.actTable.data[index].cpxhbh,
                    cpxhmj: this.actTable.data[index].cpxhmj,
                    zdjzk: this.actTable.data[index].zdjzk,
                    scjzk: this.actTable.data[index].scjzk,
                    vipzk: this.actTable.data[index].vipzk,
                    xy_cp_id: this.actTable.data[index].xy_cp_id,
                };
                let maxTwo =  /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                let maxThree =  /^-?\d+(\.\d{1,3})?$/;

                if (isNaN(tmpObj.cpxhmj) || isNaN(tmpObj.zdjzk) || isNaN(tmpObj.scjzk) || isNaN(tmpObj.vipzk)) {
                    this.$Message.error('数据格式有误，请检查!');
                    return;
                }
                
                if (!maxTwo.test(tmpObj.cpxhmj)) {
                    this.$Message.error('面价小数点不能大于2位');
                    return;
                }

                if (!maxThree.test(tmpObj.zdjzk) || !maxThree.test(tmpObj.scjzk) || !maxThree.test(tmpObj.vipzk)) {
                    this.$Message.error('折扣小数点不能大于3位');
                    return;
                }

                if (+tmpObj.cpxhmj <= 0) {
                    this.$Message.error('面价不能小于0!');
                    return;
                }
                if (+tmpObj.zdjzk <= 0 || +tmpObj.scjzk <= 0 || +tmpObj.vipzk <= 0) {
                    this.$Message.error('折扣必须不小于0!');
                    return;
                }
                if (+tmpObj.zdjzk > 1 || +tmpObj.scjzk > 1 || +tmpObj.vipzk > 1) {
                    this.$Message.error('折扣不能大于1!');
                    return;
                }
                operatePriceEdit(this, {
                    params: JSON.stringify(tmpObj)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success(res.message);
                        this.actTable.data[index].isEdit = false;
                        this.actTable.data[index].zszt = res.data.zszt;
                        this.actTable.data[index].xjrq = res.data.xjrq;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            /*批量添加*/
            bulkAdd () {
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                for (let i in arrStr) {
                    arrList.push(arrStr[i]);
                }

                apiGetOperateSearchGoods(this, {
                    params: JSON.stringify(arrList),
                    current_ids: JSON.stringify(this.currentGoodsId)
                }).then(res => {
                    if (res.data.delete.length != 0 ) {
                        for (let i in res.data.delete) {
                            for (let j in this.actTable.data) {
                                if (this.actTable.data[j].id === res.data.delete[i]) {
                                    this.actTable.data.splice(j, 1);
                                }
                            }
                        }
                    }
                    res.data.goods.forEach(item => {
                        item.isEdit = false;
                        this.ajaxHistoryData.push(item);
                    });
                    this.totalNum = this.ajaxHistoryData.length;
                    this.actTable.data = this.ajaxHistoryData.slice(0, this.limit);
                        this.getData();
                        this.bulktext = '';
                        this.is_show = true;
                        this.notFoundData = [];
                        if(res.data.not_exist_products.length != 0){
                            for (let i in res.data.not_exist_products) {
                                this.notFoundData.push({order_no: res.data.not_exist_products[i], reason: '订货号不存在', operate: ''});
                            }
                        }
                        if(res.data.no_found.length != 0){
                            for (let i in res.data.no_found) {
                                this.notFoundData.push({order_no: res.data.no_found[i], reason: '商品不在上架表', operate: ''});
                            }
                        }
                        if(res.data.repeat_goods.length != 0){
                            for (let i in res.data.repeat_goods) {
                                this.notFoundData.push({order_no: i, reason: '存在多条', operate: res.data.repeat_goods[i]});
                            }
                        }
                });
            },
            bulkUp () {
                this.productsModelArr = [];
                for (let i in this.multipleSelection) {
                    this.productsModelArr.push(this.multipleSelection[i].cpxhbh);
                }
                if (this.productsModelArr.length != 0) {
                    this.$Spin.show();
                    apiGetOperateGoodsUpdate(this, {
                        params: JSON.stringify(this.productsModelArr),
                        status: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            for (let j in res.data.updated_ids) {
                                for (let i in this.ajaxHistoryData) {
                                    if (this.ajaxHistoryData[i].id === res.data.updated_ids[j]) {
                                        this.ajaxHistoryData.splice(i, 1);
                                    }
                                }
                            }
                            this.totalNum = this.ajaxHistoryData.length;
                            this.limit = 300;
                            this.getNowLimit(this.limit);
                            this.$refs.multipleTable.clearSelection();
                            this.showSucessInfo = true;
                            this.$Spin.hide();
                            this.successInfoMsg = '操作完成，'+res.data.failed_num + '个上架失败，' + res.data.success_num+'个上架完成';
                        }
                    });
                } else {
                    this.$Message.error('请至少选择一项!');
                }
            },
            allBulkUp () {
                this.productsModelArr = [];
                for (let i in this.ajaxHistoryData) {
                    this.productsModelArr.push(this.ajaxHistoryData[i].cpxhbh);
                }
                if (this.productsModelArr.length != 0) {
                    this.$Spin.show();
                    apiGetOperateGoodsUpdate(this, {
                        params: JSON.stringify(this.productsModelArr),
                        status: 1
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            for (let j in res.data.updated_ids) {
                                for (let i in this.ajaxHistoryData) {
                                    if (this.ajaxHistoryData[i].id === res.data.updated_ids[j]) {
                                        this.ajaxHistoryData.splice(i, 1);
                                    }
                                }
                            }
                            this.totalNum = this.ajaxHistoryData.length;
                            this.limit = 300;
                            this.getNowLimit(this.limit);
                            this.$refs.multipleTable.clearSelection();
                            this.showSucessInfo = true;
                            this.$Spin.hide();
                            this.successInfoMsg = '操作完成，'+res.data.failed_num + '个上架失败，' + res.data.success_num+'个上架完成';
                        }
                    });
                } else {
                    this.$Message.error('请至少选择一项!');
                }
            },
            bulkDown () {
                this.productsModelArr = [];
                for (let i in this.multipleSelection) {
                    this.productsModelArr.push(this.multipleSelection[i].cpxhbh);
                }
                if (this.productsModelArr.length != 0) {
                    this.$Spin.show();
                    apiGetOperateGoodsUpdate(this, {
                        params: JSON.stringify(this.productsModelArr),
                        status: 0
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            for (let j in res.data.updated_ids) {
                                for (let i in this.ajaxHistoryData) {
                                    if (this.ajaxHistoryData[i].id === res.data.updated_ids[j]) {
                                        this.ajaxHistoryData.splice(i, 1);
                                    }
                                }
                            }
                            this.totalNum = this.ajaxHistoryData.length;
                            this.limit = 300;
                            this.getNowLimit(this.limit);
                            this.$refs.multipleTable.clearSelection();
                            this.showSucessInfo = true;
                            this.$Spin.hide();
                            this.successInfoMsg = '操作完成，'+res.data.failed_num + '个下架失败，' + res.data.success_num+'个下架完成';
                        }
                    });
                } else {
                    this.$Message.error('请至少选择一项!');
                }
            },
            allBulkDown () {
                this.productsModelArr = [];
                for (let i in this.ajaxHistoryData) {
                    this.productsModelArr.push(this.ajaxHistoryData[i].cpxhbh);
                }
                if (this.productsModelArr.length != 0) {
                    this.$Spin.show();
                    apiGetOperateGoodsUpdate(this, {
                        params: JSON.stringify(this.productsModelArr),
                        status: 0
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            for (let j in res.data.updated_ids) {
                                for (let i in this.ajaxHistoryData) {
                                    if (this.ajaxHistoryData[i].id === res.data.updated_ids[j]) {
                                        this.ajaxHistoryData.splice(i, 1);
                                    }
                                }
                            }
                            this.totalNum = this.ajaxHistoryData.length;
                            this.limit = 300;
                            this.getNowLimit(this.limit);
                            this.$refs.multipleTable.clearSelection();
                            this.showSucessInfo = true;
                            this.$Spin.hide();
                            this.successInfoMsg = '操作完成，'+res.data.failed_num + '个下架失败，' + res.data.success_num+'个下架完成';
                        }
                    });
                } else {
                    this.$Message.error('请至少选择一项!');
                }
            },
            deleteChoosed () {
                if (this.multipleSelection.length != 0) {
                    for (let i in this.multipleSelection) {
                        for (let j in this.ajaxHistoryData) {
                            if (this.multipleSelection[i].id === this.ajaxHistoryData[j].id) {
                                this.ajaxHistoryData.splice(j, 1);
                            }
                        }
                    }
                    this.totalNum = this.ajaxHistoryData.length;
                    this.limit = 300;
                    this.getNowLimit(this.limit);
                    this.$refs.multipleTable.clearSelection();
                } else {
                    this.$Message.error('请至少选择一项!');
                }
            },
            deletedProduct () {
                if (this.arrToUpAndDown.length == 0) {
                    this.$Message.error('请至少选择一项');
                    return
                }

                deleteItems(this, {
                    params: JSON.stringify(this.arrToUpAndDown)
                }).then(res => {
                    if (res && res.status == 1) {
                        let tmpMsg = '操作完成,' + res.data.success + '个删除成功，' + res.data.error + '个删除失败';
                        this.successInfoMsg = tmpMsg;
                        this.showSucessInfo = true;
                        this.multipleSuccess = res.data.success_ids;
                        this.deletedSuccess();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            deletedSuccess (){
                for (let i in this.multipleSuccess) {
                    for (let j in this.ajaxHistoryData) {
                        if (this.multipleSuccess[i] == this.ajaxHistoryData[j].id) {
                            this.ajaxHistoryData.splice(j, 1);
                        }
                    }

                }
                this.totalNum = this.ajaxHistoryData.length;
                this.limit = 300;
                this.getNowLimit(this.limit);
                this.$refs.multipleTable.clearSelection();
            },
            deleteRow (index, rows) {
                rows.splice(index, 1);
                this.getCount();
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
                return f.toFixed(2);
            }
        }
    };
</script>
