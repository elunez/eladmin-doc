<template>
  <ParentLayout>
    <PostAdSense slot="page-top"/>
    <AdSense slot="sidebar-top"/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import AdSense from '../components/AdSense.vue'
import PostAdSense from '../components/PostAdSense.vue'
export default {
  components: {
    ParentLayout,
    AdSense,
    PostAdSense
  }
}
</script>
