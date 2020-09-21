import React from 'react';
import {AutoComplete, Button, Form, Input, message, Row, Select,} from 'antd';
import {RatelPage} from "@/components";
import * as userApi from "../../../services/system/user"
import {RsaEncrypt} from "../../../utils";

const {Option} = Select;
const AutoCompleteOption = AutoComplete.Option;


class Password extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {}
  }


  componentDidMount() {

  }


  render() {
    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Row>
            <RegistrationForm/>
          </Row>
        </div>
      </RatelPage>
    )
  }
}

export default Password;

const RegistrationForm = () => {

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const [form] = Form.useForm();

  const onFinish = values => {
    let obj = {oldPass: RsaEncrypt.encrypt(values.oldPassword), newPass: RsaEncrypt.encrypt(values.password)}
    userApi.updatePass(obj, (res) => {
      message.info('密码修改成功');
    })
  };


  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >

      <Form.Item
        name="oldPassword"
        label="旧密码"
        rules={[
          {
            required: true,
            message: '请输入旧密码!',
          },
        ]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item
        name="password"
        label="新密码"
        rules={[
          {
            required: true,
            message: '请输入新密码!',
          },
        ]}
        hasFeedback
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认新密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请输入确认新密码!',
          },
          ({getFieldValue}) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('两次输入密码不一致!');
            },
          }),
        ]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
