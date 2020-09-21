import React from 'react'
import {Button, Checkbox, Divider, Form, Input, message, Row} from 'antd'
import {qylogin} from '@services/report'
import {login} from '@services/login'
import {Storage} from '@utils'
import './index.less'
import {GithubOutlined, LockOutlined, QqOutlined, UserOutlined, WechatOutlined} from '@ant-design/icons';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      display_none: 'none',
      display_block: 'block'
    }
  }

  componentDidMount() {
    Storage.logout()
    // this.onView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search.indexOf('code') !== -1) {
      qylogin({
        code: nextProps.location.search.split('&')[0].split('=')[1]
      }).then((response) => {
        if (response.data.success) {
          Storage.setAuthorizationToken(response.data.content.token)
          Storage.setUserInfo(response.data.content.user)
          this.props.history.push('/')
        } else {
          message.error(response.data.errMsg);
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  // 用户名
  handleUserName = (e) => {
    this.setState({
      userName: e.target.value
    })
  }

  // 密码
  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  loginChange = (e) => {
    if (this.state.display_none === 'none') {
      this.setState({
        display_none: 'block',
        display_block: 'none'
      })
    } else if (this.state.display_none === 'block') {
      this.setState({
        display_none: 'none',
        display_block: 'block'
      })
    }
  }

  onView() {
    let url = 'http%3A%2F%2Fwww.cc-kf.cool%3A9998%2FreportClient%2F%23%2Flogin';
    window.WwLogin({
      "id": "wx_reg",
      "appid": "ww137aa8c09ec10ca1",
      "agentid": "1000004",
      "redirect_uri": url,
      "state": "sdfasdfasdf",
      "href": "",
    });
  }

  // 登录
  handleLogin = () => {
    login({
      username: this.state.userName,
      password: this.state.password
    }).then((response) => {
      Storage.setAuthorizationToken(response.data.content.token)
      Storage.setUserInfo(response.data.content.user)
      this.props.history.push('/')
    }).catch((error) => {
      console.log(error)
    })
  }
  // 回车事件
  handleEnter = (e) => {
    if (e.keyCode === 13) {
      if (this.state.password !== '' && this.state.userName !== '') {
        this.handleLogin()
      } else {
        message.warning('请输入用户名或密码')
      }
    }
  }


  onFinish = (values) => {
    login(values).then((response) => {
      Storage.setAuthorizationToken(response.data.content.token)
      Storage.setUserInfo(response.data.content.user)
      this.props.history.push('/')
    }).catch((error) => {
      message.warning('用户名密码错误！')
    })
  }

  render() {
    return (
      <div className='report-login'>
        <div className='report-login-inner'>
          <div className='report-login-up'>
            <div className='sign-in-header'>
              <img style={{width: "15%", height: "15%"}} alt="logo" src="/static/report/u44.png"/>
              <h2 style={{marginLeft: 10}}>
                <span style={{fontSize: "25px"}}>统一认证平台</span><br/>
                <span style={{fontSize: "12px"}}>中国(云南)自由贸易试验区昆明片区管理委员会</span>
              </h2>
            </div>

            <div className='sign-in-left'>
              <div className="wrap"/>
            </div>

            {/*<div className='sign-in-right' style={{display: this.state.display_block}}>*/}
            {/*  /!*<h1 className='title'  onClick={(e) => this.loginChange(e)}>扫码*/}
            {/*      </h1>*/}
            {/*      <Button  onClick={() => this.onView()}  >*/}
            {/*        点我生成二维码*/}
            {/*      </Button>*!/*/}
            {/*  <div style={{textAlign: "right"}}>*/}
            {/*    <img style={{height: "50px"}} alt="logo" src="/static/report/icon1.png"*/}
            {/*         onClick={(e) => this.loginChange(e)}/>*/}
            {/*  </div>*/}
            {/*  <div style={{textAlign: "center"}} id="wx_reg"/>*/}
            {/*</div>*/}

            <div className='sign-in-right' style={{display: this.state.display_block}}>
              <div style={{textAlign: "right"}}>
                <img style={{height: "50px"}} alt="logo" src="/static/report/icon1.png"/>
              </div>
              <h1 className='title'>账号登录</h1>
              <div className="login-box">

                <NormalLoginForm
                  onFinish={this.onFinish}
                />


                {/*<div className='user-name'>*/}
                {/*  <Input size="large" onKeyUp={(e) => this.handleEnter(e)} onChange={(e) => this.handleUserName(e)}*/}
                {/*         prefix={<UserOutlined className="site-form-item-icon"/>}*/}
                {/*         className='user-input' type="user" placeholder="请输入用户名"/>*/}
                {/*</div>*/}
                {/*<div className='user-name'>*/}
                {/*  <Input size="large" onKeyUp={(e) => this.handleEnter(e)} onChange={(e) => this.handlePassword(e)}*/}
                {/*         prefix={<LockOutlined className="site-form-item-icon"/>}*/}
                {/*         className='user-input' type="password" placeholder="请输入密码"/>*/}
                {/*</div>*/}
                {/*<div className='other'>*/}
                {/*  <Checkbox onChange={this.onChange}>Checkbox</Checkbox>*/}
                {/*</div>*/}
                {/*<div className='login-btn-border'>*/}
                {/*  <Button size="large" disabled={disabled} onClick={() => this.handleLogin()} className='login-btn'*/}
                {/*          type="primary">登录</Button>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const NormalLoginForm = ({onFinish}) => {
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{remember: true}}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{required: true, message: '请输入用户名!'}]}
      >
        <Input size="large" prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="请输入用户名"/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{required: true, message: '请输入密码!'}]}
      >
        <Input
          size="large"
          prefix={<LockOutlined className="site-form-item-icon"/>}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>

       {/* <a className="login-form-forgot" href="">
          忘记登录密码？
        </a>*/}
      </Form.Item>

      <Form.Item>
        <Button size="large" type="primary" htmlType="submit" className="login-form-button">
          登 录
        </Button>
       {/* 或者 <a href="">去注册!</a>*/}
      </Form.Item>
      {/*<Divider plain>其他方式登录</Divider>
      <Row style={{textAlign: "center", paddingBottom: 24, display: 'block'}}>
        <Button type="primary" shape="circle" icon={<GithubOutlined/>} className="other-btn-0"/>
        <Button type="primary" shape="circle" icon={<QqOutlined/>} className="other-btn-1"/>
        <Button type="primary" shape="circle" icon={<WechatOutlined/>} className="other-btn-2"/>
      </Row>*/}
    </Form>
  );
};

export default Login
