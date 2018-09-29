<template>  
    <div style="width:100%;height:330px;" id="sales-ranking"></div>
</template>

<script>
    import searchData from '../../common/search.vue';
    const echarts = require('echarts');
    export default {
        data () {
            return {
            };
        },
        props: ['date', 'data'],
        components: {
            searchData
        },
        methods: {
            redrawEcharts () {
                if (document.getElementById('sales-ranking')) {
                    let visiteVolume = echarts.init(document.getElementById('sales-ranking'));
                    let tmpLengend = [];
                    this.data.forEach(item => {
                        tmpLengend.push(item.name);
                    });
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            data: []
                        },
                        grid: {
                            left: '3%',
                            right: '3%',
                            bottom: '3%',
                            top: '12px',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.date
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: this.data
                    };

                    visiteVolume.setOption(option);

                    window.addEventListener('resize', function () {
                        visiteVolume.resize();
                    });
                }
            }
        },
        name: 'sales-ranking-trend',
        mounted () {
            this.redrawEcharts();
        },
        watch: {
            data () {
                this.redrawEcharts();
            }
        }
    };
</script>