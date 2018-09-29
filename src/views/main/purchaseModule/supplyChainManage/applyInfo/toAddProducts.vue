<template>
    <div>
        <Row>
            <col span="24">
                <Card>
                    <Form :label-width="120"  :model="outputInfo">
                        <Row>
                            <Col span="8">
	                            <FormItem label="通用系列：">
	                                <Input v-model="outputInfo.cpmcty" placeholder="请输入通用系列" @on-enter="search"></Input>
	                            </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="产品名称：">
                                    <Input v-model="outputInfo.cpmc" placeholder="请输入产品名称" @on-enter="search"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8" style="text-align: center;margin-bottom:0;">
	                            <Button type="primary" style="margin-right:30px;" @click="search">搜索</Button>
	                            <Button type="default" @click="reset">重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </col>
        </Row>
        <Row class="margin-top-10">
            <col span="24">
                <Card>
                    <Col span="24" style="margin-bottom: 10px;">
                        <Button type="primary" @click="addNew()">添加</Button>
                        <Button type="primary" @click="cancelModal" style="margin-left:10px;">取消</Button>
                    </Col>
                    <el-table :row-class-name="tableRowClassName" :data="outputList" border style="text-align: center;width:100%"  @selection-change="handleSelectionChange">
                        <el-table-column  type="selection"  width="55"></el-table-column>
                        <el-table-column prop="cpmcty" label="通用系列"></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称"></el-table-column>
                    </el-table>
                    <pagination direction="top" v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" v-show="totalnum > 10"></pagination>
                </Card>
            </col>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';
    import pagination from '@/views/common/pagination.vue';
    import { apiGetSupplyCoBrandToAddGoods, apiGetSupplyCoBrandAddGoods } from '@/config/getData';
    export default {
        components: {
            pagination
        },
        props: ['brandNo'],
        data () {
            return {
                outputInfo: {
                    cpmc: '',
                    cpmcty: ''
                },
                currentType: '',
                selectGoods: [],
                outputList: [],
                limit: 10,
                totalnum: 0,
                currentPage: 1,
                orderField: '',
                orderDirection: 'desc'
            };
        },
        methods: {          
            getData (type, isReset) {
                this.currentType = type;
                if (isReset) {
                    this.reset();
                } else {
                    apiGetSupplyCoBrandToAddGoods(this, {
                        type,
                        supplier_no: this.$route.query.param,
                        brand_no: this.brandNo,
                        params: JSON.stringify({
                            pageNum: this.currentPage,
                            numPerPage: this.limit,
                            orderField: this.orderField,
                            orderDirection: this.orderDirection,
                            cpmcty: this.outputInfo.cpmcty,
                            cpmc: this.outputInfo.cpmc
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.totalnum = res.data.totalCount;
                            this.outputList = res.data.list;
                        }
                    });
                }
            },
            handleSelectionChange(selectedval) {
                this.selectGoods = [];
                selectedval.forEach(item => {
                    this.selectGoods.push(item.cpbh);
                });
            },
            cancelModal() {
                this.$emit('cancelModal');
            },
            addNew() {
                if (this.selectGoods.length <= 0) {
                    this.$Message.error('请至少选择一项!');
                    return;
                }
                this.$Spin.show();
                apiGetSupplyCoBrandAddGoods(this, {
                    type: this.currentType,
                    supplier_no: this.$route.query.param,
                    brand_no: this.brandNo,
                    product_nos: JSON.stringify(this.selectGoods)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Spin.hide();
                        this.$Message.success('新增成功!');
                        this.$emit('cancelModal');
                    } else {
                        this.$Spin.hide();
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.currentPage = 1;
                this.getData(this.currentType);
            },
            reset () {
                this.outputInfo = {
                    cpmc: '',
                    cpmcty: ''
                };
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData(this.currentType);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData(this.currentType);
            }
        }
    };
</script>