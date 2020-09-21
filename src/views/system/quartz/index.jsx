import React from 'react';
import {Button, Col, DatePicker, Divider, Form, Input, message, Modal, Radio, Row, Select, Tag,} from 'antd'
import {ParamUtils, RateUtils} from '@utils'
import {AddButton, CommonTable, DeleteButton, DeleteConfirm, ExportButton, RatelPage, SearchButton} from "@/components";

import * as quartzApi from "../../../services/system/quartz"
import Quartzlog from "./quartzlog"

const {TextArea} = Input;

const {confirm} = Modal;
const {RangePicker} = DatePicker;
const {Option} = Select;

class Quartz extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      sorter:{field:"createTime"},
      selectedRowKeys: [], //选中的行
      modalVisible: false,//新增是否弹出
      modalEditable: true,//是否可以编辑
      currentRow: {},
      columns: [],
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      // 日志相关
      logModalVisible: false, //日志是否显示
      /*logColumns:[],
      logDataSource:[],
      logPagination:{
        total: 0,
        current: 1,
        pageSize: 10
      }*/
    }
  }

  componentDidMount() {
    this.getData();
    // this.getLogData(); //查询日志数据
  }

  getSearchParams() {
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    let values = this.searchForm.current.getFieldsValue();
    params.jobName = values.jobName
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    return params
  }

  // 查询数据
  getData = () => {
    quartzApi.quartzList(this.getSearchParams()).then((res) => {
      console.log(res);
      if (res.status === 200) {
        this.setState({
          dataSource: res.data.content,
          pagination: Object.assign(this.state.pagination, {
            total: res.data.totalElements
          })
        })
      } else {
        message.error('quartzList请求失败！');
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

  //翻页
  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  // 行内选择编辑
  onEditBtn(record) {
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  // 重置按钮点击
  onReset(record) {
    let values = this.searchForm.current.getFieldsValue();
    console.log(values)
    this.searchForm.current.resetFields();
    this.getData()
  }

  //新增
  onAddBtn() {
    this.setState({
      currentRow: {
        jobName: null,
        description: null,
        beanName: null,
        methodName: null,
        cronExpression: null,
        params: null,
        email: null,
        isPause: true,
        pauseAfterFailure: true,
        subTask: null,
        createTime: null,
        remark: null
      },
      modalEditable: true
    })
    this.setModalVisible(true)
  }


  // 列表导出
  onExportBtn() {
    quartzApi.quartzDownload(this.getSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '任务调度数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }

  //删除
  onDeleteBtn(id) {
    Modal.confirm({
      content: '是否执行该删除操作',
      onOk: () => {
        quartzApi.deleteQuartz([id], (res) => {
          this.getData()
          this.setState({selectedRowKeys: []})
        })
      }
    })
  }

  // 批量删除
  onBatchDeleteBtn() {
    quartzApi.deleteQuartz(this.state.selectedRowKeys, (res) => {
      this.getData()
      this.setState({selectedRowKeys: []})
    })
  }

  // 执行
  onExecuteClick(record) {
    let params = {}
    params.id = record.id
    quartzApi.excuteQuartz(params, (res) => {
      this.getData()
      message.info("执行成功！")
    })
  }

  // 更改定时任务
  onRcoverClick(record) {
    let params = {}
    params.id = record.id
    quartzApi.rcoverQuartz(params, (res) => {
      this.getData()
      message.info("更改成功！")
    })
  }

  // 保存
  onSaveMenu = (values) => {
    /*if (values.isPause) {
      values.isPause = false;
    } else {
      values.isPause = true;
    }*/


    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    if (this.state.currentRow.id) {
      quartzApi.updateQuartz(Object.assign(this.state.currentRow), (res) => {
        this.setModalVisible(false)
        this.getData();
        message.info("更新操作成功!");
      })
    } else {
      quartzApi.addQuartz(Object.assign(this.state.currentRow), (res) => {
        this.setModalVisible(false)
        this.getData();
        message.info("新增操作成功!");
      })
    }

  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  // 选中的list
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys: selectedRowKeys});
  };


  //----------------------------------- 日志相关 -----------------------------------
  onShowLog() {
    this.setLogModalVisible(true)
  }

  setLogModalVisible(logModalVisible) {
    this.setState({logModalVisible})
  }

  render() {
    const {dataSource, pagination, currentRow} = this.state
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <span>{index + 1}</span>
          )
        }
      },
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
        title: '状态',
        dataIndex: 'isPause',
        render: (text, record, index) => {
          if (!record.isPause) {
            return <Tag color={'green'}>运行中</Tag>
          } else {
            return <Tag color={'orange'}>已暂停</Tag>
          }
        }
      },
      {
        title: '描述',
        dataIndex: 'description'
      },
      {
        title: '创建日期',
        dataIndex: 'createTime'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (!record.isPause) {  //true
            return (
              <span>
                 <Button type="link" onClick={() => this.onEditBtn(record)}>编辑</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onExecuteClick(record)}>执行</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onRcoverClick(record)}>暂停</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onDeleteBtn(record.id)}>删除</Button>
              </span>
            )
          } else {
            return (
              <span>
                 <Button type="link" onClick={() => this.onEditBtn(record)}>编辑</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onExecuteClick(record)}>执行</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onRcoverClick(record)}>恢复</Button>
                 <Divider type='vertical'/>
                 <Button type="link" onClick={() => this.onDeleteBtn(record.id)}>删除</Button>
              </span>
            )
          }

        }
      }]


    const rowSelection = {
      onChange: this.onSelectChange,
      // getCheckboxProps: record => ({
      //   disabled: record.enable === '0'
      // }),
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
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="jobName">
              <Input placeholder="输入任务名称搜索"/>
            </Form.Item>
            <Form.Item name="createTime">
              <RangePicker format={'YYYY-MM-DD'}/>
            </Form.Item>
            <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 24, offset: 0}}}>
              <SearchButton onClick={this.onHandleSearch}/>
              <Button type="primary" icon={<i className="fa" style={{marginRight: 8}}/>} className="margin-right-10"
                      onClick={() => this.onReset()}>
                重置
              </Button>
            </Form.Item>
          </Form>
          <Row style={{paddingBottom: 15}}>
            <AddButton onClick={() => this.onAddBtn()}/> {/*新增*/}
            <DeleteConfirm onConfirm={() => this.onBatchDeleteBtn()}>
              <DeleteButton icon="refresh" label="删除"/>
            </DeleteConfirm>
            <ExportButton onClick={() => this.onExportBtn()}/>
            <Button type={"primary"} onClick={() => this.onShowLog()}>日志</Button>
          </Row>
          <CommonTable
            rowKey={(r, i) => r.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            onChange={this.onTablePaginationChange}
            noSorterAll={true}
            pagination={{
              total: pagination.total,
              current: pagination.current,
              pageSize: pagination.pageSize
            }}
          />
        </div>
        <CollectionCreateForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveMenu}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          currentDetailData={currentRow}
        />
        <Modal
          visible={this.state.logModalVisible}
          title={"执行日志"}
          onCancel={() => {
            this.setLogModalVisible(false)
          }}
          width={1600}
          destroyOnClose={true}
          footer={null}
        >
          <Quartzlog/>
        </Modal>

      </RatelPage>
    )
  }
}

