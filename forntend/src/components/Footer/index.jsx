/**
 * Author：tantingting
 * Time：2017/8/17
 * Description：Description CarouselIndex
 */

import React, { Component } from 'react'
import './index.scss'
import { Link } from 'react-router'
// import $ from 'jquery'

let data = [
    {
        'title': '论坛',
        'class': 'footer_forum',
        'pathname': '/forum'
    }, {
        'title': '视频',
        'class': 'footer_video',
        'pathname': '/video'
    }, {
        'title': '个人',
        'class': 'footer_personal',
        'pathname': '/personal'
    }
]
class Footer extends Component {
    constructor () {
        super()
        this.state = {
            'activeIndex': 0
        }
    }

    componentWillMount () {
        this.setState({activeIndex: sessionStorage.getItem('footerIndex') ? parseInt(sessionStorage.getItem('footerIndex')) : 0})
    }

    select (index) {
        sessionStorage.setItem('footerIndex', index)
        this.setState({activeIndex: index})
    }

    render () {
        // const lang = this.props.lang
        const skin = this.props.skin
        let style = {
            background: skin.footer.background,
            color: skin.footer.fontColor,
            hover: skin.footer.fontColorHover
        }
        return <div className="page-footer" style={style}>
            {data.map((item, index) => (
                <div key={index}>
                    <Link onClick={() => { this.select(index) }} to={{pathname: item.pathname}} className={this.state.activeIndex === index ? 'active' : ''}>
                        <i className={`${item.class} iconfont`}> </i><span>{item.title}</span>
                    </Link>
                </div>
            ))}
        </div>
    }
}

export default Footer
