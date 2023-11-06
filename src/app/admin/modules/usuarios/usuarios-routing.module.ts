import { NuevoComponent } from './pages/nuevo/nuevo.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosComponent } from './pages/listado/usuarios.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AdminGuard } from '../../guards/admin.guard';
import { LoggedOrSuperAdminGuard} from '../../guards/logged-or-super-admin.guard';
import { SuperAdminGuard } from '../../guards/super-admin.guard';

const routes: Routes = [
  { path: '', canActivate: [AdminGuard], component: UsuariosComponent, data: { title: 'Users List' } },
  { path: 'nuevo', canActivate: [SuperAdminGuard],  component: NuevoComponent, data: { title: 'New User' } },
  { path: ':id', canActivate: [LoggedOrSuperAdminGuard], component: UsuarioPageComponent, data: { title: 'Edit User' } },
  { path: 'change-email/:id', canActivate: [ LoggedOrSuperAdminGuard], component: ChangeEmailComponent, data: { title: 'Change Email' } },
  { path: 'change-password/:id', canActivate: [LoggedOrSuperAdminGuard], component: ChangePasswordComponent, data: { title: 'Change Password' } },
  { path: '**', redirectTo: '/usuarios' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
