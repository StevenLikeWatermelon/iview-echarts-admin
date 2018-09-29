<style>
    
</style>
<template>
    <div>
        <div style="margin-bottom: 10px;" v-auth="buttonAuth">
            <Button type="primary" @click="showBrandModal">添加品牌</Button>
        </div>
        <div v-if="canLoop">
            <brand-tmp v-for="item in allBrandDetail" :brandInfo="item" @refreshList="getBrandList" ></brand-tmp>
        </div>
        <Modal v-model="showAddBrand" title="添加品牌" width="500">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="80" ref="addBrandDetail" :model="addBrandDetail" :rules="ruleValidateStorage">
                            <Row>
                                <Col span="24">
                                    <FormItem label="品牌：" prop="brand_no">
                                        <Select v-model="addBrandDetail.brand_no" filterable>
                                            <Option v-for="item in allBrands" :value="item.cpppbh" :key="item.cpppbh">{{ item.cpppmc }}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelOperateLocation">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmOperateLocation">保存</Button>
            </div>
        </Modal> 
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    import brandTmp from './brandTmp.vue';
    import {apiGetSupplyCoBrand, apiAddSupplyCoBrand, apiAllBrands, apiSupplyCoBrandProduct} from '@/config/getData';
    export default {
        data () {
            return {
                loading: false,
                buttonAuth: 'apply_detail_cooperate_all_button',
                spinShow: true,
                showAddBrand: false,
                canLoop: false,
                supplyNo: this.$route.query.param,
                allBrandDetail: [],
                allBrands: [],
                addBrandDetail: {
                    brand_no: '',
                    supplier_no: this.$route.query.param
                },

                ruleValidateStorage: {
                    brand_no: [
                        { required: true, message: '品牌不能为空', trigger: 'blur' }
                    ],
                },
            };
        },
        methods: {
            getBrandList() {
                apiGetSupplyCoBrand(this, {
                    supplier_no: this.supplyNo
                }).then(res => {
                    if (res && res.status == 1) {
                        let queryPromiseArr = [];
                        this.allBrandDetail = res.data;
                    }
                });
            },
            getAllBrands () {
                apiAllBrands(this, {}).then(res => {
                    if (res && res.status == 1) {
                        this.allBrands = res.data;
                        this.canLoop = true; //因为向数组中传递的是对象，所以要初始化数组中的对象，但是这样会导致组件中引用初始话的空的brand_no,导致接口失败，所以等获取数据之后再渲染组件，如果后续有其他好的解决方案请优化
                        this.spinShow = false;                        
                    }
                });
            }, 
            showBrandModal() {
                this.showAddBrand = true;
            },
            cancelOperateLocation() {
                this.showAddBrand = false;
            },
            confirmOperateLocation() {
                this.$refs['addBrandDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        apiAddSupplyCoBrand(this, {
                            params: JSON.stringify(this.addBrandDetail)
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.$Message.success('新增成功!');
                                this.getBrandList();
                                this.showAddBrand = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        });
                    }
                });
            }
        },
        components: {
            brandTmp
        },
        created () {
            this.getAllBrands();
            this.getBrandList();
        }
    };
</script>