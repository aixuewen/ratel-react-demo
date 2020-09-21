import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'antd'
import './CommonTable.less'
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';


const SortableContainer = sortableContainer(props => <tbody {...props} />);

export default class SortableTable extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    noSorterAll: PropTypes.bool,
    onSortEnd: PropTypes.any,
    draggableBodyRow: PropTypes.any,
    pagination: PropTypes.any,
  }

  render() {
    const {
      columns,
      onSortEnd,
      draggableBodyRow,
      ...restProps
    } = this.props
    restProps.columns = columns
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        {...props}
      />
    );

    return (
      <Table
        pagination={false}
        {...restProps}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: draggableBodyRow,
          },
        }}
      />
    );
  }
}
