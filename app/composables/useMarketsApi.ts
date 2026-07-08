export type UpcomingMarket = {
  name: string
  start_date: string
  end_date: string
  date_range_label: string
  address?: string
  link?: string
  is_current: boolean
  is_past: boolean
}

type DateParts = { year: number; month: number; day: number }

const parseISODate = (value: string): DateParts => {
  const [year, month, day] = value.split('-').map((part) => Number(part))
  return { year, month, day }
}

const RU_MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

const formatRuDate = ({ year, month, day }: DateParts) =>
  `${day} ${RU_MONTHS_GENITIVE[month - 1]} ${year}`

const monthName = (month: number, locale: string) => {
  if (locale === 'ru') {
    return RU_MONTHS_GENITIVE[month - 1]
  }
  const tag = 'en-US'
  return new Intl.DateTimeFormat(tag, { month: 'long' }).format(new Date(2024, month - 1, 1))
}

const formatDayMonthYear = (parts: DateParts, locale: string) => {
  if (locale === 'ru') {
    return formatRuDate(parts)
  }
  const tag = 'en-US'
  return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(parts.year, parts.month - 1, parts.day),
  )
}

/** Период проведения: всегда start-end, без подстановки «сегодня». */
export const formatMarketPeriod = (market: UpcomingMarket, locale: string) => {
  const start = parseISODate(market.start_date)
  const end = parseISODate(market.end_date)

  if (start.year === end.year && start.month === end.month && start.day === end.day) {
    return formatDayMonthYear(start, locale)
  }

  if (start.year === end.year && start.month === end.month) {
    const month = monthName(start.month, locale)
    if (locale === 'ru') {
      return `${start.day}-${end.day} ${month} ${start.year}`
    }
    return `${month} ${start.day}-${end.day}, ${start.year}`
  }

  if (start.year === end.year && locale === 'ru') {
    return `${start.day} ${RU_MONTHS_GENITIVE[start.month - 1]} - ${end.day} ${RU_MONTHS_GENITIVE[end.month - 1]} ${start.year}`
  }

  return `${formatDayMonthYear(start, locale)} - ${formatDayMonthYear(end, locale)}`
}

export const useMarketsApi = () => {
  const config = useRuntimeConfig()

  const fetchUpcomingMarket = async (): Promise<UpcomingMarket | null> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      return null
    }
    try {
      const response = await $fetch<{ market: UpcomingMarket | null }>(`${baseUrl}/api/v1/markets/upcoming`)
      return response.market ?? null
    } catch {
      return null
    }
  }

  return { fetchUpcomingMarket, formatMarketPeriod }
}
