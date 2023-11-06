import { Component, Input, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Subscription, delay } from 'rxjs';
import { ModalImagenService } from 'src/app/admin/shared/services/modal-imagen.service';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {

  @Input() sidebarId: string = "sidebar";

  private authService = inject(AuthService);

  private modalImagenService = inject(ModalImagenService);

  public imgSubs: Subscription = Subscription.EMPTY;

  public currentUser = this.authService.currentUser();

  constructor(private classToggler: ClassToggleService) {
    super();
  }
  ngOnInit(): void {

    this.imgSubs = this.modalImagenService.nuevaImagenHeader
      .subscribe(img => {
        this.currentUser!.avatar = img
      });
  }


  onLogout() {
    this.authService.logout();
  }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}
