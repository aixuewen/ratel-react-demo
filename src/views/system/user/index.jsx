import React from 'react'
import {Col, DatePicker, Divider, Form, Input, message, Modal, Radio, Row, Select, Tag, Tree, TreeSelect} from 'antd'
import * as userApi from "../../../services/system/user"
import * as depApi from "../../../services/system/dept"
import * as roleApi from "../../../services/system/role"
import moment from "moment";
import {ParamUtils, RateUtils} from '@utils'

import {
  AddButton,
  CommonButton,
  CommonTable,
  DeleteButton,
  DeleteConfirm,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  HrefViewButton,
  RatelPage,
  SearchButton
} from "@/components";


const {Search} = Input;
const {RangePicker} = DatePicker;
const {Option} = Select;


class Users extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      sorter:{field:"createTime"},
      detpTreeData: [],
      roleListData: [],
      modalVisible: false,
      modalEditable: true,
      currentRow: {},
      treeDataSource: [{
        id: '1',
        title: '顶级部门',
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
    params.enable = values.enable
    params.createTime = ParamUtils.tranSearchTime(values.createTime)

    if (this.state.currentDeptId) {
      params.sysDeptId = this.state.currentDeptId
    }
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

  getDeptData = (value) => {
    depApi.treeListApi({name: value}, (res) => {
      this.setState({detpTreeData: res})
    })
  }

  componentDidMount() {
    this.getDeptData()
    this.getData()
    roleApi.rolesList({}).then((res) => {
      if (res.data.success) {
        const menus = []
        res.data.content.content.forEach(function (data, index) {
          const menu = {label: data.name, id: data.id}
          menus.push(menu)
        })
        this.setState({roleListData: menus});
      } else {
        message.error(res.data.message);
      }
    })
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  onSaveMenu = (values) => {
    values.status = 0;//无论是新增还是修改status 都改成0
    //values.type = 'jigou';//目前系统的新增修改的用户类型都是机构
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    const depts = {id: values.depts}

    const roles = []
    if (values.roles) {
      values.roles.forEach(function (data, index) {
        const role = {id: data}
        roles.push(role)
      })
    }
    if (this.state.currentRow.id) {
      userApi.updateUser(Object.assign(this.state.currentRow, {sysDept: depts, sysRoles: roles})).then((res) => {
        if (res.data.success) {
          this.setModalVisible(false)
          this.getData()
          message.info("操作成功");
        } else {
          message.error(res.data.message);
        }
      })
    } else {
      userApi.addUser(Object.assign(values, {sysDept: depts, sysRoles: roles})).then((res) => {
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
      currentRow: {username: null, nickName: null, email: null, sex: '男', enabled: 1, depts: null,roles:[], phone: null},
      modalEditable: true
    })
    this.setModalVisible(true)
  }

  onViewClick(record) {

    record.depts = record.sysDept.id

    let re = []

    record.sysRoles.forEach(function (data, index) {
      re.push(data.id)
    })
    record.roles = re;
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onEditMenu(record) {
    console.log(record)
    record.depts = record.sysDept.id

    let re = []

    record.sysRoles.forEach(function (data, index) {
      re.push(data.id)
    })
    record.roles = re;

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
      RateUtils.downloadFile(result.data, '用户数据', 'xlsx')
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
        title: '用户名',
        dataIndex: 'username',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '昵称',
        dataIndex: 'nickName',
      }, {
        title: '姓别',
        dataIndex: 'sex',
        render: (text, record, index) => {
          return (
            record.sex === "1" ? "男" : record.sex === "2" ? "女" : record.sex
          )
        }
      }, {
        title: '电话',
        dataIndex: 'phone',
      }, {
        title: '邮箱',
        dataIndex: 'email',
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
        title: '删除状态',
        dataIndex: 'enable',
        render: (text, record, index) => {
          if (record.enable==='1') {
            return <Tag color={'geekblue'}>正常</Tag>
          } else {
            return <Tag color={'volcano'}>已删除</Tag>
          }
        }
      },{
        title: '部门',
        dataIndex: 'deptId',
        render: (text, record, index) => {
          if (record.sysDept) {
            return record.sysDept.name
          } else {
            return ''
          }
          // return record.sysDept.name
        }
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
        render: (text, record) => {
          if (record.enable==='1') {
            return (
              <span>
                <HrefViewButton onClick={() => this.onViewClick(record)}/>
                <Divider type='vertical'/>
                <HrefEditButton onClick={() => this.onEditMenu(record)}/>
                <Divider type='vertical'/>
                <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)}/>
              </span>
            )
          } else {
            return (
              <span>
                <HrefViewButton onClick={() => this.onViewClick(record)}/>
              </span>
            )
          }
        }
      }]

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.enable === '0'
      }),
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
            <Col span={5} style={{paddingRight: '25px'}}>
              <Search style={{marginBottom: 10}} placeholder="输入部门名称搜索"
                      onSearch={value => this.onDeptSearchChange(value)}/>
              <Tree
                showLine={true}
                onSelect={this.onDeptSelect}
                treeData={detpTreeData}
              />
            </Col>
            <Col span={19}>
              <Form ref={this.searchForm} name="searchForm" layout="inline"
                    style={{paddingBottom: 15}} {...formItemLayout}>
                <Form.Item name="blurry">
                  <Input placeholder="输入名称搜索"/>
                </Form.Item>
                <Form.Item name="createTime">
                  <RangePicker format={'YYYY-MM-DD'}/>
                </Form.Item>
                <Form.Item name="enable">
                  <Select defaultValue="全部" style={{ width: 120 }} >
                    <Option value="">全部</Option>
                    <Option value="0">已删除</Option>
                    <Option value="1">正常</Option>
                  </Select>
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
                 {/*<DeleteConfirm onConfirm={() => this.onWxUser()}>
                  <CommonButton icon="refresh" label="同步"/>
                </DeleteConfirm>*/}
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

export default Users;

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
      title="用户管理"
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
        <Form.Item label="用户名" name="username" rules={[{required: true}]}>
          <Input placeholder="请输入用户名" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="电话" name="phone" rules={[{required: true}]}>
          <Input placeholder="请输入电话" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="昵称" name="nickName" rules={[{required: true}]}>
          <Input placeholder="请输入昵称" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="邮箱" name="email" rules={[{required: false}]}>
          <Input placeholder="请输入邮箱" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="部门" name="depts" rules={[{required: true}]}>
          <TreeSelect
            placeholder="请选择部门"
            allowClear
            treeData={detpTreeData}
            disabled={!editable}/>
        </Form.Item>
        <Form.Item label="角色" name="roles" rules={[{required: true}]}>
          <Select
            mode="multiple"
            style={{width: '100%'}}
            placeholder="请选择角色"
            disabled={!editable}
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item label="性别" name="sex">
          <Radio.Group buttonStyle="solid" disabled={!editable}>
            <Radio.Button value={"男"}>男</Radio.Button>
            <Radio.Button value={"女"}>女</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态" name="enabled">
          <Radio.Group buttonStyle="solid" disabled={!editable}>
            <Radio.Button value={true}>激活</Radio.Button>
            <Radio.Button value={false}>禁用</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );

}

 
