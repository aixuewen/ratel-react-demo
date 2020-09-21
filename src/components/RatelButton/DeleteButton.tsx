import * as React from 'react';
import {Button} from "antd";
import {RatelButtonProps} from './props/ButtonProps'

const DeleteButton: React.FC<RatelButtonProps> = props => (
  <Button type="primary" icon={<i className="fa fa-close" style={{marginRight: 8}}/>} danger
          className={props.noMargin ? '' : 'margin-right-10'}
          onClick={props.onClick}> {props.label || '删除'} </Button>
);

export default DeleteButton;
