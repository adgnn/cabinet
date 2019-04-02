<template>
    <div class="parameterSet">
        <!--编辑弹出框-->
        <el-dialog title="参数信息编辑" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="参数名称：" prop="name">
                    <el-input v-model="edit.name"></el-input>
                </el-form-item>
                <el-form-item label="参数值：" prop="value">
                    <el-input v-model="edit.value"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: right">
                <el-button @click="edit_close">取 消</el-button>
                <el-button type="primary" @click="edit_sure('edit')">确 定</el-button>
            </div>
        </el-dialog>

        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="参数Id" align="center" prop="sysParamId"></el-table-column>
                <el-table-column label="参数名称" align="center" prop="sysParamMark"></el-table-column>
                <el-table-column label="参数值" align="center" prop="sysParamContent"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
        name: "parameterSet",
        data() {
            return {
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },

                show_edit: false,
                edit: {
                    param_id: '',
                    name: '',
                    value: '',
                },

                rules: {//修改信息验证规则
                    name: [{required: true, message: '请输入参数名', trigger: 'blur'}],
                    value: [{required: true, message: '请输入参数值', trigger: 'blur'}]
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
                this.$post('/sys/getP ', {
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

            edit(row) {
                this.edit.param_id = row.sysParamId;
                this.show_edit = true;
            },
            edit_sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post('/sys/setP', {
                            "sysParamId": this.edit.param_id,
                            "sysParamMark": this.edit.name,
                            "sysParamContent": this.edit.value,
                        })
                            .then((res) => {
                                this.$success("编辑参数信息成功")
                            })
                            .catch((err) => {
                                this.$fail('编辑参数信息失败')
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


        },
        mounted() {
            // this.getData(this.page.currentPage, this.page.pageSize);
        }
    }
</script>

<style scoped>
    .parameterSet {
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        height: 100%;
    }

    .table {
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        background-color: white;
        height: calc(100% - 30px);
    }
</style>