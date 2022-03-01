import { Dispatch } from "react";
import { SortData } from "../user-list/types";

interface _CompanyListHeaderProps {
  title: string
  sortId: string

  sortData: SortData
  setSortData: (values: Partial<SortData>) => void

  big?: boolean
}

export const defaultSortData: SortData = {
  sortBy: 'users.lastLogin',
  sortDirection: 'ASC',
  activeList: 'allAccounts'
}

export type CompanyListHeaderProps = Readonly<_CompanyListHeaderProps>