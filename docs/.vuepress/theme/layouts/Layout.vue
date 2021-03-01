<template>
  <ParentLayout>
    <AdSense slot="sidebar-top"/>
    <PostAdSense slot="page-bottom"/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import AdSense from '../../components/AdSense.vue'
import PostAdSense from '../../components/PostAdSense.vue'
export default {
  components: {
    ParentLayout,
    AdSense,
    PostAdSense
  }
}
</script>
