import {
    UP_NEW_PLATE_LAYOUT_SHOW,
    TOGGLE_LAYOUT_CONFIG_VISIBLE
  } from '@/redux/constants/ActionTypes'
  const initialState = {
    newPlateLayoutShow: '',
    layoutConfigVisible:false
  }

  export default function showNewPlate(state = initialState, action) {
    switch (action.type) {
      case UP_NEW_PLATE_LAYOUT_SHOW:
        return { ...state,
          newPlateLayoutShow: action.data
        }
      case TOGGLE_LAYOUT_CONFIG_VISIBLE:
        return { ...state,
          layoutConfigVisible: !state.layoutConfigVisible
        }
      default:
        return state
    }
  }
