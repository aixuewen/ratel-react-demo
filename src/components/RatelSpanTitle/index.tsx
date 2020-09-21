import * as React from 'react';
import {Typography} from 'antd';
import "./index.less"

const {Title} = Typography;

export interface RatelSpanTitleProps {
  label?: string;
}

const RatelSpanTitle: React.FC<RatelSpanTitleProps> = props => (
  <div className="ratel-span-label"><Title level={3}>{props.label}</Title></div>
);

export default RatelSpanTitle;
