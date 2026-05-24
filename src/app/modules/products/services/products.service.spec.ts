import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ProductsService } from './products.service';
import { PagedResponse } from '../../../shared/interfaces/paged-response.interface';
import { Product } from '../interfaces/product.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpClientMock: jasmine.SpyObj<HttpClient>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ];

  const mockPagedResponse: PagedResponse<Product> = {
    total: 2,
    page: 1,
    lastPage: 1,
    data: mockProducts
  };

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ProductsService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should extend BaseService', () => {
      expect(service['apiBaseUrl']).toBeDefined();
    });
  });

  describe('getAll()', () => {
    it('should call get method', () => {
      httpClientMock.get.and.returnValue(of(mockPagedResponse));
      service.getAll().subscribe();
      expect(httpClientMock.get).toHaveBeenCalled();
    });

    it('should return paged response', (done) => {
      httpClientMock.get.and.returnValue(of(mockPagedResponse));
      service.getAll().subscribe((response) => {
        expect(response).toEqual(mockPagedResponse);
        expect(response.total).toBe(2);
        done();
      });
    });

    it('should return products in data field', (done) => {
      httpClientMock.get.and.returnValue(of(mockPagedResponse));
      service.getAll().subscribe((response) => {
        expect(response.data).toEqual(mockProducts);
        expect(response.data[0].name).toBe('Product 1');
        done();
      });
    });

    it('should handle empty product list', (done) => {
      const emptyResponse: PagedResponse<Product> = {
        total: 0,
        page: 1,
        lastPage: 1,
        data: []
      };

      httpClientMock.get.and.returnValue(of(emptyResponse));
      service.getAll().subscribe((response) => {
        expect(response.data).toEqual([]);
        done();
      });
    });
  });
});
