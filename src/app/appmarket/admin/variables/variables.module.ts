import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {MenuModule} from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {SharedModule} from '../../../shared/shared.module';
import {VariableListComponent} from './variablelist/variablelist.component';
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";

@NgModule({
    declarations: [VariableListComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        TranslateModule,
        TableModule,
        MenuModule,
        InputTextModule,
        SelectModule,
        IconField,
        InputIcon
    ],
    exports: [VariableListComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class VariablesModule {
}
