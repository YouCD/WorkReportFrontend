import request from "../utils/request"

// 用户登入
export function addWorkType(params) {
  return request({
    url: '/w/workType',
    data:params,
    method: 'POST',
  })
}

