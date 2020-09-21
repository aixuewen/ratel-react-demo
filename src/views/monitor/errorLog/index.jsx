import React from 'react';
import {Button, DatePicker, Form, Input, message, Modal} from 'antd'
import {getErrDetail, listApi} from "../../../services/monitor/errorLog"
import {ParamUtils} from '@utils'
import {CommonTable, HrefViewButton, RatelPage, SearchButton} from "@/components";

const {RangePicker} = DatePicker;


class ErrorLog extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      errorMessage: ''
    }
  }

  componentDidMount() {
    this.getData();
  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  getSearchParams() {
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    let values = this.searchForm.current.getFieldsValue();
    params.blurry = values.blurry;
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams()).then((res) => {
      if (res.data.success) {
        this.setState({
          dataSource: res.data.content.content,
          pagination: Object.assign(this.state.pagination, {
            total: res.data.content.totalElements
          })
        })
      } else {
        message.error(res.data.message);
      }
    })
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  onViewClick(record) {
    getErrDetail({id: record.id}, (res) => {
      this.setState({errorMessage: res.exception})
    })
    this.setModalVisible(true)
  }

  //查询
  onHandleSearch = () => {
    this.setState({
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    })
    this.getData()
  }

  render() {
    const {dataSource, pagination} = this.state
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      }, {
        title: 'IP',
        dataIndex: 'requestIp'
      }, {
        title: 'IP来源',
        dataIndex: 'address'
      }, {
        title: '描述',
        dataIndex: 'description'
      }, {
        title: '浏览器',
        dataIndex: 'browser'
      }, {
        title: '创建日期',
        dataIndex: 'createTime'
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <HrefViewButton onClick={() => this.onViewClick(record)} label={'查看'}/>
          </span>)
      }]

    const formItemLayout = {
      labelCol: {
        xs: {span: 0},
        sm: {span: 0},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };
    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="blurry">
              <Input placeholder="输入内容搜索"/>
            </Form.Item>
            <Form.Item name="createTime">
              <RangePicker format={'YYYY-MM-DD'}/>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: {span: 24, offset: 0},
                sm: {span: 24, offset: 0},
              }}
            >
              <SearchButton onClick={this.onHandleSearch}/>
            </Form.Item>
          </Form>

          <CommonTable
            rowKey={(r, i) => r.id}
            columns={columns}
            dataSource={dataSource}
            onChange={this.onTablePaginationChange}
            expandable={{
              expandedRowRender: record => <div>
                <p style={{margin: 0}}><span style={{color: '#45494d'}}>请求方法：</span>{record.method}</p>
                <p style={{margin: 0}}><span style={{color: '#45494d'}}>请求参数：</span>{record.params}</p></div>,
              rowExpandable: record => record.id !== 'Not Expandable',
            }}
            pagination={{
              total: pagination.total,
              current: pagination.current,
              pageSize: pagination.pageSize
            }}
            noSorterAll={true}
          />
        </div>
        <Modal
          title="错误信息"
          width="80%"
          visible={this.state.modalVisible}
          onOk={false}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          footer={[
            <Button key="back" onClick={() => {
              this.setModalVisible(false)
            }}>返回</Button>,
          ]}
        >
          {this.state.errorMessage}
        </Modal>
      </RatelPage>
    )
  }
}

export default ErrorLog


