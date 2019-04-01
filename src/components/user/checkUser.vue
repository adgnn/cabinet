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
                    pageSize: 10, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
            }
        },
        methods: {
            reset(formName) {
                //重置查询的类型或者时间
                this.$refs[formName].resetFields();
            },
            editor(row) {
            },
            delete(row) {
            },
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
        margin:30px 0 0 5%;
        box-sizing: border-box;
        padding-bottom:30px;
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