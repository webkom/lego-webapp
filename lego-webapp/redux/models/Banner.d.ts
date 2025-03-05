export type Banner = {
  id: EntityId;
  header: string;
  subheader: string;
  link: string;
  currentPrivate: boolean;
  currentPublic: boolean;
  color: Color;
};

export type CreateBanner = {
  header?: string;
  subheader?: string;
  link?: string;
  currentPrivate?: boolean;
  currentPublic?: boolean;
  color?: Color;
};
