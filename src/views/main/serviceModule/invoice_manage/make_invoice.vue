 min-width="100"<style>
    
</style>

<template>
    <div style="position: relative" class="diy-opcity">
        <Row >
            <col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="stats-bars"></Icon>
                        开票管理
                    </p>
                    <Form :model="billingInfo" :label-width="100" >
                        <Row>
                            <Col span="6">
                                <FormItem label="开票单号：" style="margin:0;">
                                    <Input v-model="billingInfo.djbh" placeholder="请输入开票单据编号" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户编号：" style="margin:0;">
                                    <Input v-model="billingInfo.khbh" placeholder="请输入客户编号" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="客户名称：" style="margin:0;">
                                    <Input v-model="billingInfo.khmc" placeholder="请输入客户名称" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="手机号码：" style="margin:0;">
                                    <Input v-model="billingInfo.khsj" placeholder="请输入手机号码" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style="margin-top: 20px;">
                            <Col span="6">
                                <FormItem label="发票类型：" style="margin:0;">
                                    <Select v-model="billingInfo.fplx" placeholder="请选择类型">
                                        <Option v-for="status in fplxStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="开票状态：" style="margin:0;">
                                    <Select v-model="billingInfo.kpzt" placeholder="请选择状态">
                                        <Option v-for="status in kpztStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="6" style="text-align: center;margin-bottom:0;">
                                <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                                <Button type="default" @click="reset">重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <el-table :data="billingData.data" border stripe style="text-align: center" @sort-change="manualSort">
                    <el-table-column label="开票单编号" sortable="custom" width="120">
                    <template slot-scope="scope">
                        <span  @click="handleClick(scope.row.djbh, 'service-make-invoice-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="申请时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="khbh" label="客户编号" sortable="custom" width="120"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" ></el-table-column>
                    <el-table-column prop="khsj" label="手机号码" min-width="100"></el-table-column>
                    <el-table-column prop="fplx" label="发票类型">
                        <template slot-scope="scope">
                        <span> {{fplxStatus[scope.row.fplx]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="kpze" label="开票总额" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="kpzt" label="开票状态" >
                        <template slot-scope="scope">
                        <span> {{kpztStatus[scope.row.kpzt]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="kddh" label="快递单号"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage"></pagination>
               </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import searchData from '../../../common/search.vue';
    import pagination from '../../../common/pagination.vue';
    import { apiBillingList,apiAllStatus } from '@/config/getData';
    import {getStore, setStore, sortBy} from '@/config/mUtils';
    export default {
        components: {
            searchData,
            pagination
        },
        data () {
            return {
                billingInfo: {
                    djbh: '',
                    khbh: '',
                    khmc: '',
                    khsj: '',
                    fplx: 'all',
                    kpzt: 'all'
                },
                billingData: {
                    title: [],
                    data: []
                },
                currentPage: 1,
                limit: 10,
                orderField: 'djbh',
                totalnum: 0,
                orderDirection: 'desc',
                fplxStatus: '',
                fplxStatusArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ],
                kpztStatus: '',
                kpztStatusArr: [
                    {
                        label: '全部',
                        value: 'all'
                    }
                ]
            };
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['fplx', 'kpzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.fplxStatus = res.data.fplx;
                        let tmpObj = {};
                        for (let key in res.data.fplx) {
                            if (res.data.fplx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.fplx[key]
                                };
                                this.fplxStatusArr.push(tmpObj);
                            }
                        }
                        this.kpztStatus = res.data.kpzt;
                        for (let key in res.data.kpzt) {
                            if (res.data.kpzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.kpzt[key]
                                };
                                this.kpztStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiBillingList(this, {
                    params: JSON.stringify({
                        djbh: this.billingInfo.djbh,
                        khbh: this.billingInfo.khbh,
                        khmc: this.billingInfo.khmc,
                        fplx: this.billingInfo.fplx === 'all' ? '' : this.billingInfo.fplx,
                        kpzt: this.billingInfo.kpzt === 'all' ? '' : this.billingInfo.kpzt,
                        khsj: this.billingInfo.khsj,
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.billingData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.billingInfo.djbh = '';
                this.billingInfo.khbh = '';
                this.billingInfo.khmc = '';
                this.billingInfo.fplx = 'all';
                this.billingInfo.kpzt = 'all';
                this.billingInfo.khsj = '';
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
            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>