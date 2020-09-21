import React from 'react';
import './DragContentTable.less'
import {connect} from 'react-redux'

import { PlusOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Button, Card, Col, Input, InputNumber, message, Popconfirm, Row, Table } from 'antd';

function mapStateToProps(state) {
  return {
    selectElementKey: state.selectElementKey,
    dragRow: state.dragRow,
    formEdit: state.formEdit
  }
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber/>;
    }
    return <Input/>;
  };
  renderCell = ({getFieldDecorator}) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      required,
      children,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{margin: 0}}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: required,
                  message: `请输入 ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.PureComponent {

  constructor(props) {
    super(props);
    const value = this.props.value || [];
    let columns = this.props.columns
    if (columns[columns.length - 1] && columns[columns.length - 1].dataIndex !== "operation") {
      columns.push({
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const {editingKey} = this.state;
          const editable = this.isEditing(record);
          console.log('---disabled', this.props.disabled)
          if (this.props.disabled) {
            return null
          } else {
            return editable ? (
              <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.save(form, record.key)} style={{marginRight: 8}}>保存</a>
                )}
              </EditableContext.Consumer>
              <a onClick={() => this.cancel(record.key)}> 取消</a>
            </span>
            ) : (
              <span>
              <a disabled={editingKey !== '' || this.props.disabled}
                 onClick={() => this.edit(record.key)}> 编辑</a>&nbsp;&nbsp;
                <Popconfirm disabled={editingKey !== '' || this.props.disabled} title="确定删除操作吗?"
                            onConfirm={() => this.delete(record.key)}>
                <a disabled={editingKey !== ''}>删除</a>
              </Popconfirm>
            </span>
            );
          }
        },
      });
    }
    this.state = {
      data: value,
      editingKey: '',
      editFlag: false,
      addFlag: false,
      columns: columns
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('columns' in nextProps) {
      const columns = nextProps.columns;
      if (columns[columns.length - 1] && columns[columns.length - 1].dataIndex !== "operation") {
        columns.push({
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) => {
            const {editingKey} = this.state;
            const editable = this.isEditing(record);
            console.log('---disabled', this.props.disabled)
            if (this.props.disabled) {
              return null
            } else {
              return editable ? (
                <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.save(form, record.key)} style={{marginRight: 8}}>保存</a>
                )}
              </EditableContext.Consumer>
              <a onClick={() => this.cancel(record.key)}> 取消</a>
            </span>
              ) : (
                <span>
                  <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}> 编辑</a>&nbsp;&nbsp;
                  <Popconfirm disabled={editingKey !== ''} title="确定删除操作吗?" onConfirm={() => this.delete(record.key)}>
                    <a disabled={editingKey !== ''}>删除</a>
                  </Popconfirm>
                </span>
              )
            }
          },
        });
      }
      this.setState({columns: columns});
    }

    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({data: value});
    }
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    if (this.state.addFlag) {
      let data = this.state.data
      data.shift();
      this.setState({data: data, editingKey: '', addFlag: false});
    } else {
      this.setState({editingKey: '', addFlag: false, editFlag: false});
    }
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      row.edit = false
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      this.setState({data: newData, editingKey: '', editFlag: false, addFlag: false});
      this.triggerChange(newData);
    });
  }

  edit(key) {
    if (this.state.editFlag || this.state.addFlag) {
      message.warning('请完成新增/编辑后进行操作', 3);
    } else {
      this.setState({editingKey: key, editFlag: true});
    }
  }

  add = () => {

    let formDesignerFlag = !!window.formDesignerFlag
    if (formDesignerFlag) {
      message.warning('编辑状态不能新增', 3);
      return false
    }

    if (this.state.editFlag || this.state.addFlag) {
      message.warning('请完成新增/编辑后进行操作', 3);
    } else {
      let data = this.state.data
      let key = Math.ceil(Math.random() * 10000)
      data.unshift({key: key, edit: true})
      this.setState({data: data, editingKey: key, addFlag: true});
    }
  }

  delete(key) {
    const data = this.state.data
    const index = data.findIndex(item => key === item.key);
    data.splice(index, 1)
    this.triggerChange(data);
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    let formDesignerFlag = !!window.formDesignerFlag
    return (
      <Card style={{width: '100%'}} bordered={false} className="drag-content">
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type='primary' size="small" className="drag-content-button"
                    onClick={this.add} disabled={this.props.disabled}><PlusOutlined />新增</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <EditableContext.Provider value={this.props.form}>
              <Table
                components={components}
                bordered
                dataSource={this.state.data}
                columns={columns}
                rowClassName="editable-row"
                pagination={false}
              />
            </EditableContext.Provider>
          </Col>
        </Row>
      </Card>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default connect(mapStateToProps)(EditableFormTable);
