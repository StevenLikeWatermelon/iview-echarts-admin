<style>
    .for-roles .ivu-breadcrumb {
        float: left;
    }
    .role-container {
        margin-left: 30px;
        float: left; 
    }
    .role-container .switch-roles {
        display: inline-block;
        width: auto;
        cursor: pointer;
        padding: 0 5px;
        vertical-align: middle;
        text-align: center;
        margin-left: 10px;
        margin-top: -5px;
    }
    .role-container .switch-roles.backColor {
        background: #d2ecec;
    }
</style>
<template>
    <div class="for-roles">
        <Breadcrumb>
            <BreadcrumbItem 
                v-for="item in $store.state.currentPath" 
                :href="item.path" 
                :key="item.name"
            >{{item.title}}</BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>

<script>
    import {getStore} from '@/config/mUtils';
    import { switchRole } from '@/config/getData';
    import Cookies from 'js-cookie';
    export default {
        name: 'breadcrumbNav',
        props: {
            currentPath: Array
        },
        data () {
            return {
            }
        },
        methods: {
        }
    };
</script>

