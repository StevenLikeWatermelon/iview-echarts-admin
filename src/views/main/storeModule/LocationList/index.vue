<style>
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :label-width="100" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="locationSearch.product_model_no" placeholder="输入商品型号编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.cpppbh"  placeholder="请选择产品品牌" filterable @on-change="search">
                            <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.cpmc" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.cpxh" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.cpdhh" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="locationSearch.update_user" placeholder="输入更新人" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="locationSearch.store_no"  filterable @on-change="getAllAreas">
                            <Option v-for="item in allStores" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="areaSelectDisplay">
                        <Select v-model="locationSearch.area_no"  filterable @on-change="getAllSeats">
                            <Option v-for="item in allAreas" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4" v-if="seatSelectDisplay">
                        <Select v-model="locationSearch.seat_no"  filterable @on-change="search">
                            <Option v-for="item in allSeats" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择更新时间" :value='locationSearch.timeRange' style="width: 100%;" @on-change="changeDate"></DatePicker>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="24" style="margin-bottom: 10px;" v-auth="allButtonAuth">
                    <Button type="primary" @click="seatsTmpExport()" style="margin-left: 10px;">导入模板下载</Button>
                    <Upload :action="importApi" name="file" :format="['csv']" :on-success="handleSuccess" :show-upload-list="false" style="margin-right:0;">
                        <Button type="ghost" icon="ios-cloud-upload-outline">导入</Button>
                    </Upload>
                    <Button type="primary" @click="getData(1)" style="margin-left: 10px;">导出</Button>
                </Col>
                <el-table :data="goodsList" border stripe style="text-align: center" @sort-change="manualSort" max-height="570">
                    <el-table-column prop="product_model_no" label="商品型号编号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="store_name" label="仓库"  min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area_name" label="库区" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="seat_name" label="库位" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="update_user_name" label="更新人" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.update_user_no}}/{{scope.row.update_user_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_time" label="更新时间" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <Modal v-model="showModal" title="导入结果">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
                            <Row>
                                <Col span="24">
                                    <FormItem label="导入成功：">
                                        <span>{{importInfo.success}}条</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="导入失败：">
                                        <span>{{importInfo.fail}}条</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="cancelShowModal">确定</Button>
                <Button type="primary" @click="confirmExportFailedList">导出失败数据</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import util from '@/libs/util';
    import {apiAllBrands, apiGetAllStorageList, apiGetAllAreaList, apiGetAllSeatList, getAllGoodsSeats, apiExportSeatTmp, apiImportSeats, apiExportSeatsTable, apiExportFailedLocation} from '@/config/getData';
    import {setToken} from '@/config/mUtils';
    export default {
        data () {
            return {
                showSpin: false,
                showModal: false,
                areaSelectDisplay: false,
                seatSelectDisplay: false,
                failedData: [],
                importInfo: {
                    success: 0,
                    fail: 0
                },
                locationSearch: {
                    product_model_no: '',
                    cpppbh: 'all',
                    cpmc: '',
                    cpxh: '',
                    cpdhh: '',
                    update_user: '',
                    store_no:'all',
                    area_no:'all',
                    seat_no:'all',
                    timeRange: [],
                },
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                currentStoreNo: '',
                allBrands: [{
                    cpppbh: 'all',
                    cpppmc: '选择产品品牌'
                }],
                allStores: [{
                    value: 'all',
                    label: '选择仓库'
                }],
                allAreas: [],
                allSeats: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                orderDirection: 'desc',
                orderField: '',
                goodsList: [],
                allButtonAuth: 'goods_location_index_all_button'
            }
        },
        components: {
            pagination
        },
        methods: {
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = this.allBrands.concat(res.data);
                    }
                })
            },
            getAllStores () {
                apiGetAllStorageList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            this.allStores.push({
                                value: item.store_no,
                                label: item.store_name
                            });
                        });
                    }
                });
            },
            getAllAreas (value) {
                this.locationSearch.area_no = 'all';
                this.locationSearch.seat_no = 'all';
                this.seatSelectDisplay = false;
                this.areaSelectDisplay = false;

                if (value == 'all') {
                    this.search();
                } else {
                    apiGetAllAreaList(this, {
                        store_no: value
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.currentStoreNo = value;
                            this.allAreas = [{
                                value: 'all',
                                label: '选择所属库区'
                            }];
                            res.data.forEach(item => {
                                this.allAreas.push({
                                    value: item.area_no,
                                    label: item.area_name
                                });
                            });
                            this.areaSelectDisplay = true;
                            this.search();
                        }
                    });
                }
            },
            getAllSeats (value) {
                this.locationSearch.seat_no = 'all';
                this.seatSelectDisplay = false;

                if (value == 'all') {
                    this.search();
                } else {
                    apiGetAllSeatList(this, {
                        store_no: this.currentStoreNo,
                        area_no: value
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.allSeats = [{
                                value: 'all',
                                label: '选择所属库位'
                            }];
                            res.data.forEach(item => {
                                this.allSeats.push({
                                    value: item.seat_no,
                                    label: item.seat_name
                                });
                            });
                            this.seatSelectDisplay = true;
                            this.search();
                        }
                    });
                    
                }
                
            },
            getData(isExport) {
                let tmpObj = {
                    pageNum: this.currentPage,
                    numPerPage: this.limit,
                    orderField: this.orderField,
                    orderDirection: this.orderDirection,
                    start_time: this.locationSearch.timeRange[0],
                    end_time: this.locationSearch.timeRange[1],
                    product_model_no: this.locationSearch.product_model_no,
                    cpppbh: this.locationSearch.cpppbh == 'all' ? '' : this.locationSearch.cpppbh,
                    cpmc: this.locationSearch.cpmc,
                    cpxh: this.locationSearch.cpxh,
                    cpdhh: this.locationSearch.cpdhh,
                    update_user: this.locationSearch.update_user,
                    store_no: this.locationSearch.store_no == 'all' ? '' : this.locationSearch.store_no,
                    area_no: this.locationSearch.area_no == 'all' ? '' : this.locationSearch.area_no,
                    seat_no: this.locationSearch.seat_no == 'all' ? '' : this.locationSearch.seat_no
                };
                if (isExport) {
                    apiExportSeatsTable(this, {
                        params: JSON.stringify(tmpObj)
                    });
                    
                } else {
                    getAllGoodsSeats(this, {
                        params: JSON.stringify(tmpObj)
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.goodsList = res.data.list;
                            this.totalnum = res.data.totalCount;
                        }
                    });
                    
                }
            },
            handleSuccess(arr) {
                this.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                apiImportSeats(this, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.importInfo.success = res.data.success_count;
                        this.importInfo.fail = res.data.error_count;
                        this.failedData = res.data.error_msg;
                        this.showModal = true;
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                });
            },
            confirmExportFailedList() {
                apiExportFailedLocation(this, {
                    params: JSON.stringify(this.failedData)
                });
            },
            seatsTmpExport() {
                apiExportSeatTmp(this, {});
            },
            cancelShowModal() {
                this.showModal = false;
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.locationSearch = {
                    product_model_no: '',
                    cpppbh: 'all',
                    cpmc: '',
                    cpxh: '',
                    cpdhh: '',
                    update_user: '',
                    store_no:'all',
                    area_no:'all',
                    seat_no:'all',
                    timeRange: [],
                };
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
            changeDate(value) {
                this.locationSearch.timeRange = value;
                this.search();
            }

        },
        created () {
            this.getAllBrands();
            this.getAllStores();
            this.getData();
        }
    };
</script>
