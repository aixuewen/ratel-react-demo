import React from 'react'
import {
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    TreeSelect,
    Select,
    Upload,
    Layout,
    Menu,
    Breadcrumb,
    DatePicker, 
    Button
  } from 'antd'
import Photo from '../../../components/Photo'

import * as service from "../../../services/report"
const { Header, Content, Footer } = Layout;
const { Option } = Select;
const TextArea = Input.TextArea;
const {SHOW_PARENT} = TreeSelect;
const {RangePicker} = DatePicker;
const {Search} = Input;

class Supervision extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
        visible: this.props.visible, 
        editable: this.props.editable, 
        submitMap: this.props.submitMap, 
        currentDictRow: this.props.currentDictRow, 
        fileList: this.props.fileList, 
        supervisionId: this.props.supervisionId
    }
  }
  getImageList = () => {

  }
  onCancel = () => {
      
  }



  render() {
   
    const { visible, editable, submitMap, currentDictRow, fileList, supervisionId } = this.state;
    const [form] = Form.useForm();
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    form.setFieldsValue(currentDictRow);
    return (
        <Modal
        visible={visible}
        title="事件反馈"
        onCancel={this.onCancel}
        width={800}
        destroyOnClose={true}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              values.operateType = '3';
              values.eventId = supervisionId;
              if (fileList !== undefined) {
                let list = [];
                fileList.map((item, index) => {
                  if (item.status === 'done') {
                    list.push({ "id": item.response.id });
                  }
                });
                if (list !== undefined && list.length > 0) {
                  values.storageList = list;
                  service.feedback(values, (res) => {
                    console.log("回调函数")
                    console.log(res)
                    this.getData();
                  })
                } else {
                  message.error("至少正确上传一张图片");
                }
  
              }
              // submitMap(values);
              console.log(values);
            })
            .catch(info => {
              console.log('校验失败:', info);
            });
        }}
      >
        {/* <div>确定改事件需要重新整改？操作后该事件将直接分派到原部门。</div> */}
        <Form
          form={form}
          {...layout}
          // name="serverDetail"
          initialValues={currentDictRow}
        >
          <Form.Item
            name="storageList"
            label="图片"
            rules={[
              { required: false, message: '请上传相关图片' }]}
          >
          <Photo getImageList={this.getImageList} />
          </Form.Item>
          <Form.Item label="处理意见" name="description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
  
        </Form>
      </Modal>)
  }
}

export default Supervision


 
