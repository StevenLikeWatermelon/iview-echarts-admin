<style lang="less">
    @import './401.less';
</style>

<template>
    <div class="error401">
        <div class="error401-body-con">
            <Card>
                <div class="error401-body-con-title">4<span class="error401-0-span"><Icon type="android-lock"></Icon></span><span class="error401-key-span"><Icon type="key"></Icon></span></div>
                <p class="error401-body-con-message">你没有权限访问该{{hasNoAccessToSys ? '系统' : '页面'}}!</p>
                <div class="error401-btn-con" v-show="!hasNoAccessToSys">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                </div>
                <div class="error401-btn-con" v-show="hasNoAccessToSys">
                    <Button @click="goLogout" size="large" style="width: 200px;">注销</Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import {getStore} from '@/config/mUtils';
import { apiLoginOut } from '@/config/getData';
export default {
    name: 'Error401',
    data () {
        return {
            hasNoAccessToSys: false
        }
    },
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: 'home_index'
            });
        },
        goLogout () {
            // 退出登录
            apiLoginOut(this, {}).then(res => {

            });
        }
    },
    created () {
        if (getStore('authArr')) {
            this.hasNoAccessToSys = false;
        } else {
            this.hasNoAccessToSys = true;
        }
    }
};
</script>
