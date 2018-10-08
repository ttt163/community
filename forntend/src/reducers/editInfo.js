/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { PERSONAL_INFO, EDITINFO_UPIMG, EDITINFO_UPLOADIMG, EDITINFO_UPNICK, EDITINFO_UPGENDER } from '../constants/index'

const editInfo = (state = {res: {}, personalInfo: {}, imgInfo: ''}, action) => {
    switch (action.type) {
        case EDITINFO_UPIMG:
            return {...state, res: action.data}
        case EDITINFO_UPLOADIMG:
            return {...state, imgInfo: action.imgInfo}
        case EDITINFO_UPNICK:
            return {...state, res: action.data}
        case EDITINFO_UPGENDER:
            return {...state, res: action.data}
        case PERSONAL_INFO:
            return {...state, personalInfo: action.data}
        default:
            return state
    }
}

export default editInfo
