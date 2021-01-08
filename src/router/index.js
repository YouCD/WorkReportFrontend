import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/LayoutBase/Layout'
import Login from '@/components/login/Login'
import VueResource from "vue-resource"

Vue.use(Router);
Vue.use(VueResource);

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
                // {
                //     path: '/',
                //     name: 'home',
                //     component: () => import(/* webpackChunkName: "seal" */ "@/components/home/home.vue"),
                //     meta: {needLogin: true, title: 'home'}
                // },
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
