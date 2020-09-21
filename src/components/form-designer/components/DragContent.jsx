import React, {Component} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Checkbox, DatePicker, Divider, Input, message, Radio, Select, Upload } from 'antd';
import './DragContent.less'
import {connect} from 'react-redux'
import moment from 'moment';
import PropTypes from 'prop-types'
import TableElement from "./DragContentTable";
import axios from '@config'

import {getCheckboxListDataDict} from '@services/form-designer/FormDesigner'
import DragContentTag from "./DragContentTag";

const FormItem = Form.Item
const {TextArea} = Input;
const {Option} = Select;
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;

function mapStateToProps(state) {
  return {
    selectElementKey: state.selectElementKey,
    formData: state.formData,
    dragRow: state.dragRow
  }
}

/**
 * 拖拽区域组件，可做容器，本身也可以拖动
 */
class DragContent extends Component {

  static propTypes = {
    form: PropTypes.any
  }

  constructor() {
    super();
    this.state = {}
  }

  //  在第一次渲染后调用
  componentWillReceiveProps(nextProps) {
    let formDesignerFlag = !!window.formDesignerFlag
    if (formDesignerFlag) {
      this.getServerData()
    }
  };

  componentWillMount() {
    let formDesignerFlag = !window.formDesignerFlag
    if (formDesignerFlag) {
      this.getServerData()
    }
  }

  getServerData() {
    let elementData = this.props.elementData
    if (elementData) {
      let serverOptionsKey = elementData.key + "serverOptions"
      if (elementData.serverOptions) {
        getCheckboxListDataDict({dataId: elementData.serverOptions}).then((res) => {
          let clp = {}
          clp[serverOptionsKey] = res.data.data
          this.setState(clp)
        })
      }
    }
  }


  componentDidMount() {
  }

  // 拖动组件的点击事件
  dragClick = (key, e) => {
    if (key === undefined) return
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.dispatch({type: 'ELEMENT_ATTRIBUTE'});
    this.props.dispatch({type: 'SELECT_ELEMENT', value: key + '-' + this.props.elementId});
  };

