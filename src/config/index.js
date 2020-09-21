/**
 * 系统配置类入口
 */
const Config = {
  //服务地址及端口配置
  // API_BASE_URL: 'http://172.16.36.198:1111/',
  // API_BASE_URL: 'http://172.16.36.159:1111/',

  //API_BASE_URL: 'http://rey8fm.natappfree.cc/react',
  API_BASE_URL: 'http://localhost:8015',
  //API_BASE_URL: 'http://localhost:8000',
  //API_BASE_URL: '/authenticationback/',
  // API_BASE_URL: 'http://ad.dsqhost.com',
  // API_BASE_URL: 'http://www.cc-kf.cool:9998/report',
  IMAGE_SIZE: 5,
  FILE_BASE_URL: 'http://172.16.36.198:8090/ftp',
  // API_BASE_URL: 'http://localhost:8080',
  SIDE_CLASSIFY: 'pc', //pc端:pc    移动端:app
  //单点登出地址配置
  LOGOUT_URL: '',
  //单点登陆地址配置
  LOGIN_URL: 'http://127.0.0.1/cas/login',
  //开启 mock 拦截器
  MOCKABLE: false,
  // MOCKABLE: false,
  applicationName: '统一认证平台',
  // 登陆模式 CAS/Form|simulatio
  LONGIN_MODEL: 'CAS',
  //primary|ucb|app
  LAYOUT_MODE: 'primary',
  //是否开启模拟菜单
  MENU_MOCK: true,
  //是否开启模拟用户
  USER_MOCK: true,
  //模拟用户信息
  USER_INFO_MOCK: {},
  // 资源类型
  resourceType: {
    'folder': '菜单目录',
    'menu': '菜单项',
    'button': '按钮'
  },
  icons: [
    'area-chart',
    'bar-chart',
    'line-chart',
    'pie-chart',
    'credit-card',
    'dot-circle-o',
    'plus-square',
    'spinner',
    'file',
    'file-audio-o',
    'ambulance',
    'cab',
    'plane',
    'subway',
    'wheelchair',
    'rocket',
    'ship',
    'motorcycle',
    'truck',
    'pie-chart',
    'phone-square',
    'flag',
    'envelope-open',
    'address-book',
    'archive',
    'bathtub',
    'binoculars',
    'briefcase',
    'camera',
    'cloud',
    'gift',
    'heartbeat',
    'building',
    'coffee',
    'group'
  ]
}

//方便运行时态对配置修改
if (window && window.mungConfig) {
  Object.assign(Config, window.mungConfig)
}

export default Config
