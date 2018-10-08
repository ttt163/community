/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import md5 from 'blueimp-md5'
// import { hashHistory } from 'react-router'

import './index.scss'
import logo from './img/logo.png'
import { login, getToken, loginShow } from '../../actions/index'
class Login extends Component {
    componentWillMount () {
        // $.fn.cookie('login', null)
    }

    handleSubmit (e) {
        e.preventDefault()
        let arg = {}
        let password = this.password.value
        // let password = '000000'
        arg.appId = $.fn.cookie('appId')
        arg.userName = this.email.value
        // arg.userName = $.fn.cookie('userName')
        arg.sign = md5($.fn.cookie('appId') + arg.userName)
        this.props.actions.getToken(arg, password)
    }

    close = (e) => {
        e.stopPropagation()
        this.props.actions.loginShow('none')
    }

    stop = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    render () {
        return <div className="login-main animate-route" onClick={this.close} style={{display: this.props.loginShow}}>
            <div className="login-content" onClick={this.stop}>
                <div className="logo"><img src={logo}/></div>
                <div className="input-group">
                    <i className="iconfont icon-user"></i>
                    <input ref={(ref) => { this.email = ref }} type="text" placeholder="请输入账号"/>
                </div>
                <div className="input-group">
                    <i className="iconfont icon-pwd"></i>
                    <input ref={(ref) => { this.password = ref }} type="password" placeholder="请输入密码"/>
                </div>
                <a onClick={(e) => { this.handleSubmit(e) }} className="login-btn">登录</a>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({login, getToken, loginShow}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
