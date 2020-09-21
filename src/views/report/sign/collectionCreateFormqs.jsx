import React, {useState} from 'react';
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
import CommonTable from '../../../components/table/CommonTable'
import { DownloadOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { addApi, deleteApi, downloadApi, listApi, treeListApi, updateApi,signpersion } from "../../../services/system/dept"
import { ParamUtils, RateUtils, axios } from '@utils'
import './index.less'

const { confirm } = Modal;



const CollectionCreateFormqs = (props) => {
    
    let [subValue, setSubValue] = useState();

    const [form] = Form.useForm()
    const { visible, editable, submitMap, onCancel, currentDetailData, recordList, changeRecordList } = props
    form.resetFields()

    const onSaveMenu = () => {
        form.current
            .validateFields()
            .then(values => {
                console.log(values)
            })
            .catch(info => {
                console.log('校验失败:', info);
            });


    }
    const handleGetInputValue = (e) => {
        console.log(e.target.value)
        setSubValue(e.target.value)

    }

    const onSearch = () => {
        console.log('查询'+subValue)
        changeRecordList(subValue)
    }


    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    }

    return (
        
        <Modal
            visible={visible}
            maskClosable={false}
            title="事件签收"
            onCancel={onCancel}
            width={600}
            destroyOnClose={true}
                 onOk={() => {
        form.validateFields().then(values => {
          submitMap(values);
        }).catch(info => {
          console.log('校验失败:', info);
        });
      }}
        >
            
            
                
            <span>选择整改人:</span>
            <div name="name">
                <Input className="aa" placeholder="请输入整改人名称" onChange={(e) => { handleGetInputValue(e) }} style={{width: '70%'}}/>
                <Button type="primary" className="margin-right-10"
                    onClick={onSearch}> 搜索 </Button>
            </div>
            <Form form={form}  {...layout} name="serverDetail" initialValues={currentDetailData}>
            <Form.Item name="id"  rules={[{required: true, message: '请选择签收人'}]}>
                <Radio.Group buttonStyle="solid" disabled={!editable} style={{width: '50%'}}>
                    {recordList && recordList.map((item, index) => {
                        return (
                            <Radio value={item.id} className="sWin">{item.nickName}  有{item.num}件整改事件</Radio>
                        )
                    })}
                </Radio.Group>
                </Form.Item>
                
            </Form>
            
        </Modal>
    )


}

export default CollectionCreateFormqs
