/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：main
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import { setLanguage, setSkin, getToken, loginShow } from '../../actions/index'
import { browserLanguage } from '../../public/index'
import './index.scss'

// import Footer from '../../components/Footer'
import Login from '../../containers/Login'

class Main extends Component {
    componentWillMount () {
        document.title = '游戏社区'
        // 设置语言
        if ($.fn.cookie('lang')) {
            this.props.actions.setLanguage($.fn.cookie('lang'))
        } else {
            $.fn.cookie('lang', browserLanguage())
            this.props.actions.setLanguage(browserLanguage())
        }
        console.log($.fn.cookie('lang'))

        // 设置主题皮肤
        if ($.fn.cookie('skin')) {
            this.props.actions.setSkin($.fn.cookie('skin'))
        }

        // this.checkLogin()
        // let arg = {}
        // arg.appId = 1000
        // arg.userName = 'zhangaoxiang'
        // arg.sign = '4815fa8744fcb12d70da78688f1104a1'
        //
        // if (!$.fn.cookie('token')) {
        //     this.props.actions.getToken(arg)
        // }
    }

    // 换肤
    changeSkin = () => {
        $.fn.cookie('skin', this.langType.value)
        this.props.actions.setSkin(this.langType.value)
    }

    componentWillReceiveProps () {
        // const type = this.props.location.pathname.replace('/', '')
        // console.log(type)
    }

    componentWillUpdate () {
        // this.checkLogin()
    }

    // 检测登录状态
    checkLogin = () => {
        if (!$.fn.cookie('email') || !$.fn.cookie('password')) {
            hashHistory.push('/login')
        }
    }

    render () {
        // const lang = this.props.multiLanguage
        // const skin = this.props.skinStyle

        return (
            <div className="bbs-main animate-route">
                {this.props.children}
                {/**
                换肤 select 框
                 <select onChange={this.changeSkin} ref={(ref) => { this.langType = ref }}>
                 <option value="white">白色</option>
                 <option value="black">黑色</option>
                 </select>
                */}
                {/*
                 <Footer lang={lang} skin={skin}/>
                */}
                <Login loginShow={ this.props.loginShow }/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage,
        skinStyle: state.skinStyle,
        loginShow: state.loginInfo.display
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, setSkin, getToken, loginShow}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
