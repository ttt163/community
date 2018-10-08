/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { PUBLISH_TOPIC, UPLOAD_IMG, DELETE_IMG, CLEAR } from '../constants/index'

const publishTopic = (state = {publish: {}, imgInfo: []}, action) => {
    switch (action.type) {
        case PUBLISH_TOPIC:
            return {...state, publish: action.actionData}
        case UPLOAD_IMG:
            return {...state, imgInfo: [...state.imgInfo, action.imgInfo]}
        case DELETE_IMG:
            return {...state, imgInfo: [...state.imgInfo].filter((e, i) => i !== action.index)}
        case CLEAR:
            return {publish: {}, imgInfo: []}
        default:
            return state
    }
}

export default publishTopic
