import React from 'react'
import {Redirect} from 'react-router-dom'

import Login from '@/views/login'
import Oauth from '@/views/login/oauth'

import Home from '@/views/home/HomePage'

import BaseLayout from '../layouts/BaseLayout' // 联系处置/拟稿
import SystemBranch from '@/views/system/branch'
import SystemRole from '@/views/system/role'
import SystemUser from '@/views/system/user'
import SystemUserSetting from "@/views/system/user/setting"
import SystemQuartz from '@/views/system/quartz'
import SystemSource from '@/views/system/source'
import SystemDatadict from '@/views/system/datadict'
import SystemConfig from '@/views/system/config'
import SystemUserPassword from '@/views/system/user/password'
import SystemOauthClient from '@/views/system/oauth'
import MonitorLog from "@/views/monitor/errorLog"
import Logs from "@/views/monitor/logs"
import Sql from "@/views/monitor/sql"
import Online from "@/views/monitor/online"
import Server from "@/views/monitor/server"
import Api from "@/views/tools/api"
import Storage from "@/views/tools/storage"
import Generator from "@/views/tools/generator"
import Websocket from "@/views/tools/websocket"
import CodeEditor from "@/views/tools/codeeditor"
import EmailManager from '@/views/tools/email'

import Device from "@/views/demo/device"
import Devicegroup from "@/views/demo/devicegroup"
import Devicegmonitor from "@/views/demo/monitor"
import DevicegmonitorDtl from "@/views/demo/monitor/deviceDtl"

import Scriptgroup from "@/views/demo/scriptgroup"
import Script from "@/views/demo/script"
import Scriptsorft from "@/views/demo/scriptsorft"
import Basescript from "@/views/demo/basescript"

import Event from '@/views/report/event'
import Assign from '@/views/report/assign'
import Sign from '@/views/report/sign'
import Detail from '@/views/report/detail'

import Article from '@/views/editor/article/Article'


const routers = [
  {
    path: '/login',
    component: Login,
    exact: true,
    isAuth: false
  },
  {
    path: '/oauth',
    component: Oauth,
    exact: true,
    isAuth: false
  },
  {
    component: BaseLayout,
    isAuth: false,
    childRoutes: [
      {
        path: '/',
        component: Home,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/branch',
        component: SystemBranch,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/role',
        component: SystemRole,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/quartz',
        component: SystemQuartz,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/user',
        component: SystemUser,
        exact: true,
        isAuth: false,
      },
      {
        path: '/password',
        component: SystemUserPassword,
        exact: true,
        isAuth: false,
      },
      {
        path: '/setting',
        component: SystemUserSetting,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/source',
        component: SystemSource,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/datadict',
        component: SystemDatadict,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/config',
        component: SystemConfig,
        exact: true,
        isAuth: false,
      },
      {
        path: '/system/oauth',
        component: SystemOauthClient,
        exact: true,
        isAuth: false,
      },
      {
        path: '/monitor/errorLog',
        component: MonitorLog,
        exact: true,
        isAuth: false,
      },
      {
        path: '/monitor/logs',
        component: Logs,
        exact: true,
        isAuth: false,
      },
      {
        path: '/monitor/sql',
        component: Sql,
        exact: true,
        isAuth: false,
      },
      {
        path: '/monitor/online',
        component: Online,
        exact: true,
        isAuth: false,
      },
      {
        path: '/monitor/server',
        component: Server,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/api',
        component: Api,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/storage',
        component: Storage,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/generator',
        component: Generator,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/websocket',
        component: Websocket,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/codeEditor',
        component: CodeEditor,
        exact: true,
        isAuth: false,
      },
      {
        path: '/tools/email',
        component: EmailManager,
        exact: true,
        isAuth: false,
      },
      {
        path: '/report/eventlist',
        component: Event,
        exact: true,
        isAuth: false
      },
      {
        path: '/sign',
        component: Sign,
        exact: true,
        isAuth: false,
      },
      {
        path: '/assign',
        component: Assign,
        exact: true,
        isAuth: false,
      },
      {
        path: '/detail',
        component: Detail,
        exact: true,
        isAuth: false,
      },
      {
        path: '/editor/article',
        component: Article,
        exact: true,
        isAuth: false,
      },

      {
        path: '/demo/device',
        component: Device,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/devicegroup',
        component: Devicegroup,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/devicemonitor',
        component: Devicegmonitor,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/devicemonitor/devicemonitorDtl',
        component: DevicegmonitorDtl,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/scriptgroup',
        component: Scriptgroup,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/script',
        component: Script,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/scriptsorft',
        component: Scriptsorft,
        exact: true,
        isAuth: false,
      },
      {
        path: '/demo/basescript',
        component: Basescript,
        exact: true,
        isAuth: false,
      }

    ]
  }
]


function injectAuthenticationRender(routers) {
  let digui = function (object) {
    if (object.isAuth === true) {
      object.render = () => {
        let permission = Storage.getUserPermissions(object.path)
        if (!Storage.isLogin()) {
          return (< Redirect to="/login"/>)
        } else {
          let Component = object.component
          return (< Component/>)
        }
      }
    }
    if (object.childRoutes) {
      object.childRoutes.map((router) => {
        digui(router)
      })
    }
  }

  routers.map((router) => {
    digui(router)
  })
  return routers
}

export default injectAuthenticationRender(routers)
