import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

const baseUrl = '/api/tools/email'

//资源列表
export function addApi(params, callback) {
  axios.put(baseUrl, params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

export function getOne(params, callback) {
  axios.get(baseUrl, {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}

export function sendApi(params, callback) {
  axios.post(baseUrl, params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

export function listApi(params, callback) {
  return axios.get('/api/tools/emailMsg', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}

export function deleteApi(params, callback) {
  axios.delete('/api/tools/emailMsg', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}
