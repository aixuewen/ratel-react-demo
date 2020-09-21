import React from 'react'
import {
  Card,
  Col,
  DatePicker,
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
import * as devicegroupApi from "../../../services/demo/devicegroup";
import * as deviceApi from "../../../services/demo/device";
import moment from "moment";
import {ParamUtils} from '@utils'

import './index.less';
import {
  AddButton,
  CommonTable,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  RatelPage,
  SearchButton
} from "@/components";
import * as sourceApi from "../../../services/demo/scriptgoup";


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
    if (values.createTime) {
      params.createTime = [];
      params.createTime[0] = moment(values.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
      params.createTime[1] = moment(values.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    }

    devicegroupApi.listApi(params).then((res) => {
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
    deviceApi.listTreeApi({}, (res) => {
      console.log(res)
      this.setState({deviceDatas: res})
    })
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
        name: null,
        device: null,
      }
    })
  }

  onSaveGroup = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    const toolDevices = []
    values.device.forEach(function (data, index) {
      const menu = {id: data}
      toolDevices.push(menu)
    })
    devicegroupApi.saveGroup({name: values.name, toolDevices: toolDevices, id: this.state.currentRow.id}, (res) => {
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

  onStopScrip(record) {
    devicegroupApi.stopScrip({sid: record.sid}, (res) => {
    })
  }

  updateTag(record) {
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  deleteScript(record) {
    devicegroupApi.deleteScript({id: record.id}, (res) => {
    })
  }

  onShowScreen(record) {
    devicegroupApi.showScreen({sid: record.sid}, (res) => {
    })
  }

  stopConn(record) {
    devicegroupApi.stopConn({sid: record.sid}, (res) => {
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
      message.error("请选择一个设备组")
      return
    }
    if (!this.state.menuSelectedKeys || this.state.menuSelectedKeys.length === 0) {
      message.error("请选择一个脚本组")
      return
    }
    devicegroupApi.saveScripts({
      id: this.state.selectedRowKeys,
      scriptGroupIds: this.state.menuSelectedKeys
    }, (res) => {
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
    devicegroupApi.runScript({id: this.state.selectedRowKeys, scriptGroupIds: this.state.menuSelectedKeys}, (res) => {
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
    devicegroupApi.runScriptLocal({
      id: this.state.selectedRowKeys,
      scriptGroupIds: this.state.menuSelectedKeys
    }, (res) => {
      this.setState({
        selectedRowKeys: [],
        menuSelectedKeys: []
      })
    })
  }


  onEdit(record) {

    const devices = []
    record.toolDevices.forEach(function (item, index) {
      devices.push(item.id)
    })
    record.device = devices

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
        title: '组名',
        dataIndex: 'name'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <HrefEditButton onClick={() => this.onEdit(record)} label={'编辑'}/>
            <Divider type='vertical'/>
            <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)} label={'删除'}/>
            <Divider type='vertical'/>
            <Popconfirm title="确认停止脚本?" onConfirm={() => this.onStopScrip(record)}>
              <a href='javascript:;'>停止脚本</a>
            </Popconfirm>
            <Divider type='vertical'/>
            <Popconfirm title="确认清除全部脚本?" onConfirm={() => this.deleteScript(record)}>
              <a href='javascript:;' className='text-color-dust'>清除脚本</a>
            </Popconfirm>
          </span>)
      }]

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
          <Row style={{paddingBottom: 15}}>
            <AddButton onClick={() => this.onAddBtn()}/>
            <ExportButton onClick={() => this.onExportBtn()}/>
          </Row>
          <Row>
            <Col span={18}>
              <CommonTable
                rowKey={(r, i) => r.id}
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
                pagination={{
                  total: pagination.total,
                  current: pagination.current,
                  pageSize: pagination.pageSize
                }}
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
        <DeviceGroupForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveGroup}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          currentDetailData={currentRow}
          deviceDatas={this.state.deviceDatas}
          menuType={this.state.menuType}
        />
      </RatelPage>
    )
  }
}

const DeviceGroupForm = ({visible, editable, submitMap, onCancel, currentDetailData, deviceDatas}) => {
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

  const children = [];
  if (deviceDatas) {
    for (let i = 0; i < deviceDatas.length; i++) {
      children.push(<Option key={deviceDatas[i].id} value={deviceDatas[i].id}>{deviceDatas[i].tag}</Option>);
    }
  }

  return (
    <Modal
      forceRender
      visible={visible}
      title="设备组"
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
        <Form.Item label="组名" name="name" rules={[{required: true}]}>
          <Input placeholder="请输入组名" disabled={!editable} style={{width: '100%'}}/>
        </Form.Item>
        <Form.Item label="设备" name="device" rules={[{required: true}]}>
          <Select
            mode="multiple"
            style={{width: '100%'}}
            placeholder="请选择设备"
          >
            {children}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Device
