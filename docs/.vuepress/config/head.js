// Head Config
module.exports = [
  ["link", { rel: "icon", href: "/logo/small.png" }],
  [
    "meta",
    {
      name: "keywords",
      content: "eladmin,el-admin,eladmin官网,eladmin在线文档,eladmin学习"
    }
  ],
  ["meta", { name: "theme-color", content: "#11a8cd" }],
  ["meta", { "http-equiv": "Content-Type", content: "text/html;charset=gb2312" }],
  ["meta", { name: "sogou_site_verification", content: "K0Czk3nRO0" }],
  ["meta", { name: "360-site-verification", content: "0f840cb9fd8111aa6014e43d60b6ed79" }],
  ["script", { async: true, src: "https://cdn.wwads.cn/js/makemoney.js" }],
  ['script', {}, `
    // 万维广告“禁止”广告拦截
    function ABDetected() {
      var adBlockDetected_div = document.createElement("div");
      adBlockDetected_div.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; background: #fc6600; color: #fff; z-index: 9999999999; font-size: 14px; text-align: center; line-height: 1.5; font-weight: bold; padding-top: 6px; padding-bottom: 6px;";
      adBlockDetected_div.innerHTML = "我们的广告服务商 <a style='color:#fff;text-decoration:underline' target='_blank' href='https://wwads.cn/page/end-user-privacy'>并不跟踪您的隐私</a>，为了支持本站的长期运行，请将我们的网站 <a style='color: #fff;text-decoration:underline' target='_blank' href='https://wwads.cn/page/whitelist-wwads'>加入广告拦截器的白名单</a>。";
      document.getElementsByTagName("body")[0].appendChild(adBlockDetected_div);
      // add a close button to the right side of the div
      var adBlockDetected_close = document.createElement("div");
      adBlockDetected_close.style.cssText = "position: absolute; top: 0; right: 10px; width: 30px; height: 30px; background: #fc6600; color: #fff; z-index: 9999999999; line-height: 30px; cursor: pointer;";
      adBlockDetected_close.innerHTML = "×";
      adBlockDetected_div.appendChild(adBlockDetected_close);
      // add a click event to the close button
      adBlockDetected_close.onclick = function() {
      this.parentNode.parentNode.removeChild(this.parentNode);
      };
    }

    function docReady(t) {
      "complete" === document.readyState ||
      "interactive" === document.readyState
        ? setTimeout(t, 1)
        : document.addEventListener("DOMContentLoaded", t);
    }

    //check if wwads' fire function was blocked after document is ready with 3s timeout (waiting the ad loading)
    docReady(function () {
      setTimeout(function () {
        if( window._AdBlockInit === undefined ){
            ABDetected();
        }
      }, 3000);
    });
  `],
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
];
