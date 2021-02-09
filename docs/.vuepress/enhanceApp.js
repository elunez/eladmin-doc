import Vue from 'vue'
import Ads from 'vue-google-adsense'

Vue.use(require('vue-script2'))
Vue.use(Ads.Adsense)
Vue.use(Ads.InArticleAdsense)
Vue.use(Ads.InFeedAdsense)

export default ({router}) => {
  /**
   * 路由切换事件处理
   * 路由切换
   */
  router.beforeEach((to, from, next) => {
    //触发百度的pv统计
    if (typeof _hmt != "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }
    // let paras = document.getElementsByClassName('adswrapper');
    // for(var i = 0; i<paras.length; i++){
    //   //删除元素 元素.parentNode.removeChild(元素);
    //   if (paras[i] != null)
    //     paras[i].parentNode.removeChild( paras[i]);
    // }
    next();
  });
}
