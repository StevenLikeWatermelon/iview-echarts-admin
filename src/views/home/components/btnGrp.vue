<style>
    .ivu-btn.btnActive{
        color: #2b85e4;
        background-color: rgba(224,255,255, 0.4);;
        border-color: #2b85e4;
        z-index: 2;
    }
</style>
<template>
    <ButtonGroup>
        <Button v-for="(item, index) in changeTitles" :class="{btnActive: index == currentBtn}" @click="tab(index)"   :key="index">{{item}}</Button>
    </ButtonGroup>
</template>

<script>
export default {
    name: 'btnGrpForChange',
    props: ['NewFirstTitle','NewSecondTitle'],
    data () {
        return {
            displayTitles: ['订单额','订单数'],
            currentBtn: 0
        };
    },
    computed: {
        changeTitles: function () {
            return (this.NewFirstTitle && this.NewSecondTitle) ? [this.NewFirstTitle, this.NewSecondTitle] : this.displayTitles;
        }
    },
    methods: {
        tab (index) {
            this.currentBtn = index;
            this.$emit('changeChartsData', index)
        }
    }
};
</script>