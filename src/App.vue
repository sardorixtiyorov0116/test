<template>
  <SingleUpload :max-size="20 * 1024 * 1024" />
  <MultipleUpload :max-size="20 * 1024 * 1024" :max-element-count="5" />
</template>
<script setup lang="ts">
import SingleUpload from "./components/SingleUpload.vue";
import MultipleUpload from "./components/MultipleUpload.vue";
</script>
