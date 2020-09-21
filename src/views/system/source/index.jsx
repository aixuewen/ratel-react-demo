import React from 'react';
import {DatePicker, Divider, Form, Input, InputNumber, message, Modal, Radio, Row, Select, Tag, TreeSelect} from 'antd'
import {addApi, deleteApi, downloadApi, listApi, treeListApi, updateApi} from "../../../services/system/source"
import {ParamUtils, RateUtils} from '@utils'
import iconData from '../../../assets/json/iconData'
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

const {RangePicker} = DatePicker;
const {Option} = Select;


class Source extends React.Component {

  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      modalEditable: true,
      menuType: 0,
      dataSource: [],
      currentRow: {},
      treeDataSource: [{
        id: '0',
        title: '顶级类目',
        value: '0'
      }],
    }
  }

  componentDidMount() {
    this.getData();
  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  getSearchParams() {
    let values = this.searchForm.current.getFieldsValue();
    let params = {
      blurry: values.blurry,
    }
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams()).then((res) => {
      if (res.data.success) {
        this.setState({
          dataSource: res.data.content.content
        })
      } else {
        message.error(res.data.message);
      }
    })
  }

  setModalVisible(modalVisible) {
    if (modalVisible) {
      treeListApi({}).then((res) => {
        if (res.data.success) {
          this.setState({
            treeDataSource: [{
              title: '顶级类目',
              value: '0',
              children: RateUtils.createTree(res.data.content, '0')
            }],
          })
        } else {
          message.error(res.data.message);
        }
      })
    }
    this.setState({modalVisible})
  }

  onSaveMenu = (values) => {
    let param = Object.assign(this.state.currentRow, values);
    if (this.state.currentRow.id) {
      updateApi(param, () => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      addApi(param, () => {
        this.setModalVisible(false)
        this.getData()
      })
    }
  }

  onEditMenu(record) {
    this.setState({currentRow: record, menuType: record.type})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onViewClick(record) {
    this.setState({currentRow: record, menuType: record.type})
    this.setModalVisible(true)
    this.setState({modalEditable: false})
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

  onAddBtn() {
    this.setState({currentRow: {type: 0, cache: false, iframe: false, hidden: false, pid: '0'}, menuType: 0})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onExportBtn() {
    downloadApi(this.getSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '菜单数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }

  onDeleteBtn(id) {
    deleteApi([id], () => {
      this.getData()
    })
  }

  render() {
    const {dataSource, treeDataSource, currentRow} = this.state
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name'
      }, {
        title: '图标',
        dataIndex: 'icon',
        render: text => {
          return <i className={"fa fa-" + text} aria-hidden="true"/>
        }
      }, {
        title: '排序',
        dataIndex: 'sort'
      }, {
        title: '权限标识',
        dataIndex: 'permission'
      }, {
        title: '外链',
        dataIndex: 'iframe',
        render: text => {
          if (text) {
            return <Tag color={'geekblue'}>是</Tag>
          } else {
            return <Tag color={'volcano'}>否</Tag>
          }
        }
      }, {
        title: '缓存',
        dataIndex: 'cache',
        render: text => {
          if (text) {
            return <Tag color={'geekblue'}>是</Tag>
          } else {
            return <Tag color={'volcano'}>否</Tag>
          }
        }
      }, {
        title: '可见',
        dataIndex: 'hidden',
        render: text => {
          if (text) {
            return <Tag color={'volcano'}>否</Tag>
          } else {
            return <Tag color={'geekblue'}>是</Tag>
          }
        }
      }, {
        title: '创建日期',
        dataIndex: 'createTime'
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

          <CommonTable
            rowKey={(r, i) => r.id}
            columns={columns}
            dataSource={dataSource}
            onChange={this.onTablePaginationChange}
            pagination={false}
            noSorterAll={true}
          />
        </div>

        <CollectionCreateForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveMenu}
          treeDataSource={treeDataSource}
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

export default Source

const CollectionCreateForm = ({visible, editable, treeDataSource, submitMap, onCancel, currentDetailData}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.resetFields();
  form.setFieldsValue(currentDetailData)

  return (
    <Modal
      visible={visible}
      title="编辑详情"
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

        <Form.Item label="菜单类型" name="type">
          <Radio.Group buttonStyle="solid" disabled={!editable}>
            <Radio.Button value={0}>目录</Radio.Button>
            <Radio.Button value={1}>菜单</Radio.Button>
            <Radio.Button value={2}>按钮</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="资源名称" name="name" rules={[{required: true}]}>
          <Input placeholder="请输入资源名称" disabled={!editable}/>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') !== 2 ? (
              <Form.Item label="路由地址" name="path" rules={[{required: true}]}>
                <Input placeholder="请输入路由地址" disabled={!editable}/>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') !== 2 ? (
              <Form.Item label="菜单图标" name="icon">
                <Select placeholder="请选择菜单图标" showSearch allowClear disabled={!editable}>
                  {iconData.map(item => (
                    <Option value={item}>
                      <i className={"fa fa-" + item} aria-hidden="true"/><span
                      style={{marginLeft: 10}}>{item}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') !== 2 ? (
              <Form.Item label="外链菜单" name="iframe">
                <Radio.Group buttonStyle="solid" disabled={!editable}>
                  <Radio.Button value={true}>是</Radio.Button>
                  <Radio.Button value={false}>否</Radio.Button>
                </Radio.Group>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>


        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') === 1 ? (
              <Form.Item label="菜单缓存" name="cache">
                <Radio.Group buttonStyle="solid" disabled={!editable}>
                  <Radio.Button value={true}>是</Radio.Button>
                  <Radio.Button value={false}>否</Radio.Button>
                </Radio.Group>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') !== 2 ? (
              <Form.Item label="资源可见" name="hidden">
                <Radio.Group buttonStyle="solid" disabled={!editable}>
                  <Radio.Button value={false}>是</Radio.Button>
                  <Radio.Button value={true}>否</Radio.Button>
                </Radio.Group>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
          {({getFieldValue}) => {
            return getFieldValue('type') !== 0 ? (
              <Form.Item label="权限标识" name="permission">
                <Input placeholder="请输入权限标识" disabled={!editable}/>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item label="资源排序" name="sort">
          <InputNumber min={1} max={10000} disabled={!editable}/>
        </Form.Item>
        <Form.Item label="上级类目" name="pid">
          <TreeSelect
            treeData={treeDataSource}
            disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );

}

