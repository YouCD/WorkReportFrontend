<template>
  <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
      style="flex: 1;min-width:210px"
  >
    <div style="width: 250px;height: 50px;padding-left: 20px;margin-bottom: 10px">
      <div id="logoImage">
        <!--        <img src="./logo.png" alt="logo">-->
        <div style="display:inline-block; color: white;font-size: 25px;padding-top:20px">工作日志</div>
      </div>

    </div>
    <a-menu theme="dark" mode="inline" style="width: auto" :default-selected-keys="['4']">
      <a-menu-item key="1">
        <!--        <MyIcon type='icon-home'></MyIcon>-->
        <!--        <span class="nav-text">Home</span>-->
        <router-link to='/'>Home</router-link>

      </a-menu-item>
      <a-sub-menu>
          <span slot="title">
<!--            <a-icon type="user"/>-->
                        <span>日志</span>

          </span>
        <a-menu-item key="/workLogList">
          <router-link to='/workLogList'>日志浏览</router-link>
        </a-menu-item>
<!--        <a-menu-item key="/workLogAdd">-->
<!--          <router-link to='/workLogAdd'>添加日志</router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="/secret/log">-->
<!--          <router-link to='/secret/log'>账号日志</router-link>-->
<!--        </a-menu-item>-->

<!--        <a-menu-item key="/secret/plat">-->
<!--          <router-link to='/secret/plat'>平台管理</router-link>-->
<!--        </a-menu-item>-->

      </a-sub-menu>
<a-sub-menu >
          <span slot="title">
<!--            <a-icon type="user"/>-->
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
// import {MyIcon} from '@/icon/icon'

export default {
  created() {
    this.rolesHandler()
  },
  data() {
    return {
    }
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
