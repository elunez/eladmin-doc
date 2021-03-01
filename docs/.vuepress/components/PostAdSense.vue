<template>
  <div id="el-adsense-content-post" v-if="show">
    <!-- 原生文章 -->
    <ins class="adsbygoogle"
         style="display:inline-block;width:740px;height:55px"
         data-ad-client="ca-pub-3964897280370772"
         data-ad-slot="2070120178" />
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
</template>

<script>
export default {
  name: 'PostAdSense',
  data() {
    return {
      show: false
    }
  },
  mounted() {
    let paras = document.getElementsByClassName('google-auto-placed')
    if(paras.length === 0){
      this.show = true
    }
  }
}
</script>

<style scoped>
#el-adsense-content-post {
  display: block;
  font-size: .75rem;
  max-height:55px;
  max-width:740px;
  margin: 0 auto !important;
}
</style>
