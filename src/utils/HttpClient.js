import axios from 'axios'
import React from 'react'
import config from '../config/index'
import Loading from '../components/loader'
import {notification} from 'antd'
import * as Storage from './Storage'
import {createHashHistory} from 'history';

const history = createHashHistory();

//开发模式下开启 mock拦截器
process.env.NODE_ENV === 'development' && !!config.MOCKABLE && require('@/mocks')
//生产模式下开启 mock拦截器
process.env.NODE_ENV === 'production' && !!config.MOCKABLE && require('@/mocks')

const {
  API_BASE_URL
} = config

Object.assign(axios.defaults, {
  baseURL: API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*'
  }
})

axios.defaults.showLoading = true //是否显示遮罩
axios.defaults.showError = true //返回错误时是否显示错误信息
axios.defaults.timeout = 15000 //超时设置

let xhrqueue = []

/**
 * 请求前钩子函数
 */
axios.interceptors.request.use(function (config) {
  if (config.showLoading) {
    xhrqueue.push(1)
    Loading.open()
  }
  if (config.data && config.data.pageInfo) {
    config.params = Object.assign(config.params || {}, config.data.pageInfo);
  }
  config.headers['Authorization'] = Storage.getAuthorizationToken()
  return config
})

axios.interceptors.response.use(response => {
  if (response.config.showLoading) {
    xhrqueue.shift()
    if (xhrqueue.length === 0) {
      Loading.close()
    }
  }
  return response
}, error => {

  if (error.config && error.config.showLoading) {
    xhrqueue.shift()
    if (xhrqueue.length === 0) {
      Loading.close()
    }
  }
  console.log(error.response.status)
  if (error.response.status === 401) {
    if (error.config.url.indexOf('oauth/authorizeCode') > -1) {
      return history.push('/oauth');
    } else {
      Storage.logout();
      notification.destroy();
      notification['error']({
        message: '提示信息',
        description: '登录超时，请重新登录!'
      })
      //return history.push('/login');
      history.push('/login');
      window.location.reload();
      return;
    }

  }
  if (error && error.response) {
    notification['error']({
      message: '出错了, 错误码: [' + error.response.status + ']',
      description: error.response.data.message || '系统内部错误，请联系管理员!'
    })
  }
})


export {
  axios
}
