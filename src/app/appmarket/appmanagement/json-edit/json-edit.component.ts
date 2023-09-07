import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors} from '@angular/forms';

export function jsonValidator(control: AbstractControl): ValidationErrors | null {

  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
}

@Component({
  selector: 'app-json-edit',
  templateUrl: './json-edit.component.html',
  styleUrls: []
})
export class JsonEditComponent {

  public objectForm = new UntypedFormGroup(
      {content: new UntypedFormControl('', jsonValidator)}
  );

  @Output()
  public objectChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set object(obj: any) {
    console.log('setting value')
    const contentString = JSON.stringify(obj, null, 2);
    if (this.content && contentString !== this.content.value) {
      this.content.setValue(contentString)
    }
  }

  constructor() {
    this.objectForm.valueChanges.subscribe(
        value => {
          console.log('json value update', this.objectForm.valid, value)
          if (this.content.valid) {
            this.objectChange.emit(JSON.parse(value.content))
          }
        }
    )
  }

  get content(): AbstractControl {
    return this.objectForm.get('content')
  }

}
