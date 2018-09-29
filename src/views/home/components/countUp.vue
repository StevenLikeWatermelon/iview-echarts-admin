<template>
    <div>
        <p :class="className" :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}"><span v-cloak :id="idName">{{ endVal }}</span><span>{{ unit }}</span></p>
        <slot name="intro"></slot>
    </div>
</template>

<script>
import CountUp from 'countup';

function transformValue (val) {
    let endVal = 0;
    let unit = '';
//    if (val < 1000) {
//        endVal = val;
//    } else if (val >= 1000 && val < 1000000) {
//        endVal = parseInt(val / 1000);
//        unit = 'K+';
//    } else if (val >= 1000000 && val < 10000000000) {
//        endVal = parseInt(val / 1000000);
//        unit = 'M+';
//    } else {
//        endVal = parseInt(val / 1000000000);
//        unit = 'B+';
//    }
    endVal = val;
    return {
        val: endVal,
        unit: unit
    };
}

export default {
    data () {
        return {
            unit: '',
            demo: {}
        };
    },
    name: 'countUp',
    props: {
        idName: String,
        className: String,
        startVal: {
            type: Number,
            default: 0
        },
        endVal: [String, Number],
        decimals: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 2
        },
        delay: {
            type: Number,
            default: 500
        },
        options: {
            type: Object,
            default: () => {
                return {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.'
                };
            }
        },
        color: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        introText: [String, Number]
    },
    mounted () {
        this.$nextTick(() => {
            setTimeout(() => {
                let res = transformValue(this.endVal);
                let endVal = res.val;
                this.unit = res.unit;
                let demo = {};
                // 业务需求保留整数，取消掉countup方法，后期可查看源码做优化
                // this.demo = demo = new CountUp(this.idName, this.startVal, endVal, this.decimals, this.duration, this.options);
                // console.log(demo, '111');
                // if (!demo.error) {
                //     demo.start();
                // }
            }, this.delay);
        });
    },
    watch: {
        endVal (val) {
            let res = transformValue(val);
            let endVal = res.val;
            this.unit = res.unit;
            this.demo.update && this.demo.update(endVal);
        }
    }
};
</script>
