<template>
    <div class="addUser">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询存取记录</span>
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
                    <el-form-item label="物品查询">
                        <el-select v-model="inquireForm.thing" placeholder="请选择">
                            <el-option
                                    v-for="item in inquireForm.things"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态查询">
                        <el-select v-model="inquireForm.status" placeholder="请选择">
                            <el-option
                                    v-for="item in inquireForm.statuses"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
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
                <el-table-column label="编码" align="center" prop=""></el-table-column>
                <el-table-column label="名称" align="center" prop=""></el-table-column>
                <el-table-column label="电话" align="center" prop=""></el-table-column>
                <el-table-column label="创建时间" align="center" prop=""></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="editor(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="delete(scope.row)" type="text" size="small">删除</el-button>
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
        name: "checkDevice"
    }
</script>

<style scoped>
    .accessLogs {
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        height: 100%;
    }

    .search {
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        height: 170px;
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