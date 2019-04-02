<template>
    <div class="userSet">
        <!--删除弹出框-->
        <el-dialog title="确定删除该账户?" :visible.sync="show_del" width="40%" :before-close="del_close">
            <span class="dialog-footer">
                <el-button @click="show_del=false">取 消</el-button>
                <el-button type="primary" @click="del_sure">确 定</el-button>
           </span>
        </el-dialog>
        <!--编辑弹出框-->
        <el-dialog title="新增用户" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="用户组:">
                    <el-button v-for="item in users" class="user_s" :key="item.sysRoleId"
                               @click="user(item.sysRoleId)">
                        {{item.sysRoleName}}
                    </el-button>
                </el-form-item>
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="edit.name"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone">
                    <el-input v-model="edit.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pass">
                    <el-input v-model="edit.pass"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: right">
                <el-button @click="edit_close">取 消</el-button>
                <el-button type="primary" @click="edit_sure('edit')">确 定</el-button>
            </div>
        </el-dialog>

        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询成员</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="用户名称">
                        <el-input v-model="inquireForm.user_name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组名称">
                        <el-input v-model="inquireForm.users_name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search_button" @click="inquire">查询</el-button>
                        <el-button @click="getAll">全部</el-button>
                        <el-button @click="edit">新增用户</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="编码" align="center" prop="sysUserId"></el-table-column>
                <el-table-column label="名称" align="center" prop="sysUserName"></el-table-column>
                <el-table-column label="电话" align="center" prop="sysUserPhone"></el-table-column>
                <el-table-column label="用户组名称" align="center" prop="sysGroup.sysGroupName"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 20px">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="page.currentPage"
                        :page-size="page.pageSize"
                        layout="prev, pager, next, jumper"
                        :total="page.total"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userSet",
        data() {
            return {
                inquireForm: {
                    user_name: '', //用户名称查询
                    users_name: '', //用户组名称查询
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },

                users: [],//所有用户组
                show_edit: true,
                edit: {
                    name: '',
                    phone: '',
                    pass: '',
                    user_id: '',//目前选中的用户组id
                },


                show_del: false,
                del_id: null,//要删除的成员id
                rules: {//修改信息验证规则
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入联系方式', trigger: 'blur'}],
                    pass: [{required: true, message: '请输入密码', trigger: 'blur'}],
                }
            }
        },
        methods:
            {
                handleCurrentChange() {
                    //分页
                    this.getData(this.page.currentPage, this.page.pageSize);
                },
                getData(page, pageSize) {
                    //获取成员信息
                    let search = {};
                    if (this.inquireForm.user_name) {
                        search.sysUserName = this.inquireForm.user_name;
                    }
                    if (this.inquireForm.users_name) {
                        search.sysGroupName = this.inquireForm.users_name;
                    }
                    this.$post('/sys/getU', {
                        "search": search,
                        "pageStr": {
                            "page": page,
                            "size": pageSize
                        }
                    })
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.tableData = res.data.content.content;
                                this.page.total = res.data.content.totalElements;
                            } else {
                                this.$fail(res.data.message);
                            }
                        })
                        .catch((err) => {
                            this.$fail("获取用户信息失败")
                        })
                },
                inquire() {
                    //查询
                    this.page.currentPage = 1;
                    this.page.pageSize = 8;
                    this.getData(this.page.currentPage, this.page.pageSize);
                },
                getAll() {
                    //获取所有的信息
                    this.inquireForm.user_name = '';
                    this.inquireForm.users_name = '';
                    this.getData(this.page.currentPage, this.page.pageSize);
                },

                getUsers() {
                    //获取用户组
                    this.$get('/sys/getG')
                        .then((res) => {
                            this.users = res.data.sysRoles;
                        })
                        .catch((err) => {
                            this.$fail("获取用户组信息失败")
                        })
                },
                user(id) {
                    this.edit.user_id = id;
                },

                edit() {
                    this.show_edit = true;
                },
                edit_sure(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$post('/sys/addU', {
                                "sysUserId": this.edit.user_id,
                                "sysUserPhone": this.edit.phone,
                                "sysUserName": this.edit.name,
                                "sysUserPassword": this.edit.pass
                            })
                                .then((res) => {
                                    this.edit_close();
                                    this.$success("编辑成员信息成功")
                                })
                                .catch((err) => {
                                    this.$fail('编辑成员信息失败')
                                })
                        }
                    });
                },
                edit_close() {
                    this.edit = {
                        name: '',
                        phone: '',
                        pass: '',
                        user_id: ''
                    };
                    this.show_edit = false;
                },

                del(row) {
                    this.del_id = row.sysUserId;
                    this.show_del = true;
                },
                del_sure() {
                    //确认删除某个成员信息
                    this.$get(`/sys/delU/${this.del_id}`)
                        .then((res) => {
                            this.del_close();
                            this.$success("删除成功")
                        })
                        .catch((err) => {
                            this.$fail("删除失败")
                        })
                },
                del_close() {
                    this.del_id = null;
                    this.show_del = false;
                },

            }
        ,
        mounted() {
            // this.getData(this.page.currentPage, this.page.pageSize);
            //this.getUsers();
            document.getElementsByClassName("user_s")[0].click();

        }
    }
</script>

<style scoped>
    .userSet {
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        height: 100%;
    }

    .search {
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        padding-bottom: 30px;
        box-sizing: border-box;
        background-color: white;
    }

    .search_title_box {
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

    .search_title {
        display: block;
        float: left;
        margin-top: 28px;
        margin-left: 15px;
        letter-spacing: 1.2px;
        font-size: 18px;
        color: #000000;
        font-weight: 500;
    }

    .search_box {
        margin-left: 50px;
        margin-top: 10px;
    }

    .search_button {
        color: white;
        background-color: #5455B0;
    }

    .table {
        /*min-height:calc(100% - 230px);*/
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        background-color: white;
        height: calc(100% - 230px);
    }
</style>