  render() {
    const {getFieldDecorator, setFieldsValue} = this.props.form
    let elementData = this.props.elementData
    let selectElementKey = this.props.selectElementKey
    let selctor = selectElementKey//.split('-')
    let elementDataKey = null
    if (selctor && selctor !== 0) {
      selctor = selectElementKey.split('-')
      elementDataKey = selctor[0]
      let selectElement = 0;
      this.props.dragRow.map(item => {
        if (item.key === selctor[1]) {
          item.col.map(element => {
            if (element.key === selctor[2]) {
              selectElement = element
            }
          })
        }
      })
    }
    if (elementData === null) {
      return <div className="dragContent"/>
    }
    const formItemLayout = {
      required: elementData.required,
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      }
    };
    const formItemLayoutTalbe = {
      required: elementData.required,
      labelCol: {
        xs: {span: 0},
        sm: {span: 0},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };
    let getOptions = (elementData) => {
      let dataOptions = elementData.options ? elementData.options.split(",").map((item, index) => {
        const values = item.split(':')
        if (values.length === 1) {
          return {label: values[0], value: values[0]}
        } else {
          return {label: values[1], value: values[0]}
        }
      }) : []
      return dataOptions
    }
    let layout = (elementData) => {
      let option = {
        rules: [
          {
            required: elementData.required,
            message: '请输入' + elementData.label,
          }
        ]
      }
      if (elementData.defaultValueDate) {
        option.initialValue = elementData.defaultValueDate ? moment(elementData.defaultValueDate) : null
      } else {
        option.initialValue = elementData.defaultValue || null
      }

      let serverOptionsKey = elementData.key + "serverOptions"
      let elementDataId = elementData.label ? elementData.key + "_" + elementData.label.trim() : elementData.key
      //console.log("elementDataId"+elementDataId);
      switch (elementData.type) {
        case "divider":
          return (<Divider/>)
        case "label":
          let options = elementData.options ? elementData.options.split(",").map((item, index) => {
            const values = item.split(':')
            if (values.length === 1) {
              return item
            } else {
              return values[2]
            }
          }) : []
          option.initialValue = options
          // option.initialValue = elementData.defaultValue ? elementData.defaultValue.split(",") : []
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <DragContentTag setFieldsValue={setFieldsValue} disabled={this.props.disabled}
                              closable={elementData.tagClosable}/>)}</FormItem>)
        case "input":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Input size={elementData.size} placeholder={elementData.placeholder} disabled={this.props.disabled}
                     readOnly={this.props.readonly}/>
            )}
          </FormItem>)
        case "textArea":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <TextArea rows={elementData.rowSize ? elementData.rowSize : 2} placeholder={elementData.placeholder}
                        disabled={this.props.disabled} readOnly={this.props.readonly}/>
            )}
          </FormItem>)
        case "monthPicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <MonthPicker size={elementData.size} style={{width: '100%'}} format='YYYY-MM'
                           placeholder={elementData.placeholder} disabled={this.props.disabled}
                           readOnly={this.props.readonly}/>)}</FormItem>)
        case "weekPicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <WeekPicker size={elementData.size} style={{width: '100%'}}
                          placeholder={elementData.placeholder} disabled={this.props.disabled}
                          readOnly={this.props.readonly}/>)}</FormItem>)
        case "datePicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <DatePicker size={elementData.size} style={{width: '100%'}}
                          placeholder={elementData.placeholder} disabled={this.props.disabled}
                          readOnly={this.props.readonly}/>)}</FormItem>)
        case "timePicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <DatePicker size={elementData.size} style={{width: '100%'}} showTime
                          placeholder={elementData.placeholder} disabled={this.props.disabled}
                          readOnly={this.props.readonly}/>)}</FormItem>)
        case "dateRangePicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <RangePicker size={elementData.size} style={{width: '100%'}}
                           placeholder={elementData.placeholder} disabled={this.props.disabled}
                           readOnly={this.props.readonly}/>)}</FormItem>)
        case "timeRangePicker":
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <RangePicker size={elementData.size} style={{width: '100%'}} showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }} format="YYYY-MM-DD HH:mm:ss" placeholder={elementData.placeholder}
                           disabled={this.props.disabled}
                           readOnly={this.props.readonly}/>)}</FormItem>)
        case "select":
          let selectOptions = elementData.options ? elementData.options.split(",").map((item, index) => {
            const values = item.split(':')
            if (values.length === 1) {
              return <Option value={values[0]}>{values[0]}</Option>
            } else {
              return <Option value={values[0]}>{values[1]}</Option>
            }
          }) : null
          let selectServerOptions = this.state[serverOptionsKey] ? this.state[serverOptionsKey].map((item, index) => {
            return <Option value={item.value}>{item.label}</Option>
          }) : null
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Select size={elementData.size} placeholder={elementData.placeholder} disabled={this.props.disabled}
                      readOnly={this.props.readonly}>
                {selectOptions !== null ? selectOptions : selectServerOptions}
              </Select>)}</FormItem>)
        case "multipleSelect":
          let multipleSelectOptions = elementData.options ? elementData.options.split(",").map((item, index) => {
            const values = item.split(':')
            if (values.length === 1) {
              return <Option value={values[0]}>{values[0]}</Option>
            } else {
              return <Option value={values[0]}>{values[1]}</Option>
            }
          }) : null
          let multipleSelectServerOptions = this.state[serverOptionsKey] ? this.state[serverOptionsKey].map((item, index) => {
            return <Option value={item.value}>{item.label}</Option>
          }) : null
          option.initialValue = elementData.defaultValue ? elementData.defaultValue.split(",") : []
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Select size={elementData.size} mode="multiple" placeholder={elementData.placeholder}
                      disabled={this.props.disabled}
                      readOnly={this.props.readonly}>
                {multipleSelectOptions !== null ? multipleSelectOptions : multipleSelectServerOptions}
              </Select>)}</FormItem>)
        case "radio":
          // let dataOptions = elementData.options ? elementData.options.split(";") : this.state[serverOptionsKey];
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Radio.Group size={elementData.size} options={getOptions(elementData)}
                           disabled={this.props.disabled}
                           readOnly={this.props.readonly}/>)}</FormItem>)
        case "checkbox":
          // let plainOptions = elementData.options ? elementData.options.split(";") : this.state[serverOptionsKey];
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Checkbox.Group size={elementData.size} options={getOptions(elementData)}
                              disabled={this.props.disabled}
                              readOnly={this.props.readonly}/>)}</FormItem>);
        case "radioList":
          // let radioListOptions = elementData.options ? elementData.options.split(";") : this.state[serverOptionsKey];
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Radio.Group size={elementData.size} className="radioList" options={getOptions(elementData)}
                           disabled={this.props.disabled}
                           readOnly={this.props.readonly}/>)}</FormItem>)
        case "checkboxList":
          // let checkboxListPlainOptions = elementData.options ? elementData.options.split(";") : this.state[serverOptionsKey];
          return (<FormItem key={elementDataId} {...formItemLayout} {...elementData}>
            {getFieldDecorator(elementDataId, option)(
              <Checkbox.Group size={elementData.size}
                              options={getOptions(elementData)}
                              className="checkboxList"
                              disabled={this.props.disabled}
                              readOnly={this.props.readonly}/>)}</FormItem>)
        case "editTable":
          let tableColumns = elementData.tableColumns ? elementData.tableColumns : []
          let columns = []
          tableColumns.forEach(function (item) {
            columns.push({
              title: item.colName,
              dataIndex: item.colName,
              required: item.colDataRequired,
              dataType: item.colDataType,
              editable: true,
            })
          })
          option.initialValue = []
          return (<FormItem id={elementData.key} {...formItemLayoutTalbe} {...elementData} className="drag-content">
            {getFieldDecorator(elementDataId, option)(
              <TableElement columns={columns} setFieldsValue={setFieldsValue}
                            disabled={this.props.disabled}
                            readOnly={this.props.readonly}/>)}</FormItem>)
        case "file":
          const fileProps = {
            action: axios.API_BASE_URL + '/api/localStorage',
            headers: {
              authorization: 'authorization-text'
            },
            data: {name: 'file'},
            name: 'file',
            onPreview: file => {
              window.open(axios.API_BASE_URL + `/${file.response.attPath}`)
            },
            beforeUpload: (file, fileList) => {
              if (elementData.filetype) {
                let spl = file.name.split(".");
                if (elementData.filetype.indexOf(spl[spl.length - 1]) === -1) {
                  file.errStatus = true
                  message.error('请选择正确的文件(' + elementData.filetype + ')!');
                  return false
                }
              }
              if (!elementData.filesize) {
                elementData.filesize = 100
              }
              if (file.size / 1024 / 1024 > elementData.filesize) {
                file.errStatus = true
                message.error('文件必须小于 ' + elementData.filesize + 'MB!');
                return false
              }
              return true
            },
            onChange: (info) => {
              console.log(info)
              let fileList = [...info.fileList];
              console.log(info)
              fileList = fileList.filter(file => {
                if (!file.errStatus) {
                  return file
                }
              })
              fileList = fileList.map(file => {
                if (file.response) {
                  file.url = file.response.url;
                }
                return file;
              });
              info.fileList = fileList
            }
          }
          return (
            <FormItem id={elementData.key} {...formItemLayout} {...elementData}>
              {getFieldDecorator(elementData.key, {
                rules: elementData.required ? [{
                  validator: (rule, value, callback) => {
                    if (value && value.length > 0) {
                      callback()
                    } else {
                      callback(new Error('附件不能为空！'))
                    }
                  }
                }] : [],

                valuePropName: 'fileList',
                getValueFromEvent: e => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                },
              })(
                <Upload.Dragger {...fileProps} disabled={this.props.disabled} readOnly={this.props.readonly}
                                className={window.formDesignerFlag ? null : this.props.disabled ? 'upload-dragger' : null}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击此处或拖入文件上传</p>
                </Upload.Dragger>,
              )}
            </FormItem>
          );
        case "imageFile":
          const imageFileProps = {
            action: axios.API_BASE_URL + '/api/localStorage',
            headers: {
              authorization: 'authorization-text'
            },
            data: {name: 'file'},
            name: 'file',
            onPreview: file => {
              if (this.props.disabled) {
                window.open(axios.API_BASE_URL + `/${file.response.attPath}`)
              }
            },
            beforeUpload: (file, fileList) => {
              if (elementData.filetype) {
                let spl = file.name.split(".");
                if (elementData.filetype.indexOf(spl[spl.length - 1]) === -1) {
                  file.errStatus = true
                  message.error('请选择正确的文件(' + elementData.filetype + ')!');
                  return false
                }
              }
              if (!elementData.filesize) {
                elementData.filesize = 100
              }
              if (file.size / 1024 / 1024 > elementData.filesize) {
                file.errStatus = true
                message.error('文件必须小于 ' + elementData.filesize + 'MB!');
                return false
              }
              return true
            },
            onChange: (info) => {
              console.log(info)
              let fileList = [...info.fileList];
              console.log(info)
              fileList = fileList.filter(file => {
                if (!file.errStatus) {
                  return file
                }
              })
              fileList = fileList.map(file => {
                if (file.response) {
                  file.url = file.response.url;
                }
                return file;
              });
              info.fileList = fileList
            }
          }
          return (
            <FormItem id={elementData.key} {...formItemLayout} {...elementData}>
              {getFieldDecorator(elementData.key, {
                rules: elementData.required ? [{
                  validator: (rule, value, callback) => {
                    if (value && value.length > 0) {
                      callback()
                    } else {
                      callback(new Error('附件不能为空！'))
                    }
                  }
                }] : [],

                valuePropName: 'fileList',
                getValueFromEvent: e => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                },
              })(
                <Upload {...imageFileProps}
                        listType="picture-card"
                        disabled={this.props.disabled}
                        readOnly={this.props.readonly}
                        className={window.formDesignerFlag ? null : this.props.disabled ? 'upload-dragger' : null}>
                  {window.formDesignerFlag || !this.props.disabled
                    ? <div><p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p><p className="ant-upload-text">点击上传</p></div> : null}
                </Upload>
              )}
            </FormItem>
          );
        default:
          return null
      }
    }
    return (
      <div id={elementData.key} onClick={this.dragClick.bind(this, elementData.key)}
           className={elementDataKey === elementData.key ? 'drag-active' : 'dragContent'}>
        {layout(elementData)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(DragContent);
