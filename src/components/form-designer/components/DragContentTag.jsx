import React from 'react';
import './DragContentTag.less'
import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip } from 'antd';


class DragContentTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.value ? props.value : [],
      inputVisible: false,
      inputValue: '',
      colorList: ['#f50', '#2db7f5', '#87d068', '#108ee9', '#712ed1', '#fa541c', '#22c4c4', '#fd875e', '#9fd90f', '#4061ed']
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      value ? this.setState({tags: value}) : null
    }
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({tags});
    this.triggerChange(tags)
  };

  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({inputValue: e.target.value});
  };

  handleInputConfirm = () => {
    const {inputValue} = this.state;
    let {tags} = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    this.triggerChange(tags)
  };

  saveInputRef = input => (this.input = input);

  getRandomColor = (index) => {

    if (index > this.state.colorList.length - 1) {
      return this.state.colorList[this.state.colorList.length - 1]
    } else {
      return this.state.colorList[index]
    }
  }

  getCloasable = () => {
    if (this.props.closable || !this.props.disabled) {
      return true
    } else {
      return false
    }

  }

  render() {
    const {tags, inputVisible, inputValue} = this.state;
    return (
      <div>
        {tags ? tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag color={this.getRandomColor(index)} key={tag} closable={this.getCloasable()}
                 onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        }) : null}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{width: 78}}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && this.getCloasable() && (
          <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
            <PlusOutlined /> 新建
          </Tag>
        )}
      </div>
    );
  }
}

// const EditTableAttribute = Form.create()(TableAttribute);

export default DragContentTag;
