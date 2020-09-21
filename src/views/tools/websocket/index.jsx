import React from 'react';
import {Collapse, Row} from 'antd'
import {listApi} from "../../../services/tools/websocket"
import {AddButton, DeleteButton, ExportButton, RatelPage} from "@/components";

const {Panel} = Collapse;

class WebsoketPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    this.getData();
  }

  callback = (key) => {
    console.log(key);
  }

  onAddBtn() {
    this.setModalVisible(true)
  }

  onBatchDeleteBtn() {
    this.setModalVisible(true)
  }

  onExportBtn() {
    this.setModalVisible(true)
  }

  // 查询数据
  getData = () => {
    listApi({}, (res) => {
      this.setState({
        dataSource: res
      })
    })
  }

  render() {
    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          <Row style={{paddingBottom: 15}}>
            <AddButton onClick={() => this.onAddBtn()}/>
            <DeleteButton onClick={() => this.onBatchDeleteBtn()}/>
            <ExportButton onClick={() => this.onExportBtn()}/>
          </Row>

          <Collapse defaultActiveKey={['1']} onChange={this.callback}>
            {this.state.dataSource.map(item =>
              <Panel header={item} key={item}>
                <Row style={{paddingBottom: 15}}>
                  <AddButton onClick={() => this.onAddBtn()}/>
                  <DeleteButton onClick={() => this.onBatchDeleteBtn()}/>
                  <ExportButton onClick={() => this.onExportBtn()}/>
                </Row>
              </Panel>
            )}
          </Collapse>
        </div>
      </RatelPage>
    )
  }
}

export default WebsoketPage


