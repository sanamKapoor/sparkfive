export interface NavItem {
  id: number;
  parent: string;
  components: Array<{
    route: string;
    label: string;
    image: string;
  }>;
}