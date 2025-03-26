import { IBillDto, ICreateBillDto, ITmpBillDto } from './bill'
import { ITmpPeopleDto } from './people'

export interface IStoreState {
  isFirstTime: boolean
  setFirstTime: (status: boolean) => void
  loading: boolean
  setLoading: (status: boolean) => void
  bills: IBillDto[]
  createBill: (data: ICreateBillDto) => void
  removeBill: (id: string) => void
  peoples: ITmpPeopleDto[]
  createPeople: (data: ITmpPeopleDto) => void
  updatePeople: (index: number, data: ITmpPeopleDto) => void
  removePeople: (index: number) => void
  tmpBill: ITmpBillDto | undefined
  updateTmpBill: (data: ITmpBillDto) => void
  clearTmpBill: () => void
}
