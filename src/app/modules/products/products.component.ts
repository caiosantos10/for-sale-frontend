import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { ProductsService } from './services/products.service';
import { Product } from './interfaces/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  providers: [ProductsService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.loading = true;
    this.error = '';

    this.productsService.getAll()
      .pipe(catchError(() => {
        this.error = 'Error loading products.';
        return of({ total: 0, page: 1, lastPage: 1, data: [] });
      }))
      .subscribe((response) => {
        console.log('Products loaded:', response.data);
        this.products = response.data;
        this.loading = false;
      });
  }
}
