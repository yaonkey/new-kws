const formatCurrencyValue = (value: number) => `${value}`

export const useTelegramCheckout = () => {
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  const cart = useCart()
  const currency = computed(() => (locale.value === 'ru' ? 'RUB' : 'USD'))

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

  const checkoutUrl = computed(() => {
    if (!telegramMessage.value) {
      return '#'
    }
    return `https://t.me/${config.public.telegramUsername}?text=${encodeURIComponent(telegramMessage.value)}`
  })

  return {
    telegramMessage,
    checkoutUrl,
  }
}
