/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import './index.scss'

class Video extends Component {
    render () {
        return <div className="video animate-route">
            敬请期待
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage
    }
}

export default connect(mapStateToProps)(Video)
