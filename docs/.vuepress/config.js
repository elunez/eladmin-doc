module.exports = {
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine',
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: 'slnTcOTAPQVydGNesVApRUcg-gzGzoHsz',
          appKey: 'Aeusc62FpStk4K4yVAiFonnU'
        }
      }
    ],
    ['@vuepress/back-to-top']
  ],
  title: 'EL-ADMIN',
  description: '使用 EL-ADMIN 快速构建你的 Web 程序',
  head: [
    ['link', { rel: 'icon', href: '/logo/small.png' }],
    ['script', {}, `
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?9dcf4bca9cc47caeef4caf5d5f982e86";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
  `]
  ],
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    // displayAllHeaders: true,
    sidebarDepth: 2, // 提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: '更新时间', // 文档更新时间
    logo: '/logo/small.png',
    nav:[
      { text: '指南', link: '/guide/' },
      { text: '捐赠', link: '/donation/' },
      { text: 'V2.4更新预告', link: '/version/V2.4/' },
      { text: 'V2.4新版体验', link: 'http://dev.auauz.net' },
      { text: '博客', link: 'https://www.ydyno.com/' },
      // 下拉列表
      {
        text: '项目地址',
        items: [
          {
            text: '前端(GitHub)',
            link: 'https://github.com/elunez/eladmin-web'
          },
          {
            text: '后端(GitHub)',
            link: 'https://github.com/elunez/eladmin'
          },
          {
            text: '前端(码云)',
            link: 'https://gitee.com/elunez/eladmin-web'
          },
          {
            text: '后端(码云)',
            link: 'https://gitee.com/elunez/eladmin'
          }
        ]
      }
    ],
    sidebar:{
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
            '/guide/rjrz',
            '/guide/gxdm',
            '/guide/bqsm'
          ]
        },
        {
          title: '捐赠',
          collapsable: false,
          children: [
            '/guide/jzzc'
          ]
        }
      ],
      '/donation/': [
        '/donation/',

      ],
      '/version/': [
        'V2.4',
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
