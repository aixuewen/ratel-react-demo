import {axios} from '../../utils'
import qs from 'qs'
import {message} from "antd";

const baseUrl = '/api/wx/userSetting/articleAdd'

//资源列表
export function addApi(params, callback) {
  axios.post(baseUrl, params).then((res) => {
    if (res.data.success) {
      message.info("操作成功");
      callback()
    } else {
      message.error(res.data.message);
    }
  })
}
