import * as React from 'react';
import {RatelButtonProps} from './props/ButtonProps'

const HrefEditButton: React.FC<RatelButtonProps> = props => (
  <a href='javascript:;' className='text-color-green' onClick={props.onClick}><i
    className="fa fa-edit"/> {props.label || ''}</a>
);

export default HrefEditButton;
