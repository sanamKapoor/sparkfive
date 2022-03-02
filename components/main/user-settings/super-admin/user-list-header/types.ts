import { SortData } from "../user-list/types";

interface _UserListHeaderProps {
  title: string
  sortId: string

  sortData: SortData
  setSortData: (values: Partial<SortData>) => void 
}

export type UserListHeaderProps = Readonly<_UserListHeaderProps>