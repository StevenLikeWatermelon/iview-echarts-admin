<style>
    .bulktext textarea{height:120px !important;}
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="150">
                    <Row>
                        <Col span="24" class="margin-top-20">
                        <FormItem label="采购合同修改单备注：" style="margin:0;">
                            <Input type="textarea" v-model="form.state" style="width:620px;" placeholder="请输入备注"></Input>
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
                    合同信息
                </p>
                <Form :label-width="150" :model="htInfo" ref="htInfoForm" :rules="htInfoRules">
                    <Row>
                        <Col span="6">
                        <FormItem label="纸质合同编号：" style="margin:0;" prop="htId">
                            <Input v-model="htInfo.htId"  placeholder="请选择纸质合同编号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="纸质合同：" style="margin:0;" prop="uploadUrl">
                            <Upload :action="htInfo.uploadUrl"
                                    :format="['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'rar', 'xls', 'xlsx']"
                                    :on-format-error="handleFormatError"
                                    :on-success="handleSuccess"
                                    :max-size="10240" :on-exceeded-size="handleMaxSize"
                                    :show-upload-list="false" style="display: block;width:100%;">
                                <Button type="default" icon="ios-cloud-upload-outline">上传文件</Button>
                            </Upload>
                            <a v-if="htInfo.file" style="width:100%;color: rgb(45, 140, 240);" :href="imgURL + htInfo.file" target="_blank">
                                <Icon type="paperclip" style="margin-right:10px;font-size: 20px;"></Icon>附件:
                                <span v-if="htInfo.name"> {{htInfo.name}}</span>
                                <span v-else> {{htInfo.htName}}.{{htInfo.ext}}</span>
                                
                            </a>
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
                    修改商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>采购商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">采购商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney | toFiexedFour}}</em></span>
                        <span class="margin-left-20">取消商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAllWS}}</em></span>
                        <span class="margin-left-20">取消商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAlltax | toFiexedFour}}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号"></el-table-column>
                        <el-table-column prop="brand_name" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_model" label="产品型号" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_order_no" label="订货号" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_unit" label="计量单位"></el-table-column>
                        <el-table-column prop="buy_price" label="采购单价" sortable="custom" width="120"></el-table-column>
                        <el-table-column prop="buy_num" label="采购数量" sortable="custom" width="100"></el-table-column>
                        <el-table-column prop="ship_stock_num" label="已发货数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="change_num" label="取消数量">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.change_num" @on-blur="cancelNum(scope.row.change_num, scope.row.buy_num, scope.row.ship_stock_num, scope.$index)" @on-change="getCount();" ></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_num" label="取消金额" sortable="custom" width="120">
                            <template slot-scope="scope">
                                <span>{{ multiply(scope.row.buy_price,  scope.row.change_num, 4)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="buy_leadtime" label="采购货期(天)" width="120"></el-table-column>
                        <el-table-column prop="note" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="from_order_no" label="来源单据编号" min-width="120">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="handleClick({param: scope.row.from_order_no}, 'purchase_manage_BH_detail')">{{ scope.row.from_order_no }}</span>
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
                <Button type="success" class="margin-top-10" style="margin:auto;margin-left:20px;" :loading="loadding" @click="save">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiGetPurchaseHtDetail, apiGetPurchaseHTeditAddChange } from '@/config/getData';
    import { notempty, sortBy, setToken, closeCurrentPage} from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        data () {
            return {
                htd_id: this.$route.query.param,
                form: {
                    state: ''
                },
                htInfo: {
                    htId: '',
                    file: '',
                    name: '',
                    htName:'',
                    ext:'',
                    uploadUrl: this.baseUrl + '/v1/order/buy/main/upload-attach?token=' + setToken()
                },
                bhd_id: this.$route.query.param,
                actTable: {
                    data: [
                        {
                            cpdhh: '1239'
                        }
                    ]
                },
                orderField: 'djrq',
                orderDirection: 'desc',
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: '120',
                goodsAllMoney: '132.00',
                goodsAllWS: '122',
                goodsAlltax: '1323',
                bulktext: '',
                htInfoRules: {
                    htId: [
                        { required: true, message: '请输入纸质合同编号', trigger: 'blur' }
                    ],
                    uploadUrl: [
                        { required: true, message: '请上传纸质合同', trigger: 'on-change' }
                    ]
                },
                loadding: false
            };
        },
        methods: {
            handleClick (param, path) {
//                let argu = { param };
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                //基本信息
                apiGetPurchaseHtDetail(this, {
                    buy_order_no: this.htd_id
                }).then(res => {
                    if (res && res.status == 1) {
//                        this.form.state = res.data.order_info.note;
                        this.htInfo.htId = res.data.order_info.order_attach_no;
                        this.htInfo.file = res.data.order_info.order_attach;
                        this.htInfo.htName = res.data.order_info.attach_file_name;
                        this.htInfo.ext = res.data.order_info.attach_file_ext;
                        for (let i in res.data.order_detail) {
                            res.data.order_detail[i].change_num = 0;
                        }
                        this.actTable.data = res.data.order_detail;
                        this.getCount();
                    }
                });
            },
            /*计算数量和价格*/
            getCount () {
                let allNum = 0;
                let allAmount = 0;
                let allWS = 0;
                let allTax = 0;
                for (let i in this.actTable.data) {
                    if (!this.actTable.data[i].change_num || this.actTable.data[i].change_num === '' || isNaN(this.actTable.data[i].change_num)) {
                        this.actTable.data[i].change_num = 0;
                    }
                    allNum = parseInt(allNum) + parseInt(this.actTable.data[i].buy_num);
                    allAmount = this.add(allAmount, this.multiply(this.actTable.data[i].buy_price, this.actTable.data[i].buy_num), 4);
                    allWS = parseInt(allWS) + parseInt(this.actTable.data[i].change_num);
                    allTax = this.add(allTax, this.multiply(this.actTable.data[i].buy_price, this.actTable.data[i].change_num), 4);
                }
                this.goodsAll = allNum;
                this.goodsAllMoney = allAmount;
                this.goodsAllWS = allWS;
                this.goodsAlltax = allTax;
            },
            cancelNum (n, m, f, i) {
                var reg = /^\d+$/;
                if (!reg.test(n)) {
                    this.$Message.error('第' + parseInt(i + 1) + '行的取消数量必须为大于等于0的整数 ');
                } else if (parseInt(n) > parseInt((parseInt(m) - parseInt(f)))) {
                    this.$Message.error('第' + parseInt(i + 1) + '行的取消数量不能大于采购数量和已发货数量之差 ');
                }
            },
            save () {
                if (!this.htInfo.htId && this.htInfo.htId === '') {
                    this.$Message.error('请输入纸质合同编号');
                } else if (!this.htInfo.file && this.htInfo.file === '') {
                    this.$Message.error('请上传纸质合同');
                } else {
                    this.$refs.htInfoForm.validate((valid) => {
                        if (valid) {
                            var reg = /^\d+$/;
                            let tmpArr = [];
                            for (let i in this.actTable.data) {
                                let n = parseInt(i) + 1;
                                if (!reg.test(this.actTable.data[i].change_num)) {
                                    this.$Message.error('第' + parseInt(n) + '行的取消数量必须为大于等于0的整数 ');
                                    return false;
                                } else if (parseInt(this.actTable.data[i].change_num) > (parseInt(this.actTable.data[i].buy_num) - parseInt(this.actTable.data[i].ship_stock_num))) {
                                    this.$Message.error('第' + parseInt(n) + '行的取消数量不能大于采购数量和已发货数量之差 ');
                                    return false;
                                } else {
                                    tmpArr.push({id: this.actTable.data[i].id, number: this.actTable.data[i].change_num});
                                }
                            }
                            if (tmpArr.length == this.actTable.data.length) {
                                this.loadding = true;
                                apiGetPurchaseHTeditAddChange(this, {
                                    params: JSON.stringify({
                                        buy_order_no: this.htd_id,
                                        order_attach_no: this.htInfo.htId,
                                        order_attach: this.htInfo.file,
                                        note: this.form.state
                                    }),
                                    info: JSON.stringify({
                                        list: tmpArr
                                    })
                                }).then(res => {
                                    if (res && res.status == 1) {
                                        this.loadding = false;
                                        closeCurrentPage(this);
                                        this.handleClick({param: res.data.order_change_no, fromAdd: '1'}, 'purchase_manage_HTedit_detail');
                                        this.$Message.success(res.message);
                                    } else {
                                        this.loadding = false;
                                        this.$Message.error(res.message);
                                    }
                                });
                            }
                        }
                    });
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件：' + file.name + ' 格式不正确',
                    desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx 类型，请重新选择文件。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.error({
                    title: '文件：' + file.name + ' 上传失败',
                    desc: '文件' + file.name + '不能超过10M'
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.status == 1) {
                        this.htInfo.file = response.data;
                        this.htInfo.name = file.name;
                        this.$Notice.success({
                            title: '文件上传成功',
                            desc: '文件 ' + file.name + ' 上传成功。'
                        });
                    } else {
                        this.$Notice.error({
                            title: '文件：' + file.name + ' 上传失败',
                            desc: '文件只支持 doc .docx .pdf .jpg .jpeg .png .zip .rar .xls .xlsx类型，请重新选择文件。'
                        });
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
