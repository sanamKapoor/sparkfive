export interface IDropdownOption {
  id: string;
  label: string;
  onClick: () => void;
  permissions?: string[];
  OverrideComp?: React.FC<any>;
  icon?: string;
}
