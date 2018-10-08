/**
 * Author：zhoushuanglong
 * Time：2017/7/26
 * Description：enter
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import './index.scss'

class PersonCenter extends Component {
    render () {
        return <div className="personCenter animate-route">
            这里是个人中心详细内容
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        multiLanguage: state.multiLanguage
    }
}

export default connect(mapStateToProps)(PersonCenter)
