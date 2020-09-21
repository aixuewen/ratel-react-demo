import React, {useState} from 'react';
import {Checkbox, Col, DatePicker, Form, Input, message, Modal, Row, Tag, Tree} from 'antd'
import * as scriptsortApi from "../../../services/demo/scriptsort"
import * as scriptApi from "../../../services/demo/script"
import * as basescript from "../../../services/demo/basescript"
import * as depApi from "../../../services/demo/scriptgoup"
import {sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import moment from "moment";
import {ParamUtils, RateUtils} from '@utils'
import {MenuOutlined} from '@ant-design/icons';

import {AddButton, CommonButton, HrefDelButton, RatelPage, SearchButton, SortableTable} from "@/components";

const {Search} = Input;
const {RangePicker} = DatePicker;

const SortableItem = sortableElement(props => <tr {...props} />);

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
      treeDataSource: [],
      columns: [],
      dataSource: [],
      basescript: []
    }
  }

  getSearchParams() {
    let params = {}
    let values = this.searchForm.current.getFieldsValue();
    params.blurry = values.blurry
    params.createTime = ParamUtils.tranSearchTime(values.createTime)
    if (this.state.currentDeptId) {
      params.toolScriptGroupId = this.state.currentDeptId
    }
    return params
  }

  getData = () => {
    if (this.state.currentDeptId) {
      scriptsortApi.userList(this.getSearchParams()).then((res) => {
        if (res.data.success) {
          this.setState({
            dataSource: res.data.content || [],
          })
        } else {
          message.error(res.data.message);
        }
      })
    }
  }

  getDeptData = (value) => {
    depApi.treeListApi({name: value}, (res) => {
      this.setState({detpTreeData: res})
    })
  }

  componentDidMount() {
    this.getDeptData()
    this.getData()
    basescript.userList({}).then((res) => {
      if (res.data.success) {
        this.setState({
          basescript: res.data.content.content,
        })
      } else {
        message.error(res.data.message);
      }
    })
    scriptApi.allList({}, (data) => {
      this.setState({treeDataSource: data})
    })
  }

  setModalVisible(modalVisible) {
    this.setState({modalVisible})
  }

  onSubmit = (values) => {
    console.log(values)
    if (values && values.length > 0) {
      let datas = []
      for (let i = 0; i < values.length; i++) {
        datas.push({
          toolScriptGroup: {id: this.state.currentDeptId},
          toolScript: {id: values[i]},
          sort: this.state.dataSource.length + i
        })
      }
      scriptsortApi.addUser(datas).then((res) => {
        if (res.data.success) {
          this.getData()
        } else {
          message.error(res.data.message);
        }
        this.setModalVisible(false)
      })
    } else {
      this.setModalVisible(false)
    }
  }

  onAddBtn() {
    this.setState({
      currentRow: {username: null, enabled: true, toolScriptGroups: null, content: null, toolBaseScriptsModel: []},
      modalEditable: true
    })
    this.setModalVisible(true)
  }

  onSaveBtn() {
    if (this.state.dataSource.length > 0) {
      this.state.dataSource.forEach(function (item, index) {
        console.log(item.sort + ":" + item.toolScript.username)
      })
      scriptsortApi.updateUser(this.state.dataSource).then((res) => {
        if (res.data.success) {
          message.info("保存成功");
        } else {
          message.error(res.data.message);
        }
        this.setModalVisible(false)
      })
    } else {
      scriptsortApi.deleteApi({gid: this.state.currentDeptId}).then((res) => {
        if (res.data.success) {
          message.info("保存成功");
        } else {
          message.error(res.data.message);
        }
        this.setModalVisible(false)
      })
    }
  }

  onViewClick(record) {
    record.toolScriptGroups = record.toolScriptGroup.id
    this.setState({currentRow: record, modalEditable: false})
    this.setModalVisible(true)
  }

  onEditMenu(record) {
    let toolBaseScriptsModel = []
    for (var model in record.toolBaseScripts) {
      toolBaseScriptsModel.push(record.toolBaseScripts[model].id)
    }
    record.toolScriptGroups = record.toolScriptGroup.id
    record.toolBaseScriptsModel = toolBaseScriptsModel
    this.setState({currentRow: record})
    this.setModalVisible(true)
    this.setState({modalEditable: true})
  }

  onDeleteBtn(index) {
    let dataSource = JSON.parse(JSON.stringify(this.state.dataSource));
    dataSource.splice(index, 1);
    if (dataSource.length > 0) {
      dataSource.forEach(function (item, index) {
        item.sort = index;
      })
    }

    this.setState({
      dataSource: dataSource || [],
    })
  }

  onBatchDeleteBtn() {
    scriptsortApi.deleteUser(this.state.selectedRowKeys, (res) => {
      this.getData()
      this.setState({selectedRowKeys: []})
    })
  }

  //查询
  onHandleSearch = () => {
    this.getData()
  }

  onExportBtn() {
    scriptsortApi.usersDownload(this.getSearchParams()).then(result => {
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
        currentDeptId: selectedKeys[0]
      }, () => {
        this.getData()
      })
    } else {
      this.setState({
        currentDeptId: null,
        dataSource: []
      })
    }
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    const {dataSource} = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      if (newData.length > 0) {
        newData.forEach(function (item, index) {
          item.sort = index;
        })
      }
      this.setState({dataSource: newData});
    }
  };
  draggableBodyRow = ({className, style, ...restProps}) => {
    const {dataSource} = this.state;
    const index = dataSource.findIndex(x => x.sort === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };


  render() {
    const {dataSource, treeDataSource, currentRow, roleListData, detpTreeData} = this.state
    const DragHandle = sortableHandle(() => (
      <MenuOutlined style={{cursor: 'pointer', color: '#999'}}/>
    ));
    const columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
        className: 'drag-visible',
        render: () => <DragHandle/>,
      },
      {
        title: '脚本名称',
        dataIndex: 'username',
        className: 'drag-visible',
        render: (text, r) => <a href='javascript:;'>{r.toolScript.username}</a>
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
        title: '脚本组',
        dataIndex: 'deptId',
        render: (text, record, index) => {
          if (record.toolScriptGroup) {
            return record.toolScriptGroup.name
          } else {
            return ""
          }
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
        render: (text, record) => (<span>
            <HrefDelButton confirmMsg={"确认删除后请保存数据！"} onConfirm={() => this.onDeleteBtn(record.sort)}/>
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
          <Row>
            <Col span={5} style={{paddingRight: '25px'}}>
              <Search style={{marginBottom: 10}} placeholder="输入脚本组名称搜索"
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
                  <SearchButton onClick={this.onHandleSearch}/>
                </Form.Item>
              </Form>

              <Row style={{paddingBottom: 15}}>
                {this.state.currentDeptId ? <AddButton onClick={() => this.onAddBtn()}/> : null}
                {this.state.currentDeptId
                  ? <CommonButton onClick={() => this.onSaveBtn()} icon="save" label="保存"/> : null}
              </Row>
              <SortableTable
                key="SortableTable"
                rowKey="sort"
                onSortEnd={this.onSortEnd}
                draggableBodyRow={this.draggableBodyRow}
                columns={columns}
                dataSource={dataSource}
              />
            </Col>
          </Row>
        </div>
        <CollectionCreateForm
          visible={this.state.modalVisible}
          treeData={treeDataSource}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          onSubmit={this.onSubmit}
        />
      </RatelPage>
    )
  }
}


const CollectionCreateForm = ({visible, treeData, onCancel, onSubmit}) => {
  const [checkedKeys, setCheckedKeys] = useState([]);

  function onChange(checkedValues) {
    setCheckedKeys(checkedValues);
  }

  const loop = data => data.map((item) => {
    return <Col span={6}>
      <Checkbox value={item.id}>{item.username}</Checkbox>
    </Col>;
  });

  return (
    <Modal
      visible={visible}
      title="脚本管理"
      onCancel={() => {
        onCancel()
        setCheckedKeys([])
      }}
      width={'80%'}
      destroyOnClose={true}
      onOk={() => {
        onSubmit(checkedKeys)
        setCheckedKeys([])
      }}
    >
      <Checkbox.Group style={{width: '100%'}} onChange={onChange}>
        <Row>
          {loop(treeData)}
        </Row>
      </Checkbox.Group>
    </Modal>
  );
}


export default Script;
