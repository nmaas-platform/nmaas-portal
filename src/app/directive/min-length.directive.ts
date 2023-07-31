import {Directive, Input} from '@angular/core';
import {UntypedFormControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
  selector: '[minNumLength]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinLengthDirective, multi: true}]
})
export class MinLengthDirective implements Validator{

  @Input('minNumLength')
  minLength: number = 0;

  validate(control: UntypedFormControl): {[key: string]: any | null} {
    return control.value < this.minLength ? {error: true} : null;
  }

}
