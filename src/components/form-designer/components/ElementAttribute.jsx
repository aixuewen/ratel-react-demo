import React, {Component} from 'react';
import './ElementAttribute.less'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Col,
  Collapse,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Tabs,
} from 'antd';
import {connect} from 'react-redux'
import SketchPicker from 'react-color'
import reactCSS from 'reactcss'

import FormType from '@/assets/json/formType.json';
import ElementAttributeTable from "./ElementAttributeTable";

import {getParamDescListAll, getParamValueListAll} from '@services/form-designer/FormDesigner'

const {TabPane} = Tabs;
const Panel = Collapse.Panel;
const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const {TextArea} = Input;

function mapStateToProps(state) {
  let selctor = state.selectElementKey.split('-')
  let selectElement = 0;
  state.dragRow.map(item => {
    if (item.key === selctor[1]) {
      item.col.map(element => {
        if (element.key === selctor[2]) {
          selectElement = element
        }
      })
    }
  })
  const selectRow = state.dragRow.filter(item => {
    return item.key === selctor[0]
  })
  return {
    element: state.element,
    dragRow: state.dragRow,
    selectElementKey: state.selectElementKey,
    selectElement: selectElement.attr,
    selectRow: selectRow[0]
  }
}

class ElementAttribute extends Component {
  state = {
    formType: FormType,
    displayColorPicker: false,
    rowCol: 1,
    labelCol: {span: 6},
    wrapperCol: {span: 18},
    dataDict: [],
    color: {
      r: '0',
      g: '0',
      b: '0',
      a: '0.65',
    },
  };

  componentDidMount() {
    this.getDataDict();
  }

  componentWillReceiveProps(nextProps) {
    if ("selectRow" in nextProps && nextProps.selectRow && nextProps.selectRow.col) {
      this.setState({rowCol: nextProps.selectRow.col.length})
    }
  }

  getDataDict() {
    /*getParamDescListAll({}).then((res) => {
      if (res.data.success) {
        this.setState({dataDict: res.data.data})
      } else {
        console.log('系统参数获取失败')
      }
    })*/
  }

  handleClick = () => {
    this.setState({displayColorPicker: !this.state.displayColorPicker})
  };
  handleClose = () => {
    this.setState({displayColorPicker: false})
  };
  onRowColChange = (e) => {
    let value = e.target.value
    let attr = 'col'
    let key = this.props.selectElementKey.split('-')[0]
    this.setState({
      rowCol: value
    })
    let arr = this.props.selectRow.col.slice()
    let nlength = this.props.selectRow.col.length
    if (value === nlength) return
    if (value > nlength) {
      for (let i = nlength; i < value; i++) {
        arr.push({
          key: 'dragRow' + (new Date()).valueOf() + Math.ceil(Math.random() * 10000),
          attr: null
        })
      }
    } else {
      arr.splice(value, nlength - value)
    }
    this.props.dispatch({type: 'UPDATE_DRAGROW', attr, value: arr, key})
  }
  handleChange = (color) => {
    this.setState({color: color.rgb})
    let key = this.props.selectElementKey
    let value = color.hex
    let attr = 'style-color'
    this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
  };

  /**
   * 将表单数据保存至redux，保留状态
   * @param  {string} type  数据类型 orderSum||name||phoneNo
   * @param  {object} event 事件对象
   */
  handleInput = (attr, event) => {
    let key = this.props.selectElementKey
    let value = event
    if (attr.indexOf('style') === '-1' && attr !== 'required') {
      value = event.target.value
    }
    this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
  }

  handleServerData = (attr, event) => {
    getParamValueListAll({parId: event}).then((res) => {
      if (res.data.success) {
        if (res.data.data) {
          let value = ''
          for (let i = 0; i < res.data.data.length; i++) {
            if (i === res.data.data.length - 1) {
              // value = value + res.data.data[i].valueCode + ":" + res.data.data[i].parName
              value = value + res.data.data[i].parName
            } else {
              //value = value + res.data.data[i].valueCode + ":" + res.data.data[i].parName + ","
              value = value + res.data.data[i].parName + ","
            }
          }
          let key = this.props.selectElementKey
          this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
        }
      } else {
        console.log('系统参数获取失败')
      }
    })


  }

