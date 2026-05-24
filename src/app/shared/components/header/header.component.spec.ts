import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../modules/auth/services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, MatIconModule, RouterLink],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with user menu closed', () => {
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should have menu items defined', () => {
      expect(component['menuItems'].length).toBeGreaterThan(0);
    });

    it('should have user menu items defined', () => {
      expect(component['userMenuItems'].length).toBeGreaterThan(0);
    });

    it('should have Products menu item', () => {
      const productsItem = component['menuItems'].find(item => item.label === 'Products');
      expect(productsItem).toBeTruthy();
      expect(productsItem?.route).toBe('/products');
    });

    it('should have Orders menu item', () => {
      const ordersItem = component['menuItems'].find(item => item.label === 'Orders');
      expect(ordersItem).toBeTruthy();
      expect(ordersItem?.route).toBe('/pedidos');
    });

    it('should have Reviews menu item', () => {
      const reviewsItem = component['menuItems'].find(item => item.label === 'Reviews');
      expect(reviewsItem).toBeTruthy();
      expect(reviewsItem?.route).toBe('/avaliacoes');
    });

    it('should have Account Settings user menu item', () => {
      const settingsItem = component['userMenuItems'].find(item => item.label === 'Account Settings');
      expect(settingsItem).toBeTruthy();
      expect(settingsItem?.route).toBe('/configuracoes-conta');
    });

    it('should have Finance user menu item', () => {
      const financeItem = component['userMenuItems'].find(item => item.label === 'Finance');
      expect(financeItem).toBeTruthy();
      expect(financeItem?.route).toBe('/financeiro');
    });
  });

  describe('Authentication Status', () => {
    it('should check if user is logged in', () => {
      authServiceMock.isAuthenticated.and.returnValue(true);
      const isLoggedIn = component.isLoggedIn;
      expect(isLoggedIn).toBe(true);
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    });

    it('should return false when user is not logged in', () => {
      authServiceMock.isAuthenticated.and.returnValue(false);
      const isLoggedIn = component.isLoggedIn;
      expect(isLoggedIn).toBe(false);
    });

    it('should call AuthService.isAuthenticated', () => {
      authServiceMock.isAuthenticated.and.returnValue(false);
      component.isLoggedIn;
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('User Menu Toggle', () => {
    it('should toggle user menu from closed to open', () => {
      component['isUserMenuOpen'] = false;
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(true);
    });

    it('should toggle user menu from open to closed', () => {
      component['isUserMenuOpen'] = true;
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should toggle user menu multiple times', () => {
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(true);
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(false);
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(true);
    });
  });

  describe('User Menu Close', () => {
    it('should close user menu', () => {
      component['isUserMenuOpen'] = true;
      component['closeUserMenu']();
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should close user menu when already closed', () => {
      component['isUserMenuOpen'] = false;
      component['closeUserMenu']();
      expect(component['isUserMenuOpen']).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should call AuthService.logout', () => {
      component['logout']();
      expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should close user menu on logout', () => {
      component['isUserMenuOpen'] = true;
      component['logout']();
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should navigate to login after logout', () => {
      component['logout']();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should perform logout in correct order', () => {
      component['isUserMenuOpen'] = true;
      let logoutCalled = false;
      let menuClosed = false;
      let navigated = false;

      authServiceMock.logout.and.callFake(() => {
        logoutCalled = true;
      });
      routerMock.navigate.and.callFake((_route) => {
        navigated = true;
        menuClosed = component['isUserMenuOpen'] === false;
        return Promise.resolve(true);
      });

      component['logout']();

      expect(logoutCalled).toBe(true);
      expect(menuClosed).toBe(true);
      expect(navigated).toBe(true);
    });
  });

  describe('Document Click Handler', () => {
    it('should close menu when clicking outside header', () => {
      component['isUserMenuOpen'] = true;

      const outsideElement = document.createElement('div');
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });

      component['onDocumentClick'](event);
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should not close menu when clicking inside header', () => {
      component['isUserMenuOpen'] = true;

      const headerElement = fixture.nativeElement;
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: headerElement, enumerable: true });

      component['onDocumentClick'](event);
      expect(component['isUserMenuOpen']).toBe(true);
    });

    it('should handle null target gracefully', () => {
      component['isUserMenuOpen'] = true;

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: null, enumerable: true });

      expect(() => component['onDocumentClick'](event)).not.toThrow();
      expect(component['isUserMenuOpen']).toBe(false);
    });

    it('should close menu for all elements outside header', () => {
      const elements = [
        document.createElement('button'),
        document.createElement('a'),
        document.body
      ];

      elements.forEach(el => {
        component['isUserMenuOpen'] = true;

        const event = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(event, 'target', { value: el, enumerable: true });

        component['onDocumentClick'](event);
        expect(component['isUserMenuOpen']).toBe(false);
      });
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      authServiceMock.isAuthenticated.and.returnValue(true);
    });

    it('should render header element', () => {
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('header');
      expect(header).toBeTruthy();
    });

    it('should render menu items when logged in', () => {
      fixture.detectChanges();
      const menuItems = fixture.nativeElement.querySelectorAll('a[routerLink]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should render Products link', () => {
      fixture.detectChanges();
      const links = fixture.nativeElement.querySelectorAll('a');
      const productsLink = Array.from(links).find((link: any) => link.textContent.includes('Products'));
      expect(productsLink).toBeTruthy();
    });

    it('should render user menu button when logged in', () => {
      fixture.detectChanges();
      const userMenuButtons = fixture.nativeElement.querySelectorAll('button');
      expect(userMenuButtons.length).toBeGreaterThan(0);
    });

    it('should not render logout button when not logged in', () => {
      authServiceMock.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
      const logoutButtons = fixture.nativeElement.querySelectorAll('button');
      expect(logoutButtons.length).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete logout flow', () => {
      component['isUserMenuOpen'] = true;
      authServiceMock.isAuthenticated.and.returnValue(false);

      component['logout']();

      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(component['isUserMenuOpen']).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should handle menu interaction sequence', () => {
      component['toggleUserMenu']();
      expect(component['isUserMenuOpen']).toBe(true);

      // Simulate outside click
      const outsideElement = document.createElement('div');
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      component['onDocumentClick'](event);

      expect(component['isUserMenuOpen']).toBe(false);
    });
  });
});
