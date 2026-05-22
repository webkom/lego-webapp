export const NAV_COLS = [
  {
    heading: 'Om oss',
    links: [
      { label: 'Styret', href: '/pages/styrer/12' },
      {
        label: 'Fondet',
        href: 'https://fondet.abakus.no/',
        external: true,
      },
      { label: 'Historie', href: '/pages/info-om-abakus/22-historie' },
      { label: 'Kontakt', href: '/contact' },
      {
        label: 'Personvern',
        href: '/pages/personvern/124-personvernserklring',
      },
    ],
  },
  {
    heading: 'Ressurser',
    links: [
      {
        label: 'Varslingsportal',
        href: 'https://avvik.abakus.no/',
        external: true,
      },
      { label: 'readme', href: '/pages/info-om-abakus/6-readme' },
      {
        label: 'Frontend',
        href: 'https://github.com/webkom/lego-webapp',
        external: true,
      },
      {
        label: 'Backend',
        href: 'https://github.com/webkom/lego',
        external: true,
      },
      {
        label: 'Utviklerbloggen',
        href: 'https://webkom.dev/',
        external: true,
      },
    ],
  },
  {
    heading: 'Bedrifter',
    links: [
      {
        label: 'Interesseskjema',
        href: 'https://abakus.no/bdb/company-interest/new',
        external: true,
      },
      { label: 'Kontakt BedKom', href: 'mailto:bedkom@abakus.no' },
      { label: 'Jobbannonse', href: '/joblistings' },
      { label: 'itDAGENE', href: 'https://itdagene.no', external: true },
    ],
  },
] as const;

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/webkom' },
  {
    label: 'Slack',
    href: 'https://join.slack.com/t/abakus-ntnu/shared_invite/zt-19m96d1du-WoVE99K20g5iUeKaTGSVxw',
  },
  { label: 'Instagram', href: 'https://www.instagram.com/AbakusNTNU/' },
  { label: 'Facebook', href: 'https://www.facebook.com/AbakusNTNU/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/abakus_3/' },
] as const;
