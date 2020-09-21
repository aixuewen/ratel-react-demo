import React from 'react';
import config from '@config'
import {RatelPage} from "@/components";
import ReactDOM from 'react-dom';

class ErrorLog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      iFrameHeight: (document.body.clientHeight - 72 - 140) + 'px',
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <RatelPage className='page'>
        <iframe
          style={{width: '100%', minHeight: this.state.iFrameHeight, overflow: 'visible'}}
          onLoad={() => {
            const obj = ReactDOM.findDOMNode(this.refs.iframe);
            this.setState({
              "iFrameHeight": obj.contentWindow.document.body.scrollHeight + 'px'
            });
          }}
          src={config.API_BASE_URL + "/druid"}
          sandbox="allow-scripts allow-forms allow-same-origin"
          ref="iframe"
          width="100%"
          height={this.state.iFrameHeight}
          scrolling="auto"
          frameBorder="0"
          className="sub-page-iframe"/>

      </RatelPage>
    )
  }
}

export default ErrorLog


