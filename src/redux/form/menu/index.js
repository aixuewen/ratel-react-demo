import {INCREMENT} from '@/redux/constants/example'

const initialState = {
  menu: []
}

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return action.value
    default:
      return state
  }
}
