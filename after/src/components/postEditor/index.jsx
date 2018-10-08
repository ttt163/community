/**
 * Author：tantingting
 * Time：2017/9/21
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import $ from 'jquery'
import Simditor from 'simditor'
import '../../../node_modules/simditor/styles/simditor.css'
import LargedefaultImg from './img/default-large.png'
import IconItem from '../icon/icon'
import {Input, Radio, Button} from 'antd'
import './index.scss'
const RadioGroup = Radio.Group
const {TextArea} = Input
const EDITTOOLBAR = [
    'title',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'fontScale',
    'color',
    'ol',
    'ul',
    'blockquote',
    'code',
    'table',
    'link',
    'image',
    'hr',
    'indent',
    'outdent',
    'alignment'
]
let editor = ''

class PostEditor extends Component {
    constructor (props) {
        super(props)
        const {info} = props
        this.state = {
            'postTitle': !info.postTitle ? '' : info.postTitle,
            'postType': !info.postType ? '0' : info.postType,
            'postContent': !info.postContent ? '' : info.postContent
        }
    }
    componentDidMount () {
        const {info} = this.props
        editor = new Simditor({
            textarea: $('.editor'),
            defaultImage: LargedefaultImg,
            placeholder: '这里输入帖子内容...',
            toolbar: EDITTOOLBAR,
            upload: {
                url: '/image/upload', // 文件上传的接口地址
                params: {'id': '123'}, // 键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                fileKey: 'uploadFile', // 服务器端获取文件数据的参数名
                connectionCount: 3,
                leaveConfirm: '正在上传文件',
                success: function (result) {
                    let msg = ''
                    let imgPath = ''
                    if (result.status !== 200) {
                        msg = result.msg || this._t('uploadFailed')
                        console.log(msg)
                        imgPath = this.defaultImage
                    } else {
                        imgPath = result.data
                    }
                    return imgPath
                }
            }
        })
        if (info.postContent) {
            editor.setValue(info.postContent)
        }
        editor.on('valuechanged ', (e) => {
            // var v=editor.getValue();
            // console.log(editor.getValue())
            this.setState({'postContent': editor.getValue()})
        })
    }

    // 发布
    sendPost () {
        const {subSend} = this.props
        subSend(this.state)
    }

    // 清空
    clearContent () {
        const {clearBack} = this.props
        editor.setValue('')
        this.setState({
            'postTitle': '',
            'postType': '',
            'postContent': ''
        })
        if (clearBack) {
            clearBack()
        }
    }

    render () {
        const {hasUser, info} = this.props
        return <div className="editor-post-content">
            <div style={{'borderBottom': !info.postTitle ? '1px solid #e9e9e9' : '0'}} className="post-title"><input value={this.state.postTitle} onChange={(e) => this.setState({'postTitle': e.target.value})} placeholder="请输入帖子标题"/></div>
            {
                !info.postTitle ? (
                    <div className="post-radio">
                        <RadioGroup value={this.state.postType} onChange={(e) => this.setState({'postType': e.target.value})}>
                            <Radio value='1'>禁止评论</Radio>
                            <Radio value='0'>开放评论</Radio>
                        </RadioGroup>
                    </div>
                ) : ''
            }
            <div>
                <TextArea className="editor" autosize/>
            </div>
            <div className="btns">
                <Button className="mr10" onClick={() => this.clearContent()}><IconItem type="icon-clear"/>清空</Button>
                <Button type="primary" disabled={!hasUser || !this.state.postTitle || !this.state.postType || !this.state.postContent} onClick={() => this.sendPost()}><IconItem type="icon-ok"/>发布</Button>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        query: state.postInfo.query
    }
}

export default connect(mapStateToProps)(PostEditor)
