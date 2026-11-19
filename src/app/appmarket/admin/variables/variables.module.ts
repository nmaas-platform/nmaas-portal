import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {TableModule} from '@openng/optimus-ui/table';
import {MenuModule} from '@openng/optimus-ui/menu';
import {InputTextModule} from '@openng/optimus-ui/inputtext';
import {SelectModule} from '@openng/optimus-ui/select';
import {SharedModule} from '../../../shared/shared.module';
import {VariableListComponent} from './variablelist/variablelist.component';
import {IconField} from "@openng/optimus-ui/iconfield";
import {InputIcon} from "@openng/optimus-ui/inputicon";

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
