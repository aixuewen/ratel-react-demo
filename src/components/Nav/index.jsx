import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Menu} from 'antd'
import './index.less'

const SubMenu = Menu.SubMenu

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: 'dark',
      current: ''
    }
  }

  handleClick = ({item, key, keyPath, domEvent}) => {
    this.setState({
      current: key
    })
    const oldPath = this.props.location.pathname
    if (oldPath !== key) {
      this.props.history.push(key)
    }
  }

  // 修复刷新后显示异常的bug
  fixCurrent() {
    const currentPath = this.props.location.pathname
    this.setState({current: currentPath})
  }

  componentDidMount() {
    this.fixCurrent()
  }

  render() {
    const {menus, mode} = this.props

    let renderMenuItem = function (menu) {
      if (menu && menu.children && menu.children.length > 0) {
        return (
          <SubMenu key={menu.path} mid={menu.id} title={
            <span>
              <span className={`fa fa-${menu.icon} font-icon`}/>
              <span className='title-text'>{menu.title}</span>
            </span>}>
            {menu.children.map((m) => {
              if (!m.hidden) {
                return renderMenuItem(m)
              }
            })}
          </SubMenu>
        )
      } else {
        return (<Menu.Item key={menu.path}>
          <span className={`fa fa-${menu.icon} font-icon`}/>
          <span className='title-text'>{menu.title}</span>
        </Menu.Item>)
      }
    }
    return (
      <Menu className="bonc-mung-sider-nav"  theme={this.state.theme} mode={mode} onClick={this.handleClick}
            selectedKeys={[this.state.current]}>
        {
          menus.map((menu) => {
            return (
              renderMenuItem(menu)
            )
          })
        }
      </Menu>
    )
  }
}

Nav.propTypes = {
  mode: PropTypes.string,
  menus: PropTypes.array
}

export default withRouter(Nav)
