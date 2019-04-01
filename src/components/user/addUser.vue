<template>
    <div class="addUser">
        <div class="title_box">
            <span class="square"></span>
            <span class="title">新增客户</span>
        </div>
        <!--<el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="100px"-->
        <!--style="width:500px; margin: 50px auto">-->
        <!--<el-form-item label="公司名称：" prop="name" style="margin-top:20px;">-->
        <div class="label">公司名称：</div>
        <el-input v-model="form.name" class="input" placeholder="请输入公司名称"></el-input>
        <div class="label">联系方式：</div>
        <el-input v-model="form.phone" class="input" placeholder="请输入联系方式"></el-input>
        <div class="label">公司地址：</div>
        <el-input v-model="form.address" class="input" placeholder="请输入公司地址"></el-input>
        <!--</el-form-item>-->
        <!--<el-form-item label="联系方式：" prop="phone">-->
        <!--<el-input v-model="form.phone"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="公司地址：" prop="address">-->
        <!--<el-input v-model="form.address"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->

        <div class="submit" @click="submit">提交</div>
        <div class="reset" @click="submit">重置</div>

    </div>
</template>

<script>
    export default {
        name: "addUser",
        data() {

            return {
                form: {
                    name: '',
                    phone: '',
                    address: '',
                },
                rules: {
                    name: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入电话', trigger: 'blur'}],
                    address: [{required: true, message: '请输入身份证', trigger: 'blur'}],

                }
            }
        }
    }
</script>

<style scoped>
    .addUser {
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        background-color: white;
        height: calc(100% - 30px);
    }

    .title_box {
        height: 70px;
    }

    .square {
        float: left;
        margin-left: 50px;
        margin-top: 35px;
        display: block;
        height: 10px;
        width: 10px;
        background-color: #3A3D89;
    }

    .title {
        display: block;
        float: left;
        margin-top: 28px;
        margin-left: 15px;
        letter-spacing: 1.2px;
        font-size: 18px;
        color: #000000;
        font-weight: 500;
    }

    .label {
        width: 390px;
        margin: 30px auto;
        color: black;
    }

    .input {
        display: block;
        width: 400px;
        margin: 20px auto;
    }

    .submit {
        margin: 60px auto 0;
        height: 41px;
        cursor: pointer;
        line-height: 41px;
        width: 100px;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 2px;
        color: white;
        background-color: #5455B0;
    }
</style>