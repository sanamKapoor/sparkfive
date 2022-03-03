import { SortData } from "../user-list/types";

export const defaultSortData: SortData = {
  sortBy: 'users.lastLogin',
  sortDirection: 'ASC',
  activeList: 'allAccounts'
}

export type CompanyListHeaderProps = Readonly<{
  title: string
  sortId: string

  sortData: SortData
  setSortData: (values: Partial<SortData>) => void

  big?: boolean
}>