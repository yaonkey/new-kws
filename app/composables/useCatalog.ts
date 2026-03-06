import type { CatalogProduct } from '~/composables/useCart'

export interface PriceValue {
  rub: number
  usd: number
}

export interface PartialPriceValue {
  rub?: number
  usd?: number
}

const USD_TO_RUB_RATE = 90

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

const normalizeTerm = (value: string) => value.trim().toLowerCase()

const LABELS: Record<string, { ru: string; en: string }> = {
  new: { ru: 'Новинка', en: 'New' },
  hit: { ru: 'Хит', en: 'Hit' },
  keychain: { ru: 'Брелок', en: 'Keychain' },
  pdf: { ru: 'С описанием', en: 'With schema' },
  gacha: { ru: 'Гача', en: 'Gacha' },
  sale: { ru: 'Скидка', en: 'Sale' },
}

export const getCategoryKey = (category: string) => normalizeTerm(category)

const getLocalizedLabel = (key: string, locale: string) => LABELS[key]?.[locale as 'ru' | 'en'] || key

export const getProductLabelKeys = (product: CatalogProduct) => {
  const keys = new Set((product.labels || []).map(getCategoryKey))
  if (product.hasPdf && !product.is_schema) {
    keys.add('pdf')
  }
  if (product.salePrice) {
    keys.add('sale')
  }
  return Array.from(keys)
}

export const getProductCategory = (product: CatalogProduct): string => {
  return getProductLabelKeys(product)[0] || ''
}

export const getProductCategories = (product: CatalogProduct): string[] => {
  return getProductLabelKeys(product)
}

export const getCategoryLabel = (category: string, locale: string) => {
  return getLocalizedLabel(getCategoryKey(category), locale)
}

const roundUsd = (value: number) => Math.round(value * 100) / 100
const roundRub = (value: number) => Math.round(value)

export const normalizePriceValue = (value: number | PriceValue | PartialPriceValue): PriceValue => {
  if (typeof value === 'number') {
    // Backward compatibility for legacy values.
    return {
      usd: roundUsd(value),
      rub: roundRub(value * USD_TO_RUB_RATE),
    }
  }

  if (value.usd !== undefined && value.rub !== undefined) {
    return {
      rub: roundRub(value.rub),
      usd: roundUsd(value.usd),
    }
  }

  if (value.usd !== undefined) {
    return {
      usd: roundUsd(value.usd),
      rub: roundRub(value.usd * USD_TO_RUB_RATE),
    }
  }

  if (value.rub !== undefined) {
    return {
      rub: roundRub(value.rub),
      usd: roundUsd(value.rub / USD_TO_RUB_RATE),
    }
  }

  return {
    rub: 0,
    usd: 0,
  }
}

export const getPriceByLocale = (value: number | PriceValue, locale: string) => {
  const normalized = normalizePriceValue(value)
  return locale === 'ru' ? normalized.rub : normalized.usd
}

export const getCurrencyByLocale = (locale: string) => {
  return locale === 'ru' ? 'РУБ' : 'USD'
}

export const getProductImages = (product: CatalogProduct) => {
  let rawImages: unknown[] = []

  if (Array.isArray(product.image)) {
    rawImages = product.image
  } else if (typeof product.image === 'string') {
    const trimmed = product.image.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        rawImages = Array.isArray(parsed) ? parsed : [product.image]
      } catch {
        rawImages = [product.image]
      }
    } else {
      rawImages = [product.image]
    }
  }

  const images = rawImages.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
  return images.length ? images : ['/images/product-placeholder.svg']
}

export const getPrimaryProductImage = (product: CatalogProduct) => {
  return getProductImages(product)[0]
}

export const getProductBasePrice = (product: CatalogProduct) => normalizePriceValue(product.price)
export const getProductEffectivePrice = (product: CatalogProduct) => normalizePriceValue(product.salePrice ?? product.price)
export const hasSalePrice = (product: CatalogProduct) => Boolean(product.salePrice)

export const getProductLabels = (product: CatalogProduct, locale: string) => {
  return getProductLabelKeys(product).map((label) => getLocalizedLabel(label, locale)).filter(Boolean)
}
