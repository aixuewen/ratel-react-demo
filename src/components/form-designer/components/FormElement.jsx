import React, {Component} from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Col, Collapse, Row } from 'antd';
import Sortable from 'sortablejs';
import FormItme from '@assets/json/formItem.json';
import Iconx from "@components/iconx";
import './FormElement.less';

const Panel = Collapse.Panel;

const loop = data => data.map((item) => {
  return <Col className="dragDiv drag-box" key={item.key} span={12}>
    <a className="drag-a" id={item.key} type={item.type} title={item.title}>
      <Iconx iconName={item.icon ? item.icon : 'icondanhangshurukuang'}/>
      <label>{item.title}</label>
    </a>
  </Col>;
});

function callback(key) {
  console.log(key);
}

class FormElement extends Component {
  state = {
    gData: FormItme,
    clientHeight: (document.body.clientHeight - 70 - 57) + 'px'
  };

  //  在第一次渲染后调用
  componentDidMount() {
    this.state.gData.map((item, index) => {
      let el = document.getElementById(item.id).getElementsByTagName("div");
      for (let i = 0; i < el.length; i++) {
        Sortable.create(el[i], {
          group: {
            name: 'items',
            pull: 'clone',
            put: false
          },
          chosenClass: 'ghostClass',
          handle: ".dragDiv",
          forceFallback: true,
          sort: false,
          delay: 0
        });
      }
    })
    const _this = this;
    window.onresize = function () {
      _this.setState({clientHeight: (document.body.clientHeight - 70 - 57) + 'px'})
    }
  };

  render() {
    const gData = this.state.gData

    const header = function (item) {
      return item.icon ? <><LegacyIcon type={item.icon}/> {item.name}</> : item.name;
    }
    return (
      <div className="form-element" style={{overflow: 'auto', height: this.state.clientHeight}}>

        <Collapse defaultActiveKey={['0', '1', '2']} onChange={callback}>
          {
            gData.map((item, index) => {
              return <Panel header={header(item)} key={index} className="designer-panel">
                <Row type="flex" justify="start" align="bottom" id={item.id} className="selector">
                  {loop(item.children)}
                </Row>
                {/*<div id={item.id} className="selector">{loop(item.children)}</div>*/}
              </Panel>;
            })
          }
        </Collapse>
      </div>
    );
  }
}

export default FormElement;
