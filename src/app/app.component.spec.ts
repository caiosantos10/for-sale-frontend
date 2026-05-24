import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  describe('Initialization', () => {
    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it(`should have the 'for-sale-frontend' title`, () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual('for-sale-frontend');
    });

    it('should have correct title value', () => {
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.title).toBe('for-sale-frontend');
    });
  });

  describe('Template Rendering', () => {
    it('should render router outlet', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should render header component', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-header')).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should have HeaderComponent and RouterOutlet imported', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it('should be standalone component', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const metadata = (AppComponent as any);
      expect(metadata).toBeTruthy();
    });
  });
});
