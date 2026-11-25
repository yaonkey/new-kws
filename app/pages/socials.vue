<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { open: openCart } = useCartDrawer()
const openFaq = ref<number | null>(0)

const socials = [
  { key: 'vk', href: 'https://vk.com/kofworkshop' },
  { key: 'telegram', href: 'https://t.me/kofworkshop' },
  { key: 'instagram', href: 'https://instagram.com/kofworkshop' },
  { key: 'reddit', href: 'https://www.reddit.com/r/kofworkshop/' },
  { key: 'boosty', href: 'https://boosty.to/kofonkina' },
  { key: 'pinterest', href: 'https://www.pinterest.com/kofworkshop/' },
  { key: 'flowwow', href: 'https://flowwow.com/shop/kofworkshop/' },
  { key: 'twitch', href: 'https://twitch.tv/bakasempaides' },
  { key: 'pikabu', href: 'https://pikabu.ru/@megawhat' },
]

const ru = computed(() => locale.value === 'ru')

const facts = computed(() => ru.value
  ? [
      { value: 'от 3 до 20', note: 'дней, пока свяжем' },
      { value: '3 службы', note: 'Почта, Озон и Яндекс' },
      { value: 'перевод', note: 'когда заказ уже подтверждён' },
      { value: 'Пн–Пт', note: 'в выходные пишем чуть позже' },
    ]
  : [
      { value: '3 to 20', note: 'days to knit it' },
      { value: '3 carriers', note: 'Post, Ozon and Yandex' },
      { value: 'transfer', note: 'once the order is confirmed' },
      { value: 'Mon–Fri', note: 'weekends get a slower reply' },
    ])

const steps = computed(() => ru.value
  ? [
      { title: 'Собрали', text: 'Кладёте в корзину то, что хочется забрать. Список сохранится, даже если закрыть страницу и вернуться завтра.', href: localePath('/products'), link: 'заглянуть в каталог →' },
      { title: 'Написали', text: 'Кнопка откроет телеграм и подставит текст заказа. Мы проверим, что вещь свободна, и напишем срок и куда перевести оплату.', action: 'cart' as const, link: 'открыть корзину →' },
      { title: 'Забрали', text: 'В Москве привозим к метро за 100–350 ₽. По России отправляем Почтой, Озоном или Яндексом. Самим можно забрать в пос. Рублево, ул. Новорублевская, д. 2.', href: '#delivery', link: 'куда везём →' },
    ]
  : [
      { title: 'Gather', text: 'Put what you want into the cart. The list stays even if you close the page and come back tomorrow.', href: localePath('/products'), link: 'browse the catalog →' },
      { title: 'Write', text: 'The button opens Telegram and fills in the order. We check that the piece is free, then send the timing and where to transfer.', action: 'cart' as const, link: 'open the cart →' },
      { title: 'Collect', text: 'In Moscow we bring it to a metro station for 100–350 RUB. Across Russia we ship with the Post, Ozon or Yandex. You can also pick it up in Rublyovo, Novorublevskaya 2.', href: '#delivery', link: 'where it goes →' },
    ])

const conditions = computed(() => ru.value
  ? [
      { title: 'Срок', text: 'Вяжем от 3 до 20 дней. Точное число пишем в переписке, когда заказ уже подтверждён.' },
      { title: 'Как доедет', text: 'По Москве к метро — 100–350 ₽. По России — Почта, Озон или Яндекс. Можно забрать самим в Рублёво.' },
      { title: 'Как платить', text: 'На сайте оплаты нет. Когда заказ подтверждён, реквизиты приходят в телеграм.' },
      { title: 'Если уже уехала', text: 'Почти всё можно связать ещё раз. Если вещь одна и повтора не будет, скажем сразу.' },
    ]
  : [
      { title: 'Timing', text: 'Knitting takes 3 to 20 days. We write the exact number in the chat once the order is confirmed.' },
      { title: 'How it travels', text: 'Moscow metro delivery is 100–350 RUB. Across Russia: the Post, Ozon or Yandex. Pickup in Rublyovo is fine too.' },
      { title: 'How to pay', text: 'The site does not charge you. Once the order is confirmed, the details arrive in Telegram.' },
      { title: 'If it already left', text: 'Almost everything can be knitted again. If a piece is one of a kind, we say so at once.' },
    ])

