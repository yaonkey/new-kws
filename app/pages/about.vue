<script setup lang="ts">
const { t, locale } = useI18n()
const isRu = computed(() => locale.value === 'ru')

useSeoMeta({
  title: t('seo.aboutTitle'),
  description: t('about.description'),
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <section class="rounded-2xl border border-stone-200 bg-white p-8">
      <h1 class="text-3xl font-bold text-stone-900">
        {{ isRu ? 'О мастерской Kofworkshop' : 'About Kofworkshop' }}
      </h1>
      <p class="mt-4 leading-relaxed text-stone-700">
        {{
          isRu
            ? 'Мы - небольшая мастерская, где создаются игрушки, схемы и авторские handmade-изделия. Наша цель - делать теплые и живые вещи, которые радуют и детей, и взрослых.'
            : 'We are a small workshop creating toys, patterns, and original handmade products. Our goal is to make warm and meaningful things loved by both kids and adults.'
        }}
      </p>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <article class="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 class="text-xl font-semibold text-stone-900">{{ isRu ? 'Команда' : 'Team' }}</h2>
        <div class="mt-4 space-y-4 text-sm text-stone-700">
          <div class="rounded-lg border border-stone-200 p-4">
            <p class="font-semibold text-stone-900">{{ isRu ? 'Мария Кофонкина' : 'Maria Kofonkina' }}</p>
            <p>{{ isRu ? 'Главная вязальщица' : 'Lead craftswoman' }}</p>
            <a href="https://t.me/Kofonkina/" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex text-emerald-700 hover:text-emerald-800">
              Telegram
            </a>
          </div>
          <div class="rounded-lg border border-stone-200 p-4">
            <p class="font-semibold text-stone-900">{{ isRu ? 'Дмитрий Лисовский' : 'Dmitry Lisovsky' }}</p>
            <p>{{ isRu ? 'Разработчик и поддержка сайта' : 'Developer and website support' }}</p>
            <a href="https://t.me/ya0nkey/" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex text-emerald-700 hover:text-emerald-800">
              Telegram
            </a>
          </div>
        </div>
      </article>

      <article class="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 class="text-xl font-semibold text-stone-900">{{ isRu ? 'Доставка' : 'Delivery' }}</h2>
        <ul class="mt-4 space-y-2 text-sm text-stone-700">
          <li>{{ isRu ? 'Москва: доставка к метро (100-350 руб)' : 'Moscow: metro delivery (100-350 RUB)' }}</li>
          <li>{{ isRu ? 'Самовывоз: пос. Рублево, ул. Новорублевская, д. 2' : 'Pickup: Rublyovo, Novorublevskaya 2' }}</li>
          <li>{{ isRu ? 'По России: Почта России и Яндекс Доставка' : 'Russia-wide: Russian Post and Yandex Delivery' }}</li>
          <li>{{ isRu ? 'При заказе от 900 руб доставка по РФ - 100 руб' : 'For orders over 900 RUB, shipping in Russia is 100 RUB' }}</li>
        </ul>
      </article>
    </section>

    <section class="rounded-2xl border border-stone-200 bg-white p-6">
      <h2 class="text-xl font-semibold text-stone-900">{{ isRu ? 'Где нас найти' : 'Where to find us' }}</h2>
      <p class="mt-2 text-sm text-stone-700">
        {{
          isRu
            ? 'Мы делимся процессом и новинками в соцсетях: ВКонтакте, Reddit, Пикабу, Telegram и других.'
            : 'We share updates and process stories on social platforms: VK, Reddit, Pikabu, Telegram, and more.'
        }}
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <a href="https://kofworkshop.vercel.app/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          kofworkshop.vercel.app
        </a>
        <a href="https://t.me/Kofonkina/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          Telegram
        </a>
      </div>
    </section>
  </div>
</template>
