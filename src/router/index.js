import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/LayoutBase/Layout'
import Login from '@/components/login/Login'
import VueResource from "vue-resource"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router);
Vue.use(VueResource);
NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})
const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {needLogin: false},
        },

        {
            path: '/',
            name: 'workLog',
            component: Layout,
            meta: {needLogin: true, title: 'workLog'},
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import(/* webpackChunkName: "home" */ "@/components/home/home.vue"),
                    meta: {needLogin: true, title: 'home'}
                },
                {
                    path: '/workLogList',
                    name: 'workLogList',
                    component: () => import(/* webpackChunkName: "seal" */ "@/components/workLog/workLogList.vue"),
                    meta: {needLogin: true, title: 'workLogList'}
                },

            ]
        },
        {
            path: '/',
            name: 'sys',
            component: Layout,
            meta: {needLogin: true, title: 'sys'},
            children: [
                {
                    path: '/sys/sysDic',
                    name: 'sysDic',
                    component: () => import(/* webpackChunkName: "seal" */ "@/components/sys/sysDic.vue"),
                    meta: {needLogin: true, title: 'sysDic'}
                },
            ]
        },


    ],
});

router.beforeEach((to, from, next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();
    if (to.path==="/"){
        next({path:"/home"})
    }
    // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
    next();
    if (to.meta.needLogin) {
        if (localStorage.jwt) {
            next()
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })

        }
    } else {
        next()
    }
});
router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done()
})
export default router
//
// router.beforeEach((to, from, next) => {
//   const cookieData = getCookie("SignInstate"); // cookie赋值给变量, 判断登录否true/false
//   if (to.name === "login") {
//     if (cookieData === "true") {  // true 表示登录
//       // 普通判断是否登录
//       const TOKEN = JSON.parse(localStorage.dcaw_token);  // 获取本地存储的登录信息
//
//       if (TOKEN.role === "admin" || TOKEN.role === "teacher") {  // TOKEN.role 表示登录用户类别
//         next({
//           path: "/Teacher/experimentManage"
//         });
//       } else if (TOKEN.role === "student") {
//         next({
//           path: "/Student/practice"
//         });
//       }
//     } else {
//       next();
//     }
//   }
// };
