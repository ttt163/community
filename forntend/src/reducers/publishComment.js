/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { PUBLISH_COMMENT, COMMENT_UPIMG, COMMENT_DELIMG, CLEAR } from '../constants/index'

const publishComment = (state = {publish: {}, imgInfo: []}, action) => {
    switch (action.type) {
        case PUBLISH_COMMENT:
            return {...state, publish: action.actionData}
        case COMMENT_UPIMG:
            return {...state, imgInfo: [...state.imgInfo, action.imgInfo]}
        case COMMENT_DELIMG:
            return {...state, imgInfo: [...state.imgInfo].filter((e, i) => i !== action.index)}
        case CLEAR:
            return {publish: {}, imgInfo: []}
        default:
            return state
    }
}

export default publishComment
