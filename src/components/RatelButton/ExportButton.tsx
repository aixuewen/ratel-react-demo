import * as React from 'react';
import {Button} from "antd";
import {RatelButtonProps} from "./props/ButtonProps";

const ExportButton: React.FC<RatelButtonProps> = props => (
  <Button type="primary" icon={<i className="fa fa-download" style={{marginRight: 8}}/>}
          className={'button-color-cyan ' + (props.noMargin ? '' : 'margin-right-10')}
          onClick={props.onClick}> {props.label || '导出'} </Button>
);

export default ExportButton;
