<template>
    <div style="width:100%;height:400px;" id="pie-circle" class="for-change-id"></div>
</template>

<script>
    const echarts = require('echarts');

    export default {
        name: 'pie-circle-percentage',
        data () {
            return {
                bindDomId: ''
            };
        },
        props: ['diyDomIndex', 'data', 'title'],
        methods: {
            redrawEcharts () {
                let dataSourcePie = echarts.init(document.getElementById(this.bindDomId));
                let option = {
                    title: {
                        text: this.title,
                        x: 'center',
                        top: '30px'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [
                        {
                            name: this.title,
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.data || [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                dataSourcePie.setOption(option);
                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                });
            }
        },
        mounted () {
            if (this.diyDomIndex !== undefined) {
                document.getElementsByClassName('for-change-id')[this.diyDomIndex].setAttribute('id', 'pie-circle' + this.diyDomIndex);
                this.bindDomId = 'pie-circle' + this.diyDomIndex;
            } else {
                this.bindDomId = 'pie-circle';
            }
            this.redrawEcharts();
        },
        watch: {
            data () {
                this.redrawEcharts();
            }
        }
    };
</script>

