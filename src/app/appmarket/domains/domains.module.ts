import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PipesModule} from '../../pipe/pipes.module';

import {AuthModule} from '../../auth/auth.module';
import {SharedModule} from '../../shared/shared.module';

import {DomainsListComponent} from './list/domainslist.component';
import {DomainComponent} from './domain/domain.component';

import {DomainService} from '../../service/domain.service';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {SearchDomainPipe} from './domain-search.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';



@NgModule({
  declarations: [
    DomainsListComponent,
    DomainComponent,
      SearchDomainPipe
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedModule,
        AuthModule,
        PipesModule,
        TranslateModule.forChild(),
        InputTextModule,
        NgxPaginationModule,
        TableModule,
        CheckboxModule
    ],
  exports: [
    DomainsListComponent,
      SearchDomainPipe
  ],
  providers: [
    DomainService,
  ]

})
export class DomainsModule {}
