import React from 'react'
import 'echarts-wordcloud'
import {Avatar, Card, Col, Empty, List, message, Row, Typography} from "antd";
import {RatelPage} from "@/components";
import "./style.less"
import * as Storage from "../../utils/Storage";
import * as oauthApi from "../../services/system/oauth"
import moment from "moment"

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

class HomePage extends React.Component {
  state = {
    dtData: [],
    dayCount: 0,
    dtCount: 0,
    currentUser: {
      avatar: require('assets/images/userAvatar.png'),
      name: "昵称",
      title: "登录名",
      group: "机构"
    }
  }

  componentDidMount() {
    let user = Storage.getUserInfo()
    let start = moment(new Date()).format('YYYY/MM/DD');
    this.setState({
      dayCount: start
    })
    oauthApi.list({sort: "createTime,desc"}).then((res) => {
      if (res.data.success) {
        this.setState({
          dtData: res.data.content.content,
          dtCount: res.data.content.totalElements
        })
      } else {
        message.error(res.data.message);
      }
    })
    this.setState({
      dtData: [],
      currentUser: {
        avatar: require('assets/images/userAvatar.png'),
        name: user.nickName,
        title: user.username,
        group: user.deptName
      }
    })
  }

  render() {
    const {
      dtData,
      currentUser
    } = this.state;
    return (
      <div className='w-home-page'>
        <RatelPage className='page' inner>
          <div className="ant-page-header-content">
            <div className="ant-pro-page-container-detail">
              <div className="ant-pro-page-container-main">
                <Row>
                  <div className="ant-pro-page-container-content">
                    <div className="pageHeaderContent">
                      <div className="avatar">
                        <Avatar size="large" src={currentUser.avatar}/>
                      </div>
                      <div className="content">
                        <div className="contentTitle">
                          你好，<span style={{color: "#3590e1"}}>{currentUser.name}</span>，祝你开心每一天！
                        </div>
                        <div>
                          {currentUser.title} | {currentUser.group}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ant-pro-page-container-extraContent">
                    <div className="extraContent">
                      <div className="statItem">
                        <p>接入系统数量</p>
                        <p>{this.state.dtCount}</p>
                      </div>
                      {/*<div className="statItem">*/}
                      {/*  <p>团队内排名</p>*/}
                      {/*  <p>*/}
                      {/*    8<span> / 24</span>*/}
                      {/*  </p>*/}
                      {/*</div>*/}
                      <div className="statItem">
                        <p>当前日期</p>
                        <p>{this.state.dayCount}</p>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          </div>

        </RatelPage>

        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{marginTop: 20}}>
            <Card
              bodyStyle={{paddingTop: 0, paddingBottom: 12}}
              bordered={false}
              title="接入系统动态"
            >
              {dtData && dtData.length > 0
                ? <List size="large" dataSource={dtData}
                        renderItem={item => (
                          <List.Item style={{paddingLeft: 0, paddingRight: 0}}>
                            <Typography.Text>[ <span
                              style={{color: "#3590e2"}}>接入系统</span></Typography.Text> ] {item.applicationName} - {item.createTime}
                          </List.Item>
                        )}/>
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{marginTop: 20}}>
            <Card
              bodyStyle={{paddingTop: 0, paddingBottom: 12}}
              bordered={false}
              title="快速开始 / 便捷导航"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HomePage
