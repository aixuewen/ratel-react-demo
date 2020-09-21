import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

export function listApi(params, callback) {
  return axios.get('/api/webSocket/client', {
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
  axios.delete('/api/sys/storage', {data: params}).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}
