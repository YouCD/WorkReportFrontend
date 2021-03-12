<template>
  <a-layout id="components-layout-demo-responsive">
    <Sider></Sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div style="padding: 0px 23px">

          <div style="float:right">
                    <span>
                      <a-dropdown>
                        <a-avatar style="background-color:#87d068" icon="user" class="ant-dropdown-link"
                                  @click="e => e.preventDefault()">
                        </a-avatar>
                        <a-menu slot="overlay">
                          <a-menu-item key="0">
                            <a target="_blank" @click="logout" rel="noopener noreferrer">登出</a>
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>
                    </span>
            <span>{{ uid }}</span>
          </div>
          <!--                    <a v-if="msg.flag" style="float:right;padding-right: 20px" :href="msg.data.download_url">{{msg.msg}}</a>-->
          <a v-if="showUpdate" style="float:right;padding-right: 20px" @click="UpdateHandler">{{ msg }}</a>
          <a v-if="!showUpdate" style="float:right;padding-right: 20px">{{ msg }}</a>
          <!--                    <msg :lists="msg" style="float:right;padding-right: 20px"></msg>-->
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

import {UpdateCheck} from "@/components/api/worklog";
// import msg from '@/components/LayoutBase/msg'
export default {
  data() {
    return {
      uid: "我是谁？",
      breadList: [],
      updateUrl: "",


      msg: undefined,
      showUpdate: false,

      websocket: null,

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
      this.$router.push('/login')
    },

    UpdateCheckHandler() {

      UpdateCheck().then(res => {
        if (res.data.flag) {
          this.msg = res.data.msg
          this.showUpdate = res.data.flag
        } else if (!res.data.flag) {
          this.msg = res.data.msg
          this.showUpdate = res.data.flag
        }
      })
    },
    UpdateHandler() {
      this.initWebSocket();
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
    },

    initWebSocket() { //初始化weosocket
      let wsUrl=undefined
      let protocol=undefined

      if (window.location.protocol==="http:"){
        protocol="ws://"
      }else if (window.location.protocol==="https:"){
        protocol="wss://"
      }

      if(process.env.VUE_APP_API_ROOT){
        wsUrl = protocol+process.env.VUE_APP_API_ROOT.split("//")[1]+"/w/update";

      }else {
        wsUrl=protocol+window.location.host+"/w/update"
      }
      // wsUrl="ws://"+window.location.host+"/w/update"

      // console.log(process.env.VUE_APP_API_ROOT.split("//")[1])
      this.websock = new WebSocket(wsUrl);

      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onopen = this.websocketOnOpen;
      this.websock.onerror = this.websocketOnError;
      this.websock.onclose = this.websocketClose;
    },
    websocketOnOpen() { //连接建立之后执行send方法发送数据
      let actions = {"test": "12345"};
      this.websocketSend(JSON.stringify(actions));
    },
    websocketOnError() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketOnMessage(e) { //数据接收
      // const redata = JSON.parse(e.data);
      // console.log(e.data);
      this.msg=e.data

    },
    websocketSend(Data) {//数据发送
      this.websock.send(Data);
    },
    websocketClose(e) {  //关闭
      console.log('断开连接', e);
    },

  },
  created() {
    this.localStorageUID()
    this.getBreadcrumb()
    this.UpdateCheckHandler()

  },

  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },

  components: {
    Sider,
  }
};
</script>

<style scoped>
</style>
