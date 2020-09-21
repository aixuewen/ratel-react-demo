import { axios, RateUtils } from '../../utils'
import qs from 'qs'
import { message } from "antd";

//资源列表
export function listApi(params, callback) {
  axios.get('/api/tool/scriptGroup/list', {
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

//资源列表
export function addApi(params, callback) {
  axios.post('/api/tool/scriptGroup', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//资源列表
export function updateApi(params, callback) {
  axios.put('/api/tool/scriptGroup', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除
export function deleteApi(params, callback) {
  return axios.delete('/api/tool/scriptGroup', { data: params }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function downloadApi(params, callback) {
  axios.get('/api/tool/scriptGroup/download', {
    params: { ...params },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    },
    responseType: 'blob'
  }).then((res) => {
    if (res.data.success) {
      callback(res.data)
    } else {
      message.error(res.data.message);
    }
  })
}

export function treeListApi(params, callback) {
  axios.get('/api/tool/scriptGroup/listTree', { params: { ...params } }).then((res) => {
    if (res.data.success) {
      callback(RateUtils.toTree(res.data.content))
    } else {
      message.error(res.data.message);
    }
  })
}

export function getWxDept(params, callback) {
  axios.get('/api/qywx/getdept', { data: params }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function signpersion(params,callback) {
  return axios.post('/api/event/sign', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}

export function changesignList(params, callback) {
  return axios.get('/api/buser/find', { data: params.name }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}


