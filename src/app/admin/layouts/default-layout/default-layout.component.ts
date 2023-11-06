import { Component, OnInit, inject, signal } from '@angular/core';
import { SidebarMenuServiceTsService } from '../../shared/services/sidebar-menu.service.ts.service';
import { INavData } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = signal<INavData[]>([]);

  sidebarMenuServiceTsService = inject(SidebarMenuServiceTsService);

  ngOnInit(): void {
    this.sidebarMenuServiceTsService.loadMenu();
    this.navItems.set(this.sidebarMenuServiceTsService.menu())
  }
}
