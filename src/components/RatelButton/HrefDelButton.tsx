import * as React from 'react';
import {Popconfirm} from "antd";
import {RatelButtonProps} from './props/ButtonProps'

const HrefDelButton: React.FC<RatelButtonProps> = props => (
  <Popconfirm title={props.confirmMsg || "确认删除?"} onConfirm={props.onConfirm}>
    <a href='javascript:;' className='text-color-dust'><i className="fa fa-close"/> {props.label || ''}</a>
  </Popconfirm>
);

export default HrefDelButton;
