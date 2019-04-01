<template>
    <div class="cabinetDoor">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">柜门管理</span>
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
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">打开柜门</span>
            </div>
            <div class="door">
                <div class="left"><span class="open_door" @click="openDoor('1')">点击开门</span></div>
                <div class="right_top"><span class="open_door" @click="openDoor('2')">点击开门</span></div>
                <div class="right_down"><span class="open_door" @click="openDoor('3')">点击开门</span></div>
            </div>

            <div class="question">
                <div class="title" @click="check">设备自检</div>
                <div class="little_question">
                    {{check}}
                </div>
                <div class="little_note">
                    注：已自动生成维修单上报商家，商家及时上门维修，若取消维修，请拨打1816191617联系商家，取消维修。
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "cabinetDoor",
        data() {
            return {
                things: [],//设备编号
                parts: [],//部件列表
                tableData: [],
                page: {
                    //分页
                    pageSize: 10, //每页显示的信息数目
                    total: 0, //总共的信息数目
                    currentPage: 1 //当前页数
                },
                equipment_id: null,//设备id

                check: '',//设备自检返回结果
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
                this.getParts(this.equipment_id);
            },

            openDoor(doorId) {
                this.$get(`equ/open/${this.equipment_id}/doorId`)
                    .then((res) => {
                        this.$success("正在开门，请稍后")
                    })
                    .catch((err) => {
                        this.$fail("开门失败")
                    })
            },
            check() {
                //设备自检
                this.$get(`equ/check/${this.equipment_id}`)
                    .then((res) => {
                        this.$success("设备自检成功")
                    })
                    .catch((err) => {
                        this.$fail("设备自检失败")
                    })
            },
        },
        mounted() {
            // this.getThing();
            document.getElementsByClassName("equipment")[0].click();
        }
    }
</script>

<style scoped>
    .cabinetDoor {
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

    .table {
        /*min-height:calc(100% - 230px);*/
        width: 90%;
        margin-left: 5%;
        margin-top: 30px;
        background-color: white;
        height: calc(100% - 230px);
    }

    .door {
        /*border: 1px solid black;*/
        clear: both;
        height: 315px;
        width: 415px;
        margin: 0 auto;
        position: relative;
    }

    .left, .right_top, .right_down {
        cursor: pointer;
        box-sizing: border-box;
        border: 4px solid #5455B0;
        position: absolute;
        border-radius: 10px;
    }

    .open_door {
        display: block;
        text-align: center;
        height: 150px;
        line-height: 150px;
    }

    .left .open_door {
        height: 315px;
        line-height: 315px;
    }

    .left {
        width: 200px;
        height: 315px;
        /*background-color: red;*/
        top: 0;
        left: 0;
    }

    .right_top {
        width: 200px;
        height: 150px;
        top: 0;
        right: 0;
        /*background-color: blue;*/
    }

    .right_down {
        width: 200px;
        height: 150px;
        bottom: 0;
        right: 0;
        /*background-color: yellow;*/
    }

    .question {
        clear: both;
        border: 1px solid white;
    }

    .title {
        margin-top: 10px;
        margin-left: 45px;
        font-size: 16px;
        font-weight: 500;
        width: 110px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 5px;
        color: white;
        letter-spacing: 1px;
        background-color: #5455B0;
        cursor: pointer;
    }

    .little_question, .little_note {
        margin: 20px 0 20px 45px;
    }

    .little_note {
        color: #585858;
    }
</style>