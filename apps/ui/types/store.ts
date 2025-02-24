import { IBillDto } from './bill'
import { IPeopleDto } from './people'

export interface IStoreState {
  loading: boolean
  setLoading: (status: boolean) => void
  bills: IBillDto[]
  createBill: (data: IBillDto) => void
  removeBill: (id: string) => void
  peoples: IPeopleDto[]
  createPeople: (data: IPeopleDto) => void
  updatePeople: (id: string, data: IPeopleDto) => void
  removePeople: (id: string) => void
  tmpBill: IBillDto | undefined
  updateTmpBill: (data: IBillDto) => void
  clearTmpBill: () => void
}
