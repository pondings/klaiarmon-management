import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';

import { AuthComponent } from './auth/auth.component';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { HomeLayoutComponent } from './layout/home-layout.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorizedToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'accounting', loadChildren: () => import('./pages/accounting/accounting.module').then(m => m.AccountingModule) },
      { path: 'condo', loadChildren: () => import('./pages/condo/condo.module').then(m => m.CondoModule) }
    ],
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: AuthComponent }
    ],
    ...canActivate(redirectAuthorizedToHome)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
