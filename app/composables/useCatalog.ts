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
  patterns: { ru: 'PDF-описания', en: 'PDF Patterns' },
  schema: { ru: 'Схемы', en: 'Patterns' },
  toys: { ru: 'Игрушки', en: 'Toys' },
  eco: { ru: 'Эко', en: 'Eco' },
  kitchen: { ru: 'Кухня', en: 'Kitchen' },
  decor: { ru: 'Декор', en: 'Decor' },
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

const normalizeTerm = (value: string) => value.trim().toLowerCase()

const LABELS: Record<string, { ru: string; en: string }> = {
  new: { ru: 'Новинка', en: 'New' },
  bestseller: { ru: 'Бестселлер', en: 'Bestseller' },
  limited: { ru: 'Ограниченная серия', en: 'Limited' },
  handmade: { ru: 'Ручная работа', en: 'Handmade' },
  hit: { ru: 'Хит', en: 'Hit' },
}

export const getCategoryKey = (category: string) => normalizeTerm(category)

export const getProductCategory = (product: CatalogProduct): string => {
  if (product.categories?.length) {
    return product.categories[0] || product.slug
  }
  if (product.category) {
    return product.category
  }
  return product.slug.split('-')[0] || product.slug
}

export const getProductCategories = (product: CatalogProduct): string[] => {
  if (product.categories?.length) {
    return product.categories
  }
  return [getProductCategory(product)]
}

export const getCategoryLabel = (category: string, locale: string) => {
  return CATEGORY_LABELS[category]?.[locale as 'ru' | 'en'] || category
}

const roundUsd = (value: number) => Math.round(value * 100) / 100
const roundRub = (value: number) => Math.round(value)

export const normalizePriceValue = (value: number | PriceValue | PartialPriceValue): PriceValue => {
  if (typeof value === 'number') {
    // Backward compatibility: numeric value is treated as USD.
    return {
      usd: roundUsd(value),
      rub: roundRub(value * USD_TO_RUB_RATE),
    }
  }

  if (value.usd !== undefined && value.rub !== undefined) {
    return {
      usd: roundUsd(value.usd),
      rub: roundRub(value.rub),
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

export const getProductLabels = (product: CatalogProduct, locale: string) => {
  const labels = (product.labels || []).map((label) => LABELS[label]?.[locale as 'ru' | 'en'] || label)
  if (product.hasPdf && !product.is_schema) {
    labels.unshift('PDF')
  }
  if (product.is_schema) {
    labels.unshift(locale === 'ru' ? 'Схема' : 'Pattern')
  }
  return Array.from(new Set(labels.filter(Boolean)))
}
