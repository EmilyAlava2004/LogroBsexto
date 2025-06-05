import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
 {
    path: 'tabs',
    component:TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
      },
      {
        path: 'premiere',
        loadComponent: () => import('./premiere/premiere.page').then( m => m.PremierePage)
      },
      {
        path: 'populares',
        loadComponent: () => import('./populares/populares.page').then( m => m.PopularesPage)
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
      },
    ],
  },
  {
    path: 'detalles/:id',
    loadComponent: () => import('./detalles/detalles.page').then( m => m.DetallesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
]