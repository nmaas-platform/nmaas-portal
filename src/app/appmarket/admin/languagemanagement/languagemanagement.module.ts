import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageListComponent } from './languagelist/languagelist.component';
import { LanguageDetailsComponent } from './languagedetails/languagedetails.component';
import {InternationalizationService} from '../../../service/internationalization.service';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared';
import {FormsModule} from '@angular/forms';
import {TableModule} from '@openng/optimus-ui/table';
import {TextareaModule } from '@openng/optimus-ui/textarea';
import {MenuModule} from '@openng/optimus-ui/menu';
import {ToggleSwitchModule} from '@openng/optimus-ui/toggleswitch';

@NgModule({
  declarations: [LanguageListComponent, LanguageDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
        ToggleSwitchModule,
        RouterModule,
        SharedModule,
        TranslateModule,
        TableModule,
        TextareaModule,
        MenuModule
    ],
  providers: [InternationalizationService],
       schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

})
export class LanguageManagementModule { }
