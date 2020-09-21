import React from 'react'
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tree,
  TreeSelect
} from 'antd'


import * as roleApi from "../../../services/system/role";
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


const {SHOW_PARENT} = TreeSelect;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {TextArea} = Input;
let temp = [];

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
      },
      checkKeysContainParent:[]
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
    roleApi.rolesList(params).then((res) => {
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
      currentRow: {name: null, level: null, description: null, permission: null, dataScope: '本级', depts: []}
    })
  }

  onSaveMenu = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    const depts = []
    if (values.depts) {
      values.depts.forEach(function (data, index) {
        const dept = {id: data}
        depts.push(dept)
      })
    }
    if (this.state.currentRow.id) {
      roleApi.updateRoles(Object.assign(this.state.currentRow, {sysDepts: depts})).then((res) => {
        if (res.data.success) {
          this.setModalVisible(false)
          this.getData()
          message.info("操作成功");
        } else {
          message.error(res.data.message);
        }
      })
    } else {
      roleApi.addRoles(Object.assign(values, {sysDepts: depts})).then((res) => {
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

  onDeleteBtn(id) {
    roleApi.deleteRoles([id]).then((res) => {
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

    roleApi.rolesDownload(params).then(result => {
      RateUtils.downloadFile(result.data, '角色数据', 'xlsx')
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
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  /*onRow(record) {
    const menus = []
    roleApi.oneApi(record.id, (res) => {
      if (res.sysMenus) {
        let temp =[]
        this.requestList(res.sysMenus,temp)   //将后台返回的所有父子节点的数组传给requestList 方法，过滤出子节点存入数组test， 判断 pid是0的代表父节点
        if (res.sysMenus) {
          res.sysMenus.forEach(function (menu, index) {
            menus.push(menu.id)
          })
        }
        let uniqueChild = this.uniqueTree(menus,temp)  //数组进行比对删选出来父节点
        this.setState({
          rowId: record.id,
          menuSelectedKeys: uniqueChild
        });
      }
      // this.setState({
      //   rowId: record.id,
      //   menuSelectedKeys: menus
      // });
    })
  }

  //这个方法是筛选出来所有的子节点，存放在test数组中
  requestList = (data,temp) => {
    data && data.map(item => {
      if (item.pid === '0'){ //pid = 0 是父节点
      } else {
        temp.push(item.id)
      }
    })
    return temp
  }
  // 数组进行比对删选出来父节点
  uniqueTree =(uniqueArr,Arr) => {
    let uniqueChild = []
    for (var i in Arr){
      for (var k in uniqueArr){
        if (uniqueArr[k] === Arr[i]){
          uniqueChild.push(uniqueArr[k])
        }
      }
    }
    return uniqueChild
  }*/


  //选中行
  onRow(record) {
    const menus = []
    roleApi.oneApi(record.id, (res) => {
      console.log(res.sysMenus);
      this.requestList(res.sysMenus)   //将后台返回的所有父子节点的数组传给requestList 方法，过滤出子节点存入数组test， 判断 pid是0的代表父节点
      if (res.sysMenus) {
        res.sysMenus.forEach(function (menu, index) {
          menus.push(menu.id)
        })
      }
      let uniqueChild = this.uniqueTree(menus,temp)  //数组进行比对删选出来父节点
      console.log(temp);
      this.setState({
        rowId: record.id,
        menuSelectedKeys: uniqueChild
      });
    })
  }

  requestList(data) {
    let parentItems = [];
    data.forEach(item => {
      var allParent = this.familyTree(data,item.id);
      allParent && allParent.map(item => {
        parentItems.push(item.id)
      })
    })

    parentItems=[...new Set(parentItems)]; //去重
    console.log(parentItems);

    data && data.map(item => {
      if (!parentItems.includes(item.id)){
        temp.push(item.id)
      }
    })
    return temp
  }

  // 查找一个节点的所有父节点
  familyTree (arr1, id) {
    let originId = id;
    var temp = []
    var forFn = function (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (item.id === id) {
          temp.push(item)
          forFn(arr1, item.pid)
          break
        }
      }
    }
    forFn(arr1, id)
    // 去掉传入的id本身
    let t = [];
    temp && temp.forEach(item => {
      if (item.id !== originId){
        t.push(item)
      }
    })
    return t
  }


  // 数组进行比对删选出来父节点
  uniqueTree =(uniqueArr,Arr) => {
    let uniqueChild = []
    for (var i in Arr){
      for (var k in uniqueArr){
        if (uniqueArr[k] === Arr[i]){
          uniqueChild.push(uniqueArr[k])
        }
      }
    }
    return uniqueChild
  }


  saveRoleMenu = () => {
    if (!this.state.rowId) {
      message.error("请选择一个角色")
      return
    }
    const menus = []
    // this.state.menuSelectedKeys.forEach(function (data, index) {
    //   const menu = {id: data}
    //   menus.push(menu)
    // })
    this.state.checkKeysContainParent.forEach(function (data, index) {
      const menu = {id: data}
      menus.push(menu)
    })

    roleApi.addRolesMenu({id: this.state.rowId, sysMenus: menus}).then((res) => {
      if (res.data.success) {
        message.info("操作成功");
      } else {
        message.error(res.data.message);
      }
    })
  }

  onEditMenu(record) {
    console.log(record)
    const depts = []
    record.sysDepts.forEach(function (dept, index) {
      depts.push(dept.id)
    })
    record.depts = depts
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

  render() {
    const {dataSource, currentRow, pagination, detpTreeData, sourceTreeData, menuSelectedKeys} = this.state
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '数据权限',
        dataIndex: 'dataScope'
      },
      {
        title: '角色级别',
        dataIndex: 'level'
      },
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
            <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)} label={'删除'}/>
          </span>)
      }]

    const rowSelection = {
      onChange: this.onSelectChange
    };

    const onSelect = (selectedKeys,e) => {
      let concatTreeData =  selectedKeys.concat(e.halfCheckedKeys)
      // this.setState({menuSelectedKeys: selectedKeys})
      this.setState({menuSelectedKeys: selectedKeys,checkKeysContainParent:concatTreeData})
      // this.setState({menuSelectedKeys: selectedKeys})
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
        <div className='bonc-mung-role-list'>

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
              <Card title="角色列表">
                <CommonTable
                  rowKey={(r, i) => r.id}
                  // rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  onChange={this.onTablePaginationChange}
                  onRow={record => {
                    return {
                      onClick: event => this.onRow(record), // 点击行
                    };
                  }}
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
            <Col span={6} style={{paddingLeft: '25px'}}>
              <Card title="菜单分配" extra={<a href='javascript:;' onClick={this.saveRoleMenu}>保存</a>}>
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
      </RatelPage>
    )
  }
}

export default Roles;


const CollectionCreateForm = ({visible, editable, submitMap, onCancel, detpTreeData, currentDetailData}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
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
      title="角色管理"
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
        <Form.Item label="角色名称" name="name" rules={[{required: true}]}>
          <Input placeholder="请输入名称" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="角色级别" name="level" rules={[{required: true}]}>
          <InputNumber min={1} max={10000} disabled={!editable}/>
        </Form.Item>

        <Form.Item label="权限标识" name="permission" rules={[{required: true}]}>
          <Input placeholder="请输入权限标识" disabled={!editable}/>
        </Form.Item>
        <Form.Item label="数据范围" name="dataScope" rules={[{required: true}]}>
          <Select style={{width: 120}} allowClear placeholder="数据范围" disabled={!editable}>
            <Option value="全部">全部</Option>
            <Option value="本级">本级</Option>
            <Option value="自定义">自定义</Option>
          </Select>
        </Form.Item>

        <Form.Item noStyle
                   shouldUpdate={(prevValues, currentValues) => prevValues.dataScope !== currentValues.dataScope}>
          {({getFieldValue}) => {
            return getFieldValue('dataScope') === '自定义' ? (
              <Form.Item label="数据权限" name="depts" rules={[{required: true}]}>
                <TreeSelect disabled={!editable} {...tProps}/>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item label="描述信息" name="description">
          <TextArea placeholder="请输入描述信息" disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

