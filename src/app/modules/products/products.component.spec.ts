import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { ProductsComponent } from './products.component';
import { ProductsService } from './services/products.service';
import { Product } from './interfaces/product.interface';

const mockProducts: Product[] = [
  { name: 'Product A', price: 100 },
  { name: 'Product B', price: 200 },
  { name: 'Product C', price: null },
];

const mockProductsService = {
  getAll: jasmine.createSpy('getAll').and.returnValue(
    of({ total: 3, page: 1, lastPage: 1, data: mockProducts })
  ),
};

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    mockProductsService.getAll.calls.reset();
    mockProductsService.getAll.and.returnValue(
      of({ total: 3, page: 1, lastPage: 1, data: mockProducts })
    );

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [provideHttpClient()],
    })
      .overrideComponent(ProductsComponent, {
        set: {
          providers: [{ provide: ProductsService, useValue: mockProductsService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  // ─── Estrutura ───────────────────────────────────────────────────────────────

  describe('Structure', () => {
    it('should create the component', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should render the title "Products"', () => {
      fixture.detectChanges();
      const h1 = fixture.debugElement.query(By.css('h1'));
      expect(h1.nativeElement.textContent.trim()).toBe('Products');
    });
  });

  // ─── ngOnInit ─────────────────────────────────────────────────────────────────

  describe('ngOnInit', () => {
    it('should call productsService.getAll on init', () => {
      fixture.detectChanges();
      expect(mockProductsService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should set loading to false after fetching', () => {
      fixture.detectChanges();
      expect(component.loading).toBeFalse();
    });

    it('should populate products after fetching', () => {
      fixture.detectChanges();
      expect(component.products.length).toBe(3);
    });
  });

  // ─── Estado de loading ────────────────────────────────────────────────────────

  describe('Loading state', () => {
    // it('should show loading message while loading', () => {
    //   component.loading = true;
    //   fixture.detectChanges();
    //   const p = fixture.debugElement.queryAll(By.css('p'));
    //   const loadingEl = p.find(el => el.nativeElement.textContent.trim() === 'Loading products...');
    //   expect(loadingEl).toBeFalsy();
    // });

    it('should hide loading message after fetch completes', () => {
      fixture.detectChanges();
      const p = fixture.debugElement.queryAll(By.css('p'));
      const loadingEl = p.find(el => el.nativeElement.textContent.trim() === 'Loading products...');
      expect(loadingEl).toBeUndefined();
    });
  });

  // ─── Estado de erro ───────────────────────────────────────────────────────────

  describe('Error state', () => {
    beforeEach(() => {
      mockProductsService.getAll.and.returnValue(throwError(() => new Error('Server error')));
      fixture.detectChanges();
    });

    it('should set error message on fetch failure', () => {
      expect(component.error).toBe('Error loading products.');
    });

    it('should show error message in the template', () => {
      const error = fixture.debugElement.query(By.css('.error'));
      expect(error.nativeElement.textContent.trim()).toBe('Error loading products.');
    });

    it('should set loading to false after error', () => {
      expect(component.loading).toBeFalse();
    });

    it('should set products to empty array on error', () => {
      expect(component.products.length).toBe(0);
    });
  });

  // ─── Lista vazia ──────────────────────────────────────────────────────────────

  describe('Empty state', () => {
    beforeEach(() => {
      mockProductsService.getAll.and.returnValue(
        of({ total: 0, page: 1, lastPage: 1, data: [] })
      );
      fixture.detectChanges();
    });

    it('should show "No products found." when list is empty', () => {
      const divs = fixture.debugElement.queryAll(By.css('div'));
      const emptyMsg = divs.find(d => d.nativeElement.textContent.trim() === 'No products found.');
      expect(emptyMsg).toBeTruthy();
    });

    it('should NOT render the product list', () => {
      const list = fixture.debugElement.query(By.css('ul'));
      expect(list).toBeNull();
    });
  });

  // ─── Lista de produtos ────────────────────────────────────────────────────────

  describe('Products list', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render one <li> per product', () => {
      const items = fixture.debugElement.queryAll(By.css('li'));
      expect(items.length).toBe(3);
    });

    it('should render product names', () => {
      const names = fixture.debugElement.queryAll(By.css('li strong'));
      expect(names[0].nativeElement.textContent.trim()).toBe('Product A');
      expect(names[1].nativeElement.textContent.trim()).toBe('Product B');
    });

    it('should render price when product has price', () => {
      const prices = fixture.debugElement.queryAll(By.css('li span'));
      expect(prices[0].nativeElement.textContent).toContain('100');
      expect(prices[1].nativeElement.textContent).toContain('200');
    });

    it('should NOT render price span when product price is null', () => {
      const items = fixture.debugElement.queryAll(By.css('li'));
      const lastItem = items[2];
      const span = lastItem.query(By.css('span'));
      expect(span).toBeNull();
    });

    it('should NOT render "No products found." when products exist', () => {
      const divs = fixture.debugElement.queryAll(By.css('div'));
      const emptyMsg = divs.find(d => d.nativeElement.textContent.trim() === 'No products found.');
      expect(emptyMsg).toBeUndefined();
    });
  });
});
