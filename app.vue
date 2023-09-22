<script lang="ts" setup>

useHead({
  title: 'Nogizaka46',
  titleTemplate: '%s - Gsap Nuxt3',
  htmlAttrs: {
    lang: 'zh-TW'
  },
  meta: [
    { name: 'title', content: 'Nogizaka46 - Gsap Nuxt3' },
    { name: 'description', content: 'Nogizaka46 - Gsap Nuxt3' },
    { name: 'keywords', content: 'Nogizaka46 - Gsap Nuxt3' },
    { property: 'image', content: 'Nogizaka46 - Gsap Nuxt3' },
    { property: 'og:title', content: 'Nogizaka46 - Gsap Nuxt3' },
    { property: 'og:description', content: 'Nogizaka46 - Gsap Nuxt3' },
    { property: 'og:image', content: 'Nogizaka46 - Gsap Nuxt3' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/nogizaka46.ico' },
    { rel: 'apple-touch-icon', type: 'image/x-icon', href: '/nogizaka46.ico' }
  ]
})

</script>

<template>
  <div>
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
