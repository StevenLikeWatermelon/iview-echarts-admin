<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    基本信息
                </p>
                <Form :label-width="120">
                    <Row>
                        <Col span="8">
                        <FormItem label="供应商：" style="margin:0;">
                            {{form.applyer}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系人：" style="margin:0;">
                            {{form.apply_lxr}}
                        </FormItem>
                        </Col>
                        <Col span="8">
                        <FormItem label="供应商联系方式：" style="margin:0;">
                            {{form.apply_lxfs}}
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="退货联系人：" style="margin:0;">
                            <Input v-model="form.th_lxr"  placeholder="请填写退货联系人"></Input>
                        </FormItem>
                        </Col>
                        <Col span="8" class="margin-top-20">
                        <FormItem label="退货联系方式：" style="margin:0;">
                            <Input v-model="form.th_lxfs"  placeholder="请填写退货联系方式"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="margin-top-20">
                        <Col span="8">
                        <FormItem label="退货地址：" style="margin:0;">
                            <Cascader :data="addressData" v-model="form.addressVal"></Cascader>
                        </FormItem>
                        </Col>
                        <Col span="8" class="padding-left-20" >
                             <Input type="text" v-model="form.xxdz"placeholder="请填写详细地址"></Input>
                        </Col>
                        <Col span="16" class="margin-top-20">
                        <FormItem label="退货原因：" style="margin:0;">
                            <Input type="textarea" v-model="form.state"  placeholder="请输入退货原因"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" class="card-title">
                    申请退货商品明细
                </p>
                <div>
                    <div class="margin-bottom-10">
                        <span>退货商品总数： <em style="color:#cf0012;font-style: normal;">{{ goodsAll }}</em></span>
                        <span class="margin-left-20">退货商品总额： <em style="color:#cf0012;font-style: normal;">{{ goodsAllMoney }}</em></span>
                    </div>
                    <el-table :data="actTable.data" border stripe style="text-align: center"  @sort-change="manualSort">
                        <el-table-column type="index" label="行号" fixed></el-table-column>
                        <el-table-column prop="cpdhh" label="品牌" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="产品名称"  min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="产品型号"  min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="订货号"  min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="cpdhh" label="计量单位"></el-table-column>
                        <el-table-column prop="cpmj" label="采购单价" sortable="custom" min-width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.cpmj }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cpdhh" label="采购数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="cpdhh" label="发货数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="cpdhh" label="到货仓库" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="cpdhh" label="可退数量" sortable="custom" min-width="100"></el-table-column>
                        <el-table-column prop="num" label="本次退货数量" sortable="custom" width="120">
                            <template slot-scope="scope">
                                <Input type="text" v-model="scope.row.num"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock_num" label="退货金额" sortable="custom" width="120">
                            <template slot-scope="scope">
                                <span> {{ multiply(scope.row.cpmj, multiply(scope.row.cpzk, scope.row.num), 4) }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backTo()">返回</Button>
                <Button type="info" class="margin-top-10" style="margin:auto;margin-left:20px;">保存</Button>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus } from '@/config/getData';
    import { notempty, sortBy, setToken } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'purchase_manage_HT_toTHD',
        data () {
            return {
                form: {
                    applyer: '',
                    apply_lxr: '',
                    apply_lxfs: '',
                    th_lxr: '',
                    th_lxfs: '',
                    addressVal: ['jiangsu', 'suzhou', 'zhuozhengyuan'],
                    state: ''
                },
                addressData: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ]
                }],
                htd_id: this.$route.query.param,
                actTable: {
                    data: [
                        {
                            cpdhh: '1239'
                        }
                    ]
                },
                qyrzStatus: '',
                qyrzStatusArr: [],
                goodsAll: '120',
                goodsAllMoney: '132.00',
                goodsAllWS: '122',
                goodsAlltax: '1323',
            };
        },
        methods: {
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['xshtdzt'])
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
                    }
                });
            },
            handleClick (param, path) {
                let argu = { param };
                util.openNewPage(this, path);
                this.$router.push({
                    name: path,
                    query: argu
                });
            },
            getData () {
                //基本信息
//                apiGetSalesLimitTimeDetail(this, {
//                    id: this.act_id
//                }).then(res => {
//                    if (res && res.status == 1){
//                        this.act_name = res.data.basic_info.promote_name;
//                        this.act_time = res.data.basic_info.start_time + ' ~ ' + res.data.basic_info.end_time;
//                        this.act_src = res.data.basic_info.promote_img;
//                    } else {
//                        this.$Message.error(res.message);
//                    }
//                });
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.actTable.data.sort(sortBy(column.prop, isDec));
            },
            //排列序号
//            indexMethod (index) {
//                return  (this.currentPage - 1) * this.limit + index + 1;
//            },
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
