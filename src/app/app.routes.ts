import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./pages/category/category.component').then(m => m.CategoryComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];