import { CloseCircleOutlined, FormOutlined, PlaySquareOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Layout, message, Modal, Row } from 'antd';
import React, {Component} from 'react';
import Sortable from 'sortablejs'
import {connect} from 'react-redux'

import './index.less';
import DragContent from "../components/DragContent";
import {addModelCustomFrom} from '@services/form-designer/FormDesigner'
import {createHashHistory} from 'history';

const history = createHashHistory();
const {Header} = Layout;

function mapStateToProps(state) {
  return {
    store: state.element,
    radioType: state.radioType,
    dragRow: state.dragRow,
    formData: state.formData,
    selectElementKey: state.selectElementKey
  }
}

class FormDesignerContent extends Component {
  state = {
    formItem: [],
    clientHeight: (document.body.clientHeight - 70 - 57) + 'px',
    clientInnerHeight: (document.body.clientHeight - 70 - 77) + 'px'
  };

  closeClick(key) {
    this.props.dispatch({type: 'DELETE_ROW', key: key});
  }

  dragRowClick(key) {
    this.props.dispatch({type: 'ELEMENT_ATTRIBUTE'});
    this.props.dispatch({type: 'SELECT_ELEMENT', value: key + '-selectRow'});
  }

  // 预览按钮点击事件打开一个新页面
  previewClick(e) {
    let pathname = window.location.pathname;
    console.log(pathname)
    this.runSync().then(function () {
      window.open(pathname+'/#/preview')
    })
  }

  previewClickMoblie(e) {
    let pathname = window.location.pathname;
    this.runSync().then(function () {
      window.open(pathname+'/#/preview/mobile')
    })
  }

  runSync() {
    const _this = this
    return new Promise((resolve, reject) => {
      let value = _this.props.dragRow
      _this.props.dispatch({type: 'UPDATE_FORMATTR', attr: 'content', value})
      resolve()
    })
  }

  // 点击保存按钮执行
  saveClick(e) {
    const _this = this
    this.runSync().then(function () {
      let formData = _this.props.formData
      if (!formData.formName) {
        message.warn("请输入表单名称")
        return
      }
      /*if (!formData.typeId) {
        message.warn("请选择表单类型")
        return
      }*/

      if (formData.typeGroupNum !== '001' && !formData.formNumber) {
        message.warn("请输入表单标识")
        return
      }
      if (!formData.formSort) {
        message.warn("请输入表单排序")
        return
      }

      if (formData.content.length > 0) {
        for (let i = 0; i < formData.content.length; i++) {
          let arr = formData.content[i].col[0].attr.label;
          
          if (arr.trim()==="") {
            message.warn("请输入第"+(i+1)+"个元素属性的中标签文本")
            return
          }
        }

      }
     
      
      let queryList = [];
      let filedList = [];
      if (formData.content.length > 0) {
        for (let i = 0; i < formData.content.length; i++) {
          // console.log(formData.content[i].col[0].attr);
          let arr = formData.content[i].col[0].attr.isTableFiled;
          if (formData.content[i].col[0].attr.isQuery) {
            queryList.push(formData.content[i].col[0].attr)
          }
         /* if (formData.content[i].col[0].attr.isTableFiled) {*/
            filedList.push(formData.content[i].col[0].attr)
          /*}*/
        }

      }
      formData["queryList"] = queryList;
      formData["filedList"] = filedList;
      //console.log(queryList);
      //console.log(filedList);

      console.log(formData);
      addModelCustomFrom({
        id: formData.id,
        formId: formData.key,
        typeGroupNum: formData.typeGroupNum,
        formName: formData.formName,
        busiKey: formData.formNumber,
        // formStatus: formData.formStatus,
        typeId: formData.typeId,
        formDesc: formData.formDesc,
        businessType: formData.businessType,
        formDefinition: formData,
        searchColumn:queryList,
        tableColumn:filedList
      }).then((res) => {
        console.log(res)
        if (res.data.errCode === 0) {
          message.info("保存成功");
          //+ formData.typeGroupNum + '/'
          history.push('/buildForm/' + res.data.content)
          _this.props.dispatch({type: 'UPDATE_FORMATTR', attr: 'id', value:res.data.content})
          //history.push('/1');
        } else {
          message.error(res.data.errMsg);
        }
      }) 
    })

  }

