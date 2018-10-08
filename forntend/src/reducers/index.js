/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root reducer
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import loginInfo from './loginInfo'
import multiLanguage from './multiLanguage'
import skinStyle from './skinStyle'
import forumGet from './forum'
import tokenGet from './getToken'
import publishTopic from './publishTopic'
import selectData from './selectData'
import myTopic from './myTopic'
import forumDetail from './forumDetail'
import publishComment from './publishComment'
import latestView from './latestView'
import myCollect from './myCollect'
import myPraise from './myPraise'
import wxSign from './wxSign'
import editInfo from './editInfo'

const reducers = Object.assign({
    loginInfo,
    multiLanguage,
    skinStyle,
    forumGet,
    tokenGet,
    publishTopic,
    selectData,
    myTopic,
    forumDetail,
    publishComment,
    latestView,
    myCollect,
    wxSign,
    myPraise,
    editInfo,
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer
