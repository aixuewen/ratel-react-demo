import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

export function listApi(params) {
  return axios.get('/api/sys/logs/error', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}


export function getErrDetail(params, callback) {
  return axios.get('/api/sys/logs/error/' + params.id, {}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}


export function logListApi(params) {
  return axios.get('/api/sys/logs', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}
