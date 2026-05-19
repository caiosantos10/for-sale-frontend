import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { PagedResponse } from '../../../shared/interfaces/paged-response.interface';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService {
  getAll(): Observable<PagedResponse<Product>> {
    return this.get<PagedResponse<Product>>('/products');
  }
}
