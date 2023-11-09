import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

import { Role, User } from 'src/app/auth/interfaces';

import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalImagenService } from '../../../../shared/services/modal-imagen.service';
import { CountriesService } from 'src/app/admin/shared/modules/country/services/countries.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public Role = Role;

  private authService = inject(AuthService);
  private modalImagenService = inject(ModalImagenService);
  public countriesServices = inject(CountriesService);

  public cargando = signal<boolean>(false);
  public imgSubs: Subscription = Subscription.EMPTY;

  constructor(private userService: UserService) {

  }

  get users() {
    return this.userService.users()
  }


  get currentPage() {
    return this.userService.currentPage()
  }

  get currentUser() {
    return this.authService.currentUser()
  }

  get totalUsers() {
    return this.userService.totalUsers()
  }

  get totalPages() {
    return this.userService.totalPages()
  }

  ngOnInit(): void {
    this.loadPage(this.currentPage)
    this.imgSubs = this.modalImagenService.nuevaImagen
      // .pipe(delay(100))
      .subscribe(img => {
        this.loadPage(this.currentPage)
      });

  }


  loadPage(page: number) {
    this.cargando.set(true);
    this.userService.loadPage(page)
    .subscribe({
      next: () => this.cargando.set(false),
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }

  updateUser(user: User) {
    this.cargando.set(true);
    this.userService.saveUser(user)
    .subscribe({
      next: (resp) => {
        this.loadPage(this.currentPage)
        this.cargando.set(false)
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }

  onSearch(value: string, page: number) {
    this.cargando.set(true);
    this.userService.loadPage(page, value)
    .subscribe({
      next: () => this.cargando.set(false),
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }

  abrirModal(user: User) {
    if (this.authService.currentUser()!.role === Role.SuperAdmin)
      this.modalImagenService.abrirModal(user.avatar, 'usuarios', user._id);
  }

  onDelete(user: User) {
    Swal.fire({
      title: 'Delete User?',
      text: `You are about to delete '${user.name}'`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {

        this.userService.deleteUser(user._id)
        .subscribe({
          next: (user: User) => {

            this.loadPage(this.currentPage)
            Swal.fire(
              'User Deleted',
              `'${user.name}' succefully deleted`,
              'success'
            );

          },
          error: (message) => {
            Swal.fire('Error', message, 'error')
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}

