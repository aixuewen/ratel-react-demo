
import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

//删除角色
export function deleteRoles(params) {
  return axios.delete('/api/sys/roles', {data: params})
}

//角色新增
export function addRoles(params) {
  return axios.post('/api/sys/roles', params)
}

export function addRolesMenu(params) {
  return axios.put('/api/sys/roles/menu', params)
}

//角色修改
export function updateRoles(params) {
  return axios.put('/api/sys/roles', params)
}

//角色导出
export function rolesDownload(params) {
  return axios.get('/api/sys/roles/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}

export function oneApi(id, callback) {
  axios.defaults.showLoading = false
  axios.get('/api/sys/roles/' + id, {}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//角色列表
export function rolesList(params) {
  return axios.get('/api/sys/roles', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}
