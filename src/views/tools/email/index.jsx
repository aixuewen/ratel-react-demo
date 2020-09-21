import React from 'react'
import {Button, Col, DatePicker, Descriptions, Divider, Form, Input, Row, Space, Tabs, Tag, Typography} from 'antd'

import {ParamUtils} from '@utils'
import './index.less';
import {addApi, getOne, listApi, sendApi,deleteApi} from '../../../services/tools/email'
import {CommonTable, RatelPage, SearchButton,HrefDelButton} from "@/components";
import BraftEditor from "braft-editor";
import moment from "moment";

const {Text} = Typography;
const {RangePicker} = DatePicker;
const {TabPane} = Tabs;

class Index extends React.Component {
  emailForm = React.createRef();
  searchForm = React.createRef();
  editForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      sorter:{field:"createTime"},
      editorState: BraftEditor.createEditorState(null),   //留言内容
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {
    let _this = this;
    getOne({}, (res) => {
      _this.emailForm.current.setFieldsValue(res)
    })
    this.getData()
  }

  onFinish(values) {
    addApi(values, () => {
    })
  }

  getSearchParams() {
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    if (this.searchForm.current) {
      let values = this.searchForm.current.getFieldsValue();
      params.blurry = values.blurry
      params.createTime = ParamUtils.tranSearchTime(values.createTime)
    }
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams(), (res) => {
      this.setState({
        dataSource: res.content,
        pagination: Object.assign(this.state.pagination, {
          total: res.totalElements || 0
        })
      })
    })
  }

  //日志翻页
  tablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  handleChange = (editorState) => {
    this.setState({editorState})
  }

  onLogSearch = () => {
    this.setState({
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    })
    this.getData()
  }

  submitForm(values) {
    values.content = values.content.toHTML()
    sendApi(values, () => {
      // this.editForm.current.setFieldsValue({subject: null, tos: null, content: null})
      // this.setState({
      //   editorState: ContentUtils.clear(this.state.editorState)
      // }, () => {
      //   console.log(this.state.editorState)
      // })
    })
  }

  onDeleteBtn(id) {
    deleteApi([id], (res) => {
      this.getData()
      
    })
  }

  render() {
    const {editorState} = this.state
    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };

    const layoutLang = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const tailLayout = {
      wrapperCol: {offset: 3, span: 21},
    };
    const onFinish = values => {
      this.onFinish(values)
    };

    const submitForm = values => {
      this.submitForm(values)
    };

    const logColumns = [
      {
        title: '邮件标题',
        dataIndex: 'subject'
      },
      {
        title: '收件邮箱',
        dataIndex: 'tos'
      },{
        title: '创建日期',
        dataIndex: 'createTime',
        render: (text, record, index) => {
          return (
            record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
          )
        }
      },{
        title: '发送状态',
        dataIndex: 'sendStatus',
        render: (text, record, index) => {
          if (record.sendStatus) {
            return <Tag color={'green'}>成功</Tag>
          } else {
            return <Tag color={'orange'}>失败</Tag>
          }
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (<span>
                {/* <Button type="link" onClick={() => this.onEditBtn(record)}>编辑</Button>
                  <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onExecuteClick(record)}>执行</Button>
                  <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onRcoverClick(record)}>暂停</Button>
                  <Divider type='vertical'/>*/}
                  {/*<Button type="link" onClick={() => this.onDeleteBtn(record.id)}>删除</Button>*/}
                  <HrefDelButton  onConfirm={() => this.onDeleteBtn(record.id)}/>
              </span>)
        }
      }]

    const extendControls = []

    return (
      <div>
        <RatelPage className='page' inner>
          <div className='bonc-mung-oauth-list'>
            <Tabs defaultActiveKey="1">
              <TabPane tab="邮件配置" key="1">
                <Form ref={this.emailForm} onFinish={onFinish} {...layout} style={{paddingTop: 30, paddingBottom: 30}}>
                  <Form.Item label="发件人邮箱" name="fromUser" rules={[{required: true}]} style={{width: '50%'}}>
                    <Input style={{width: '100%'}} placeholder="请输入发件人邮箱"/>
                  </Form.Item>
                  <Form.Item label="发件用户名" name="user" rules={[{required: true}]} style={{width: '50%'}}>
                    <Input placeholder="请输入发件用户名"/>
                  </Form.Item>
                  <Form.Item label="邮箱密码" name="pass" rules={[{required: true}]} style={{width: '50%'}}>
                    <Input.Password placeholder="请输入邮箱密码"/>
                  </Form.Item>
                  <Form.Item label="SMTP地址" name="host" rules={[{required: true}]} style={{width: '50%'}}>
                    <Input placeholder="请输入SMTP地址"/>
                  </Form.Item>
                  <Form.Item label="SMTP端" name="port" rules={[{required: true}]} style={{width: '50%'}}>
                    <Input placeholder="请输入SMTP端"/>
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="邮件列表" key="2">
                <Form ref={this.searchForm} name="searchForm" layout="inline"
                      style={{paddingTop: 15, paddingBottom: 15}}>
                  <Form.Item name="blurry">
                    <Input placeholder="输入内容搜索"/>
                  </Form.Item>
                  <Form.Item name="createTime">
                    <RangePicker format={'YYYY-MM-DD'}/>
                  </Form.Item>
                  <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 24, offset: 0}}}>
                    <SearchButton onClick={this.onLogSearch}/>
                  </Form.Item>
                </Form>
                <CommonTable
                  rowKey={(r, i) => r.id}
                  columns={logColumns}
                  dataSource={this.state.dataSource}
                  onChange={this.tablePaginationChange}
                  noSorterAll={true}
                  pagination={{
                    total: this.state.pagination.total,
                    current: this.state.pagination.current,
                    pageSize: this.state.pagination.pageSize
                  }}
                  expandable={{
                    expandedRowRender: record => {
                      return (
                        <Row>
                          <Descriptions title="邮件信息">
                            <Descriptions.Item label="邮件正文">
                              <div dangerouslySetInnerHTML={{__html: record.content}}/>
                            </Descriptions.Item>
                          </Descriptions>
                        </Row>
                      )
                    },
                    rowExpandable: record => !!record.id,
                  }}
                />
              </TabPane>
              <TabPane tab="发送邮件" key="3">
                <Form ref={this.editForm} onFinish={submitForm} {...layout}
                      style={{paddingTop: 30, paddingBottom: 30}}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="邮件标题" name="subject" rules={[{required: true}]} {...layout}>
                        <Input style={{width: '100%'}} placeholder="请输入邮件标题"/>
                      </Form.Item>
                    </Col>
                    <Col span={12}/>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="收件邮箱" name="tos" rules={[{required: true}]} {...layout}>
                        <Input style={{width: '100%'}} placeholder="请输入收件邮箱,多个以逗号分割"/>
                      </Form.Item>
                    </Col>
                    <Col span={12}/>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item label="邮件正文" name="content" rules={[{required: true}]} {...layoutLang}>
                        <BraftEditor
                          className="bf-ant-input"
                          onChange={this.handleChange}
                          value={editorState}
                          // excludeControls={excludeControls}
                          extendControls={extendControls}
                          contentStyle={{minHeight: 400}}
                          placeholder="请输入正文内容"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                      发送
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="使用说明" key="4">
                <div style={{padding: 30}}>
                  <Space direction="vertical">
                    <Text># 邮件服务器的SMTP地址，可选，默认为smtp </Text>
                    <Text># 邮件服务器的SMTP端口，可选，默认465或者25 </Text>
                    <Text># 发件人（必须正确，否则发送失败） </Text>
                    <Text># 用户名，默认为发件人邮箱前缀 </Text>
                    <Text># 密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等） </Text>
                    <Text># 是否开启ssl，默认开启 </Text>
                  </Space>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </RatelPage>
      </div>
    )
  }
}

export default Index
