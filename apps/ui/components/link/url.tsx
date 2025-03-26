'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { IBillDto } from '@/types'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

type Props = {
  bill: IBillDto | undefined | null
}

export const CopyLink: FC<Props> = ({ bill }) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL

  const t = useTranslations()
  const { toast } = useToast()

  const handleCopy = async () => {
    console.log('zz')
    await navigator.clipboard.writeText(`${baseUrl}/bill/${bill!.link}`)

    toast({
      description: `${t('common.copy_link')}! ✅`,
    })
  }

  return (
    <>
      <div className="grid  grid-cols-4 items-center space-x-2 mt-2">
        <div>{t('common.link')} :</div>
        <div className="col-span-3">
          <div className="pb-2">
            <Input type="text" defaultValue={`${baseUrl}/bill/${bill!.link}`} />
          </div>

          <div>
            <Button onClick={handleCopy} variant="outline" className="cursor-pointer">
              {t('common.copy')}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
