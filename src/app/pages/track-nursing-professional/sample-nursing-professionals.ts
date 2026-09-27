import type { NursingProfessional } from './nursing-professional-lookup';

/** Dummy data for building the result view. Not real people. */
export const SAMPLE_NURSING_PROFESSIONALS: NursingProfessional[] = [
  {
    fullName: 'Sample Nurse',
    nicNumber: '00000-0000000-0',
    qualifications: ['Midwifery', 'Family welfare Worker'],
    speciality: 'NA',
    registrationCategory: 'Family Welfare Worker',
    registrationNumber: 'PK-P-00-F-000000',
    initialRegistrationDate: '2025-04-30',
    licenseExpirationDate: '2030-04-30',
    photoUrl: 'images/portal/dummy-photo.svg',
  },
];