  handleTable = (attr, event) => {
    let key = this.props.selectElementKey
    let value = event
    this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
  }

  onDateChange(attr, date, dateString) {
    let key = this.props.selectElementKey
    let value = null
    if (date) {
      value = date.format()
    }
    this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
  }

  handleInputCommon = (attr, event) => {
    let key = this.props.selectElementKey
    let value = event.target.value
    console.log("--------------------", value)
    this.props.dispatch({type: 'UPDATE_CELL_ATTR', attr, value, key})
  }

  render() {
    const selectElement = this.props.selectElement
    const selectElementKey = this.props.selectElementKey
    const labelCol = this.state.labelCol
    const wrapperCol = this.state.wrapperCol
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    let renderCommonPlus = (item) => {
      switch (item.key) {
        case "label":
          return (<FormItem required colon={false} label="标签文本" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input onChange={this.handleInputCommon.bind(this, 'label')} value={selectElement.label}/></FormItem>)
        case "filetype":
          return (<FormItem colon={false} label="文件类型" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input onChange={this.handleInputCommon.bind(this, 'filetype')} value={selectElement.filetype} placeholder="默认所有类型，例：png,jpg"/></FormItem>)
        case "filesize":
          return (<FormItem colon={false} label="文件大小(M)" labelCol={labelCol} wrapperCol={wrapperCol}>
            <InputNumber min={1} max={1000} value={selectElement.filesize} onChange={this.handleInput.bind(this, 'filesize')} placeholder="默认100M"/></FormItem>)
          
        case "placeholder":
          return (<FormItem colon={false} label="占位内容" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input onChange={this.handleInputCommon.bind(this, 'placeholder')} value={selectElement.placeholder}/>
          </FormItem>)
        case "required":
          return (<FormItem colon={false} label="是否必填" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Switch checked={selectElement.required} onChange={this.handleInput.bind(this, 'required')}/>
          </FormItem>)
        case "defaultValue":
          return (<FormItem colon={false} label="默认值" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input onChange={this.handleInputCommon.bind(this, 'defaultValue')} value={selectElement.defaultValue}/>
          </FormItem>)
        case "defaultValueMonth":
          return (<FormItem colon={false} label="默认值" labelCol={labelCol} wrapperCol={wrapperCol}>
            <MonthPicker style={{width: '100%'}} onChange={this.onDateChange.bind(this, 'defaultValueDate')}/>
          </FormItem>)
        case "defaultValueWeek":
          return (<FormItem colon={false} label="默认值" labelCol={labelCol} wrapperCol={wrapperCol}>
            <WeekPicker style={{width: '100%'}} onChange={this.onDateChange.bind(this, 'defaultValueDate')}/>
          </FormItem>)
        case "defaultValueDate":
          return (<FormItem colon={false} label="默认值" labelCol={labelCol} wrapperCol={wrapperCol}>
            <DatePicker style={{width: '100%'}} onChange={this.onDateChange.bind(this, 'defaultValueDate')}/>
          </FormItem>)
        case "defaultValueTime":
          return (<FormItem colon={false} label="默认值" labelCol={labelCol} wrapperCol={wrapperCol}>
            <DatePicker style={{width: '100%'}} showTime onChange={this.onDateChange.bind(this, 'defaultValueDate')}/>
          </FormItem>)
        default:
          return null
      }
    }

    let renderTeshuPlus = (item) => {
      switch (item.key) {
        case "options":
          return (
            <FormItem colon={false} label="自定义选项" labelCol={labelCol} wrapperCol={wrapperCol}>
              <TextArea value={selectElement.options} placeholder="例：data:数据,option:选项,系统"
                        onChange={this.handleInputCommon.bind(this, 'options')}/>
            </FormItem>)
        case "serverData":
          return (
            <FormItem colon={false} label="快捷选项" labelCol={labelCol} wrapperCol={wrapperCol}>
              <Select placeholder="请选择快捷选项" value={selectElement.serverOptions}
                      onChange={this.handleServerData.bind(this, 'options')}>
                {this.state.dataDict.map(item => <Option key={item.parId}>{item.parName}</Option>)}
              </Select>
            </FormItem>)
        // <FormItem colon={false} label="快捷选项" labelCol={labelCol} wrapperCol={wrapperCol}>
        //   <Select placeholder="请选择快捷选项" value={selectElement.serverOptions}
        //           onChange={this.handleInput.bind(this, 'serverOptions')}>
        //     {this.state.dataDict.map(item => <Option key={item.value}>{item.name}</Option>)}
        //   </Select>
        // </FormItem>
        case "tagClosable":
          return (<FormItem colon={false} label="是否可以关闭" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Switch checked={selectElement.tagClosable} onChange={this.handleInput.bind(this, 'tagClosable')}/>
          </FormItem>)
        case "size":
          return (<FormItem colon={false} label="元素大小" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Radio.Group value={selectElement.size} onChange={this.handleInputCommon.bind(this, 'size')}>
              <Radio.Button value="large">超大</Radio.Button>
              <Radio.Button value="default">默认</Radio.Button>
              <Radio.Button value="small">超小</Radio.Button>
            </Radio.Group>
          </FormItem>)
        case "isTableFiled":
          return (<FormItem colon={false} label="是否表格的列" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Switch checked={selectElement.isTableFiled} onChange={this.handleInput.bind(this, 'isTableFiled')}/>
          </FormItem>)
        case "filedSort":
          return (<FormItem colon={false} label="表格列排序" labelCol={labelCol} wrapperCol={wrapperCol}>
            <InputNumber min={1} max={10000} defaultValue={1}
                         onChange={this.handleInput.bind(this, 'filedSort')} value={selectElement.filedSort}/>
          </FormItem>)
        case "isQuery":
          return (<FormItem colon={false} label="是否查询条件" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Switch checked={selectElement.isQuery} onChange={this.handleInput.bind(this, 'isQuery')}/>
          </FormItem>)
        case "isQuerySort":
          return (<FormItem colon={false} label="查询条件排序" labelCol={labelCol} wrapperCol={wrapperCol}>
            <InputNumber min={1} max={10000} defaultValue={1}
                         onChange={this.handleInput.bind(this, 'isQuerySort')} value={selectElement.isQuerySort}/>
          </FormItem>)
        case "rowSize":
          return (<FormItem colon={false} label="元素大小" labelCol={labelCol} wrapperCol={wrapperCol}>
            <InputNumber min={1} max={10} onChange={this.handleInput.bind(this, 'rowSize')}/>
          </FormItem>)
        case "table":
          let tableColumns = selectElement.tableColumns
          return (<FormItem colon={false} label="" labelCol={24} wrapperCol={24}>
            <ElementAttributeTable value={tableColumns} onChange={this.handleTable.bind(this, 'tableColumns')}/>
          </FormItem>)
        default:
          return null
      }
    }

    let renderStylePlus = (item, index) => {
      switch (item.key) {
        case "fontFamily":
          return (
            <FormItem colon={false} label="字体" key={item.key + index} labelCol={labelCol} wrapperCol={wrapperCol}>
              <Input value={selectElement.style.fontFamily}
                     onChange={this.handleInputCommon.bind(this, 'style-fontFamily')}/>
            </FormItem>)
        case "fontSize":
          return (
            <FormItem colon={false} label="字号" labelCol={labelCol} wrapperCol={wrapperCol}>
              <InputNumber min={12} max={10000} defaultValue={14} value={selectElement.style.fontSize}
                           onChange={this.handleInput.bind(this, 'style-fontSize')}/>
            </FormItem>)
        case "opacity":
          return (<FormItem colon={false} label="透明度" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Col span={12}>
              <Slider min={0} max={1} value={selectElement.style.opacity} step={0.01}
                      onChange={this.handleInput.bind(this, 'style-opacity')}/>
            </Col>
            <Col span={12}>
              <InputNumber min={0} max={1} value={selectElement.style.opacity} step={0.01}
                           onChange={this.handleInput.bind(this, 'style-opacity')}/>
            </Col>
          </FormItem>)
        case "color":
          return (<FormItem colon={false} label="字体颜色" labelCol={labelCol} wrapperCol={wrapperCol}>
            <div style={styles.swatch} onClick={this.handleClick}>
              <div style={styles.color}/>
            </div>
            {this.state.displayColorPicker ? <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose}/>
              <SketchPicker color={this.state.color} onChange={this.handleChange}/>
            </div> : null}
          </FormItem>)
        case "padding":
          return (<FormItem colon={false} label="内缩进" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input value={selectElement.style.padding}
                   onChange={this.handleInputCommon.bind(this, 'style-padding')}/></FormItem>)
        case "margin":
          return (<FormItem colon={false} label="外缩进" labelCol={labelCol} wrapperCol={wrapperCol}>
            <Input value={selectElement.style.margin}
                   onChange={this.handleInputCommon.bind(this, 'style-margin')}/>
          </FormItem>)
        default:
          return null
      }
    }

