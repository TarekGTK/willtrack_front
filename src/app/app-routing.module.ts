import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { LayoutComponent } from './layouts/layout.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import {AdminGuard} from "./core/guards/admin.guard";
import {LayoutComponentUser} from "./layout-user/layout.component";
import { CondidatGuard } from './core/guards/condidat.guard';
import { RhGuard } from './core/guards/rh.guard';
import { RecruteurGuard } from './core/guards/recruteur.guard';


const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AdminGuard] },
  { path: 'User', component: LayoutComponentUser, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [CondidatGuard]  },
  { path: 'Company', component: LayoutComponentUser, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [RhGuard]  },
  { path: 'Staff', component: LayoutComponentUser, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [RecruteurGuard]  },
  { path: 'auth', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages',component: AuthlayoutComponent, loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule)/*,canActivate: [userGuard]*/},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
