import React from 'react'
import {Button, Checkbox, Divider, Form, Input, message, Row} from 'antd'
import {authorizeCode, login} from '@services/login'
import {ParamUtils, Storage} from '@utils'
import './index.less'
import {GithubOutlined, LockOutlined, QqOutlined, UserOutlined, WechatOutlined} from '@ant-design/icons';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      clientId: '',
      applicationName: '',
      from: '',
      state: '',
      redirectUri: ''
    }
  }

  componentDidMount() {
    let httpUrl = this.props.location.search;
    this.setState({
      clientId: ParamUtils.getUrlParam("client_id", httpUrl),
      applicationName: ParamUtils.getUrlParam("applicationName", httpUrl),
      from: ParamUtils.getUrlParam("from", httpUrl),
      state: ParamUtils.getUrlParam("state", httpUrl),
      redirectUri: ParamUtils.getUrlParam("redirect_uri", httpUrl)
    })
    authorizeCode({}, (res) => {
      if (res.data.success) {
        if (this.state.redirectUri.indexOf("?") > 0) {
          window.location = this.state.redirectUri + "&code=" + res.data.content;
        } else {
          window.location = this.state.redirectUri + "?code=" + res.data.content;
        }
      } else {
        Storage.logout()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
  }


  onFinish = (values) => {
    login(values).then((response) => {
      Storage.setAuthorizationToken(response.data.content.token)
      Storage.setUserInfo(response.data.content.user)
      authorizeCode({}, (res) => {
        if (res.data.success) {
          if (this.state.redirectUri.indexOf("?") > 0) {
            window.location = this.state.redirectUri + "&code=" + res.data.content;
          } else {
            window.location = this.state.redirectUri + "?code=" + res.data.content;
          }
        } else {
          message.warning('系统繁忙请联系管理员！')
        }
      })
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
              <h2>
                <span style={{fontSize: "25px"}}>创文事件上报处理系统</span><br/>
                <span style={{fontSize: "12px"}}>中国(云南)自由贸易试验区昆明片区管理委员会</span>
              </h2>
            </div>

            <div className='sign-in-left'>
              <div className="wrap"/>
            </div>
            <div className='sign-in-right' style={{display: this.state.display_block}}>
              <div style={{textAlign: "right"}}>
                <img style={{height: "50px"}} alt="logo" src="/static/report/icon1.png"/>
              </div>
              <h1 className='title'>账号登录</h1>
              <div className="login-box">
                <NormalLoginForm
                  onFinish={this.onFinish}
                />
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

        {/*<a className="login-form-forgot" href="">
          忘记登录密码？
        </a>*/}
      </Form.Item>

      <Form.Item>
        <Button size="large" type="primary" htmlType="submit" className="login-form-button">
          登 录
        </Button>
      {/*  或者 <a href="">去注册!</a>*/}
      </Form.Item>
     {/* <Divider plain>其他方式登录</Divider>
      <Row style={{textAlign: "center", paddingBottom: 24, display: 'block'}}>
        <Button type="primary" shape="circle" icon={<GithubOutlined/>} className="other-btn-0"/>
        <Button type="primary" shape="circle" icon={<QqOutlined/>} className="other-btn-1"/>
        <Button type="primary" shape="circle" icon={<WechatOutlined/>} className="other-btn-2"/>
      </Row>*/}
    </Form>
  );
};

export default Login
