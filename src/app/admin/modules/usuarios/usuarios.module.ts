import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { SharedAdminModule } from '../../shared/shared.module';
import { IsActivePipe } from './pipes/isActive.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { CountryModule } from '../../shared/modules/country/country.module';

import { UsuariosComponent } from './pages/listado/usuarios.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';



@NgModule({
  declarations: [
    UsuariosComponent,
    UsuarioPageComponent,
    IsActivePipe,
    NuevoComponent,
    ChangeEmailComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SharedAdminModule,
    SharedModule,
    FormsModule,
    CountryModule,
  ]
})
export class UsuariosModule { }
