<template>
    <div class="feedback">
        <div class="search">
            <div class="search_title_box">
                <span class="square"></span>
                <span class="search_title">设备编号</span>
            </div>
            <div class="search_box">
                <el-form  ref="inquireForm" :inline="true">
                    <el-form-item label="设备编码:">
                        <el-select v-model="equipment_id" placeholder="请选择">
                            <el-option
                                    v-for="item in things"
                                    :key="item.equId"
                                    :label="item.equId"
                                    :value="item.equId"
                            ></el-option>
                        </el-select>
                        <!--<el-button v-for="item in things" class="equipment" :key="item.equId"-->
                        <!--@click="equipment(item.equId)">-->
                        <!--{{item.equId}}-->
                        <!--</el-button>-->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <div class="parts">
                <div class="title">部件列表</div>
                <div class="little_parts">
                    <el-select v-model="part_id" placeholder="请选择">
                        <el-option
                                v-for="item in parts"
                                :key="item.partsId"
                                :label="item.partsDetail"
                                :value="item.partsId"
                        ></el-option>
                    </el-select>
                    <!--<el-button v-for="item in parts" :key="item.partsId"-->
                    <!--class="every_part"-->
                    <!--@click="part(item.partsId)">{{item.partsDetail}}-->
                    <!--</el-button>-->
                </div>
            </div>
            <div class="question">
                <div class="title">问题反馈</div>
                <div class="little_question">
                    <el-input type="textarea" :rows="5" v-model="content" placeholder="请输入您要反馈的问题"></el-input>
                </div>
            </div>
            <div class="phone">
                <div class="title">联系方式</div>
                <div class="little_phone">
                    <el-input v-model="phone" placeholder="请输入您的联系方式"></el-input>
                </div>
            </div>
            <div class="button">
                <div class="submit" @click="submit">提交</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "feedback",
        data() {
            return {
                things: [],//设备列表
                equipment_id: '',//设备id

                parts: [],//部件列表
                part_id: '',

                content: '',
                phone: '',
            }
        },
        methods: {
            getThing() {
                //获取设备列表
                this.$get('/equ/equInfo')
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.things = res.data.content;

                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail('获取设备列表失败');
                    })
            },
            equipment(id) {
                this.equipment_id = id;
            },

            getParts() {
                //获取部件列表
                this.$get("equ/parts")
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.parts = res.data.content;
                            // this.$nextTick(() => {
                            //     document.getElementsByClassName("every_part")[0].click();
                            // })
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("获取部件列表失败")
                    })
            },
            part(partId) {
                this.part_id = partId;
            },

            submit() {
                if (this.equipment_id === '') {
                    this.$message("请选择设备！");
                    return
                }
                if (this.part_id === '') {
                    this.$message("请选择部件！");
                    return
                }
                if (this.content === '') {
                    this.$message("请填写问题反馈内容！");
                    return
                }
                if (this.phone === '') {
                    this.$message("请填写联系方式");
                    return
                }

                this.$post("equ/putFix", {
                    "equId": this.equipment_id,
                    "partsId": this.part_id,
                    "phone": this.phone,
                    "note": this.content
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.content = "";
                            this.phone = "";
                            this.equipment_id = '';
                            this.part_id = '';
                            this.$success("问题反馈成功");
                        } else {
                            this.$fail(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$fail("问题反馈失败")
                    })
            }
        },
        mounted() {
            this.getThing();
            this.getParts();
        }
    }
</script>

<style scoped>
    .feedback {
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

    .parts, .question, .phone, .button {
        border: 1px solid white;
        /*height:150px;*/
    }

    .title {
        margin-top: 10px;
        margin-left: 45px;
        font-size: 16px;
        font-weight: 500;
    }

    .little_parts, .little_question, .little_phone {
        margin: 20px 0 20px 45px;
    }

    .little_phone {
        width: 30%;
    }

    .submit {
        margin-top: 20px;
        height: 41px;
        cursor: pointer;
        line-height: 41px;
        float: right;
        width: 100px;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 2px;
        color: white;
        background-color: #5455B0;
    }


</style>