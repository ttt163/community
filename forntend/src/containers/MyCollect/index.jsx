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
import { myCollect } from '../../actions/myCollect'

import { getTime } from '../../public/index'

class MyCollect extends Component {
    constructor () {
        super()
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            userNickName: $.fn.cookie('nickName') || '',
            token: $.fn.cookie('token') || ''
        }
    }

    createMarkup (item) {
        return {__html: item}
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

    componentWillMount () {
        document.title = '我的收藏'
        let arg = {...this.arg}
        this.props.actions.myCollect(arg)
    }

    render () {
        console.log(this.props.myCollect)
        const myCollect = this.props.myCollect ? this.props.myCollect : []
        let items = myCollect.length === 0 ? <p className="forum_bottom">快去收藏第一条帖子吧 ~ </p> : myCollect.map((item, index) => {
            let publishTime = getTime(item.publishTime, item.requestTime)
            return (
                <div className="latest_item animate-route" key={index} onClick={() => { this.intoTopic(item.postsId, item.status) }}>
                    <div className="title">
                        <span className="titleContent">{item.postsTitle}</span>
                        <span className="date">{publishTime}</span>
                    </div>
                    <p className="latest_detail" dangerouslySetInnerHTML={this.createMarkup(item.postsContent)}></p>
                </div>
            )
        })

        return (
            <div className="myCollect">
                <div className="discussContent">
                    {items}
                    {/*
                    <div className="latest_item">
                        <div className="title">
                            <span className="titleContent">黎明之玩儿翁玩儿玩儿玩儿光</span>
                            <span className="date">1 分钟前</span>
                        </div>
                        <p className="latest_detail">这是个什么鬼, 哈哈哈</p>
                    </div>
                    <div className="latest_item">
                        <div className="title">
                            <span className="titleContent">黎明之玩儿翁玩儿玩儿玩儿光</span>
                            <span className="date">1 分钟前</span>
                        </div>
                        <p className="latest_detail">这是个什么鬼, 哈哈哈</p>
                    </div>
                    */}
                </div>
                {/*
                 {myCollect.length === 0 ? '' : <div className="clear"><span className="clearButton">清除历史</span></div>}
                */}
                {myCollect.length === 0 ? '' : <p className="noMore">没有更多了~</p>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage,
        myCollect: state.myCollect
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, myCollect}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCollect)
