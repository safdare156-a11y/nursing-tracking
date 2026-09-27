import { Routes } from '@angular/router';

import { SiteLayout } from './layout/site-layout/site-layout';
import { Home } from './pages/home/home';
import { adminAuthGuard } from './shared/auth/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: SiteLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Home,
        title: 'Home - PNMC - Pakistan Nursing & Midwifery Council',
      },
    ],
  },
  {
    // Pages of the online.pnmc.gov.pk portal, which has its own header and footer.
    path: '',
    loadComponent: () => import('./layout/portal-layout/portal-layout').then((m) => m.PortalLayout),
    children: [
      {
        path: 'track/nursing-professional',
        loadComponent: () =>
          import('./pages/track-nursing-professional/track-nursing-professional').then(
            (m) => m.TrackNursingProfessional,
          ),
        title: 'Welcome! PNC User',
      },
      {
        path: 'admin/login',
        loadComponent: () =>
          import('./pages/admin-login/admin-login').then((m) => m.AdminLogin),
        title: 'Admin Sign In - PNMC',
      },
      {
        path: 'admin',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./pages/admin-nurses/admin-nurses').then((m) => m.AdminNurses),
        title: 'Nursing Professionals - PNMC Admin',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
