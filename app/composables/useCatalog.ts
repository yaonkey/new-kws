import type { CatalogProduct } from '~/composables/useCart'

export interface PriceValue {
  rub: number
  usd: number
}

const CATEGORY_LABELS: Record<string, { ru: string; en: string }> = {
  knitted: { ru: 'Вязаные изделия', en: 'Knitted' },
  wooden: { ru: 'Деревянные игрушки', en: 'Wooden' },
  macrame: { ru: 'Макраме', en: 'Macrame' },
  ceramic: { ru: 'Керамика', en: 'Ceramic' },
  felt: { ru: 'Фетр', en: 'Felt' },
  linen: { ru: 'Лен', en: 'Linen' },
  embroidery: { ru: 'Вышивка', en: 'Embroidery' },
  candles: { ru: 'Свечи', en: 'Candles' },
  wool: { ru: 'Шерстяные изделия', en: 'Wool' },
  table: { ru: 'Декор стола', en: 'Table Decor' },
  gift: { ru: 'Подарочные боксы', en: 'Gift Boxes' },
  holiday: { ru: 'Праздничный декор', en: 'Holiday' },
}

export const getLocalizedField = (
  value: unknown,
  locale: string,
  fallback = '',
) => {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object') {
    const dictionary = value as Record<string, string | undefined>
    return dictionary[locale] || dictionary.ru || dictionary.en || fallback
  }

  return fallback
}

export const getProductCategory = (product: CatalogProduct) => {
  if (product.category) {
    return product.category
  }
  return product.slug.split('-')[0]
}

export const getCategoryLabel = (category: string, locale: string) => {
  return CATEGORY_LABELS[category]?.[locale as 'ru' | 'en'] || category
}

export const normalizePriceValue = (value: number | PriceValue): PriceValue => {
  if (typeof value === 'number') {
    return {
      usd: value,
      rub: Math.round(value * 90),
    }
  }

  return {
    rub: value.rub,
    usd: value.usd,
  }
}

export const getPriceByLocale = (value: number | PriceValue, locale: string) => {
  const normalized = normalizePriceValue(value)
  return locale === 'ru' ? normalized.rub : normalized.usd
}

export const getCurrencyByLocale = (locale: string) => {
  return locale === 'ru' ? 'RUB' : 'USD'
}

export const getProductImages = (product: CatalogProduct) => {
  const rawImages = Array.isArray(product.image) ? product.image : [product.image]
  const images = rawImages.filter((image) => typeof image === 'string' && image.trim().length > 0)
  return images.length ? images : ['/images/product-placeholder.svg']
}

export const getPrimaryProductImage = (product: CatalogProduct) => {
  return getProductImages(product)[0]
}
