<style scoped>
    .mutil-img-flex {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-left: -20px
    }
    .img-repeat {
        position: relative;
        width: 150px;
        height: 150px;
        border:1px solid rgba(204, 204, 204, 0.8);
    }
    .img-repeat img {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
    }
    .hide-operate-img {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content:space-between;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: all 0.2s;
    }
    div.hide-operate-img:hover {
        opacity: 1;
    }
    div.hide-operate-img:hover div{
        color:#fff;
        opacity: 0.9;
    }
    .hide-operate-img div {
        cursor: pointer;
        opacity: 0.4;
        transition: all 0.2s;
    }
    .hide-operate-img div:hover {
        opacity: 1;
        color:#fff;
    }
    .hide-operate-img div:hover i{
        color:#fff;
    }
</style>
<template>
    <Row>
        <div class="mutil-img-flex">
            <div v-for="(item, index) in picsArr" style="padding-left: 20px;margin-bottom: 15px;">
                <div class="img-repeat">
                    <img :src="item">
                    <div class="hide-operate-img" v-show="!hideOpetate">
                        <div @click="toLeft(index)" style="margin-left:10px;"><Icon  v-show="index > 0" type="chevron-left" size="40"></Icon></div>
                        <div @click="toDelte(index)"><Icon type="trash-a" size="40"></Icon></div>
                        <div @click="toRight(index)" style="margin-right:10px;"><Icon  v-show="index < picsArr.length - 1" type="chevron-right" size="40"></Icon></div>
                    </div>
                </div>
            </div>
        </div>
    </Row>
</template>
<script>
    export default {
        props: ['picsArr', 'hideOpetate'],
        methods: {
            toLeft(index) {
                let tmpItem = this.picsArr.splice(index, 1)[0];
                this.picsArr.splice((index - 1), 0, tmpItem);
            },
            toDelte(index) {
                this.picsArr.splice(index, 1);
            },
            toRight(index) {
                let tmpItem = this.picsArr.splice(index, 1)[0];
                this.picsArr.splice(index + 1, 0, tmpItem);
            }
        }
    };
</script>