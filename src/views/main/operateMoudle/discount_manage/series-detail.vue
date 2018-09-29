<template>
    <detail-tmp :updateAuth="updateAuth" :deleteAuth="deleteAuth" typeModule="operate_sales_manage_series_discount"></detail-tmp>
</template>
<script>
    import detailTmp from './detailTmp';
    export default {
        data () {
            return {
                updateAuth: 'operate_sales_manage_series_discount_detail_update_auth',
                deleteAuth: 'operate_sales_manage_series_discount_detail_delete_auth',
            };
        },
        components: {
            detailTmp
        }
    };
</script>
