<style>

</style>

<template>
    <div>
        <Row class="margin-top-10">
            <col span="24">
            <Card>
                <Form :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="salesRequisition.requisition_no" placeholder="输入单据编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" :value="salesRequisition.datetime" placeholder="选择创建时间" @on-change="changeDate" style="width:100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Select v-model="salesRequisition.requisition_status" @on-change="search">
                            <Option v-for="item in requisitionStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="salesRequisition.can_verify" @on-change="search">
                                <Option v-for="status in canApproveArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="salesRequisition.create_user_name" placeholder="输入创建人" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                        <Button type="primary" @click="batchApprove" style="margin-right: 20px;">审批</Button>
                    </Col>
                </Row>
                <el-table :data="requisitionList"  :row-class-name="tableRowClassName" ref="multipleTable" @select="selectOne"  @select-all="selectAll"  border style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column label="销售请购单编号" min-width="120">
                        <template slot-scope="scope">
                            <span style="color: rgb(45, 140, 240);cursor: pointer" @click="goToDetail(scope.row.requisition_no)">{{scope.row.requisition_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" sortable="custom" min-width="150"></el-table-column>
                    <el-table-column prop="total_num" label="请购商品总数" ></el-table-column>
                    <el-table-column label="创建人" >
                        <template slot-scope="scope">
                            <span>{{scope.row.create_user_no}} / {{scope.row.create_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="单据状态" sortable="custom" prop="requisition_status">
                        <template slot-scope="scope">
                            <span>{{requisitionStatusObj[scope.row.requisition_status] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="can_verify" label="是否可审批 " min-width="140">
                        <template slot-scope="scope">
                            <span> {{ scope.row.can_verify == '1' ? '是' : '否' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10" class="pagination-style"></pagination>
            </Card>
            </col>
        </Row>
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

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiAllStatus,purchaseManageRequisitionList, serviceXsckdBatchApproveApi } from '@/config/getData';
    export default {
        components: {
            pagination
        },
        data () {
            return {
                showApprove: false,
                loading: false,
                approveDetail: {
                    isPass: '1',
                    note: ''
                },
                requisitionStatusObj:{},
                salesRequisition: {
                    requisition_no: '',
                    requisition_status: 'all',
                    can_verify: 'all',
                    datetime: [],
                    create_user_name:'',
                },
                requisitionList: [{
                    requisition_no: '',
                    create_time: ':06:37',
                    total_num: 0,
                    note: '',
                    status: ''
                }],
                multipleSelection: [],
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
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc',
                requisitionStatus: [
                    {
                        label: '选择单据状态',
                        value: 'all'
                    }
                ]
            };
        },
        methods: {

            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.requisition_no))) {
                    this.multipleSelection.push(row.requisition_no);
                }
                if (!row.checked && this.multipleSelection.includes(row.requisition_no)) {
                    let index = this.multipleSelection.indexOf(row.requisition_no);
                    this.multipleSelection.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.requisitionList.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
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
                serviceXsckdBatchApproveApi(this, {
                    requisition_nos: JSON.stringify(this.multipleSelection),
                    is_pass: this.approveDetail.isPass,
                    note: this.approveDetail.note
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Modal.info({
                            title: '审批结果',
                            content: `<pre>${res.message}</pre>`
                        });
                    } else {
                        this.$Modal.error({
                            title: '审批失败',
                            content: `<pre>${res.message}</pre>`
                        });
                    }
                    this.multipleSelection = [];
                    this.getData();
                    this.showApprove = false;
                    this.loading = false;
                });
            },
            goToDetail (id) {
                util.openNewPage(this, 'service-sales-xsqgd-detail', {
                    param: id
                });
                this.$router.push({
                    name: 'service-sales-xsqgd-detail',
                    query: {
                        param: id
                    }
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['requisition_status'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.requisitionStatusObj = res.data.requisition_status;
                        let tmpObj = {};
                        for (let key in res.data.requisition_status) {
                            if (res.data.requisition_status.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.requisition_status[key]
                                };
                                this.requisitionStatus.push(tmpObj);
                            }
                        }

                    }
                });
            },
            getData () {
                // 请替换接口名称
                purchaseManageRequisitionList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        requisition_no: this.salesRequisition.requisition_no,
                        requisition_status: this.salesRequisition.requisition_status === 'all' ? '' : this.salesRequisition.requisition_status,
                        can_verify: this.salesRequisition.can_verify === 'all' ? '' : this.salesRequisition.can_verify,
                        start_time: this.salesRequisition.datetime[0],
                        end_time: this.salesRequisition.datetime[1],
                        create_user_name:this.salesRequisition.create_user_name,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalCount;
                        this.requisitionList = res.data.list;
                        this.$nextTick(() => {
                            this.requisitionList.forEach(row => {
                                if (this.multipleSelection.includes(row.requisition_no)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
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
                this.salesRequisition.requisition_no = '';
                this.salesRequisition.requisition_status = 'all';
                this.salesRequisition.datetime = [];
                this.salesRequisition.create_user_name = '';
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            },
            changeDate (time) {
                this.salesRequisition.datetime = time;
                this.search();
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
    };
</script>