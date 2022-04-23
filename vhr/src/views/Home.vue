<template>
    <div style="height: 100%;">
        <el-container style="height: 100%;">
            <el-aside width="200px" class="el-aside">
                <div class="sidebar-logo-container">
                    <a>
                        <img src="@/assets/icons/svg/asidebar_logo.svg" class="sidebar-logo">
                        <h1 class="sidebar-title" @click="toHome" style="cursor: pointer">人事管理系统</h1>
                    </a>
                </div>

                <el-menu router unique-opened class="el-menu-vertical"
                         background-color="#304156"
                        text-color="#b3c0cc">
                    <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                        <template slot="title">
                            <i style="margin-right: 12px" :class="item.iconCls"></i>
                            <span> {{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                            {{child.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header class="homeHeader">
                    <div>
                        <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!=='/home'">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div>
                        <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000;" size="normal" @click="goChat"></el-button>
                        <el-dropdown class="userInfo" @command="commandHandler">
                        <span class="el-dropdown-link">
                          {{user.name}}<i><img :src="user.userface" alt=""></i>
                            <!--系统管理员<i></i>-->
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                                <el-dropdown-item command="setting">设置</el-dropdown-item>
                                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-header>
                <el-main>

                    <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
                        欢迎登录人事管理系统！
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            },
            user() {
                return this.$store.state.currentHr;
            }
        },
        methods: {
            goChat() {
                this.$router.push("/chat");
            },
            toHome() {
                this.$router.push("/home")
            },
            commandHandler(cmd) {
                if (cmd === 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.axios.get("/logout");
                        window.sessionStorage.removeItem("user")
                        this.$store.commit('initRoutes', []);
                        this.$router.replace("/");
                    }).catch((error) => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                        console.warn(error)
                    });
                }else if (cmd === 'userinfo') {
                    this.$router.push('/hrinfo');
                }
            }
        }
    }
</script>

<style>
    .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
    }
    .sidebar-logo-container {
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        overflow: hidden;
    }
    .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin: 0 12px;

    }
    .el-aside {
        display: block;
        position: relative;
        background-color: #324157 !important;
    }
    .homeRouterView {
        margin-top: 12px;
    }

    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #324157;
        padding-top: 50px;
    }

    .homeHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
        box-shadow: 0 0 5px #b3c0cc;
    }

    .homeHeader .title {
        font-size: 30px;
        color: #999093;
        margin-left: 30px;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
</style>