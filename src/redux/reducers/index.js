import counter from './example'
import showNewPlate from './showNewPlate'
import showNewBuild from './showNewBuild'
import page from './page'
import menuReducer from './menu'
import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let rootReducer = combineReducers({
  counter, showNewPlate, showNewBuild, page, menuReducer
})

export default persistReducer({
  key: 'root',
  storage,
  whitelist: ['counter'] // only navigation will be persisted
}, rootReducer)

