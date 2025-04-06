export type Banner = {
  id: EntityId;
  header: string;
  subheader: string;
  link: string;
  currentPrivate: boolean;
  currentPublic: boolean;
  color: Color;
  showCountdown?: boolean;
  countdownEndDate?: string | null;
  countdownPrefix?: string | null;
  countdownSuffix?: string | null;
  countdownEndMessage?: string | null;
};

export type CreateBanner = {
  header?: string;
  subheader?: string;
  link?: string;
  currentPrivate?: boolean;
  currentPublic?: boolean;
  color?: Color;
  showCountdown?: boolean;
  countdownEndDate?: string | null;
  countdownPrefix?: string | null;
  countdownSuffix?: string | null;
  countdownEndMessage?: string | null;
};
