import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import PrimaryLayout from './PrimaryLayout'

class BaseLayout extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let Component = PrimaryLayout
    return (
      <Component childRoutes={(this.props.route || {}).childRoutes}/>
    )
  }
}

BaseLayout.propTypes = {
  route: PropTypes.object
}
export default BaseLayout
