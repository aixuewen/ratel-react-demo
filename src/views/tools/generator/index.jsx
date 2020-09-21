import React from 'react';
import {Divider, Form, Input, message, Modal, Row, Upload} from 'antd'
import {listApi, onSyTable} from "../../../services/tools/generator"
import {ParamUtils, Storage} from '@utils'
import {PlusOutlined} from '@ant-design/icons';
import config from '@config'
import moment from 'moment';
import {CommonButton, CommonTable, RatelPage, SearchButton} from "@/components";

class StoragePage extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedRowKeys: [],
      fileList: [],
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {
    this.getData();
  }

  setModalVisible(modalVisible) {
    if (!modalVisible) {
      this.setState({fileList: []})
      this.getData()
    }
    this.setState({modalVisible})
  }

  onAddBtn() {
    this.setModalVisible(true)
  }

  onTablePaginationChange = (pagination, filters, sorter, extra) => {
    this.setState({pagination: pagination, sorter: sorter}, () => {
      this.getData()
    })
  }

  getSearchParams() {
    let params = ParamUtils.getPageParam(this.state.pagination, this.state.sorter)
    let values = this.searchForm.current.getFieldsValue();
    params.name = values.blurry;
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams(), (res) => {
      this.setState({
        dataSource: res.content,
        pagination: Object.assign(this.state.pagination, {
          total: res.totalElements
        })
      })
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

  handleChange = ({fileList}) => this.setState({fileList});

  onSelectChange = selectedRowKeys => {
    this.setState({selectedRowKeys});
  };

  onSyTable() {
    onSyTable(this.state.selectedRowKeys, (res) => {
      message.info('同步成功！');
      this.setState({
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }, selectedRowKeys: []
      }, () => {
        this.getData()
      })

    })
  }

  render() {
    const {dataSource, pagination, modalVisible, selectedRowKeys, fileList} = this.state
    const columns = [
      {
        title: '表名',
        dataIndex: 'tableName'
      }, {
        title: '数据库引擎',
        dataIndex: 'engine'
      }, {
        title: '字符编码集',
        dataIndex: 'coding'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '创建日期',
        dataIndex: 'createTime',
        render: (text, record, index) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (<span>
            <a href='javascript:;'>预览</a>
            <Divider type='vertical'/>
            <a href='javascript:;'>下载</a>
            <Divider type='vertical'/>
            <a href='javascript:;'>配置</a>
           <Divider type='vertical'/>
            <a href='javascript:;'>生成</a>
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
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const uploadProps = {
      action: config.API_BASE_URL + '/api/sys/storage/image',
      listType: "picture-card",
      headers: {Authorization: Storage.getAuthorizationToken()},
      method: 'POST',
      onChange: this.handleChange,
      multiple: false,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="blurry">
              <Input placeholder="输入表名搜索"/>
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
            {/*{this.state.selectedRowKeys ? <DeleteButton onClick={() => this.onBatchDeleteBtn()}/> : null}*/}

            <CommonButton icon="refresh" label="同步" onClick={() => this.onSyTable()}
                          disabled={!this.state.selectedRowKeys || (this.state.selectedRowKeys.length === 0)}/>
          </Row>
          <CommonTable
            rowKey={(r, i) => r.tableName}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            onChange={this.onTablePaginationChange}
            pagination={{
              total: pagination.total,
              current: pagination.current,
              pageSize: pagination.pageSize
            }}
            noSorterAll={true}
          />
        </div>
        <Modal
          visible={modalVisible}
          title="文件上传"
          width={800}
          destroyOnClose={true}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          onOk={() => {
            this.setModalVisible(false)
          }}
        >
          <div className="clearfix">
            <Upload
              {...uploadProps}
              fileList={fileList}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </div>
        </Modal>
      </RatelPage>
    )
  }
}

export default StoragePage


