export interface NavLink {
  label: string;
  path: string;
  submenu?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  {
    label: 'About Refex',
    path: '/about-refex',
    submenu: [
      { label: 'Overview', path: '/about-refex' },
      { label: 'Leadership', path: '/about-refex#leadership' },
      { label: 'Our Story', path: '/about-refex#ourstory' },
    ]
  },
  {
    label: 'Business',
    path: '/#business',
    submenu: [
      { label: 'Refex Refrigerants', path: '/refex-refrigerants' },
      { label: 'Refex Renewables', path: '/refex-renewables' },
      { label: 'Ash & Coal Handling', path: '/refex-ash-coal-handling' },
      { label: 'Refex Medtech', path: '/refex-medtech' },
      { label: 'Refex Capital', path: '/refex-capital' },
      { label: 'Refex Airports', path: '/refex-airports' },
      { label: 'Refex Mobility', path: '/refex-mobility' },
      { label: 'RL Fine Chem', path: '/pharma-rl-fine-chem' },
      { label: 'Venwind Refex', path: '/venwind-refex' },
    ]
  },
  { label: 'Investments', path: '/investments' },
  { label: 'ESG', path: '/esg' },
];

export const FOOTER_BUSINESS_LINKS = [
  { label: 'Refex Refrigerants', path: '/refex-refrigerants' },
  { label: 'Refex Renewables', path: '/refex-renewables' },
  { label: 'Ash & Coal Handling', path: '/refex-ash-coal-handling' },
  { label: 'Refex Medtech', path: '/refex-medtech' },
  { label: 'Refex Capital', path: '/refex-capital' },
  { label: 'Refex Airports', path: '/refex-airports' },
  { label: 'Refex Mobility', path: '/refex-mobility' },
  { label: 'RL Fine Chem', path: '/pharma-rl-fine-chem' },
  { label: 'Venwind Refex', path: '/venwind-refex' },
];

export const FOOTER_QUICK_LINKS = [
  { label: 'About Refex', path: '/about-refex' },
  { label: 'Investments', path: '/investments' },
  { label: 'Newsroom', path: '/newsroom' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
  { label: 'ESG', path: '/esg' },
];

export const BUSINESS_LINKS = [
  { label: 'Refex Refrigerants', path: '/refex-refrigerants' },
  { label: 'Refex Renewables', path: '/refex-renewables' },
  { label: 'Ash & Coal Handling', path: '/refex-ash-coal-handling' },
  { label: 'Refex Medtech', path: '/refex-medtech' },
  { label: 'Refex Capital', path: '/refex-capital' },
  { label: 'Refex Airports', path: '/refex-airports' },
  { label: 'Refex Mobility', path: '/refex-mobility' },
  { label: 'RL Fine Chem', path: '/pharma-rl-fine-chem' },
  { label: 'Venwind Refex', path: '/venwind-refex' }
];
