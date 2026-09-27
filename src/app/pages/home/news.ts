export interface NewsPost {
  title: string;
  date: string;
  url: string;
  excerpt: string;
  image?: string;
}

/** Latest posts, newest first. The first one is featured with its image. */
export const NEWS_POSTS: NewsPost[] = [
  {
    title: 'PNMC Mobile Application – Now Available on Google Play Store',
    date: 'January 26, 2026',
    url: 'https://pnmc.gov.pk/pnmc-mobile-application-early-access-now-available/',
    image: 'images/news-play-store.png',
    excerpt:
      'The Pakistan Nursing and Midwifery Council (PNMC) mobile application Now Available on Google Play Store for the general public. Users with Android smartphones can download the application and experience its services. The app is designed to facilitate access to PNMC information, updates, and digital services in a convenient way. https://play.google.com/store/apps/details?id=com.cogilent.pnmc_app…',
  },
  {
    title:
      'The Pakistan Nursing & Midwifery Council is excited to invite all the citizens and Nursing Professionals to our E-Kacheri.',
    date: 'October 16, 2025',
    url: 'https://pnmc.gov.pk/the-pakistan-nursing-midwifery-council-is-excited-to-invite-all-the-citizens-and-nursing-professionals-to-our-e-kacheri/',
    excerpt: 'The Pakistan Nursing & Midwifery Council is excited…',
  },
  {
    title: 'Meeting with His Excellency Colonel (Retd) Pengiran Haji Kamal Bashah',
    date: 'August 27, 2025',
    url: 'https://pnmc.gov.pk/meeting-with-his-excellency-colonel-retd-pengiran-haji-kamal-bashah/',
    excerpt: 'Meeting with His Excellency Colonel (Retd) Pengiran Haji…',
  },
  {
    title: 'Midwifery Education in Pakistan',
    date: 'May 28, 2025',
    url: 'https://pnmc.gov.pk/midwifery-education-in-pakistan/',
    excerpt: 'Heartfelt gratitude to Health Services Academy team and…',
  },
];
