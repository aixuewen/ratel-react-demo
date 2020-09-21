import * as React from 'react';
import "./index.less"

export interface RatelItemProps {
  label?: string;
  content?: React.ReactNode;
  style?: React.CSSProperties;
  labelWith: number
}


const RatelItem: React.FC<RatelItemProps> = props => (
  <div className="ratel-item">
    {props.label ? <div className="ratel-item-label"
                        style={{width: (props.labelWith ? props.labelWith : 25) + '%'}}>{props.label}</div> : null}
    {props.content ? <div className="ratel-item-content"
                          style={{width: (props.labelWith ? 100 - props.labelWith : 75) + '%'}}>{props.content}</div> : null}
  </div>
);

export default RatelItem;
