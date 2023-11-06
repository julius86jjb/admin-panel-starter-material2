import { Injectable, OnInit, computed, signal } from '@angular/core';
import { INavData } from '@coreui/angular';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuServiceTsService {

  private _menu = signal([])
  public menu = computed( () => this._menu() )

  public menu2 = []

  loadMenu() {
    this._menu.set(JSON.parse(localStorage.getItem('menu')!))
  }

}
