import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import {Breadcrumb} from "antd";
import './AntdBreadcrumb.less'
import {Link} from 'react-router-dom'

import breadcrumb from "../../assets/breadcrumb";

// map & render your breadcrumb components however you want.
const Breadcrumbs = ({breadcrumbs}) => (
  <div style={{marginBottom: 10}}>
    <Breadcrumb>
      {breadcrumbs.map((item, index) => {
        console.log(item)
        console.log(index)
      })}
      {breadcrumbs.map(({
                          match,
                          breadcrumb,
                          location,
                          unLink,
                          // other props are available during render, such as `location` 
                          // and any props found in your route objects will be passed through too
                        }) => (
          <Breadcrumb.Item key={match.url}>
            {unLink
              ? <span> {breadcrumb}</span> : <Link to={match.url}>
                {breadcrumb}
              </Link>
            }
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  </div>
);

export default withBreadcrumbs(breadcrumb)(Breadcrumbs);
