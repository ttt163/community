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
import { publishTopic, uploadImg, deleteImg, clear } from '../../actions/publishTopic'
// import head from './img/ti.jpg'

class PublishTopic extends Component {
    constructor () {
        super()
        this.state = {
            vurl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
            postsTitle: '',
            postsContent: '',
            userNickName: $.fn.cookie('nickName'),
            file: '',
            imgArr: [],
            localImgArr: [],
            progressValue: [10, 10, 10, 10, 10]
        }
        this.arg = {
            appId: 1002,
            userName: 'ypengfei',
            sign: '6452118b712fab67eafc3fd8163e5c6b',
            token: 'T06n5vSUb8h49Gm6'
        }
    }
    componentWillMount () {
        document.title = '发表帖子'
    }

    getContent (e) {
        this.setState({
            postsContent: e.target.value
        })
    }

    // 获取title内容
    getTitle (e) {
        this.setState({
            postsTitle: e.target.value
        })
    }

    //   图片预览
    preView (e) {
        let valueArr = this.state.progressValue
        let preIndex = this.state.localImgArr.length
        valueArr[preIndex] = 10
        console.log(e.target)
        console.log(e.target.files)
        let formData = new FormData()
        formData.append('picturefile', e.target.files[0])
        for (let key in this.arg) {
            formData.append(key, this.arg[key])
        }

        this.props.actions.uploadImg(formData, (imgInfo) => {
            this.setState({
                imgArr: this.state.imgArr.concat(imgInfo)
            })
        }, (progress) => {
            let uploadValue = Math.round((progress.loaded * 100) / progress.total)
            valueArr[preIndex] = uploadValue
            this.setState({
                progressValue: valueArr
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
        let content = {
            postsTitle: this.utf16toEntities(this.state.postsTitle),
            postsContent: this.utf16toEntities(this.state.postsContent),
            userNickName: $.fn.cookie('nickName')
        }

        if (this.state.postsTitle.trim() === '' || this.state.postsContent.trim() === '') {
            alert('标题和内容均不能为空, 请检查后重新提交~')
            return
        }
        let url = {}
        url.postsPictureUrl = this.state.imgArr.join(',')
        let arg = this.props.imgInfo.length === 0 ? { ...this.arg, ...content } : { ...url, ...this.arg, ...content }
        this.props.actions.publishTopic(arg)
    }

    judge () {
        if (this.state.localImgArr.length === 5) {
            alert('最多上传 5 张图 ~ ')
            return false
        }
    }

    cancel () {
        this.props.actions.clear({})
        hashHistory.goBack(-1)
    }

    // 检测utf16emoji表情 转换为实体字符以供后台存储

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
            let H, L, code
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
            // return this.toUnicode(char)
        })
        return str
    }

    render () {
        // let { imgInfo } = this.props
        let uploadImg = this.state.localImgArr.map((item, index) => {
            return (
                <div key={index}>
                    <i className={`iconfont ${this.state.progressValue[index] === 100 && '上传成功' ? '' : 'uploading'}`} onClick={(e) => { this.deleteImg(e, index) }}>&#xe606;</i>
                    <img src={item} alt=""/>
                    <div className={`progressDiv ${this.state.progressValue[index] === 100 ? 'finish' : ''}`}>
                        <progress max={100} value={ this.state.progressValue[index] } />
                    </div>
                </div>
            )
        })
        return (
            <div className="publishTopic animate-route">
                <div className="main">
                    <div className="title">
                        <input autoFocus autoComplete="false" type="text" placeholder="话题标题" onChange={ (e) => { this.getTitle(e) } }/>
                    </div>
                    <div className="contentDiv">
                        <textarea className="topic_content" placeholder="至少 5 个字" onChange={ (e) => { this.getContent(e) }} />
                    </div>
                    <div className="addImg">
                        <input type="file" value={this.state.file} onTouchStart={(e) => { this.judge(e) }} onChange={(e) => { this.preView(e) }} />
                    </div>
                    <div className="option">
                        <span className="cancel" onClick={() => { this.cancel() }}>取消111</span>
                        <span className="publishButton" onClick={() => { this.publish() }}>发表</span>
                    </div>
                </div>
                <video height="300px" controls="controls" src={this.state.vurl}></video>
                <div className="preView">
                    {uploadImg}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage,
        publish: state.publishTopic.publish,
        imgInfo: state.publishTopic.imgInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({setLanguage, publishTopic, uploadImg, deleteImg, clear}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishTopic)
