import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { ProdutosService } from './services/produtos.service';
import { Produto } from './interfaces/produto.interface';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  products: Produto[] = [];
  loading = false;
  error = '';

  constructor(private produtosService: ProdutosService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.loading = true;
    this.error = '';

    this.produtosService.getAll()
      .pipe(catchError(() => {
        this.error = 'Erro ao carregar produtos.';
        return of([]);
      }))
      .subscribe(products => {
        this.products = products;
        this.loading = false;
      });
  }
}
