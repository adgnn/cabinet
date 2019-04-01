<template>
    <div class="checkUser">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询成员</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="公司编号">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称">
                        <el-input v-model="inquireForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="search_button" @click="inquire">查询</el-button>
                        <el-button @click="reset('inquireForm')">全部</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="公司编码" align="center" prop=""></el-table-column>
                <el-table-column label="公司名称" align="center" prop=""></el-table-column>
                <el-table-column label="联系方式" align="center" prop=""></el-table-column>
                <el-table-column label="公司地址" align="center" prop=""></el-table-column>
                <el-table-column label="创建日期" align="center" prop=""></el-table-column>
                <el-table-column label="设备编号" align="center" prop=""></el-table-column>
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
                    code: '', //公司编号
                    name: '', //公司名称
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
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
                if (this.inquireForm.status) {
                    search.status = this.inquireForm.status;
                }
                if (this.inquireForm.phone) {
                    search.phone = this.inquireForm.phone;
                }
                this.$post('/emp/info', {
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
                this.inquireForm.code = '';
                this.inquireForm.status = null;
                this.inquireForm.phone = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            edit(row) {
                this.editData = row;
                this.show_edit = true;
            },
            edit_sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editData.empName = this.edit.name;
                        this.editData.phone = this.edit.phone;
                        this.$post('/emp/setInfo', this.editData)
                            .then((res) => {
                                this.$success("编辑成员信息成功")
                            })
                            .catch((err) => {
                                this.$fail('编辑成员信息失败')
                            })
                    }
                });
            },
            edit_close() {
                this.editData = {};
                this.edit = {
                    name: '',
                    phone: '',
                };
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
                        this.$success("删除成功")
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
            // this.getData(this.page.currentPage, this.page.pageSize);
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
        margin: 30px 0 0 5%;
        box-sizing: border-box;
        padding-bottom: 30px;
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