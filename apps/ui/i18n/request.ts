import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'th'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Bangkok',
  }
})
