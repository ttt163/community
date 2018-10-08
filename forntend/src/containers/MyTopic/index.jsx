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
import { myTopic } from '../../actions/myTopic'

import { getTime } from '../../public/index'

import head from './img/ic_launcher.png'

class MyTopic extends Component {
    constructor () {
        super()
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || ''
        }
        this.state = {
            index: 0
        }
    }
    componentWillMount () {
        document.title = '个人中心'
        let arg = {...this.arg, userNickName: $.fn.cookie('userName')}
        this.props.actions.myTopic(arg)
    }

    latestView () {
        hashHistory.push('/latestView')
    }

    myCollect () {
        hashHistory.push('/myCollect')
    }

    handleNav (e, index) {
        this.setState({
            index: index
        })
    }

    // 进入帖子详情
    intoTopic (index, status) {
        if (status === '0') {
            alert('此帖子已被删除')
            return false
        } else {
            hashHistory.push({
                pathname: '/topicDetail',
                state: { postId: index },
                query: {
                    appId: 1002,
                    postId: index
                }
            })
        }
    }

    // 进入信息修改页面
    intoSetPersonal () {
        hashHistory.push({
            pathname: '/editInfo'
        })
    }

    render () {
        let navIndex = this.state.index
        let { myTopicData } = this.props
        let myTopicItems = !myTopicData.postInfoMap || myTopicData.postInfoMap.length === 0 ? <p className="forum_bottom">暂时没有话题</p> : myTopicData.postInfoMap.map((item, index) => {
            let publishTime = getTime(item.publishTime, item.requestTime)
            return (
                <div className="latest_item" key={index} onClick={() => { this.intoTopic(item.postsId, item.status) }}>
                    <p className="title">{item.postsTitle}</p>
                    <p className="latest_detail">{item.postsContent}</p>
                    <p className="date">{publishTime}</p>
                </div>
            )
        })

        let myReplyItems = !myTopicData.replyInfoMap || myTopicData.replyInfoMap.length === 0 ? <p className="forum_bottom">暂时没有回复</p> : myTopicData.replyInfoMap.map((item, index) => {
            let publishTime = getTime(item.replyTime, item.requestTime)
            return (
                <div className="latest_item" key={index} onClick={() => { this.intoTopic(item.postId, item.status) }}>
                    <p className="title">{item.postTitle}</p>
                    <p className="latest_detail">{item.replyContent}</p>
                    <p className="date">{publishTime}</p>
                </div>
            )
        })

        let myPraiseItems = !myTopicData.upvoteInfoMap || myTopicData.upvoteInfoMap.length === 0 ? <p className="forum_bottom">暂时没有赞过</p> : myTopicData.upvoteInfoMap.map((item, index) => {
            let publishTime = getTime(item.upvoteTime, item.requestTime)
            return (
                <div className="latest_item" key={index} onClick={() => { this.intoTopic(item.postsId, item.status) }}>
                    <p className="title">{item.postsTitle}</p>
                    <p className="latest_detail">{item.postsContent}</p>
                    <p className="date">{publishTime}</p>
                </div>
            )
        })

        let currentContent = ''

        if (navIndex === 0) {
            currentContent = myTopicItems
        } else if (navIndex === 1) {
            currentContent = myReplyItems
        } else {
            currentContent = myPraiseItems
        }

        return (
            <div className="myTopic animate-route">
                <div className="topicContent">
                    <div className="item">
                        <img className="update_info" onClick={() => { this.intoSetPersonal() }} src={require('./img/update_button.png')} alt=""/>
                        <div className="personal_info">
                            <div className="img_p"><img src={myTopicData.userInfo && myTopicData.userInfo.icon ? myTopicData.userInfo.icon : head} alt=""/></div>
                            <div className="nameAngGender">
                                <p className="name">{myTopicData.userInfo && myTopicData.userInfo.nickName ? myTopicData.userInfo.nickName : '昵称'}</p>
                                {myTopicData.userInfo && myTopicData.userInfo.userSex === '1' ? <i className="iconfont gender_male">&#xe621;</i> : <i className="iconfont gender_female">&#xe66b;</i>}
                            </div>
                        </div>
                        <div className="myGain">
                            <p className="readGain">
                                <span>获得的阅读</span>
                                <span>{myTopicData.readReceiveNum || 0}</span>
                            </p>
                            <p className="replyGain">
                                <span>获得的回复</span>
                                <span>{myTopicData.replyNum || 0}</span>
                            </p>
                            <p className="praiseGain">
                                <span>获得的赞</span>
                                <span>{myTopicData.upvoteReceiveNum || 0}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="latestView" onClick={() => { this.latestView() }}>
                    <span>最近浏览</span>
                    <i className="latestView_i iconfont">&#xe655;</i>
                </div>
                <div className="myCollect" onClick={() => { this.myCollect() }}>
                    <span>我的收藏</span>
                    <i className="myCollect_i iconfont">&#xe655;</i>
                </div>
                <div className="discussContent">
                    <div className="latest_title">
                        {['我的话题', '我的回复', '我赞过'].map((item, index) => {
                            let active = index === navIndex ? 'active' : ''
                            return (
                                <p className={active} onClick={(e) => { this.handleNav(e, index) }} key={index}><span>{item}</span></p>
                            )
                        })}
                        {/*
                        <p><span>我的赞</span></p>
                        */}
                    </div>
                    {/*
                    <div className="latest_item">
                        <p className="title">黎明之光</p>
                        <p className="latest_detail">这是个什么鬼, 哈哈哈</p>
                        <p className="date">1 分钟前</p>
                    </div>
                    <div className="latest_item">
                        <p className="title">王者之剑</p>
                        <p className="latest_detail">这是个什阿斯蒂芬阿斯蒂芬阿斯蒂芬放阿斯顿发斯蒂芬么鬼, 哈哈哈</p>
                        <p className="date">1 分钟前</p>
                    </div>
                     */}
                    {currentContent}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage,
        myTopicData: state.myTopic
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, myTopic}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTopic)
