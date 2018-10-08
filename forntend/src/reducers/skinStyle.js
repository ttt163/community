/**
 * Author：zhoushuanglong
 * Time：2017-09-25 01:07
 * Description：skin style
 */

import { SETSKIN } from '../constants/index'
import skinConfig from '../public/skinConfig'

const skinStyle = (state = skinConfig.white, action) => {
    switch (action.type) {
        case SETSKIN:
            return skinConfig[action.styleName]
        default:
            return state
    }
}

export default skinStyle
