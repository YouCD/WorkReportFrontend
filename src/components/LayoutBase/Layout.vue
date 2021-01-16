<template>
    <a-layout id="components-layout-demo-responsive">
        <Sider></Sider>
        <a-layout>
            <a-layout-header :style="{ background: '#fff', padding: 0 }">
                <div style="padding: 0px 23px">
          <span style="float:right">
            <span>
              <a-dropdown>
                <a-avatar style="background-color:#87d068" icon="user" class="ant-dropdown-link"
                          @click="e => e.preventDefault()">
                </a-avatar>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a target="_blank" @click="logout" rel="noopener noreferrer">登出</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a href="http://cucurbitcable.dlab.cn/#/updatepassword">修改密码</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
            <span>{{uid}}</span>
          </span>

                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px 0' }">
                <div :style="{ padding: '12px', background: '#fff', minHeight: '790px' ,height:'100%'}">
                    <router-view :key="$route.fullPath"/>
                </div>

            </a-layout-content>
            <a-layout-footer style="text-align: center">
                WorkLogSystem ©2021 Created by YouCD
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
    import Sider from '@/components/LayoutBase/Sider'
    import {Logout} from '../api/user'

    export default {
        data() {
            return {
                uid: "我是谁？",
                breadList: []
            }
        },
        name: "layout",
        methods: {
            onCollapse(collapsed, type) {
                // console.log(collapsed, type);
            },
            onBreakpoint(broken) {
                // console.log(broken);
            },
            localStorageUID() {
                this.uid = localStorage.getItem("uid")
            },
            logout() {
                // Logout()
                this.$router.push('/login')
            },
            getBreadcrumb() {
                this.breadList = []
                // console.log("this.$route.meta",this.$route.meta)
                // console.log("this.$route.path",this.$route.path)
                // console.log("this.$route.name",this.$route.name)
                // this.breadList.push({
                //   path:this.$route.path,
                //
                // })
                // console.log("this.$route",this.$route.path.split("/").splice(1))
                this.$route.path.split("/").splice(1).forEach(item => {
                    // this.breadList.push({name:item})
                })
                // console.log(this.$route.path.split("/").splice(1).length)
                // let path=this.$route.path.split("/").splice(1)
                // for (let i=0;i<path.length;i++){
                //   // console.log("path.splice(i)---",i,path.slice(i))
                //   console.log("path.splice(i)---",i,path[i-1]+"/"+path[i])
                //   // console.log("cc",cc)
                // }
                // https://blog.csdn.net/MISS_CJL/article/details/100124239
                this.$route.matched.forEach(item => {
                    // console.log("item----",item)
                })
            }

        },
        created() {
            this.localStorageUID()
            this.getBreadcrumb()

        },

        watch: {
            $route() {
                this.getBreadcrumb()
            },
        },

        components: {Sider}
    };
</script>

<style scoped>
</style>
