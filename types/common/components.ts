export interface DropDownOption {
  label: string;
  text: string;
  onClick: () => void;
  icon: string;
  CustomContent: Element | null;
}

export interface SwitchableTabsWithPropsData {
  id: string;
  title: string;
  content: React.FC<T>;
  props?: any;
}
