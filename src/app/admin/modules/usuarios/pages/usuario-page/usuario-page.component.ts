import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Country } from 'src/app/admin/shared/modules/country/interfaces/country.interface';

import { ValidatorsService } from './../../../../../shared/services/validators.service';
import { CountriesService } from '../../../../shared/modules/country/services/countries.service';

import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/auth/interfaces';
import { Subscription, delay } from 'rxjs';
import { ModalImagenService } from 'src/app/admin/shared/services/modal-imagen.service';


@Component({
  templateUrl: './usuario-page.component.html',
  styleUrls: ['./usuario-page.component.scss']
})
export class UsuarioPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);
  private countriesService = inject(CountriesService);
  private modalImagenService = inject(ModalImagenService);
  private validatorsService = inject(ValidatorsService);
  private userService = inject(UserService);



  public user = signal<User | null>(null);

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    role: ['', [Validators.required]],
    country: ['', [Validators.required]],
    isActive: [true, [Validators.required]]
  })

  public countries: Country[] = [];
  public cargando = signal<boolean>(false);
  public imgSubs: Subscription = Subscription.EMPTY;


  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ id }) => {
        this.loadUser(id);
        this.loadCountries();
      });
    this.imgSubs = this.modalImagenService.nuevaImagen
      .subscribe((img) => {
        this.user.update((current: any) => {
          return {
            ...current,
            avatar: img
          };
        });
      });
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }


  getFieldError(field: string): string | null {
    const a = this.validatorsService.getFieldError(this.myForm, field);
    return this.validatorsService.getFieldError(this.myForm, field);
  }


  async loadUser(id: string) {
    this.cargando.set(true);
    await this.userService.getUserById(id)
      .subscribe((user: any) => {
        if (!user) this.router.navigateByUrl(`/admin/usuarios`);

        this.user.set(user);
        console.log(this.user())
        const { name, country, role, isActive } = user;
        country ? this.myForm.setValue({ name, role, country: user.country.cca2, isActive }) :
          this.myForm.setValue({ name, role, country: '', isActive });

        this.cargando.set(false);

      });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      Swal.fire('Error', 'Corrige los errores del formulario', 'error')
      return;
    }
    const updatedUser  = {
      ...this.myForm.value,
      _id: this.user()!._id
    }
    this.updateUser(updatedUser);

  }

  updateUser(user: User) {
    this.userService.update(user)
    .subscribe({
      next: (resp: any) => {
        Swal.fire('Done!', `User successfully updated`, 'success');
        this.router.navigateByUrl(`admin/usuarios`);
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }

  loadCountries(): void {
    this.countriesService.getAllCountries()
      .subscribe((countries: Country[]) => {
        this.countries = countries.sort((a, b) => {
          const nameA = a.name.common.toUpperCase();
          const nameB = b.name.common.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
      })
  }

  abrirModal(user: User) {
    this.modalImagenService.abrirModal(user.avatar, 'usuarios', user._id);
  }

}
