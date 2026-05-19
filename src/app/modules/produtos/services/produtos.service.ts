import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { Produto } from '../interfaces/produto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService extends BaseService {
  getAll(): Observable<Produto[]> {
    return this.get<Produto[]>('/products');
  }
}
