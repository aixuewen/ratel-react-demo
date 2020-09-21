import axios from '@/utils'
import qs from 'qs'

export function initData(url, params) {
  return axios({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function download(url, params) {
  return axios({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