const deliveries = computed(() => ru.value
  ? [
      { title: 'Москва', price: '100–350 ₽', text: 'Привозим к станции метро. Напишите станцию и телефон.' },
      { title: 'Почта России', price: 'по тарифу', text: 'Отправка по стране. Нужны индекс, адрес, ФИО и телефон.' },
      { title: 'Озон', price: 'по тарифу', text: 'Нужны город, пункт выдачи и телефон получателя.' },
      { title: 'Яндекс', price: 'по тарифу', text: 'Нужны город, адрес пункта и телефон, чтобы курьер нашёл вас.' },
      { title: 'Самовывоз', price: '0 ₽', text: 'пос. Рублево, ул. Новорублевская, д. 2. Час встречи выбираем в переписке.' },
    ]
  : [
      { title: 'Moscow', price: '100–350 RUB', text: 'We bring it to a metro station. Send the station and a phone number.' },
      { title: 'Russian Post', price: 'by rate', text: 'Ships across the country. We need a postal code, address, full name and phone.' },
      { title: 'Ozon', price: 'by rate', text: 'We need the city, the pickup point and the recipient’s phone.' },
      { title: 'Yandex', price: 'by rate', text: 'We need the city, the point address and a phone so the courier can find you.' },
      { title: 'Pickup', price: '0 RUB', text: 'Rublyovo, Novorublevskaya 2. We pick the hour in the chat.' },
    ])

const faqs = computed(() => ru.value
  ? [
      { q: 'Можно заказать то, чего нет в каталоге?', a: 'В каталоге то, что уже вязали. Персонажа можно предложить: если пряжа есть, работа встанет в очередь.' },
      { q: 'Сколько выйдет доставка?', a: 'До метро в Москве — 100–350 ₽. По России цена зависит от службы и города, её напишем в переписке.' },
      { q: 'Свяжете ещё раз то, что уже уехало?', a: 'Чаще всего да. Игрушка вяжется заново, срок тот же — от 3 до 20 дней.' },
      { q: 'Что лежит в посылке?', a: 'Сама игрушка и короткая записка из мастерской.' },
      { q: 'Когда ответите?', a: 'В будни обычно в тот же день. В субботу и воскресенье ответ может прийти в понедельник.' },
    ]
  : [
      { q: 'Can I ask for something that is not in the catalog?', a: 'The catalog is what we have knitted before. Suggest a character, and if the yarn is on hand the work joins the queue.' },
      { q: 'What will delivery cost?', a: 'To a Moscow metro station it is 100–350 RUB. Across Russia it depends on the carrier and the city, and we write the number in the chat.' },
      { q: 'Will you knit again something that already left?', a: 'Most of the time, yes. It is knitted from scratch, so the wait is the same: 3 to 20 days.' },
      { q: 'What is in the parcel?', a: 'The toy itself and a short note from the workshop.' },
      { q: 'When will you reply?', a: 'On weekdays, usually the same day. On Saturday and Sunday the reply may wait until Monday.' },
    ])

