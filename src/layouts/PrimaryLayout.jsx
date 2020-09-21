import React, {Fragment, PureComponent} from 'react'
import {Layout, message} from 'antd'
import {renderRoutes} from 'react-router-config'
import {withRouter} from 'react-router-dom'
import {hot} from 'react-hot-loader/root'
import {connect} from 'react-redux'
import Sider from '../components/Sider'
import Header from '../components/Header'
import './PrimaryLayout.less'
import Breadcrumbs from "../components/Breadcrumb/AntdBreadcrumb";
import {buildListApi} from "../services/system/source"
import {RateUtils} from "@utils"

const {Content, Footer} = Layout

const mapStateToProps = state => ({
  collapsed: state.page.collapsed
})

const menus = [
  {
    icon: 'user',
    title: '首页',
    path: '/'
  },
  {
    icon: 'user',
    title: '系统管理',
    children: [
      {
        icon: 'user',
        title: '用户管理',
        path: '/system/user'
      }, {
        icon: 'user',
        title: '角色管理',
        path: '/system/role'
      }, {
        icon: 'user',
        title: '机构管理',
        path: '/system/branch'
      }, {
        icon: 'user',
        title: '资源管理',
        path: '/system/source'
      },
      {
        icon: 'user',
        title: '数据字典',
        path: '/system/datadict'
      }, {
        icon: 'user',
        title: '任务调度',
        path: '/system/quartz'
      },
      {
        icon: 'user',
        title: '系统配置',
        path: '/system/config'
      }
    ]
  },
  {
    icon: 'user',
    title: 'Dashboard',
    path: '/example/dashboard'
  }, {
    icon: 'user',
    title: '记数器',
    path: '/example/counter'
  }
]

class PrimaryLayout extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      menus: []
    }
  }

  componentWillMount() {
    buildListApi({}).then((res) => {
      console.log(res.data.content);
      if (res.data.success) {
        this.setState({menus: RateUtils.toTreeMenu(res.data.content)})
      } else {
        message.error(res.data.message);
      }
    })
  }

  /**
   * 页面左侧菜单折叠事件
   */
  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'APP_HANDLE_COLLAPSE_CHANGE',
      payload: collapsed
    })
  }

  render() {
    const {onCollapseChange} = this
    const {collapsed, childRoutes} = this.props
    const menus = this.state.menus
    const siderProps = {
      collapsed: collapsed,
      onCollapseChange,
      menus: menus
    }

    return (<Fragment><Layout className="bonc-mung-layout">
      <Sider {...siderProps} />
      <Layout className="bonc-mung-layout-main">
        <Header collapsed={collapsed} onCollapseChange={onCollapseChange}/>
        <Content className="bonc-mung-layout-content">
          <Breadcrumbs/>
          {renderRoutes(childRoutes)}
        </Content>
        <Footer style={{textAlign: 'center'}}>
          Copyright ©2019 北京东方国信科技有限公司
        </Footer>
      </Layout>
    </Layout></Fragment>)
  }
}

export default hot(withRouter(connect(
  mapStateToProps
)(PrimaryLayout)))
