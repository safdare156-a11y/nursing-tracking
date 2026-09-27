import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the site header navigation and footer on the home page', async () => {
    const harness = await RouterTestingHarness.create('/');
    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('nav[aria-label="Main"]')?.textContent).toContain('About Us');
    expect(page.querySelector('app-footer')?.textContent).toContain('Office Timings');
  });

  it('should render the track nursing professional page in the portal layout', async () => {
    const harness = await RouterTestingHarness.create('/track/nursing-professional');
    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('nav[aria-label="Portal"]')?.textContent).toContain('PNMC Website');
    expect(page.querySelector('h1.page-header')?.textContent).toContain(
      'Track Nursing Professionals',
    );
    expect(page.querySelector('#track-identifier')).toBeTruthy();
  });
});
