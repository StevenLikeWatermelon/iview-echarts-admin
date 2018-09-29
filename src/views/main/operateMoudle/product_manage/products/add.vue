<style>
    .ivu-tabs{
        overflow: visible !important;
    }
    .border-dashed-top:nth-child(n+2){
        border-top: 1px dashed #d4d4d4;
        margin-top:20px;
    }
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    产品信息新增
                    <span style="font-weight:normal;float:right;">
                        <Button type="default" @click="close('ppxxcancel')">取消</Button>
                        <Button type="primary" :loading="loading" @click="close('ppxxsave')">保存</Button>
                    </span>
                </p>
                <Form :label-width="100">
                    <Row>
                        <Col span="6">
                        <FormItem label="产品品牌名称：" style="margin:0;">
                            <Select v-model="xjdDetail.cpppmc" placeholder="请选择" filterable>
                                <Option v-for="status in brandArr" :value="status.cpppbh" :key="status.cpppbh">{{ status.cpppmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="通用系列：" style="margin:0;">
                            <Input v-model="xjdDetail.cpxlty" placeholder="请填写通用系列"></Input>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="产品类别：" style="margin:0;">
                            <Select v-model="xjdDetail.cplbmc" placeholder="请选择" filterable>
                                <Option v-for="status in cplbArr" :value="status.cplbbh" :key="status.cplbbh">{{ status.cplbmc }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem label="产品状态：" style="margin:0;">
                            <Select v-model="xjdDetail.cpzt" placeholder="请选择" filterable>
                                <Option v-for="status in cp_state" :value="status" :key="status">{{ status }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="6" class="margin-top-10">
                        <FormItem label="产品名称：" style="margin:0;">
                            <Input v-model="xjdDetail.cpmc" placeholder="请填写产品名称"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus, apiGetProductSeriesAdd, operateAllBrandsList, operateAllBrandstype } from '@/config/getData';

    export default {
        name: 'service-sales-manage-xjddetail',
        data () {
            return {
                cpbh: '',
                loading: false,
                xjdDetail: {
                    cpppmc: '',
                    cpxlty: '',
                    cplbmc: '',
                    cpzt: '',
                    cpmc: ''
                },
                unlockStatus: '',
                unlockStatusArr: [],
                brandRules: {
                    cpppmc_ch: [
                        { required: true, message: '请输入品牌中文名称', trigger: 'blur' }
                    ],
                    cpppmc_en: [
                        { required: true, message: '请输入品牌英文名称', trigger: 'blur' }
                    ],
                },
                brandArr: [],
                cplbArr: [],
                cp_state: []
            };
        },
        methods: {
            getStatus () {
                /*获取产品品牌*/
                operateAllBrandsList(this, {
                    params: JSON.stringify({
                        type: 'active'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.brandArr.push(res.data.list[i]);
                        }
                    }
                });
                operateAllBrandstype(this, {}).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        for (let i = 0; i < res.data.list.length; i++) {
                            this.cplbArr.push(res.data.list[i]);
                        }
                    }
                });
                apiAllStatus(this, {
                    type: JSON.stringify(['cp_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cp_state = res.data.cp_state;
                    }
                });
            },
            getData () {

            },
            close (name) {
                if (name === 'ppxxcancel') {
                    this.backTo();
                } else if (name === 'ppxxsave') {
                    this.loading = true;
                    apiGetProductSeriesAdd(this, {
                        params: JSON.stringify({
                            cpppbh: this.xjdDetail.cpppmc,
                            cpmcty: this.xjdDetail.cpxlty.trim(),
                            cplbbh: this.xjdDetail.cplbmc,
                            cpmc: this.xjdDetail.cpmc.trim(),
                            is_deleted: this.xjdDetail.cpzt
                        })
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            let argu = { param: res.data.cpbh };
                            this.$router.push({
                                name: 'operate_products_detail',
                                query: argu
                            });
                        } else {
                            this.$Message.error(res.message);
                        }
                        this.loading = false;
                    });
                }
            },
            backTo () {
                history.go(-1);
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
        filters: {
            //保留两位小数过滤器
            toDecimal: function (x) {
                const f = parseFloat(x);
                if (isNaN(f)) {
                    return 0;
                }
                return f.toFixed(2);
            }
        }
    };
</script>
