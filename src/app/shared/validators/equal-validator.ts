import { FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatching: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newpassword');
  const confirmPassword = control.get('repeatnewpassword');

  console.log(password?.value == confirmPassword?.value);

  return password?.value == confirmPassword?.value ? null : { mustMatch: true };
};
