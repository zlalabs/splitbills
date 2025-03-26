import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { ModalPeople } from '@/components/people/modal'
import { useAppStore } from '@/hooks/store'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const PeopleList = () => {
  const t = useTranslations()
  const { peoples } = useAppStore()

  const [open, setOpen] = useState(false)

  const handleAddPeople = () => {
    setOpen(true)
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <>
      <div className="py-2">
        <h2>{t('people.list')}</h2>
      </div>
      <div className="flex py-2 cursor-pointer" onClick={handleAddPeople}>
        <div className="px-1">
          <Avatar>
            <AvatarFallback className="bg-white-300 text-green-600 border-green-600 border-solid border-2 font-bold flex items-center justify-center">
              {getInitials('+')}
            </AvatarFallback>
          </Avatar>
        </div>

        {peoples.map((person, index) => (
          <div key={index} className="px-1">
            <Avatar>
              <AvatarFallback className="bg-green-600 text-white font-bold flex items-center justify-center">
                {getInitials(person.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
      <ModalPeople isOpen={open} onOpen={() => setOpen(!open)} />
    </>
  )
}
