import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Collapse, Input, InputNumber, Select, Slider } from 'antd';
import reactCSS from 'reactcss'
import {connect} from 'react-redux'
import SketchPicker from 'react-color'
import './FormAttribute.less'

const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const FormItem = Form.Item
const Option = Select.Option;

function mapStateToProps(state) {
  return {
    formData: state.formData,
  }
}

class FormAttribute extends Component {
  state = {
    displayColorPicker: false,
    labelCol: {span: 6},
    wrapperCol: {span: 18},
    typeIds: [],
    businessTypes: [],
    color: {
      r: '0',
      g: '0',
      b: '0',
      a: '0.65',
    }
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.formData && this.state.typeIds.length === 0) {
        /*getModelFormTypeSelectType({typeGroupNum: nextProps.formData.typeGroupNum}).then((res) => {
          if (res.data.success) {
            this.setState({typeIds: res.data.data})
          } else {
            message.error(res.data.message);
          }
        })*/
      }
    } catch (e) {
      console.log(e)
    }
  }

  //  在第一次渲染后调用
  componentDidMount() {
    if (this.props.formData.typeGroupNum) {
      /* getModelFormTypeSelectType({typeGroupNum: this.props.formData.typeGroupNum}).then((res) => {
         if (res.data.success) {
           this.setState({typeIds: res.data.data})
         } else {
           message.error(res.data.message);
         }
       })*/
    }
    /* getBusinessType({paramCode: '1012'}).then((res) => {
       if (res.data.success) {
         this.setState({businessTypes: res.data.data})
       } else {
         message.error(res.data.message);
       }
     })*/
  };

  handleChange = (color) => {
    this.setState({color: color.rgb})
    let key = this.props.selectElementKey
    let value = color.hex
    let attr = 'style-color'
    this.props.dispatch({type: 'UPDATE_FORMATTR', attr, value})
    this.setState({displayColorPicker: false})
  };

  handleClick = () => {
    this.setState({displayColorPicker: true})
  }
  /**
   * 将表单数据保存至redux，保留状态
   * @param  {string} type  数据类型 orderSum||name||phoneNo
   * @param  {object} event 事件对象
   */
  handleInput = (attr, event) => {
    let value = event
    if (attr.indexOf('style') === '-1' && attr !== 'required') {
      value = event.target.value
    }

    if (attr === 'formStatus') {
      console.log(event)
      value = event ? 1 : 0
    }
    this.props.dispatch({type: 'UPDATE_FORMATTR', attr, value})
  }
  handleInputCommon = (attr, event) => {
    let value = event.target.value
    this.props.dispatch({type: 'UPDATE_FORMATTR', attr, value})
  }
  handleSelectCommon = (attr, event) => {
    let value = event
    this.props.dispatch({type: 'UPDATE_FORMATTR', attr, value})
  }

  render() {
    let labelCol = this.state.labelCol
    let wrapperCol = this.state.wrapperCol
    let formData = this.props.formData
    let styles = reactCSS({
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
    console.log(formData.typeGroupNum)
    return (
      <div className="form-attribute">
        <Form>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="通用属性" key="1">
              <div id="elAttrForm" className="elAttrForm">
                <FormItem required colon={false} label="表单名称" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Input onChange={this.handleInputCommon.bind(this, 'formName')} value={formData.formName}/></FormItem>

                <FormItem required colon={false} label="表单标识" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Input onChange={this.handleInputCommon.bind(this, 'formNumber')}
                         value={formData.formNumber} readonly="readonly" /></FormItem>

                {/*<FormItem required colon={false} label="表单类型" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Select defaultValue={formData.typeId} value={formData.typeId}
                          onChange={this.handleSelectCommon.bind(this, 'typeId')}>
                    {this.state.typeIds.map(item => (
                      <Option key={item.typeId}>{item.typeName}</Option>
                    ))}
                  </Select>
                </FormItem>*/}
                <FormItem required colon={false} label="表单排序" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <InputNumber min={1} max={10000} defaultValue={1} value={formData.formSort}
                               onChange={this.handleInput.bind(this, 'formSort')}/>
                </FormItem>

                {/*{
                  formData.typeGroupNum !== '001'
                    ? <FormItem colon={false} label="业务类型" labelCol={labelCol} wrapperCol={wrapperCol}>
                      <Select defaultValue={formData.businessType} value={formData.businessType}
                              onChange={this.handleSelectCommon.bind(this, 'businessType')}>
                        {this.state.businessTypes.map(item => (
                          <Option key={item.valueCode}>{item.parName}</Option>
                        ))}
                      </Select></FormItem>
                    : null
                }*/}
                {/*<FormItem required colon={false} label="角色权限" labelCol={labelCol} wrapperCol={wrapperCol}>*/}
                {/*  <Select defaultValue={formData.role} onChange={this.handleSelectCommon.bind(this, 'role')}>*/}
                {/*    <Option value="r1">r1</Option>*/}
                {/*    <Option value="r2">r2</Option>*/}
                {/*    <Option value="r3">r3</Option>*/}
                {/*    <Option value="r4">r4</Option>*/}
                {/*  </Select>*/}
                {/*</FormItem>*/}
                {/*<FormItem required colon={false} label="绑定流程" labelCol={labelCol} wrapperCol={wrapperCol}>*/}
                {/*  <Select defaultValue={formData.type} onChange={this.handleSelectCommon.bind(this, 'flow')}>*/}
                {/*    <Option value="f1">f1</Option>*/}
                {/*    <Option value="f2">f2</Option>*/}
                {/*    <Option value="f3">f3</Option>*/}
                {/*    <Option value="f4">f4</Option>*/}
                {/*  </Select>*/}
                {/*</FormItem>*/}
                {/*<FormItem colon={false} label="表单属性" labelCol={labelCol} wrapperCol={wrapperCol}>*/}
                {/*  <Input onChange={this.handleInput.bind(this, 'placeholder')} value={11}/></FormItem>*/}
                {/*<FormItem required colon={false} label="是否发布" labelCol={labelCol} wrapperCol={wrapperCol}>*/}
                {/*  <Switch checked={formData.formStatus === 1}*/}
                {/*          onChange={this.handleInput.bind(this, 'formStatus')}/></FormItem>*/}
                <FormItem colon={false} label="&nbsp;&nbsp;表单描述" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <TextArea onChange={this.handleInputCommon.bind(this, 'formDesc')} value={formData.formDesc}
                            rows={4}/>
                </FormItem>
              </div>
            </Panel>
            <Panel header="样式属性" key="3">
              <div id="styleAttrForm" className="elAttrForm" style={{minHeight: 400}}>
                <FormItem colon={false} label="字体" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Input onChange={this.handleInputCommon.bind(this, 'style-fontFamily')}
                         value={formData.style.fontFamily}/>
                </FormItem>
                <FormItem colon={false} label="字号" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <InputNumber min={12} max={10000} defaultValue={14} value={formData.style.fontSize}
                               onChange={this.handleInput.bind(this, 'style-fontSize')}/>
                </FormItem>
                <FormItem colon={false} label="透明度" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Col span={14}>
                    <Slider min={0} max={1} value={formData.style.opacity} step={0.01}
                            onChange={this.handleInput.bind(this, 'style-opacity')}/>
                  </Col>
                  <Col span={10}>
                    <InputNumber min={0} max={1} value={formData.style.opacity} step={0.01}
                                 onChange={this.handleInput.bind(this, 'style-opacity')}/>
                  </Col>
                </FormItem>
                <FormItem colon={false} label="字体颜色" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color}/>
                  </div>
                  {this.state.displayColorPicker ? <div style={styles.popover}>
                    <div style={styles.cover} onClick={this.handleClose}/>
                    <SketchPicker color={this.state.color} onChange={this.handleChange}/>
                  </div> : null}
                </FormItem>
                <FormItem colon={false} label="内缩进" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Input onChange={this.handleInputCommon.bind(this, 'style-padding')} value={formData.style.padding}
                         placeholder="例：0xp 0xp 0xp 0xp"/>
                </FormItem>
                <FormItem colon={false} label="外缩进" labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Input onChange={this.handleInputCommon.bind(this, 'style-margin')} value={formData.style.margin}
                         placeholder="例：0xp 0xp 0xp 0xp"/>
                </FormItem>
              </div>
            </Panel>
          </Collapse>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(FormAttribute);
