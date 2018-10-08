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

import './index.scss'
import { setLanguage, loginShow, visitorGetToken, wxSign } from '../../actions/index'
import { forumDetail, delComment, delForum, praiseForum, collectForum } from '../../actions/forumDetail'
import { selectDataGet } from '../../actions/selectData'
import { getTime, getLocalTime, pureContent, isWeixin } from '../../public/index'
import FullImage from '../../components/FullImage'
import Login from '../../containers/Login'

import head from './img/ic_launcher.png'
import preCollect from './img/preCollect.png'
import collected from './img/coleected.png'
import praised from './img/praised.png'
import prePraise from './img/prePraise.png'
import tips from './img/tips.png'
// import headImg from './img/headImg.png'
// import articleImg from './img/article_img.png'

class TopicDetail extends Component {
    constructor () {
        super()
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || '',
            userNickName: $.fn.cookie('nickName') || ''
        }
        this.state = {
            share: false,
            hasCollect: false,
            hasPraise: false
        }
    }
    componentWillMount () {
        document.title = '话题详情'

        if (this.props.location.query.share) {
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
                    this.props.actions.forumDetail({...visitorInfo, token: tokenData, postId: this.props.location.query.postId}, (postInfo) => {
                        let shareData = {
                            title: postInfo.postsTitle,
                            link: `http://wxact.8864.com/#/topicDetail?appId=${this.arg.appId}&postId=${postInfo.postsId}&share=${visitorSign}`,
                            imgUrl: $.fn.cookie('appIcon') || 'http://i3.shouyou.itc.cn/app/uploads/2016/07/14691635256508.jpg',
                            desc: pureContent(postInfo.postsContent)
                        }
                        this.props.actions.wxSign({...visitorInfo, token: tokenData, url: window.location.href.split('#')[0]}, shareData)
                    })
                })
            } else {
                this.props.actions.forumDetail({...this.arg, appId: this.props.location.query.appId, postId: this.props.location.query.postId}, (postInfo) => {
                    let shareData = {
                        title: postInfo.postsTitle,
                        link: `http://wxact.8864.com/#/topicDetail?appId=${this.arg.appId}&postId=${postInfo.postsId}&share=${this.arg.sign || 1}`,
                        imgUrl: $.fn.cookie('appIcon') || 'http://i3.shouyou.itc.cn/app/uploads/2016/07/14691635256508.jpg',
                        desc: pureContent(postInfo.postsContent)
                    }
                    this.props.actions.wxSign({...this.arg, appId: this.props.location.query.appId, url: window.location.href.split('#')[0]}, shareData)
                })
            }
        } else {
            this.props.actions.forumDetail({...this.arg, appId: this.props.location.query.appId, postId: this.props.location.query.postId}, (postInfo) => {
                let shareData = {
                    title: postInfo.postsTitle,
                    link: `http://wxact.8864.com/#/topicDetail?appId=${this.arg.appId}&postId=${postInfo.postsId}&share=${this.arg.sign || 1}`,
                    imgUrl: $.fn.cookie('appIcon') || 'http://i3.shouyou.itc.cn/app/uploads/2016/07/14691635256508.jpg',
                    desc: pureContent(postInfo.postsContent)
                }
                this.props.actions.wxSign({...this.arg, appId: this.props.location.query.appId, url: window.location.href.split('#')[0]}, shareData)
            })
        }
    }

    componentDidMount () {
        // if (window.history && window.history.pushState) {
        //     $(window).on('popstate', function () {
        //         let hashLocation = location.hash
        //         let hashSplit = hashLocation.split('#/')
        //         let hashName = hashSplit[1]
        //         if (hashName !== '') {
        //             let hash = window.location.hash
        //             if (hash === '') {
        //                 alert('後退按鈕點擊')
        //             }
        //         }
        //     })
        //     window.history.pushState({...this.props.location.state}, null, location.href)
        // }
    }

    delForum () {
        let arg = {
            appId: $.fn.cookie('appId'),
            userName: $.fn.cookie('userName'),
            sign: $.fn.cookie('sign'),
            token: $.fn.cookie('token')
        }
        this.props.actions.delForum({...arg, postId: this.props.location.query.postId})
    }

    delComment (id, superiorReplyId, index) {
        let arg = {
            appId: $.fn.cookie('appId'),
            userName: $.fn.cookie('userName'),
            sign: $.fn.cookie('sign'),
            token: $.fn.cookie('token'),
            replyId: id,
            replyIdSubject: superiorReplyId
        }
        this.props.actions.delComment({...arg, postId: this.props.location.query.postId}, index)
    }

    // 富文本转换
    createMarkup (item) {
        return {__html: item}
    }

    // 点赞函数
    handlePraise () {
        let {forumDetailData, hasPraise} = this.props
        if ($.fn.cookie('login')) {
            let arg = {
                appId: $.fn.cookie('appId'),
                userName: $.fn.cookie('userName'),
                sign: $.fn.cookie('sign'),
                token: $.fn.cookie('token'),
                userNickName: $.fn.cookie('nickName'),
                upvote: hasPraise.value ? !hasPraise.value.nativeUpvote : !forumDetailData.postInfo.nativeUpvote
            }
            this.props.actions.praiseForum({...arg, postId: this.props.location.state.postId})
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/login')
        }
    }

    // 收藏函数
    handleCollect () {
        let {forumDetailData, hasCollect} = this.props
        if ($.fn.cookie('login')) {
            let arg = {
                appId: $.fn.cookie('appId'),
                userName: $.fn.cookie('userName'),
                sign: $.fn.cookie('sign'),
                token: $.fn.cookie('token'),
                userNickName: $.fn.cookie('nickName'),
                favorite: hasCollect.value ? !hasCollect.value.nativeFavorite : !forumDetailData.postInfo.nativeFavorite
            }
            this.props.actions.collectForum({...arg, postId: this.props.location.state.postId})
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/login')
        }
    }

    // 一级评论发表
    publishComment () {
        if ($.fn.cookie('login')) {
            hashHistory.push({pathname: '/publishComment', state: {postId: this.props.location.query.postId}})
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/login')
        }
    }

    // 二级评论发表
    floorComment (replyId) {
        if ($.fn.cookie('login')) {
            hashHistory.push({pathname: '/publishComment', state: {postId: this.props.location.query.postId, replyId: replyId}})
        } else {
            alert('请登录后再进行操作~')
            this.props.actions.loginShow('block')
            // hashHistory.push('/login')
        }
    }

    // 赞过的人页面
    toMyPraise (id) {
        this.props.actions.selectDataGet(this.props.forumDetailData.postInfo)
        hashHistory.push({
            pathname: '/myPraise',
            query: {
                postId: id
            }
        })
    }

    // 分享页面跳转首页
    toForum () {
        hashHistory.push({
            pathname: '/',
            query: {
                appId: this.props.location.query.appId
            }
        })
    }

    // 微信中点击分享
    handleShare () {
        this.setState({
            share: true
        })
    }

    // 分享蒙版消失
    handleHide () {
        this.setState({
            share: false
        })
    }

    // 其他浏览器中点击分享
    handleShares () {
        alert('敬请期待~')
    }

    render () {
        let { forumDetailData, hasPraise, hasCollect } = this.props
        let upvote = hasPraise.value ? hasPraise.value.nativeUpvote : hasPraise.praise
        let collect = hasCollect.value ? hasCollect.value.nativeFavorite : hasCollect.collect
        let imgList = hasPraise.value ? hasPraise.value.upvoteList : hasPraise.imgList
        let forumInfo = !forumDetailData.postInfo ? '' : forumDetailData.postInfo
        let commentData = forumDetailData.replyInfo ? forumDetailData.replyInfo : []
        let commentItems = commentData.length === 0 ? '' : commentData.map((item, index) => {
            let publishTime = getTime(item.replyTime, item.requestTime)
            return (
                <div className="discuss_item" key={index}>
                    <div className="visitorInfo">
                        <img src={item.userIcon || head} alt=""/>
                        <div>
                            <p className="visitorName">{item.userNickname}</p>
                            <p className="date">{publishTime}</p>
                            {(item.userName === this.arg.userName && $.fn.cookie('login')) ? <span className="topic_delete" onClick={() => { this.delComment(item.replyId, item.superiorReplyId, index) }}>删除</span> : ''}
                        </div>
                    </div>

                    {item.superiorReplyId === '0' ? '' : <div className="floorReply">
                        <div className="authorInfo">
                            引用 <span className="authorName"> {item.superiorReplyUser} </span> 发表于 <span>{getLocalTime(item.superiorReplyTime)}</span>
                        </div>
                        <div className="prevReplyContent">
                            <p>{item.superiorReplyStatus === '1' ? item.superiorReplyContent : '该评论已被删除'}</p>
                        </div>
                    </div>}

                    <p className="discuss_detail" dangerouslySetInnerHTML={this.createMarkup(item.replyContent)}></p>
                    {item.replyPictureUrl ? item.replyPictureUrl.split(',').map((i, index) => {
                        return (
                            <FullImage key={index} img={i} />
                        )
                    }) : ''}
                    <p className="floor">{index + 2}F</p>
                    <i className="iconfont replyFloor" onClick={() => { this.floorComment(item.replyId) }}>&#xe600;</i>
                </div>
            )
        })
        let publishTime = getTime(forumInfo.publishTime, forumInfo.requestTime)
        return (
            <div className="topicDetail animate-route">
                {this.props.location.query.share ? <div className="write_button" onClick={() => { this.toForum() }}></div> : ''}
                <div className="topicContent">
                    <div className="item">
                        <div className="author">
                            <div className="img_p"><img src={forumInfo.userIcon || head} alt=""/></div>
                            <div className="author_info">
                                <p className="name">{forumInfo.userNickname || '昵称'}</p>
                                <p className="date">{publishTime}</p>
                                {(forumInfo.userName === this.arg.userName && $.fn.cookie('login')) ? <span className="topic_delete" onClick={() => { this.delForum() }}>删除</span> : ''}
                            </div>
                        </div>
                        <div className="article">
                            <div className="article_content">
                                <p className="title" dangerouslySetInnerHTML={this.createMarkup(forumInfo.postsTitle)}></p>
                                <p className="article_detail" dangerouslySetInnerHTML={this.createMarkup(forumInfo.postsContent)}>
                                </p>
                                {forumInfo.postsPictureUrl ? forumInfo.postsPictureUrl.split(',').map((i, index) => {
                                    return (
                                        <FullImage key={index} img={i} big={true}>
                                            <img src={i} alt=""/>
                                        </FullImage>
                                    )
                                }) : ''}
                            </div>
                        </div>
                        <div className="communicate">
                            <div className="praiseContent">
                                <img className="praiseButton" src={ upvote ? praised : prePraise} alt="" onClick={ () => { this.handlePraise() }}/>
                                {imgList && imgList.length !== 0 ? <div>
                                    <div className="headImg" onClick={() => { this.toMyPraise(forumInfo.postsId) }}>
                                        {imgList.map((item, index) => {
                                            if (index < 3) {
                                                return <img key={index} src={item.userIcon} alt=""/>
                                            }
                                        })}
                                    </div>
                                    <p>等 <span>{imgList.length}</span> 人赞过</p>
                                </div> : <span className="noPraise">暂无人点赞</span> }
                            </div>
                            <div className="myReply">
                                <p>
                                    <span className="return_num">{commentData.length || 0} 回复</span>
                                </p>
                                <p>
                                    <span className="view_num">{forumInfo.readNum || 0} 浏览</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="discussContent">
                    <p className="discuss_title">评论</p>
                    {commentItems}
                    {/*
                    <div className="discuss_item">
                        <div className="visitorInfo">
                            <img src={head} alt=""/>
                            <div>
                                <p className="visitorName">22323</p>
                                <p className="date">2017-6-9</p>
                                <span className="topic_delete">删除</span>
                            </div>
                        </div>
                        <p className="discuss_detail">
                            这里是评论内容你能信？这里是评论内容你能信？这里是评论内容评论内容评论内容评论你能信？这里是评论内容你能信？这里shi
                        </p>
                        <p className="floor">1F</p>
                        <i className="iconfont replyFloor">&#xe600;</i>
                    </div>
                    <div className="discuss_item">
                        <div className="visitorInfo">
                            <img src={head} alt=""/>
                            <div>
                                <p className="visitorName">22323</p>
                                <p className="date">2017-6-9</p>
                                <span className="topic_delete">删除</span>
                            </div>
                        </div>
                        <div className="floorReply">
                            <div className="authorInfo">
                                引用 <span className="authorName"> 薛之谦 </span> 发表于 <span>11-20 22:00</span>
                            </div>
                            <div className="prevReplyContent">
                                <p>赵丽颖化身荆轲逆袭成王..赵丽颖化身荆轲逆袭成王..赵丽颖化身荆轲逆袭成王..赵丽颖化身荆赵丽颖化身荆轲逆袭成王..赵丽颖</p>
                            </div>
                        </div>
                        <p className="discuss_detail">
                            这里是评论内容你能信？这里是评论内容你能信？这里是评论内容评论内容评论内容评论你能信？这里是评论内容你能信？这里shi
                        </p>
                        <p className="floor">1F</p>
                        <i className="iconfont replyFloor">&#xe600;</i>
                    </div>
                    <div className="discuss_item">
                        <p className="discuss_detail">这是个什么鬼, 哈哈哈</p>
                        <p className="date">1 分钟前</p>
                        <span className="topic_delete">删除</span>
                    </div>
                    <div className="discuss_item">
                        <p className="discuss_detail">这是个什么鬼, 哈哈哈</p>
                        <p className="date">1 分钟前</p>
                        <span className="topic_delete">删除</span>
                    </div>
                    <div className="discuss_item">
                        <p className="discuss_detail">这是个什么鬼, 哈哈哈</p>
                        <p className="date">1 分钟前</p>
                        <span className="topic_delete">删除</span>
                    </div>
                    <div className="discuss_item">
                        <div className="visitorInfo">
                            <img src={head} alt=""/>
                            <div>
                                <p className="visitorName">Hguejgp</p>
                                <p className="discuss_detail">这是个什么鬼adsfasdf asdf asfd fasd fasdf asdf dasdf , 哈哈哈</p>
                            </div>
                        </div>

                        <p className="date">1 分钟前</p>
                        <span className="topic_delete">删除</span>
                        <p className="floor">2F</p>
                    </div>
                     */}
                    <p className="noMore">暂无更多评论</p>
                    {
                        forumInfo && forumInfo.forbidComment === '1' ? '' : <div className="discuss_button">
                            <p onClick={() => { this.publishComment() }}><span className="">发表评论</span></p>
                            <img className="praiseButton" src={ collect ? collected : preCollect} alt="" onClick={ () => { this.handleCollect() }}/>
                            <i className="iconfont" onClick={ () => { isWeixin() ? this.handleShare() : this.handleShares() }}>&#xe612;</i>
                        </div>
                    }
                </div>
                <Login loginShow={ this.props.loginShow }/>
                <div onClick={() => { this.handleHide() }} className={`tips ${this.state.share ? 'active' : ''}`}>
                    <img src={tips} alt=""/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        multiLanguage: state.multiLanguage,
        forumDetailData: state.forumDetail.forumDetail,
        hasPraise: state.forumDetail.hasPraise,
        hasCollect: state.forumDetail.hasCollect,
        delComment: state.forumDetail.delComment,
        delForum: state.forumDetail.delForum,
        loginShow: state.loginInfo.display
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({visitorGetToken, selectDataGet, setLanguage, forumDetail, delComment, delForum, loginShow, praiseForum, collectForum, wxSign}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicDetail)
