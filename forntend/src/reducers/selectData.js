/**
 * Author：zhoushuanglong
 * Time：2017/8/18
 * Description：goods list
 */
import {
    SELECTDATA
} from '../constants/index'

const selectData = (state = {}, action) => {
    switch (action.type) {
        case SELECTDATA:
            return action.selectData

        default:
            return state
    }
}

export default selectData
