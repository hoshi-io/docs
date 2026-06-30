<template>
  <div :class="{ 'is-custom': frontmatter.customLayout === 'landing' || frontmatter.customLayout === 'privacy' }">

    <div v-if="frontmatter.customLayout === 'landing'">
      <landing />
    </div>

    <div v-else-if="frontmatter.customLayout === 'privacy'">
      <privacy />
    </div>

    <DefaultTheme.Layout v-else />
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { frontmatter } = useData()
</script>

<style>
.is-custom .VPContent {
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
}

.is-custom .VPDoc {
  padding: 0 !important;
  margin: 0 !important;
}

body, html {
  margin: 0 !important;
  padding: 0 !important;
}
</style>