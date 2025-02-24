import { createBill } from '@/services/bill'
import { ICreateBillDto } from '@/types'
import { useMutation } from '@tanstack/react-query'

export const useCreateBill = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ICreateBillDto }) => createBill(data),
  })
}
