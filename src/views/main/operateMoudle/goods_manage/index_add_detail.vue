<style>
</style>
<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="goodsTosaleInfo" :label-width="100" >
                    <Row>
                        <Col span="8">
                        <FormItem label="产品类别：">
                            <Cascader :data="allTypes" v-model="goodsTosaleInfo.cplb" filterable></Cascader>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品品牌：">
                            <Select v-model="goodsTosaleInfo.cppp"  placeholder="请选择产品品牌" filterable @on-change="getItSeries">
                                <Option v-for="item in allBrandList" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="产品名称：">
                            <Input placeholder="请输入产品名称"  v-model="goodsTosaleInfo.cpmc"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="商品订货号：">
                             <Input type="textarea" :rows="4" placeholder="请输入产品订货号"  v-model="textValue"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6" style="text-align: center;margin-bottom:0; margin-top:30px;">
                        <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
                        <Button type="default" @click="reset">重置</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <Col span="2" style="margin-bottom: 10px;"><Button type="primary" @click="upGoodsSelected">新增筛选结果</Button></Col>
                <el-table :row-class-name="tableRowClassName" :data="goodsToSaleList" border style="text-align: center" @selection-change="handleSelectionChange" max-height="570">
                    <el-table-column  type="selection"  width="55"></el-table-column>
                    <el-table-column prop="cpxhbh" label="商品型号编号" width="120"></el-table-column>
                    <el-table-column prop="cpppmc" label="商品品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmcty" label="通用系列" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cplbmc" label="产品类别" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="商品型号" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="商品订货号" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpbh" label="产品编码" width="120"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <Modal v-model="showSucessInfo" width="400" :closable="true" :mask-closable="true">
            <p slot="header" style="color:#f60;text-align:center">
                <span style="font-size: 18px;">提示</span>
            </p>
            <div style="text-align:center;font-size: 14px;">
                <p>{{successInfoMsg}}</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="hasKnow()">知道了</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../common/pagination.vue';
    import { goodsToSale, operateAllBrandsList, apiAlltypes, apiAllSeries, upSelectedGoodsApi } from '@/config/getData';
    export default {
        data () {
            return {
                goodsTosaleInfo: {
                    cppp: 'all',
                    cpmc: '',
                    cplb: [],
                    dhh: [],
                },
                allBrandList:[{
                    cpppbh: 'all',
                    cpppmc: '全部',
                }],
                allSeriesList:['全部'],
                Alltypes:[],
                textValue:'',
                goodsToSaleList: [],
                selectGoods: [],
                currentPage: 1,
                limit: 10,
                totalnum: 0,
                showSpin: false,
                showSucessInfo: false,
                successInfoMsg: ''
            };
        },
        components: {
            pagination
        },
        methods: {
            hasKnow () {
                this.showSucessInfo = false;
            },
            getAllBrand () {
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        if (this.allBrandList.length == 1) {
                            this.allBrandList = this.allBrandList.concat(res.data.list);
                        }
                    }
                });
            },
            getItSeries (value) {
                apiAllSeries(this, {
                    cpppbh: JSON.stringify([value])
                }).then(res => {
                    if (res && res.status == 1) {
                        this.goodsTosaleInfo.cpxl = '全部';
                        this.allSeriesList = ['全部'];
                        this.allSeriesList = this.allSeriesList.concat(res.data);
                    }
                });
            },
            getAlltypes () {
                apiAlltypes(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allTypes = res.data;
                    }
                });
            },
            getData () {
                let tmpDhhArr = [];

                if (this.textValue) {
                    tmpDhhArr = this.textValue.split(/[\n,]/g);
                }

                goodsToSale(this, {
                    params: JSON.stringify({
                        pageNum: this.currentPage, 
                        numPerPage: this.limit, 
                        cppp: this.goodsTosaleInfo.cppp == 'all' ? '' : this.goodsTosaleInfo.cppp,
                        cpmc: this.goodsTosaleInfo.cpmc, 
                        cplb: JSON.stringify(this.goodsTosaleInfo.cplb),
                        dhh: JSON.stringify(tmpDhhArr)
                    })
                }).then(res => {
                    this.goodsToSaleList = res.data.list;
                    this.totalnum = res.data.totalCount;
                });
            },
            upGoodsSelected () {
                if (this.selectGoods.length == 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                upSelectedGoodsApi(this, {
                    cpxhbh: JSON.stringify(this.selectGoods)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.successInfoMsg = '上架成功,' + res.message;
                        this.showSucessInfo = true;
                        this.getData();
                    } else {
                        this.successInfoMsg = '上架失败,' + res.message;
                        this.showSucessInfo = true;
                    }
                });
            },
            handleSelectionChange(selectedval) {
                this.selectGoods = [];
                selectedval.forEach(item => {
                    this.selectGoods.push(item.cpxhbh);
                });
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.goodsTosaleInfo.cppp = 'all';
                this.goodsTosaleInfo.cpxl = '全部';
                this.goodsTosaleInfo.cplb = [];
                this.goodsTosaleInfo.dhh = [];
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
            }
        },
        created () {
            this.getAllBrand();
            this.getAlltypes();
            this.getData();
        }
    };
</script>
