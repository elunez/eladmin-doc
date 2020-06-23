module.exports = {
    // 插件
    plugins: {
        'vuepress-plugin-comment': {
            choosen: 'gitalk',
            // options选项中的所有参数，会传给Valine的配置
            options: {
                id: '留言板',
                clientID: '08f039f9aac8015220ab',
                clientSecret: 'b98a7d05379a0ffc7ad8d6332bee85b3790332c4',
                repo: 'eladmin-doc',
                owner: 'elunez',
                admin: ['elunez'],
                distractionFreeMode: false
            }
        },
        '@vuepress/back-to-top': {}
    },
    // 头部
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['link', { rel: 'icon', href: '/logo/small.png' }]
    ],
    // 网站标题及描述
    title: 'EL-ADMIN',
    description: '一个简单且易上手的 Spring boot 后台管理框架',
    // 主题配置
    themeConfig: {
        // 提取markdown中h2 和 h3 标题，显示在侧边栏上。
        sidebarDepth: 2,
        // 文档更新时间
        lastUpdated: '更新时间',
        // logo
        logo: '/logo/small.png',
        nav: [
            { text: '指南', link: '/guide/'},
            { text: '日志', link: '/version/V2.5/'},
            { text: '留言', link: '/leaveMessage/'},
            { text: '捐赠', link: '/donation/'},
            { text: '体验', link: 'https://el-admin.xin'},
            { text: '博客', link: 'https://www.ydyno.com/'},
            // 下拉列表
            {
                text: 'Github',
                items: [
                    {
                        text: '前端源码',
                        link: 'https://github.com/elunez/eladmin-web'
                    },
                    {
                        text: '后端源码',
                        link: 'https://github.com/elunez/eladmin'
                    },
                ]
            },
            {
                text: 'Gitee',
                items: [
                    {
                        text: '前端源码',
                        link: 'https://gitee.com/elunez/eladmin-web'
                    },
                    {
                        text: '后端源码',
                        link: 'https://gitee.com/elunez/eladmin'
                    }
                ]
            }
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '/guide/',
                        '/guide/kslj',
                        '/guide/ksks',
                        '/guide/hdsc',
                        '/guide/qdsc',
                        '/guide/xmbs'
                    ]
                },
                {
                    title: '其它',
                    collapsable: false,
                    children: [
                        '/guide/cjwt',
                        '/guide/gxdm'
                    ]
                },
                {
                    title: '版权',
                    collapsable: false,
                    children: [
                        '/guide/bqsm'
                    ]
                },
                {
                    title: '鸣谢',
                    collapsable: false,
                    children: [
                        '/guide/mx'
                    ]
                }
            ],
            '/leaveMessage/': [
                '/leaveMessage/',
            ],
            '/donation/': [
                '/donation/',
            ],
            '/version/': [
                {
                    title: '更新日志',
                    collapsable: false,
                    children: [
                        'V2.5',
                        'V2.4'
                    ]
                }
            ]
        },
        // 假如你的文档仓库和项目本身不在一个仓库：
        docsRepo: 'elunez/eladmin-doc',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '在 GitHub 上编辑此页！'
    }
}

