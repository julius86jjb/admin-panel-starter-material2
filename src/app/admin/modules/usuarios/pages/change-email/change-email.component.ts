import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/auth/interfaces';

import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { UserService } from '../../services/user.service';
import { EmailValidator } from 'src/app/shared/validators/email-validator.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';

@Component({
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  private activatedRoute = inject(ActivatedRoute);
  private validatorsService = inject(ValidatorsService);
  private userService = inject(UserService);




  public user = signal<User | null>(null);
  public cargando = signal<boolean>(false);

  public myForm: FormGroup = this.fb.group({
    oldEmail: [{value:'', readonly: true}, [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)], [new EmailValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ id }) => this.loadUser(id));
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }


  getFieldError(field: string): string | null {
    const a = this.validatorsService.getFieldError(this.myForm, field);
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  loadUser(id: string) {
    this.cargando.set(true);
    this.userService.getUserById(id)
      .pipe(
        delay(100)
      )
      .subscribe((user: any) => {
        if (!user) {
          this.router.navigateByUrl(`/admin/usuarios`);
        }
        this.user.set(user);
        this.myForm.patchValue({ oldEmail: user.email});
        this.myForm.controls['oldEmail'].disable();
        this.cargando.set(false);
      });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const {oldEmail, email, password} = this.myForm.getRawValue();

    this.userService.changeEmail(this.user()!._id, oldEmail, password, email)
    .subscribe({
      next: (resp: any) => {
        Swal.fire('Done!', `User email successfully updated`, 'success');
        this.router.navigateByUrl(`admin/usuarios/${resp._id}`);
      },
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })

    // console.log(this.myForm.value);
    // const updatedUser  = {
    //   ...this.myForm.value,
    //   _id: this.user()!._id
    // }
    // console.log(updatedUser);
    // this.updateUser(updatedUser);

  }



}
