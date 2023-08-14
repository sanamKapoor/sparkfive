export interface DropDownOption {
  label: string;
  text: string;
  onClick: () => void;
  icon: string;
  CustomContent: Element | null;
}
