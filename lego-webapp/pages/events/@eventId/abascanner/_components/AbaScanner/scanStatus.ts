import { CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react';
import type { Dateish } from 'app/models';
import type { LucideIcon } from 'lucide-react';

export type RecentScan = {
  username: string;
  status: string;
  scannedAt: Dateish;
};

type ScanStatus = {
  label: string;
  title: string;
  description: string;
  color: string;
  icon: LucideIcon;
  isSuccess: boolean;
};

const danger = {
  color: 'var(--danger-color)',
  icon: CircleX,
  isSuccess: false,
};

const scanStatuses: Record<string, ScanStatus> = {
  success: {
    label: 'Møtt',
    title: 'Registrert',
    description: 'Oppmøte er registrert.',
    color: 'var(--success-color)',
    icon: CircleCheckBig,
    isSuccess: true,
  },
  already_present: {
    label: 'Duplikat',
    title: 'Allerede registrert',
    description: 'Oppmøte var allerede registrert. Ingen endring gjort.',
    color: 'var(--color-blue-6)',
    icon: Info,
    isSuccess: false,
  },
  waitlisted: {
    label: 'Venteliste',
    title: 'På venteliste',
    description: 'Står på venteliste og har ikke fått plass.',
    color: 'var(--color-orange-6)',
    icon: TriangleAlert,
    isSuccess: false,
  },
  not_registered: {
    ...danger,
    label: 'Ikke påmeldt',
    title: 'Ikke påmeldt',
    description: 'Er ikke påmeldt dette arrangementet.',
  },
  unregistered: {
    ...danger,
    label: 'Meldt av',
    title: 'Meldt av',
    description: 'Har meldt seg av arrangementet.',
  },
  missing_payment: {
    ...danger,
    label: 'Ikke betalt',
    title: 'Ikke betalt',
    description: 'Har ikke betalt for arrangementet.',
  },
  late_or_absent: {
    ...danger,
    label: 'Ikke tilstede',
    title: 'Ikke tilstede',
    description: 'Er allerede registrert som sen eller ikke tilstede.',
  },
  not_properly_registered: {
    ...danger,
    label: 'Feil påmelding',
    title: 'Feil påmelding',
    description: 'Påmeldingen er i limbo. Ta kontakt med Webkom.',
  },
  no_user: {
    ...danger,
    label: 'Finnes ikke',
    title: 'Finnes ikke',
    description: 'Fant ingen bruker med dette brukernavnet.',
  },
};

const unknownStatus: ScanStatus = {
  ...danger,
  label: 'Feil',
  title: 'Noe gikk galt',
  description: 'Det oppsto en uventet feil. Prøv igjen.',
};

export const getScanStatus = (status: string): ScanStatus =>
  scanStatuses[status] ?? unknownStatus;
