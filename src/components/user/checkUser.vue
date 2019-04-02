<template>
    <div class="checkUser">
        <!--编辑弹出框-->
        <el-dialog title="关联设备" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="设备编号：" prop="equId">
                    <el-input v-model="edit.equId"></el-input>
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
                    <el-form-item label="公司编号">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="公司名称">
                        <el-input v-model="inquireForm.name" placeholder="请输入"></el-input>
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
                <el-table-column label="公司编码" align="center" prop="comId"></el-table-column>
                <el-table-column label="公司名称" align="center" prop="comName"></el-table-column>
                <el-table-column label="联系方式" align="center" prop="comAdminPhone"></el-table-column>
                <el-table-column label="公司地址" align="center" prop="comAddress"></el-table-column>
                <el-table-column label="创建日期" align="center" prop="createTime"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">关联设备</el-button>
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
                    code: '', //公司编号
                    name: '',//公司名称
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
                show_edit: true,

                edit: {
                    equId: '',//关联的设备的id
                    comId: '',//公司id
                },

                rules: {//修改信息验证规则
                    equId: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
                }
            }
        },
        methods: {
            handleCurrentChange() {
                //分页
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getData(page, pageSize) {
                //获取公司信息
                let search = {};
                if (this.inquireForm.code) {
                    search.comId = this.inquireForm.code;
                }
                if (this.inquireForm.name) {
                    search.comName = this.inquireForm.name;
                }
                this.$post('/sys/getC', {
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
                this.inquireForm.name = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            edit(row) {
                this.edit.comId = row.comId;
                this.show_edit = true;
            },
            edit_sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$get(`sys/rec/${this.edit.equId}/${this.edit.comId}`)
                            .then((res) => {
                                this.$success("关联设备成功")
                            })
                            .catch((err) => {
                                this.$fail('关联设备失败')
                            })
                    }
                });
            },
            edit_close() {
                this.edit = {
                    equId: '',//关联的设备的id
                    comId: '',//公司id
                };
                this.show_edit = false;
            },


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