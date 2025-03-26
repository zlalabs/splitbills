'use client'

import Head from 'next/head'
import Link from 'next/link'

const Header = () => {
  // const t = useTranslations()

  return (
    <div className="header">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="navbar border-b dark:bg-slate-800 py-2 px-4 h-16 flex items-center ">
        <div className="container mx-auto ">
          <div className="flex">
            <div className="flex-1 flex">
              <Link href={'/'} className="btn btn-ghost text-3xl">
                Budg<strong>Mate</strong> : <span className="text-2xl">Split Bills</span>
              </Link>
            </div>
            {/* <div className="flex items-center cursor-pointer mx-2">
              <Link href={'/user/signin'}>{t('common.sign_in')}</Link>
            </div>
            <div className="flex items-center cursor-pointer mx-2">
              <Link href={'/user/signup'}>{t('common.sign_up')}</Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
