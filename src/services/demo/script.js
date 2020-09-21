import {axios, RateUtils} from '../../utils'
import qs from 'qs'
import {message} from "antd";

//用户列表
export function userList(params) {
  return axios.get('/api/tool/script', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function allList(params, callback) {
  axios.get('/api/tool/script/all', {
    params: { ...params },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  }).then((res) => {
    if (res.data.success) {
      callback(RateUtils.toTree(res.data.content))
    } else {
      message.error(res.data.message);
    }
  })
}

//删除用户
export function deleteUser(params, callback) {
  axios.delete('/api/tool/script', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除用户
export function updatePass(params, callback) {
  axios.post('/api/tool/script/updatePass', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//用户新增
export function addUser(params) {
  return axios.post('/api/tool/script', params)
}

//用户修改
export function updateUser(params) {
  return axios.put('/api/tool/script', params)
}

export function usersDownload(params) {
  return axios.get('/api/tool/script/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}

export function getWxUser(params, callback) {
  axios.get('/api/qywx/getuser', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}
