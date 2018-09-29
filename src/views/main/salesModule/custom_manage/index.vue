<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="khInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="khInfo.khbh" placeholder="输入客户编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="khInfo.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="khInfo.is_deleted" placeholder="请选择客户状态" @on-change="search">
                            <Option v-for="status in custom_statusList" :value="status.key" :key="status.key">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="khInfo.sjhm" placeholder="输入手机号码" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="khInfo.is_qyrz" placeholder="请选择认证状态"  @on-change="search">
                            <Option v-for="status in qyrzStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <!-- <Col span="4">
                        <Select v-model="khInfo.xy_kh_id" placeholder="选择新阳客户绑定状态" >
                            <Option v-for="status in xykh_statusList" :value="status.key" :key="status.key">{{ status.label }}</Option>
                        </Select>
                        </Col> -->
                        <Col span="4">
                         <Select v-model="khInfo.czyg_ygbh" placeholder="" filterable @on-change="search">
                            <Option v-for="kf in kfList" :value="kf.user_no" :key="kf.user_no">{{ kf.user_name }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="khInfo.ygbh" placeholder="" filterable @on-change="search">
                            <Option v-for="yg in xsList" :value="yg.user_no" :key="yg.user_no">{{ yg.user_name }}</Option>
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
                <el-table :data="khData.data" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column label="客户编号" prop="khbh" sortable="custom" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.khbh, 'custom_manage_detail')" style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.khbh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="czyg_table" label="所属客服" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="xsyg_table" label="所属销售"  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sjhm" label="手机号码" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="lxr" label="联系人" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="is_vip" label="是否VIP" width="100">
                        <template slot-scope="scope">
                            <span> {{isVip[scope.row.is_vip]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_my" label="是否免运" width="100">
                        <template slot-scope="scope">
                            <span> {{isMy[scope.row.is_my]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_qyrz" label="企业认证" width="100">
                        <template slot-scope="scope">
                            <span> {{qyrzStatus[scope.row.is_qyrz]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="jf" label="积分" sortable="custom" width="100"></el-table-column>
                    <el-table-column prop="khdjmc" label="客户等级" width="100"></el-table-column>
                    <el-table-column prop="is_deleted" label="状态" width="100">
                        <template slot-scope="scope">
                            <span> {{khisDeleted[scope.row.is_deleted]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="barq" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <!-- <el-table-column prop="xy_kh_id" label="新阳客户ID"></el-table-column> -->
                </el-table>
                <pagination :current= "currentPage" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { apiCustommanageList, apiAllStatus, apiGetsalesService } from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'custom-manage-index',
        components: {
            pagination
        },
        data () {
            return {
                khInfo: {
                    khbh: '',
                    khmc: '',
                    is_deleted: 'all',
                    sjhm: '',
                    is_qyrz: 'all',
                    xy_kh_id: 'all',
                    czyg_ygbh: 'all',
                    ygbh: 'all'
                },
                custom_statusList: [
                    {
                        key: 'all',
                        label: '选择客户状态'
                    },
                    {
                        key: 'yes',
                        label: '启用'
                    },
                    {
                        key: 'no',
                        label: '停用'
                    }
                ],
                qyrzStatus: '',
                qyrzStatusArr: [
                    {
                        label: '选择企业认证状态',
                        value: 'all'
                    }
                ],
                xykh_statusList: [
                    {
                        key: 'all',
                        label: '全部'
                    },
                    {
                        key: 'yes',
                        label: '有'
                    },
                    {
                        key: 'no',
                        label: '无'
                    }
                ],
                khData: {
                    title: [],
                    data: []
                },
                totalnum: 0,
                limit: 10,
                currentPage: 1,
                kfList: [
                    {
                        depart_name:"全部",
                        id:"全部",
                        user_name:"选择所属客服",
                        user_no:"all"
                    }
                ],
                xsList: [
                    {
                        depart_name:"全部",
                        id:"全部",
                        user_name:"选择所属销售",
                        user_no:"all"
                    }
                ]
            };
        },

        methods: {
            handleClick(khbh, path) {
                let argu = { khbh };
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['is_qyrz', 'kh_is_deleted', 'is_vip', 'is_my'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.qyrzStatus = res.data.is_qyrz;
                        let tmpObj = {};
                        for (let key in res.data.is_qyrz) {
                            if (res.data.is_qyrz.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_qyrz[key]
                                };
                                this.qyrzStatusArr.push(tmpObj);
                            }
                        }
                        this.khisDeleted = res.data.kh_is_deleted;
                        this.isVip = res.data.is_vip;
                        this.isMy = res.data.is_my;
                    }
                });
                apiGetsalesService(this, {
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        if (this.kfList.length <= 1) {
                            this.kfList = this.kfList.concat(res.data.list.service_datas);
                        }
                        this.xsList = this.xsList.concat(res.data.list.sales_datas);
                    }
                });
            },
            getData () {
                apiCustommanageList(this, {
                    params: JSON.stringify({
                        khbh: this.khInfo.khbh,
                        khmc: this.khInfo.khmc,
                        is_deleted: this.khInfo.is_deleted == 'all' ? '' : this.khInfo.is_deleted,
                        sjhm: this.khInfo.sjhm,
                        is_qyrz: this.khInfo.is_qyrz == 'all' ? '' : this.khInfo.is_qyrz,
                        xy_kh_id: this.khInfo.xy_kh_id == 'all' ? '' : this.khInfo.xy_kh_id,
                        czyg_ygbh: this.khInfo.czyg_ygbh == 'all' ? '' : this.khInfo.czyg_ygbh,
                        ygbh: this.khInfo.ygbh == 'all' ? '' : this.khInfo.ygbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.totalnum = res.data.totalnum;
                        this.originData = res.data.list;
                        this.khData.data = this.originData.slice(0, this.limit);
                    }
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.khData.data = this.originData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.originData.sort(sortBy(column.prop, isDec));
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.khInfo.khbh = '';
                this.khInfo.khmc = '';
                this.khInfo.is_deleted = 'all';
                this.khInfo.sjhm = '';
                this.khInfo.is_qyrz = 'all';
                this.khInfo.xy_kh_id = 'all';
                this.khInfo.czyg_ygbh = 'all';
                this.khInfo.ygbh = 'all';
                this.search();
            },

        },

        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
