import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AvatarCardProps {
  src?: string
  alt?: string
  name: string
}

export default function AvatarPeople({ name }: AvatarCardProps) {
  const getInitials = (name: string) => {
    return name?.slice(0, 4).toUpperCase()
  }

  return (
    <div className="flex-col items-center p-2">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-white-300 text-green-600 border-green-600 border-solid border-2 font-bold flex items-center justify-center">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="text-xs font-semibold text-center max-w-[80px] truncate">{name}</div>
    </div>
  )
}
