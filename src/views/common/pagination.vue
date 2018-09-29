<template>
    <!-- <div style="margin: 10px;overflow: hidden" id="parent"> -->
        <div style="text-align: center;margin: 10px;">
            <Page :total="totalnum" :current="current" show-elevator show-sizer show-total :page-size="diyPageSize" :page-size-opts="[10, 50, 100, 300, 500, 1000]" @on-change="getPage" @on-page-size-change="getLimit" style="padding:5px;" :placement="direction ? 'top' : 'bottom'"></Page>
        </div>
    <!-- </div> -->
</template>
<script>
    export default {
        data () {
            return {
                diyPageSize: 10,
            };
        },
        props: ['totalnum', 'current', 'getPageSize', 'direction'],
        methods: {
            getPage (page) {
                this.$emit("getPage", page);
            },
            getLimit (limit) {
                this.$emit("getLimit", limit);
            }
        },
        created() {
            this.diyPageSize = this.getPageSize || 10;
        }
    };
</script>
<style>

</style>