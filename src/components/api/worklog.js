import request from "../utils/request"

// 获取所有用户
export function getWorkType1(params) {
    return request({
        url: '/w/workType1',
        params: params,
        method: 'GET',
    })
}

export function getWorkType2(params) {
    return request({
        url: '/w/workType2',
        params: params,
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

export function getWorkLogFromType(params) {
    return request({
        url: '/w/workLogFromType',
        params: params,
        method: 'GET',
    })
}

export function getWorkLogFromWeek() {
    return request({
        url: '/w/workLogFromWeek',
        method: 'GET',
    })
}

export function getWorkLogFromMonth() {
    return request({
        url: '/w/workLogFromMonth',
        method: 'GET',
    })
}

export function getWorkLogFromContent(params) {
    return request({
        url: '/w/workLogFromContent',
        params: params,
        method: 'GET',
    })
}

export function getWorkLogFromDate(params) {
    return request({
        url: '/w/workLogFromDate',
        params: params,
        method: 'GET',
    })
}

export function downloadWorklog(params) {
    return request({
        url: '/w/downloadWorklog',
        params: params,
        method: 'GET',
        responseType: 'blob'
    })
}

export function UpdateCheck() {
    return request({
        url: '/w/updateCheck',
        method: 'GET',
    })
}
