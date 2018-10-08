/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Row, Col, Button, Table, Modal, message } from 'antd'
import './post.scss'
import { Link } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getPostList, setSearchQuery, setPageData} from '../../actions/post.action'
import {formatDate, axiosAjax} from '../../public/index'
const confirm = Modal.confirm
let columns = []
class PostIndex extends Component {
    /* constructor () {
        super()
        this.state = {
            type: 'init',
            nickName: '',
            title: '',
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
    } */
    componentWillMount () {
        const {search} = this.props
        this.doSearch(!search.type ? 'init' : search.type)
        columns = [{
            title: '帖子主题',
            key: 'name',
            render: (text, record) => (<div className="post-info clearfix">
                <div>
                    <h4 dangerouslySetInnerHTML={this.createMarkup(record.title)} />
                    <div>
                        {!parseInt(record.isTop) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">置顶</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                    </div>
                </div>
                {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
            </div>)
        }, {
            title: '发帖人',
            dataIndex: 'nickName',
            key: 'nickName'
        }, {
            title: '查看 ',
            dataIndex: 'readNum',
            key: 'readNum'
        }, {
            title: '回复 ',
            dataIndex: 'reviewNum',
            key: 'reviewNum'
        }, {
            title: '点赞',
            dataIndex: 'upvoteNum',
            key: 'upvoteNum'
        }, {
            title: '发帖时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10" to={{pathname: '/post-detail', query: {id: item.postsId}}}>详情</Link>
                <a className="mr10" href="javascript:void(0)" onClick={() => this._isTop(item)}>{item.isTop === '1' ? '取消置顶' : '置顶'}</a>
                <a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a>
                <a onClick={() => this.delPost(item)} className="mr10" href="javascript:void(0)">删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'currPage': 1, 'pageSize': 10, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }
    doSearch (type, data) {
        const {dispatch, pageData, search} = this.props
        let sendDada = {
            'page': pageData.currPage,
            'appId': $.cookie('gameId')
        }
        if (type !== 'init') {
            sendDada = {
                ...sendDada,
                'nickName': search.nickName,
                'title': search.title
            }
        }
        sendDada = {...sendDada, ...data}
        // let sendDada = !data ? {searchQuery: this.state.searchQuery} : {searchQuery: this.state.searchQuery, ...data}
        dispatch(getPostList(type, sendDada))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.nickName && !search.title) {
            type = 'init'
        } else {
            type = 'search'
        }
        this.doSearch(type, {'page': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'page': page})
    }
    // 删除
    delPost (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    'appId': $.cookie('gameId'),
                    'postsId': item.postsId
                }
                axiosAjax('POST', '/post/del', {...sendData}, (res) => {
                    if (res.status === 200) {
                        message.success('删除成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (item) {
        const {dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'postsId': item.postsId,
            'operate': !parseInt(item.forbidComment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (item) {
        const {dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'postsId': item.postsId,
            'operate': item.isTop === '1' ? '0' : '1'
        }
        axiosAjax('post', '/post/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }
    render () {
        const {list, search, pageData, dispatch} = this.props
        return <div className="post-index">
            <Row>
                <Col span={1} className="form-label">帖子主题:</Col>
                <Col span={3}>
                    <Input
                        value={search.title}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入帖子主题"
                    />
                </Col>
                <Col span={1} className="form-label">发帖人:</Col>
                <Col span={3}>
                    <Input
                        value={search.nickName}
                        onChange={(e) => dispatch(setSearchQuery({nickName: e.target.value}))}
                        placeholder="请输入发帖人"
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        postInfo: state.postInfo,
        list: state.postInfo.list,
        search: state.postInfo.search,
        pageData: state.postInfo.pageData
    }
}

export default connect(mapStateToProps)(PostIndex)
