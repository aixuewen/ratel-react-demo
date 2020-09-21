import React from 'react'
import {Button, Col, message, Row, Typography} from 'antd'
import {CaretRightOutlined, ReloadOutlined} from '@ant-design/icons';
import './index.less';
import {RatelPage} from "@/components";
import {axios} from "../../../utils";
import * as deviceApi from "../../../services/demo/device";

const {Title} = Typography;

class DeviceDtl extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sid: '',
      device: {},
      deviceImage: {}
    }
  }


  onShowScreen(sid) {
    deviceApi.showScreen({sid: sid}, (res) => {
    })
  }

  onShowReload(sid) {
    axios.post('/api/tool/file/getFile', {sid: sid}).then((res) => {
      if (res.data.success) {
        this.setState({
          deviceImage: res.data.content
        })
      } else {
        message.error(res.data.message);
      }
    })
  }

  componentDidMount() {
    const {location} = this.props;
    let sid;
    if (location.state && location.state.sid) { //判断当前有参数
      sid = location.state.sid;
      sessionStorage.setItem('data_sid', sid);// 存入到sessionStorage中
    } else {
      sid = sessionStorage.getItem('data_sid');// 当state没有参数时，取sessionStorage中的参数
    }
    this.setState({
      sid
    })

    this.onShowReload(sid)

    axios.post('/api/tool/device/getOne', {sid: sid}).then((res) => {
      if (res.data.success) {
        this.setState({
          device: res.data.content
        })
      } else {
        message.error(res.data.message);
      }
    })
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <RatelPage className='page' inner>
              <div className='bonc-mung-oauth-list'>
                <Row>
                  <Col className="gutter-row" span={24} style={{textAlign: 'center', marginBottom: 10}}>
                    <Title level={2}>{!this.state.device.tag ? "未设置" : this.state.device.tag}</Title>
                  </Col>
                </Row>
                <Row style={{textAlign: 'center'}}>
                  <Col className="gutter-row" span={24} style={{textAlign: 'center'}}>
                    {!!this.state.deviceImage && !!this.state.deviceImage.content
                      ? <img alt="example" src={'http://ad.dsqhost.com/' + this.state.deviceImage.content}
                             style={{width: '260px', height: '100%'}}/>
                      : <img alt="example" src="../../../../static/img/empty.jpg"
                             style={{width: '260px', height: '100%'}}/>
                    }
                  </Col>
                </Row>
                <Row>
                  <Col className="gutter-row" span={24} style={{textAlign: 'center', marginTop: 20}}>
                    <Button type="primary" shape="circle" onClick={() => this.onShowScreen(this.state.sid)}
                            icon={<CaretRightOutlined/>}/> &nbsp;&nbsp;
                    <Button type="primary" shape="circle" onClick={() => this.onShowReload(this.state.sid)}
                            icon={<ReloadOutlined/>}/>
                  </Col>
                </Row>
              </div>
            </RatelPage>
          </Col>
          <Col className="gutter-row" span={16}>
            <RatelPage className='page' inner>
              <div className='bonc-mung-oauth-list'>
                设备
              </div>
            </RatelPage>
          </Col>
        </Row>
      </div>
    )
  }
}

export default DeviceDtl
