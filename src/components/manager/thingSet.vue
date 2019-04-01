<template>
    <div class="thingSet">
        <!--编辑弹出框-->
        <el-dialog title="物品名称编辑" :visible.sync="show_edit" width="40%" :before-close="edit_close">
            <el-form :model="edit" ref="edit" :rules="rules" label-position="right" label-width="100px"
                     style="margin: 0 auto;">
                <el-form-item label="物品名称：" prop="name">
                    <el-input v-model="edit.name"></el-input>
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
                <span class="search_title">物品设置</span>
            </div>
            <div class="search_box">
                <el-form :model="inquireForm" ref="inquireForm" :inline="true">
                    <el-form-item label="设备编码:">
                        <el-button v-for="item in things" class="equipment" :key="item.equId"
                                   @click="equipment(item.equId)">
                            {{item.equId}}
                        </el-button>
                        <!--<el-button @click="reset('inquireForm')">001</el-button>-->
                        <!--<el-button @click="reset('inquireForm')">002</el-button>-->
                        <!--<el-button @click="reset('inquireForm')">003</el-button>-->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column label="物品栏" align="center" prop="goodsId"></el-table-column>
                <el-table-column label="物品名称" align="center" prop="goodsName"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
        name: "thingSet",
        data() {
            return {
                things: [],
                tableData: [],
                page: {
                    //分页
                    pageSize: 8, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
                equipment_id: null,
                show_edit: true,
                edit_id: null,//要编辑的物品id（物品栏id）

                edit: {
                    name: '',//编辑物品的名字
                },
                rules: {//修改信息验证规则
                    name: [{required: true, message: '请输入要修改的物品名称', trigger: 'blur'}],
                }
            }
        },
        methods: {
            getThing() {
                this.$get('equ/info')
                    .then((res) => {
                        this.things = res.data.content
                    })
                    .catch((err) => {
                        this.$fail('获取设备列表失败');
                    })
            },
            equipment(id) {
                this.equipment_id = id;
                this.getData(this.page.currentPage, this.page.pageSize);
            },

            handleCurrentChange() {
                //分页
                this.getData(this.page.currentPage, this.page.pageSize);
            },
            getData(page, pageSize) {
                //获取物品信息
                let search = {
                    "equId": this.equipment_id
                };
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


            edit(row) {
                this.edit_id = row.goodsId;
                this.show_edit = true;
            },
            edit_sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$get(`/equ/ship/${this.equipment_id}/${this.edit_id}/${this.edit.name}`)
                            .then((res) => {
                                this.$success("编辑物品名称成功")
                            })
                            .catch((err) => {
                                this.$fail('编辑物品名称失败')
                            })
                    }
                });
            },
            edit_close() {
                this.edit_id = null;
                this.edit.name = "";
                this.show_edit = false;
            },
        },
        mounted() {
            // this.getThing();
            document.getElementsByClassName("equipment")[0].click();
        }
    }
</script>

<style scoped>
    .thingSet {
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