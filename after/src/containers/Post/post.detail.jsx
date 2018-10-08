/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, message, Modal } from 'antd'
import { hashHistory } from 'react-router'
// import defaultImgLarge from './img/default-large.png'
// import defaultImg from './img/default.png'
import PostEditor from '../../components/postEditor/index'
import IconItem from '../../components/icon/icon'
import {getPostItemInfo} from '../../actions/post.action'
import {formatDate, axiosAjax} from '../../public/index'
import PostDetailReply from './post.detail.reply'
import './post.scss'
const confirm = Modal.confirm
class PostDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false
        }
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getPostItemInfo({'postsId': location.query.id}))
    }
    // 删除
    _delPost () {
        const {location} = this.props
        // const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    'appId': $.cookie('gameId'),
                    'postsId': location.query.id
                }
                axiosAjax('POST', '/post/del', {...sendData}, (res) => {
                    if (res.status === 200) {
                        message.success('删除成功')
                        hashHistory.goBack()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (forbidcomment) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'postsId': location.query.id,
            'operate': !parseInt(forbidcomment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getPostItemInfo({'postsId': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (istop) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'postsId': location.query.id,
            'operate': !parseInt(istop) ? '1' : '0'
        }
        axiosAjax('post', '/post/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getPostItemInfo({'postsId': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }
    // 发布
    sendPost (sendData) {
        const {dispatch, location} = this.props
        let _data = {
            'appId': $.cookie('gameId'),
            'postsId': location.query.id,
            'title': sendData.postTitle,
            'content': `${sendData.postContent}`
        }
        // console.log(_data)
        axiosAjax('post', '/post/update', _data, (res) => {
            if (res.status === 200) {
                message.success('修改成功！')
                // hashHistory.push('/post-list')
                dispatch(getPostItemInfo({'postsId': location.query.id}))
                this.setState({'isEdit': false})
            } else {
                message.error(res.msg)
            }
        })
    }

    createMarkup (str) { return {__html: str} }
    render () {
        const {info, location} = this.props
        let postInfo = {
            'postTitle': info.title,
            'postContent': info.content
        }
        return <div className="post-detail">
            <Row>
                <Col span={1}>
                    <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()} />
                </Col>
                <Col className="text-right" span={20} offset={3}>
                    <Button onClick={() => this.setState({'isEdit': true})} className="mr10" type="primary" ><IconItem type="icon-edit"/>编辑</Button>
                    <Button onClick={() => this._isTop(info.isTop)} className="mr10"><IconItem type={info.isTop === '1' ? 'icon-cancel-top' : 'icon-to-top'}/>{info.isTop === '1' ? '取消置顶' : '置顶'}</Button>
                    <Button onClick={() => this._forbidcomment(info.forbidComment)} className="mr10"><IconItem type={info.forbidComment === '1' ? 'icon-msg' : 'icon-no-msg'}/>{info.forbidComment === '1' ? '取消禁评' : '禁评'}</Button>
                    <Button onClick={() => this._delPost()}><IconItem type="icon-clear"/>删除</Button>
                </Col>
            </Row>
            {/* 帖子内容 */}
            <div className="page-box post-content">
                <div className="post-main">
                    {
                        !this.state.isEdit
                            ? <div>
                                <div className="post-info">
                                    <h3 dangerouslySetInnerHTML={this.createMarkup(info.title)}/>
                                    <span className="mr35">{formatDate(info.createTime)}</span>
                                    <span>阅读量 {info.readNum}&nbsp;&nbsp;评论量 {info.reviewNum}&nbsp;&nbsp;点赞量 {info.upvoteNum}</span>
                                </div>
                                <div className="content-text" dangerouslySetInnerHTML={this.createMarkup(info.content)} />
                                <div className="img-content">
                                    {
                                        !info.pictureUrl ? '' : info.pictureUrl.split(',').map((item, index) => (
                                            <img key={index} className="mr10" src={item}/>
                                        ))
                                    }
                                </div>
                            </div>
                            : <PostEditor hasUser={true} info={postInfo} subSend={(data) => this.sendPost(data)} />
                    }
                </div>
                <div>
                    <div className="img-box">
                        <img src={info.userIcon}/>
                    </div>
                    <div className="text-center mt5">{info.nickName}</div>
                </div>
            </div>
            {/* 评论内容 */}
            <PostDetailReply postId={location.query.id} />
            {/* <div className="page-box user-content">
                <div className="item">
                    <div className="num-tip">2F</div>
                    <Row>
                        <Col span={22}>
                            <div className="user-info">
                                <div className="img-box"><img src={defaultImg} /></div>
                                <div>
                                    <div className="mb5">用户名称</div>
                                    <div>2017-07-26  12：00：00</div>
                                </div>
                            </div>
                        </Col>
                        <Col className="text-right" span={2}>
                            <Button><IconItem type="icon-clear"/>删除</Button>
                        </Col>
                    </Row>
                    <p>
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                    </p>
                </div>
                <div className="item">
                    <div className="num-tip">3F</div>
                    <Row>
                        <Col span={22}>
                            <div className="user-info">
                                <div className="img-box"><img src={defaultImg} /></div>
                                <div>
                                    <div className="mb5">用户名称</div>
                                    <div>2017-07-26  12：00：00</div>
                                </div>
                            </div>
                        </Col>
                        <Col className="text-right" span={2}>
                            <Button><IconItem type="icon-clear"/>删除</Button>
                        </Col>
                    </Row>
                    <p>
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                    </p>
                </div>
                 分页
                <div className="pagination">
                    <Pagination defaultCurrent={6} total={500} />
                </div>
            </div> */}
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.postInfo.info
    }
}

export default connect(mapStateToProps)(PostDetail)
