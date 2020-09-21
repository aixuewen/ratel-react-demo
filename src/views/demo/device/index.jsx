import React from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tree,
  TreeSelect
} from 'antd'

import * as sourceApi from "../../../services/demo/scriptgoup";
import * as deviceApi from "../../../services/demo/device";

import moment from "moment";
import {ParamUtils} from '@utils'

import './index.less';
import {CommonTable, RatelPage, SearchButton} from "@/components";


const {SHOW_PARENT} = TreeSelect;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {TextArea} = Input;


class Device extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      sid: null,
      dataScope: 0,
      modalVisible: false,
      modalEditable: true,
      currentRow: {},
      columns: this.columns,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  getData = () => {
    let values = this.searchForm.current.getFieldsValue();
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    params.blurry = values.blurry
    params.enable = values.runFlag
    if (values.createTime) {
      params.createTime = [];
      params.createTime[0] = moment(values.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
      params.createTime[1] = moment(values.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    }
    params.deviceManufacturer = values.pp

    deviceApi.listApi(params).then((res) => {
      console.log(res)
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

  componentDidMount() {
    this.getData()
    sourceApi.treeListApi({}, (res) => {
      this.setState({sourceTreeData: res})
    })
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  onAddBtn() {
    this.setModalVisible(true)
    this.setState({
      modalEditable: true,
      currentRow: {
        applicationName: null,
        ips: [],
        description: null,
        clientId: null,
        clientSecret: null,
        connType: null
      }
    })
  }

  onSaveMenu = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    deviceApi.updateTag({tag: values.tag, id: this.state.currentRow.id}, (res) => {
      this.setModalVisible(false)
      this.getData()
    })
  }

  onDeleteBtn(id) {

  }

  //查询
  onHandleSearch = () => {
    this.setState({
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      menuSelectedKeys: [],
      rowId: null
    }, () => {
      this.getData()
    })
  }

  onExportBtn() {
    let values = this.searchForm.current.getFieldsValue();
    let params = {
      blurry: values.blurry,
    }
    params.createTime = ParamUtils.tranSearchTime(values.createTime)

  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  onStopScrip() {
    deviceApi.stopScrip({
      sid: this.state.selectedRowKeys
    }, (res) => {
    })
  }

  updateTag(record) {
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onDeleteDevice(record) {
    deviceApi.deleteDevice(record.id, (res) => {
      this.getData()
    })
  }

  deleteScript() {
    deviceApi.deleteScript({
      sid: this.state.selectedRowKeys
    }, (res) => {
    })
  }

  onShowScreen() {
    deviceApi.showScreen({
      sid: this.state.selectedRowKeys
    }, (res) => {
    })
  }

  stopConn(record) {
    deviceApi.stopConn({sid: record.sid}, (res) => {
      this.getData()
    })
  }

  onRow(record) {
    this.setState({
      rowId: record.id,
      sid: record.sid
    });
  }

  saveScripts = () => {
    if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) {
      message.error("请选择一个设备")
      return
    }
    if (!this.state.menuSelectedKeys || this.state.menuSelectedKeys.length === 0) {
      message.error("请选择一个脚本组")
      return
    }
    deviceApi.saveScripts({sid: this.state.selectedRowKeys, scriptGroupIds: this.state.menuSelectedKeys}, (res) => {
      this.setState({
        selectedRowKeys: [],
        menuSelectedKeys: []
      })
    })
  }

  runRoleMenu = () => {
    if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) {
      message.error("请选择一个设备")
      return
    }
    if (!this.state.menuSelectedKeys || this.state.menuSelectedKeys.length === 0) {
      message.error("请选择一个脚本组")
      return
    }
    deviceApi.runScript({sid: this.state.selectedRowKeys, scriptGroupIds: this.state.menuSelectedKeys}, (res) => {
      this.setState({
        selectedRowKeys: [],
        menuSelectedKeys: []
      })
    })
  }

  runLocalRoleMenu = () => {
    if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) {
      message.error("请选择一个设备")
      return
    }
    if (!this.state.menuSelectedKeys || this.state.menuSelectedKeys.length === 0) {
      message.error("请选择一个脚本组")
      return
    }
    deviceApi.runScriptLocal({sid: this.state.selectedRowKeys, scriptGroupIds: this.state.menuSelectedKeys}, (res) => {
      this.setState({
        selectedRowKeys: [],
        menuSelectedKeys: []
      })
    })
  }


  onEditMenu(record) {
    // const depts = []
    // record.sysDepts.forEach(function (dept, index) {
    //   depts.push(dept.id)
    // })
    // record.depts = depts
    if (!record.ips) {
      record.ips = []
    }
    this.setState({currentRow: record, modalEditable: true})
    this.setModalVisible(true)
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys: selectedRowKeys});
  };


  render() {
    const {dataSource, currentRow, pagination, detpTreeData, sourceTreeData, selectedRowKeys, menuSelectedKeys} = this.state
    const columns = [
      {
        title: '制造商',
        dataIndex: 'deviceManufacturer',
        render: (text, record, index) => {
          let imgSrc = require('assets/images/logo.svg')
          if (record.deviceManufacturer === "Xiaomi") {
            imgSrc = require('assets/logo/xiaomi.jpeg')
          } else if (record.deviceManufacturer === "OPPO") {
            imgSrc = require('assets/logo/oppo.jpeg')
          } else if (record.deviceManufacturer === "vivo") {
            imgSrc = require('assets/logo/vivo.jpeg')
          } else if (record.deviceManufacturer === "HUAWEI") {
            imgSrc = require('assets/logo/huawei.jpeg')
          } else if (record.deviceManufacturer === "360") {
            imgSrc = require('assets/logo/360.jpeg')
          }
          return (
            <Avatar src={imgSrc}/>
          )
        }
      }, {
        title: '标签',
        dataIndex: 'tag'
      }, {
        title: 'Ip',
        dataIndex: 'ip'
      },
      {
        title: '版本',
        dataIndex: 'appVersion'
      },
      {
        title: '状态',
        dataIndex: 'enable',
        render: (text, record, index) => {
          return (
            record.enable === "1" ? <a href='javascript:;'>在线</a> : <a href='javascript:;' style={{color: 'red'}}>离线</a>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <a onClick={() => this.updateTag(record)}>标签</a>
            <Divider type='vertical'/>
            <Popconfirm title="删除设备?" onConfirm={() => this.onDeleteDevice(record)}>
              <a href='javascript:;' className='text-color-dust'>删除</a>
            </Popconfirm>
          </span>)
      }
    ]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const onSelect = (selectedKeys) => {
      this.setState({menuSelectedKeys: selectedKeys})
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
        <div className='bonc-mung-oauth-list'>
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="blurry">
              <Input placeholder="输入名称搜索"/>
            </Form.Item>
            <Form.Item name="pp">
              <Select allowClear placeholder="手机品牌">
                <Option key="vivo" value="vivo">vivo</Option>
                <Option key="Xiaomi" value="Xiaomi">Xiaomi</Option>
                <Option key="OPPO" value="OPPO">OPPO</Option>
                <Option key="HUAWEI" value="HUAWEI">HUAWEI</Option>
              </Select>
            </Form.Item>
            <Form.Item name="runFlag">
              <Select allowClear placeholder="是否在线">
                <Option key="1" value="1">在线</Option>
                <Option key="0" value="0">离线</Option>
              </Select>
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
          <Row>
            <Col span={18}>
              <Card title="客户端列表">
                <Row style={{paddingBottom: 15}}>
                  <Popconfirm title="确认停止脚本?" onConfirm={() => this.onStopScrip()}
                              disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}>
                    <Button type="primary" danger style={{marginRight: 10}}
                            disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}> 停止脚本</Button>
                  </Popconfirm>

                  <Popconfirm title="确认清除脚本?" onConfirm={() => this.deleteScript()}
                              disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}>
                    <Button type="primary" danger style={{marginRight: 10}}
                            disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}> 清除脚本</Button>
                  </Popconfirm>

                  <Popconfirm title="确认截屏?" onConfirm={() => this.onShowScreen()}
                              disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}>
                    <Button type="primary" style={{marginRight: 10}}
                            disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}> 监控截屏</Button>
                  </Popconfirm>

                </Row>
                <CommonTable
                  rowKey={(r, i) => r.sid}
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  onChange={this.onTablePaginationChange}
                  // onRow={record => {
                  //   return {
                  //     onClick: event => this.onRow(record), // 点击行
                  //   };
                  // }}
                  // rowClassName={(record) => {
                  //   return record.id === this.state.rowId ? 'clickRowStyl' : '';
                  // }}
                  expandable={{
                    expandedRowRender: record => {
                      return (
                        <Row>
                          <Descriptions title="设备信息">
                            <Descriptions.Item label="Sid">{record.sid}</Descriptions.Item>
                            <Descriptions.Item label="设备名">{record.deviceName}</Descriptions.Item>
                            <Descriptions.Item label="制造商">{record.deviceManufacturer}</Descriptions.Item>
                            <Descriptions.Item label="型号">{record.deviceModel}</Descriptions.Item>
                            <Descriptions.Item label="品牌">{record.deviceMrand}</Descriptions.Item>
                            <Descriptions.Item label="版本名称">{record.appVersion}</Descriptions.Item>
                            <Descriptions.Item label="版本号">{record.appVersionCode}</Descriptions.Item>
                          </Descriptions>
                        </Row>
                      )
                    },
                    rowExpandable: record => !!record.sid,
                  }}
                  pagination={{
                    total: pagination.total,
                    current: pagination.current,
                    pageSize: pagination.pageSize
                  }}
                />
              </Card>
              <CollectionCreateForm
                visible={this.state.modalVisible}
                editable={this.state.modalEditable}
                submitMap={this.onSaveMenu}
                onCancel={() => {
                  this.setModalVisible(false)
                }}
                detpTreeData={detpTreeData}
                currentDetailData={currentRow}
                dataScope={this.state.dataScope}
              />
            </Col>
            <Col span={6} style={{paddingLeft: '25px'}}>
              <Card title="脚本"
                    extra={<><a href='javascript:;' onClick={this.runRoleMenu}>运行远程</a>&nbsp;
                      <a href='javascript:;' onClick={this.runLocalRoleMenu}>运行本地</a>&nbsp;
                      <a href='javascript:;' onClick={this.saveScripts}>保存</a></>}>
                <Tree
                  checkable
                  showLine={true}
                  onCheck={onSelect}
                  treeData={sourceTreeData}
                  checkedKeys={menuSelectedKeys}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <CollectionCreateForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveMenu}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          currentDetailData={currentRow}
          menuType={this.state.menuType}
        />
      </RatelPage>
    )
  }
}

const CollectionCreateForm = ({visible, editable, submitMap, onCancel, currentDetailData}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };

  form.setFieldsValue(currentDetailData)

  return (
    <Modal
      forceRender
      visible={visible}
      title="标签"
      onCancel={onCancel}
      width={800}
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
        <Form.Item label="标签" name="tag" rules={[{required: true}]}>
          <Input placeholder="请输入标签" disabled={!editable} style={{width: '90%'}}/>
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default Device
