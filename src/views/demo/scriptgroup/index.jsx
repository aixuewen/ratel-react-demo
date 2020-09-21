import React from 'react';
import {
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
  Switch,
  TreeSelect
} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {addApi, deleteApi, downloadApi, getWxDept, listApi, treeListApi, updateApi} from "../../../services/demo/scriptgoup"
import {ParamUtils, RateUtils} from '@utils'
import {
  AddButton,
  CommonButton,
  CommonTable,
  DeleteConfirm,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  HrefViewButton,
  RatelPage,
  SearchButton
} from "@/components";


const {confirm} = Modal;
const {RangePicker} = DatePicker;

class ScriptGroup extends React.Component {
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

  getSearchParams() {
    let values = this.searchForm.current.getFieldsValue();
    let params = {
      name: values.name,
    }
    if (values.createTime) {
      params.createTime = ParamUtils.tranSearchTime(values.createTime)
    }
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams(), (res) => {
      this.setState({
        dataSource: res
      })
    })
  }

  setModalVisible(modalVisible) {
    if (modalVisible) {
      treeListApi({}, (res) => {
        this.setState({
          treeDataSource: [{
            title: '顶级脚本组',
            value: '0',
            children: res
          }],
        })
      })
    }
    this.setState({modalVisible})
  }

  onSaveMenu = (values) => {
    let param = Object.assign(this.state.currentRow, values);
    if (this.state.currentRow.id) {
      updateApi(param, (res) => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      addApi(param, (res) => {
        this.setModalVisible(false)
        this.getData()
      })
    }
  }

  //查询
  onHandleSearch = () => {
    this.getData()
  }

  onEditMenu(record) {
    this.setState({currentRow: record, modalEditable: true})
    this.setModalVisible(true)
  }

  onViewClick(record) {
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onAddBtn() {
    this.setState({currentRow: {enabled: true, pid: '0', type: null}})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onExportBtn() {
    downloadApi(this.getSearchParams(), (data) => {
      RateUtils.downloadFile(data, '脚本组数据', 'xlsx')
    })
  }

  onDeleteBtn(id) {
    deleteApi([id], () => {
      this.getData()
    })
  }

  onEnabledClick = (record) => {
    confirm({
      icon: <ExclamationCircleOutlined/>,
      content: record.enabled ? '此操作将 "停用" ' + record.name + '组, 是否继续？' : '此操作将 "启用" ' + record.name + '组, 是否继续？',
      onOk: () => {
        record.enabled = !record.enabled
        updateApi(record, () => {
          this.getData()
        })
      },
      onCancel: () => {
      },
    });
  }

  onWxDept() {
    getWxDept({}, (res) => {
      message.info("同步成功")
    })
  }

  render() {
    const {dataSource, treeDataSource, currentRow} = this.state
    const columns = [
      {
        title: '脚本组名称',
        dataIndex: 'name'
      }, {
        title: '排序',
        dataIndex: 'sort'
      }, {
        title: '状态',
        dataIndex: 'enabled',
        render: (text, record) => {
          return <Switch checkedChildren="启用" unCheckedChildren="停用" checked={text} key={'switch' + record.id}
                         onChange={() => this.onEnabledClick(record)}/>
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
            <Form.Item name="name">
              <Input placeholder="输入名称搜索"/>
            </Form.Item>
            <Form.Item name="createTime">
              <RangePicker format={'YYYY-MM-DD'}/>
            </Form.Item>
            <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 24, offset: 0}}}>
              <SearchButton onClick={this.onHandleSearch}/>
            </Form.Item>
          </Form>
          <Row style={{paddingBottom: 15}}>
            <AddButton onClick={() => this.onAddBtn()}/>
            {/*<DeleteConfirm onConfirm={() => this.onWxDept()}>*/}
            {/*  <CommonButton icon="refresh" label="同步"/>*/}
            {/*</DeleteConfirm>*/}
            <ExportButton onClick={() => this.onExportBtn()}/>
          </Row>
          <CommonTable
            rowKey={(r, i) => r.id}
            columns={columns}
            dataSource={dataSource}
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
        />
      </RatelPage>
    )
  }
}




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
        form.validateFields().then(values => {
          submitMap(values);
        }).catch(info => {
          console.log('校验失败:', info);
        });
      }}
    >
      <Form form={form} {...layout} name="serverDetail" initialValues={currentDetailData}>
        <Form.Item label="组名称" name="name" rules={[{required: true}]}>
          <Input placeholder="请输入组名称" disabled={!editable}/>
        </Form.Item>
        {/*<Form.Item label="组类别" name="type" rules={[{required: true}]}>*/}
        {/*  <Select disabled={!editable}>*/}
        {/*    <Select.Option value="机构">机构</Select.Option>*/}
        {/*    <Select.Option value="园区">园区</Select.Option>*/}
        {/*  </Select>*/}
        {/*</Form.Item>*/}
        <Form.Item label="组排序" name="sort">
          <InputNumber min={1} max={10000} disabled={!editable}/>
        </Form.Item>
        <Form.Item label="组状态" name="enabled">
          <Radio.Group buttonStyle="solid" disabled={!editable}>
            <Radio.Button value={true}>启用</Radio.Button>
            <Radio.Button value={false}>停用</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="上级脚本组" name="pid">
          <TreeSelect
            treeData={treeDataSource}
            disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ScriptGroup
