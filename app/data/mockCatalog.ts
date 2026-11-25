import type { CatalogProduct } from '~/composables/useCart'
import type { UpcomingMarket } from '~/composables/useMarketsApi'
import type { PublicShelf } from '~/composables/useShelvesApi'

const price = (rub: number) => ({ rub, usd: Math.round((rub / 90) * 100) / 100 })

const toy = (
  slug: string,
  title: string,
  category: { ru: string; en: string },
  rub: number,
  image: string,
  stock: number | null,
  description: string,
  labels: string[] = [],
): CatalogProduct => ({
  slug,
  category,
  labels,
  title: { ru: title, en: title },
  description: { ru: description, en: description },
  price: price(rub),
  image,
  stock,
})

export const mockProducts: CatalogProduct[] = [
  toy('dirty-kitten', 'Грязный котёнок', { ru: 'Котики', en: 'Cats' }, 2400, '/images/dirty-kitten-1.jpg', 2, 'Пушистый котёнок с характером. Высота около 20 см.', ['new']),
  toy('silver-kitty', 'Серебряный кот', { ru: 'Котики', en: 'Cats' }, 2800, '/images/silver-kitty-1.jpg', 0, 'Светлая пряжа и спокойная мордочка. Вяжется на заказ.'),
  toy('pumpkin-cat', 'Кот в тыкве', { ru: 'Котики', en: 'Cats' }, 3200, '/images/pumpkin-cat-1.jpg', 1, 'Осенний кот в шапочке-тыкве.', ['hit']),
  toy('cute-frog', 'Милая лягушка', { ru: 'Лягушки', en: 'Frogs' }, 1600, '/images/cute-frog-1.jpg', 3, 'Небольшая лягушка, которую удобно держать в ладони.'),
  toy('strawberry-toad', 'Клубничная жаба', { ru: 'Лягушки', en: 'Frogs' }, 2100, '/images/strawberry-toad-1.jpg', 0, 'Жаба в ягодной шапочке. Сейчас только под заказ.'),
  toy('dissatisfied-frog', 'Недовольная лягушка', { ru: 'Лягушки', en: 'Frogs' }, 1900, '/images/dissatisfied-frog-1.jpg', 1, 'Хмурый взгляд и мягкие лапки.'),
  toy('capybara', 'Капибара', { ru: 'Звери', en: 'Animals' }, 3500, '/images/capybara-1.jpg', 1, 'Спокойная капибара, около 25 см.', ['new']),
  toy('raccoon', 'Енот', { ru: 'Звери', en: 'Animals' }, 2700, '/images/raccoon-1.jpg', 0, 'Полосатый хвост и тёмная маска.'),
  toy('axolotl', 'Аксолотль', { ru: 'Звери', en: 'Animals' }, 2300, '/images/axolotl-1.jpg', null, 'Розовые жабры и круглая мордочка.'),
  toy('beanie-rabbit', 'Кролик в шапке', { ru: 'Звери', en: 'Animals' }, 2500, '/images/beanie-rabbit-1.jpg', 2, 'Кролик в мягкой шапочке.'),
  toy('harlequin', 'Арлекин', { ru: 'Цирк', en: 'Circus' }, 4200, '/images/harlequin-1.jpg', 1, 'Цирковой персонаж в колпаке.', ['hit']),
  toy('baphomet', 'Бафомет', { ru: 'Цирк', en: 'Circus' }, 4500, '/images/baphomet-1.jpg', 0, 'Крупная работа с рогами. Только на заказ.'),
  {
    slug: 'frog-pattern',
    category: { ru: 'Схемы', en: 'Patterns' },
    is_schema: true,
    title: { ru: 'Схема лягушки', en: 'Frog pattern' },
    description: { ru: 'PDF с пошаговым описанием вязания лягушки.', en: 'A PDF with the frog knitting steps.' },
    price: price(160),
    image: '/images/frog-1.jpg',
    hasPdf: true,
    stock: null,
  },
  {
    slug: 'kitten-pattern',
    category: { ru: 'Схемы', en: 'Patterns' },
    is_schema: true,
    title: { ru: 'Схема котёнка', en: 'Kitten pattern' },
    description: { ru: 'PDF с описанием котёнка и списком пряжи.', en: 'A PDF with the kitten pattern and yarn list.' },
    price: price(200),
    salePrice: price(160),
    image: '/images/silver-kitty-2.jpg',
    hasPdf: true,
    stock: null,
  },
]

export const mockMarket: UpcomingMarket = {
  name: 'Ярмарка на ВДНХ',
  start_date: '2026-12-06',
  end_date: '2026-12-07',
  date_range_label: '6-7 декабря 2026',
  address: 'Москва, ВДНХ',
  is_current: false,
  is_past: false,
}

export const mockShelves: PublicShelf[] = [
  { name: 'Полочка у метро', address: 'Москва' },
  { name: 'Мастерская', address: 'пос. Рублево, ул. Новорублевская, д. 2' },
]
