/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { FORUM, INTO_FORUM } from '../constants/index'

const forumGet = (state = {}, action) => {
    switch (action.type) {
        case FORUM:
            return action.forumData
        case INTO_FORUM:
            return action.forumDetail
        default:
            return state
    }
}

export default forumGet
