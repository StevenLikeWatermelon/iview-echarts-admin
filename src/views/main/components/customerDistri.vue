<template>
    <div style="width:100%;height:500px;" id="customer-distri"></div>
</template>
<script>
    let echarts = require('echarts');
    import chinaData from './china';
    export default {
        name: 'customer-distribution',
        data () {
            return {
                //
            };
        },
        props:['distributionArr'],
        methods: {
            redrawEcharts () {
                let dataSourcePie = echarts.init(document.getElementById('customer-distri'));
                let tmpLegend = [];
                this.distributionArr.forEach(item => {
                    tmpLegend.push(item.name);
                });
                let option = {
                    title: {
                        text: '客户/成交额分布图',
                        left: 'center',
                        top: '30px'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: tmpLegend,
                        selectedMode : 'single',
                        top: '30px'
                    },
                    visualMap: {
                        min: 0,
                        max: 2500,
                        left: 'left',
                        top: 'bottom',
                        text: ['高','低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    series: this.distributionArr || []
                };
                dataSourcePie.setOption(option);
                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                });
            }
        },
        watch: {
            "distributionArr" () {
                this.redrawEcharts();
            } 
        }
    };
</script>
