import { Routes } from '@angular/router';

import { AvaliacoesComponent } from './modules/avaliacoes/avaliacoes.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ConfiguracoesContaComponent } from './modules/configuracoes-conta/configuracoes-conta.component';
import { FinanceiroComponent } from './modules/financeiro/financeiro.component';
import { PedidosComponent } from './modules/pedidos/pedidos.component';
import { ProductsComponent } from './modules/products/products.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './modules/auth/register/register.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [authGuard] },
  { path: 'avaliacoes', component: AvaliacoesComponent, canActivate: [authGuard] },
  { path: 'configuracoes-conta', component: ConfiguracoesContaComponent, canActivate: [authGuard] },
  { path: 'financeiro', component: FinanceiroComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'products' },
];
