import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {Avatar, Badge, Dropdown, Layout, List, Menu, message, Tabs} from 'antd'
import classNames from 'classnames'
import * as loginServices from '../../services/login'
import {Storage} from '../../utils'
import './index.less'
import {messageList} from './services'
import MessagePng from '../../assets/images/message.png'

import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnlockOutlined,
  UserOutlined
} from '@ant-design/icons';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      visible: false,
      noticeMessage: [],
      othersMessage: [],
      type: 'noticeMessage', //信息类型  noticeMessage    othersMessage
      othersMessageNum: 0,
      noticeMessageNum: 0
    }
  }

  // 登出
  logout() {
    loginServices.logout()
  }

  componentDidMount = () => {
    document.addEventListener('click', this.hidePopBlock)

    this.setState({userInfo: Storage.getUserInfo()})

    console.log(Storage.getUserInfo())
    //this.getMessageList()
    //this.getOthersMessage()
  }

  getOthersMessage = () => {
    let params = {
      pageSize: 4,
      pageNum: 1,
      type: 'othersMessage'
    }
    messageList(params).then((res) => {
      let data = res.data
      this.setState({
        othersMessage: data.list,
        othersMessageNum: data.total
      })
    })
  }

  getMessageList = () => {
    let params = {
      pageSize: 4,
      pageNum: 1,
      type: this.state.type
    }
    messageList(params).then((res) => {
      let data = res.data
      let {type} = this.state
      let numName = `${type}Num`
      this.setState({
        [type]: data.list,
        [numName]: data.total
      }, () => {
        console.log(this.state)
      })
    })
  }

  hidePopBlock = () => {
    this.setState({
      visible: false
    })
  }

  handleClick = ({key}) => {
    if (key === 'user-pwd') {
      this.props.history.push('/password')
    } else if (key === 'user-center') {
      this.props.history.push('/setting')
    } else {
      this.logout()
      this.props.history.push('/login')
    }
  }

  handleTabsChange = (key) => {
    this.setState({
      type: key
    }, () => {
      this.getMessageList()
    })
  }

  handleNewsBellClick = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    this.setState({
      visible: !this.state.visible
    })
  }

  handlePopBlockClick = (e) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  handleNoticeCheckMore = () => {
    this.props.history.push({
      pathname: '/newsManagement',
      search: 'noticeMessage'
    })
    this.setState({
      visible: false
    })
  }

  handleNewsCheckMore = () => {
    this.props.history.push({
      pathname: '/newsManagement',
      search: 'othersMessage'
    })
    this.setState({
      visible: false
    })
  }

  handleNoticeClear = () => {
    message.success('清空了 通知')
    this.setState({
      visible: false
    })
  }

  handleNewsClear = () => {
    message.success('清空了 消息')
    this.setState({
      visible: false
    })
  }

  render() {
    const {
      collapsed,
      onCollapseChange
    } = this.props
    const TabPane = Tabs.TabPane
    const {noticeMessageNum, othersMessageNum, noticeMessage, othersMessage, userInfo} = this.state

    const menu = (
      <Menu onClick={this.handleClick}>
        <Menu.Item key="user-center">
          <UserOutlined/>个人中心
        </Menu.Item>
        <Menu.Item key="user-pwd">
          <UnlockOutlined/>修改密码
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="user-out">
          <LogoutOutlined/>退出
        </Menu.Item>
      </Menu>
    );


    return (
      <Layout.Header id="layoutHeader" className={classNames('bonc-mung-layout-header', {
        'collapsed': collapsed
      })}>
        <div className='menu-header-action' onClick={onCollapseChange.bind(this, !collapsed)}>
          {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
        </div>
        <div className='bonc-mnug-header-container'>
          <div className='news-block'>
            <Badge dot={(noticeMessageNum + othersMessageNum) > 0}>
              <BellOutlined onClick={this.handleNewsBellClick}/>
            </Badge>
            <div className='news-pop-block' style={{display: this.state.visible ? '' : 'none'}}
                 onClick={this.handlePopBlockClick}>
              <Tabs defaultActiveKey='1' onChange={this.handleTabsChange}>
                <TabPane tab={`通知(${noticeMessageNum})`} key='noticeMessage'>
                  <div className='notice'>
                    <List
                      dataSource={noticeMessage}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={MessagePng}/>}
                            title={<span>{item.title}</span>}
                            description={item.content}
                          />
                        </List.Item>
                      )}
                    />
                    <div className='bottom'>
                      <div className='clear' onClick={this.handleNoticeClear}>清空 通知</div>
                      <div className='more' onClick={this.handleNoticeCheckMore}>查看更多</div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab={`消息(${othersMessageNum})`} key='othersMessage'>
                  <div className='news'>
                    <List
                      dataSource={othersMessage}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={MessagePng}/>}
                            title={<span>{item.title}</span>}
                            description={
                              <div>
                                <div>{item.content}</div>
                                <div>{item.createTime}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <div className='bottom'>
                      <div className='clear' onClick={this.handleNewsClear}>清空 消息</div>
                      <div className='more' onClick={this.handleNewsCheckMore}>查看更多</div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>

          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" style={{paddingLeft: '8px'}} onClick={e => e.preventDefault()}>
              <span style={{marginRight: 4, color: '#616161'}}> 你好,</span>
              <span style={{marginRight: 4}}> {userInfo===null?"未登录":userInfo.nickName}</span>
              <span style={{marginRight: 8}}>{Storage.getUserName()}</span>
              <Avatar icon={<UserOutlined/>} style={{marginRight: 8}}/>
            </a>
          </Dropdown>
        </div>
      </Layout.Header>
    )
  }
}

Header.propTypes = {
  collapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func
}

export default withRouter(Header)
