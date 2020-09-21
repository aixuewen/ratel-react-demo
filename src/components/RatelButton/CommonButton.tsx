import * as React from 'react';
import {Button} from "antd";
import {RatelButtonProps} from "./props/ButtonProps";

const CommonButton: React.FC<RatelButtonProps> = props => (
  <Button type="primary" icon={<i className={"fa fa-" + props.icon} style={{marginRight: 8}}/>}
          className={'button-color-green ' + (props.noMargin ? '' : 'margin-right-10')}
          onClick={props.onClick} disabled={!!props.disabled}> {props.label || '编辑'} </Button>
);

export default CommonButton;
