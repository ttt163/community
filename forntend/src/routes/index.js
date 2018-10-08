/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root route
 */

import React from 'react'
import { Route, IndexRoute } from 'react-router'

const rootRoutes = <div>
    <Route path="/" getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'Main')
    }}>
        <IndexRoute getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Forum').default)
            }, 'Enter')
        }}/>
        <Route path='/forum' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Forum').default)
            }, 'Forum')
        }}/>
        <Route path='/video' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Video').default)
            }, 'Video')
        }}/>
    </Route>
    <Route path='/editInfo' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/EditInfo').default)
        }, 'EditInfo')
    }}/>
    <Route path='/personCenter' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/PersonCenter').default)
        }, 'PersonCenter')
    }}/>
    <Route path='/login' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Login').default)
        }, 'Login')
    }}/>
    <Route path='/publishTopic' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/PublishTopic').default)
        }, 'PublishTopic')
    }}/>
    <Route path='/topicDetail' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/TopicDetail').default)
        }, 'TopicDetail')
    }}/>
    <Route path='/publishComment' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/PublishComment').default)
        }, 'PublishComment')
    }}/>
    <Route path='/myTopic' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/MyTopic').default)
        }, 'MyTopic')
    }}/>
    <Route path='/latestView' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/LatestView').default)
        }, 'LatestView')
    }}/>
    <Route path='/myCollect' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/MyCollect').default)
        }, 'MyCollect')
    }}/>
    <Route path='/myPraise' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/MyPraise').default)
        }, 'MyPraise')
    }}/>
    <Route path='/*' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Forum').default)
        }, 'Redirect')
    }}/>
</div>

export default rootRoutes
