<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                theme: this.$store.state.theme
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>

<style>
.app-main{
    width: 100%;
    height: 100%;
}
.app-main .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,.el-table__body tr.current-row>td,.el-table__body tr.hover-row.current-row>td,.el-table__body tr.hover-row.el-table__row--striped.current-row>td,.el-table__body tr.hover-row.el-table__row--striped>td,.el-table__body tr.hover-row>td {
    background-color: rgba(137,185,75,0.5);
}
.app-main .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgba(137,185,75,0.5);
}
.app-main .main-header .header-middle-con {
    width: 1800px;
}
.app-main .main-header .header-avator-con {
    width: auto;
}
.ivu-select-dropdown.ivu-dropdown-transfer {
    max-height: 800px;
}
.main .sidebar-menu-con::-webkit-scrollbar {
    display: none;
}


.main-right-slide {
    position: fixed;
    right: -321px;
    top: 62px;
    width: 320px;
    background-color: #fff;
    z-index: 1000;
    height: calc(100% - 62px);
    overflow: auto;
    transition: right 0.8s;
    -moz-transition: right 0.8s; /* Firefox 4 */
    -webkit-transition: right 0.8s; /* Safari 和 Chrome */
    -o-transition: right 0.8s; /* Opera */
}
.main-right-slide.show-right {
    right: 0;
}
.main-right-head {
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 35px;
    height: 60px;
}
.main-right-head .title{
    font-size: 20px;
    color: #000000;
    text-align: center;
}
.main-right-content {
    height:40px;
    width:100%;
    font-size: 14px;
}
.main-right-content-for-message {
    height:46px;
    width:100%;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}
.span-for-click {
    color: rgb(45, 140, 240);
    cursor: pointer;
}
.margin-fill-dot {
  margin-left: 26px;
}

/*iview自带的样式太丑了，重写$modal样式*/
body .ivu-modal-confirm-body-icon {
    display: none;
}
body .ivu-modal-confirm-body {
    padding: 0;
    text-align: center;
}   
body .ivu-modal-confirm-footer {
    margin-top: 0;
}   
/*bounce 动画*/
@-webkit-keyframes bounce {
  from,
  60%,
  76.5%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  70%,
  71.5% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -10px, 0);
    transform: translate3d(0, -10px, 0);
  }

  85% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }

  95% {
    -webkit-transform: translate3d(0, -1px, 0);
    transform: translate3d(0, -1px, 0);
  }
}

@keyframes bounce {
  from,
  60%,
  76.5%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  70%,
  71.5% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -10px, 0);
    transform: translate3d(0, -10px, 0);
  }

  85% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }

  95% {
    -webkit-transform: translate3d(0, -1px, 0);
    transform: translate3d(0, -1px, 0);
  }
}


.bounce {
  -webkit-animation: bounce 2s linear infinite normal 0s both;
  animation: bounce 2s linear infinite normal 0s both;
}

.read-message-button-color:hover {
  color: rgb(45, 140, 240);
}

</style>
