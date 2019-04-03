<template>
    <div class="accessLogs">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">查询存取记录</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="成员编码">
                        <el-input v-model="inquireForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
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
                        <el-input v-model="inquireForm.thing" placeholder="请输入"></el-input>
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
                        <el-button @click="getAll">全部</el-button>
                        <el-button @click="getExcel">导出Excel</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="成员编码" align="center" prop="emp.comEmpId"></el-table-column>
                <el-table-column label="名称" align="center" prop="emp.empName"></el-table-column>
                <el-table-column label="物品编码" align="center" prop="goods.goodsId"></el-table-column>
                <el-table-column label="物品名称" align="center" prop="goods.goodsName"></el-table-column>
                <el-table-column label="借出时间" align="center" prop="outTime"></el-table-column>
                <el-table-column label="归还时间" align="center" prop="inTime"></el-table-column>
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
        name: "accessLogs",
        data() {
            return {
                inquireForm: {
                    code: '',
                    time: '',
                    thing: '',
                    status: '',
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
                    statuses: [
                        {
                            value: true,
                            label: "已归还"
                        },
                        {
                            value: false,
                            label: "未归还"
                        }
                    ],
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
                //获取存取记录
                console.log(this.inquireForm.time);
                let search = {};
                if (this.inquireForm.code) {
                    search.comEmpId = this.inquireForm.code;
                }
                if (this.inquireForm.time !== '') {
                    search.startTime = this.inquireForm.time;
                }
                if (this.inquireForm.status !== '') {
                    search.status = this.inquireForm.status;
                }
                if (this.inquireForm.thing) {
                    search.goodsName = this.inquireForm.thing;
                }
                this.$post('/equ/log', {
                    "search": JSON.stringify(search),
                    "pageStr": {
                        "page": page,
                        "size": pageSize
                    }
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.tableData = res.data.content.content.content;
                            this.page.total = res.data.content.content.totalElements;
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("获取存取记录失败")
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
                this.inquireForm.status = '';
                this.inquireForm.time = '';
                this.inquireForm.thing = '';
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            getExcel() {
                let search = {};
                if (this.inquireForm.code) {
                    search.comEmpId = this.inquireForm.code;
                }
                if (this.inquireForm.status) {
                    search.startTime = this.inquireForm.time;
                }
                if (this.inquireForm.phone) {
                    search.status = this.inquireForm.status;
                }
                if (this.inquireForm.thing) {
                    search.goodsName = this.inquireForm.thing;
                }
                this.$post('equ/excel', {
                    "search": search,
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$success("导出excel成功")
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("导出excel失败")
                    })
            },
        },
        mounted() {
            this.getData(this.page.currentPage, this.page.pageSize);
        }
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
        margin-top: 20px;
        height: 210px;
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
        height: calc(100% - 250px);
    }
</style>