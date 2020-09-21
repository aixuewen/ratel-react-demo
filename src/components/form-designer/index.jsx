import {Card, Layout, message, Radio} from 'antd';
import React, {Component} from 'react';
import FormDesignerContent from './content' // 中间节点信息页面
import FormElement from './components/FormElement'
import ElementAttribute from './components/ElementAttribute'
import FormAttribute from './components/FormAttribute'
import {connect} from 'react-redux'
import './index.less'
import {generateUUID} from "@utils/uuid.js"
import {getModelCustomFromInfo} from '@services/form-designer/FormDesigner'

const {Header, Content, Sider} = Layout;

function mapStateToProps(state) {
  return {
    radioType: state.radioType,
    selectElementKey: state.selectElementKey,
    formData: state.formData
  }
}

class FormDesigner extends Component {

  constructor(props) {
    super(props)
    let headerName = '双创动态表单设计'
    this.state = {
      headerName: headerName,
      clientHeight: (document.body.clientHeight - 70 - 57) + 'px'
    };

    let formId = this.props.formId
    if (formId !== 'newform') {
      //表单编辑的时候
      getModelCustomFromInfo({
        id: formId,
      }).then((res) => {
        console.log(res.data.content.id)
        let formData = res.data.content.formDefinition
        formData.id = res.data.content.id
        this.props.dispatch({type: 'SET_FORMDATA', value: formData})
        this.props.dispatch({type: 'SET_DRAGROW', value: formData.content})
      })
    } else {
      //表单新增的时候
      this.props.formData.formNumber=generateUUID();
      let formData = this.props.formData
      this.props.dispatch({type: 'SET_FORMDATA', value: formData})
    }
  }

  onChange = (e) => {
    if (this.props.selectElementKey === 0 && e.target.value === 'ELEMENT_ATTRIBUTE') {
      message.error('请先选择一个组件');
      return
    }
    this.props.dispatch({type: e.target.value});
  }

  componentDidMount() {
    const _this = this;
    window.onresize = function () {
      _this.setState({clientHeight: (document.body.clientHeight - 70 - 57) + 'px'})
    }
  }

  componentWillMount() {
    window.formDesignerFlag = true
  }

  render() {
    const [radioType, headerName] = [this.props.radioType, this.state.headerName];
    return (
      <Layout className="designer-layout" style={{overflow: 'hidden', height: '100%'}}>
        <Header className="header">
          <div className="logo">
            {/*<img alt="logo" src={logo} />*/}
            <label>动态表单：{headerName}</label>
            {/*<Button type="primary" style={{marginLeft: 20}}>选择模板</Button>*/}
            {/*<span className="headerDesc">{headerDesc}</span>*/}
            {/*<span className="headerDetails">详情</span>*/}
          </div>
        </Header>
        <Layout>
          <Sider width={300} className="designer-sider">
            <Card title="基础组件" bordered={false} style={{width: '100%'}}>
              <FormElement/>
            </Card>
          </Sider>
          <Content className="card-container">
            <FormDesignerContent/>
          </Content>
          <Sider className="rightSider ant-layout-sider-light" width={370}>
            <div className="rightHeader">
              <Radio.Group className="tab" value={radioType} onChange={this.onChange}>
                <Radio.Button value="FORM_ATTRIBUTE">表单属性</Radio.Button>
                <Radio.Button value="ELEMENT_ATTRIBUTE">元素属性</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{overflow: 'auto', height: this.state.clientHeight, background: '#ffffff'}}>
              {this.props.radioType === 'ELEMENT_ATTRIBUTE' ? <ElementAttribute/> : null}
              {this.props.radioType === 'FORM_ATTRIBUTE' ? <FormAttribute/> : null}
            </div>
          </Sider>
        </Layout>
      </Layout>
    )
  }
}

export default connect(mapStateToProps)(FormDesigner);
