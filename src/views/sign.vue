<template>
    <div class="sign">
        <h1>智能云柜后台管理系统</h1>
        <img src="../images/img_bg.png" class="img">
        <div class="sign_box">
            <img src="../images/logo.png" class="logo">
            <el-form :model="form">
                <el-form-item>
                    <input v-model="form.username" class="self-input" type="text" placeholder="公司编码"/>
                </el-form-item>
                <el-form-item>
                    <input v-model="form.password" class="self-input" type="password" placeholder="密码"/>
                </el-form-item>
            </el-form>
            <!--<div class="register_button" @click="register">注册</div>-->
            <div class="sign_button" @click="login">登陆</div>
        </div>
    </div>
</template>

<script>

    import {
        mapState,
        mapMutations,
    } from 'vuex'
    import qs from 'qs'
    import md5 from 'js-md5'

    export default {
        name: "sign",
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                },
            }
        },
        methods: {
            login() {
                if (this.form.username === '') {
                    this.$message('请填写用户名！');
                    return
                }
                if (this.form.password === '') {
                    this.$message('请填写密码！');
                    return
                }
                let pass = md5(this.form.password + 'ashley');
                let data = qs.stringify({
                    "username": this.form.username,
                    "password": md5(pass + 'ashley'),
                });
                this.$post("/user/login", data)
                    .then((res) => {
                        if (res.data.code === 0) {
                            this['setRole'](res.data.content.company.comName);
                            this.$success("登陆成功")
                        } else {
                            this.$fail(res.data.message)
                        }
                    })
                    .catch((err) => {
                        this.$fail("登陆失败")
                    })
            },
            ...mapMutations(['setRole']),
        }
    }
</script>

<style scoped>
    .sign {
        width: 100%;
        height: 100vh;
        background-color: #5455B0;
        overflow: hidden;
        position: relative;
    }

    .img {
        position: absolute;
        top: 25%;
        left: 5%;
    }

    .logo {
        display: block;
        margin: 40px auto;
    }

    .sign_box {
        width: 380px;
        height: 400px;
        border: 1px solid #BFCBD9;
        box-shadow: 5px 5px 10px #4445AE;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 12%;
        background-color: white;
    }

    h1 {
        position: absolute;
        color: white;
        font-size: 45px;
        letter-spacing: 7px;
        top: 6%;
        left: 10%;
    }

    .self-input {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        margin-left: 10%;
        width: 80%;
    }

    .sign_button {
        margin: 40px auto;
        height: 41px;
        cursor: pointer;
        line-height: 41px;
        /*float: left;*/
        width: 80%;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 2px;
    }

    .sign_button {
        color: white;
        background-color: #0387D8;
    }

    input:-ms-input-placeholder {
        color: #606266;
    }

    /* Internet Explorer 10+ */
    input::-webkit-input-placeholder {
        color: #606266;
    }

    /* WebKit browsers */
    input::-moz-placeholder {
        color: #606266;
    }

    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
        color: #606266;
    }

    /* Mozilla Firefox 19+ */
</style>