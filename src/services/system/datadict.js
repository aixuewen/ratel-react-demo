import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

const baseUrl = '/api/sys/dict'

//资源列表
export function listApi(params, callback) {
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

//资源列表
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

//资源列表
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

//删除
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
  axios.get(`${baseUrl}/download`, {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}


