import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PipesModule} from '../../pipe/pipes.module';

import {AuthModule} from '../../auth/auth.module';
import {SharedModule} from '../../shared/shared.module';

import {AppListComponent} from './applist.component';

import {AppsService} from '../../service/apps.service';
import {TagService} from '../../service/tag.service';


@NgModule({
  declarations: [
    AppListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    AuthModule,
    PipesModule,
  ],
  exports: [
    AppListComponent
  ],
  providers: [
    AppsService,
    TagService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppListModule {}
