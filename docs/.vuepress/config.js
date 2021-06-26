module.exports = {
    // 插件
    plugins: {
        '@vuepress/back-to-top': {},
        '@vuepress/active-header-links': {}
    },
    // 头部
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['link', { rel: 'icon', href: '/logo/small.png' }],
        [
            "script",
            {}, `
            var _hmt = _hmt || [];
            (function() {
            let aHtml = document.createElement('a');
              var hm = document.createElement("script");
              hm.src = "//hm.baidu.com/hm.js?6e843bf2bccfd3a2bf5e09f39934028a";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();`
        ]
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
        subSidebar: 'auto',
        logo: '/logo/small.png',
        author: 'ZhengJie',
        nav: [
            { text: '开发指南', link: '/guide/'},
            { text: '常见问题', link: '/problem/'},
            { text: '更新日志', link: '/version/'},
            { text: '体验地址', link: 'https://el-admin.xin'},
            { text: '作者博客', link: 'https://www.ydyno.com'},
            // 下拉列表
            {
                text: '源码下载',
                items: [
                    {
                        text: 'Github',
                        link: 'https://github.com/elunez/eladmin'
                    },
                    {
                        text: 'Gitee',
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
                        '/guide/gxdm',
                        '/guide/bqsm'
                    ]
                },
                {
                    title: '鸣谢',
                    collapsable: false,
                    children: [
                        '/guide/mx'
                    ]
                },
                {
                    title: '捐赠',
                    collapsable: false,
                    children: [
                        '/guide/donation'
                    ]
                }
            ],
            '/problem/': [
                '/problem/',
            ],
            '/version/': [
                {
                    title: '更新日志',
                    collapsable: false,
                    children: [
                        '/version/',
                        '/version/V2.5'
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

