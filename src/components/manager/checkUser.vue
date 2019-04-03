<template>
    <div class="checkUser">
        <!--删除弹出框-->
        <el-dialog title="确定删除该账户?" :visible.sync="show_del" width="40%" :before-close="del_close">
            <span class="dialog-footer">
                <el-button @click="show_del=false">取 消</el-button>
                <el-button type="primary" @click="del_sure">确 定</el-button>
           </span>
        </el-dialog>
        <!--编辑弹出框-->
        <el-dialog title="成员信息编辑" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="edit.name"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="edit.phone"></el-input>
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
                    <el-form-item label="编码查询">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="状态查询">
                        <el-select v-model="inquireForm.status" placeholder="请选择">
                            <el-option
                                    v-for="item in inquireForm.types"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话查询">
                        <el-input v-model="inquireForm.phone" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search_button" @click="inquire">查询</el-button>
                        <el-button @click="getAll">全部</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="编码" align="center" prop="comEmpId"></el-table-column>
                <el-table-column label="名称" align="center" prop="empName"></el-table-column>
                <el-table-column label="电话" align="center" prop="empPhone"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="edit_mes(scope.row)" type="text" size="small">编辑</el-button>
                        <!--<el-button @click="del(scope.row)" type="text" size="small">删除</el-button>-->
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
        name: "checkUser",
        data() {
            return {
                inquireForm: {
                    code: '', //编码查询
                    status: '', //状态查询
                    phone: '',//电话查询
                    types: [
                        {
                            value: true,
                            label: "正常",
                        },
                        {
                            value: false,
                            label: "未激活",
                        }
                    ]
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 7, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
                edit_id: '',
                show_edit: false,
                show_del: false,
                del_id: null,//要删除的成员信息
                edit: {
                    name: '',//编辑的名称
                    phone: '',//编辑的电话
                },

                rules: {//修改信息验证规则
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入联系方式', trigger: 'blur'}]
                }
            }
        },
        methods: {
            handleCurrentChange() {
                //分页
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getData(page, pageSize) {
                //获取成员信息
                let search = {};
                if (this.inquireForm.code) {
                    search.empId = this.inquireForm.code;
                }
                if (this.inquireForm.status !== '') {
                    search.status = this.inquireForm.status;
                }
                if (this.inquireForm.phone) {
                    search.phone = this.inquireForm.phone;
                }
                this.$post('/emp/info', {
                    "search": JSON.stringify(search),
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
                this.page.pageSize = 7;
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getAll() {
                //获取所有的信息
                this.inquireForm.code = '';
                this.inquireForm.status = '';
                this.inquireForm.phone = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            edit_mes(row) {
                this.edit_id = row.comEmpId;
                this.show_edit = true;
            },
            edit_sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post('/emp/setInfo', {
                            "empId": this.edit_id,
                            "empName": this.edit.name,
                            "empPhone": this.edit.phone,
                        })
                            .then((res) => {
                                if (res.data.code === 0) {
                                    this.edit_close();
                                    this.getData(this.page.currentPage, this.page.pageSize);
                                    this.$success("编辑成员信息成功")
                                } else {
                                    this.$fail(res.data.message);
                                }
                            })
                            .catch((err) => {
                                this.$fail('编辑成员信息失败')
                            })
                    }
                });
            },
            edit_close() {
                this.edit_id = '';
                this.edit = {
                    name: '',
                    phone: '',
                };
                this.$refs['edit'].resetFields();
                this.show_edit = false;
            },

            del(row) {
                this.del_id = row.empId;
                this.show_del = true;
            },
            del_sure() {
                //确认删除某个成员信息
                this.$get(`emp/delEmp/${this.del_id}`)
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.del_close();
                            this.getData(this.page.currentPage, this.page.pageSize);
                            this.$success("删除成功")
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("删除失败")
                    })
            },
            del_close() {
                this.del_id = null;
                this.show_del = false;
            }

        },
        mounted() {
            this.getData(this.page.currentPage, this.page.pageSize);
        }
    }
</script>

<style scoped>
    .checkUser {
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        height: 100%;
    }

    .search {
        width: 90%;
        margin-left: 5%;
        margin-top: 20px;
        height: 160px;
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
        margin-top: 20px;
        background-color: white;
        height: calc(100% - 200px);
    }
</style>