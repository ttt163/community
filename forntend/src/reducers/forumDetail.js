/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import { FORUM_DETAIL, DEL_FORUM, DEL_COMMENT, PRAISE_FORUM, COLLECT_FORUM } from '../constants/index'

const forumDetail = (state = {forumDetail: {replyInfo: [], postInfo: {}}, delForum: {}, delComment: {}, hasPraise: {}, hasCollect: {}}, action) => {
    switch (action.type) {
        case FORUM_DETAIL:
            return Object.assign({},
                {
                    ...state,
                    forumDetail: action.forumDetailData,
                    hasPraise: {praise: action.forumDetailData.postInfo.nativeUpvote, imgList: action.forumDetailData.postInfo.upvoteList},
                    hasCollect: {collect: action.forumDetailData.postInfo.nativeFavorite}
                })
        case DEL_FORUM:
            return {...state, delForum: action.data}
        case DEL_COMMENT:
            return {...state, forumDetail: {...state.forumDetail, replyInfo: state.forumDetail.replyInfo.filter((e, i) => i !== action.index)}}
        case PRAISE_FORUM:
            return {...state, hasPraise: action.data}
        case COLLECT_FORUM:
            return {...state, hasCollect: action.data}
        default:
            return state
    }
}

export default forumDetail
