const formatCurrencyValue = (value: number) => `${value}`

export const useTelegramCheckout = () => {
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  const cart = useCart()
  const currency = computed(() => (locale.value === 'ru' ? 'RUB' : 'USD'))
  const telegramUsername = computed(() => String(config.public.telegramUsername || '').trim().replace(/^@+/, ''))

  const telegramMessage = computed(() => {
    if (!cart.items.value.length) {
      return ''
    }

    const intro = locale.value === 'ru'
      ? ['Здравствуйте!', 'Хочу оформить заказ:', '']
      : ['Hello!', 'I would like to order:', '']

    const productItems = cart.items.value.filter((item) => item.kind === 'product')
    const pdfItems = cart.items.value.filter((item) => item.kind === 'pdf')

    const productTitle = locale.value === 'ru' ? 'Товары:' : 'Products:'
    const pdfTitle = locale.value === 'ru' ? 'PDF-описания:' : 'PDF descriptions:'

    const mapLine = (item: (typeof cart.items.value)[number], index: number) => {
      const localizedTitle = item.title[locale.value as 'ru' | 'en'] || item.title.ru
      const unitPrice = locale.value === 'ru' ? item.price.rub : item.price.usd
      const lineTotal = unitPrice * item.quantity
      return `${index + 1}. ${localizedTitle} x${item.quantity} — ${formatCurrencyValue(lineTotal)}`
    }

    const lines: string[] = []
    if (productItems.length) {
      lines.push(productTitle)
      lines.push(...productItems.map(mapLine))
      lines.push('')
    }
    if (pdfItems.length) {
      lines.push(pdfTitle)
      lines.push(...pdfItems.map(mapLine))
      lines.push('')
    }

    const totalValue = locale.value === 'ru' ? cart.totals.value.rub : cart.totals.value.usd
    const totalLabel = locale.value === 'ru' ? 'Итого' : 'Total'
    const summary = ['', `${totalLabel}: ${formatCurrencyValue(totalValue)} ${currency.value}`]
    return [...intro, ...lines, ...summary].join('\n')
  })

  const shareCheckoutUrl = computed(() => {
    if (!telegramMessage.value) {
      return '#'
    }
    const encodedMessage = encodeURIComponent(telegramMessage.value)
    return `https://t.me/share/url?url=${encodeURIComponent(config.public.siteUrl || '')}&text=${encodedMessage}`
  })

  const checkoutUrl = computed(() => {
    if (!telegramMessage.value) {
      return '#'
    }

    const encodedMessage = encodeURIComponent(telegramMessage.value)
    if (telegramUsername.value) {
      return `https://t.me/${telegramUsername.value}?text=${encodedMessage}`
    }
    return shareCheckoutUrl.value
  })

  const checkoutAppUrl = computed(() => {
    if (!telegramMessage.value || !telegramUsername.value) {
      return ''
    }
    const encodedMessage = encodeURIComponent(telegramMessage.value)
    return `tg://resolve?domain=${telegramUsername.value}&text=${encodedMessage}`
  })

  const openCheckout = () => {
    if (typeof window === 'undefined' || !telegramMessage.value) {
      return
    }

    // Use single same-tab navigation to avoid popup blockers and double redirects.
    const targetUrl = checkoutAppUrl.value || checkoutUrl.value
    window.location.href = targetUrl
  }

  return {
    telegramMessage,
    checkoutUrl,
    checkoutAppUrl,
    shareCheckoutUrl,
    openCheckout,
  }
}
