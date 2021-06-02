import Vue from 'vue'

Vue.use(require('vue-script2'))

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
      if (to.path !== from.path && to.path !== '/' && from.name !== null) {
        let paras = document.getElementById('el-adsense-content');
        if (paras){
          paras.innerHTML = '';
          paras.innerHTML = '<div data-ea-publisher="el-admin" data-ea-type="text"/>';
          var id = "ethicalads-eladmin";
          var oldjs = document.getElementById(id);
          if(oldjs) oldjs.parentNode.removeChild(oldjs);
          var scriptObj = document.createElement("script");
          scriptObj.src = "https://el-admin.vip/ad.js";
          scriptObj.type = "text/javascript";
          scriptObj.id = id;
          document.getElementsByTagName("head")[0].appendChild(scriptObj);
        }
      }
    }
    next();
  });
}
