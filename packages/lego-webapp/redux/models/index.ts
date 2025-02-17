export enum Semester {
  Spring = 'spring',
  Autumn = 'autumn',
}

export type ActionGrant = (
  | 'create'
  | 'edit'
  | 'delete'
  | 'list'
  | 'view'
  | string
)[];
