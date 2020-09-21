import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'antd'
import './CommonTable.less'

export default class CommonTable extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    noSorterAll: PropTypes.bool,
    pagination: PropTypes.any,
  }

  render() {
    const {
      type,
      scrollX,
      className,
      columns,
      noSorterAll,
      ...restProps
    } = this.props
    if (!noSorterAll) {
      columns.forEach((item) => {
        if (item.noSorter) {
          item.sorter = false
        } else {
          item.sorter = true
        }
      })
    }
    restProps.columns = columns
    if (restProps.pagination) {
      restProps.pagination.showTotal = (total) => `共${total} 条`
      restProps.pagination.showQuickJumper = true
      restProps.pagination.showSizeChanger = true
    }
    return <Table
      {...restProps}
      className={!!className ? className : 'risk-theme-table'}
    />
  }
}
