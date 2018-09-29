<style>
    
</style>

<template>
    <div>
        <form-item :initDetail="applyInfo" ref="formItem"></form-item>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary" class="margin-top-10" style="margin:auto;margin-left:30px;" @click="backTo()">返回</Button>
                <Button type="primary" class="margin-top-10" :loading="loading" style="margin:auto;margin-left:30px;" @click="save()">保存</Button>
            </Card>
            </Col>
        </Row>  
    </div>
</template>

<script>
    import util from '@/libs/util';
    import formItem from './addEditTmp.vue';
    import { apiMapDetail, apiAllStatus, apiAllBrands, purchaseAddApply, apiGetPurchaseSupplierDetail, apiGetPurchaseSupplierDetailEdit } from '@/config/getData';
    import {closeCurrentPage} from '@/config/mUtils';
    export default {
        data () {
            return {
                loading: false,
                applyInfo: {
                    gysmc: '',
                    gyslx: '',
                    gyssx: '',
                    khdj: '',
                    frdb: '',
                    zcsj: '',
                    dhhm: '',
                    qq: '',
                    email: '',
                    lxdz: '',
                    lxr: '',
                    sjhm: '',
                    czhm: '',
                    khyh: '',
                    yhzh: '',
                    gyssh: '',
                    alipay_account: '',
                    wxpay_account: '',
                    lxdz_sfmc: '',
                    lxdz_sfbh: '',
                    lxdz_csmc: '',
                    lxdz_csbh: '',
                    lxdz_xqmc: '',
                    lxdz_xqbh: '',
                }
            };
        },
        components: {
            formItem
        },
        methods: {
            backTo () {
                history.go(-1);
            },
            save() {
                this.loading = true;
                this.$refs['formItem'].save();
                setTimeout(() => {
                    this.loading = false;
                }, 300);
            }
                     
        }
    };
</script>