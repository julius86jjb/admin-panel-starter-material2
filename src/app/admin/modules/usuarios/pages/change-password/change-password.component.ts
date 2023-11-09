
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/auth/interfaces';

import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';


@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  private activatedRoute = inject(ActivatedRoute);
  private validatorsService = inject(ValidatorsService);
  private userService = inject(UserService);




  public user = signal<User | null>(null);
  public cargando = signal<boolean>(false);

  public myForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required]],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('newPassword', 'confirm_password'),
      this.validatorsService.isFieldOneNotEqualFieldTwo('password', 'newPassword'),
    ]
  })


  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ id }) => this.loadUser(id));
  }

  loadUser(id: string) {
    this.cargando.set(true);
    this.userService.getUserById(id)
      .pipe(
        delay(100)
      )
      .subscribe({
        next: (user: any) => {
          if (!user) {
            this.router.navigateByUrl(`/admin/usuarios`);
          }
          this.user.set(user);
          this.cargando.set(false);
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
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
      return;
    }
    const {password, newPassword} = this.myForm.value;

    this.userService.changePassword(this.user()!._id, this.user()!.email, password, newPassword)
    .subscribe({
      next: (resp: any) => {
        Swal.fire('Done!', `Password successfully updated`, 'success');
        this.router.navigateByUrl(`admin/usuarios/${resp._id}`);
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }
}
