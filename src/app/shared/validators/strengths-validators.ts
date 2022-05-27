import { FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

export function containsSpecialCharacter()
{
  return (control: AbstractControl): ValidationErrors | null => {
    //const forbidden = nameRe.test(control.value);
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //const control = formGroup.controls[controlName];
    /*
    if (control.errors && control.value && control.value.length > 6) {
        // return if another validator has already found an error on the matchingControl
        return;
    }

    if(!format.test(control.value))
    {
      control.setErrors({ specialCharacter: true });
    }
    else
    {
      control.setErrors(null);
    }*/

    return !format.test(control.value) ? {specialCharacter: {value: control.value}} : null;
  };
}

export function containsMayus()
{
  return (control: AbstractControl): ValidationErrors | null =>
  {
    //const forbidden = nameRe.test(control.value);
    const format = /[A-Z]/;
    //const control = formGroup.controls[controlName];
    /*
    if (control.errors && control.value && control.value.length > 6) {
        // return if another validator has already found an error on the matchingControl
        return;
    }*/

    return !format.test(control.value) ? {upperCase: {value: control.value}} : null;
  };
}

export function containsNumber()
{

  return (control: AbstractControl): ValidationErrors | null =>
  {
    //const forbidden = nameRe.test(control.value);
    const format = /[0-9]/;
    //const control = formGroup.controls[controlName];
    /*
    if (control.errors && control.value && control.value.length > 6) {
        // return if another validator has already found an error on the matchingControl
        return;
    }*/

    return !format.test(control.value) ? {containsNumber: {value: control.value}} : null;
  };
}
