import React from 'react'
import PropTypes from "prop-types";
import {Modal} from 'antd'

class DeleteConfirm extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    style: PropTypes.any,
    className: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  handleModalClick() {
    Modal.confirm({
      content: this.props.title ? this.props.title : '是否执行该操作',
      onOk: () => {
        if (this.props.onConfirm) {
          this.props.onConfirm()
        }
      }
    })
  }

  render() {
    const {children} = this.props
    const p = this
    return (
      <div>
        <div onClick={this.handleModalClick.bind(this)}>
          {children || null}
        </div>
      </div>
    )
  }
}

DeleteConfirm.propTypes = {
  children: PropTypes.node,
}

export default DeleteConfirm
