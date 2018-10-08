/**
 * Author：zhoushuanglong
 * Time：2017/8/15
 * Description：multi language
 */

import { SETLANGUAGE, INTER } from '../constants/index'

const multiLanguage = (state = {}, action) => {
    switch (action.type) {
        case SETLANGUAGE:
            return action.language
        case INTER:
            return action.data
        default:
            return state
    }
}

export default multiLanguage
