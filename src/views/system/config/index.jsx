import React from 'react'
import {Button, DatePicker, Divider, Form, Icon, Input, Popconfirm, Row, Select} from 'antd'
import {DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';

import {CommonTable, RatelPage} from "@/components";

const {RangePicker} = DatePicker;
const {Option} = Select;

const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: 11,
    name: 'John Brown',
    age: 42,
    address: 'New York No. 2 Lake Park',
  },
  {
    key: 12,
    name: 'John Brown jr.',
    age: 30,
    address: 'New York No. 3 Lake Park',
  },
  {
    key: 13,
    name: 'Jim Green sr.',
    age: 72,
    address: 'London No. 1 Lake Park',
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: data,
      columns: this.columns,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {

  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  onViewClick() {
    this.props.history.push({
      pathname: '/example/user-view',
      params: {
        'userId': 1
      }
    })
  }

  handleTableChange(pagination, filters, sorter) {
    const pager = {...this.state.pagination}
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetchUserList({
      pageSize: 10,
      pageNum: pager.current
    })
  }

  render() {

    const {dataSource, pagination} = this.state

    const columns = [{
      title: '用户名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '昵称',
      dataIndex: 'loginId',
      key: 'loginId'
    }, {
      title: '姓别',
      dataIndex: 'sex',
      key: 'sex'
    }, {
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '邮箱',
      dataIndex: 'mail',
      key: 'mail'
    }, {
      title: '状态',
      dataIndex: 'mail',
      key: 'mail'
    }, {
      title: '创建日期',
      dataIndex: 'mail',
      key: 'mail'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={this.onViewClick.bind(this)}><Icon type='plus'/>查看</a>
          <Divider type='vertical'/>
          <a href='javascript:;'><Icon type='minus'/>编辑</a>
          <Divider type='vertical'/>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record.key)}>
            <a href='javascript:;'>
              <Icon type='close'/>删除
            </a>
          </Popconfirm>

        </span>
      )
    }]

    const rowSelection = {
      onChange: this.onSelectChange
    };

    const onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    };
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
          <Form name="time_related_controls" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="date-picker">
              <Input placeholder="输入姓名搜索"/>
            </Form.Item>
            <Form.Item name="date-picker">
              <RangePicker/>
            </Form.Item>
            <Form.Item name="date-picker">
              <Select style={{width: 120}} allowClear placeholder="状态">
                <Option value="lucy">Lucy</Option>
                <Option value="2222">2222</Option>
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                xs: {span: 24, offset: 0},
                sm: {span: 24, offset: 0},
              }}
            >
              <Button type="primary" icon={<SearchOutlined/>}>
                查询
              </Button>
            </Form.Item>
          </Form>

          <Row style={{paddingBottom: 15}}>
            <Button type="primary" icon={<PlusOutlined/>} className="margin-right-10">
              新增
            </Button>
            <Button type="primary" icon={<EditOutlined/>} className="margin-right-10">
              修改
            </Button>
            <Button type="primary" icon={<DeleteOutlined/>} danger className="margin-right-10">
              删除
            </Button>
            <Button type="primary" icon={<DownloadOutlined/>} className="margin-right-10">
              导出
            </Button>
          </Row>
          <CommonTable
            rowKey={(r, i) => r.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            onChange={this.onTablePaginationChange}
            pagination={{
              total: pagination.total,
              current: pagination.current,
              pageSize: pagination.pageSize
            }}
          />
        </div>
      </RatelPage>
    )
  }
}

export default Config
