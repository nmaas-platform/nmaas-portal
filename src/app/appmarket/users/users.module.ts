import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PipesModule} from '../../pipe/pipes.module';

import {AuthModule} from '../../auth/auth.module';
import {SharedModule} from '../../shared/shared.module';

import {UsersListComponent} from './list/userslist.component';
import {UserDetailsComponent} from './userdetails/userdetails.component';

import {UserService} from '../../service/user.service';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [
        UsersListComponent,
        UserDetailsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TranslateModule.forChild()
    ],
    exports: [
        UsersListComponent,
    ],
    providers: [
        UserService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class UsersModule {
}
