import React from 'react'
import {addApi} from '../../../services/tools/code'
import {RatelPage} from "@/components";

class Index extends React.Component {
  state = {
    value: null
  }
  submitForm(values) {
    values.content = values.content.toHTML()
    let file = values.sImg[0].response
    values.listImg = file.content.attrPath
    addApi(values, () => {
    })
  }

  render() {

    const code = `function add(a, b) {
        return a + b;
      }`;
    return (
      <RatelPage className='page' inner>
        <div className='bonc-mung-user-list'>
          dd
        </div>
      </RatelPage>
    )
  }
}

export default Index
