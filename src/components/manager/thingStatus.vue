<template>
    <div class="thingStatus">
        <!--转借物品弹出框-->
        <el-dialog title="转借物品" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="borrow" ref="inquireForm" :inline="true">
                <el-form-item label="成员编号或者姓名">
                    <el-input v-model="borrow.id" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search_button" @click="borrow_search">搜索用户</el-button>
                </el-form-item>
                <br/>
                <el-form-item label="请选择成员:">
                    <el-select v-model="edit.empId" placeholder="请选择">
                        <el-option
                                v-for="item in users"
                                :key="item.empId"
                                :label="item.empName"
                                :value="item.empId"
                        ></el-option>
                    </el-select>
                    <!--<el-button v-for="item in users" class="search_s" :key="item.empId"-->
                    <!--@click="click_searchUser(item.empId)">-->
                    <!--{{item.empName}}-->
                    <!--</el-button>-->
                </el-form-item>
                <div class="dialog-footer" style="text-align: right">
                    <el-button @click="edit_sure('edit')">确认转借</el-button>
                </div>
            </el-form>
        </el-dialog>

        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询物品状态</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="物品编号">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="物品名称">
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
                <el-table-column label="物品编码" align="center" prop="equGoodsOrder"></el-table-column>
                <el-table-column label="物品名称" align="center" prop="goodsName"></el-table-column>
                <el-table-column label="所在设备" align="center" prop="equId"></el-table-column>
                <el-table-column label="物品状态" align="center" prop="isExist"></el-table-column>
                <el-table-column label="借取人" align="center" prop="takeUser"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="edit_borrow(scope.row)" type="text" size="small">转借</el-button>
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
        name: "thingStatus",
        data() {
            return {
                inquireForm: {
                    code: '', //物品编码查询
                    name: '',//物品名称查询
                },
                tableData: [],
                page: {
                    //分页
                    pageSize: 7, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },

                borrow: {
                    id: ''//转借搜索成员编码或者姓名
                },
                users: [],//转借弹出框的搜索成员列表

                show_edit: false,
                edit: {
                    goodsId: '',
                    empId: '',
                },
            }
        },
        methods: {
            handleCurrentChange() {
                //分页
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getData(page, pageSize) {
                //获取物品信息
                let search = {};
                if (this.inquireForm.code) {
                    search.equGoodsOrder = this.inquireForm.code;
                }
                if (this.inquireForm.name) {
                    search.goodsName = this.inquireForm.name;
                }
                this.$post('/equ/getGoodsInfo', {
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
                        this.$fail("获取物品信息失败")
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
                this.inquireForm.name = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            edit_borrow(row) {
                if (row.isExist === "未取走") {
                    this.$message("物品未取走，不能转借");
                    return
                }
                this.edit.goodsId = row.goodsId;
                this.show_edit = true;
            },
            edit_sure() {
                if (this.edit.empId === '') {
                    this.$message("请选择转借人");
                    return
                }
                this.$get(`equ/ul/${this.edit.goodsId}/${this.edit.empId}`)
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.edit_close();
                            this.getData(this.page.currentPage, this.page.pageSize);
                            this.$success("物品转借成功")
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail('物品转借失败')
                    })
            },
            edit_close() {
                this.edit = {
                    goodsId: '',
                    empId: '',
                };
                this.borrow.id = '';
                this.edit.empId = '';
                this.show_edit = false;
            },
            borrow_search(row) {
                if (!this.borrow.id) {
                    this.$message("请输入要搜索的成员编号或者姓名");
                    return
                }
                this.$post('/emp/searchInfo', {
                    "search": this.borrow.id
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.users = res.data.content;
                            this.$success("搜索成功，请选择转借人")
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("搜索失败")
                    })
            },
            // click_searchUser(id) {
            //     this.edit.empId = id;
            // }
        },
        watch: {
            tableData: function () {
                let length = this.tableData.length;
                for (let i = 0; i < length; i++) {
                    this.tableData[i].isExist = this.tableData[i].isExist ? "未取走" : "已取走";
                }
            }
        },
        mounted() {
            this.getData(this.page.currentPage, this.page.pageSize);
        },
    }
</script>

<style scoped>
    .thingStatus {
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