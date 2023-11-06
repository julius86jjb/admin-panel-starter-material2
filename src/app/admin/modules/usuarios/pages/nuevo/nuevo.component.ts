
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Country, LittleCountry } from 'src/app/admin/shared/modules/country/interfaces/country.interface';
import { User } from 'src/app/auth/interfaces';

import { CountriesService } from 'src/app/admin/shared/modules/country/services/countries.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { UserService } from '../../services/user.service';
import { EmailValidator } from 'src/app/shared/validators/email-validator.service';
import { ModalImagenService } from '../../../../shared/services/modal-imagen.service';




@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})
export class NuevoComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  private countriesService = inject(CountriesService);
  private validatorsService = inject(ValidatorsService);
  private userService = inject(UserService);
  private modalImagenService = inject(ModalImagenService);

  public countries: Country[] = [];


  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)], [new EmailValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    country: ['', [Validators.required]],
    isActive: [ true , [Validators.required]]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirm_password')
    ]
  })




  ngOnInit(): void {
    this.loadCountries();
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }


  getFieldError(field: string): string | null {
    const a = this.validatorsService.getFieldError(this.myForm, field);
    return this.validatorsService.getFieldError(this.myForm, field);
  }


  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      Swal.fire('Error', 'Corrige los errores del formulario', 'error')
      return;
    }
    const { confirm_password,  ...newUser } = this.myForm.value
    this.createUser(newUser);

  }

  createUser(user: any) {

    this.userService.create(user)
    .subscribe({
      next: (resp: any) => {
        Swal.fire('Done!', `User successfully created`, 'success');
        this.router.navigateByUrl(`admin/usuarios/${resp.user._id}`);
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }

  loadCountries(): void {
    this.countriesService.getAllCountriesLittle()
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

}
