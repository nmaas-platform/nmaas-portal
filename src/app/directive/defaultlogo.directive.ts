import {Directive, Input, ElementRef, NgZone} from '@angular/core';

@Directive({
    selector: 'img[defaultLogo]',
    host: {
        '(error)': 'updateUrl()',
        '[src]': 'src'
    },
    standalone: false
})
export class DefaultLogo {
  @Input() src: string;
  @Input() defaultLogo: string;


  constructor(private el: ElementRef, private ngZone: NgZone) {
  }

  updateUrl() {
    this.src = this.defaultLogo;
  }
}
