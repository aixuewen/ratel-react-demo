import React from 'react';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Switch,
  TreeSelect
} from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { addApi, deleteApi, downloadApi, listApi, treeListApi, updateApi,signpersion,changesignList } from "../../../services/system/dept"
import CollectionCreateFormqs from './CollectionCreateFormqs'
import { ParamUtils, RateUtils, axios } from '@utils'
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

const { confirm } = Modal;

class Sign extends React.Component {

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
      recordList: [],
      InputValue: ''
    }
  }

  componentDidMount() {
    //this.getData();
  }

  changeRecordList = (value) => {
    console.log('bbbb'+value)
    axios.get('/api/buser/find', { params: {name: value} }).then((res) => {
      if (res) {
        console.log(res)
        this.setState({
          recordList : res.data.content
        })
      }
    })
    // changesignList(Object.assign(this.state.currentRow, {'name': value})).then((res) => {
    //   if (res) {
    //     this.setModalVisible(false)
    //     this.getData()
    //   }
    // })
  }

  setModalVisible(modalVisible) {
    if (modalVisible) {
      treeListApi({}, (res) => {
        this.setState({
          treeDataSource: [{
            title: '顶级机构',
            value: '0',
            children: res
          }],
        })
      })
    }
    this.setState({ modalVisible })
  }

  onSaveMenu = (values) => {
    console.log(values);
    let id = '1';
    let param = {id:id,user:values};
    if (this.state.currentRow.id) {
      signpersion(param).then((res) => {
        this.setModalVisible(false)
        this.getData()
      })
    } else {
      signpersion(param).then((res) => {
        this.setModalVisible(false)
        this.getData()
      })
    }
    
  }

  // searchpersion(nickName) {
  //   console.log('aaa'+nickName)
  //   axios.get('/report/api/buser/find', { 'nickName': nickName }).then((res) => {

  //     if (res) {
  //       console.log(res)
  //     }
  //   })
  // }

  onAddBtn() {
    this.setState({ currentRow: { enabled: true, pid: '0' } })
    this.setModalVisible(true)
    this.setState({ modalEditable: true })
    axios.get('/api/buser/find').then((res) => {
      if (res) {
        this.setState({
          recordList: res.data.content
        });
      }
    })

  }


  render() {
    const { dataSource, treeDataSource, currentRow } = this.state
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name'
      }, {
        title: '排序',
        dataIndex: 'sort'
      }, {
        title: '状态',
        dataIndex: 'enabled',
        render: (text, record) => {
          return <Switch checkedChildren="启用" unCheckedChildren="停用" checked={text} key={'switch' + record.id} />
        }
      }, {
        title: '创建日期',
        dataIndex: 'createTime'
      }, {
        title: '操作',
        key: 'action'
      }]

    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Row style={{ paddingBottom: 15 }}>
            <Button type="primary" icon={<PlusOutlined />} danger className="margin-right-10"
              onClick={() => this.onAddBtn()}> 新增 </Button>
          </Row>
          <CommonTable
            rowKey={(r, i) => r.id}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            noSorterAll={true}
          />
        </div>
        <CollectionCreateFormqs
          visible={this.state.modalVisible}
          editable={this.state.modalEditable}
          onCancel={() => {
            this.setModalVisible(false)
          }}
          submitMap={this.onSaveMenu}
          currentDetailData={currentRow}
          recordList={this.state.recordList}
          searchpersion={this.searchpersion}
          changeRecordList={this.changeRecordList}
        />
      </RatelPage>
    )
  }
}

export default Sign

// const CollectionCreateForm = ({ visible, editable, treeDataSource, submitMap, onCancel, currentDetailData, recordList, searchpersion, InputValue }) => {
//   const [form] = Form.useForm();
//   const layout = {
//     labelCol: { span: 5 },
//     wrapperCol: { span: 18 },
//   };
//   form.resetFields();
//   form.setFieldsValue(currentDetailData)

//   // const getNickName = function(){
//   //   let value = form.getFieldsValue()
//   //   console.log(value)
//   //   searchpersion(value.nickName)
//   // }

//   const handleGetInputValue = function () {
//     let value = InputValue
//     console.log(value)
//     searchpersion(value)
//   }

//   return (
//     <Modal
//       visible={visible}
//       title="事件签收"
//       onCancel={onCancel}
//       width={800}
//       destroyOnClose={true}
//       onOk={() => {
//         form.validateFields().then(values => {
//           submitMap(values);
//         }).catch(info => {
//           console.log('校验失败:', info);
//         });
//       }}
//     >

//       <div label="选择整改人" name="name">
//         <Input className="aa" placeholder="请输入整改名称" onChange={handleGetInputValue} value={InputValue} />
//       </div>
//       <Form form={form} {...layout} name="serverDetail" initialValues={currentDetailData}>
//         <Button type="primary" danger className="margin-right-10"
//           onClick={handleGetInputValue}> 查询 </Button>
//         <Radio.Group buttonStyle="solid" disabled={!editable}>
//           {recordList.map((item, index) => {
//             return (
//               <Radio value={item.id}>{item.nickName}  有{item.num}件整改事件</Radio>
//             )
//           })}
//         </Radio.Group>
//       </Form>
//     </Modal>
//   );
// }

