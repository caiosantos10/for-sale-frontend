import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { PagedResponse } from '../../../shared/interfaces/paged-response.interface';
import { Produto } from '../interfaces/produto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService extends BaseService {
  getAll(): Observable<PagedResponse<Produto>> {
    return this.get<PagedResponse<Produto>>('/products');
  }
}
