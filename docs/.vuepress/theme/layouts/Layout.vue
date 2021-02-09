<template>
  <ParentLayout>
    <AdSense slot="sidebar-bottom"/>
    <InArticleAdsense style="max-width: 740px;margin: 0 auto;" data-ad-client="ca-pub-3964897280370772" data-ad-slot="8192154900" slot="page-bottom" />
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import AdSense from '../components/AdSense.vue'
export default {
  components: {
    ParentLayout,
    AdSense
  }
}
</script>
