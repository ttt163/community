/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import './index.scss'
import { setLanguage } from '../../actions/index'
import { myPraise } from '../../actions/myPraise'
// import head from './img/head.png'

import { getLocalTime } from '../../public/index'

class MyPraise extends Component {
    constructor () {
        super()
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || ''
        }
    }

    createMarkup (item) {
        return {__html: item}
    }

    // 进入帖子详情
    intoTopic (index, status, forbid) {
        if (status === '0') {
            alert('此帖子已被删除')
            return false
        } else {
            hashHistory.push({ pathname: '/topicDetail', state: { postId: index, forbidComment: forbid } })
        }
    }

    componentWillMount () {
        document.title = '赞过的人'
        this.props.actions.myPraise({...this.arg, postId: this.props.location.query.postId})
    }

    render () {
        // const myPraise = this.props.myPraise ? this.props.myPraise : []
        // let items = myPraise.length === 0 ? <p className="forum_bottom">最近浏览为空</p> : myPraise.map((item, index) => {
        //     let publishTime = getTime(item.publishTime, item.requestTime)
        //     return (
        //         <div className="latest_item" key={index} onClick={() => { this.intoTopic(item.postsId, item.status, item.forbidComment) }}>
        //             <div className="title">
        //                 <span className="titleContent">{item.postsTitle}</span>
        //                 <span className="date">{publishTime}</span>
        //             </div>
        //             <p className="latest_detail" dangerouslySetInnerHTML={this.createMarkup(item.postsContent)}></p>
        //         </div>
        //     )
        // })

        let data = this.props.myPraise

        return (
            data.upvoteList ? <div className="myPraise animate-route">
                <div className="topicContent" onClick={() => { hashHistory.goBack(-1) }}>
                    <p className="title">{data.postsTitle}</p>
                    <p className="content" dangerouslySetInnerHTML={this.createMarkup(data.postsContent)}></p>
                    <i className="iconfont detail">&#xe655;</i>
                </div>
                <p className="praiseTitle">最近赞过的人</p>
                <div className="praiseContent">
                    {data.upvoteList.map((item, index) => {
                        return <div key={index} className="praiseItem">
                            <div className="personalInfo">
                                <div>
                                    <img src={item.userIcon} alt=""/>
                                </div>
                                <p className="nickName">{item.userNickname}</p>
                            </div>
                            <p className="date">{getLocalTime(item.upvoteTime)}</p>
                        </div>
                    })}
                    {/*
                     <div className="praiseItem">
                     <div className="personalInfo">
                     <div>
                     <img src={head} alt=""/>
                     </div>
                     <p className="nickName">薛之谦balabnala</p>
                     </div>
                     <p className="date">刚刚</p>
                     </div>
                     <div className="praiseItem">
                     <div className="personalInfo">
                     <div>
                     <img src={head} alt=""/>
                     </div>
                     <p className="nickName">薛之谦balabnala</p>
                     </div>
                     <p className="date">刚刚</p>
                     </div>
                     */}
                </div>
                <p className="noMore">没有更多赞了~</p>
            </div> : <div></div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectData: state.selectData,
        multiLanguage: state.multiLanguage,
        myPraise: state.myPraise
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, myPraise}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPraise)
