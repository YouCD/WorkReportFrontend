<template>
    <a-layout-sider
            breakpoint="lg"
            collapsed-width="0"
            @collapse="onCollapse"
            @breakpoint="onBreakpoint"

    >
        <div style="padding-left: 20px;margin-bottom: 10px">
            <div>
                <!--        <img src="./logo.png" alt="logo">-->
                <div style="display:inline-block; color: white;font-size: 25px;padding-top:20px">工作日志</div>
            </div>

        </div>
        <a-menu theme="dark" mode="inline" style="width: auto">
            <a-menu-item key="1">
                <!--        <MyIcon type='icon-home'></MyIcon>-->
                <!--        <span class="nav-text">Home</span>-->
                <router-link to='/home'>Home</router-link>

            </a-menu-item>
            <a-sub-menu>
          <span slot="title">
<!--            <a-icon type="user"/>-->
                        <span>日志</span>

          </span>
                <a-menu-item key="/workLogList">
                    <router-link to='/workLogList'>日志浏览</router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu>
          <span slot="title">
              <span>系统设置</span>
          </span>
                <a-menu-item key="/sys/sysDic">
                    <router-link to='/sys/sysDic'>字典设置</router-link>
                </a-menu-item>


            </a-sub-menu>


        </a-menu>
    </a-layout-sider>
</template>

<script>

    export default {
        created() {
            this.rolesHandler()
        },
        data() {
            return {}
        },
        name: "sider",

        methods: {
            onCollapse(collapsed, type) {
                // console.log(collapsed, type);
            },
            onBreakpoint(broken) {
                // console.log(broken);
            },
            rolesHandler() {
                if (localStorage.getItem("role") === "secretadmin") {
                    this.isSecretAdmin = true
                } else if (localStorage.getItem("role") === "sealadmin") {
                    this.isSealAdmin = true
                }
            }
        },
        components: {
            // MyIcon,
        },
    }
</script>

<style scoped>


</style>
