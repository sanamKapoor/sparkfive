import { SortData } from "../user-list/types";

export type UserListHeaderProps = Readonly<{
  title: string;
  sortId: string;

  sortData: SortData;
  setSortData: (values: Partial<SortData>) => void;
}>;
