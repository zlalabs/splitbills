import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/hooks/store'
import { ITmpListDto } from '@/types'
import { MODE } from '@/utils/constant'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

type Props = {
  mode: string
  isOpen: boolean
  onOpen: (status: boolean) => void
  list: ITmpListDto | undefined
  onChangeData: (list: ITmpListDto) => void
  onSubmit: () => void
}

export const ModalList: FC<Props> = ({ mode, isOpen, onOpen, list, onChangeData, onSubmit }) => {
  const t = useTranslations()
  const { tmpBill } = useAppStore()

  const handlePeople = (idx: number) => {
    if (!list) return
    const findPeople = tmpBill?.members?.find((_, i) => i === idx)

    const updatedPeople: ITmpListDto = {
      ...list,
      peoples:
        list.peoples?.length === 0
          ? list.peoples?.concat(findPeople!.name)
          : list.peoples?.find((p) => p === findPeople!.name)
            ? list.peoples?.filter((p) => p !== findPeople!.name)
            : (list.peoples || []).concat(findPeople!.name),
    }

    onChangeData(updatedPeople)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('list.detail')}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 p-2 rounded-md w-full max-w-sm">
            <Input
              type="text"
              defaultValue={list?.name}
              value={list?.name}
              onChange={(e) => onChangeData({ ...list!, name: e.target.value })}
              placeholder={t('list.name')}
            />
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md w-full max-w-sm">
            <Input
              type="number"
              defaultValue={list?.price}
              onChange={(e) => onChangeData({ ...list!, price: Number(e.target.value) })}
              placeholder={t('list.price')}
            />
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md w-full max-w-sm">
            {tmpBill?.members?.map((p, i) => {
              const choose = list?.peoples?.find((d) => d === p.name)
              return (
                <Badge
                  key={i}
                  variant={choose ? `default` : `secondary`}
                  onClick={() => handlePeople(i)}
                  className="cursor-pointer"
                >
                  {p.name}
                </Badge>
              )
            })}
          </div>
        </div>
        <DialogFooter className="">
          <div className="p-2">
            <Button
              className="cursor-pointer"
              type="button"
              onClick={() => {
                onSubmit()
                onOpen(false)
              }}
            >
              {mode === MODE.CREATE ? t('common.create') : t('common.update')}
            </Button>
          </div>
          <div className="p-2">
            <Button
              className="cursor-pointer"
              variant={'destructive'}
              type="button"
              onClick={() => {
                onOpen(false)
              }}
            >
              {t('common.close')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
