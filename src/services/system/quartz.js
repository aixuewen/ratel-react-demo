
import {axios} from '../../utils'

import qs from 'qs'
import {message} from "antd";



export function quartzList(params) {
  return axios.get('/api/jobs/query', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function addQuartz(params,callback) {
  axios.post('/api/jobs/add',params).then((res) => {
    if (res.status === 200) {
      callback(res)
    } else {
      message.error(res.data.message);
    }
  })
}

export function updateQuartz(params,callback) {
  axios.put('/api/jobs/edit',params).then((res) => {
    if (res.status === 200) {
      callback(res)
    } else {
      message.error(res.data.message);
    }
  })
}

export function deleteQuartz(params,callback) {
  axios.delete('/api/jobs/delete',{data: params}).then((res) => {
    if (res.status === 200) {
      callback(res)
    } else {
      message.error(res.data.message);
    }
  })
}

export function excuteQuartz(params,callback) {
  axios.put('/api/jobs/exec/'+params.id).then((res) => {
    if (res.status === 200) {
      callback(res)
    } else {
      message.error(res.data.message);
    }
  })
}

export function rcoverQuartz(params,callback) {
  axios.put('/api/jobs/'+params.id).then((res) => {
    if (res.status === 200) {
      callback(res)
    } else {
      message.error(res.data.message);
    }
  })
}

export function quartzDownload(params,callback) {
  return axios.get('/api/jobs/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}

// 日志相关
export function LogList(params) {
  return axios.get('/api/jobs/logs', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function exportLog(params) {
  return axios.get('/api/jobs/logs/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}










