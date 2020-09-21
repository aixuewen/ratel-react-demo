import {axios, RateUtils} from '../../utils'
import qs from 'qs'
import {message} from "antd";

export function list(params, callback) {
  return axios.get('/api/tool/device', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  }).then((res) => {
    if (res.data.success) {
      callback(res)
      console.log("成功")
    } else {
      message.error(res.data.errMsg);
    }
  })
}

export function listMonitorApi(params) {
  return axios.get('/api/tool/file', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function listApi(params) {
  return axios.get('/api/tool/device', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
}

export function listTreeApi(params,callback) {
  axios.get('/api/tool/device/tree', { params: { ...params } }).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

//删除
export function deleteDevice(id, callback) {
  axios.delete(`/api/tool/device/${id}`, {}).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}



export function runScript(params, callback) {
  return axios.post('/api/tool/device/runScript', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function runScriptLocal(params, callback) {
  return axios.post('/api/tool/device/runScriptLocal', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function saveScripts(params, callback) {
  return axios.post('/api/tool/device/saveScript', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}


export function stopScrip(params, callback) {
  return axios.post('/api/tool/device/stopScrip', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}


export function showScreen(params, callback) {
  return axios.post('/api/tool/device/showScreen', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function updateTag(params, callback) {
  return axios.post('/api/tool/device/updateTag', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function deleteScript(params, callback) {
  return axios.post('/api/tool/device/deleteScript', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function stopConn(params, callback) {
  return axios.post('/api/tool/device/stopConn', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}



