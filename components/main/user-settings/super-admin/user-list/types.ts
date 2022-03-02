interface SortData {
  sortBy: string 
  sortDirection: SortDirection
  activeList: string 
}

export const defaultSortData: SortData = {
  sortBy: 'users.lastLogin',
  sortDirection: 'ASC',
  activeList: 'allUsers'
}

type SortDirection = 'ASC' | 'DESC'

export type {
  SortData,
  SortDirection
}