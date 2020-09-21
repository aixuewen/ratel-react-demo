import React from 'react'
import {Card, Col, Divider, Form, Input, InputNumber, message, Modal, Row} from 'antd'
import * as service from "../../../services/system/datadict"
import * as serviceDtl from "../../../services/system/datadictDtl"
import {ParamUtils, RateUtils} from '@utils'
import {
  AddButton,
  CommonTable,
  ExportButton,
  HrefDelButton,
  HrefEditButton,
  RatelPage,
  SearchButton
} from "@/components";

import './index.less'
import * as userApi from "../../../services/system/user";

class Datadict extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      rowName: null,
      dataSource: [],
      dataDataDtl: [],
      modalVisible: false,
      modalVisibleDtl: false,
      columns: this.columns,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      paginationDtl: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {
    this.getData()
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  setModalVisibleDtl(modalVisibleDtl) {
    this.setState({modalVisibleDtl})
  }

  onAddBtn() {
    this.setState({
      currentDictRow: {name: null, remark: null},
      modalEditable: true,
      modalVisible: true
    })
  }

  onAddBtnDtl() {
    if (this.state.rowId) {
      this.setState({
        currentRowDtl: {label: null, value: null, sort: null},
        modalEditable: true,
        modalVisibleDtl: true
      })
    } else {
      message.warn("请选择字典")
    }
  }

  onEditBtn(record) {
    this.setState({currentDictRow: record, modalEditable: true, modalVisible: true})
  }

  onEditBtnDtl(record) {
    this.setState({currentRowDtl: record, modalEditable: true, modalVisibleDtl: true})
  }

  onDeleteBtn(id) {
    service.deleteApi(id, () => {
      this.getData()
    })
  }

  onDeleteBtnDtl(id) {
    serviceDtl.deleteApi(id, () => {
      this.getDataDtl()
    })
  }

  onSaveItem = (values) => {
    this.setState({currentDictRow: Object.assign(this.state.currentDictRow, values)})
    if (this.state.currentDictRow.id) {
      service.updateApi(this.state.currentDictRow, () => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      service.addApi(values, () => {
        this.setModalVisible(false)
        this.getData()
      })
    }
  }


  onSaveItemDtl = (values) => {
    let param = Object.assign(this.state.currentRowDtl, values)
    this.setState({currentRowDtl: param})
    param.sysDict = {id: this.state.rowId}

    if (this.state.currentRowDtl.id) {
      serviceDtl.updateApi(param, () => {
        this.setModalVisibleDtl(false)
        this.getDataDtl()
      })
    } else {
      serviceDtl.addApi(param, () => {
        this.setModalVisibleDtl(false)
        this.getDataDtl()
      })
    }
  }

  onRow(record) {
    let params = ParamUtils.getPageParam(this.state.paginationDtl, this.state.sorterDtl)
    params.dictName = record.name
    serviceDtl.listApi(params, (res) => {
      this.setState({
        rowId: record.id,
        rowName: record.name,
        currentDictRow: record,
        dataDataDtl: res.content,
        paginationDtl: Object.assign(this.state.paginationDtl, {
          total: res.totalElements
        })
      });

    })
  }

  //查询
  onHandleSearch = () => {
    this.setState({
      rowId: null,
      rowName: null,
      dataDataDtl: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      paginationDtl: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    })
    this.getData()
  }

  getSearchParams() {
    let values = this.searchForm.current.getFieldsValue();
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    params.blurry = values.blurry
    return params
  }

  getData = () => {
    service.listApi(this.getSearchParams(), (res) => {
      this.setState({
        dataSource: res.content,
        pagination: Object.assign(this.state.pagination, {
          total: res.totalElements
        })
      })
    })
  }


  getDataDtl = () => {
    let params = ParamUtils.getPageParam(this.state.paginationDtl, this.state.sorterDtl)
    params.dictName = this.state.rowName
    serviceDtl.listApi(params, (res) => {
      this.setState({
        dataDataDtl: res.content,
        paginationDtl: Object.assign(this.state.paginationDtl, {
          total: res.totalElements
        })
      });
    })
  }
  onExportBtn() {
    serviceDtl.downloadApi(this.getSearchParams()).then(result => {
      RateUtils.downloadFile(result.data, '字典数据', 'xlsx')
    }).catch(() => {
      message.error("数据下载错误")
    })
  }

  render() {
    const {dataSource, currentDictRow, currentRowDtl, dataDataDtl, pagination, paginationDtl} = this.state
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '描述',
        dataIndex: 'remark'
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <HrefEditButton onClick={() => this.onEditBtn(record)}/>
            <Divider type='vertical'/>
            <HrefDelButton onConfirm={() => this.onDeleteBtn(record.id)}/>
          </span>)
      }]
    const columnsDtl = [
      {
        title: '所属字典',
        dataIndex: 'sysDictName'
      }, {
        title: '字典标签',
        dataIndex: 'label'
      }, {
        title: '字典值',
        dataIndex: 'value'
      }, {
        title: '排序',
        dataIndex: 'sort'
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <HrefEditButton onClick={() => this.onEditBtnDtl(record)}/>
            <Divider type='vertical'/>
            <HrefDelButton onConfirm={() => this.onDeleteBtnDtl(record.id)}/>
        </span>
        )
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
        <div className='bonc-mung-role-list'>
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="blurry">
              <Input placeholder="输入名称搜索"/>
            </Form.Item>
            <Form.Item wrapperCol={{
              xs: {span: 24, offset: 0},
              sm: {span: 24, offset: 0},
            }}>
              <SearchButton onClick={this.onHandleSearch}/>
            </Form.Item>
          </Form>

          <Row style={{paddingBottom: 15}}>
            <AddButton onClick={() => this.onAddBtn()}/>
            <ExportButton onClick={() => this.onExportBtn()}/>
          </Row>

          <Row>
            <Col span={10}>
              <Card title="字典列表">
                <CommonTable
                  rowKey={(r, i) => r.id}
                  columns={columns}
                  dataSource={dataSource}
                  noSorterAll={true}
                  onChange={(pagination, filters, sorter, extra) => {
                    this.setState({pagination: pagination, sorter: sorter}, () => {
                      this.getData()
                    })
                  }}
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
            </Col>
            <Col span={14} style={{paddingLeft: '25px'}}>
              <Card title="字典详情" extra={<a href='javascript:;' onClick={() => this.onAddBtnDtl()}> 新增</a>}>
                <CommonTable
                  rowKey={(r, i) => r.id}
                  columns={columnsDtl}
                  dataSource={dataDataDtl}
                  noSorterAll={true}
                  onChange={(pagination, filters, sorter, extra) => {
                    this.setState({paginationDtl: pagination, sorterDtl: sorter}, () => {
                      this.getDataDtl()
                    })
                  }}
                  pagination={{
                    total: paginationDtl.total,
                    current: paginationDtl.current,
                    pageSize: paginationDtl.pageSize
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <CollectionCreateForm
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          submitMap={this.onSaveItem}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          currentDictRow={currentDictRow}
        />

        <CollectionCreateFormDtl
          visible={this.state.modalVisibleDtl}
          editable={this.state.modalEditable}
          submitMap={this.onSaveItemDtl}
          onCancel={() => {
            this.setModalVisibleDtl(false)
          }}
          currentDictRow={currentRowDtl}
        />
      </RatelPage>
    )
  }
}

export default Datadict


const CollectionCreateForm = ({visible, editable, submitMap, onCancel, currentDictRow}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.setFieldsValue(currentDictRow)
  return (
    <Modal
      visible={visible}
      title="数据字典管理"
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
        initialValues={currentDictRow}
      >
        <Form.Item label="字典名称" name="name" rules={[{required: true}]}>
          <Input placeholder="请输入字典名称" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="描述" name="remark">
          <Input placeholder="请输入描述" disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}


const CollectionCreateFormDtl = ({visible, editable, submitMap, onCancel, currentDictRow}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18},
  };
  form.setFieldsValue(currentDictRow)
  return (
    <Modal
      visible={visible}
      title="数据字典管理"
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
        initialValues={currentDictRow}
      >
        <Form.Item label="字典标签" name="label" rules={[{required: true}]}>
          <Input placeholder="请输入字典标签" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="字典值" name="value">
          <Input placeholder="请输入字典值" disabled={!editable}/>
        </Form.Item>

        <Form.Item label="排序" name="sort">
          <InputNumber min={1} max={10000} disabled={!editable}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
