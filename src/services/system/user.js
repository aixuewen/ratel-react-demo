import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

//用户列表
export function userList(params) {
  return axios.get('/api/sys/users', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

//删除用户
export function deleteUser(params, callback) {
  axios.delete('/api/sys/users', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除用户
export function updatePass(params, callback) {
  axios.post('/api/sys/users/updatePass', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function getOneUser(params, callback) {
  axios.post('/api/sys/users/getOneUser', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function updateCenter(params, callback) {
  axios.put('/api/sys/users/center', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function updatePhone(params, callback) {
  axios.put('/api/sys/users/phone', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//用户新增
export function addUser(params) {
  return axios.post('/api/sys/users', params)
}

//用户修改
export function updateUser(params) {
  return axios.put('/api/sys/users', params)
}

export function usersDownload(params) {
  return axios.get('/api/sys/users/download', {
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
