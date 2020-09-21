import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";
import * as RsaEncrypt from "../../utils/RsaEncrypt";
import * as RateUtils from "../../utils/RateUtils";

const baseUrl = '/api/qywx'

export function qylogin(params) {
  return axios.get("/api/qywx", {params})
}
//事件类型
export function eventTypeList(params, callback) {
  axios.get('/api/event/eventType', {
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
export function treeListApi(params, callback) {
  axios.get('/api/dept/findByDept', {params: {...params}}).then((res) => {
    if (res.data.success) {
      callback(RateUtils.toTree(res.data.content))
    } else {
      message.error(res.data.message);
    }
  })
}

//资源列表
export function listApi(params, callback) {
  axios.get('/api/sys/dept/list', {
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

//事件列表
export function eventList(params, callback) {
  axios.get('/api/event/webList', {
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

//新增事件
export function addEvent(params, callback) {
  axios.post('/api/event/addEvent', params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}
//新增事件
export function addEvent1(params,) {
  return axios.post('/api/event/addEvent', params)
}
//修改事件
export function updateEvent1(params,) {
  return axios.put('/api/event', params)
}
//修改事件
export function updateEvent(params, callback) {
  axios.put('/api/event', params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

//提醒
export function remind(params, callback) {
  axios.post('/api/ynwcremind/create', params).then((res) => {
    if (res.data.success) {
      message.info("提醒成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}

//事件导出
export function downloadEvent(params) {
  return axios.get('/api/event/download', {
    params: {...params},
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    responseType: 'blob'
  })
}

//修改事件
export function assignment(params, callback) {
  axios.post('/api/event/assignment', params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback(res.data.success)
    } else {
      message.error(res.data.errMsg);
    }
  })
}


export function feedback(params,callback){
  axios.post('/api/ynwcinfo/create', params).then((res) => {
    if (res.data.success) {
      callback(res.data);
      message.info("操作成功");
    } else {
      callback(res.data.message);
      message.error(res.data.message);
    }
  })
  
}
/**
 * 获取详情
 * @returns {*}
 */
export function getDetail(params) {
  return axios({
    url: '/api/event/detail?id=' + params.id,
    method: 'get'
  })
  //return axios.get('/api/event/detail',params)
}

export function getOperate(params) {
  return axios({
    url: '/api/event/operateList?eventId=' +  params.eventId,
    method: 'get'
  })
  //return axios.get('/api/event/detail',params)
}
