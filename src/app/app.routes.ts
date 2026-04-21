import { Routes } from '@angular/router';

import { AvaliacoesComponent } from './modules/avaliacoes/avaliacoes.component';
import { CadastroComponent } from './modules/auth/cadastro/cadastro.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ConfiguracoesContaComponent } from './modules/configuracoes-conta/configuracoes-conta.component';
import { FinanceiroComponent } from './modules/financeiro/financeiro.component';
import { PedidosComponent } from './modules/pedidos/pedidos.component';
import { ProdutosComponent } from './modules/produtos/produtos.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'produtos' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/cadastro', component: CadastroComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'avaliacoes', component: AvaliacoesComponent },
  { path: 'configuracoes-conta', component: ConfiguracoesContaComponent },
  { path: 'financeiro', component: FinanceiroComponent },
  { path: '**', redirectTo: 'produtos' },
];
