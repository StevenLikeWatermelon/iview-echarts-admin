<style>
    .modal-margin .ivu-form-item {
        margin-bottom: 8px;
    }
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row >
            <col span="24">
                <Card>
                    <Form :label-width="120" class="model-style">
                        <Row>
                            <Col span="4">
                                <Input v-model="searchObj.customNum" placeholder="输入客户编号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchObj.customName" placeholder="输入客户名称" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="searchObj.invoinceType" placeholder="请选择类型" @on-change="search">
                                    <Option v-for="item in invoinceTypeArr" :value="item.value" :label="item.label" :key="item.value" ></Option>
                                </Select>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchObj.telephoneNum"  placeholder="输入手机号码" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Input v-model="searchObj.taxpayerNum" placeholder="输入纳税人识别号" @on-enter="search"></Input>
                            </Col>
                            <Col span="4">
                                <Select v-model="searchObj.auditStatus" placeholder="请选择类型" @on-change="search">
                                    <Option v-for="item in auditStatusArr" :value="item.value" :label="item.label" :key="item.value" ></Option>
                                </Select>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
            </Row>
            <Row class="margin-top-10 margin-pag-botm">
                <Col span="24">
                    <Card>
                    <!--<Row>-->
                        <!--<Col span="24" style="margin-bottom: 10px;">-->
                            <!--<Button type="primary" style="float: left;" @click="addInvoince()" v-auth="addAuth">添加</Button>-->
                        <!--</Col>-->
                    <!--</Row>-->
                    <el-table :data="salesData" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                        <el-table-column prop="swdjzh" label="纳税人识别号">
                            <template slot-scope="scope">
                              <span style="color: #57a3f3;cursor: pointer" @click="goDetail(scope.row.swdjzh, scope.row.sfsh, scope.row.id)">{{scope.row.swdjzh}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="khbh" label="客户编号" width="120"></el-table-column>
                        <el-table-column prop="sqrq" label="申请时间"  sortable="custom" width="150"></el-table-column>
                        <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="lxr" label="联系人" ></el-table-column>
                        <el-table-column prop="sjhm" label="手机号码" width="100"></el-table-column>
                        <el-table-column prop="fplxbh" label="发票类型"  sortable="custom" width="150"></el-table-column>
                        <el-table-column prop="displaySfsh" label="审核状态" sortable="custom" width="100"></el-table-column>
                    </el-table>
                    <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
                </Card>
            </col>
        </Row>
        <Modal v-model="showAdd" title="发票信息" class="modal-margin">
            <Form ref="addInvoinceForm" :model="addInvoinceForm" :rules="InvoinceFormRule" :label-width="95" :show-message="false">
                <FormItem prop="customNum" label="客户编号">
                    <Input type="text" v-model="addInvoinceForm.customNum" placeholder="客户编号">
                    </Input>
                </FormItem>
                <FormItem prop="invoinceType" label="发票类型">
                    <Select v-model="addInvoinceForm.invoinceType" style="width:200px;" placeholder="请选择类型" @on-change="changeRequire">
                        <Option v-for="item in invoinceTypeArrForm" :value="item.value" :label="item.label" :key="item.value" ></Option>
                    </Select>
                </FormItem>
                <FormItem prop="invoinceStart" label="发票抬头">
                    <Input type="text" v-model="addInvoinceForm.invoinceStart" placeholder="发票抬头">
                    </Input>
                </FormItem>
                <FormItem prop="taxpayerNum" label="纳税人识别码">
                    <Input type="text" v-model="addInvoinceForm.taxpayerNum" placeholder="纳税人识别码">
                    </Input>
                </FormItem>
                <FormItem prop="registerAdressDetail" label="注册地址"  class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.registerAdressDetail" placeholder="详细地址">
                    </Input>
                </FormItem>
                <FormItem prop="registerPhone" label="注册电话" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.registerPhone" placeholder="注册电话">
                    </Input>
                </FormItem>
                <FormItem prop="openAccountBank" label="开户银行" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.openAccountBank" placeholder="开户银行">
                    </Input>
                </FormItem>
                <FormItem prop="bankAccount" label="银行账号" :rules="{required: isRequired, trigger: 'blur' }" class="delete-class">
                    <Input type="text" v-model="addInvoinceForm.bankAccount" placeholder="银行账号">
                    </Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancelAddInvoince()">取消</Button>
                <Button type="primary"  @click="confirmAddInvoince('addInvoinceForm')" :loading="loading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import pagination from '../../../common/pagination.vue';
    import { apiInvoiceList, apiAllStatus, addEditInvoince, apiMapDetail } from '@/config/getData';
    export default {
        name: 'goods_analyze',
        components: {
            pagination
        },
        data () {
            return {
                addAuth: 'service-invoice-add-button',
                showAdd: false,
                loading: false,
                isRequired: true,
                addInvoinceForm: {
                    customNum: '',
                    invoinceType: 1,
                    invoinceStart: '',
                    taxpayerNum: '',
                    registerAdressSelect: [],
                    registerAdressDetail: '',
                    registerPhone: '',
                    openAccountBank: '',
                    bankAccount: '',
                },
                addEditInvoinceAddressArr: [],
                invoinceTypeArrForm: [],
                InvoinceFormRule: {
                    customNum: [{ required: true, trigger: 'blur' }],
                    invoinceStart: [{ required: true, trigger: 'blur' }],
                    taxpayerNum: [{ required: true, trigger: 'blur' }],
                },
                searchObj: {
                    customNum: '',
                    customName:'',
                    invoinceType: '0',
                    taxpayerNum: '',
                    telephoneNum: '',
                    auditStatus: 'all'
                },
                invoinceTypeObj: {},
                invoinceTypeArr: [{
                    label: '选择发票类型',
                    value: '0'
                }],
                auditStatusObj: {},
                auditStatusArr: [{
                    label: '选择审核状态',
                    value: 'all'
                }],
                salesData: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: 'sqrq',
                orderDirection: 'desc',

            };
        },
        methods: {
            getStatus() {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx', 'sfsh'])
                }).then(res => {
                    let tmpObj ={};
                    let firstValue = true;
                    this.invoinceTypeObj = res.data.fplx;
                    this.auditStatusObj = res.data.sfsh;

                    for (let key in res.data.fplx) {
                        if (res.data.fplx.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.fplx[key]
                            };
                            if (firstValue) {
                                this.addInvoinceForm.invoinceType = key;
                                this.changeRequire(key);
                                firstValue = false;
                            }
                            this.invoinceTypeArr.push(tmpObj);
                            this.invoinceTypeArrForm.push(tmpObj);
                        }
                    }
                    for (let key in res.data.sfsh) {
                        if (res.data.sfsh.hasOwnProperty(key)) {
                            tmpObj = {
                                value: key,
                                label: res.data.sfsh[key]
                            };
                            this.auditStatusArr.push(tmpObj);
                        }
                    }
                    this.getData();
                });
            },
            reset () {
                this.searchObj = {
                    customNum: '',
                    customName:'',
                    invoinceType: '0',
                    taxpayerNum: '',
                    telephoneNum: '',
                    auditStatus: 'all'
                };
                this.search();
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            addInvoince() {
                this.showAdd = true;
            },
            getData () {
                apiInvoiceList(this, {
                    params: JSON.stringify({
                        khbh: this.searchObj.customNum,
                        khmc: this.searchObj.customName,
                        fplxbh: this.searchObj.invoinceType == '0' ? '' : this.searchObj.invoinceType,
                        swdjzh: this.searchObj.taxpayerNum,
                        sjhm: this.searchObj.telephoneNum,
                        sfsh: this.searchObj.auditStatus == 'all' ? '' :  this.searchObj.auditStatus,
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.fplxbh = this.invoinceTypeObj[item.fplxbh] ? this.invoinceTypeObj[item.fplxbh] : '--';
                            item.displaySfsh = this.auditStatusObj[item.sfsh] ? this.auditStatusObj[item.sfsh] : '--';
                        });
                        this.salesData = res.data.list
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            goDetail (queryNumber, status, id) {
                let argu = { queryNumber: queryNumber, status: status, id: id };
                this.$router.push({
                    name: 'service-invoice-set-detail',
                    query: argu
                });
            },
            cancelAddInvoince() {
                this.showAdd = false;
            },
            confirmAddInvoince(name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('表单校验错误,请检查');
                        return;
                    } else {
                        this.loading = true;
                        addEditInvoince(this, {
                            params: JSON.stringify({
                                khbh: this.addInvoinceForm.customNum,
                                fplxbh: this.addInvoinceForm.invoinceType,
                                fptt: this.addInvoinceForm.invoinceStart,
                                swdjzh: this.addInvoinceForm.taxpayerNum,
                                kpdz: this.addInvoinceForm.registerAdressDetail,
                                kpdhhm: this.addInvoinceForm.registerPhone,
                                jbkhyhmc: this.addInvoinceForm.openAccountBank,
                                jbkhzh: this.addInvoinceForm.bankAccount,
                                sfmr: 1,
                            })
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message && this.$Message.success(res.message);
                                this.loading = false;
                                this.showAdd = false;
                            } else {
                                this.$Message && this.$Message.error(res.message);
                                this.loading = false;
                            }
                        }, error => {
                            this.$Message && this.$Message.error(res.message);
                            this.loading = false;
                        });
                    }
                });
            },
            changeRequire (value) {
                let allrequired = document.getElementsByClassName('delete-class');
                let i = 0;
                if (value == 1 && allrequired && allrequired.length) { //目前发票类型写死1，与后端已沟通不改样式id
                    for (i = 0; i < allrequired.length; i++) {
                        allrequired[i].setAttribute('class', 'delete-class ivu-form-item ivu-form-item-required');
                    }
                    this.isRequired = true;
                } else {
                    if (allrequired && allrequired.length) {
                        for (i = 0; i < allrequired.length; i++) {
                            allrequired[i].setAttribute('class', 'delete-class ivu-form-item');
                        }
                        this.isRequired = false;
                    }
                }
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
                    this.addEditInvoinceAddressArr = res.data;
                });
            },
            getAreaSeletced(value, selected) {
                this.addInvoinceForm.registerAdressDetail = '';
                selected.forEach(item => {
                    this.addInvoinceForm.registerAdressDetail += item.label;
                });
            }
        },
        created () {
            // 初始化日期范围/当前页,关闭日期共享
            this.$store.commit('broadcastShareState', false);
            this.$store.commit('changeCurrentTab', 2);
            this.getStatus();
            this.getMapDetail();
        }
    };
</script>