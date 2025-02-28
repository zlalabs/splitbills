import { IBillDto } from '@/types'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Props = {
  bill: IBillDto | undefined | null
}

export const CopyLink: FC<Props> = ({ bill }) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL

  const t = useTranslations()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/bill/${bill!.link}`)
    alert(`${t('common.copy_link')}! ✅`)
  }

  return (
    <>
      <div className="grid  grid-cols-4 items-center space-x-2 mt-2">
        <div>{t('common.link')} :</div>
        <div className="col-span-3">
          <Input type="text" defaultValue={`${baseUrl}/bill/${bill!.link}`} />
          <Button onClick={handleCopy} variant="outline">
            {t('common.copy')}
          </Button>
        </div>
      </div>
    </>
  )
}
