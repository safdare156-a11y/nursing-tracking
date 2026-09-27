/** A submenu entry: an internal `route` of this app or an external `href`. */
export interface MenuLink {
  label: string;
  href?: string;
  route?: string;
}

export interface MenuItem {
  label: string;
  /** Internal route for the item itself; parents with `children` have no page of their own. */
  route?: string;
  children?: MenuLink[];
}

const SITE = 'https://pnmc.gov.pk';
const PORTAL = 'https://online.pnmc.gov.pk';

export const MAIN_MENU: MenuItem[] = [
  { label: 'Home', route: '/' },
  {
    label: 'About Us',
    children: [
      { label: 'About PNMC', href: `${SITE}/about-pnmc/` },
      { label: 'Our Mission', href: `${SITE}/our-mission/` },
      { label: 'PNMC Act', href: `${SITE}/pnmc-act/` },
      { label: 'Functions of PNMC', href: `${SITE}/functions-of-pnmc/` },
      { label: 'President PNMC', href: `${SITE}/president-pnmc/` },
      { label: 'Council Members', href: `${SITE}/council-members/` },
      { label: 'Management', href: `${SITE}/management/` },
      { label: 'Nursing Statistics', href: `${PORTAL}/nursing/statistics` },
    ],
  },
  {
    label: 'Standards',
    children: [
      { label: 'Professional Code of Ethics', href: `${SITE}/professional-code-of-ethics/` },
      { label: 'Regulations for Nursing institutes', href: `${SITE}/rules-for-new-institutes/` },
      { label: 'Nursing Curriculum', href: `${SITE}/nursing-curriculum/` },
    ],
  },
  {
    label: 'Education',
    children: [
      { label: 'Diploma Programs', href: `${SITE}/diploma-programs/` },
      { label: 'Degree Programs', href: `${SITE}/degree-programs/` },
      { label: 'Recognized Institutes', href: `${SITE}/recognized-institutes/` },
      { label: 'Admission Criteria', href: `${SITE}/admission-criteria/` },
      { label: 'Licensing Exams', href: `${SITE}/licensing-exams/` },
      { label: 'Examination Boards', href: `${SITE}/examination-boards/` },
      { label: 'Scholarships', href: `${SITE}/scholarships/` },
      { label: 'CPD Courses', href: `${SITE}/cpd-courses/` },
      { label: 'PMDU', href: `${SITE}/pmdu/` },
      { label: 'Parent & Student Alert', href: `${SITE}/parent-student-alert/` },
      { label: 'PNMC Registration', href: `${SITE}/pnmc-registration-2/` },
      { label: 'Pre Registration', href: `${SITE}/pre-registration/` },
      { label: 'Verification Registration', href: `${SITE}/verification-registration-2/` },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'For Students', href: `${SITE}/register-nursing-students-with-pnc/` },
      { label: 'For Nursing Professionals', href: `${SITE}/for-nursing-professionals/` },
      { label: 'For Institutes', href: `${SITE}/for-institutes/` },
      { label: 'For Nursing Faculty', href: `${SITE}/for-nursing-faculty/` },
      { label: 'For General Public', route: '/track/nursing-professional' },
    ],
  },
  {
    label: 'How Can I?',
    children: [
      { label: 'Verify a Nursing Professional', route: '/track/nursing-professional' },
      { label: 'Pursue Nursing Education', href: `${PORTAL}/educational/programs` },
      { label: 'Register as a Nursing Professional', href: `${PORTAL}/` },
      { label: 'Check my Registration Status', route: '/track/nursing-professional' },
      { label: 'Pay Fee', href: `${SITE}/fee/` },
      { label: 'Contact Us', href: `${SITE}/contact-us/` },
      { label: 'FAQs', href: `${SITE}/faqs/` },
    ],
  },
  {
    label: 'Updates',
    children: [
      { label: 'Notifications', href: `${SITE}/notifications/` },
      { label: 'Public Notices', href: `${SITE}/public-notices/` },
      { label: 'News', href: `${SITE}/news/` },
      { label: 'Events', href: `${SITE}/events/` },
      { label: 'Nursing and Midwifery Journal', href: `${SITE}/nursing-and-midwifery-journal/` },
      { label: 'Tenders', href: `${SITE}/tenders/` },
    ],
  },
];

export const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    icon: 'facebook',
    href: 'https://www.facebook.com/profile.php?id=100095434990313',
    hoverColor: '#3b5998',
  },
  {
    label: 'Twitter',
    icon: 'twitter',
    href: 'https://twitter.com/pncislamabad/status/1697946905463136266?s=46&t=6d5v-nUa1zOo983FVgVF8Q',
    hoverColor: '#1da1f2',
  },
  {
    label: 'Youtube',
    icon: 'youtube',
    href: 'https://www.youtube.com/@pakistannursingcouncilisla4689',
    hoverColor: '#3b5998',
  },
] as const;
