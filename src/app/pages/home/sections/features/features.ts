import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Reveal, RevealSpeed } from '../../../../shared/directives/reveal';

interface Feature {
  title: string;
  text: string;
  icon: string;
  titleGap: number;
  speed: RevealSpeed;
  delay: number;
}

/** The four "what PNMC does" cards that overlap the bottom of the hero. */
@Component({
  selector: 'app-features',
  imports: [Reveal],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  protected readonly features: Feature[] = [
    {
      title: 'Education & Standards',
      text: 'PNMC sets curricula, inspects institutions for approval, and maintains standards of nursing education and professional practice.',
      icon: 'images/icon-education.png',
      titleGap: 30,
      speed: 'fast',
      delay: 0,
    },
    {
      title: 'Licensing & Regulation',
      text: 'PNMC provides registration and licensing to practice, prescribes penalties for fraudulent registration, and takes disciplinary action for professional misconduct.',
      icon: 'images/icon-licensing.png',
      titleGap: 30,
      speed: 'normal',
      delay: 0,
    },
    {
      title: 'Examinations & Coordination',
      text: 'PNMC works closely with Provincial Nursing Examination Boards (NEBs) and relevant institutions, including Armed Forces Nursing Services, to ensure uniform implementation.',
      icon: 'images/icon-examinations.png',
      titleGap: 30,
      speed: 'slow',
      delay: 0,
    },
    {
      title: 'Policy & Advisory Role',
      text: 'PNMC advises Federal and Provincial Governments on nursing education and services and communicates policy decisions for the welfare of nurses and allied professionals.',
      icon: 'images/icon-policy.png',
      titleGap: 80,
      speed: 'slow',
      delay: 200,
    },
  ];
}
