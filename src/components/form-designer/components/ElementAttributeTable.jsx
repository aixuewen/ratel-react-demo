import React from 'react';
import './ElementAttributeTable.less'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Switch, Table } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: true,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    console.log(9)
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      // this.toggleEdit();
      handleSave({...record, ...values});
    });
  };

  renderCell = form => {
    this.form = form;
    const {children, dataIndex, record, title, colDataRequired} = this.props;
    const {editing} = this.state;

    let renderSub = () => {
      if (dataIndex === 'colDataRequired') {
        console.log(record, record[dataIndex])
        return (
          <Form.Item style={{margin: 0, textAlign: "center"}} className="col-data-required">
            {form.getFieldDecorator(dataIndex, {
              initialValue: true,
            })(<Switch ref={node => (this.input = node)} onChange={this.save}/>)}
          </Form.Item>
        )
      } else {
        return (
          <Form.Item style={{margin: 0}}>
            {form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入${title}.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
          </Form.Item>
        )
      }
    }

    return editing ? (
      renderSub()
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{paddingRight: 24}}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class ElementAttributeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.value
    };
    this.columns = [
      {
        title: '列名',
        dataIndex: 'colName',
        ellipsis: true,
        editable: true,
      },
      // {
      //   title: '数据类型',
      //   dataIndex: 'colDataType',
      //   ellipsis: true,
      //   editable: true,
      // },
      // {
      //   title: '是否必填',
      //   width: 100,
      //   align: 'center',
      //   dataIndex: 'colDataRequired',
      //   ellipsis: true,
      //   editable: true,
      // },
      {
        title: '操作',
        width: 50,
        align: 'center',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length > 1 ? (
            <div>
              <a onClick={() => this.handleDelete(record.key)}> <MinusCircleOutlined /></a>
              <a onClick={() => this.handleAdd(record.key)}> <PlusCircleOutlined /></a>
            </div>
          ) : (
            <div>
              <a onClick={() => this.handleAdd(record.key)}> <PlusCircleOutlined /></a>
            </div>
          ),
      },
    ];
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({dataSource: value});
    }
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    let data = dataSource.filter(item => item.key !== key)
    this.setState({dataSource: data});
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(data);
    }
  };

  handleAdd = key => {
    const {dataSource} = this.state;
    const row = {
      key: Math.ceil(Math.random() * 10000000),
    };
    const newData = dataSource;
    const index = newData.findIndex(item => key === item.key);
    newData.splice(index + 1, 0, row);
    this.setState({
      dataSource: newData
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({dataSource: newData});
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(newData);
    }
  };

  render() {
    const {dataSource} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          size="small"
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.dataSource}
          pagination={false}
          columns={columns}
        />
      </div>
    );
  }
}

// const EditTableAttribute = Form.create()(TableAttribute);

export default ElementAttributeTable;
