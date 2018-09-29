<template>
    <div style="width:100%;height:500px;margin-top:20px;" id="multi-bar-chart" class="for-change-id"></div>
</template>

<script>
    const echarts = require('echarts');

    export default {
        name: 'salesRanking-salesMoney-amountAnaly',
        data () {
            return {
                bindDomId: ''
            };
        },
        props: ['diyDomIndex', 'title', 'data', 'date', 'selected'],
        methods: {
            redrawEcharts () {
                let legendArr = [];
                for (let i = 0; i < this.data.length; i++) {
                    legendArr.push(this.data[i].name);
                }
                const dataSourcePie = echarts.init(document.getElementById(this.bindDomId));
                const option = {
                    title: {
                        text: this.title,
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legendArr,
                        top: '40px'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '20%',
                        bottom: '4%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.date || []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.data || []
                };
                if (this.selected) {
                    option.legend.selected = this.selected;
                }
                dataSourcePie.setOption(option);

                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                });
                dataSourcePie.on('legendselectchanged',  (params) => {
                    if (this.selected) {
                        this.$emit('changeSelectd', params.selected);
                    }
                });
            }
        },
        mounted () {
            if (this.diyDomIndex !== undefined) {
                document.getElementsByClassName('for-change-id')[this.diyDomIndex].setAttribute('id', 'multi-bar-chart' + this.diyDomIndex);
                this.bindDomId = 'multi-bar-chart' + this.diyDomIndex;
            } else {
                this.bindDomId = 'multi-bar-chart';
            }
            this.redrawEcharts();
        },
        watch: {
            date () {
                this.redrawEcharts();
            }
        }
    };
</script>

