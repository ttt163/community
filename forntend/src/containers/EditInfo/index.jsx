/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadImg, updateGender, updateHeadImg, updateNickName, getPersonalInfo } from '../../actions/editInfo'
import { setLanguage } from '../../actions/index'
// import { hashHistory } from 'react-router'

import './index.scss'

class EditInfo extends Component {
    constructor () {
        super()
        this.state = {
            headChangeShow: false,
            chooseItem: null,
            file: '',
            localImgArr: null,
            imgArr: null,
            progressValue: 10,
            nickInputContent: null,
            nick: $.fn.cookie('nickName') || '',
            sex: null,
            index: null
        }
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || ''
        }
    }

    componentWillMount () {
        document.title = '个人资料修改'
        this.props.actions.getPersonalInfo(this.arg)
    }

    changeHeadShow () {
        this.setState({
            chooseItem: 1,
            headChangeShow: true
        })
    }

    changeNameShow () {
        this.setState({
            chooseItem: 2,
            headChangeShow: true
        })
    }

    changeGenderShow () {
        this.setState({
            chooseItem: 3,
            headChangeShow: true
        })
    }

    alertHide (e) {
        this.setState({
            headChangeShow: false
        })
    }

    //   图片预览
    preView (e) {
        this.alertHide(e)
        this.setState({
            progressValue: 10
        })

        // 判断图片类型和大小
        let value = e.target.value.toLowerCase().split('.')
        let format = value[value.length - 1]
        if (format === 'gif' || format === 'jpg' || format === 'bmp' || format === 'png' || format === 'jpeg') {
            let imgSize = e.target.files[0].size
            if (imgSize > 1024 * 1024 * 3) {
                alert('图片大小不能超过 3M, 请重新选择')
                return false
            }
        } else {
            alert('请选择格式为*.jpg、*.gif、*.bmp、*.png、*.jpeg 的图片')
            return false
        }

        // 转换为 formdata 对象
        let formData = new FormData()
        formData.append('picturefile', e.target.files[0])
        let obj = {...this.arg}
        for (let key in obj) {
            formData.append(key, obj[key])
        }

        // 请求
        this.props.actions.uploadImg(formData, (imgInfo) => {
            this.setState({
                imgArr: imgInfo
            })
            console.log(imgInfo)
            this.props.actions.updateHeadImg({...this.arg, icon: imgInfo})
        }, (progress) => {
            // 获取上传进度
            let uploadValue = Math.round((progress.loaded * 100) / progress.total)
            this.setState({
                progressValue: uploadValue
            })
        })

        // 本地预览图片
        let file = e.target.files[0]
        let r = new FileReader()
        r.onload = (r) => {
            this.setState({
                localImgArr: r.target.result
            })
        }
        r.readAsDataURL(file)
    }

    upNickName (e) {
        if (this.state.nickInputContent.trim() === '') {
            alert('昵称不能为空~')
            return false
        }
        this.setState({
            nick: this.state.nickInputContent
        })
        this.alertHide()
        this.props.actions.updateNickName({...this.arg, nickName: this.state.nickInputContent})
    }

    upGender (e, index) {
        this.setState({
            sex: e
        })
        this.props.actions.updateGender({...this.arg, sex: index + 1})
        this.alertHide()
    }

    render () {
        let { personalInfo } = this.props
        let head = personalInfo.value ? personalInfo.value.icon : ''
        let userSex = personalInfo.value ? (personalInfo.value.userSex === '1' ? '男' : '女') : ''
        return <div className="editInfo animate-route">
            <div className="edit editHead">
                <span>头像</span>
                <p onClick={() => { this.changeHeadShow() }}>
                    <span className="imgSpan"><img src={this.state.localImgArr ? this.state.localImgArr : head} alt=""/></span>
                    <i className="iconfont">&#xe655;</i>
                </p>
            </div>
            <div className="edit editName">
                <span>用户名</span>
                <p onClick={() => { this.changeNameShow() }}>
                    <span>{this.state.nick}</span>
                    <i className="iconfont">&#xe655;</i>
                </p>
            </div>
            <div className="edit editGender">
                <span>性别</span>
                <p onClick={() => { this.changeGenderShow() }}>
                    <span>{this.state.sex ? this.state.sex : userSex}</span>
                    <i className="iconfont">&#xe655;</i>
                </p>
            </div>

            <div className={`${this.state.headChangeShow ? 'active' : ''} alert animate-route`}>
                {this.state.chooseItem === 1 ? <div className="chooseImg">
                    <div className="fromPhoto">
                        <span>从相册选择</span>
                        <input type="file" onChange={(e) => { this.preView(e) }} accept="image/gif, image/png, image/jpeg, image/jpg, image/bmp"/>
                    </div>
                    <div className="fromCamera">
                        <span>拍照</span>
                        <input type="file" onChange={(e) => { this.preView(e) }} capture='camera' accept="image/*"/>
                    </div>
                    <span className="cancel" onClick={(e) => { this.alertHide(e) }}>取消</span>
                </div> : (this.state.chooseItem === 2 ? <div className="updateName">
                    <div className="fromPhoto">
                        <input autoFocus onChange={(e) => { this.setState({nickInputContent: e.target.value}) }} placeholder="请输入昵称" type="text" className="changeNameInput"/>
                        <span className="confirm" onClick={(e) => { this.upNickName(e) }}>确认</span>
                    </div>
                    <span className="cancel" onClick={(e) => { this.alertHide(e) }}>取消</span>
                </div> : <div className="updateGender">
                    <div className="genderChoice">
                        {[{title: '男', sex: '男'}, {title: '女', sex: '女'}].map((item, index) => {
                            return <span key={index} title={item.title} onClick={(e) => { this.upGender(e.target.title, index) }}>{item.sex}</span>
                        })}
                    </div>
                    <span className="cancel" onClick={(e) => { this.alertHide(e) }}>取消</span>
                </div>)}
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        personalInfo: state.editInfo.personalInfo,
        multiLanguage: state.multiLanguage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, uploadImg, updateGender, updateHeadImg, updateNickName, getPersonalInfo}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo)
