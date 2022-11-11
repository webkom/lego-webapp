export default interface Group {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  parent: number;
  logo: string | null;
  logoPlaceholder: string | null;
  type: string;
  showBadge: boolean;
  active: boolean;
}
