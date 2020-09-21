import React from 'react'
import {
  Button,
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
  TreeSelect
} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

import * as oauthApi from "../../../services/system/oauth";
import * as deptApi from "../../../services/system/dept";
import * as sourceApi from "../../../services/system/source";


import moment from "moment";
import {ParamUtils, RateUtils} from '@utils'

import './index.less';
import {
  AddButton,
  CommonTable,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  HrefViewButton,
  RatelPage,
  SearchButton
} from "@/components";
import {downloadApi} from "../../../services/system/dept";


const {SHOW_PARENT} = TreeSelect;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {TextArea} = Input;


class Roles extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      sorter:{field:"createTime"},
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
    oauthApi.list(params).then((res) => {
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
    deptApi.treeListApi({}, (res) => {
      this.setState({detpTreeData: res})
    })

    sourceApi.treeListApi({}).then((res) => {
      if (res.data.success) {
        this.setState({sourceTreeData: RateUtils.toTree(res.data.content)})
      } else {
        message.error(res.data.message);
      }
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
        connType: null,
        contactor:null,
        contactorPhone:null
      }
    })
  }

  onSaveMenu = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    // const depts = []
    // if (values.depts) {
    //   values.depts.forEach(function (data, index) {
    //     const dept = {id: data}
    //     depts.push(dept)
    //   })
    // }
    oauthApi.edite(Object.assign(this.state.currentRow, {})).then((res) => {
      if (res.data.success) {
        this.setModalVisible(false)
        this.getData()
        message.info("操作成功");
      } else {
        message.error(res.data.message);
      }
    })
  }

  onDeleteBtn(id) {
    oauthApi.deleteApi([id]).then((res) => {
      if (res.data.success) {
        message.info("操作成功");
        this.getData()
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

    oauthApi.downloadApi(params).then(result => {
      RateUtils.downloadFile(result.data, '客户端管理', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })

  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  onViewClick(record) {
    console.log(record)
    if (!record.ips) {
      record.ips = []
    }
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onRow(record) {
    const menus = []
    oauthApi.oneApi(record.id, (res) => {
      if (res.sysMenus) {
        res.sysMenus.forEach(function (menu, index) {
          menus.push(menu.id)
        })
      }
      this.setState({
        rowId: record.id,
        menuSelectedKeys: menus
      });
    })
  }

  saveRoleMenu = () => {
    if (!this.state.rowId) {
      message.error("请选择一个角色")
      return
    }
    const menus = []
    this.state.menuSelectedKeys.forEach(function (data, index) {
      const menu = {id: data}
      menus.push(menu)
    })

    oauthApi.addRolesMenu({id: this.state.rowId, sysMenus: menus}).then((res) => {
      if (res.data.success) {
        message.info("操作成功");
      } else {
        message.error(res.data.message);
      }
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
  onUpdateMenu(record) {

    oauthApi.updatee(record).then((res) => {
      if (res.data.success) {
        this.setModalVisible(false)
        this.getData()
        message.info("操作成功");
      } else {
        message.error(res.data.message);
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
    const {dataSource, currentRow, pagination, detpTreeData, sourceTreeData, menuSelectedKeys} = this.state
    const columns = [
      {
        title: '应用名',
        dataIndex: 'applicationName',
        key: 'applicationName',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: 'clientId',
        dataIndex: 'clientId'
      },
      {
        title: 'clientSecret',
        dataIndex: 'clientSecret'
      },
     /* {
        title: '接入类型',
        dataIndex: 'connType'
      },*/
      {
        title: '描述',
        dataIndex: 'description'
      }, {
        title: '创建日期',
        dataIndex: 'createTime',
        render: (text, record, index) => {
          return (
            record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
          )
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <HrefViewButton onClick={() => this.onViewClick(record)} label={'查看'}/>
            <Divider type='vertical'/>
            <HrefEditButton onClick={() => this.onEditMenu(record)} label={'编辑'}/>
            <Divider type='vertical'/>
            <Popconfirm title="确认更新密钥?" onConfirm={() => this.onUpdateMenu(record)}>
              <a href='javascript:;' className='text-color-dust'><i className="fa fa-edit"/> 更新密钥</a>
            </Popconfirm> 
            <Divider type='vertical'/>
            <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)} label={'删除'}/>
          </span>)
      }]

    const rowSelection = {
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
            <Col span={24}>
              <Card title="客户端列表">
                <CommonTable
                  rowKey={(r, i) => r.id}
                  // rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  onChange={this.onTablePaginationChange}
                  // onRow={record => {
                  //   return {
                  //     onClick: event => this.onRow(record), // 点击行
                  //   };
                  // }}
                  rowClassName={(record) => {
                    return record.id === this.state.rowId ? 'clickRowStyl' : '';
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
            {/*<Col span={6} style={{paddingLeft: '25px'}}>*/}
            {/*  <Card title="菜单分配" extra={<a href='javascript:;' onClick={this.saveRoleMenu}>保存</a>}>*/}
            {/*    <Tree*/}
            {/*      checkable*/}
            {/*      showLine={true}*/}
            {/*      onCheck={onSelect}*/}
            {/*      treeData={sourceTreeData}*/}
            {/*      checkedKeys={menuSelectedKeys}*/}
            {/*    />*/}
            {/*  </Card>*/}
            {/*</Col>*/}
          </Row>
        </div>
      </RatelPage>
    )
  }
}

export default Roles;


const CollectionCreateForm = ({visible, editable, submitMap, onCancel, detpTreeData, currentDetailData}) => {
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
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 20, offset: 4},
    },
  };

  form.setFieldsValue(currentDetailData)
  const tProps = {
    treeData: detpTreeData,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '请选择部门',
    style: {
      width: '100%',
    },
  };
  return (
    <Modal
      forceRender
      visible={visible}
      title="客户端管理"
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
        <Form.Item label="应用名称" name="applicationName" rules={[{required: true}]}>
          <Input placeholder="请输入应用名称" disabled={!editable} style={{width: '90%'}}/>
        </Form.Item>

        <Form.Item label="clientId" name="clientId">
          <Input placeholder="系统自动生成" disabled={true} style={{width: '90%'}}/>
        </Form.Item>

        <Form.Item label="clientSecret" name="clientSecret">
          <Input placeholder="系统自动生成" disabled={true} style={{width: '90%'}}/>
        </Form.Item>

        {/*<Form.Item label="接入类别" name="connType" rules={[{required: true}]}>
          <Select disabled={!editable} style={{width: '90%'}} placeholder="请选择接入类别">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="政府">政府</Select.Option>
            <Select.Option value="企业">企业</Select.Option>
          </Select>
        </Form.Item>*/}

        <Form.List name="ips">
          {(fields, {add, remove}) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? layout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '可信域名' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "请输入可信域名",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="请输入可信域名" style={{width: '90%'}} disabled={!editable}/>
                    </Form.Item>
                    {fields.length > 1 && !!editable ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{margin: '0 8px'}}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                {!!editable ? <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{width: '90%'}}
                    disabled={!editable}
                  >
                    <PlusOutlined/> 新增可信域名（或IP）
                  </Button>
                </Form.Item> : null}
              </div>
            );
          }}
        </Form.List>

        <Form.Item label="联系人" name="contactor">
          <Input placeholder="请输入联系人" disabled={!editable} style={{width: '90%'}}/>
        </Form.Item>
        <Form.Item label="联系电话" name="contactorPhone">
          <Input placeholder="请输入联系电话" disabled={!editable} style={{width: '90%'}}/>
        </Form.Item>
        
        <Form.Item label="描述信息" name="description">
          <TextArea placeholder="请输入描述信息" disabled={!editable} style={{width: '90%'}}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

