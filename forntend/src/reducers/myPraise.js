/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { MY_PRAISE } from '../constants/index'

const myPraise = (state = [], action) => {
    switch (action.type) {
        case MY_PRAISE:
            return action.myPraiseData
        default:
            return state
    }
}

export default myPraise
