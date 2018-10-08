/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：menu data
 */
const menuData = [
    {
        key: 'post',
        icon: 'icon-post',
        link: '',
        text: '帖子管理',
        children: [
            {
                key: 'post-list',
                icon: 'icon-post-list',
                link: '/post-list',
                text: '帖子列表'
            }, {
                key: 'post-send',
                icon: 'icon-post-send',
                link: '/post-send',
                text: '快速发帖'
            }
        ]
    }, {
        key: 'postUser',
        icon: 'icon-postUser',
        link: '/postUser',
        text: '发帖用户管理'
    }, {
        key: 'images',
        icon: 'icon-images',
        link: '/images',
        text: '图片鉴别'
    }, {
        key: 'language',
        icon: 'icon-language',
        link: '/language',
        text: '多语言词条管理'
    }
]
export default menuData
