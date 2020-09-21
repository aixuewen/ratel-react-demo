import React from 'react';
import {Button, Form, Input, Menu,Divider, message, Select} from 'antd';
import {RatelPage} from "@/components";
import * as userApi from "../../../services/system/user"

import "./style.less"
import * as Storage from "../../../utils/Storage";

const {Item} = Menu;
const {Option} = Select;

class Setting extends React.Component {
  searchForm = React.createRef();
  baseForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      selectKey: 'base',
      menuMap: {
        base: "基础设置",
        phone: "安全设置"
      }
    }
  }

  componentDidMount() {
    let user = Storage.getUserInfo()
    this.setState({
      currentUser: user
    })
    userApi.getOneUser({id: user.id}, (res) => {
      console.log(res)
      this.baseForm.current.setFieldsValue(res);
    })
  }

  getMenu = () => {
    const {menuMap} = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  selectKey = (key) => {
    this.setState({
      selectKey: key,
    });
  };

  onFinishFn = (formData) => {
    userApi.updateCenter({id: this.state.currentUser.id, nickName: formData.nickName, sex: formData.sex}, (res) => {
      message.info('修改成功');
    })
  }

  onFinishPhoneFn = (formData) => {
   console.log(formData)
    userApi.updatePhone({id: this.state.currentUser.id, phone: formData.phone, email: formData.email}, (res) => {
      message.info('修改成功');
    })
  }

  getRightTitle = () => {
    const {selectKey, menuMap} = this.state;
    return menuMap[selectKey];
  };

  renderChildren = () => {
    const {selectKey, currentUser} = this.state;


    switch (selectKey) {
      case 'base':
        return (
          <div className="baseView">
            <div className="left">
              <Form layout="vertical"
                    onFinish={this.onFinishFn}
                    initialValues={currentUser}
                    ref={this.baseForm}>
                <Form.Item label="用户名" name="username" required={true}>
                  <Input placeholder="请输入用户名" disabled/>
                </Form.Item>
                <Form.Item label="机构" name="deptName" required={true}>
                  <Input placeholder="请输入机构" disabled/>
                </Form.Item>
                <Form.Item label="昵称" name="nickName" required={true}>
                  <Input placeholder="请输入昵称"/>
                </Form.Item>
                <Form.Item label="性别" name="sex" required={true}>
                  <Select placeholder="请输入性别">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </Form.Item>
                {/*<Form.Item label="电话" name="phone" required={true}>*/}
                {/*  <Input placeholder="请输入电话"/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label="邮箱" name="email">*/}
                {/*  <Input placeholder="请输入邮箱"/>*/}
                {/*</Form.Item>*/}
                <Form.Item>
                  <Button type="primary" htmlType="submit">更新基础信息</Button>
                </Form.Item>
              </Form>
              <Divider style={{ margin: '40px 0 24px' }} />
              <div className="desc">
                <h3>说明</h3>
                <h4>登录信息，重新登录后更新</h4>
              </div>
            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="baseView">
            <div className="left">
              <Form layout="vertical"
                    onFinish={this.onFinishPhoneFn}
                    initialValues={currentUser}
                    ref={this.baseForm}>
                <Form.Item label="电话" name="phone" required={true}>
                  <Input placeholder="请输入电话"/>
                </Form.Item>
                <Form.Item label="邮箱" name="email">
                  <Input placeholder="请输入邮箱"/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">更新安全信息</Button>
                </Form.Item>
              </Form>
              <Divider style={{ margin: '40px 0 24px' }} />
              <div className="desc">
                <h3>说明</h3>
                <h4>登录信息，重新登录后更新</h4>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
    return null;
  };

  render() {
    const {mode, selectKey} = this.state;
    return (
      <RatelPage className='page' inner>
        <div
          className="main"
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className="leftMenu">
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({key}) => this.selectKey(key)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className="right">
            <div className="title">{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </RatelPage>
    )
  }
}

export default Setting;