  // 在组件更新时执行
  componentDidUpdate() {
    let el = document.querySelectorAll('.dragCol');
    for (let i = 0; i < el.length; i++) {
      new Sortable(el[i], {
        group: {
          name: 'items',
          pull: true,
          put: true
        },
        sort: false,
        handle: ".dropJdxx",
        ghostClass: "JdxxghostClass",
        onAdd: (event) => {
          setTimeout(function () {
            el[i].removeChild(event.item)
          }, 30)
          if (event.from.getAttribute('id') === null) {
            let newAttr = {
              label: event.item.getAttribute('title'),
              placeholder: '',
              desc: '',
              key: event.item.getAttribute('id') + Math.ceil(Math.random() * 10000000),
              type: event.item.getAttribute('type'),
              required: false,
              location: '',
              selectValue: '',
              tableColumns: [
                {
                  key: Math.ceil(Math.random() * 10000000),
                  colName: '列1',
                  colDataRequired: true
                },
                {
                  key: Math.ceil(Math.random() * 10000000),
                  colName: '列2',
                  colDataRequired: false
                },
              ],
              style: {
                fontFamily: '', //字休
                fontSize: 14, //字号
                opacity: 1, //透明度
                color: '', //字体颜色
                padding: '', //外缩近
                margin: '' //内缩进
              }
            }
            let parentId = el[i].id.split('-')[0]
            const selectRow = this.props.dragRow.filter(item => {
              return item.key === parentId
            })

            let arr = selectRow[0].col.slice()
            let cItem = null;
            let confirmFlag = false;
            arr.map(item => {
              if (item.key === el[i].id.split('-')[1]) {
                if (item.attr && item.attr.type && item.attr.type !== 'layout') {
                  confirmFlag = true
                }
                cItem = item;
              }
            })

            if (confirmFlag) {
              Modal.confirm({
                title: '确定要替换当前元素吗？',
                onOk: () => {
                  cItem.attr = newAttr
                  this.props.dispatch({type: 'UPDATE_DRAGROW', attr: 'col', value: arr, key: parentId})
                },
                onCancel() {
                  console.log(1)
                },
                okText: '确认',
                cancelText: '取消',
              });
            } else {
              cItem.attr = newAttr
              this.props.dispatch({type: 'UPDATE_DRAGROW', attr: 'col', value: arr, key: parentId})
            }
          } else {
            let fromId = event.from.getAttribute("id").split('-')
            let toId = event.to.getAttribute("id").split('-')
            let fromElement = null;
            let toElement = null;
            this.props.dragRow.map(item => {
              if (item.key === fromId[0]) {
                item.col.map(element => {
                  if (element.key === fromId[1]) {
                    fromElement = element.attr
                  }
                })
              }
              if (item.key === toId[0]) {
                item.col.map(element => {
                  if (element.key === toId[1]) {
                    toElement = element.attr
                  }
                })
              }
            })
            this.props.dispatch({type: 'UPDATE_COL', attr: 'col', value: fromElement, key: event.to.getAttribute("id")})
            this.props.dispatch({type: 'UPDATE_COL', attr: 'col', value: toElement, key: event.from.getAttribute("id")})
            event.from.appendChild(event.to.firstChild)
          }
        },
        onStart: (event) => {
          // console.log(event.item.parentNode.getAttribute("id"))
        }
      })
    }
  }

