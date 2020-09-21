import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

const baseUrl = '/api/sys/dictDetail'

export function listApi(params, callback) {
  axios.defaults.showLoading = false
  axios.get(baseUrl, {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function addApi(params, callback) {
  axios.post(baseUrl, params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

export function updateApi(params, callback) {
  axios.put(baseUrl, params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

export function deleteApi(id, callback) {
  axios.delete(`${baseUrl}/${id}`, {}).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}


export function downloadApi(params) {
  return axios.get(`/api/sys/dict/download`, {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}


