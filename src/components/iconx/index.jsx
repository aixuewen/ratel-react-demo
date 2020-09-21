import React from 'react'
import './index.less'
import PropTypes from "prop-types";

/**
 *   <Iconx iconName={'iconIcon-wenjianleixing-Excel'} className={'download-bth'}/>
 */
class Iconx extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    style: PropTypes.any,
    className: PropTypes.string
  }

  render() {
    return (
      <i className={'iconfont ' + this.props.iconName + ' ' + (this.props.className || '')} style={this.props.style}/>)
  }
}


export default Iconx