    let renderLayoutCommon = () => {
      return (
        <div id="elAttrForm" className="elAttrForm">
          <FormItem colon={false} label="列布局" labelCol={labelCol} wrapperCol={wrapperCol}>
            <RadioGroup onChange={this.onRowColChange} value={this.state.rowCol}>
              <Radio value={1}>1列</Radio>
              <Radio value={2}>2列</Radio>
              <Radio value={3}>3列</Radio>
              <Radio value={4}>4列</Radio>
            </RadioGroup>
          </FormItem>
        </div>
      )
    }

    let renderStyleAttrForm = () => {

    }

    return (
      <div className="element-attribute">
        <Form>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="通用属性" key="1">
              {selectElementKey.indexOf('selectRow') === -1
                ? this.state.formType[this.props.selectElement.type].cattr.map((item, index) => {
                  return (
                    <div id="elAttrForm" className="elAttrForm" key={item.key + index}>
                      {renderCommonPlus(item)}
                    </div>)
                }) : renderLayoutCommon()}
            </Panel>
            <Panel header="特殊属性" key="2">
              {selectElementKey.indexOf('selectRow') === -1
                ? this.state.formType[this.props.selectElement.type].tattr.map((item, index) => {
                  return (
                    <div id="extAttrForm" className="elAttrForm" key={item.key + index}>
                      {renderTeshuPlus(item)}
                    </div>)
                }) : null
              }
            </Panel>
            <Panel header="样式属性" key="3">
              {selectElementKey.indexOf('selectRow') === -1
                ? <div id="styleAttrForm" className="elAttrForm" style={{minHeight: 450}}>
                  {
                    this.state.formType[this.props.selectElement.type].sattr.map((item, index) => {
                      return renderStylePlus(item, index)
                    })
                  }
                </div>
                : <div id="styleAttrForm" className="elAttrForm" style={{minHeight: 400}}>
                  <FormItem colon={false} label="高度" labelCol={labelCol} wrapperCol={wrapperCol}><Input/></FormItem>
                  <FormItem colon={false} label="内缩进" labelCol={labelCol} wrapperCol={wrapperCol}><Input/></FormItem>
                  <FormItem colon={false} label="外缩进" labelCol={labelCol} wrapperCol={wrapperCol}><Input/></FormItem>
                </div>
              }
            </Panel>
          </Collapse>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ElementAttribute);
