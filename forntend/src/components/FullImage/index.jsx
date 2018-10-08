/**
 * Author：tantingting
 * Time：2017/8/17
 * Description：Description CarouselIndex
 */

import React, { Component } from 'react'
import './index.scss'
// import { Link } from 'react-router'
//
// import headImg from './img/head.png'
// import longImg from './img/fullImg.jpg'

class FullImage extends Component {
    constructor () {
        super()
        this.state = {
            display: 'none'
        }
    }

    componentWillMount () {}

    showImg (e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            display: 'block'
        })
    }

    hideImg (e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            display: 'none'
        })
    }

    touch (e) {
        document.addEventListener('touchmove', function (event) {
            if (event.cancelable) {
                if (!event.defaultPrevented) {
                    event.preventDefault()
                }
            }
        }, false, {passive: false})
    }

    render () {
        return (
            <div className={`fullImgDiv ${this.props.big ? 'big' : ''}`} style={{
                background: `${!this.props.big ? `url(${this.props.img}) no-repeat center / cover #fff` : '#fff'}`
            }} onClick={(e) => this.showImg(e)}>
                <div className="imgBg animate-route" style={{display: this.state.display}} onClick={(e) => this.hideImg(e)}>
                    <img className="" src={this.props.img} alt=""/>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default FullImage
