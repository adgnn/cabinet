<template>
    <div class="user">
        <el-dialog title="修改密码" width="40%" :visible.sync="dialogVisible" :before-close="closeDetail">
            <el-form :model="PasswordForm" :rules="PassRules" ref="PasswordForm" label-position="right"
                     label-width="100px">
                <el-form-item label="旧密码" prop="old">
                    <el-input placeholder="请输入旧密码" v-model="PasswordForm.old" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input placeholder="请输入新的密码" v-model="PasswordForm.pass" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input placeholder="请再次输入新密码" v-model="PasswordForm.checkPass"
                              type="password"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: right">
                <el-button @click="closeDetail">取消</el-button>
                <el-button type="primary" @click="confirmPass('PasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <div class="left">
            <div class="title">智能云柜管理系统</div>
            <el-menu :router="true" class="el-menu-vertical-demo" text-color="white" background-color="#5455B0"
                     active-text-color="white"
                     :unique-opened="true">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="fa fa-address-card" aria-hidden="true"></i>
                        <span class="little_title">客户管理</span>
                    </template>
                    <el-menu-item index="/user/checkUser"><span>查询客户</span></el-menu-item>
                    <el-menu-item index="/user/addUser"><span>新增客户</span></el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="fa fa-th-list" aria-hidden="true"></i>
                        <span class="little_title">设备管理</span>
                    </template>
                    <el-menu-item index="/user/checkDevice"><span>设备查询</span></el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="fa fa-window-restore" aria-hidden="true"></i>
                        <span class="little_title">系统管理</span>
                    </template>
                    <el-menu-item index="/user/userSet"><span>用户设置</span></el-menu-item>
                    <el-menu-item index="/user/parameterSet"><span>参数设置</span></el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="fa fa-cog" aria-hidden="true"></i>
                        <span class="little_title">维修管理</span>
                    </template>
                    <el-menu-item index="/user/checkRepair"><span>查询维修单</span></el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="right">
            <div class="right_top">
                <div class="right_top_name" @click="showDetail">
                    <span>智能云柜后台管理员</span>
                    <i class="fa fa-caret-right" aria-hidden="true" v-show="!show_box"></i>
                    <i class="fa fa-caret-down" aria-hidden="true" v-show="show_box"></i>
                </div>
                <div class="right_top_detail" v-show="show_box">
                    <div class="top">
                        <div class="top_name">{{companyName}}</div>
                        <div class="status">工作状态：正常</div>
                    </div>
                    <div class="down">
                        <div class="change_password" @click="change_password">修改密码</div>
                        <div class="exit" @click="exit">退出云柜</div>
                    </div>
                </div>
            </div>
            <div class="right_down">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

    import {
        mapState,
        mapMutations,
    } from 'vuex'
    import md5 from 'js-md5'

    export default {
        name: "Menu",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.PasswordForm.checkPass !== '') {
                        this.$refs.PasswordForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.PasswordForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,//修改密码框是否弹出
                show_box: false,//个人中心弹框是否展示
                PasswordForm: {//修改密码
                    old: '',
                    pass: '',
                    checkPass: ''
                },
                PassRules: {//修改密码验证规则
                    old: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    pass: [
                        {required: true, message: '请输入新密码', validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {required: true, message: '请再次输入新密码', validator: validatePass2, trigger: 'blur'}
                    ]
                },
                companyName:'',//公司名称
            }
        },
        methods: {
            showDetail() {
                //个人中心是否展示
                this.show_box = this.show_box ? false : true;
            },
            resetForm(formName) {
                //重置修改密码或者修改信息的表单
                this.$refs[formName].resetFields();
            },
            confirmPass(formName) {
                //修改密码
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let oldPass = md5(this.PasswordForm.old + 'ashley');
                        let newPass = md5(this.PasswordForm.pass + 'ashley');

                        this.$post("/emp/changeP", {
                            "oldpassword": md5(oldPass + 'ashley'),
                            "newpassword": md5(newPass + 'ashley'),
                        })
                            .then((res) => {
                                this.closeDetail();
                                this.$success("修改密码成功");
                            })
                            .catch((err) => {
                                this.$fail("修改密码失败")
                            });
                    }
                })
            },

            closeDetail() {
                //关闭之前清空修改密码框
                this.PasswordForm = {
                    old: '',
                    pass: '',
                    checkPass: ''
                };
                this.dialogVisible = false;
            },
            change_password() {
                //修改密码
                this.dialogVisible = true;
                this.show_box = false;
            },
            exit() {
                //退出
                this.$router.push('/sign');
            },
        },
        computed: {
            ...mapState({
                role: state => state.role,
            })
        },
        mounted() {
            this.companyName = this.role;
        },
    }
</script>

<style scoped>
    .user {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .title {
        color: white;
        background-color: #3A3D89;
        font-size: 16px;
        height: 70px;
        line-height: 70px;
        margin-bottom: 40px;
    }

    .left {
        text-align: center;
        box-sizing: border-box;
        background-color: #5455B0;
        width: 190px;
        min-height: 100%;
        left: 0;
        z-index: 2;
        top: 0;
        bottom: 0;
        position: fixed;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .little_title {
        font-size: 17px;
    }

    .right {
        box-sizing: border-box;
        height: 100%;
        margin-left: 190px;
    }

    span {
        font-size: 15px;
    }

    .el-menu {
        border: 1px solid #5455B0;
    }

    .el-menu-item {
        padding-left: 60px !important;
    }

    .left .el-menu-item.is-active {
        background-color: #3A3D89 !important;
    }

    .left .fa {
        font-size: 16px;
        color: white;
        margin-right: 10px;
    }

    .right_top {
        height: 70px;
        position: relative;
    }

    .right_top_name {
        float: right;
        margin-right: 80px;
        height: 70px;
        line-height: 70px;
        cursor: pointer;
    }

    .right_down {
        box-sizing: border-box;
        height: calc(100% - 70px);
        background-color: #F8F8F8;
        border: 1px solid #F8F8F8;
    }

    .right_top_detail {
        background-color: white;
        position: absolute;
        width: 200px;
        top: 70px;
        right: 40px;
        box-shadow: #D4D7D9 0 1px 10px;
        z-index: 100;
    }

    .right_top_detail .top {
        margin: 10px 0 7px 0;
        box-sizing: border-box;
        padding-bottom: 7px;
        padding-left: 5px;
        border-bottom: 1px solid #D4D7D9;
    }

    .right_top_detail .down {
        margin: 0 0 10px 0;
    }

    .change_password, .exit {
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding-left: 5px;
    }

    .change_password:hover, .exit:hover {
        background-color: #F6F6F6;
    }

    .right .fa {
        color: #D4D7D9;
        position: absolute;
        right: 60px;
        top: 25px;
    }

</style>