  //  在第一次渲染后调用
  componentDidMount() {

    setTimeout(res => {
      let el = document.querySelector('#dropJdxx')
      new Sortable(el, {
        group: {
          name: 'items',
          pull: true,
          put: true
        },
        sort: true,
        handle: ".dropJdxx",
        ghostClass: "JdxxghostClass",
        onAdd: (event) => {
          if (event.from.getAttribute('id') === null) {
            setTimeout(function () {
              el.removeChild(event.item)
            }, 30)
            let newAttr = {
              label: event.item.getAttribute('title'),
              placeholder: '',
              desc: '',
              key: event.item.getAttribute('id') + Math.ceil(Math.random() * 10000000),
              type: event.item.getAttribute('type'),
              required: false,
              selectValue: '',
              location: '',
              tableColumns: [
                {
                  key: Math.ceil(Math.random() * 10000000),
                  colName: '列1',
                  colDataRequired: true
                },
                {
                  key: Math.ceil(Math.random() * 10000000),
                  colName: '列2',
                  colDataRequired: false
                },
              ],
              style: {
                fontFamily: '', //字休
                fontSize: 14, //字号
                opacity: 1, //透明度
                color: '', //字体颜色
                padding: '', //外缩近
                margin: '' //内缩进
              }
            }
            let key = 'dragRow' + (new Date()).valueOf() + Math.ceil(Math.random() * 10000)
            let selectRow = {
              key: key,
              col: [],
              style: {
                height: 55,
                margin: 0,
                padding: 0
              }
            }
            if (event.item.getAttribute('type') !== "layout") {
              selectRow.col.push({
                key: 'dragRow' + (new Date()).valueOf() + Math.ceil(Math.random() * 10000),
                attr: newAttr
              })
            } else {
              selectRow.col.push({
                key: 'dragRow' + (new Date()).valueOf() + Math.ceil(Math.random() * 10000),
                attr: {}
              })
            }
            this.props.dispatch({type: 'SET_DRAGROW', value: selectRow})
            if (event.item.getAttribute('type') !== "layout") {
              this.props.dispatch({
                type: 'SELECT_ELEMENT',
                value: newAttr.key + '-' + selectRow.key + '-' + selectRow.col[0].key
              });
            } else {
              this.props.dispatch({
                type: 'SELECT_ELEMENT',
                value: selectRow.key + '-selectRow'
              });
            }
            this.props.dispatch({type: 'ELEMENT_ATTRIBUTE'});
            // this.props.dispatch({type: 'UPDATE_DRAGROW', attr: 'style', value: selectRow.col.slice(), key: key})
          }
        },
        onStart: (event) => {
          // console.log(event.item.parentNode.getAttribute("id"))
        },
        onUpdate: (event) => {
          // this.props.dispatch({type: 'CHANGE_ROW', index1: event.oldIndex - 1, index2: event.newIndex - 1})
        }
      })
    }, 30)
  };

  // 在渲染前调用,在客户端也在服务端。
  componentWillMount() {
  }


  render() {
    const formData = this.props.formData
    const {form} = this.props

    const selectElementKey = this.props.selectElementKey

    let getEditFlag = function (key) {
      return (selectElementKey + "").indexOf(key) !== -1
    }

    return (
      <div className="jdxx">
        <Header className="designer-header-inner">
          <Button type="link" onClick={this.saveClick.bind(this)} style={{color: '#FA541C'}}>
            <SaveOutlined />
            保存
          </Button>
          <Button type="link" onClick={this.previewClick.bind(this)}>
            <PlaySquareOutlined />
            预览
          </Button>
          <Button type="link" onClick={this.previewClickMoblie.bind(this)}>
            <PlaySquareOutlined />
            手机预览
          </Button>
        </Header>
        <div style={{height: this.state.clientHeight, overflowY: "auto"}}>
          <div className="mainJdxx" style={formData.style}>
            <Form action="" id="dropJdxx" className="dropJdxx" style={{minHeight: this.state.clientInnerHeight}}>
              {this.props.dragRow.map((item, index) => {
                let list = []
                for (let i = 0; i < item.col.length; i++) {
                  list.push(
                    <Col span={24 / item.col.length} id={item.key + '-' + item.col[i].key} className="dragCol"
                         key={'dragRow_' + i + item.key} onClick={this.dragRowClick.bind(this, item.key)}>
                      <DragContent elementId={item.key + '-' + item.col[i].key} elementData={item.col[i].attr}
                                   form={form} disabled={true} readonly={true}/>
                    </Col>
                  )
                }
                return (
                  <Row key={item.key}
                              className={selectElementKey === item.key + '-selectRow' ? 'dragRowSelect' : 'dragRow'}
                              onClick={this.dragRowClick.bind(this, item.key)}>
                    {
                      getEditFlag(item.key) ? <span>
                          <CloseCircleOutlined className="deleteIcon" onClick={this.closeClick.bind(this, item.key)} />
                          <FormOutlined className="editIcon" /></span> : null
                    }
                    {list}
                  </Row>
                );
              })}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Form.create()(FormDesignerContent));
