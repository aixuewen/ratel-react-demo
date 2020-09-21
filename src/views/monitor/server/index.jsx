import React from 'react';
import {RatelPage} from "@/components";
import {Result} from "antd";

class Server extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return (
      <RatelPage className='page'>
        <Result
          title="暂未实现"
        />
      </RatelPage>
    )
  }
}

export default Server


