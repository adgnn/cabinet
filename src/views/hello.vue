<template>
    <div class="hello">
        <h3 class="title">欢迎使用智能云柜后台管理系统</h3>
    </div>
</template>

<script>
    export default {
        name: "hello"
    }
</script>

<style scoped>
    .hello {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .title {
        display: block;
        font-size: 40px;
        letter-spacing: 2px;
        width: 100%;
        text-align: center;
        line-height: 100px;
        height: 100px;
        position: absolute;
        top: -170px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
</style>