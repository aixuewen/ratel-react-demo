import React from 'react';
import {Avatar, DatePicker, Form, Input, Modal, Row, Upload} from 'antd'
import {deleteApi, listApi} from "../../../services/tools/storage"
import {ParamUtils, Storage} from '@utils'
import {AddButton, CommonTable, DeleteButton, ExportButton, RatelPage, SearchButton} from "@/components";
import {FileOutlined, PlusOutlined} from '@ant-design/icons';
import config from '@config'


const {RangePicker} = DatePicker;


class StoragePage extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
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
    params.blurry = values.blurry;
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    return params
  }

  // 查询数据
  getData = () => {
    listApi(this.getSearchParams(), (res) => {
      this.setState({
        dataSource: res.content,
        pagination: Object.assign(this.state.pagination, {
          total: res.totalElements || 0
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

  onBatchDeleteBtn() {
    deleteApi(this.state.selectedRowKeys, (res) => {
      this.getData()
      this.setState({selectedRowKeys: []})
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys: selectedRowKeys});
  };

  render() {
    const {dataSource, pagination, modalVisible, fileList} = this.state
    const columns = [
      {
        title: '文件名',
        dataIndex: 'name'
      }, {
        title: '预览图',
        dataIndex: 'attrPath',
        render: (text, record, index) => {
          if (record.type === "images") {
            return (<Avatar src={config.API_BASE_URL + "/" + record.attrPath}/>)
          } else {
            return (<Avatar icon={<FileOutlined/>}/>)
          }
        }
      }, {
        title: '文件类型',
        dataIndex: 'suffix'
      }, {
        title: '类别',
        dataIndex: 'type',
        render: (text, record, index) => {
          if (text === 'images') {
            return "图片"
          } else if (text === 'documents') {
            return '文档'
          } else if (text === 'musics') {
            return '音频'
          } else if (text === 'videos') {
            return '视频'
          } else {
            return '其他'
          }
        }
      }, {
        title: '大小',
        dataIndex: 'size'
      }, {
        title: '操作人',
        dataIndex: 'createUserName'
      }, {
        title: '创建日期',
        dataIndex: 'createTime'
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
      onChange: this.onSelectChange
    };

    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Form ref={this.searchForm} name="searchForm" layout="inline" style={{paddingBottom: 15}} {...formItemLayout}>
            <Form.Item name="blurry">
              <Input placeholder="输入内容搜索"/>
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
            <DeleteButton onClick={() => this.onBatchDeleteBtn()}/>
            <ExportButton onClick={() => this.onExportBtn()}/>
          </Row>

          <CommonTable
            rowKey={(r, i) => r.id}
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


