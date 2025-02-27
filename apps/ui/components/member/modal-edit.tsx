import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ITmpMemberDto } from '@/types'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'

type Props = {
  open: boolean
  member: ITmpMemberDto | undefined
  onCancel: () => void
  onConfirm: (data: ITmpMemberDto) => void
}

export const ModalMemberEdit: FC<Props> = ({ open, member, onCancel, onConfirm }) => {
  const t = useTranslations()
  const [data, setData] = useState(member)

  const onChange = (field: string, value: string | boolean) => {
    setData({
      ...data!,
      [field]: value,
    })
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('common.edit')}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="pb-4">
              <Input
                onChange={(e) => onChange('name', e.target.value)}
                defaultValue={member?.name}
              />
            </div>
            <div className="pb-4">
              {t('member.paid')}{' '}
              <Switch
                onCheckedChange={(value) => onChange('paid', value)}
                defaultChecked={member?.paid}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction className="danger" onClick={() => data && onConfirm(data)}>
            {t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
