import request from "../utils/request"

// 用户登入
export function Login(params) {
  return request({
    url: '/login',
    data:params,
    method: 'POST',
  })
}

// 用户登出
export function Logout(params) {
  return request({
    url: '/logout',
    params:params,
    method: 'GET',
  })
}

// 获取uid对象
export function GetUIDObj(params) {
  return request({
    url: '/user/uidobj',
    params:params,
    method:'GET',
  })
}
// 获取uid对象
export function GetOUByUID(params) {
  return request({
    url: '/user/getou',
    params:params,
    method:'GET',
  })
}
