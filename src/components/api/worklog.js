import request from "../utils/request"

// 获取所有用户
export function getWorkType1(params) {
    return request({
        url: '/w/workType1',
        params:params,
        method: 'GET',
    })
}
export function getWorkType2(params) {
    return request({
        url: '/w/workType2',
        params:params,
        method: 'GET',
    })
}
export function addWorkLog(params) {
    return request({
        url: '/w/workLog',
        data: params,
        method: 'POST',
    })
}

export function getWorkLog(params) {
    return request({
        url: '/w/workLog',
        params: params,
        method: 'GET',
    })
}
export function delWorkLog(params) {
    return request({
        url: '/w/workLog',
        params: params,
        method: 'DELETE',
    })
}

export function modifyWorkLog(params) {
    return request({
        url: '/w/workLog',
        data: params,
        method: 'PUT',
    })
}
