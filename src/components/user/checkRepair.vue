<template>
    <div class="checkRepair">
        <!--提交维修单弹出框-->
        <el-dialog title="成员信息编辑" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="损坏描述：" prop="note">
                    <el-input v-model="edit.name"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model="edit.phone"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: right">
                <el-button @click="edit_close">取 消</el-button>
                <el-button type="primary" @click="submit_sure('edit')">确 定</el-button>
            </div>
        </el-dialog>
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询维修单</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="时间查询">
                        <el-select v-model="inquireForm.time" placeholder="请选择">
                            <el-option
                                    v-for="item in inquireForm.times"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备编码">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="部件">
                        <el-input v-model="inquireForm.part" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="是否维修">
                        <el-select v-model="inquireForm.isRepair" placeholder="请选择">
                            <el-option
                                    v-for="item in inquireForm.isRepairs"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
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
                <el-table-column label="维修状态" align="center" prop="fixStatus"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
                <el-table-column label="维修单编号" align="center" prop="fixBillId"></el-table-column>
                <el-table-column label="设备编码" align="center" prop="equ.equId"></el-table-column>
                <el-table-column label="公司名称" align="center" prop="equ.company.comName"></el-table-column>
                <el-table-column label="部件" align="center" prop="parts.partsDetail"></el-table-column>
                <el-table-column label="损坏描述" align="center" prop="partsStatus"></el-table-column>
                <el-table-column label="维修人" align="center" prop="sysUserName"></el-table-column>
                <el-table-column label="维修时间" align="center" prop="fixTime"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="submit(scope.row)" type="text" size="small">编辑</el-button>
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
        name: "checkRepair",
        data() {
            return {
                inquireForm: {
                    time: null,//时间查询
                    code: '', //设备编码
                    part: '', //部件
                    isRepair: null,//是否维修
                    times: [
                        {
                            value: 0,
                            label: "最近三天"
                        },
                        {
                            value: 1,
                            label: "最近一周"
                        },
                        {
                            value: 2,
                            label: "最近一月"
                        },
                    ],
                    isRepairs: [
                        {
                            value: true,
                            label: "是"
                        },
                        {
                            value: false,
                            label: "否"
                        }
                    ]
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
                show_edit: true,
                fixed_id: '',//提交维修单的id
                edit: {
                    note: '',
                    phone: '',
                },
                rules: {//提交维修单验证规则
                    note: [{required: true, message: '请输入描述内容', trigger: 'blur'}],
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
                //获取维修单列表
                let search = {};
                if (this.inquireForm.time) {
                    search.createTime = this.inquireForm.time;
                }
                if (this.inquireForm.code) {
                    search.equId = this.inquireForm.code;
                }
                if (this.inquireForm.part) {
                    search.partId = this.inquireForm.part;
                }
                if (this.inquireForm.isRepair) {
                    search.isFixed = this.inquireForm.isRepair;
                }
                this.$post('/equ/fixInfo', {
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
                this.inquireForm.time = null;
                this.inquireForm.isRepair = null;
                this.inquireForm.part = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            submit(row) {
                if (row.fixStatus === "已维修") {
                    this.$message("已经进行维修，不可提交");
                    return
                }
                this.fixed_id = row.fixBillId;
                this.show_edit = true;
            },
            submit_sure(formName) {
                //提交维修单
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post(`/equ/fix/${this.fixed_id}`, {
                            "note": this.edit.note,
                            "phone": this.edit.phone,
                        })
                            .then((res) => {
                                if (res.data.code === 0) {
                                    this.getData(this.page.currentPage, this.page.pageSize);
                                    this.$success("提交维修单成功")
                                } else {
                                    this.$fail(res.data.message);
                                }
                            })
                            .catch((err) => {
                                this.$fail("提交维修单失败")
                            })
                    }
                });

            },
            edit_close() {
                this.fixed_id = '';
                this.edit = {
                    note: '',
                    phone: '',
                };
                this.$refs['edit'].resetFields();
                this.show_edit = false;
            },

        },
        mounted() {
            // this.getData(this.page.currentPage, this.page.pageSize);
        },
        watch: {
            tableData: function () {
                let length = this.tableData.length;
                for (let i = 0; i < length; i++) {
                    this.tableData[i].fixStatus = this.tableData[i].fixStatus ? "已维修" : "未维修";
                }
            }
        }
    }
</script>

<style scoped>
    .checkRepair {
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