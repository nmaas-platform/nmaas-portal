import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageListComponent } from './languagelist/languagelist.component';
import { LanguageDetailsComponent } from './languagedetails/languagedetails.component';
import {InternationalizationService} from '../../../service/internationalization.service';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared';
import {FormsModule} from '@angular/forms';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TableModule} from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

@NgModule({
  declarations: [LanguageListComponent, LanguageDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
        InputSwitchModule,
        RouterModule,
        SharedModule,
        TranslateModule.forChild(),
        TableModule,
        TextareaModule
    ],
  providers: [InternationalizationService],
       schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

})
export class LanguageManagementModule { }
