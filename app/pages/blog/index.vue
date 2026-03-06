<script setup lang="ts">
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()

const { data: posts } = await useAsyncData(
  () => `blog-posts-${locale.value}`,
  () => queryCollection('blog').where('locale', '=', locale.value as 'ru' | 'en').all(),
  { watch: [locale] },
)

const estimateReadingTime = (post: Record<string, any>) => {
  const raw = String(post?.rawbody || '')
  const words = raw.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
}

const sortedPosts = computed(() => {
  const allPosts = posts.value ?? []
  return [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      ...post,
      localizedTitle: post.title || 'Untitled',
      localizedExcerpt: post.excerpt || '',
      readingTime: estimateReadingTime(post),
    }))
})

useSeoMeta({
  title: t('seo.blogTitle'),
  description: t('blog.subtitle'),
  ogTitle: `Handmade Workshop - ${t('seo.blogTitle')}`,
  ogDescription: t('blog.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/blog')}`,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath('/blog')}` }],
})

const formatBlogDate = (date: string, currentLocale: string) => {
  return new Intl.DateTimeFormat(currentLocale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
</script>

<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-bold text-stone-900">{{ t('blog.title') }}</h1>
      <p class="mt-2 max-w-3xl text-stone-600">{{ t('blog.subtitle') }}</p>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <article
        v-for="post in sortedPosts"
        :key="post.slug"
        class="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <img
          :src="post.coverImage"
          :alt="post.localizedTitle"
          loading="lazy"
          class="h-56 w-full object-cover"
        />
        <div class="space-y-3 p-5">
          <div class="flex items-center justify-between text-xs text-stone-500">
            <p>{{ formatBlogDate(post.date, locale) }}</p>
            <p>{{ post.readingTime }} {{ t('blog.readingTime') }}</p>
          </div>
          <h2 class="text-xl font-semibold text-stone-900">{{ post.localizedTitle }}</h2>
          <p class="text-stone-600">{{ post.localizedExcerpt }}</p>
          <NuxtLink :to="localePath(`/blog/${post.slug}`)" class="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
            {{ t('blog.readMore') }}
          </NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>
