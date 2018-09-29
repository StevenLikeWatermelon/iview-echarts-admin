<template>
    <div class="service-return">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    单据基本信息
                </p>
                <div slot="extra" v-show="is_edit" v-auth="thrkdDetailInfo">
                    <a @click="editAllBasic()" v-show="!isEditBasic">
                        <Icon type="edit"></Icon>
                        编辑
                    </a>
                    <a @click="saveEdit()" v-show="isEditBasic">
                        <Icon type="checkmark"></Icon>
                        保存
                    </a>
                    <a @click.prevent="cancelEdit" v-show="isEditBasic" style="margin-left: 15px;">
                        <Icon type="close"></Icon>
                        取消
                    </a>
                </div>                   
                <Form ref="thdDetail" :model="thdDetail" :rules="ruleValidate" :label-width="120">
                    <Row>
                        <Col span="6">
                            <FormItem label="单据编号：">
                                {{ thdDetail.instock_no }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="创建时间：">
                                {{ thdDetail.create_time }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="单据状态：">
                                {{ returnStatus[thdDetail.instock_status] }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="销售合同单编号：">
                                {{ thdDetail.sell_order_no }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="销售退货单编号：">
                                {{ thdDetail.return_no }}
                            </FormItem>
                        </Col>

                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="入库仓库：" >
                                {{ thdDetail.store_name }}
                            </FormItem>
                        </Col>

                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="入库仓库：" prop="store_no">
                                <Select v-model="thdDetail.store_no" filterable>
                                    <Option v-for="item in storageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="退货物流：" >
                                {{ thdDetail.ship_name }}
                            </FormItem>
                        </Col>

                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="退货物流：" prop="ship_name">
                                <Input v-model="thdDetail.ship_name" placeholder="退货物流"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6" v-show="!isEditBasic">
                            <FormItem label="物流编号：" >
                                {{ thdDetail.ship_no }}
                            </FormItem>
                        </Col>

                        <Col span="6" v-show="isEditBasic">
                            <FormItem label="退货物流：" prop="ship_no">
                                <Input v-model="thdDetail.ship_no" placeholder="物流编号"></Input>
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="仓库地址：">
                                {{ thdDetail.store_address }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="销售人员：">
                                {{ thdDetail.seller }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="销售部门：">
                                {{ thdDetail.seller_depart }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="客服人员：">
                                {{ thdDetail.server }}
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem label="客服部门：">
                                {{ thdDetail.server_depart }}
                            </FormItem>
                        </Col>

                        <Col span="24">
                            <FormItem label="备注：">
                                {{ thdDetail.note }}
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
                    客户信息
                </p>
                <Form>
                    <Row>
                        <Col span="6">
                        <FormItem label="客户名称：">
                            {{ khDetail.customer_name }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系人：">
                            {{ khDetail.contact_user}}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客户联系方式：">
                            {{ khDetail.contact }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属销售：">
                            {{ khDetail.sell_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="销售所属部门：">
                            {{ khDetail.sell_depart }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="所属客服：">
                            {{ khDetail.server_user }}
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="客服所属部门：">
                            {{ khDetail.server_depart }}
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
                        退货商品明细
                    </p>
                    <Row class="margin-bottom-10">
                    <Col span="24">
                    </Col>
                    </Row>
                    <div slot="extra" v-show="is_edit_detail" v-auth="thrkdDetaildatas">
                        <a @click="edit('thmx')" v-show="!isEditList">
                            <Icon type="edit"></Icon>
                            编辑
                        </a>
                        <a @click="close('thmxsave')" v-show="isEditList">
                            <Icon type="checkmark"></Icon>
                            保存
                        </a>
                        <a  @click="close('thmxcancel')" v-show="isEditList" style="margin-left: 15px;">
                            <Icon type="close"></Icon>
                            取消
                        </a>
                    </div>                     
                    <Row class="special-return-detail">
                        <Form>
                            <Col span="6">
                                <FormItem label="入库商品总数：">
                                    <span>{{returnCount.total_num}}</span>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="入库商品总额：">
                                    <span>{{ parseFloat(returnCount.total_amount).toFixed(4) }}</span>
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>               
                    <div>
                        <el-table :data="thdList.data" border stripe style="text-align: center"  @sort-change="manualSort">
                            <el-table-column show-overflow-tooltip type="index" label="行号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="brand_name" label="品牌"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_name" label="产品名称" min-width="150" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_model" label="产品型号" min-width="150" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_order_no" label="订货号" min-width="100" sortable></el-table-column>
                            <el-table-column show-overflow-tooltip prop="product_unit" label="计量单位"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_price" label="入库单价" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.instock_price).toFixed(4) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="return_num" label="退货数量" sortable min-width="100"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_num" label="入库数量" sortable min-width="100">
                                <template slot-scope="scope">
                                    <span> {{ parseInt(scope.row.instock_num) }}</span>
                                    <!--<Input v-model="scope.row.instock_num" v-else @on-blur="valithsl(scope.row.instock_num, scope.row.return_num, scope.$index)" @on-change="changeAmount()"></Input>-->
                                </template>
                            </el-table-column>
                            <el-table-column prop="area_name" label="入库库区" width="150px;">
                                <template slot-scope="scope">
                                    <Select v-show="isEditList"  v-model="scope.row.area_no" placeholder="请选择" filterable transfer @on-change="areaChange(scope.row.area_no, scope.$index)">
                                        <Option v-for="status in AreaArr" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                    </Select>
                                    <span v-show="!isEditList">{{scope.row.area_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="seat_name" label="入库库位" width="150px;">
                                <template slot-scope="scope">
                                    <Select v-show="isEditList" v-model="scope.row.seat_no" placeholder="请选择" filterable :disabled="scope.row.isChoose" transfer>
                                        <Option v-for="status in scope.row.seat_list" :key="status.value" :value="status.value">{{ status.label }}</Option>
                                    </Select>
                                    <span v-show="!isEditList">{{scope.row.seat_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="instock_amount" label="入库金额">
                                <template slot-scope="scope">
                                    <span> {{ parseFloat(scope.row.instock_price * scope.row.instock_num).toFixed(4) }}</span>
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
                <Button type="primary" v-if="fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList('service-sales-thrkd')">返回</Button>
                <Button type="primary" v-if="!fromAdd" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="primary" @click="toExport" v-auth="thrkdDetail_export" class="margin-left-10">导出</Button>
                <Button v-show="canConfirmIn" type="primary" class="margin-top-10" style="margin:auto;" @click="confirmApprove(1)" v-auth="thrkdDetailPoint">确认入库</Button>
                <Button v-show="canConfirmIn" type="primary" class="margin-top-10" style="margin:auto;" @click="confirmApprove(0)" v-auth="thrkdDetailPoint">取消入库</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import Cookies from 'js-cookie';
    import {apithrkdDetail, apiAllStatus, allStoreInfos, apithrkdDetailEdit, apithrkdDetailFinish,exportThrkdDetail,apiGetAllSeatList,apiGetAllAreaList } from '@/config/getData';
    import { notempty, sortBy, setToken} from '@/config/mUtils';
    export default {
        data () {
            return {
                AreaArr: [],
                // seatArr: [],
                thrkdDetail_export:'thrkdDetail_export',
                fromAdd: this.$route.query.fromAdd,
                ruleValidate: {
                    store_no: [
                        { required: true, message: '入库仓库不能为空', trigger: 'blur' }
                    ],
                    ship_name: [
                        { required: true, message: '发货物流不能为空', trigger: 'blur' }
                    ],
                    ship_no: [
                        { required: true, message: '物流编号不能为空', trigger: 'blur' }
                    ]
                },  
                returnCount: {
                    total_num: 0,
                    total_amount: 0,
                },
                storageList: [],     
                thdbh: this.$route.query.param,
                thdDetail: {
                    store_no: ''
                },
                khDetail: {},
                is_edit: false,
                is_edit_detail: false,
                isEditBasic: false,
                isEditList: false,
                returnStatus: {},
                thdList: {
                    title: [],
                    data: []
                },
                canConfirmIn: false,
                showDelete: false,
                canDelete: false,
                canPush:false,
                canAbandon: false,
                canApprove: false,
                canApplyReturn: false,
                typeObj: {},
                showAbandon: false,
                currentFlow: 0,
                workFlowArr: [],
                showApprove: false,
                approveDetail: {
                    isPass: '同意',
                    note: ''
                },
                workFlowWidth: 100,
                thrkdDetailInfo: 'service-thrkd-detail-info',
                thrkdDetaildatas: 'service-thrkd-detail-data',
                thrkdDetailPoint: 'service-thrkd-detail-point'
            };
        },
        methods: {
            backToList(path) {
                util.openNewPage(this, path);
                this.$router.push({
                    name: path
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['sell_instock_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.returnStatus = res.data.sell_instock_status;
                        this.getAllStoreInfos();
                    }
                });
            },   
            changeAmount() {
                this.returnCount.total_num = 0;
                this.returnCount.total_amount = 0;
                this.thdList.data.forEach(item => {
                    this.returnCount.total_num =  parseInt(this.returnCount.total_num) + parseInt(item.instock_num);
                    this.returnCount.total_amount = parseFloat((this.returnCount.total_amount * 10000 + item.instock_num * item.instock_price * 10000) / 10000).toFixed(4);
                });
            },                
            confirmApprove(type) {
                apithrkdDetailFinish(this, {
                    instock_no: this.$route.query.param,
                    is_instock: type
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('操作完成!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },                             
            getAllStoreInfos () {
                allStoreInfos(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.storageList.push({
                                value: item.ckbh,
                                label: item.ckmc
                            });
                        });
                        this.getData();
                    }
                });
            },
            editAllBasic() {
                this.isEditBasic = true;
            },
            cancelEdit() {
                this.isEditBasic = false;
                this.getData();
            },
            saveEdit() {
                this.$refs['thdDetail'].validate((valid) => {
                    if (valid) {
                        apithrkdDetailEdit(this, {
                            instock_no: this.$route.query.param,
                            params: JSON.stringify({
                                basic: {
                                    store_no: this.thdDetail.store_no,
                                    ship_no: this.thdDetail.ship_no,
                                    ship_name: this.thdDetail.ship_name,
                                }
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('保存成功');
                                this.isEditBasic = false;
                                this.getData();
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                        
                    } else {
                        this.$Message.error('提交内容有误，请检查！');
                    }
                })
            },
            deleteOrder() {
                this.showDelete = true;
            },
            confirmDelete() {
                apiThdReturnDeleteNew(this, {
                    params: JSON.stringify({
                        instock_no: this.thdbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('删除成功!');
                        this.$router.push({
                            name: 'service-sales-thd'
                        });
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            valithsl(thsl, kthsl, cpdhh){
                cpdhh = +cpdhh + 1;
                if(parseInt(thsl) > parseInt(kthsl)){
                    this.$Message.error('第【'+cpdhh+'】行入库数量大于可入库数量');
                }
            },
            toExport(){
                exportThrkdDetail(this, {
                    params: JSON.stringify(this.notempty({
                        'instock_no': this.thdbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        //成功
                    }
                });
            },
            getData () {
                apithrkdDetail(this, {
                    'instock_no': this.thdbh
                }).then(res => {
                    if(res && res.status == 1){
                         for (let i in res.data.detail) {
                            res.data.detail[i].seat_list = [];
                            if (res.data.detail[i].area_no === '' || !res.data.detail[i].area_no) {
                                res.data.detail[i].isChoose = true;
                            } else {
                                res.data.detail[i].isChoose = false;
                                apiGetAllSeatList(this, {
                                    store_no: res.data.store_no,
                                    area_no: res.data.detail[i].area_no,
                                    type: 1
                                }).then(result => {
                                    if (result && result.status == 1) {
                                        //成功
                                        res.data.detail[i].seat_list = [];
                                        result.data.forEach(item => {
                                            item.label = item.seat_name;
                                            item.value = item.seat_no;
                                            res.data.detail[i].seat_list.push(item);
                                        });
                                    }
                                });
                            }
                        }

                        this.khDetail = res.data.customer_info;
                        this.thdDetail = res.data;
                        this.thdList.data = res.data.detail;
                        this.changeAmount();
                        //单据状态“待入库”，且当前登录人员为客户的所属客服时展示编辑
                        this.is_edit = ((res.data.instock_status == '5') && (Cookies.get('user_no') === res.data.customer_info.server_user_no));
                        //当前单据状态“待入库”且当前登录人员为入库仓库所属仓库人员角色时展示
                        this.canConfirmIn = ((res.data.instock_status == '5') && res.data.is_store_user);
                        this.is_edit_detail = ((res.data.instock_status == '5') && res.data.is_store_user);

                    }else{
                        this.$Message.error(res.message);
                    }
                });

            },          
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.thdList.data.sort(sortBy(column.prop, isDec));
            },
            backTo () {
                history.go(-1);
            },
            /*修改*/
            edit (name) {
                if (name === 'thmx') {
                    this.isEditList = true;
                    apiGetAllAreaList(this, {
                            store_no: this.thdDetail.store_no,
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
            },
            areaChange (val, index) {
                this.thdList.data[index].seat_no = '';
                this.thdList.data[index].isChoose = false;
                if(val == ''){
                    this.$Message.error('库区不能为空');
                }
                apiGetAllSeatList(this, {
                    store_no: this.thdDetail.store_no,
                    area_no: val,
                    type: 1
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.thdList.data[index].seat_list = [];
                        res.data.forEach(item => {
                            item.label = item.seat_name;
                            item.value = item.seat_no;
                            this.thdList.data[index].seat_list.push(item);
                        });
                    }
                });
            },
            close (name) {
                if (name === 'thmxcancel') {
                    this.isEditList = false;
                    this.getData();
                } else if (name === 'thmxsave') {
                    
                    for(let i = 0; i < this.thdList.data.length; i++){
                        let tmp = {};
                        tmp['instock_num'] = this.thdList.data[i]['instock_num'];
                        tmp['return_num'] = this.thdList.data[i]['return_num'];
                        
                        if(parseInt(tmp['return_num']) < parseInt(tmp['instock_num'])){
                            this.$Message.error('第【'+ (i+1) +'】行入库数量大于可入库数量');
                            return;
                        }

                        if(this.thdList.data[i]['seat_no'] == null){
                            this.$Message.error('第【'+ (i+1) +'】行库位不能为空');
                            return;
                        }
                    }

                    
                    let sett = [];
                    for(let key in this.thdList.data){
                        let tmpObj = {};
                        tmpObj['id'] = this.thdList.data[key]['id'];
                        tmpObj['instock_num'] = this.thdList.data[key]['instock_num'];
                        tmpObj['seat_no'] = this.thdList.data[key]['seat_no'];
                        sett.push(tmpObj);
                    }
                    apithrkdDetailEdit(this, {
                        instock_no: this.$route.query.param,
                        detail:1,
                        params: JSON.stringify(sett)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('保存成功');
                            this.getData();
                            this.isEditBasic = false;
                            this.isEditList = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            }
        },
        created () {
            this.getStatus();
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
