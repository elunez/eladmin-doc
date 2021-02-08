export default ({
                  Vue,
                  options,
                  router,
                  siteData
                }) => {
  /**
   * 路由切换事件处理
   */
  router.beforeEach((to, from, next) => {
    //触发百度的pv统计
    if (typeof _hmt != "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }
    next();
  });
  if (typeof window !== 'undefined') {
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
  }
}
