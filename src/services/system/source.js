import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

//资源列表
export function listApi(params) {
  return axios.get('/api/sys/menus', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function downloadApi(params) {
  return axios.get('/api/sys/menus/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}

//资源列表
export function treeListApi(params) {
  return axios.get('/api/sys/menus/list', {params: {...params}})
}

export function buildListApi(params) {
  return axios.get('/api/sys/menus/build', {params: {...params}})
}

export function addApi(params, callback) {
  axios.post('/api/sys/menus', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function updateApi(params, callback) {
  axios.put('/api/sys/menus', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除
export function deleteApi(params, callback) {
  axios.delete('/api/sys/menus', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

