import * as storage from './Storage'

export default {

  /**
   * 初始化菜单
   * @param baseMenuInfo
   */
  initPermission(baseMenuInfo) {
    let permissionMap = {}
    if (!baseMenuInfo) {
      baseMenuInfo = storage.getBaseMenuInfo()
    }
    baseMenuInfo.forEach(function (item, index) {
      permissionMap[item.resCode] = item
    })

    window.permissionMap = permissionMap
  },

  /**
   * 根据resCode 获取菜单是否有权限
   * @param resCode
   * @returns {boolean}
   */
  getPermissionBoolean(resCode) {
    if (!window.permissionMap) {
      this.initPermission()
    }
    if (!resCode) {
      return false
    }
    if (window.permissionMap[resCode]) {
      return true
    } else {
      return false
    }
  },
  /**
   * 根据resCode 获得 菜单对象
   * @param resCode
   * @returns {null|*}
   */
  getPermissionItem(resCode) {
    if (!window.permissionMap) {
      this.initPermission()
    }
    if (!resCode) {
      return null
    }
    if (window.permissionMap[resCode]) {
      return window.permissionMap[resCode]
    } else {
      return null
    }
  }
}
