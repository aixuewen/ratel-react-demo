import * as React from 'react';
import {RatelButtonProps} from './props/ButtonProps'

const HrefViewButton: React.FC<RatelButtonProps> = props => (
  <a href='javascript:;' onClick={props.onClick}><i className="fa fa-eye"/> {props.label || ''}</a>
);

export default HrefViewButton;
