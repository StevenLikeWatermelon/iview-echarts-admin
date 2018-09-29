<template>
    <div>
        <div style="width:100%;height:200px;margin-top: -20px;" id="line-chart" class="for-change-id"></div>
    </div>
</template>

<script>
    const echarts = require('echarts');
    export default {
        data () {
            return {
                bindDomId: ''
            };
        },
        name: 'order-trend',
        props: ['diyDomIndex', 'data', 'date'],
        methods: {
            redrawEcharts () {
                let legendArr = [];
                for (let i = 0; i < this.data.length; i++) {
                    legendArr.push(this.data[i].name);
                }
                if (document.getElementById(this.bindDomId)) {
                    let serviceRequestCharts = echarts.init(document.getElementById(this.bindDomId));
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '30%',
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {
                            data: legendArr,
                            right: '3%',
                            top: '8%'
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
                    serviceRequestCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        serviceRequestCharts.resize();
                    });
                }
            }
        },
        mounted () {
            if (this.diyDomIndex !== undefined && document.getElementsByClassName('for-change-id')[this.diyDomIndex]) {
                document.getElementsByClassName('for-change-id')[this.diyDomIndex].setAttribute('id', 'line-chart' + this.diyDomIndex);
                this.bindDomId = 'line-chart' + this.diyDomIndex;
            } else {
                this.bindDomId = 'line-chart';
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
