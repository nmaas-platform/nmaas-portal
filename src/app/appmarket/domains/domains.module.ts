import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import {DomainGroupsComponent} from './domain-groups/domain-groups.component';
import {DomainGroupViewComponent} from './domain-group-view/domain-group-view.component';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {RemovalConfirmationModalComponent} from './modals/removal-confirmation-modal/removal-confirmation-modal.component';
import {SearchDomainGroupPipe} from './domain-group-search.pipe';
import { DomainAnnotationsComponent } from './domain-annotations/domain-annotations.component';


@NgModule({
  declarations: [
    DomainsListComponent,
    DomainComponent,
      SearchDomainPipe,
    DomainGroupsComponent,
    DomainGroupViewComponent,
    RemovalConfirmationModalComponent,
      SearchDomainGroupPipe,
      DomainAnnotationsComponent
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
        CheckboxModule,
      DropdownModule,
      MultiSelectModule
    ],
    exports: [
        DomainsListComponent,
        SearchDomainPipe,
        SearchDomainGroupPipe,
        RemovalConfirmationModalComponent
    ],
  providers: [
    DomainService,
  ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class DomainsModule {}
