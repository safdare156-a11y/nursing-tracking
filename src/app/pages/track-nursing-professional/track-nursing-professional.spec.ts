import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TrackNursingProfessional } from './track-nursing-professional';

describe('TrackNursingProfessional', () => {
  let fixture: ComponentFixture<TrackNursingProfessional>;
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackNursingProfessional],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackNursingProfessional);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  async function search(value: string): Promise<void> {
    const input = page.querySelector<HTMLInputElement>('#track-identifier')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    page.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  it('shows the details table in place of the form for a matching record', async () => {
    await search('00000-0000000-0');

    const table = page.querySelector('.result-table');
    expect(table?.textContent).toContain('Sample Nurse');
    expect(table?.textContent).toContain('PK-P-00-F-000000');
    expect(table?.textContent).toContain('30 Apr 2030');
    expect(page.querySelector('.photo-thumb')).toBeTruthy();
    expect(page.querySelector('form')).toBeNull();
  });

  it('tells the user when there is no record', async () => {
    await search('12345-1234567-1');

    expect(page.querySelector('.alert--danger')?.textContent).toContain('No record found');
    expect(page.querySelector('.result-table')).toBeNull();
  });

  it('asks for a value when only spaces are entered', async () => {
    await search('   ');

    expect(page.querySelector('.help-block')?.textContent).toContain(
      'This value should not be blank.',
    );
    expect(page.querySelector('.result-table')).toBeNull();
  });
});
