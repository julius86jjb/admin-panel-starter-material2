import { NgModule } from '@angular/core';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TableModule,
  TabsModule,
  UtilitiesModule,
  WidgetModule,
  PaginationModule,
  ModalModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Title } from '@angular/platform-browser';
import { ModalImagenComponent } from './components/modal-imagen/modal-imagen.component';
import { CommonModule } from '@angular/common';
import { UserAvatarPipe } from './pipes/user-avatar.pipe';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    WidgetModule,
    TableModule,
    PaginationModule,
    ModalModule,
    ReactiveFormsModule
  ],
  exports: [
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    IconModule,
    ListGroupModule,
    ListGroupModule,
    NavModule,
    NgScrollbarModule,
    PaginationModule,
    ProgressModule,
    SharedModule,
    SidebarModule,
    SidebarModule,
    TableModule,
    TabsModule,
    UtilitiesModule,
    WidgetModule,
    ModalModule,
    ModalImagenComponent,
    UserAvatarPipe,
    ReactiveFormsModule
  ],
  declarations: [
    ModalImagenComponent,
    UserAvatarPipe
  ],
  providers: [
    Title
  ],
})
export class SharedAdminModule { }
