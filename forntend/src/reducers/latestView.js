/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { LATESTVIEW } from '../constants/index'

const latestView = (state = [], action) => {
    switch (action.type) {
        case LATESTVIEW:
            return action.latestViewData
        default:
            return state
    }
}

export default latestView
