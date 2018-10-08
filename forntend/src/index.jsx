/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：outer jsx
 */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import rootRoutes from './routes'
import store from './store/index'

import './public/index.scss'
import './public/iconfont.scss'
import { equipOrientation } from './public/index'

// 引入国际化
import {IntlProvider, addLocaleData} from 'react-intl'

import zhLocaleData from 'react-intl/locale-data/zh'

equipOrientation()

const zh = { 'forum': '首页', 'name': '我的名字是 {name}' }

const en = { 'forum': 'Froum', 'name': 'my name is {name}' }

addLocaleData([...zhLocaleData, ...en, ...zh])

const history = syncHistoryWithStore(hashHistory, store)

$('body').append('<div id="root"></div>')

render(
    <IntlProvider locale={navigator.language} messages={zh}>
        <Provider store={store}>
            <Router history={history}>
                {rootRoutes}
            </Router>
        </Provider>
    </IntlProvider>, document.getElementById('root')
)