useSeoMeta({
  title: t('seo.socialsTitle'),
  description: t('socials.subtitle'),
  ogTitle: `Kofworkshop - ${t('seo.socialsTitle')}`,
  ogDescription: t('socials.subtitle'),
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}${localePath('/socials')}`,
})
</script>

<template>
  <div>
    <section class="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div v-reveal class="reveal">
        <p class="text-xs uppercase tracking-[0.22em] text-circus-red">{{ ru ? 'сроки, доставка, оплата' : 'timing, delivery, payment' }}</p>
        <h1 class="circus-heading mt-2 text-5xl font-bold leading-none md:text-6xl">{{ ru ? 'Три шага и ни одной анкеты' : 'Three steps and no form to fill' }}</h1>
        <svg class="zigzag mt-3 h-4 w-36 text-circus-red" viewBox="0 0 140 16" fill="none" aria-hidden="true">
          <path d="M2 12 L14 4 L26 12 L38 4 L50 12 L62 4 L74 12 L86 4 L98 12 L110 4 L122 12 L134 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-4 max-w-xl text-circus-muted">
          {{ ru
            ? 'Платить на сайте не нужно и заполнять нечего. Кладёте выбранное в корзину, жмёте одну кнопку — и дальше договариваемся в переписке.'
            : 'Nothing is paid or filled in on the site. Put your picks in the cart, press one button, and we sort out the rest in a chat.' }}
        </p>
        <p class="script mt-3 text-2xl text-[#f3c7cb]">{{ ru ? 'мы на связи в телеграме' : 'we are in Telegram' }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/products')" class="circus-btn-primary">{{ ru ? 'Смотреть каталог и цены' : 'See the catalog and prices' }}</NuxtLink>
          <a href="https://t.me/kofworkshop" target="_blank" rel="noopener noreferrer" class="circus-btn-secondary">{{ ru ? 'Написать в телеграм' : 'Message on Telegram' }}</a>
        </div>
      </div>
      <aside v-reveal class="paper reveal grid grid-cols-2 gap-4 p-5" style="--rd: 100ms">
        <div v-for="fact in facts" :key="fact.value">
          <p class="font-display text-2xl font-bold leading-none">{{ fact.value }}</p>
          <p class="mt-1 text-sm paper-muted">{{ fact.note }}</p>
        </div>
      </aside>
    </section>

    <section class="mt-14">
      <p class="text-xs uppercase tracking-[0.22em] text-circus-red">{{ ru ? 'со стороны покупателя' : 'from your side' }}</p>
      <h2 class="circus-heading mt-2 text-4xl font-bold">{{ ru ? 'Как устроен заказ' : 'How an order works' }}</h2>
      <p class="script mt-1 text-2xl text-[#f3c7cb]">{{ ru ? 'от «хочу эту» до «уже у меня»' : 'from “I want this one” to “it is mine”' }}</p>
      <ol class="mt-6 grid gap-4 md:grid-cols-3">
        <li v-for="(step, index) in steps" :key="step.title" v-reveal class="paper reveal p-5" :style="{ '--rd': `${index * 80}ms` }">
          <p class="text-xs uppercase tracking-[0.16em] text-circus-red">{{ index + 1 }}</p>
          <h3 class="mt-2 font-display text-2xl font-bold">{{ step.title }}</h3>
          <p class="mt-2 text-sm paper-muted">{{ step.text }}</p>
          <NuxtLink v-if="step.href" :to="step.href" class="mt-3 inline-block text-sm font-semibold text-circus-red">{{ step.link }}</NuxtLink>
          <button v-else class="mt-3 text-sm font-semibold text-circus-red" @click="openCart">{{ step.link }}</button>
        </li>
      </ol>
    </section>

    <section class="mt-14">
      <h2 class="circus-heading text-4xl font-bold">{{ ru ? 'Условия' : 'Terms' }}</h2>
      <div class="mt-5 grid gap-3 md:grid-cols-2">
        <article v-for="item in conditions" :key="item.title" class="paper p-5">
          <h3 class="font-display text-xl font-bold">{{ item.title }}</h3>
          <p class="mt-2 text-sm paper-muted">{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section id="delivery" class="mt-14">
      <h2 class="circus-heading text-4xl font-bold">{{ ru ? 'Доставка' : 'Delivery' }}</h2>
      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="item in deliveries" :key="item.title" class="paper p-5">
          <h3 class="font-display text-xl font-bold">{{ item.title }}</h3>
          <p class="script text-2xl text-circus-red">{{ item.price }}</p>
          <p class="mt-2 text-sm paper-muted">{{ item.text }}</p>
        </article>
      </div>
      <article class="paper mt-3 p-5">
        <h3 class="font-display text-xl font-bold">{{ ru ? 'Что будет в коробке' : 'What is in the box' }}</h3>
        <p class="mt-2 paper-muted">{{ ru ? 'Игрушка и маленькая записка из мастерской.' : 'The toy and a little note from the workshop.' }}</p>
      </article>
    </section>

    <section class="mt-14">
      <h2 class="circus-heading text-4xl font-bold">{{ ru ? 'Короткие ответы' : 'Short answers' }}</h2>
      <div class="mt-4 space-y-2">
        <article v-for="(item, index) in faqs" :key="item.q" class="paper overflow-hidden">
          <button class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold" @click="openFaq = openFaq === index ? null : index">
            {{ item.q }}
            <span class="faq-mark text-circus-red" :class="{ 'is-open': openFaq === index }">+</span>
          </button>
          <div class="faq-panel" :class="{ 'is-open': openFaq === index }">
            <div class="faq-panel-clip">
              <p class="faq-panel-text px-5 pb-4 text-sm paper-muted">{{ item.a }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="paper mt-14 p-6 md:p-8">
      <h2 class="font-display text-3xl font-bold">{{ ru ? 'Пора писать?' : 'Time to write?' }}</h2>
      <p class="mt-2 max-w-xl paper-muted">
        {{ ru
          ? 'Если игрушка уже в корзине — откройте её, текст заказа соберётся сам. Если пусто — начните с каталога.'
          : 'If a toy is already in the cart, open it and the order text writes itself. If it is empty, start from the catalog.' }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="circus-btn-primary" @click="openCart">{{ ru ? 'Открыть корзину' : 'Open the cart' }}</button>
        <NuxtLink :to="localePath('/products')" class="circus-btn-secondary">{{ ru ? 'В каталог' : 'To the catalog' }}</NuxtLink>
      </div>
    </section>

    <section class="mt-14">
      <h2 class="circus-heading text-3xl font-bold">{{ ru ? 'Соцсети' : 'Socials' }}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="social in socials"
          :key="social.key"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="paper flex items-center justify-between px-5 py-4 hover:-translate-y-1"
        >
          <span class="font-semibold">{{ t(`social.${social.key}`) }}</span>
          <span class="text-sm paper-muted">{{ social.href.replace('https://', '') }}</span>
        </a>
      </div>
    </section>
  </div>
</template>
