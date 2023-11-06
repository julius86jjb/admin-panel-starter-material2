import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent, BreadcrumbsComponent } from './layouts/index';

import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SharedAdminModule } from './shared/shared.module';
import { UserAvatarPipe } from './shared/pipes/user-avatar.pipe';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
  BreadcrumbsComponent
];

@NgModule({
  declarations: [
    ...APP_CONTAINERS,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedAdminModule,
  ],
  providers: [
    Title
  ],
  exports: [
    SharedAdminModule
  ]
})
export class AdminModule { }
