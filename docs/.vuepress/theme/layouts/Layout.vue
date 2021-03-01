<template>
  <ParentLayout>
    <AdSense slot="sidebar-top"/>
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
