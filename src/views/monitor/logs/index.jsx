import React from 'react';
import {DatePicker, Form, Input, message, Tag} from 'antd'
import {logListApi} from "../../../services/monitor/errorLog"
import {ParamUtils} from '@utils'
import {CommonTable, RatelPage, SearchButton} from "@/components";

const {RangePicker} = DatePicker;


class ErrorLog extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
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
    if (!params.sort) {
      params.sort = "createTime,desc"
    }
    let values = this.searchForm.current.getFieldsValue();
    params.blurry = values.blurry;
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    return params
  }

  // 查询数据
  getData = () => {
    logListApi(this.getSearchParams()).then((res) => {
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
        title: '耗时(毫秒)',
        dataIndex: 'time',
        render: (text, record, index) => {
          if (text < 100) {
            return (<Tag color="green">{text}</Tag>)
          } else if (text < 300) {
            return (<Tag color="orange">{text}</Tag>)
          } else {
            return (<Tag color="magenta">{text}</Tag>)
          }
        }
      }, {
        title: '创建日期',
        dataIndex: 'createTime'
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
      </RatelPage>
    )
  }
}

export default ErrorLog


