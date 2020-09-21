import {INCREMENT} from '@/redux/constants/example'

const initialState = {
  menu: []
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {menu: state.menu}
    default:
      return state
  }
}
