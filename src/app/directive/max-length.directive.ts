import {Directive, Input} from '@angular/core';
import {UntypedFormControl, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
    selector: '[maxNumLength]',
    providers: [{provide: NG_VALIDATORS, useExisting: MaxLengthDirective, multi: true}]
})
export class MaxLengthDirective implements Validator{

    @Input('maxNumLength')
    maxLength: number = 0;

    validate(control: UntypedFormControl): {[key: string]: any | null} {
        return control.value > this.maxLength ? {error: true} : null;
    }

}