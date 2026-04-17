import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceUnavailableComponent } from './service-unavailable.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {PrimeTemplate} from 'primeng/api';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ServiceUnavailableComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        PrimeTemplate,
        SelectModule,
        FormsModule
    ],
  exports: [
  ]
})
export class ServiceUnavailableModule { }
