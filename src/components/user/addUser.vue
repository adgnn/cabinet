<template>
    <div class="addUser">
        <div class="title_box">
            <span class="square"></span>
            <span class="title">新增客户</span>
        </div>
        <div class="label">公司名称：</div>
        <el-input v-model="form.name" class="input" placeholder="请输入公司名称"></el-input>
        <div class="label">联系方式：</div>
        <el-input v-model="form.phone" class="input" placeholder="请输入联系方式"></el-input>
        <div class="label">公司地址：</div>
        <el-input v-model="form.address" class="input" placeholder="请输入公司地址"></el-input>
        <div class="button_box">
            <div class="submit" @click="submit">提交</div>
            <div class="reset" @click="reset">重置</div>
        </div>
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
            }
        },
        methods: {
            reset() {
                this.form = {
                    name: '',
                    phone: '',
                    address: '',
                };
            },
            submit() {
                if (this.form.name === '') {
                    this.$message("请填写公司名称");
                    return
                }
                if (this.form.phone === '') {
                    this.$message("请填写联系方式");
                    return
                }
                if (this.form.address === '') {
                    this.$message("请填写公司地址");
                    return
                }
                this.$post('/sys/ic', {
                    "company": this.form.name,
                    "address": this.form.address,
                    "phone": this.form.phone,
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$success("新增成功");
                            this.reset();
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("新增失败");
                    })
            }
        },
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

    .submit, .reset {
        float: left;
        height: 41px;
        cursor: pointer;
        line-height: 41px;
        width: 100px;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 2px;
    }

    .submit {
        background-color: #5455B0;
        color: white;
    }

    .reset {
        border: 1px solid #707070;
        color: #707070;
        background-color: white;
        margin-left: 30px;
    }

    .button_box {
        height: 41px;
        width: 230px;
        margin: 50px auto;
    }
</style>