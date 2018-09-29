<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Select v-model="orderInfo.brand_name" placeholder="请选择" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.brand_state" placeholder="请选择" @on-change="search">
                            <Option v-for="status in cpppStateArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.is_logo" placeholder="请选择" @on-change="search">
                            <Option v-for="status in isLogoArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.is_img" placeholder="请选择" @on-change="search">
                            <Option v-for="status in isPptpArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
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
                    <Button type="primary" @click="handleClick('', 'operate_product_brand_add')">添加</Button>
                    </Col>
                </Row>
                <el-table :data="orderData.data" border stripe style="text-align: center" max-height="570">
                    <el-table-column label="品牌编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick(scope.row.cpppbh, 'operate_product_brand_detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.cpppbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpppywmc" label="品牌英文名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌中文名称"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="logo" label="LOGO图片" >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.logo"></span>
                            <img :src="imgURL + scope.row.logo" v-else width="80%" style="border:1px solid #eee;margin-top:10px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="pptp" label="品牌图片">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.pptp"></span>
                            <img :src="imgURL + scope.row.pptp" v-else width="80%" style="border:1px solid #eee;margin-top:10px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="zstp" label="授权证书图片" >
                        <template slot-scope="scope">
                            <span v-if="!scope.row.zstp"></span>
                            <img :src=" imgURL + scope.row.zstp" v-else width="80%" style="border:1px solid #eee;margin-top:10px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="cppppx" label="品牌排序" ></el-table-column>
                    <el-table-column prop="cpppzt" label="品牌状态" width="100">
                        <template slot-scope="scope">
                            <span> {{ cpppState[scope.row.cpppzt] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpppms" label="品牌描述" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="display: block;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp:3;-webkit-box-orient: vertical;display: -webkit-box;" >{{ scope.row.cpppms }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <!--<Spin fix  v-if="spinShow">-->
            <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
            <!--<div>Loading</div>-->
        <!--</Spin>-->
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import util from '@/libs/util';
    import { apiAllStatus, apiGetProductBrandList, operateAllBrandsList } from '@/config/getData';
    import { notempty} from '@/config/mUtils';
    export default {
        name: 'operate_product_brand_index',
        data () {
            return {
                buttonShow: 'product_brand_index_add_button',
                imgURL: this.imgURL,
                orderInfo: {
                    brand_no: '',
                    brand_name: 'all',
                    brand_state: 'all',
                    is_logo: 'all',
                    is_img: 'all'
                },
                orderData: {
                    data: [
                        {cpppbh: '12121'}
                    ]
                },
                dateRange: '',
                orderStatus: '',
                orderStatusArr: [],
                spinShow: true,
                currentPage: 1,
                limit: 10,
                orderField: 'djrq',
                totalnum: 0,
                orderDirection: 'desc',
                brandArr: [
                    {
                        cpppbh: 'all',
                        cpppmc: '选择产品品牌',
                        cpppywmc: 'all'
                    }
                ],
                cpppState: [],
                cpppStateArr: [
                    {
                        label: '选择品牌状态',
                        value: 'all'
                    }
                ],
                isLogo: [],
                isLogoArr: [
                    {
                        label: '选择是否有LOGO',
                        value: 'all'
                    }
                ],
                isPptp: [],
                isPptpArr: [
                    {
                        label: '选择是否有品牌图片',
                        value: 'all'
                    }
                ]
            };
        },
        components: {
            pagination
        },
        methods: {
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path, argu);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getStatus () {
                /*获取产品品牌*/
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'all'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.brandArr.push(res.data.list[i]);
                        }
                    }
                });
                /*所有状态*/
                apiAllStatus(this, {
                    type: JSON.stringify(['cppp_state', 'is_logo', 'is_pptp' ])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.cpppState = res.data.cppp_state;
                        for (let key in res.data.cppp_state) {
                            if (res.data.cppp_state.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.cppp_state[key]
                                };
                                this.cpppStateArr.push(tmpObj);
                            }
                        }
                        this.isLogo = res.data.is_logo;
                        for (let key in res.data.is_logo) {
                            if (res.data.is_logo.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_logo[key]
                                };
                                this.isLogoArr.push(tmpObj);
                            }
                        }
                        this.isPptp = res.data.is_pptp;
                        for (let key in res.data.is_pptp) {
                            if (res.data.is_pptp.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.is_pptp[key]
                                };
                                this.isPptpArr.push(tmpObj);
                            }
                        }
                    }
                });
            },
            getData () {
                apiGetProductBrandList(this, {
                    params: JSON.stringify(this.notempty({
                        pageNum: this.currentPage,
                        numPerPage: this.limit,
                        cpppbh: this.orderInfo.brand_name === 'all' ? '' : this.orderInfo.brand_name,
                        cpppzt: this.orderInfo.brand_state === 'all' ? '' : this.orderInfo.brand_state,
                        is_logo: this.orderInfo.is_logo === 'all' ? '' : this.orderInfo.is_logo,
                        is_pptp: this.orderInfo.is_img === 'all' ? '' : this.orderInfo.is_img
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo.brand_name = 'all';
                this.orderInfo.brand_state = 'all';
                this.orderInfo.is_logo = 'all';
                this.orderInfo.is_img = 'all';
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
