import { ICreateBillDto } from '@/types/bill'
import api from './api'

export const createBill = async (data: ICreateBillDto) => {
  return await api.post(`/users/create`, data)
}
