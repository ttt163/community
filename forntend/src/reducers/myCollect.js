/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { MY_COLLECT } from '../constants/index'

const myCollect = (state = [], action) => {
    switch (action.type) {
        case MY_COLLECT:
            return action.myCollectData
        default:
            return state
    }
}

export default myCollect
