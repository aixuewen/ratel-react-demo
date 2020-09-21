import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

//用户列表
export function userList(params) {
  return axios.get('/api/tool/scriptSort', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

//删除用户
export function deleteUser(params, callback) {
  axios.delete('/api/tool/scriptSort', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除用户
export function updatePass(params, callback) {
  axios.post('/api/tool/scriptSort/updatePass', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//用户新增
export function addUser(params) {
  return axios.post('/api/tool/scriptSort', params)
}

//用户修改
export function updateUser(params) {
  return axios.post('/api/tool/scriptSort/update', params)
}

//用户修改
export function deleteApi(params) {
  return axios.post('/api/tool/scriptSort/delete', params)
}


export function usersDownload(params) {
  return axios.get('/api/tool/scriptSort/download', {
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
