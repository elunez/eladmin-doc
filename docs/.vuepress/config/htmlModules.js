/** 插入自定义html模块 (可用于插入广告模块等)
 * {
 *   homeSidebarB: htmlString, 首页侧边栏底部
 *
 *   sidebarT: htmlString, 全局左侧边栏顶部
 *   sidebarB: htmlString, 全局左侧边栏底部
 *
 *   pageT: htmlString, 全局页面顶部
 *   pageB: htmlString, 全局页面底部
 *   pageTshowMode: string, 页面顶部-显示方式：未配置默认全局；'article' => 仅文章页①； 'custom' => 仅自定义页①
 *   pageBshowMode: string, 页面底部-显示方式：未配置默认全局；'article' => 仅文章页①； 'custom' => 仅自定义页①
 *
 *   windowLB: htmlString, 全局左下角②
 *   windowRB: htmlString, 全局右下角②
 * }
 *
 * ①注：在.md文件front matter配置`article: false`的页面是自定义页，未配置的默认是文章页（首页除外）。
 * ②注：windowLB 和 windowRB：1.展示区块宽高最大是200*200px。2.请给自定义元素定一个不超过200px的固定宽高。3.在屏宽小于960px时无论如何都不会显示。
 */
module.exports = {
  sidebarT: `
      <a href="/pages/050101/" style="margin-top: -8px;" target="_blank">
        <img src="/images/banner/side.jpeg" alt="搬瓦工" width="243px" height="70px">
      </a>
      <a href="/pages/050101/" style="text-align: center;margin-top: 2px;margin-bottom:0;display:block;color: #999;font-size: 12px;" target="_blank">🎉 优惠码: BWHNCXNVXV 6.81% 折扣</a>
  `,
  // 万维
  windowRB: `
    <div class="wwads-cn wwads-vertical" data-id="148" style="max-width:200px;"></div>
    <script>
        var ele = document.querySelector('.wwads-vertical').parentElement.parentElement;
        ele.style.maxHeight = 'unset';
        ele.firstChild.hidden = true;
    </script>
  `
};
