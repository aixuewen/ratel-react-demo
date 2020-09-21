import * as React from 'react';
import {Button} from "antd";

import {RatelButtonProps} from './props/ButtonProps'

const AddButton: React.FC<RatelButtonProps> = props => (
  <Button type="primary" icon={<i className="fa fa-plus" style={{marginRight: 8}}/>}
          className={'button-color-sunset ' + (props.noMargin ? '' : 'margin-right-10')}
          onClick={props.onClick}> {props.label || '新增'} </Button>
);

export default AddButton;
