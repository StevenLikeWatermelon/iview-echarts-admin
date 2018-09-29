    <template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="form" :label-width="140" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="form.supplier_no"  placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in supperList" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.pay_status"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in buypayStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Input v-model="form.order_payment_no" placeholder="输入采购付款单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="form.can_verify" @on-change="search">
                                <Option v-for="status in canApproveArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.from_order_no" placeholder="输入采购合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="form.create_user" placeholder="输入员工信息" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='form.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="form.pay_way_no"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in fkfsStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <Button type="primary" @click="goToAdd" v-if="canAdd" style="margin-right: 20px;">新增采购付款单</Button>
                        <Button type="primary" @click="batchCommit" style="margin-right: 20px;">提交</Button>
                        <Button type="primary" @click="batchApprove" style="margin-right: 20px;">审批</Button>
                        <Button type="primary" @click="toExport" v-auth="FKlist_export" style="margin-right: 20px;">导出</Button>
                        <span style="padding-right: 20px;">付款总金额：<span style="color: #cf0012;">{{amount}}</span></span>
                        <span style="padding-right: 20px;">勾选付款金额：<span style="color: #cf0012;">{{checkamount}}</span></span>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" ref="multipleTable" border style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column label="采购付款单编号" prop="order_payment_no" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.order_payment_no}, 'purchase_manage_FK_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.order_payment_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gysmc" label="供应商"  min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="payable_amount" label="采购合同金额" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column prop="pay_way_no" label="付款方式" sortable="custom" min-width="120">
                        <template slot-scope="scope">
                            <span> {{fkfsStatus[scope.row.pay_way_no] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="real_amount" label="本次付款金额" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column prop="pay_status" label="状态 " sortable="custom">
                        <template slot-scope="scope">
                            <span> {{buypayStatus[scope.row.pay_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="can_verify" label="是否可审批 " min-width="140">
                        <template slot-scope="scope">
                            <span> {{ scope.row.can_verify == '1' ? '是' : '否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="create_user" label="创建人" width="120"></el-table-column>
                    <el-table-column label="采购合同单编号" prop="from_order_no" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.from_order_no}, 'purchase_manage_HT_detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.from_order_no}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注" min-width="120"  show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Modal v-model='showCommit' :mask-closable=false :width="500" title="确认提交">
            <p>确认提交勾选的采购付款单？</p>
            <div slot="footer">
                <Button type="text" @click="cancelShowCommit">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmCommitOrder">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showApprove" title="请选择审批意见" >
            <Row>
                <col span="24">
                <Card>
                    <Form :label-width="100">
                        <Row>
                            <Col span="24">
                                <FormItem label="审批结果：">
                                    <RadioGroup v-model="approveDetail.isPass">
                                        <Radio label="1">同意</Radio>
                                        <Radio label="0">驳回</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                            <Col span="24">
                                <FormItem label="审批意见：" prop="note">
                                    <Input v-model="approveDetail.note" type="textarea" :rows="3" placeholder="请输入审批意见"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelApprove">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmApprove">确定</Button>
            </div>
        </Modal>        
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetPurchaseFKList,apiGetPurchaseFKDetail,apiExportPurchaseFKList, apiGetPayModelName, purchaseFKBatchCommitApi, purchaseFKApproveCommitApi } from '@/config/getData';
    import { notempty, sortBy, manualCheck,toFiexedFour, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';
    export default {
        // name: 'purchase_manage_FK_index',
        data () {
            return {
                FKlist_export:'FKlist_export',
                canAdd: false,
                showCommit: false,
                showApprove: false,
                loading: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                },
                form: {
                    supplier_no:'all',
                    pay_status: 'all',
                    pay_way_no: 'all',
                    can_verify: 'all',
                    applyer: '',
                    status: '',
                    xgd_no: '',
                    htd_no: '',
                    datetime: ''
                },
                orderData: {
                    title: [],
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                orderField: '',
                orderDirection: 'desc',
                canApproveArr: [{
                    label: '是否可审批',
                    value: 'all'
                },{
                    label: '是',
                    value: '1'
                },{
                    label: '否',
                    value: '0'
                }],
                buypayStatus: '',
                buypayStatusArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                fkfsStatus: '',
                fkfsStatusArr: [
                    {
                        label: '选择付款方式',
                        value: 'all'
                    }
                ],
                buy_pay_status:'all',
                amount: '0.000',
                checkamount: '0.000',
                multipleInfo:[],
                multipleSelection:[],
                gysArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ]
            };
        },
        components: {
            pagination
        },
        methods: {
            batchApprove() {
                if (this.multipleSelection.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.showApprove = true;
            },
            cancelApprove(){
                this.showApprove = false;
            },
            confirmApprove() {
                this.loading = true;
                purchaseFKApproveCommitApi(this, {
                    order_payment_nos: JSON.stringify(this.multipleSelection),
                    is_pass: this.approveDetail.isPass,
                    note: this.approveDetail.note
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Modal.info({
                            title: '审批结果',
                            content: `<pre>${res.message}</pre>`
                        });
                        this.getData();
                    } else {
                        this.$Modal.error({
                            title: '审批失败',
                            content: `<pre>${res.message}</pre>`
                        });
                    }
                    this.showApprove = false;
                    this.loading = false;
                });
            },
            batchCommit() {
                if (this.multipleSelection.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.showCommit = true;

            },
            cancelShowCommit() {
                this.showCommit = false;
            },
            confirmCommitOrder() {
                this.loading = true;
                purchaseFKBatchCommitApi(this, {
                    order_payment_nos: JSON.stringify(this.multipleSelection)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Modal.info({
                            title: '提交结果',
                            content: `<pre>${res.message}</pre>`
                        });
                        this.getData();
                    } else {
                        this.$Modal.error({
                            title: '提交失败',
                            content: `<pre>${res.message}</pre>`
                        });
                    }
                    this.showCommit = false;
                    this.loading = false;
                });
            },
            goToAdd () {
                util.openNewPage(this, 'purchase_manage_FK_add');
                this.$router.push({
                    name: 'purchase_manage_FK_add'
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['buy_pay_status','fkfs'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.buypayStatus = res.data.buy_pay_status;
                        let tmpObj = {};
                        for (let key in res.data.buy_pay_status) {
                            if (res.data.buy_pay_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.buy_pay_status[key]
                                };
                                this.buypayStatusArr.push(tmpObj);
                            }
                        }

                        //付款方式
                        this.fkfsStatus = res.data.fkfs;
                        let tmpObjfkfs = {};
                        for (let key in res.data.fkfs) {
                            if (res.data.fkfs.hasOwnProperty(key)) {
                                tmpObjfkfs = {
                                    value: key,
                                    label: res.data.fkfs[key]
                                };
                                this.fkfsStatusArr.push(tmpObjfkfs);
                            }
                        }

                    }
                });
            },
            toExport(){
                 apiExportPurchaseFKList(this, {
                    params: JSON.stringify(this.notempty({
                        // pageNum: this.currentPage,
                        // numPerPage: this.limit,
                        // orderField: this.orderField,
                        // orderDirection: this.orderDirection,
                        supplier_no: this.form.supplier_no == 'all'?'': this.form.supplier_no,
                        pay_status: this.form.pay_status == 'all'?'': this.form.pay_status,
                        pay_way_no: this.form.pay_way_no == 'all'?'': this.form.pay_way_no,
                        can_verify: this.form.can_verify == 'all'?'': this.form.can_verify,
                        order_payment_no: this.form.order_payment_no,
                        from_order_no: this.form.from_order_no,
                        create_user: this.form.create_user,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1]
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },

            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.order_payment_no))) {
                    this.multipleSelection.push(row.order_payment_no);
                    this.checkamount = this.add(this.checkamount, row.real_amount, 4);
                }
                if (!row.checked && this.multipleSelection.includes(row.order_payment_no)) {
                    let index = this.multipleSelection.indexOf(row.order_payment_no);
                    this.multipleSelection.splice(index, 1);
                    this.checkamount = this.subtract(this.checkamount, row.real_amount, 4);

                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },

            getData () {
                apiGetPurchaseFKList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        supplier_no: this.form.supplier_no == 'all'?'': this.form.supplier_no,
                        pay_status: this.form.pay_status == 'all'?'': this.form.pay_status,
                        pay_way_no: this.form.pay_way_no == 'all'?'': this.form.pay_way_no,
                        can_verify: this.form.can_verify == 'all'?'': this.form.can_verify,
                        order_payment_no: this.form.order_payment_no,
                        from_order_no: this.form.from_order_no,
                        create_user: this.form.create_user,
                        starttime: this.form.datetime[0],
                        endtime: this.form.datetime[1]
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                       this.orderData.data = res.data.list;
                       this.amount = res.data.amount;
                       this.totalnum = res.data.totalCount;
                       this.supperList = [
                            {
                                value: 'all',
                                label: '选择供应商'
                            }
                        ];
                        res.data.suppliers.forEach(item => {
                            item.value = item.gysbh;
                            item.label = item.gysmc;
                            this.supperList.push(item);
                        });

                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.order_payment_no)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });

                        if(this.multipleSelection.length == 0){
                            this.checkamount ='0.0000';
                        }

                       this.spinShow = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            judgeCanAdd() {
                apiGetPayModelName(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //判断是否是任务流创建人
                        isInCreaters(this, res.data, 0).then(res => {
                            if(res){
                                this.canAdd = true;
                            }else{
                                this.canAdd = false;
                            }
                        });
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
                this.getData();
            },
            reset () {
                this.form.supplier_no = 'all',
                this.form.pay_status = 'all',
                this.form.order_payment_no = '',
                this.form.from_order_no = '',
                this.form.datetime = '',
                this.form.create_user = '',
                this.form.pay_way_no = 'all',
                this.search();
            },
            datetime (time) {
                this.form.datetime = time;
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            }
        },
        created () {
            this.getStatus();
            this.judgeCanAdd();
            this.getData();
        }

    };
</script>
