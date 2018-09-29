<template>
    <div>
        <div class="system_title">您好，master，您已进入系统最高权限管理模块</div>
        <div id="world"></div>
    </div>
</template>

<script>
    import {init, createLights, createFloor, createLion, createFan, loop} from '@/libs/index';
    export default {
        data () {
            return {
            };
        },
        components: {
        },
        methods: {
        },
        mounted: function () {
            init();
            createLights();
            createFloor();
            createLion();
            createFan();
            loop();
        }
    };
</script>

