import React from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input, message,
  Modal,
  Radio,
  Row,
  Col,
  Select, TreeSelect, Tag,
} from 'antd'
import {ParamUtils, RateUtils} from '@utils'
import {
  CommonTable,
  ExportButton,
  RatelPage,
  SearchButton
} from "@/components";

import * as quartzApi from "../../../services/system/quartz"

const { TextArea } = Input;

const {confirm} = Modal;
const {RangePicker} = DatePicker;
const {Option} = Select;

class QuartzLog extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      // 日志相关
      logModalVisible:false, //日志是否显示
      logColumns:[],
      logDataSource:[],
      logPagination:{
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {
    this.getLogData(); //查询日志数据
  }

  //----------------------------------- 日志相关 -----------------------------------
  onShowLog() {
    this.setLogModalVisible(true)
  }

  setLogModalVisible(logModalVisible) {
    this.setState({logModalVisible})
  }

  getLogSearchParams() {
    let params = ParamUtils.getPageParam(this.state.logPagination, this.state.sorter)
    let values = this.searchForm.current.getFieldsValue();
    params.jobName = values.jobName
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    params.isSuccess = values.isSuccess
    return params
  }
  // 查询数据
  getLogData = () => {
    quartzApi.LogList(this.getLogSearchParams()).then((res) => {
      console.log(res);
      if (res.status===200) {
        this.setState({
          logDataSource: res.data.content,
          logPagination: Object.assign(this.state.logPagination, {
            total: res.data.totalElements
          })
        })
      } else {
        message.error('日志列表请求失败！');
      }
    })
  }

  onLogSearch = () => {
    this.setState({
      logPagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    })
    this.getLogData()
  }

  //日志翻页
  onLogTablePaginationChange = (pagination, filters, sorter, extra) => {
    
    this.setState({logPagination: pagination, sorter: sorter}, () => {
      this.getLogData()
    })
  }

  onReset = () => {
    let values = this.searchForm.current.getFieldsValue();
    console.log(values)
    this.searchForm.current.resetFields();
    this.getLogData()
  }


  // 列表导出
  onExportBtn() {
    quartzApi.exportLog(this.getLogSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '任务日志数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }


  render() {
    const {dataSource,pagination,currentRow} = this.state

    //日志相关
    const logColumns = [
      {
        title: '任务名称',
        dataIndex: 'jobName'
      },
      {
        title: 'Bean名称',
        dataIndex: 'beanName'
      },
      {
        title: '执行方法',
        dataIndex: 'methodName'
      },
      {
        title: '参数',
        dataIndex: 'params'
      },
      {
        title: 'cron表达式',
        dataIndex: 'cronExpression'
      },
      {
        title: '异常详情',
        dataIndex: 'exceptionDetail'
      },
      {
        title: '耗时（毫秒）',
        dataIndex: 'time'
      },
      {
        title: '状态',
        dataIndex: 'isSuccess',
        render: (text, record, index) => {
          if (record.isSuccess) {
            return <Tag color={'green'}>成功</Tag>
          } else {
            return <Tag color={'orange'}>失败</Tag>
          }
        }
      },
      {
        title: '创建日期',
        dataIndex: 'createTime'
      }]


    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Form  ref={this.searchForm}  name="searchForm" layout="inline" style={{paddingBottom: 15}} >
            <Form.Item name="jobName">
              <Input placeholder="输入任务名称搜索"/>
            </Form.Item>
            <Form.Item name="createTime">
              <RangePicker format={'YYYY-MM-DD'}/>
            </Form.Item>
            <Form.Item name="isSuccess">
              <Select defaultValue="全部" style={{ width: 120 }} placeholder="选择状态">
                <Option value="">全部</Option>
                <Option value="0">失败</Option>
                <Option value="1">成功</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 24, offset: 0}}}>
              <SearchButton onClick={this.onLogSearch}/>
              <Button type="primary" icon={<i className="fa" style={{marginRight: 8}}/>} className="margin-right-10"
                      onClick={() => this.onReset()}>
                重置
              </Button>
              <ExportButton onClick={() => this.onExportBtn()}/>
            </Form.Item>
          </Form>
          <CommonTable
            rowKey={(r, i) => r.id}
            columns={logColumns}
            dataSource={this.state.logDataSource}
            onChange={this.onLogTablePaginationChange}
            noSorterAll={true}
            pagination={{
              total: this.state.logPagination.total,
              current: this.state.logPagination.current,
              pageSize: this.state.logPagination.pageSize
            }}
          />
        </div>
      </RatelPage>
    )
  }
}

export default QuartzLog


