import { NgModule } from '@angular/core';
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
import {InputTextareaModule} from 'primeng/inputtextarea';

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
        InputTextareaModule
    ],
  providers: [InternationalizationService]
})
export class LanguageManagementModule { }
