import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

export function list(params, callback) {
  return axios.get('/api/tool/devicegroup', {
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

//角色列表
export function listApi(params) {
  return axios.get('/api/tool/devicegroup', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
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

export function runScript(params, callback) {
  return axios.post('/api/tool/devicegroup/runScript', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function runScriptLocal(params, callback) {
  return axios.post('/api/tool/devicegroup/runScriptLocal', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function saveScripts(params, callback) {
  return axios.post('/api/tool/devicegroup/saveScript', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}


export function stopScrip(params, callback) {
  return axios.post('/api/tool/devicegroup/stopScrip', params).then((res) => {
    if (res.data.success) {
      callback(res.data.content)
    } else {
      message.error(res.data.message);
    }
  })
}

export function deleteScript(params, callback) {
  return axios.post('/api/tool/devicegroup/deleteScript', params).then((res) => {
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

export function saveGroup(params, callback) {
  return axios.put('/api/tool/devicegroup', params).then((res) => {
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



