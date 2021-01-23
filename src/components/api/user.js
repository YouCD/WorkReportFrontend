import request from "../utils/request"

// 用户登入
export function Login(params) {
    return request({
        url: '/login',
        data: params,
        method: 'POST',
    })
}

export function UpdateCheck() {
    return request({
        url: '/updateCheck',
        method: 'GET',
    })
}

export function Update(params) {
    return request({
        url: '/update',
        params: params,
        method: 'GET',
    })
}

