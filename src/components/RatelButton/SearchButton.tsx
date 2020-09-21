import * as React from 'react';
import {Button} from "antd";
import {RatelButtonProps} from "./props/ButtonProps";

const SearchButton: React.FC<RatelButtonProps> = props => (
  <Button type="primary" icon={<i className="fa fa-plus" style={{marginRight: 8}}/>}
          className={props.noMargin ? '' : 'margin-right-10'}
          onClick={props.onClick}> {props.label || '查询'} </Button>
);

export default SearchButton;
