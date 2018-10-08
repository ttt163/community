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
import { publishComment, uploadImg, deleteImg, clear } from '../../actions/publishComment'

class PublishComment extends Component {
    constructor () {
        super()
        this.state = {
            replyContent: '',
            userNickName: $.fn.cookie('nickName'),
            file: '',
            localImgArr: [],
            imgArr: [],
            progressValue: 10
        }
        this.arg = {
            appId: $.fn.cookie('appId') || '',
            userName: $.fn.cookie('userName') || '',
            sign: $.fn.cookie('sign') || '',
            token: $.fn.cookie('token') || ''
        }
    }
    componentWillMount () {
        document.title = '发表评论'
    }

    getContent (e) {
        this.setState({
            replyContent: e.target.value
        })
    }

    //   图片预览
    preView (e) {
        if (this.state.localImgArr.length === 1) {
            alert('最多上传 1 张图 ~ ')
            this.setState({
                file: ''
            })
            return false
        }

        this.setState({
            progressValue: 10
        })

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
        let formData = new FormData()
        formData.append('picturefile', e.target.files[0])
        let obj = {
            ...this.arg,
            replyIdSubject: this.props.location.state.replyId || 0
        }
        for (let key in obj) {
            formData.append(key, obj[key])
        }

        this.props.actions.uploadImg(formData, (imgInfo) => {
            this.setState({
                imgArr: this.state.imgArr.concat(imgInfo)
            })
        }, (progress) => {
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
                localImgArr: this.state.localImgArr.concat(r.target.result)
            })
        }
        r.readAsDataURL(file)

        this.setState({
            file: e.target.value
        })
    }

    deleteImg (e, index) {
        this.setState({
            file: '',
            imgArr: this.state.imgArr.filter((e, i) => i !== index),
            localImgArr: this.state.localImgArr.filter((e, i) => i !== index)
        })
        this.props.actions.deleteImg(index)
    }

    publish () {
        let obj = {
            ...this.arg,
            replyIdSubject: this.props.location.state.replyId || 0
        }

        if (this.state.replyContent.trim() === '') {
            alert('评论内容不能为空, 请检查后重新提交~')
            return
        }
        let content = {
            replyContent: this.utf16toEntities(this.state.replyContent),
            userNickName: $.fn.cookie('nickName')
        }
        let url = {}
        url.replyPicUrl = this.props.imgInfo.join(',')
        let arg = this.props.imgInfo.length === 0 ? { ...obj, ...content, ...this.props.location.state } : { ...url, ...obj, ...content, ...this.props.location.state }
        this.props.actions.publishComment(arg)
    }

    judge () {
        if (this.state.localImgArr.length === 5) {
            alert('最多上传 1 张图 ~ ')
            return false
        }
    }

    toUnicode (data) {
        let str = ''
        for (let i = 0; i < data.length; i++) {
            str += '\\u' + parseInt(data[i].charCodeAt(0), 10).toString(16)
        }
        return str
    }

    utf16toEntities (str) {
        let pat = /[\ud800-\udbff][\udc00-\udfff]/g
        str = str.replace(pat, (char) => {
            /*
            * let H, L, code
             if (char.length === 2) {
             // 辅助平面字符（我们需要做处理的一类）
             H = char.charCodeAt(0)
             // 取出高位
             L = char.charCodeAt(1)
             // 取出低位
             code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00
             // 转换算法
             return '&#' + code + ';'
             } else {
             return char
             }
            * */
            return this.toUnicode(char)
        })
        return str
    }

    cancel () {
        this.props.actions.clear({})
        hashHistory.goBack(-1)
    }

    render () {
        let upSuccess = this.state.imgArr.length === this.state.localImgArr.length
        let uploadImg = this.state.localImgArr.map((item, index) => {
            return (
                <div key={index}>
                    <i className={`iconfont ${(this.state.progressValue === 100 && upSuccess) ? '' : 'uploading'}`} onClick={(e) => { this.deleteImg(e, index) }}>&#xe606;</i>
                    <img src={item} alt=""/>
                    <div className={`progressDiv ${(this.state.progressValue === 100 && upSuccess) ? 'finish' : ''}`}>
                        <progress max={100} value={ this.state.progressValue } />
                    </div>
                </div>
            )
        })
        return (
            <div className="publishComment animate-route">
                <div className="main">
                    <div className="contentDiv">
                        <textarea autoFocus wrap='hard' className="topic_content" onChange={ (e) => { this.getContent(e) }} placeholder="至少 5 个字" />
                    </div>
                    <div className="addImg">
                        <input type="file" value={this.state.file || ''} onTouchStart={(e) => { this.judge(e) }} onChange={(e) => { this.preView(e) }} accept="image/gif, image/png, image/jpeg, image/jpg, image/bmp"/>
                    </div>
                    <div className="option">
                        <span className="cancel" onClick={() => { this.cancel() }}>取消</span>
                        <span className="publishButton" onClick={() => { this.publish() }}>发表</span>
                    </div>
                </div>
                <div className="preView">
                    {uploadImg}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        multiLanguage: state.multiLanguage,
        publish: state.publishComment.publish,
        imgInfo: state.publishComment.imgInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, publishComment, uploadImg, deleteImg, clear}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishComment)
