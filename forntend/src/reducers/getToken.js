/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { TOKEN } from '../constants/index'

const tokenGet = (state = {token: ''}, action) => {
    switch (action.type) {
        case TOKEN:
            return action.tokenData
        default:
            return state
    }
}

export default tokenGet
