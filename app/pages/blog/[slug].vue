<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()

const { data: post } = await useAsyncData(
  () => `blog-${String(route.params.slug)}-${locale.value}`,
  () =>
    queryCollection('blog')
      .where('slug', '=', String(route.params.slug))
      .where('locale', '=', locale.value as 'ru' | 'en')
      .first(),
  { watch: [locale] },
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: t('blog.notFound') })
}

const localizedTitle = computed(() => post.value?.title || 'Untitled')
const localizedExcerpt = computed(() => post.value?.excerpt || '')
const readingTime = computed(() => {
  const raw = String(post.value?.rawbody || '')
  const words = raw.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
})

const tocLinks = computed(() => post.value?.body?.toc?.links ?? [])

const { data: allPosts } = await useAsyncData(
  () => `blog-posts-related-${locale.value}`,
  () => queryCollection('blog').where('locale', '=', locale.value as 'ru' | 'en').all(),
  { watch: [locale] },
)
const relatedPosts = computed(() => {
  const currentSlug = String(route.params.slug)
  const list = (allPosts.value ?? []).filter((item) => item.slug !== currentSlug)
  return list.slice(0, 3).map((item) => ({
    ...item,
    localizedTitle: item.title || 'Untitled',
  }))
})

useSeoMeta({
  title: localizedTitle,
  description: localizedExcerpt,
  ogTitle: localizedTitle,
  ogDescription: localizedExcerpt,
  ogType: 'article',
  ogImage: post.value.coverImage,
  ogUrl: `${config.public.siteUrl}${localePath(`/blog/${String(route.params.slug)}`)}`,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${localePath(`/blog/${String(route.params.slug)}`)}` }],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: localizedTitle.value,
        description: localizedExcerpt.value,
        datePublished: post.value.date,
        image: post.value.coverImage,
        mainEntityOfPage: `${config.public.siteUrl}${localePath(`/blog/${String(route.params.slug)}`)}`,
      }),
    },
  ],
})
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_280px]">
    <article class="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
      <img :src="post!.coverImage" :alt="localizedTitle" loading="lazy" class="mb-6 h-72 w-full rounded-xl object-cover" />
      <div class="mb-3 flex flex-wrap items-center gap-3 text-xs text-stone-500">
        <p>{{ post!.date }}</p>
        <p>{{ readingTime }} {{ t('blog.readingTime') }}</p>
      </div>
      <h1 class="mb-5 text-3xl font-bold text-stone-900">{{ localizedTitle }}</h1>
      <ContentRenderer :value="post!" class="prose prose-stone max-w-none" />
    </article>

    <aside class="space-y-5">
      <section v-if="tocLinks.length" class="sticky top-24 rounded-2xl border border-stone-200 bg-white p-4">
        <h2 class="mb-3 text-sm font-semibold text-stone-900">{{ t('blog.toc') }}</h2>
        <ul class="space-y-2 text-sm text-stone-600">
          <li v-for="link in tocLinks" :key="link.id">
            <a :href="`#${link.id}`" class="hover:text-emerald-700">{{ link.text }}</a>
          </li>
        </ul>
      </section>
      <section class="rounded-2xl border border-stone-200 bg-white p-4">
        <h2 class="mb-3 text-sm font-semibold text-stone-900">{{ t('blog.related') }}</h2>
        <ul class="space-y-2 text-sm">
          <li v-for="related in relatedPosts" :key="related.slug">
            <NuxtLink :to="localePath(`/blog/${related.slug}`)" class="text-stone-700 hover:text-emerald-700">
              {{ related.localizedTitle }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>
