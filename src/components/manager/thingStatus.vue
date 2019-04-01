<template>
    <div class="thingStatus">
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
                        <el-button @click="reset('inquireForm')">全部</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="物品编码" align="center" prop="goodsId"></el-table-column>
                <el-table-column label="物品名称" align="center" prop="goodsName"></el-table-column>
                <el-table-column label="设备编码" align="center" prop="equ.equId"></el-table-column>
                <el-table-column label="物品状态" align="center" prop="isExit"></el-table-column>
                <el-table-column label="借取人" align="center" prop="takeUser"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="borrow(scope.row)" type="text" size="small">转借</el-button>
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
                //获取物品信息
                let search = {};
                if (this.inquireForm.code) {
                    search.equGoodsOrder = this.inquireForm.code;
                }
                if (this.inquireForm.name) {
                    search.goodsName = this.inquireForm.name;
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
                        this.$fail("获取物品信息失败")
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

            borrow(row) {

            },
        },
        watch: {
            tableData: function () {
                let length = this.tableData.length;
                for (let i = 0; i < length; i++) {
                    this.tableData[i].isExist = this.tableData[i].isExist ? "未取走" : "已取走";
                }
            }
        }
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