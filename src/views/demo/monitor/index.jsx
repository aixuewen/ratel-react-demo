import React from 'react'
import {Avatar, Card, Col, DatePicker, Form, Input, message, Pagination, Row, Select} from 'antd'
import * as deviceApi from "../../../services/demo/device";

import './index.less';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {RatelPage, SearchButton} from "@/components";
import moment from "moment";
import Zmage from 'react-zmage'

const {Meta} = Card;
const {RangePicker} = DatePicker;
const {Option} = Select;

class Device extends React.Component {
  searchForm = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],

      total: 0,
      current: 1,
      pageSize: 20
    }
  }

  getData = () => {
    // let values = this.searchForm.current.getFieldsValue();
    let params = {}
    // params.blurry = values.blurry
    // params.enable = values.runFlag
    params.page = this.state.current - 1
    params.size = this.state.pageSize
    // if (values.createTime) {
    //   params.createTime = [];
    //   params.createTime[0] = moment(values.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    //   params.createTime[1] = moment(values.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    // }

    deviceApi.listMonitorApi(params).then((res) => {
      console.log(res)
      if (res.data.success) {
        this.setState({
          dataSource: res.data.content.content,
          total: res.data.content.totalElements
        })
      } else {
        message.error(res.data.message);
      }
    })
  }

  componentDidMount() {
    this.getData()
  }


  //查询
  onHandleSearch = () => {
    this.setState({
      total: 0,
      current: 1,
      menuSelectedKeys: [],
      rowId: null
    }, () => {
      this.getData()
    })
  }


  //查询
  onClickMore = (sid) => {
    this.props.history.push({
      pathname: "/demo/devicemonitor/devicemonitorDtl",
      state: {
        sid: sid
      }
    })
  }

  onTablePaginationChange = (page, pageSize) => {
    this.setState({
      current: page,
      pageSize: pageSize
    }, () => {
      this.getData()
    })
  }


  render() {
    const {current, currentRow, total} = this.state

    const formItemLayout = {
      labelCol: {
        xs: {span: 0},
        sm: {span: 0},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
      },
    };

    const loop = data => data.map((item) => {
      let imgSrc = require('assets/images/logo.svg')
      if (item.device_manufacturer === "Xiaomi") {
        imgSrc = require('assets/logo/xiaomi.jpeg')
      } else if (item.device_manufacturer === "OPPO") {
        imgSrc = require('assets/logo/oppo.jpeg')
      } else if (item.device_manufacturer === "vivo") {
        imgSrc = require('assets/logo/vivo.jpeg')
      } else if (item.device_manufacturer === "HUAWEI") {
        imgSrc = require('assets/logo/huawei.jpeg')
      } else if (item.device_manufacturer === "360") {
        imgSrc = require('assets/logo/360.jpeg')
      }

      let coverPath = "../../../../static/img/empty.jpg"

      if (item.content) {
        coverPath = 'http://ad.dsqhost.com/' + item.content
      }

      return <Col span={4} style={{padding: 10}}>
        <Card
          cover={
            <Zmage src={coverPath}/>
          }
          actions={[
            <SettingOutlined key="setting"/>,
            <EditOutlined key="edit"/>,
            <EllipsisOutlined key="ellipsis" onClick={this.onClickMore.bind(this, item.sid)}/>,
          ]}
        >
          <Meta
            avatar={<Avatar src={imgSrc}/>}
            title={!item.tag ? "未设置" : item.tag}
            description={item.enable === "1" ? <span style={{color: 'green'}}>在线</span>
              : <span style={{color: 'red'}}>离线</span>}
          />
        </Card>
      </Col>;
    });


    return (
      <div>
        {/*<RatelPage className='page' inner>*/}
        {/*  <div className='bonc-mung-oauth-list'>*/}
        {/*    <Row>*/}
        {/*      <Form ref={this.searchForm} name="searchForm" layout="inline" {...formItemLayout}>*/}
        {/*        <Form.Item name="blurry">*/}
        {/*          <Input placeholder="输入名称搜索"/>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="createTime">*/}
        {/*          <RangePicker format={'YYYY-MM-DD'}/>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="runFlag">*/}
        {/*          <Select allowClear placeholder="是否在线">*/}
        {/*            <Option key="1" value="1">在线</Option>*/}
        {/*            <Option key="0" value="0">离线</Option>*/}
        {/*          </Select>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item*/}
        {/*          wrapperCol={{*/}
        {/*            xs: {span: 24, offset: 0},*/}
        {/*            sm: {span: 24, offset: 0},*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          <SearchButton onClick={this.onHandleSearch}/>*/}
        {/*        </Form.Item>*/}
        {/*      </Form>*/}
        {/*    </Row>*/}
        {/*  </div>*/}
        {/*</RatelPage>*/}
        <RatelPage className='page bonc-mung-view-page-se' inner style={{marginTop: 10}}>
          <div className='bonc-mung-oauth-list'>
            <Row>
              {loop(this.state.dataSource)}
            </Row>
          </div>
        </RatelPage>
        <RatelPage className='page bonc-mung-view-page-se' inner style={{marginTop: 10}}>
          <Pagination defaultCurrent={1} total={total} current={current} defaultPageSize={20}
                      onChange={this.onTablePaginationChange}/>
        </RatelPage>
      </div>
    )
  }
}

export default Device
