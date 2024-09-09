export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  /**
   * 路由切换事件处理
   */
  router.beforeEach((to, from, next) => {
    //触发百度的pv统计
    import('vue-google-adsense')
          .then(module => {
              const Ads = module.default
              Vue.use(require('vue-script2'))
              Vue.use(Ads.Adsense)
              Vue.use(Ads.InArticleAdsense)
              Vue.use(Ads.InFeedAdsense)
          })
          .catch(e => {
              console.log(e)
    })
    if (typeof _hmt != "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }
    next();
  });
}
