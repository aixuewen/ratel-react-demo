import React from 'react'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Tree,
  TreeSelect,
  Checkbox
} from 'antd'
import {addUser, deleteUser, rolesList, updateUser, userList, usersDownload} from "../../../services/system";
import {treeListApi} from "../../../services/report";
import moment from "moment";
import {RateUtils,axios} from '@utils'
import {DownloadOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import * as service from "../../../services/report"
import {
  AddButton,
  CommonButton,
  DeleteConfirm,
  CommonTable,
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
class Assign extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      detpTreeData: [],
      roleListData: [],
      modalVisible: false,
      modalEditable: true,
      currentRow: {},
      treeDataSource: [],
      columns: [],
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      pointList:[],
      allDeptList:''
    }
  }

  getSearchParams() {
    let values = this.searchForm.current.getFieldsValue();
    let params = {
      blurry: values.blurry,
    }
    if (values.createTime) {
      params.createTime = [];
      params.createTime[0] = moment(values.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
      params.createTime[1] = moment(values.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    }

    if (this.state.currentDeptId) {
      params.sysDeptId = this.state.currentDeptId
    }
    return params
  }


  getDeptData = (value) => {
    
  }

  componentDidMount() {
    this.allDeptList()
  }

  allDeptList = () => {
    service.listApi({}, (res) => {
      console.log(res)
      this.setState({
        allDeptList: res
      })
    })
  }


  setModalVisible(modalVisible) {
    if (modalVisible) {
      treeListApi({}, (res) => {
        this.setState({
          treeDataSource: res,
        })
      })
    }
    this.setState({modalVisible})
  }

  onSaveMenu = (values) => {
    this.setState({currentRow: Object.assign(this.state.currentRow, values)})
    
    let param = values
    const de ={id:'',name:''};
    const deptMap = {}
    for (let j=0;j<param.dept1.length;j++) {
      deptMap[param.dept1[j]]=true
    }
    this.state.allDeptList.map(item => {
      if (deptMap[item.id]){
        de.id=item.id
        de.name=item.name
      }
    })
    const de1 =[];
    
    const deptMap1 = {}
    for (let j=0;j<param.dept2.length;j++) {
      deptMap1[param.dept2[j]]=true
    }
    this.state.allDeptList.map(item => {
        if (deptMap1[item.id]){
          de1.push({id:item.id,name:item.name})
        }
    })
    const de2 =[];
    
    const deptMap2 = {}
    for (let j=0;j<param.dept3.length;j++) {
      deptMap2[param.dept2[j]]=true
    }
    this.state.allDeptList.map(item => {
        if (deptMap[item.id]){
          de2.push({id:item.id,name:item.name})
        }
    })

    
    if (this.state.currentRow.id) {
      service.assignment(Object.assign(this.state.currentRow, {id:'1',dept1: de,dept2:de1,dept3:de2}), () => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      service.assignment(Object.assign(values, {id:'1',dept1: de,dept2:de1,dept3:de2}), () => {
        this.setModalVisible(false)
        this.getData()
      })
    }

  }

  onAddBtn() {
    
    this.setModalVisible(true)

  }

  onViewClick(record) {
    record.depts = record.sysDept.id
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onEditMenu(record) {
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onDeleteBtn(id) {
    deleteUser([id]).then((res) => {
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
      }
    })
    this.getData()
  }

  onExportBtn() {
    usersDownload(this.getSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '用户数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }

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

  //后加的方法
 
  onChangepoint = e => {
    console.log('radio checked', e.target.value);
    axios.get('/api/point/list',{pointType:e.target.value}).then((res) => {
      if (res) {
        this.setState({
          pointList: res.data.content
        });
      }
    })
  };
  

  render() {
    const {dataSource, treeDataSource, currentRow, pagination, roleListData, detpTreeData} = this.state
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName'
      }, {
        title: '姓别',
        dataIndex: 'sex',
        key: 'sex',
        render: (text, record, index) => {
          return (
            record.sex === "1" ? "男" : record.sex === "2" ? "女" : record.sex
          )
        }
      }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
      }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      }, {
        title: '部门',
        dataIndex: 'deptId',
        render: (text, record, index) => {
          return record.sysDept.name
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
        render: (text, record) => (
          <span>
            <a onClick={() => this.onViewClick(record)}><i className="fa fa-eye"/></a>
            <Divider type='vertical'/>
            <a href='javascript:;' className='text-color-green' onClick={() => this.onEditMenu(record)}>
              <i className="fa fa-edit"/></a>
            <Divider type='vertical'/>
            <Popconfirm title="确认删除?" onConfirm={() => this.onDeleteBtn(record.id)}>
              <a href='javascript:;' className='text-color-dust'><i className="fa fa-close"/></a>
            </Popconfirm>
        </span>
        )
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
                <Form.Item
                  wrapperCol={{
                    xs: {span: 24, offset: 0},
                    sm: {span: 24, offset: 0},
                  }}
                >
                  <Button type="primary" icon={<SearchOutlined/>} onClick={this.onHandleSearch}>
                    查询
                  </Button>
                </Form.Item>
              </Form>

              <Row style={{paddingBottom: 15}}>
                <Button type="primary" icon={<PlusOutlined/>} danger className="margin-right-10"
                        onClick={() => this.onAddBtn()}> 新增 </Button>
              </Row>
              <CommonTable
                rowKey={(r, i) => r.riskInfoId}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                onChange={this.onTablePaginationChange}
                pagination={{
                  total: pagination.total,
                  current: pagination.current,
                  pageSize: pagination.pageSize
                }}
                onSearch={this.onSearch}
                onqtChange={this.onChange}
                pointList={this.state.pointList}
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
          onChangepoint={this.onChangepoint}
          pointList={this.state.pointList}
        />
      </RatelPage>
    )
  }
}

export default Assign;

const CollectionCreateForm = ({visible, editable, roleListData, detpTreeData, submitMap, onCancel, currentDetailData,onChangepoint,pointList,treeDataSource}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.setFieldsValue(currentDetailData)
  return (
    <Modal
      visible={visible}
      title="事件分派"
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
        <Form.Item label="点位类型：" name="pointType" rules={[{required: true}]} onChange={onChangepoint}>
        <Radio.Group >
          <Radio value={1}>示范点</Radio>
          <Radio value={2}>随机点</Radio>
          <Radio value={3}>其它社区</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="选择点位:" name="pointDetail" rules={[{required: true}]}>
        <Select defaultValue="" style={{ width: 565 }} >
          {(pointList || []).map((item, index) => {
            
                        return (
                        
                            <Option value={item.pointId}>{item.point}</Option>
                        )
                    })}
         </Select>
        </Form.Item>

        <Form.Item label="牵头部门:" name="dept1" rules={[{required: true}]}>
        <TreeSelect
            showSearch={false}
            placeholder="请选择建议牵头部门"
            treeData={treeDataSource}
            disabled={!editable}/>
        </Form.Item>

        <Form.Item label="责任部门:" name="dept2" rules={[{required: true}]}>
       
        <TreeSelect
            showSearch={true}
            multiple
            placeholder="请选择建议责任部门"
            treeData={treeDataSource}
            disabled={!editable}/>
            
        </Form.Item>

        <Form.Item label="配合部门" name="dept3" >
          <TreeSelect
              showSearch={false}
              multiple
              placeholder="请选择建议配合部门"
              treeData={treeDataSource}
              disabled={!editable}/>
          </Form.Item>
        <Form.Item label="整改时限" name="changeTimeLimit">
          <DatePicker format='YYYY-MM-DD'/>
        </Form.Item>
      </Form>
    </Modal>
  );

}

 
