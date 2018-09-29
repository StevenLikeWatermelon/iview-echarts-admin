<template>
    <div>
        <Row>
            <Col span="24">
            <Row>
                <Col span="6">
                <infor-card
                        id-name="orderAmount"
                        :end-val="operateCount.all_goods"
                        iconType="social-yen-outline"
                        color="#2d8cf0"
                        intro-text="商品总数"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="paidAmount"
                        :end-val="operateCount.sell_goods"
                        iconType="social-yen"
                        color="#64d572"
                        intro-text="在售商品总数"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="addCustomer"
                        :end-val="operateCount.all_brand"
                        iconType="social-yen-outline"
                        color="#ffd572"
                        intro-text="品牌总数"
                ></infor-card>
                </Col>
                <Col span="6" class-name="padding-left-5">
                <infor-card
                        id-name="doneCustomer"
                        :end-val="operateCount.sell_brand"
                        iconType="social-yen"
                        color="#f25e43"
                        intro-text="在售品牌总数"
                ></infor-card>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import inforCard from './components/inforCard.vue';
    import { operateIndexSales } from '@/config/getData';
    export default {
        components: {
            inforCard
        },
        data () {
            return {
                operateCount: {}
            };
        },
        created: function () {
            //获取运营首页数据
            this.getOperateIndex();
        },
        methods: {
            //获取运营首页数据
            getOperateIndex () {
                operateIndexSales(this, {}).then(res => {
                    this.operateCount = res.data;
                });
            }
        }
    };
</script>

