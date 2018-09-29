<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.cust_no" placeholder="输入客户编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.status"  placeholder="请选择状态" @on-change="search">
                            <Option v-for="status in khIsDeleteArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.khlxbh"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in khlxStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.khlybh"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in khlyStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.phone" placeholder="输入手机号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.is_qyrz"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in qyrzStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <!-- <Col span="4">
                        <Select v-model="orderInfo.xykh_id"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in xyKhStateArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col> -->
                        <Col span="4">
                            <Select v-model="orderInfo.sskf"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.ssxs"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Row class="margin-bottom-10" v-auth="buttonShow">
                    <Col span="24">
                    <Button type="primary" @click="handleClick('', 'service-custom-newadd')">添加</Button>
                    <Button type="primary" @click="changeService" style="margin-left:10px;">客服转移</Button>
                    <Button type="primary" @click="changeSales" style="margin-left:10px;">销售转移</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border style="text-align: center" @sort-change="manualSort"  @selection-change="handleSelectionChange" max-height="570">
                    <el-table-column
                            type="selection"
                            width="55" v-if="is_true">
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="客户编号" prop="khbh" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.khbh, 'service-custom-detail')" type="text" size="small">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.khbh}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip prop="khmc" label="客户名称" sortable="custom" min-width="200"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="lxr" label="联系人" width="120"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="sjhm" label="手机号码" min-width="100"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="jf" label="积分" sortable="custom"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="khdjmc" label="客户等级" ></el-table-column>
                    <el-table-column  show-overflow-tooltip label="VIP用户" width="120">
                        <template slot-scope="scope">
                            <span> {{is_vip[scope.row.is_vip]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="免运用户" width="120">
                        <template slot-scope="scope">
                            <span> {{ is_my[scope.row.is_my] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip prop="can_amount" label="账户余额" sortable="custom" width="120"></el-table-column>
                    <el-table-column  show-overflow-tooltip label="客户类型" min-width="100">
                        <template slot-scope="scope">
                            <span> {{khlxStatus[scope.row.khlxbh]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="客户来源" min-width="100">
                        <template slot-scope="scope">
                            <span> {{khlyStatus[scope.row.khlybh]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="企业认证">
                        <template slot-scope="scope">
                            <span> {{qyrzStatus[scope.row.is_qyrz]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip label="状态" >
                        <template slot-scope="scope">
                            <span> {{kh_is_deleted[scope.row.is_deleted]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  show-overflow-tooltip prop="barq" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="sskf" label="所属客服" width="120"></el-table-column>
                    <el-table-column  show-overflow-tooltip prop="ssxs" label="所属销售" width="120"></el-table-column>

                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <!--客服转移弹框-->
        <Modal v-model='serviceChangeModal' :mask-closable=false :width="400">
            <h3 slot="header">客服转移</h3>
            <Form :model="serviceChange">
                <FormItem label="即将要绑定的客服：" style="margin:0;">
                    <Select v-model="serviceChange.service"  placeholder="请选择" style="width:200px;" filterable>
                        <Option v-for="staff in allKf" :value="staff.czyg_ygbh" :key="staff.czyg_ygbh">{{ staff.czyg }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel('service')">取消</Button>
                <Button type="primary" @click="changesSure('service')">确定</Button>
            </div>
        </Modal>
        <Modal v-model='salesChangeModal' :mask-closable=false :width="400">
            <h3 slot="header">销售转移</h3>
            <Form :model="salesChange">
                <FormItem label="即将要绑定的销售：" style="margin:0;">
                    <Select v-model="salesChange.sales"  placeholder="请选择" style="width:200px;" filterable>
                        <Option v-for="staff in all_Sales" :value="staff.ygbh" :key="staff.ygbh">{{ staff.ygxm }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel('sales')">取消</Button>
                <Button type="primary" @click="changesSure('sales')">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiAllStatus, apiCustomerInfoList, apiCustomerAllStaff, apiCustomerStaffTransfer } from '@/config/getData';
    import { notempty, sortBy,manualCheck } from '@/config/mUtils';
    import Cookies from 'js-cookie';
    //    import util from '@/libs/util';
    export default {
        name: 'service-custom_info_index',
        data () {
            return {
                buttonShow: 'service-custom-info-button',
                orderInfo: {
                    cust_no: '',
                    customer: '',
                    xyht: '',
                    status: 'all',
                    phone: '',
                    is_qyrz: 'all',
                    xykh_id: 'all',
                    khlxbh: 'all',
                    khlybh: 'all',
                    sskf: 'all',
                    ssxs: 'all',
                    paid_status: '',
                    saller: '',
                    sallerArr: '',
                    datetime: '',
                    appointKf:[{
                        value: 'all',
                        label: '选择所属客服'
                    }],
                    allSales:[{
                        value: 'all',
                        label: '选择所属销售'
                    }],
                },
                orderData: {
                    title: [],
                    data: []
                },
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                ajaxHistoryData: [],
                dateRange: '',
                orderStatus: '',
                payStatus: '',
                kh_is_deleted: '',
                khIsDeleteArr: [
                    {
                        label: '选择状态',
                        value: 'all'
                    }
                ],
                is_vip: '',
                is_my: '',
                khlxStatus:'',
                khlyStatus:'',
                khlxStatusArr: [
                    {
                        label: '选择客户类型',
                        value: 'all'
                    }
                ],
                khlyStatusArr: [
                    {
                        label: '选择客户来源',
                        value: 'all'
                    }
                ],
                qyrzStatus: '',
                qyrzStatusArr: [
                    {
                        label: '选择企业认证',
                        value: 'all'
                    }
                ],
                spinShow: true,
                multipleSelection: [],
                multipleCustomer: [],
                serviceChangeModal: false,
                salesChangeModal: false,
                serviceChange: {
                    service: ''
                },
                salesChange: {
                    sales: ''
                },
                sort: {
                    order: '',
                    key: ''
                },
                orderField: '',
                orderDirection: 'desc',
                allKf: '',
                all_Sales: '',
                xy_kh_state: '',
                xyKhStateArr: [
                    {
                        label: '选择新阳客户绑定',
                        value: 'all'
                    }
                ],
                is_true: true,
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            handleSelectionChange (val) {
                this.multipleCustomer = [];
                this.multipleSelection = val;
                for (let i in this.multipleSelection) {
                    this.multipleCustomer.push(this.multipleSelection[i].khbh);
                }
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xshtdzt', 'is_qyrz', 'kh_is_deleted', 'is_vip', 'is_my', 'xy_kh_state','khly','khlx'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.khlxStatus = res.data.khlx;
                        this.khlyStatus = res.data.khly;


                        for (let key in res.data.khlx) {
                            if (res.data.khlx.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khlx[key]
                                };
                                this.khlxStatusArr.push(tmpObj);
                            }
                        }
                        for (let key in res.data.khly) {
                            if (res.data.khly.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khly[key]
                                };
                                this.khlyStatusArr.push(tmpObj);
                            }
                        }



                        this.qyrzStatus = res.data.is_qyrz;

                        for (let key in res.data.is_qyrz) {
                            if (res.data.is_qyrz.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_qyrz[key]
                                };
                                this.qyrzStatusArr.push(tmpObj);
                            }
                        }
                        this.kh_is_deleted = res.data.kh_is_deleted;
                        for (let key in res.data.kh_is_deleted) {
                            if (res.data.kh_is_deleted.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.kh_is_deleted[key]
                                };
                                this.khIsDeleteArr.push(tmpObj);
                            }
                        }
                        this.is_vip = res.data.is_vip;
                        this.is_my = res.data.is_my;
                        this.xy_kh_state = res.data.xy_kh_state;
                        for (let key in res.data.xy_kh_state) {
                            if (res.data.xy_kh_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xy_kh_state[key]
                                };
                                this.xyKhStateArr.push(tmpObj);
                            }
                        }
                    }
                });
                //所有客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                            type: 'all_customer_service'
                        })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.allKf = res.data.list;
                    }
                });
                //所有销售
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.all_Sales = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ygbh;
                            item.label = item.ygxm;
                            this.orderInfo.allSales.push(item);
                        });
                    }
                });

                //指定客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        //this.appointKf = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.czyg_ygbh;
                            item.label = item.czyg;
                            this.orderInfo.appointKf.push(item);
                        });
                    }
                });
            },
            getData () {
                apiCustomerInfoList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        khbh: this.orderInfo.cust_no,
                        khmc: this.orderInfo.customer,
                        is_deleted: this.orderInfo.status == 'all' ? '' : this.orderInfo.status,
                        sjhm: this.orderInfo.phone,
                        is_qyrz: this.orderInfo.is_qyrz == 'all' ? '' : this.orderInfo.is_qyrz,
                        xy_kh: this.orderInfo.xykh_id == 'all' ? '' : this.orderInfo.xykh_id,
                        czyg_ygbh: this.orderInfo.sskf == 'all' ? '' : this.orderInfo.sskf,
                        ygbh: this.orderInfo.ssxs == 'all' ? '' : this.orderInfo.ssxs,
                        khlybh: this.orderInfo.khlybh == 'all' ? '' : this.orderInfo.khlybh,
                        khlxbh: this.orderInfo.khlxbh == 'all' ? '' : this.orderInfo.khlxbh,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.spinShow = false;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.cust_no = '';
                this.orderInfo.customer = '';
                this.orderInfo.status = 'all';
                this.orderInfo.phone = '';
                this.orderInfo.is_qyrz = 'all';
                this.orderInfo.xykh_id = 'all';
                this.orderInfo.sskf = 'all';
                this.orderInfo.ssxs = 'all';
                this.orderInfo.khlxbh = 'all';
                this.orderInfo.khlybh = 'all';
                this.search();
            },
            datetime (time) {
                this.orderInfo.datetime = time;
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
            },
            /*客户转移*/
            changeService () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择要转移的客户');
                } else {
                    this.serviceChangeModal = true;
                }
            },
            changeSales () {
                if (this.multipleSelection.length == 0) {
                    this.$Message.error('请选择要转移的客户');
                } else {
                    this.salesChangeModal = true;
                }
            },
            cancel (name) {
                if (name === 'service') {
                    this.serviceChangeModal = false;
                } else if (name === 'sales') {
                    this.salesChangeModal = false;
                }
            },
            changesSure (name) {
                if (name === 'service') {
                    apiCustomerStaffTransfer(this, {
                        params: JSON.stringify({
                            info: this.multipleCustomer,
                            ygbh: this.serviceChange.service,
                            type: 'customer_service'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.serviceChangeModal = false;
                            this.getData();
                        }
                    });
                } else if (name === 'sales') {
                    apiCustomerStaffTransfer(this, {
                        params: JSON.stringify({
                            info: this.multipleCustomer,
                            ygbh: this.salesChange.sales,
                            type: 'sale'
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.salesChangeModal = false;
                            this.getData();
                        }
                    });
                }

            }
        },
        created () {
            this.getStatus();
            this.getData();
            this.is_true = manualCheck(this.buttonShow);
            
        }
    };
</script>
