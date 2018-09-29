<template>
    <index-tmp type="1" :addButtonAuth="addButtonAuth"  addMoudle="operate_sales_manage_series_discount_add" detailMoudle="operate_sales_manage_series_discount_detail"></index-tmp>
</template>
<script>
    import indexTmp from './indexTmp';
    export default {
        data () {
            return {
                addButtonAuth: 'operate_sales_manage_series_discount_add_button_auth'
            };
        },
        components: {
            indexTmp
        }
    };
</script>
