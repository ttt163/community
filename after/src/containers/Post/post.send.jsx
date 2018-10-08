/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
// import PostSendLogin from './post.send.login'
// import PostUserInfo from '../../components/postUserInfo/index'
import PostEditor from '../../components/postEditor'
import { message } from 'antd'
// import {_login} from '../../actions/post.action'
import {axiosAjax} from '../../public/index'
import './post.scss'

class PostSend extends Component {
    constructor () {
        super()
        this.state = {
            'isLogin': false,
            'userName': 'ypengfei',
            'password': '800135'
        }
    }
    // 登录
    /* login (sendData) {
        this.props.dispatch(_login(sendData, () => {
            this.setState({
                'isLogin': true
            })
        }))
    } */
    /* // 退出
    loginOut () {
        this.setState({
            'isLogin': false
        })
    } */
    // 发布
    sendPost (sendData) {
        let _data = {
            'appId': $.cookie('gameId'),
            'userName': this.state.userName,
            'password': this.state.password,
            'title': sendData.postTitle,
            'forbidComment': sendData.postType,
            'content': `${sendData.postContent}`
        }
        // console.log(_data)
        axiosAjax('post', '/post/add', _data, (res) => {
            if (res.status === 200) {
                message.success('添加成功！')
                hashHistory.push('/post-list')
            } else {
                message.error(res.msg)
            }
        })
    }

    clear () {
        this.setState({
            'userName': '',
            'password': ''
        })
    }
    render () {
        // const {userInfo} = this.props
        return <div className="post-send">
            {/* <div className="send-info page-box">
                {
                    !this.state.isLogin ? <PostSendLogin click={(data) => this.login(data)} info={userInfo}/> : <PostUserInfo info={userInfo} click={() => this.loginOut()}/>

                }
            </div> */}
            <div className="user-box">
                <div className="input-item"><input value={this.state.userName} onChange={(e) => this.setState({'userName': e.target.value})} placeholder="请输入发帖账号"/></div>
                <div className="input-item"><input type="password" value={this.state.password} onChange={(e) => this.setState({'password': e.target.value})} placeholder="请输入密码"/></div>
            </div>
            <PostEditor clearBack={() => this.clear()} hasUser={!(!this.state.userName || !this.state.password)} info={{}} subSend={(data) => this.sendPost(data)} />
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.postInfo.userInfo
    }
}

export default connect(mapStateToProps)(PostSend)
