import React from 'react'
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tag,
  Tree,
  TreeSelect
} from 'antd'
import * as userApi from "../../../services/demo/basescript"
import moment from "moment";
import {ParamUtils, RateUtils} from '@utils'

import {
  AddButton,
  CommonTable,
  DeleteButton,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  HrefViewButton,
  RatelPage,
  SearchButton
} from "@/components";

const {TextArea} = Input;
const {RangePicker} = DatePicker;
const {Option} = Select;


class Script extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      detpTreeData: [],
      roleListData: [],
      modalVisible: false,
      modalEditable: true,
      currentRow: {},
      treeDataSource: [{
        id: '1',
        title: '顶级脚本组',
        value: '1'
      }],
      columns: [],
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  getSearchParams() {
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    let values = this.searchForm.current.getFieldsValue();
    params.blurry = values.blurry
    params.createTime = ParamUtils.tranSearchTime(values.createTime)

    return params
  }

  getData = () => {
    userApi.userList(this.getSearchParams()).then((res) => {
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
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  onSaveMenu = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    const toolScriptGroup = {id: values.toolScriptGroups}

    if (this.state.currentRow.id) {
      userApi.updateUser(Object.assign(this.state.currentRow, {toolScriptGroup: toolScriptGroup})).then((res) => {
        if (res.data.success) {
          this.setModalVisible(false)
          this.getData()
          message.info("操作成功");
        } else {
          message.error(res.data.message);
        }
      })
    } else {
      userApi.addUser(Object.assign(values, {toolScriptGroup: toolScriptGroup})).then((res) => {
        if (res.data.success) {
          this.setModalVisible(false)
          this.getData()
          message.info("操作成功");
        } else {
          message.error(res.data.message);
        }
      })
    }
  }

  onAddBtn() {
    this.setState({
      currentRow: {username: null, enabled: true, toolScriptGroups: null, content: null},
      modalEditable: true
    })
    this.setModalVisible(true)
  }

  onViewClick(record) {
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onEditMenu(record) {
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }
  
  onDeleteBtn(id) {
    userApi.deleteUser([id], (res) => {
      this.getData()
      this.setState({selectedRowKeys: []})
    })
  }

  onBatchDeleteBtn() {
    userApi.deleteUser(this.state.selectedRowKeys, (res) => {
      this.getData()
      this.setState({selectedRowKeys: []})
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

  onExportBtn() {
    userApi.usersDownload(this.getSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '脚本数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys: selectedRowKeys});
  };

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  onDeptSearchChange = (value) => {
    this.getDeptData(value)
  }

  onDeptSelect = (selectedKeys, info) => {
    if (selectedKeys && selectedKeys.length > 0) {
      this.setState({
        currentDeptId: selectedKeys[0],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }, () => {
        this.getData()
      })
    } else {
      this.setState({
        currentDeptId: null,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }, () => {
        this.getData()
      })
    }
  };

  onWxUser = () => {
    userApi.getWxUser({}, (res) => {
      message.info("同步成功")
    })
  }

  render() {
    const {dataSource, treeDataSource, currentRow, pagination, roleListData, detpTreeData} = this.state
    const columns = [
      {
        title: '脚本名称',
        dataIndex: 'username',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '状态',
        dataIndex: 'enabled',
        render: (text, record, index) => {
          if (record.enabled) {
            return <Tag color={'geekblue'}>正常</Tag>
          } else {
            return <Tag color={'volcano'}>冻结</Tag>
          }
        }
      }, {
        title: '排序',
        dataIndex: 'sort'
      }, {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
          return (
            record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
          )
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <HrefViewButton onClick={() => this.onViewClick(record)}/>
            <Divider type='vertical'/>
            <HrefEditButton onClick={() => this.onEditMenu(record)}/>
            <Divider type='vertical'/>
            <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)}/>
          </span>)
      }]

    const rowSelection = {
      onChange: this.onSelectChange
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
          <Row>
            <Col span={24}>
              <Form ref={this.searchForm} name="searchForm" layout="inline"
                    style={{paddingBottom: 15}} {...formItemLayout}>
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
                {this.state.selectedRowKeys ? <DeleteButton onClick={() => this.onBatchDeleteBtn()}/> : null}
                <ExportButton onClick={() => this.onExportBtn()}/>
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
            </Col>
          </Row>
        </div>
        <CollectionCreateForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveMenu}
          treeDataSource={treeDataSource}
          detpTreeData={detpTreeData}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          roleListData={roleListData}
          currentDetailData={currentRow}
        />
      </RatelPage>
    )
  }
}



const CollectionCreateForm = ({visible, editable, roleListData, detpTreeData, submitMap, onCancel, currentDetailData}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.setFieldsValue(currentDetailData)
  const children = [];
  roleListData.forEach(function (data, index) {
    children.push(<Option value={data.id}>{data.label}</Option>);
  })
  return (
    <Modal
      visible={visible}
      title="脚本管理"
      onCancel={onCancel}
      width={'80%'}
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
        <Form.Item label="脚本名称" name="username" rules={[{required: true}]}>
          <Input placeholder="请输入脚本名称" disabled={!editable}/>
        </Form.Item>
        <Form.Item label="排序" name="sort">
          <InputNumber min={1} max={10000} disabled={!editable}/>
        </Form.Item>
        <Form.Item label="状态" name="enabled" rules={[{required: true}]}>
          <Radio.Group buttonStyle="solid" disabled={!editable}>
            <Radio.Button value={true}>激活</Radio.Button>
            <Radio.Button value={false}>禁用</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="脚本内容" name="content" rules={[{required: true}]}>
          <TextArea placeholder="请输入脚本名称" rows={30} disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );

}

export default Script;
