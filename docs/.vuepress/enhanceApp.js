
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
    var ad = window.document.getElementsByClassName("custom-html-window-rb")[0];
    console.log(ad)
    if(to.fullPath === '/'){
      if(ad !== undefined){
        console.log(1)
      }
    } else {
      if(ad !== undefined){
        console.log(2)
      }
    }
    next();
  });
}
