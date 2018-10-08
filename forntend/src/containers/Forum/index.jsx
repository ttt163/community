/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import md5 from 'blueimp-md5'
// 引入国际化
// import { FormattedMessage } from 'react-intl'

import FullImage from '../../components/FullImage'

import gameLogo from './img/gameLogo.png'
import head from './img/ic_launcher.png'
// import articleImg from './img/article_img.png'

import './index.scss'
import { setLanguage, visitorGetToken, loginShow, wxSign, international } from '../../actions/index'
import { forumGet } from '../../actions/forum'
import { selectDataGet } from '../../actions/selectData'
import { getTime } from '../../public/index'

class Forum extends Component {
    constructor () {
        super()
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || ''
        }

        this.shareData = {
            title: '蓝港游戏社区首页分享',
            link: 'http://wxact.8864.com/#/?appId=1002',
            imgUrl: 'http://i3.shouyou.itc.cn/app/uploads/2016/07/14691635256508.jpg',
            desc: '梦为努力浇了水 爱在背后往前推  当我抬起头才发觉 我是不是忘了谁   累到整夜不能睡 夜色哪里都是美  一定有个他 躲过 避过 闪过 瞒过  他是谁 他是谁'
        }
    }
    componentWillMount () {
        this.props.actions.international()

        let visitorAppId = this.props.location.query.appId
        if (visitorAppId) {
            $.fn.cookie('appId', visitorAppId)
            this.arg.appId = visitorAppId
        }

        if (!$.fn.cookie('login')) {
            let visitorAppId = this.props.location.query.appId || $.fn.cookie('appId')
            $.fn.cookie('appId', visitorAppId)
            let visitorName = $.fn.cookie('userName') ? $.fn.cookie('userName') : 'test_' + Math.random().toString(16).substr(8)
            let visitorSign = md5(visitorAppId + visitorName)
            let visitorInfo = {
                appId: visitorAppId,
                userName: visitorName,
                sign: visitorSign
            }
            this.props.actions.visitorGetToken(visitorInfo, (tokenData) => {
                this.props.actions.forumGet({...visitorInfo, token: tokenData}, (appInfo) => {
                    let shareData = {
                        title: `游戏社区——${appInfo.appName}`,
                        link: `http://wxact.8864.com/#/?appId=${appInfo.appId}`,
                        imgUrl: appInfo.appIcon,
                        desc: `快来跟小伙伴一起发帖交流吧~`
                    }
                    this.props.actions.wxSign({...visitorInfo, token: tokenData, url: window.location.href.split('#')[0]}, shareData)
                })
            })
        } else {
            this.props.actions.forumGet(this.arg, (appInfo) => {
                let shareData = {
                    title: `游戏社区——${appInfo.appName}`,
                    link: `http://wxact.8864.com/#/?appId=${appInfo.appId}`,
                    imgUrl: appInfo.appIcon,
                    desc: `快来跟小伙伴一起发帖交流吧~`
                }
                this.props.actions.wxSign({...this.arg, url: window.location.href.split('#')[0]}, shareData)
            })
        }
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

    // 发表新帖子
    publishTopic (e) {
        e.preventDefault()
        e.stopPropagation()
        if ($.fn.cookie('login')) {
            hashHistory.push('/publishTopic')
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/')
        }
    }

    // 进入我的帖子页面
    intoMyTopic () {
        if ($.fn.cookie('login')) {
            hashHistory.push('/myTopic')
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/login')
        }
    }

    logOut () {
        $.fn.cookie('login', null)
        hashHistory.push('/')
    }

    createMarkup (item) {
        let format = /<[^>]+>/g
        let pureItem = item.replace(format, '')
        // return decodeURI(pureItem)
        return {__html: pureItem}
    }

    render () {
        console.log(this.props.multiLanguage.value)
        let { forumData } = this.props

        let top = forumData.toplist ? forumData.toplist : []
        let topItem = top.length === 0 ? '' : top.map((item, index) => {
            let publishTime = getTime(item.updateTime, item.requestTime)
            return (
                <div className="item animate-route" key={index} onClick={() => { this.intoTopic(item.postsId, item.status) }}>
                    <div className="author">
                        <div className="img_p"><img src={item.userIcon || head} alt=""/></div>
                        <div className="author_info">
                            <p className="name">{item ? item.userNickname : '昵称'}</p>
                            <p className="date">{publishTime}</p>
                        </div>
                    </div>
                    <div className="article">
                        <span className="highest">置顶</span>
                        <div className="article_content">
                            {/* <p className="title">{this.rr(item.postsTitle)}</p> */}
                            <p className="title" dangerouslySetInnerHTML={this.createMarkup(item.postsTitle)}></p>
                            <p className="article_detail" dangerouslySetInnerHTML={this.createMarkup(item.postsContent)}></p>
                            {/* <p className="article_detail">{this.rr(item.postsContent)}</p> */}
                            {item.postsPictureUrl ? item.postsPictureUrl.split(',').map((i, index) => {
                                if (index <= 2) {
                                    return (
                                        <FullImage key={index} img={i}/>
                                    )
                                }
                            }) : ''}
                        </div>
                    </div>
                    <div className="communicate">
                        <p>
                            <i className="view_img iconfont"></i>
                            <span className="view_num">{item.readNum ? item.readNum : 0}</span>
                        </p>
                        <p>
                            <i className="discuss_img iconfont"></i>
                            <span className="discuss_num">{item.reviewNum ? item.reviewNum : 0}</span>
                        </p>
                        <p>
                            <i className="praise_img iconfont"></i>
                            <span className="praise_num">{item.upvoteNum ? item.upvoteNum : 0}</span>
                        </p>
                    </div>
                </div>
            )
        })

        let forum = forumData.normallist ? forumData.normallist : []
        let forumItem = forum.length === 0 ? '' : forum.map((item, index) => {
            let publishTime = getTime(item.updateTime, item.requestTime)
            return (
                <div className="item" key={index} onClick={() => { this.intoTopic(item.postsId, status) }}>
                    <div className="author">
                        <div className="img_p"><img src={item.userIcon || head} alt=""/></div>
                        <div className="author_info">
                            <p className="name">{item ? item.userNickname : '昵称'}</p>
                            <p className="date">{publishTime}</p>
                        </div>
                    </div>
                    <div className="article">
                        {/*
                         {parseInt(item.isTop) === 0 ? '' : <span className="highest">置顶</span>}
                         */}
                        <div className="article_content">
                            {/* <p className="title">{this.rr(item.postsTitle)}</p> */}
                            <p className="title" dangerouslySetInnerHTML={this.createMarkup(item.postsTitle)}></p>
                            <p className="article_detail" dangerouslySetInnerHTML={this.createMarkup(item.postsContent)}></p>
                            {/* <p className="article_detail">{this.rr(item.postsContent)}</p> */}
                            {item.postsPictureUrl ? item.postsPictureUrl.split(',').map((i, index) => {
                                if (index <= 2) {
                                    return (
                                        <FullImage key={index} img={i}/>
                                    )
                                }
                            }) : ''}
                        </div>
                    </div>
                    <div className="communicate">
                        <p>
                            <i className="view_img iconfont"></i>
                            <span className="view_num">{item.readNum ? item.readNum : 0}</span>
                        </p>
                        <p>
                            <i className="discuss_img iconfont"></i>
                            <span className="discuss_num">{item.reviewNum ? item.reviewNum : 0}</span>
                        </p>
                        <p>
                            <i className="praise_img iconfont"></i>
                            <span className="praise_num">{item.upvoteNum ? item.upvoteNum : 0}</span>
                        </p>
                    </div>
                </div>
            )
        })
        return (
            <div className="forum clearfix">
                <div className="write_button" onClick={(e) => { this.publishTopic(e) }}></div>
                <div className="logo_title">
                    <img src={forumData.appinfo ? forumData.appinfo.appIcon : gameLogo} alt=""/>
                    <div className="info">
                        <span className="game_name">{forumData.appinfo ? forumData.appinfo.appName : '游戏名'}</span>
                        <p>
                            {/* <FormattedMessage id='forum' description='say hello to Howard.' defaultMessage='Hello, Howard'/> */}
                            <span>话题数 </span>
                            <span> {forumData.postsTotal}</span>
                        </p>
                    </div>
                    {$.fn.cookie('login') ? <span className="logOut" onClick={() => { this.logOut() }}>注销</span> : ''}
                    <span className="my_topic" onClick={() => { this.intoMyTopic() }}>我的话题</span>
                </div>
                <div className="forum_content">
                    {topItem}
                    {forumItem}
                    {/*
                    <div className="item">
                        <div className="author">
                            <div className="img_p"><img src={head} alt=""/></div>
                            <div className="author_info">
                                <p className="name">薛之谦</p>
                                <p className="date">1 分钟前</p>
                            </div>
                        </div>
                        <div className="article" onClick={() => { this.intoTopic() }}>
                            <span className="highest">置顶</span>
                            <div className="article_content">
                                <p className="title">黎明之光版《楚乔传》，赵丽颖化身荆轲逆袭成王</p>
                                <p className="article_detail">
                                    精彩不错过喜欢就给点个错过喜欢就给点个错过喜欢就给点个赞吧，点赞的排位 66连胜，能打出凹凸二字，都是大神哦～
                                </p>
                                <img src={articleImg} alt=""/>
                                <img src={articleImg} alt=""/>
                            </div>
                        </div>
                        <div className="communicate">
                            <p>
                                <i className="view_img iconfont"></i>
                                <span className="view_num">898</span>
                            </p>
                            <p>
                                <i className="discuss_img iconfont"></i>
                                <span className="discuss_num">7898554</span>
                            </p>
                            <p>
                                <i className="praise_img iconfont active"></i>
                                <span className="praise_num">52465</span>
                            </p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="author">
                            <div className="img_p"><img src={head} alt=""/></div>
                            <div className="author_info">
                                <p className="name">薛之谦</p>
                                <p className="date">1 分钟前</p>
                            </div>
                        </div>
                        <div className="article" onClick={() => { this.intoTopic() }}>
                            <span className="highest">置顶</span>
                            <div className="article_content">
                                <p className="title">黎明之光版《楚乔传》，赵丽颖化身荆轲逆袭成王</p>
                                <p className="article_detail">
                                    精彩不错过喜欢就给点个错过喜欢就给点个错过喜欢就给点个赞吧，点赞的排位 66连胜，能打出凹凸二字，都是大神哦～
                                </p>
                                <img src={articleImg} alt=""/>
                                <img src={articleImg} alt=""/>
                                <img src={articleImg} alt=""/>
                            </div>
                        </div>
                        <div className="communicate">
                            <p>
                                <i className="view_img iconfont"></i>
                                <span className="view_num">898</span>
                            </p>
                            <p>
                                <i className="discuss_img iconfont"></i>
                                <span className="discuss_num">7898554</span>
                            </p>
                            <p>
                                <i className="praise_img iconfont"></i>
                                <span className="praise_num">52465</span>
                            </p>
                        </div>
                    </div>
                    <div className="item">
                        <div className="author">
                            <div className="img_p"><img src={head} alt=""/></div>
                            <div className="author_info">
                                <p className="name">薛之谦</p>
                                <p className="date">1 分钟前</p>
                            </div>
                        </div>
                        <div className="article" onClick={() => { this.intoTopic() }}>
                            <span className="highest">置顶</span>
                            <div className="article_content">
                                <p className="title">黎明之光版《楚乔传》，赵丽颖化身荆轲逆袭成王</p>
                                <p className="article_detail">
                                    精彩不错过喜欢就给点个错过喜欢就给点个错过喜欢就给点个赞吧，点赞的排位 66连胜，能打出凹凸二字，都是大神哦～
                                </p>
                                <img src={articleImg} alt=""/>
                                <img src={articleImg} alt=""/>
                                <img src={articleImg} alt=""/>
                            </div>
                        </div>
                        <div className="communicate">
                            <p>
                                <i className="view_img iconfont"></i>
                                <span className="view_num">898</span>
                            </p>
                            <p>
                                <i className="discuss_img iconfont"></i>
                                <span className="discuss_num">7898554</span>
                            </p>
                            <p>
                                <i className="praise_img iconfont"></i>
                                <span className="praise_num">52465</span>
                            </p>
                        </div>
                    </div>
                     */}
                </div>
                <p className="forum_bottom">
                    {forum.length === 0 ? '暂时没有数据啊~' : '别再拉了，下面啥都没有了'}
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage,
        token: state.tokenGet,
        forumData: state.forumGet,
        selectData: state.selectData,
        wxSignData: state.wxSign
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ setLanguage, visitorGetToken, forumGet, selectDataGet, loginShow, wxSign, international }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Forum)
