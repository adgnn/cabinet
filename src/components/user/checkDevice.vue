<template>
    <div class="checkDevice">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">设备列表查询</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="设备编码">
                        <el-input v-model="inquireForm.equipmentCode" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="公司编码">
                        <el-input v-model="inquireForm.companyCode" placeholder="请输入"></el-input>
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
                <el-table-column label="设备编码" align="center" prop="equId"></el-table-column>
                <el-table-column label="公司编码" align="center" prop="company.comId"></el-table-column>
                <el-table-column label="公司名称" align="center" prop="company.comName"></el-table-column>
                <el-table-column label="售出时间" align="center" prop="createTime"></el-table-column>
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
        name: "checkDevice",
        data() {
            return {
                inquireForm: {
                    equipmentCode: '', //设备编号
                    companyCode: '', //公司编号
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
                //获取设备列表
                let search = {};
                if (this.inquireForm.equipmentCode) {
                    search.equId = this.inquireForm.equipmentCode;
                }
                if (this.inquireForm.companyCode) {
                    search.comId = this.inquireForm.companyCode;
                }
                this.$post('/equ/info', {
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
                this.page.pageSize = 8;
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getAll() {
                //获取所有的信息
                this.inquireForm.equipmentCode = '';
                this.inquireForm.companyCode = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },
        },
        mounted() {
            this.getData(this.page.currentPage, this.page.pageSize);
        }
    }
</script>

<style scoped>
    .checkDevice {
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        height: 100%;
    }

    .search {
        width: 90%;
        margin: 20px 0 0 5%;
        box-sizing: border-box;
        height:160px;
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