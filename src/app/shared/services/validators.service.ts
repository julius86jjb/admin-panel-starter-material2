import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  public isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched
  }


  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    if (Object.keys(errors).includes('pattern') && field === 'nombre') return `Enter your first and last name`
    if (Object.keys(errors).includes('pattern') && field === 'email') return `Incorrect email format`

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required'
        case 'minlength':
          return `Enter at least ${errors['minlength'].requiredLength} characters`
        case 'emailTaken':
          return `This email is already registered`
        case 'notEqual':
          return `Passwords do not match`
        case 'EqualPassword':
          return 'This is already your current password'

      }
    }
    return null;
  }

  public static removeErrors(keys: string[], control: AbstractControl) {

    if (!control || !keys || keys.length === 0) {
      return;
    }

    const remainingErrors = keys.reduce((errors, key) => {
      delete errors[key];
      return errors;
    }, { ...control.errors });

    control.setErrors(remainingErrors);

    if (Object.keys(control.errors || {}).length === 0) {
      control.setErrors(null);
    }
  }


  public static addErrors(errors: { [key: string]: any }, control: AbstractControl) {

    if (!control || !errors) {
      return;
    }
    control.setErrors({ ...control.errors, ...errors });


  }

  public isFieldOneEqualFieldTwo(field1: string, field2: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {


      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        ValidatorsService.addErrors({ notEqual: true }, formGroup.get(field2)!)
        // console.log(formGroup.get(field1)?.errors);
        // console.log(formGroup.get(field2)?.errors);
        // formGroup.get(field2)?.setErrors({notEqual: true})
        return {
          notEqual: true
        }
      }
      ValidatorsService.removeErrors(['notEqual'], formGroup.get(field2)!)

      // formGroup.get(field2)?.setErrors(null)
      return null;
    }
  }

  public isFieldOneNotEqualFieldTwo(field1: string, field2: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {


      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 === fieldValue2) {
        ValidatorsService.addErrors({ EqualPassword: true }, formGroup.get(field2)!)
        // console.log(formGroup.get(field1)?.errors);
        // console.log(formGroup.get(field2)?.errors);
        // formGroup.get(field2)?.setErrors({notEqual: true})
        return {
          EqualPassword: true
        }
      }
      ValidatorsService.removeErrors(['EqualPassword'], formGroup.get(field2)!)

      // formGroup.get(field2)?.setErrors(null)
      return null;
    }
  }
}
