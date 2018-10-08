/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { MYTOPIC } from '../constants/index'

const myTopic = (state = {}, action) => {
    switch (action.type) {
        case MYTOPIC:
            return action.myTopic || {}
        default:
            return state
    }
}

export default myTopic
