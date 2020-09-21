const breadcrumb = [
  {path: '/', breadcrumb: "我的工作台", unLink: true},
  {path: '/system', breadcrumb: "系统管理", unLink: true},
  {path: '/system/user', breadcrumb: "用户管理", unLink: false},
  {path: '/system/branch', breadcrumb: "机构管理", unLink: false},
  {path: '/system/role', breadcrumb: "角色管理"},
  {path: '/system/source', breadcrumb: "资源管理"},
  {path: '/system/datadict', breadcrumb: "字典管理"},
  {path: '/system/config', breadcrumb: "系统配置"},
  {path: '/monitor', breadcrumb: "系统监控", unLink: true},
  {path: '/monitor/errorLog', breadcrumb: "异常日志"},
  {path: '/monitor/logs', breadcrumb: "操作日志"},
  {path: '/monitor/sql', breadcrumb: "SQL监控"},
  {path: '/monitor/server', breadcrumb: "服务监控"},
  {path: '/monitor/online', breadcrumb: "在线用户"},
  {path: '/system/quartz', breadcrumb: "任务调度", unLink: false},
  {path: '/system/oauth', breadcrumb: "客户端管理", unLink: false},

  {path: '/tools', breadcrumb: "系统工具", unLink: true},
  {path: '/tools/api', breadcrumb: "系统接口"},
  {path: '/tools/generator', breadcrumb: "代码生成"},
  {path: '/tools/storage', breadcrumb: "存储管理"},

  {path: '/password', breadcrumb: "修改密码"},
  {path: '/setting', breadcrumb: "个人中心"},
  /*{path: '/report', breadcrumb: "工作台", unLink: true},*/
 /* {path: '/report/eventlist', breadcrumb: "我的工作台"},*/
  {path: '/detail', breadcrumb: "详情"},
];
export default breadcrumb