export default Quartz

const CollectionCreateForm = ({visible, editable, submitMap, onCancel, currentDetailData}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.resetFields();
  form.setFieldsValue(currentDetailData)
  let title = editable ? '新增定时任务' : '编辑定时任务';


  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8}
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16}
    }
  }
  const formItemLayout1 = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 4}
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20}
    }
  }
  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      width={800}
      destroyOnClose={true}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            submitMap(values);
          })
          .catch(info => {
            console.log('校验失败:', info);
          });
      }}
    >
      <Form
        form={form}
        {...layout}
        name="serverDetail"
        initialValues={currentDetailData}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='任务名称' name='jobName' {...formItemLayout} rules={[{required: true}]}>
              <Input placeholder="任务名称" disabled={!editable}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='任务描述' name='description' {...formItemLayout} rules={[{required: true}]}>
              <Input placeholder="任务描述" disabled={!editable}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Bean名称' name='beanName' {...formItemLayout} rules={[{required: true}]}>
              <Input placeholder="Bean名称" disabled={!editable}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='执行方法' name='methodName' {...formItemLayout} rules={[{required: true}]}>
              <Input placeholder="执行方法" disabled={!editable}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Cron表达式' name='cronExpression' {...formItemLayout} rules={[{required: true}]}>
              <Input placeholder="Cron表达式" disabled={!editable}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='参数' name='params' {...formItemLayout} rules={[{required: false}]}>
              <Input placeholder="参数" disabled={!editable}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='子任务ID' name='subTask' {...formItemLayout} rules={[{required: false}]}>
              <Input placeholder="多个用逗号分开，按顺序执行" disabled={!editable}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='告警邮箱' name='email' {...formItemLayout} rules={[{required: false}]}>
              <Input placeholder="多个用逗号分开" disabled={!editable}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="任务状态" name="isPause"  {...formItemLayout}>
              <Radio.Group buttonStyle="solid" disabled={!editable}>
                <Radio value={false}>启用</Radio>
                <Radio value={true}>暂停</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="失败后暂停" name="pauseAfterFailure"  {...formItemLayout}>
              <Radio.Group buttonStyle="solid" disabled={!editable}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="备注" name="remark"  {...formItemLayout1}>
              <TextArea rows={4} disabled={!editable}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );

};

