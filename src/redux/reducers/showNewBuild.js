import {
    UP_NEW_PLATE_BUILD_SHOW
  } from '@/redux/constants/ActionTypes'
  const initialState = {
    layoutSettingState: 'close'
  }

  export default function showNewBuild(state = initialState, action) {
    switch (action.type) {
      case UP_NEW_PLATE_BUILD_SHOW:
        return { ...state,
          layoutSettingState: action.data
        }
      default:
        return state
    }
  }
